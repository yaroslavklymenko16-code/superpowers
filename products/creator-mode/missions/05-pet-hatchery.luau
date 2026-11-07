--[[
	CREATOR QUEST · MISSION 5 · PET HATCHERY
	Collect gems, hatch eggs, and get pets that float behind you and multiply your gems.
	Five rarities from Common to MYTHIC. Can you hatch a 1% Mythic?

	HOW TO USE: New Baseplate place -> ServerScriptService -> + -> Script. Paste, press Play.
]]

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local TweenService = game:GetService("TweenService")
local Debris = game:GetService("Debris")

-- RARITY TABLE: chance is out of 100. Change these to make pets rarer or easier!
local RARITIES = {
	{ name = "Common", chance = 60, color = Color3.fromRGB(200, 200, 200), boost = 1.2, size = 1.6 },
	{ name = "Rare", chance = 25, color = Color3.fromRGB(70, 150, 255), boost = 1.5, size = 1.8 },
	{ name = "Epic", chance = 10, color = Color3.fromRGB(180, 80, 255), boost = 2, size = 2 },
	{ name = "Legendary", chance = 4, color = Color3.fromRGB(255, 190, 30), boost = 3, size = 2.3 },
	{ name = "MYTHIC", chance = 1, color = Color3.fromRGB(255, 60, 140), boost = 5, size = 2.7 },
}
local PET_NAMES = { "Blob", "Kitty", "Bunny", "Puppy", "Dragon", "Unicorn", "Bat", "Robo" }
local EGG_PRICE = 15
local MAX_PETS = 3

local world = Instance.new("Folder")
world.Name = "PetHatchery"
world.Parent = workspace
local gemsFolder = Instance.new("Folder")
gemsFolder.Name = "Gems"
gemsFolder.Parent = world

local pets = {} -- pets[player] = { {model=..., boost=...}, ... }

local function label(target, text, color, width)
	local gui = Instance.new("BillboardGui")
	gui.Size = UDim2.new(0, width or 240, 0, 60)
	gui.StudsOffset = Vector3.new(0, 4, 0)
	gui.AlwaysOnTop = true
	gui.Parent = target
	local t = Instance.new("TextLabel")
	t.Size = UDim2.new(1, 0, 1, 0)
	t.BackgroundTransparency = 1
	t.Text = text
	t.TextColor3 = color or Color3.new(1, 1, 1)
	t.TextStrokeTransparency = 0
	t.Font = Enum.Font.FredokaOne
	t.TextScaled = true
	t.Parent = gui
	return t
end

local function gemMultiplier(player)
	local m = 1
	for _, pet in ipairs(pets[player] or {}) do
		m *= pet.boost
	end
	return m
end

Players.PlayerAdded:Connect(function(player)
	local stats = Instance.new("Folder")
	stats.Name = "leaderstats"
	stats.Parent = player
	local gems = Instance.new("IntValue")
	gems.Name = "Gems"
	gems.Value = 15 -- enough for your first egg
	gems.Parent = stats
	local hatched = Instance.new("IntValue")
	hatched.Name = "Hatched"
	hatched.Parent = stats
	pets[player] = {}
end)

Players.PlayerRemoving:Connect(function(player)
	for _, pet in ipairs(pets[player] or {}) do
		pet.model:Destroy()
	end
	pets[player] = nil
end)

-- PICK A RARITY using the chance numbers
local function rollRarity()
	local roll = math.random() * 100
	local total = 0
	for _, rarity in ipairs(RARITIES) do
		total += rarity.chance
		if roll <= total then
			return rarity
		end
	end
	return RARITIES[1]
end

-- BUILD A PET out of parts
local function buildPet(rarity, petName)
	local model = Instance.new("Model")
	model.Name = rarity.name .. " " .. petName
	local s = rarity.size

	local body = Instance.new("Part")
	body.Name = "Body"
	body.Shape = Enum.PartType.Ball
	body.Size = Vector3.new(s, s, s)
	body.Color = rarity.color
	body.Material = rarity.chance <= 4 and Enum.Material.Neon or Enum.Material.SmoothPlastic
	body.Anchored = true
	body.CanCollide = false
	body.Parent = model
	model.PrimaryPart = body

	local function attach(name, size, offset, color, shape)
		local p = Instance.new("Part")
		p.Name = name
		p.Size = size
		p.Shape = shape or Enum.PartType.Block
		p.Color = color
		p.CanCollide = false
		p.Massless = true
		p.Anchored = false
		p.CFrame = body.CFrame * offset
		p.Parent = model
		local weld = Instance.new("WeldConstraint")
		weld.Part0 = body
		weld.Part1 = p
		weld.Parent = p
	end

	local eye = Vector3.new(s * 0.18, s * 0.18, s * 0.18)
	attach("EyeL", eye, CFrame.new(-s * 0.2, s * 0.12, -s * 0.45), Color3.new(0, 0, 0), Enum.PartType.Ball)
	attach("EyeR", eye, CFrame.new(s * 0.2, s * 0.12, -s * 0.45), Color3.new(0, 0, 0), Enum.PartType.Ball)

	if petName == "Kitty" or petName == "Bat" then
		attach("EarL", Vector3.new(s * 0.25, s * 0.35, s * 0.1), CFrame.new(-s * 0.28, s * 0.5, 0) * CFrame.Angles(0, 0, 0.3), rarity.color)
		attach("EarR", Vector3.new(s * 0.25, s * 0.35, s * 0.1), CFrame.new(s * 0.28, s * 0.5, 0) * CFrame.Angles(0, 0, -0.3), rarity.color)
	elseif petName == "Bunny" then
		attach("EarL", Vector3.new(s * 0.18, s * 0.7, s * 0.1), CFrame.new(-s * 0.2, s * 0.7, 0), rarity.color)
		attach("EarR", Vector3.new(s * 0.18, s * 0.7, s * 0.1), CFrame.new(s * 0.2, s * 0.7, 0), rarity.color)
	elseif petName == "Unicorn" then
		attach("Horn", Vector3.new(s * 0.12, s * 0.6, s * 0.12), CFrame.new(0, s * 0.6, -s * 0.2) * CFrame.Angles(-0.4, 0, 0), Color3.fromRGB(255, 230, 120))
	elseif petName == "Dragon" or petName == "Bat" then
		attach("WingL", Vector3.new(s * 0.8, s * 0.1, s * 0.5), CFrame.new(-s * 0.7, s * 0.1, s * 0.1) * CFrame.Angles(0, 0, 0.4), rarity.color)
		attach("WingR", Vector3.new(s * 0.8, s * 0.1, s * 0.5), CFrame.new(s * 0.7, s * 0.1, s * 0.1) * CFrame.Angles(0, 0, -0.4), rarity.color)
	elseif petName == "Robo" then
		attach("Antenna", Vector3.new(s * 0.08, s * 0.5, s * 0.08), CFrame.new(0, s * 0.7, 0), Color3.fromRGB(80, 80, 90))
	end

	if rarity.chance <= 10 then
		Instance.new("Sparkles").Parent = body
	end
	label(body, model.Name, rarity.color, 200).Parent.StudsOffset = Vector3.new(0, s, 0)
	return model
end

-- PETS FOLLOW THEIR OWNER (floating and bobbing)
RunService.Heartbeat:Connect(function()
	local t = os.clock()
	for player, list in pairs(pets) do
		local root = player.Character and player.Character:FindFirstChild("HumanoidRootPart")
		if root then
			for i, pet in ipairs(list) do
				local side = (i - 2) * 4
				local bob = math.sin(t * 3 + i) * 0.5
				local goal = root.CFrame * CFrame.new(side, 1.5 + bob, 6)
				local body = pet.model.PrimaryPart
				body.CFrame = body.CFrame:Lerp(goal, 0.15)
			end
		end
	end
end)

-- GEMS to collect
local function spawnGem()
	local gem = Instance.new("Part")
	gem.Name = "Gem"
	gem.Size = Vector3.new(1.5, 1.5, 1.5)
	gem.Anchored = true
	gem.CanCollide = false
	gem.Material = Enum.Material.Glass
	gem.Color = Color3.fromRGB(80, 230, 255)
	gem.CFrame = CFrame.new(math.random(-80, 80), 2.5, math.random(-80, 80)) * CFrame.Angles(math.rad(45), 0, math.rad(45))
	gem.Parent = gemsFolder
	local taken = false
	gem.Touched:Connect(function(hit)
		local player = Players:GetPlayerFromCharacter(hit.Parent)
		if player and not taken then
			taken = true
			player.leaderstats.Gems.Value += math.floor(2 * gemMultiplier(player))
			gem:Destroy()
		end
	end)
end

task.spawn(function()
	while true do
		if #gemsFolder:GetChildren() < 50 then
			spawnGem()
		end
		task.wait(0.4)
	end
end)

-- THE EGG
local stand = Instance.new("Part")
stand.Name = "EggStand"
stand.Anchored = true
stand.Size = Vector3.new(10, 1, 10)
stand.Position = Vector3.new(0, 0.5, -25)
stand.Color = Color3.fromRGB(255, 255, 255)
stand.Material = Enum.Material.Marble
stand.Parent = world

local egg = Instance.new("Part")
egg.Name = "Egg"
egg.Shape = Enum.PartType.Ball
egg.Anchored = true
egg.Size = Vector3.new(6, 6, 6)
egg.Position = Vector3.new(0, 4.5, -25)
egg.Color = Color3.fromRGB(255, 240, 200)
egg.Material = Enum.Material.SmoothPlastic
egg.Parent = world
label(egg, "MYSTERY EGG\n" .. EGG_PRICE .. " gems · touch to hatch", Color3.fromRGB(255, 230, 120), 300).Parent.StudsOffset = Vector3.new(0, 5, 0)

local hatching = false
egg.Touched:Connect(function(hit)
	local player = Players:GetPlayerFromCharacter(hit.Parent)
	if not player or hatching then
		return
	end
	local gems = player.leaderstats.Gems
	if gems.Value < EGG_PRICE then
		return
	end
	hatching = true
	gems.Value -= EGG_PRICE

	-- Shake the egg
	local start = egg.CFrame
	for i = 1, 10 do
		local tilt = (i % 2 == 0) and 0.25 or -0.25
		TweenService:Create(egg, TweenInfo.new(0.08), { CFrame = start * CFrame.Angles(0, 0, tilt) }):Play()
		task.wait(0.1)
	end
	egg.CFrame = start

	local rarity = rollRarity()
	local petName = PET_NAMES[math.random(1, #PET_NAMES)]
	local model = buildPet(rarity, petName)
	model:PivotTo(egg.CFrame)
	model.Parent = world

	local list = pets[player]
	table.insert(list, { model = model, boost = rarity.boost })
	if #list > MAX_PETS then
		local oldest = table.remove(list, 1)
		oldest.model:Destroy()
	end
	player.leaderstats.Hatched.Value += 1

	-- Big announcement over the egg
	local pop = label(egg, "You got a " .. rarity.name .. " " .. petName .. "!", rarity.color, 420)
	pop.Parent.StudsOffset = Vector3.new(0, 9, 0)
	Debris:AddItem(pop.Parent, 3)
	task.wait(1)
	hatching = false
end)
