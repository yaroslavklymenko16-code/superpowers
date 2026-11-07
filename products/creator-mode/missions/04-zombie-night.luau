--[[
	CREATOR QUEST · MISSION 4 · ZOMBIE NIGHT
	A spooky graveyard at midnight. Every player gets a sword. Zombies attack in waves,
	every 5th wave brings a GIANT zombie. Survive as long as you can!

	HOW TO USE: New Baseplate place -> ServerScriptService -> + -> Script. Paste, press Play.
]]

local Players = game:GetService("Players")
local Lighting = game:GetService("Lighting")
local Debris = game:GetService("Debris")

-- SETTINGS
local ARENA_RADIUS = 70
local ZOMBIE_SPEED = 9
local ZOMBIE_DAMAGE = 10
local SWORD_DAMAGE = 35

local world = Instance.new("Folder")
world.Name = "ZombieNight"
world.Parent = workspace
local zombies = Instance.new("Folder")
zombies.Name = "Zombies"
zombies.Parent = world

-- SPOOKY NIGHT
Lighting.ClockTime = 0
Lighting.FogColor = Color3.fromRGB(40, 50, 60)
Lighting.FogStart = 20
Lighting.FogEnd = 160
Lighting.OutdoorAmbient = Color3.fromRGB(90, 100, 130)

local function part(name, size, cf, color, material)
	local p = Instance.new("Part")
	p.Name = name
	p.Anchored = true
	p.Size = size
	p.CFrame = cf
	p.Color = color
	p.Material = material or Enum.Material.SmoothPlastic
	p.Parent = world
	return p
end

-- GRAVEYARD DECORATIONS
for _ = 1, 40 do
	local angle = math.random() * math.pi * 2
	local dist = math.random(25, ARENA_RADIUS)
	local pos = Vector3.new(math.cos(angle) * dist, 2.5, math.sin(angle) * dist)
	part("Tombstone", Vector3.new(3, 5, 1), CFrame.new(pos) * CFrame.Angles(0, math.random() * 6, math.rad(math.random(-8, 8))), Color3.fromRGB(120, 125, 135), Enum.Material.Slate)
end
for _ = 1, 8 do
	local angle = math.random() * math.pi * 2
	local pos = Vector3.new(math.cos(angle) * 40, 0, math.sin(angle) * 40)
	local lamp = part("Lantern", Vector3.new(1, 1, 1), CFrame.new(pos + Vector3.new(0, 7, 0)), Color3.fromRGB(120, 255, 120), Enum.Material.Neon)
	part("LanternPost", Vector3.new(0.5, 7, 0.5), CFrame.new(pos + Vector3.new(0, 3.5, 0)), Color3.fromRGB(30, 30, 30))
	local light = Instance.new("PointLight")
	light.Color = Color3.fromRGB(120, 255, 120)
	light.Range = 25
	light.Parent = lamp
end

-- SCORE BOARD
local board = part("WaveBoard", Vector3.new(1, 1, 1), CFrame.new(0, 30, 0), Color3.new(1, 1, 1))
board.Transparency = 1
board.CanCollide = false
local gui = Instance.new("BillboardGui")
gui.Size = UDim2.new(0, 500, 0, 100)
gui.AlwaysOnTop = true
gui.Parent = board
local waveText = Instance.new("TextLabel")
waveText.Size = UDim2.new(1, 0, 1, 0)
waveText.BackgroundTransparency = 1
waveText.TextScaled = true
waveText.Font = Enum.Font.Creepster
waveText.TextColor3 = Color3.fromRGB(140, 255, 120)
waveText.TextStrokeTransparency = 0
waveText.Parent = gui

-- THE SWORD
local function makeSword()
	local tool = Instance.new("Tool")
	tool.Name = "Zombie Sword"
	tool.CanBeDropped = false
	tool.GripPos = Vector3.new(0, 0, -1.5)
	tool.GripForward = Vector3.new(-1, 0, 0)
	tool.GripRight = Vector3.new(0, 1, 0)
	tool.GripUp = Vector3.new(0, 0, 1)
	local handle = Instance.new("Part")
	handle.Name = "Handle"
	handle.Size = Vector3.new(1, 0.8, 4)
	handle.Color = Color3.fromRGB(150, 230, 255)
	handle.Material = Enum.Material.Neon
	handle.Parent = tool

	local swinging = false
	local hitThisSwing = {}
	tool.Activated:Connect(function()
		if swinging then
			return
		end
		swinging = true
		hitThisSwing = {}
		local anim = Instance.new("StringValue")
		anim.Name = "toolanim"
		anim.Value = "Slash"
		anim.Parent = tool
		task.wait(0.45)
		swinging = false
	end)
	handle.Touched:Connect(function(hit)
		if not swinging then
			return
		end
		local model = hit.Parent
		local humanoid = model and model:FindFirstChildOfClass("Humanoid")
		if humanoid and model.Parent == zombies and not hitThisSwing[humanoid] then
			hitThisSwing[humanoid] = true
			local player = Players:GetPlayerFromCharacter(tool.Parent)
			if player then
				humanoid:SetAttribute("LastHitBy", player.UserId)
			end
			humanoid:TakeDamage(SWORD_DAMAGE)
		end
	end)
	return tool
end

Players.PlayerAdded:Connect(function(player)
	local stats = Instance.new("Folder")
	stats.Name = "leaderstats"
	stats.Parent = player
	local kills = Instance.new("IntValue")
	kills.Name = "Kills"
	kills.Parent = stats
	local best = Instance.new("IntValue")
	best.Name = "Best Wave"
	best.Parent = stats

	player.CharacterAdded:Connect(function()
		makeSword().Parent = player:WaitForChild("Backpack")
	end)
end)

-- ZOMBIES
local function nearestCharacter(position)
	local closest, closestDist = nil, math.huge
	for _, player in ipairs(Players:GetPlayers()) do
		local char = player.Character
		local hum = char and char:FindFirstChildOfClass("Humanoid")
		local root = char and char:FindFirstChild("HumanoidRootPart")
		if hum and root and hum.Health > 0 then
			local d = (root.Position - position).Magnitude
			if d < closestDist then
				closest, closestDist = char, d
			end
		end
	end
	return closest, closestDist
end

local function spawnZombie(isGiant)
	local desc = Instance.new("HumanoidDescription")
	local green = Color3.fromRGB(110, 170, 90)
	desc.HeadColor = green
	desc.LeftArmColor = green
	desc.RightArmColor = green
	desc.TorsoColor = Color3.fromRGB(70, 80, 110)
	desc.LeftLegColor = Color3.fromRGB(60, 50, 40)
	desc.RightLegColor = Color3.fromRGB(60, 50, 40)
	local zombie = Players:CreateHumanoidModelFromDescription(desc, Enum.HumanoidRigType.R15)
	zombie.Name = isGiant and "GIANT ZOMBIE" or "Zombie"
	local humanoid = zombie:FindFirstChildOfClass("Humanoid")
	local root = zombie:FindFirstChild("HumanoidRootPart")

	local angle = math.random() * math.pi * 2
	zombie:PivotTo(CFrame.new(math.cos(angle) * ARENA_RADIUS, 5, math.sin(angle) * ARENA_RADIUS))
	zombie.Parent = zombies
	if isGiant then
		zombie:ScaleTo(2.5)
		humanoid.MaxHealth = 400
		humanoid.Health = 400
	end
	humanoid.WalkSpeed = ZOMBIE_SPEED
	root:SetNetworkOwner(nil)

	humanoid.Died:Connect(function()
		local id = humanoid:GetAttribute("LastHitBy")
		local player = id and Players:GetPlayerByUserId(id)
		if player then
			player.leaderstats.Kills.Value += isGiant and 10 or 1
		end
		Debris:AddItem(zombie, 2)
	end)

	-- Brain: chase the closest player, hit them when close
	task.spawn(function()
		local lastHit = 0
		while zombie.Parent and humanoid.Health > 0 do
			local target, dist = nearestCharacter(root.Position)
			if target then
				humanoid:MoveTo(target.HumanoidRootPart.Position)
				local reach = isGiant and 9 or 4.5
				if dist < reach and os.clock() - lastHit > 1 then
					lastHit = os.clock()
					target:FindFirstChildOfClass("Humanoid"):TakeDamage(isGiant and ZOMBIE_DAMAGE * 3 or ZOMBIE_DAMAGE)
				end
			end
			task.wait(0.25)
		end
	end)
end

local function zombiesAlive()
	local count = 0
	for _, z in ipairs(zombies:GetChildren()) do
		local h = z:FindFirstChildOfClass("Humanoid")
		if h and h.Health > 0 then
			count += 1
		end
	end
	return count
end

-- WAVES
task.spawn(function()
	local wave = 0
	while true do
		while #Players:GetPlayers() == 0 do
			task.wait(1)
		end
		wave += 1
		for t = 5, 1, -1 do
			waveText.Text = "WAVE " .. wave .. " IN " .. t
			task.wait(1)
		end
		local count = 2 + wave * 2
		for _ = 1, count do
			spawnZombie(false)
			task.wait(0.4)
		end
		if wave % 5 == 0 then
			spawnZombie(true)
		end
		while zombiesAlive() > 0 do
			waveText.Text = "WAVE " .. wave .. "  ·  " .. zombiesAlive() .. " ZOMBIES LEFT"
			task.wait(0.5)
		end
		for _, player in ipairs(Players:GetPlayers()) do
			local stats = player:FindFirstChild("leaderstats")
			if stats and stats["Best Wave"].Value < wave then
				stats["Best Wave"].Value = wave
			end
		end
		waveText.Text = "WAVE " .. wave .. " CLEARED!"
		task.wait(3)
	end
end)
