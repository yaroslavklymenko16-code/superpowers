--[[
	CREATOR QUEST · MISSION 1 · LAVA TOWER
	Builds a 25-stage rainbow obby that spirals up out of a lava lake.
	Has elevators, spinning lasers, vanishing blocks, checkpoints and a winner's pad.

	HOW TO USE: New Baseplate place -> Explorer -> ServerScriptService -> + -> Script.
	Paste all of this in, then press Play.
]]

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local TweenService = game:GetService("TweenService")

-- SETTINGS: change these and press Play again!
local STAGES = 25           -- how many jumps
local RADIUS = 32           -- how wide the spiral is
local STEP_UP = 4           -- how high each jump goes
local STEP_ANGLE = 0.4      -- how far around the spiral each jump goes
local PLATFORM_SIZE = 9
local CHECKPOINT_EVERY = 5

local tower = Instance.new("Folder")
tower.Name = "LavaTower"
tower.Parent = workspace

-- Remove the default spawn so nobody starts inside the lava
for _, obj in ipairs(workspace:GetDescendants()) do
	if obj:IsA("SpawnLocation") then
		obj:Destroy()
	end
end

local function makePart(name, size, cframe, color, material)
	local part = Instance.new("Part")
	part.Name = name
	part.Anchored = true
	part.Size = size
	part.CFrame = cframe
	part.Color = color
	part.Material = material or Enum.Material.SmoothPlastic
	part.TopSurface = Enum.SurfaceType.Smooth
	part.BottomSurface = Enum.SurfaceType.Smooth
	part.Parent = tower
	return part
end

local function makeDeadly(part)
	part.Touched:Connect(function(hit)
		local humanoid = hit.Parent and hit.Parent:FindFirstChildOfClass("Humanoid")
		if humanoid then
			humanoid.Health = 0
		end
	end)
end

-- LEADERBOARD: Stage and Wins
Players.PlayerAdded:Connect(function(player)
	local stats = Instance.new("Folder")
	stats.Name = "leaderstats"
	stats.Parent = player

	local stage = Instance.new("IntValue")
	stage.Name = "Stage"
	stage.Parent = stats

	local wins = Instance.new("IntValue")
	wins.Name = "Wins"
	wins.Parent = stats

	local checkpoint = Instance.new("ObjectValue")
	checkpoint.Name = "Checkpoint"
	checkpoint.Parent = player

	-- When you respawn, go back to your last checkpoint
	player.CharacterAdded:Connect(function(character)
		local root = character:WaitForChild("HumanoidRootPart", 5)
		task.wait(0.1)
		if root and checkpoint.Value then
			character:PivotTo(checkpoint.Value.CFrame + Vector3.new(0, 4, 0))
		end
	end)
end)

-- THE LAVA LAKE
local lava = makePart("Lava", Vector3.new(260, 2, 260), CFrame.new(0, 1, 0), Color3.fromRGB(255, 80, 20), Enum.Material.Neon)
makeDeadly(lava)

-- START PLATFORM with the only spawn point
local startPos = Vector3.new(RADIUS, 4, 0)
local spawn = Instance.new("SpawnLocation")
spawn.Name = "Start"
spawn.Anchored = true
spawn.Size = Vector3.new(14, 1, 14)
spawn.CFrame = CFrame.new(startPos)
spawn.Color = Color3.fromRGB(255, 255, 255)
spawn.Material = Enum.Material.SmoothPlastic
spawn.Duration = 0
spawn.Parent = tower

-- STAGE BUILDERS
local function normalPlatform(cf, color)
	return makePart("Platform", Vector3.new(PLATFORM_SIZE, 1, PLATFORM_SIZE), cf, color)
end

local function elevatorPlatform(cf, color)
	local p = normalPlatform(cf, color)
	p.Material = Enum.Material.Neon
	local info = TweenInfo.new(2, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut, -1, true)
	TweenService:Create(p, info, { CFrame = cf + Vector3.new(0, 3, 0) }):Play()
	return p
end

local function laserPlatform(cf, color)
	local p = normalPlatform(cf, color)
	local laser = makePart("Laser", Vector3.new(PLATFORM_SIZE - 1, 0.6, 0.6), cf + Vector3.new(0, 1.6, 0), Color3.fromRGB(255, 0, 60), Enum.Material.Neon)
	laser.CanCollide = false
	makeDeadly(laser)
	RunService.Heartbeat:Connect(function(dt)
		laser.CFrame = laser.CFrame * CFrame.Angles(0, dt * 2.2, 0)
	end)
	return p
end

local function vanishingPlatform(cf, color)
	local p = normalPlatform(cf, color)
	p.Material = Enum.Material.Glass
	p.Transparency = 0.2
	local busy = false
	p.Touched:Connect(function(hit)
		if busy or not hit.Parent:FindFirstChildOfClass("Humanoid") then
			return
		end
		busy = true
		for i = 1, 5 do
			p.Transparency = 0.2 + i * 0.15
			task.wait(0.15)
		end
		p.CanCollide = false
		task.wait(2)
		p.CanCollide = true
		p.Transparency = 0.2
		busy = false
	end)
	return p
end

local function makeCheckpoint(platform, stageNumber)
	platform.Material = Enum.Material.Neon
	platform.Color = Color3.fromRGB(80, 255, 120)
	local flagPole = makePart("FlagPole", Vector3.new(0.4, 6, 0.4), platform.CFrame * CFrame.new(PLATFORM_SIZE / 2 - 1, 3.5, 0), Color3.fromRGB(240, 240, 240))
	flagPole.CanCollide = false
	local flag = makePart("Flag", Vector3.new(0.2, 2, 3), flagPole.CFrame * CFrame.new(0, 2, 1.5), Color3.fromRGB(80, 255, 120), Enum.Material.Neon)
	flag.CanCollide = false

	platform.Touched:Connect(function(hit)
		local player = Players:GetPlayerFromCharacter(hit.Parent)
		if player and player:FindFirstChild("leaderstats") then
			local stage = player.leaderstats.Stage
			if stage.Value < stageNumber then
				stage.Value = stageNumber
				player.Checkpoint.Value = platform
			end
		end
	end)
end

-- BUILD THE SPIRAL
for i = 1, STAGES do
	local angle = i * STEP_ANGLE
	local pos = Vector3.new(math.cos(angle) * RADIUS, 4 + i * STEP_UP, math.sin(angle) * RADIUS)
	local cf = CFrame.new(pos) * CFrame.Angles(0, -angle, 0)
	local color = Color3.fromHSV((i / STAGES) * 0.85, 0.75, 1)

	local platform
	if i % CHECKPOINT_EVERY == 0 then
		platform = normalPlatform(cf, color)
		makeCheckpoint(platform, i)
	elseif i % 4 == 1 then
		platform = normalPlatform(cf, color)
	elseif i % 4 == 2 then
		platform = elevatorPlatform(cf, color)
	elseif i % 4 == 3 then
		platform = laserPlatform(cf, color)
	else
		platform = vanishingPlatform(cf, color)
	end
	platform.Name = "Stage" .. i
end

-- WINNER'S PAD at the top
local topAngle = (STAGES + 1) * STEP_ANGLE
local topPos = Vector3.new(math.cos(topAngle) * RADIUS, 4 + (STAGES + 1) * STEP_UP, math.sin(topAngle) * RADIUS)
local winPad = makePart("WinPad", Vector3.new(14, 1, 14), CFrame.new(topPos), Color3.fromRGB(255, 210, 40), Enum.Material.Neon)
local sparkles = Instance.new("Sparkles")
sparkles.Parent = winPad
local light = Instance.new("PointLight")
light.Range = 30
light.Brightness = 3
light.Color = Color3.fromRGB(255, 220, 80)
light.Parent = winPad

local winners = {}
winPad.Touched:Connect(function(hit)
	local player = Players:GetPlayerFromCharacter(hit.Parent)
	if player and not winners[player] then
		winners[player] = true
		player.leaderstats.Wins.Value += 1
		player.leaderstats.Stage.Value = 0
		player.Checkpoint.Value = nil
		task.wait(3)
		if player.Character then
			player.Character:PivotTo(spawn.CFrame + Vector3.new(0, 4, 0))
		end
		winners[player] = nil
	end
end)
