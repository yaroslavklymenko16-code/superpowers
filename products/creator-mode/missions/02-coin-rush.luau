--[[
	CREATOR QUEST · MISSION 2 · COIN RUSH
	Spinning coins spawn all over the map, a Gold Rain event fires every minute,
	and a shop sells Speed Boots, Moon Jump and Giant Mode. Coins save between visits.

	HOW TO USE: New Baseplate place -> ServerScriptService -> + -> Script. Paste, press Play.
	To make saving work: File > Publish to Roblox, then Home > Game Settings > Security >
	turn on "Enable Studio Access to API Services".
]]

local Players = game:GetService("Players")
local DataStoreService = game:GetService("DataStoreService")
local RunService = game:GetService("RunService")

-- SETTINGS
local MAP_SIZE = 180          -- coins spawn inside this square
local MAX_COINS = 40          -- coins on the map at once
local GOLD_RAIN_EVERY = 60    -- seconds between Gold Rain events

local SHOP = {
	{ id = "Speed", name = "Speed Boots", price = 10, color = Color3.fromRGB(60, 140, 255) },
	{ id = "Jump", name = "Moon Jump", price = 25, color = Color3.fromRGB(170, 90, 255) },
	{ id = "Giant", name = "Giant Mode", price = 50, color = Color3.fromRGB(255, 90, 60) },
}

local world = Instance.new("Folder")
world.Name = "CoinRush"
world.Parent = workspace

-- SAVING (works once the game is published and API access is on)
local store = nil
local ok = pcall(function()
	store = DataStoreService:GetDataStore("CoinRush_v1")
end)
if not ok then
	warn("Saving is off. Publish the game and enable API Services to save coins.")
end

local owned = {} -- owned[player] = { Speed = true, ... }

local function applyPerks(player)
	local character = player.Character
	local humanoid = character and character:FindFirstChildOfClass("Humanoid")
	if not humanoid then
		return
	end
	local perks = owned[player] or {}
	humanoid.WalkSpeed = perks.Speed and 32 or 16
	humanoid.UseJumpPower = true
	humanoid.JumpPower = perks.Jump and 110 or 50
	if perks.Giant then
		character:ScaleTo(1.8)
	end
end

local function label(part, text, color)
	local gui = Instance.new("BillboardGui")
	gui.Size = UDim2.new(0, 220, 0, 60)
	gui.StudsOffset = Vector3.new(0, 4, 0)
	gui.AlwaysOnTop = true
	gui.Parent = part
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
	local coins = Instance.new("IntValue")
	coins.Name = "Coins"
	coins.Parent = stats

	owned[player] = {}
	if store then
		local success, data = pcall(function()
			return store:GetAsync("player_" .. player.UserId)
		end)
		if success and data then
			coins.Value = data.coins or 0
			owned[player] = data.owned or {}
		end
	end

	player.CharacterAdded:Connect(function()
		task.wait(0.2)
		applyPerks(player)
	end)
end)

Players.PlayerRemoving:Connect(function(player)
	if store and player:FindFirstChild("leaderstats") then
		pcall(function()
			store:SetAsync("player_" .. player.UserId, {
				coins = player.leaderstats.Coins.Value,
				owned = owned[player],
			})
		end)
	end
	owned[player] = nil
end)

-- COINS
local coinCount = 0
local coinsFolder = Instance.new("Folder")
coinsFolder.Name = "Coins"
coinsFolder.Parent = world

local function spawnCoin(position, value)
	value = value or 1
	local coin = Instance.new("Part")
	coin.Name = "Coin"
	coin.Shape = Enum.PartType.Cylinder
	coin.Size = Vector3.new(0.4, 3, 3)
	coin.Anchored = true
	coin.CanCollide = false
	coin.Material = Enum.Material.Neon
	coin.Color = value > 1 and Color3.fromRGB(80, 255, 200) or Color3.fromRGB(255, 205, 40)
	coin.CFrame = CFrame.new(position)
	coin.Parent = coinsFolder
	coinCount += 1

	local taken = false
	coin.Touched:Connect(function(hit)
		local player = Players:GetPlayerFromCharacter(hit.Parent)
		if player and not taken then
			taken = true
			player.leaderstats.Coins.Value += value
			coinCount -= 1
			coin:Destroy()
		end
	end)
	return coin
end

local function randomSpot(height)
	local half = MAP_SIZE / 2
	return Vector3.new(math.random(-half, half), height or 3, math.random(-half, half))
end

-- Spin every coin, every frame
local spin = 0
RunService.Heartbeat:Connect(function(dt)
	spin += dt * 3
	for _, coin in ipairs(coinsFolder:GetChildren()) do
		local p = coin.Position
		coin.CFrame = CFrame.new(p) * CFrame.Angles(0, spin, 0)
	end
end)

-- Keep the map topped up with coins
task.spawn(function()
	while true do
		if coinCount < MAX_COINS then
			local value = 1
			if math.random(1, 10) == 1 then
				value = 5 -- rare diamond coin
			end
			spawnCoin(randomSpot(3), value)
		end
		task.wait(0.5)
	end
end)

-- GOLD RAIN EVENT
local sign = Instance.new("Part")
sign.Name = "EventSign"
sign.Anchored = true
sign.CanCollide = false
sign.Transparency = 1
sign.Size = Vector3.new(1, 1, 1)
sign.Position = Vector3.new(0, 25, 0)
sign.Parent = world
local signText = label(sign, "", Color3.fromRGB(255, 220, 60))
signText.Parent.Size = UDim2.new(0, 500, 0, 100)

task.spawn(function()
	while true do
		for t = GOLD_RAIN_EVERY, 1, -1 do
			signText.Text = "Gold Rain in " .. t
			task.wait(1)
		end
		signText.Text = "GOLD RAIN!"
		for _ = 1, 30 do
			local c = spawnCoin(randomSpot(60), 2)
			task.spawn(function()
				while c.Parent and c.Position.Y > 3 do
					c.CFrame = c.CFrame - Vector3.new(0, 1, 0)
					task.wait(0.03)
				end
			end)
			task.wait(0.1)
		end
	end
end)

-- THE SHOP
for i, item in ipairs(SHOP) do
	local pad = Instance.new("Part")
	pad.Name = item.name .. " Pad"
	pad.Anchored = true
	pad.Size = Vector3.new(8, 1, 8)
	pad.Position = Vector3.new(-14 + (i - 1) * 14, 0.5, -20)
	pad.Color = item.color
	pad.Material = Enum.Material.Neon
	pad.Parent = world
	label(pad, item.name .. "\n" .. item.price .. " coins")

	local cooldown = {}
	pad.Touched:Connect(function(hit)
		local player = Players:GetPlayerFromCharacter(hit.Parent)
		if not player or cooldown[player] then
			return
		end
		cooldown[player] = true
		local perks = owned[player]
		local coins = player.leaderstats.Coins
		if perks and not perks[item.id] and coins.Value >= item.price then
			coins.Value -= item.price
			perks[item.id] = true
			applyPerks(player)
			local fx = Instance.new("Sparkles")
			fx.Parent = hit.Parent:FindFirstChild("HumanoidRootPart")
			game:GetService("Debris"):AddItem(fx, 3)
		end
		task.wait(1)
		cooldown[player] = nil
	end)
end
