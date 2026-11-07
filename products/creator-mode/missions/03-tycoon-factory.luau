--[[
	CREATOR QUEST · MISSION 3 · TYCOON FACTORY
	Claim a factory. Droppers make blocks, the conveyor carries them, the collector
	turns them into cash. Buy upgrades to grow your empire and unlock the Golden Statue.

	HOW TO USE: New Baseplate place -> ServerScriptService -> + -> Script. Paste, press Play.
	Walk onto the green CLAIM pad first!
]]

local Players = game:GetService("Players")
local Debris = game:GetService("Debris")

local factory = Instance.new("Folder")
factory.Name = "TycoonFactory"
factory.Parent = workspace

local owner = nil
local conveyorSpeed = 8
local droppers = {}

local function part(name, size, pos, color, material)
	local p = Instance.new("Part")
	p.Name = name
	p.Anchored = true
	p.Size = size
	p.Position = pos
	p.Color = color
	p.Material = material or Enum.Material.SmoothPlastic
	p.TopSurface = Enum.SurfaceType.Smooth
	p.BottomSurface = Enum.SurfaceType.Smooth
	p.Parent = factory
	return p
end

local function label(target, text, color)
	local gui = Instance.new("BillboardGui")
	gui.Size = UDim2.new(0, 220, 0, 60)
	gui.StudsOffset = Vector3.new(0, 3.5, 0)
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

Players.PlayerAdded:Connect(function(player)
	local stats = Instance.new("Folder")
	stats.Name = "leaderstats"
	stats.Parent = player
	local cash = Instance.new("IntValue")
	cash.Name = "Cash"
	cash.Parent = stats
end)

Players.PlayerRemoving:Connect(function(player)
	if player == owner then
		owner = nil
	end
end)

-- FLOOR
part("Floor", Vector3.new(64, 1, 44), Vector3.new(0, 0.5, 0), Color3.fromRGB(70, 75, 90), Enum.Material.Concrete)

-- CONVEYOR (anchored part with a velocity pushes anything on top of it)
local conveyor = part("Conveyor", Vector3.new(44, 1, 5), Vector3.new(0, 2.5, 0), Color3.fromRGB(35, 35, 40), Enum.Material.DiamondPlate)
conveyor.AssemblyLinearVelocity = Vector3.new(conveyorSpeed, 0, 0)
local railA = part("Rail", Vector3.new(44, 2, 0.5), Vector3.new(0, 3.5, 2.75), Color3.fromRGB(255, 200, 40))
local railB = part("Rail", Vector3.new(44, 2, 0.5), Vector3.new(0, 3.5, -2.75), Color3.fromRGB(255, 200, 40))
railA.Transparency = 0.4
railB.Transparency = 0.4

-- COLLECTOR: turns blocks into cash
local collector = part("Collector", Vector3.new(4, 4, 6), Vector3.new(24, 3, 0), Color3.fromRGB(60, 220, 120), Enum.Material.Neon)
collector.Touched:Connect(function(hit)
	local worth = hit:GetAttribute("Worth")
	if worth then
		hit:SetAttribute("Worth", nil)
		hit:Destroy()
		if owner and owner:FindFirstChild("leaderstats") then
			owner.leaderstats.Cash.Value += worth
		end
	end
end)
label(collector, "COLLECTOR", Color3.fromRGB(120, 255, 160))

-- DROPPERS
local function addDropper(x, worth, every, color)
	local box = part("Dropper", Vector3.new(4, 4, 4), Vector3.new(x, 10, 0), Color3.fromRGB(90, 95, 115), Enum.Material.Metal)
	local nozzle = part("Nozzle", Vector3.new(2, 1, 2), Vector3.new(x, 7.5, 0), color, Enum.Material.Neon)
	table.insert(droppers, box)
	task.spawn(function()
		while box.Parent do
			if owner then
				local drop = Instance.new("Part")
				drop.Name = "Drop"
				drop.Size = Vector3.new(1.2, 1.2, 1.2)
				drop.Color = color
				drop.Material = Enum.Material.Neon
				drop.Position = nozzle.Position - Vector3.new(0, 1.5, 0)
				drop:SetAttribute("Worth", worth)
				drop.Parent = factory
				drop:SetNetworkOwner(nil)
				Debris:AddItem(drop, 25)
			end
			task.wait(every)
		end
	end)
end

-- UPGRADER: doubles the worth of blocks that pass through it
local function addUpgrader()
	local gate = part("Upgrader", Vector3.new(1, 5, 6), Vector3.new(12, 4.5, 0), Color3.fromRGB(170, 80, 255), Enum.Material.ForceField)
	gate.CanCollide = false
	gate.Touched:Connect(function(hit)
		local worth = hit:GetAttribute("Worth")
		if worth and not hit:GetAttribute("Upgraded") then
			hit:SetAttribute("Upgraded", true)
			hit:SetAttribute("Worth", worth * 2)
			hit.Color = Color3.fromRGB(200, 120, 255)
		end
	end)
	label(gate, "x2 UPGRADER", Color3.fromRGB(220, 170, 255))
end

local function addWalls()
	local c = Color3.fromRGB(230, 225, 210)
	part("Wall", Vector3.new(64, 14, 1), Vector3.new(0, 8, 22), c, Enum.Material.Brick)
	part("Wall", Vector3.new(1, 14, 44), Vector3.new(-32, 8, 0), c, Enum.Material.Brick)
	part("Wall", Vector3.new(1, 14, 44), Vector3.new(32, 8, 0), c, Enum.Material.Brick)
end

local function addRoof()
	part("Roof", Vector3.new(66, 1, 46), Vector3.new(0, 15.5, 0), Color3.fromRGB(200, 60, 50), Enum.Material.Slate)
	for _, x in ipairs({ -20, 0, 20 }) do
		local lamp = part("Lamp", Vector3.new(2, 0.5, 2), Vector3.new(x, 14.75, 8), Color3.fromRGB(255, 240, 200), Enum.Material.Neon)
		local light = Instance.new("PointLight")
		light.Range = 40
		light.Brightness = 2
		light.Parent = lamp
	end
end

local function addStatue()
	local base = part("StatueBase", Vector3.new(8, 2, 8), Vector3.new(0, 2, -14), Color3.fromRGB(60, 60, 70), Enum.Material.Marble)
	local body = part("Statue", Vector3.new(3, 6, 2), Vector3.new(0, 6, -14), Color3.fromRGB(255, 200, 40), Enum.Material.Foil)
	local head = part("StatueHead", Vector3.new(2, 2, 2), Vector3.new(0, 10, -14), Color3.fromRGB(255, 200, 40), Enum.Material.Foil)
	Instance.new("Sparkles").Parent = head
	label(base, "TYCOON COMPLETE!", Color3.fromRGB(255, 220, 60))
	body.CanCollide = true
end

-- BUY BUTTONS: name, price, what it builds, which buttons it unlocks
local BUTTONS = {
	{ id = "Dropper2", name = "Dropper #2", price = 25, unlocks = { "Faster", "Upgrader" },
		build = function() addDropper(-8, 1, 2, Color3.fromRGB(80, 170, 255)) end },
	{ id = "Faster", name = "Fast Conveyor", price = 60, unlocks = { "Mega" },
		build = function()
			conveyorSpeed = 16
			conveyor.AssemblyLinearVelocity = Vector3.new(conveyorSpeed, 0, 0)
		end },
	{ id = "Upgrader", name = "x2 Upgrader", price = 100, unlocks = { "Walls" }, build = addUpgrader },
	{ id = "Mega", name = "MEGA Dropper", price = 250, unlocks = { "Roof" },
		build = function() addDropper(2, 10, 1.5, Color3.fromRGB(255, 200, 40)) end },
	{ id = "Walls", name = "Factory Walls", price = 400, unlocks = {}, build = addWalls },
	{ id = "Roof", name = "Roof + Lights", price = 600, unlocks = { "Statue" }, build = addRoof },
	{ id = "Statue", name = "GOLDEN STATUE", price = 1500, unlocks = {}, build = addStatue },
}

local buttonParts = {}
local slot = 0

local function showButton(id)
	for _, info in ipairs(BUTTONS) do
		if info.id == id then
			slot += 1
			local x = -24 + ((slot - 1) % 7) * 8
			local button = part("Button_" .. id, Vector3.new(5, 1, 5), Vector3.new(x, 1.5, 15), Color3.fromRGB(60, 200, 90), Enum.Material.Neon)
			label(button, info.name .. "\n$" .. info.price)
			buttonParts[id] = button
			local bought = false
			button.Touched:Connect(function(hit)
				local player = Players:GetPlayerFromCharacter(hit.Parent)
				if bought or player ~= owner then
					return
				end
				local cash = player.leaderstats.Cash
				if cash.Value >= info.price then
					bought = true
					cash.Value -= info.price
					button:Destroy()
					info.build()
					for _, nextId in ipairs(info.unlocks) do
						showButton(nextId)
					end
				end
			end)
		end
	end
end

-- CLAIM PAD
local claim = part("ClaimPad", Vector3.new(8, 1, 8), Vector3.new(-26, 1.5, -15), Color3.fromRGB(60, 220, 120), Enum.Material.Neon)
local claimText = label(claim, "CLAIM FACTORY")
claim.Touched:Connect(function(hit)
	local player = Players:GetPlayerFromCharacter(hit.Parent)
	if player and not owner then
		owner = player
		claimText.Text = player.DisplayName .. "'s Factory"
		claim.Color = Color3.fromRGB(255, 200, 40)
		if not buttonParts.Dropper2 then
			showButton("Dropper2")
		end
	end
end)

-- The first dropper comes free
addDropper(-16, 1, 2, Color3.fromRGB(255, 255, 255))
