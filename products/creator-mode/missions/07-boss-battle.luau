--[[
	CREATOR QUEST · MISSION 7 · BOSS BATTLE
	A giant Lava King with a health bar on everyone's screen and three attack phases:
	  Phase 1: GROUND SLAM shockwaves (jump over them!)
	  Phase 2: METEOR RAIN with warning circles
	  Phase 3: RAGE MODE, faster and angrier
	Team up with friends, swing your swords, and take him down.

	HOW TO USE: New Baseplate place -> ServerScriptService -> + -> Script. Paste, press Play.
]]

local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local Debris = game:GetService("Debris")
local Lighting = game:GetService("Lighting")

-- SETTINGS
local BOSS_HEALTH = 1500
local BOSS_SIZE = 4
local SWORD_DAMAGE = 25
local RESPAWN_BOSS_AFTER = 15

local world = Instance.new("Folder")
world.Name = "BossBattle"
world.Parent = workspace

Lighting.ClockTime = 18.2
Lighting.Ambient = Color3.fromRGB(120, 70, 60)

-- ARENA
local floor = Instance.new("Part")
floor.Name = "ArenaFloor"
floor.Anchored = true
floor.Shape = Enum.PartType.Cylinder
floor.Size = Vector3.new(2, 140, 140)
floor.CFrame = CFrame.new(0, 1, 0) * CFrame.Angles(0, 0, math.rad(90))
floor.Color = Color3.fromRGB(60, 45, 45)
floor.Material = Enum.Material.Basalt
floor.Parent = world

for i = 1, 12 do
	local a = (i / 12) * math.pi * 2
	local pillar = Instance.new("Part")
	pillar.Anchored = true
	pillar.Size = Vector3.new(5, 30, 5)
	pillar.Position = Vector3.new(math.cos(a) * 66, 16, math.sin(a) * 66)
	pillar.Color = Color3.fromRGB(40, 30, 30)
	pillar.Material = Enum.Material.Basalt
	pillar.Parent = world
	local fire = Instance.new("Fire")
	fire.Size = 8
	fire.Parent = pillar
end

-- HEALTH BAR on everyone's screen
local function makeBossGui(player)
	local screen = Instance.new("ScreenGui")
	screen.Name = "BossGui"
	screen.ResetOnSpawn = false
	local frame = Instance.new("Frame")
	frame.Name = "Bar"
	frame.Size = UDim2.new(0.5, 0, 0, 34)
	frame.Position = UDim2.new(0.25, 0, 0, 16)
	frame.BackgroundColor3 = Color3.fromRGB(30, 20, 20)
	frame.Parent = screen
	local fill = Instance.new("Frame")
	fill.Name = "Fill"
	fill.Size = UDim2.new(1, 0, 1, 0)
	fill.BackgroundColor3 = Color3.fromRGB(255, 70, 40)
	fill.BorderSizePixel = 0
	fill.Parent = frame
	local text = Instance.new("TextLabel")
	text.Name = "Title"
	text.Size = UDim2.new(1, 0, 1, 0)
	text.BackgroundTransparency = 1
	text.Font = Enum.Font.FredokaOne
	text.TextScaled = true
	text.TextColor3 = Color3.new(1, 1, 1)
	text.TextStrokeTransparency = 0
	text.Text = "THE LAVA KING"
	text.Parent = frame
	screen.Parent = player:WaitForChild("PlayerGui")
end

local function updateBar(fraction, title)
	for _, player in ipairs(Players:GetPlayers()) do
		local gui = player:FindFirstChild("PlayerGui")
		local screen = gui and gui:FindFirstChild("BossGui")
		if screen then
			screen.Bar.Fill.Size = UDim2.new(math.clamp(fraction, 0, 1), 0, 1, 0)
			screen.Bar.Title.Text = title
		end
	end
end

-- SWORD (same idea as Mission 4)
local boss = nil
local function makeSword()
	local tool = Instance.new("Tool")
	tool.Name = "Hero Sword"
	tool.CanBeDropped = false
	tool.GripPos = Vector3.new(0, 0, -1.5)
	tool.GripForward = Vector3.new(-1, 0, 0)
	tool.GripRight = Vector3.new(0, 1, 0)
	tool.GripUp = Vector3.new(0, 0, 1)
	local handle = Instance.new("Part")
	handle.Name = "Handle"
	handle.Size = Vector3.new(1, 0.8, 4.5)
	handle.Color = Color3.fromRGB(255, 220, 90)
	handle.Material = Enum.Material.Neon
	handle.Parent = tool
	local swinging = false
	local hitOnce = false
	tool.Activated:Connect(function()
		if swinging then
			return
		end
		swinging = true
		hitOnce = false
		local anim = Instance.new("StringValue")
		anim.Name = "toolanim"
		anim.Value = "Slash"
		anim.Parent = tool
		task.wait(0.45)
		swinging = false
	end)
	handle.Touched:Connect(function(hit)
		if swinging and not hitOnce and boss and hit:IsDescendantOf(boss) then
			hitOnce = true
			boss:FindFirstChildOfClass("Humanoid"):TakeDamage(SWORD_DAMAGE)
		end
	end)
	return tool
end

Players.PlayerAdded:Connect(function(player)
	local stats = Instance.new("Folder")
	stats.Name = "leaderstats"
	stats.Parent = player
	local wins = Instance.new("IntValue")
	wins.Name = "Boss Wins"
	wins.Parent = stats
	makeBossGui(player)
	player.CharacterAdded:Connect(function()
		makeSword().Parent = player:WaitForChild("Backpack")
	end)
end)

-- ATTACKS
local function hurtPlayersNear(position, radius, damage, onlyOnGround)
	for _, player in ipairs(Players:GetPlayers()) do
		local char = player.Character
		local root = char and char:FindFirstChild("HumanoidRootPart")
		local hum = char and char:FindFirstChildOfClass("Humanoid")
		if root and hum and hum.Health > 0 then
			local flat = Vector3.new(root.Position.X - position.X, 0, root.Position.Z - position.Z)
			local grounded = hum.FloorMaterial ~= Enum.Material.Air
			if flat.Magnitude < radius and (not onlyOnGround or grounded) then
				hum:TakeDamage(damage)
			end
		end
	end
end

local function groundSlam(center)
	local ring = Instance.new("Part")
	ring.Anchored = true
	ring.CanCollide = false
	ring.Shape = Enum.PartType.Cylinder
	ring.Material = Enum.Material.Neon
	ring.Color = Color3.fromRGB(255, 140, 40)
	ring.Transparency = 0.3
	ring.Size = Vector3.new(0.6, 4, 4)
	ring.CFrame = CFrame.new(center.X, 2.3, center.Z) * CFrame.Angles(0, 0, math.rad(90))
	ring.Parent = world
	local radius = 2
	local alreadyHit = {}
	while radius < 60 do
		radius += 2
		ring.Size = Vector3.new(0.6, radius * 2, radius * 2)
		for _, player in ipairs(Players:GetPlayers()) do
			local char = player.Character
			local root = char and char:FindFirstChild("HumanoidRootPart")
			local hum = char and char:FindFirstChildOfClass("Humanoid")
			if root and hum and not alreadyHit[player] then
				local d = (Vector3.new(root.Position.X, 0, root.Position.Z) - Vector3.new(center.X, 0, center.Z)).Magnitude
				if math.abs(d - radius) < 2 and hum.FloorMaterial ~= Enum.Material.Air then
					alreadyHit[player] = true
					hum:TakeDamage(20)
				end
			end
		end
		task.wait(0.03)
	end
	ring:Destroy()
end

local function meteor(target)
	local warning = Instance.new("Part")
	warning.Anchored = true
	warning.CanCollide = false
	warning.Shape = Enum.PartType.Cylinder
	warning.Size = Vector3.new(0.3, 12, 12)
	warning.CFrame = CFrame.new(target.X, 2.2, target.Z) * CFrame.Angles(0, 0, math.rad(90))
	warning.Color = Color3.fromRGB(255, 40, 40)
	warning.Material = Enum.Material.Neon
	warning.Transparency = 0.5
	warning.Parent = world

	local rock = Instance.new("Part")
	rock.Anchored = true
	rock.CanCollide = false
	rock.Shape = Enum.PartType.Ball
	rock.Size = Vector3.new(6, 6, 6)
	rock.Material = Enum.Material.Neon
	rock.Color = Color3.fromRGB(255, 120, 30)
	rock.Position = Vector3.new(target.X, 90, target.Z)
	rock.Parent = world
	Instance.new("Fire").Parent = rock

	local fall = TweenService:Create(rock, TweenInfo.new(1.5, Enum.EasingStyle.Quad, Enum.EasingDirection.In), { Position = Vector3.new(target.X, 3, target.Z) })
	fall:Play()
	fall.Completed:Wait()
	hurtPlayersNear(target, 6, 30, false)
	local boom = Instance.new("Explosion")
	boom.BlastPressure = 0
	boom.DestroyJointRadiusPercent = 0
	boom.Position = rock.Position
	boom.Parent = world
	rock:Destroy()
	warning:Destroy()
end

local function randomTargetPlayerPosition()
	local list = {}
	for _, player in ipairs(Players:GetPlayers()) do
		local root = player.Character and player.Character:FindFirstChild("HumanoidRootPart")
		if root then
			table.insert(list, root.Position)
		end
	end
	if #list == 0 then
		return nil
	end
	return list[math.random(1, #list)]
end

-- THE BOSS
local function spawnBoss()
	local desc = Instance.new("HumanoidDescription")
	local red = Color3.fromRGB(200, 50, 30)
	desc.HeadColor = Color3.fromRGB(255, 120, 40)
	desc.TorsoColor = red
	desc.LeftArmColor = red
	desc.RightArmColor = red
	desc.LeftLegColor = Color3.fromRGB(60, 30, 30)
	desc.RightLegColor = Color3.fromRGB(60, 30, 30)
	local model = Players:CreateHumanoidModelFromDescription(desc, Enum.HumanoidRigType.R15)
	model.Name = "The Lava King"
	model:PivotTo(CFrame.new(0, 10, 0))
	model.Parent = world
	model:ScaleTo(BOSS_SIZE)
	local hum = model:FindFirstChildOfClass("Humanoid")
	hum.MaxHealth = BOSS_HEALTH
	hum.Health = BOSS_HEALTH
	hum.WalkSpeed = 10
	hum.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.None
	model.HumanoidRootPart:SetNetworkOwner(nil)
	Instance.new("Fire").Parent = model:FindFirstChild("Head")
	boss = model
	return model, hum
end

-- BATTLE LOOP
while true do
	while #Players:GetPlayers() == 0 do
		task.wait(1)
	end
	local model, hum = spawnBoss()
	hum.HealthChanged:Connect(function(health)
		local f = health / hum.MaxHealth
		local phase = f > 0.5 and "PHASE 1" or (f > 0.2 and "PHASE 2" or "RAGE MODE")
		updateBar(f, "THE LAVA KING  ·  " .. phase)
	end)
	updateBar(1, "THE LAVA KING  ·  PHASE 1")

	while hum.Health > 0 do
		local f = hum.Health / hum.MaxHealth
		local target = randomTargetPlayerPosition()
		if target then
			hum:MoveTo(target)
		end
		if f > 0.5 then
			task.wait(3)
			if hum.Health > 0 then
				groundSlam(model.HumanoidRootPart.Position)
			end
		elseif f > 0.2 then
			for _ = 1, 5 do
				local t = randomTargetPlayerPosition()
				if t and hum.Health > 0 then
					task.spawn(meteor, t + Vector3.new(math.random(-8, 8), 0, math.random(-8, 8)))
				end
				task.wait(0.5)
			end
			task.wait(2)
		else
			hum.WalkSpeed = 18
			task.spawn(groundSlam, model.HumanoidRootPart.Position)
			for _ = 1, 3 do
				local t = randomTargetPlayerPosition()
				if t then
					task.spawn(meteor, t)
				end
			end
			task.wait(2.5)
		end
	end

	-- VICTORY
	boss = nil
	updateBar(0, "VICTORY! The Lava King is defeated!")
	for _, player in ipairs(Players:GetPlayers()) do
		player.leaderstats["Boss Wins"].Value += 1
		local root = player.Character and player.Character:FindFirstChild("HumanoidRootPart")
		if root then
			local fx = Instance.new("Sparkles")
			fx.Parent = root
			Debris:AddItem(fx, 6)
		end
	end
	Debris:AddItem(model, 3)
	for t = RESPAWN_BOSS_AFTER, 1, -1 do
		updateBar(0, "The Lava King returns in " .. t .. "...")
		task.wait(1)
	end
end
