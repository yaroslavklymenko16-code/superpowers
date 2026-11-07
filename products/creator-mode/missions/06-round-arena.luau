--[[
	CREATOR QUEST · MISSION 6 · ROUND ARENA
	A real minigame game loop: lobby -> countdown -> teleport -> survive -> winner!
	Two modes picked at random: FALLING TILES and RISING LAVA.
	Everyone sees a timer on their screen.

	HOW TO USE: New Baseplate place -> ServerScriptService -> + -> Script. Paste, press Play.
	Works solo (survive the timer to win) and with friends (last one standing wins).
]]

local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")

-- SETTINGS
local INTERMISSION = 10
local ROUND_TIME = 60
local ARENA_HEIGHT = 80
local TILE = 6
local TILES_ACROSS = 10

local world = Instance.new("Folder")
world.Name = "RoundArena"
world.Parent = workspace

-- LOBBY
local lobby = Instance.new("SpawnLocation")
lobby.Name = "Lobby"
lobby.Anchored = true
lobby.Size = Vector3.new(30, 1, 30)
lobby.Position = Vector3.new(0, 1, 0)
lobby.Color = Color3.fromRGB(90, 200, 255)
lobby.Material = Enum.Material.SmoothPlastic
lobby.Duration = 0
lobby.Parent = world

-- SCREEN TEXT for every player
local function setStatus(text)
	for _, player in ipairs(Players:GetPlayers()) do
		local gui = player:FindFirstChild("PlayerGui")
		local screen = gui and gui:FindFirstChild("ArenaGui")
		if screen then
			screen.Status.Text = text
		end
	end
end

Players.PlayerAdded:Connect(function(player)
	local stats = Instance.new("Folder")
	stats.Name = "leaderstats"
	stats.Parent = player
	local wins = Instance.new("IntValue")
	wins.Name = "Wins"
	wins.Parent = stats

	local screen = Instance.new("ScreenGui")
	screen.Name = "ArenaGui"
	screen.ResetOnSpawn = false
	local status = Instance.new("TextLabel")
	status.Name = "Status"
	status.Size = UDim2.new(0.6, 0, 0, 60)
	status.Position = UDim2.new(0.2, 0, 0, 10)
	status.BackgroundColor3 = Color3.fromRGB(20, 25, 40)
	status.BackgroundTransparency = 0.25
	status.TextColor3 = Color3.new(1, 1, 1)
	status.Font = Enum.Font.FredokaOne
	status.TextScaled = true
	status.Text = "Waiting..."
	status.Parent = screen
	local corner = Instance.new("UICorner")
	corner.CornerRadius = UDim.new(0, 12)
	corner.Parent = status
	screen.Parent = player:WaitForChild("PlayerGui")
end)

local arena = nil

local function buildTiles()
	arena = Instance.new("Folder")
	arena.Name = "Arena"
	arena.Parent = world
	local half = (TILES_ACROSS * TILE) / 2
	for x = 0, TILES_ACROSS - 1 do
		for z = 0, TILES_ACROSS - 1 do
			local tile = Instance.new("Part")
			tile.Name = "Tile"
			tile.Anchored = true
			tile.Size = Vector3.new(TILE - 0.2, 1, TILE - 0.2)
			tile.Position = Vector3.new(-half + x * TILE + TILE / 2, ARENA_HEIGHT, -half + z * TILE + TILE / 2)
			tile.Color = Color3.fromHSV(((x + z) % 10) / 10, 0.6, 1)
			tile.Material = Enum.Material.SmoothPlastic
			tile.Parent = arena
		end
	end
end

local function startFallingTiles()
	for _, tile in ipairs(arena:GetChildren()) do
		local falling = false
		tile.Touched:Connect(function(hit)
			if falling or not hit.Parent:FindFirstChildOfClass("Humanoid") then
				return
			end
			falling = true
			tile.Color = Color3.fromRGB(255, 80, 40)
			task.wait(0.6)
			tile.Anchored = false
			tile.CanCollide = false
			task.wait(2)
			tile:Destroy()
		end)
	end
end

local function startRisingLava()
	local half = (TILES_ACROSS * TILE) / 2
	-- extra steps to climb
	for i = 1, 25 do
		local step = Instance.new("Part")
		step.Name = "Step"
		step.Anchored = true
		step.Size = Vector3.new(5, 1, 5)
		step.Position = Vector3.new(math.random(-half, half), ARENA_HEIGHT + i * 3.5, math.random(-half, half))
		step.Color = Color3.fromRGB(240, 240, 255)
		step.Parent = arena
	end
	local lava = Instance.new("Part")
	lava.Name = "Lava"
	lava.Anchored = true
	lava.CanCollide = false
	lava.Size = Vector3.new(TILES_ACROSS * TILE + 20, 2, TILES_ACROSS * TILE + 20)
	lava.Position = Vector3.new(0, ARENA_HEIGHT - 6, 0)
	lava.Color = Color3.fromRGB(255, 90, 20)
	lava.Material = Enum.Material.Neon
	lava.Parent = arena
	lava.Touched:Connect(function(hit)
		local hum = hit.Parent and hit.Parent:FindFirstChildOfClass("Humanoid")
		if hum then
			hum.Health = 0
		end
	end)
	TweenService:Create(lava, TweenInfo.new(ROUND_TIME, Enum.EasingStyle.Linear), {
		Position = lava.Position + Vector3.new(0, 25 * 3.5 + 8, 0),
	}):Play()
end

local function alivePlayers(list)
	local alive = {}
	for _, player in ipairs(list) do
		local char = player.Character
		local hum = char and char:FindFirstChildOfClass("Humanoid")
		local root = char and char:FindFirstChild("HumanoidRootPart")
		if hum and root and hum.Health > 0 and root.Position.Y > ARENA_HEIGHT - 20 then
			table.insert(alive, player)
		end
	end
	return alive
end

-- THE GAME LOOP
while true do
	while #Players:GetPlayers() == 0 do
		task.wait(1)
	end

	for t = INTERMISSION, 1, -1 do
		setStatus("Next round in " .. t)
		task.wait(1)
	end

	if arena then
		arena:Destroy()
	end
	buildTiles()
	local modes = { "FALLING TILES", "RISING LAVA" }
	local mode = modes[math.random(1, #modes)]

	local playing = {}
	for _, player in ipairs(Players:GetPlayers()) do
		local char = player.Character
		if char and char:FindFirstChild("HumanoidRootPart") then
			char:PivotTo(CFrame.new(math.random(-20, 20), ARENA_HEIGHT + 5, math.random(-20, 20)))
			table.insert(playing, player)
		end
	end

	setStatus(mode .. "!")
	task.wait(2)
	if mode == "FALLING TILES" then
		startFallingTiles()
	else
		startRisingLava()
	end

	local soloRound = #playing == 1
	local timeLeft = ROUND_TIME
	while timeLeft > 0 do
		local alive = alivePlayers(playing)
		if #alive == 0 then
			break
		end
		if not soloRound and #alive == 1 then
			break
		end
		setStatus(mode .. "  ·  " .. timeLeft .. "s  ·  " .. #alive .. " alive")
		task.wait(1)
		timeLeft -= 1
	end

	local winners = alivePlayers(playing)
	if #winners == 0 then
		setStatus("Nobody survived!")
	else
		local names = {}
		for _, player in ipairs(winners) do
			player.leaderstats.Wins.Value += 1
			table.insert(names, player.DisplayName)
		end
		setStatus("Winner: " .. table.concat(names, ", ") .. "!")
	end
	task.wait(3)

	for _, player in ipairs(playing) do
		if player.Character then
			player.Character:PivotTo(lobby.CFrame + Vector3.new(0, 4, 0))
		end
	end
end
