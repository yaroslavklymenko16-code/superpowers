"""Luau scripts that ship inside Creator Vault models. Each is placed in a part or model."""

STATS_HELPER = '''local function stat(player, name)
	local stats = player:FindFirstChild("leaderstats")
	if not stats then
		stats = Instance.new("Folder")
		stats.Name = "leaderstats"
		stats.Parent = player
	end
	local value = stats:FindFirstChild(name)
	if not value then
		value = Instance.new("IntValue")
		value.Name = name
		value.Parent = stats
	end
	return value
end
'''

S = {}

S["kill"] = '''-- KILL BRICK: touching this part knocks you out.
local part = script.Parent
part.Touched:Connect(function(hit)
	local humanoid = hit.Parent and hit.Parent:FindFirstChildOfClass("Humanoid")
	if humanoid then
		humanoid.Health = 0
	end
end)
'''

S["damage"] = '''-- DAMAGE BRICK: takes away some health, once a second.
local DAMAGE = 20
local part = script.Parent
local cooldown = {}
part.Touched:Connect(function(hit)
	local humanoid = hit.Parent and hit.Parent:FindFirstChildOfClass("Humanoid")
	if humanoid and not cooldown[humanoid] then
		cooldown[humanoid] = true
		humanoid:TakeDamage(DAMAGE)
		task.wait(1)
		cooldown[humanoid] = nil
	end
end)
'''

S["checkpoint"] = '''-- CHECKPOINT: rename it "Checkpoint 2", "Checkpoint 3"... for each stage.
-- When you fall, you come back to the highest checkpoint you touched.
local Players = game:GetService("Players")
local cp = script.Parent
local number = tonumber(string.match(cp.Name, "%d+")) or 1

local function hook(player)
	if player:GetAttribute("CheckpointHooked") then
		return
	end
	player:SetAttribute("CheckpointHooked", true)
	player.CharacterAdded:Connect(function(character)
		local saved = player:FindFirstChild("SavedCheckpoint")
		local root = character:WaitForChild("HumanoidRootPart", 5)
		task.wait(0.1)
		if saved and saved.Value and root then
			character:PivotTo(saved.Value.CFrame + Vector3.new(0, 4, 0))
		end
	end)
end

cp.Touched:Connect(function(hit)
	local player = Players:GetPlayerFromCharacter(hit.Parent)
	if not player then
		return
	end
	hook(player)
	local saved = player:FindFirstChild("SavedCheckpoint")
	if not saved then
		saved = Instance.new("ObjectValue")
		saved.Name = "SavedCheckpoint"
		saved.Parent = player
	end
	local current = 0
	if saved.Value then
		current = tonumber(string.match(saved.Value.Name, "%d+")) or 1
	end
	if number >= current and saved.Value ~= cp then
		saved.Value = cp
		local stats = player:FindFirstChild("leaderstats")
		local stage = stats and stats:FindFirstChild("Stage")
		if stage then
			stage.Value = number
		end
	end
end)
'''

def mover(axis):
    vec = {"X": "RightVector", "Y": "UpVector", "Z": "LookVector"}[axis]
    off = {"X": "math.sin(t) * DISTANCE, 0, 0", "Y": "0, math.sin(t) * DISTANCE, 0", "Z": "0, 0, -math.sin(t) * DISTANCE"}[axis]
    return f'''-- MOVING PLATFORM: slides back and forth and carries players with it.
local RunService = game:GetService("RunService")
local platform = script.Parent
local DISTANCE = 10 -- studs each way
local SPEED = 1 -- bigger = faster
local start = platform.CFrame
local t0 = os.clock()
RunService.Heartbeat:Connect(function()
	local t = (os.clock() - t0) * SPEED
	platform.CFrame = start * CFrame.new({off})
	platform.AssemblyLinearVelocity = start.{vec} * math.cos(t) * DISTANCE * SPEED
end)
'''

S["slider"] = mover("X")
S["elevator"] = mover("Y")

S["spinner"] = '''-- SPINNER: spins forever and knocks out anyone it hits.
local RunService = game:GetService("RunService")
local bar = script.Parent
local SPEED = 2 -- spins per... well, try it!
RunService.Heartbeat:Connect(function(dt)
	bar.CFrame = bar.CFrame * CFrame.Angles(0, SPEED * dt, 0)
end)
bar.Touched:Connect(function(hit)
	local humanoid = hit.Parent and hit.Parent:FindFirstChildOfClass("Humanoid")
	if humanoid then
		humanoid.Health = 0
	end
end)
'''

S["vanish"] = '''-- VANISHING BLOCK: fades away when you stand on it, then comes back.
local part = script.Parent
local busy = false
part.Touched:Connect(function(hit)
	if busy or not (hit.Parent and hit.Parent:FindFirstChildOfClass("Humanoid")) then
		return
	end
	busy = true
	local start = part.Transparency
	for i = 1, 6 do
		part.Transparency = start + (1 - start) * i / 6
		task.wait(0.12)
	end
	part.CanCollide = false
	task.wait(2.5)
	part.CanCollide = true
	part.Transparency = start
	busy = false
end)
'''

S["jumppad"] = '''-- JUMP PAD: launches you into the sky.
local POWER = 110
local pad = script.Parent
local cooldown = {}
pad.Touched:Connect(function(hit)
	local character = hit.Parent
	local root = character and character:FindFirstChild("HumanoidRootPart")
	if root and character:FindFirstChildOfClass("Humanoid") and not cooldown[character] then
		cooldown[character] = true
		local push = Instance.new("BodyVelocity")
		push.MaxForce = Vector3.new(0, math.huge, 0)
		push.Velocity = Vector3.new(0, POWER, 0)
		push.Parent = root
		game:GetService("Debris"):AddItem(push, 0.25)
		task.wait(1)
		cooldown[character] = nil
	end
end)
'''

S["speedpad"] = '''-- SPEED PAD: super speed for a few seconds.
local BOOST_SPEED = 50
local SECONDS = 4
local pad = script.Parent
local boosted = {}
pad.Touched:Connect(function(hit)
	local humanoid = hit.Parent and hit.Parent:FindFirstChildOfClass("Humanoid")
	if humanoid and not boosted[humanoid] then
		boosted[humanoid] = true
		humanoid.WalkSpeed = BOOST_SPEED
		task.wait(SECONDS)
		humanoid.WalkSpeed = 16
		boosted[humanoid] = nil
	end
end)
'''

S["conveyor"] = '''-- CONVEYOR: pushes anything on top of it in the direction it faces.
local SPEED = 12
local belt = script.Parent
belt.AssemblyLinearVelocity = belt.CFrame.LookVector * SPEED
'''

S["winpad"] = STATS_HELPER + '''
-- WIN PAD: +1 Win, then back to the start.
local Players = game:GetService("Players")
local pad = script.Parent
local done = {}
pad.Touched:Connect(function(hit)
	local player = Players:GetPlayerFromCharacter(hit.Parent)
	if player and not done[player] then
		done[player] = true
		stat(player, "Wins").Value += 1
		local saved = player:FindFirstChild("SavedCheckpoint")
		if saved then
			saved.Value = nil
		end
		task.wait(2)
		player:LoadCharacter()
		done[player] = nil
	end
end)
'''

def collectible(stat_name, value, respawn):
    return STATS_HELPER + f'''
-- COLLECTIBLE: spins, gives {value} {stat_name}, comes back after {respawn} seconds.
local RunService = game:GetService("RunService")
local Players = game:GetService("Players")
local VALUE = {value}
local RESPAWN = {respawn}
local item = script.Parent
local home = item.CFrame
local angle = 0
local ready = true
RunService.Heartbeat:Connect(function(dt)
	angle += dt * 2
	item.CFrame = home * CFrame.Angles(0, angle, 0)
end)
item.Touched:Connect(function(hit)
	local player = Players:GetPlayerFromCharacter(hit.Parent)
	if player and ready then
		ready = false
		stat(player, "{stat_name}").Value += VALUE
		item.Transparency = 1
		task.wait(RESPAWN)
		item.Transparency = 0
		ready = true
	end
end)
'''

S["coin"] = collectible("Coins", 1, 8)
S["gem_blue"] = collectible("Coins", 5, 15)
S["gem_red"] = collectible("Coins", 10, 20)
S["gem_green"] = collectible("Coins", 25, 30)

S["heart"] = '''-- HEART: heals you.
local HEAL = 50
local heart = script.Parent
local ready = true
heart.Touched:Connect(function(hit)
	local humanoid = hit.Parent and hit.Parent:FindFirstChildOfClass("Humanoid")
	if humanoid and ready and humanoid.Health < humanoid.MaxHealth then
		ready = false
		humanoid.Health = math.min(humanoid.MaxHealth, humanoid.Health + HEAL)
		heart.Transparency = 1
		task.wait(10)
		heart.Transparency = 0
		ready = true
	end
end)
'''

S["star"] = '''-- POWER STAR: super speed + jump for 8 seconds.
local star = script.Parent
local ready = true
star.Touched:Connect(function(hit)
	local humanoid = hit.Parent and hit.Parent:FindFirstChildOfClass("Humanoid")
	if humanoid and ready then
		ready = false
		star.Transparency = 1
		humanoid.WalkSpeed = 36
		humanoid.UseJumpPower = true
		humanoid.JumpPower = 90
		task.wait(8)
		humanoid.WalkSpeed = 16
		humanoid.JumpPower = 50
		task.wait(7)
		star.Transparency = 0
		ready = true
	end
end)
'''

S["key"] = '''-- KEY: pick it up to open any Key Door.
local Players = game:GetService("Players")
local key = script.Parent
local ready = true
key.Touched:Connect(function(hit)
	local player = Players:GetPlayerFromCharacter(hit.Parent)
	if player and ready and not player:GetAttribute("HasKey") then
		ready = false
		player:SetAttribute("HasKey", true)
		key.Transparency = 1
		task.wait(10)
		key.Transparency = 0
		ready = true
	end
end)
'''

S["keydoor"] = '''-- KEY DOOR: opens for 3 seconds if you have a key.
local Players = game:GetService("Players")
local door = script.Parent
local open = false
door.Touched:Connect(function(hit)
	local player = Players:GetPlayerFromCharacter(hit.Parent)
	if player and player:GetAttribute("HasKey") and not open then
		open = true
		door.Transparency = 0.8
		door.CanCollide = false
		task.wait(3)
		door.Transparency = 0
		door.CanCollide = true
		open = false
	end
end)
'''

S["trophy"] = STATS_HELPER + '''
-- TROPHY: grab it for a Trophy point (once per life).
local Players = game:GetService("Players")
local trophy = script.Parent
local got = {}
trophy.Touched:Connect(function(hit)
	local player = Players:GetPlayerFromCharacter(hit.Parent)
	local character = hit.Parent
	if player and not got[character] then
		got[character] = true
		stat(player, "Trophies").Value += 1
		local fx = Instance.new("Sparkles")
		fx.Parent = trophy
		game:GetService("Debris"):AddItem(fx, 3)
	end
end)
'''

S["chest"] = STATS_HELPER + '''
-- TREASURE CHEST: press E to open. 25 coins, once per player.
local Players = game:GetService("Players")
local lid = script.Parent
local prompt = Instance.new("ProximityPrompt")
prompt.ActionText = "Open"
prompt.ObjectText = "Treasure Chest"
prompt.Parent = lid
local opened = {}
prompt.Triggered:Connect(function(player)
	if opened[player] then
		return
	end
	opened[player] = true
	stat(player, "Coins").Value += 25
	local fx = Instance.new("Sparkles")
	fx.Parent = lid
	game:GetService("Debris"):AddItem(fx, 3)
end)
'''

S["door"] = '''-- DOOR: press E to open and close.
local door = script.Parent
local prompt = Instance.new("ProximityPrompt")
prompt.ActionText = "Open"
prompt.ObjectText = "Door"
prompt.Parent = door
local open = false
prompt.Triggered:Connect(function()
	open = not open
	door.Transparency = open and 0.75 or 0
	door.CanCollide = not open
	prompt.ActionText = open and "Close" or "Open"
end)
'''

S["portal"] = '''-- PORTALS: step in one, come out of the other.
local model = script.Parent
local a = model:WaitForChild("PortalA")
local b = model:WaitForChild("PortalB")
local cooldown = {}
local function link(from, to)
	from.Touched:Connect(function(hit)
		local character = hit.Parent
		if character and character:FindFirstChildOfClass("Humanoid") and not cooldown[character] then
			cooldown[character] = true
			character:PivotTo(to.CFrame * CFrame.new(0, 0, -6))
			task.wait(1.5)
			cooldown[character] = nil
		end
	end)
end
link(a, b)
link(b, a)
'''

S["lasergate"] = '''-- LASER GATE: blinks on and off. Time your run!
local laser = script.Parent
local ON_TIME = 1.5
local OFF_TIME = 1.5
local on = true
laser.Touched:Connect(function(hit)
	local humanoid = hit.Parent and hit.Parent:FindFirstChildOfClass("Humanoid")
	if humanoid and on then
		humanoid.Health = 0
	end
end)
while true do
	on = true
	laser.Transparency = 0.1
	task.wait(ON_TIME)
	on = false
	laser.Transparency = 0.9
	task.wait(OFF_TIME)
end
'''

GRIP = '''tool.GripPos = Vector3.new(0, 0, -1.5)
tool.GripForward = Vector3.new(-1, 0, 0)
tool.GripRight = Vector3.new(0, 1, 0)
tool.GripUp = Vector3.new(0, 0, 1)
'''

S["sword"] = '''-- SWORD: click to swing. Touch it to pick it up.
local tool = script.Parent
local handle = tool:WaitForChild("Handle")
local DAMAGE = 25
''' + GRIP + '''local swinging = false
local hitList = {}
tool.Activated:Connect(function()
	if swinging then
		return
	end
	swinging = true
	hitList = {}
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
	if humanoid and model ~= tool.Parent and not hitList[humanoid] then
		hitList[humanoid] = true
		humanoid:TakeDamage(DAMAGE)
	end
end)
'''

S["speedcoil"] = '''-- SPEED COIL: hold it to run fast.
local tool = script.Parent
local SPEED = 32
local humanoid = nil
tool.Equipped:Connect(function()
	humanoid = tool.Parent:FindFirstChildOfClass("Humanoid")
	if humanoid then
		humanoid.WalkSpeed = SPEED
	end
end)
tool.Unequipped:Connect(function()
	if humanoid then
		humanoid.WalkSpeed = 16
		humanoid = nil
	end
end)
'''

S["gravitycoil"] = '''-- GRAVITY COIL: hold it to float like you're on the moon.
local tool = script.Parent
local LIFT = 0.75 -- 0 = normal, 1 = no gravity at all
local force = nil
tool.Equipped:Connect(function()
	local root = tool.Parent:FindFirstChild("HumanoidRootPart")
	if root then
		local attachment = root:FindFirstChild("RootAttachment") or Instance.new("Attachment", root)
		force = Instance.new("VectorForce")
		force.Attachment0 = attachment
		force.RelativeTo = Enum.ActuatorRelativeTo.World
		force.Force = Vector3.new(0, root.AssemblyMass * workspace.Gravity * LIFT, 0)
		force.Parent = root
	end
end)
tool.Unequipped:Connect(function()
	if force then
		force:Destroy()
		force = nil
	end
end)
'''

S["potion"] = '''-- HEALING POTION: click to drink. Heals you fully.
local tool = script.Parent
tool.Activated:Connect(function()
	local humanoid = tool.Parent:FindFirstChildOfClass("Humanoid")
	if humanoid then
		humanoid.Health = humanoid.MaxHealth
		tool:Destroy()
	end
end)
'''

S["flashlight"] = '''-- FLASHLIGHT: click to turn on and off.
local tool = script.Parent
local handle = tool:WaitForChild("Handle")
tool.GripForward = Vector3.new(0, 0, -1)
local light = Instance.new("SpotLight")
light.Range = 40
light.Angle = 50
light.Brightness = 4
light.Face = Enum.NormalId.Front
light.Enabled = false
light.Parent = handle
tool.Activated:Connect(function()
	light.Enabled = not light.Enabled
end)
'''

S["pet"] = '''-- PET: touch it and it follows you forever (until you leave).
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local model = script.Parent
local body = model:WaitForChild("Body")
local owner = nil
body.Touched:Connect(function(hit)
	local player = Players:GetPlayerFromCharacter(hit.Parent)
	if player and not owner then
		owner = player
	end
end)
RunService.Heartbeat:Connect(function()
	local root = owner and owner.Character and owner.Character:FindFirstChild("HumanoidRootPart")
	if root then
		local bob = math.sin(os.clock() * 3) * 0.5
		local goal = root.CFrame * CFrame.new(3, 1 + bob, 4)
		body.CFrame = body.CFrame:Lerp(goal, 0.12)
	end
end)
Players.PlayerRemoving:Connect(function(player)
	if player == owner then
		owner = nil
	end
end)
'''

S["zombiespawner"] = '''-- ZOMBIE SPAWNER: makes a zombie every few seconds that chases the nearest player.
local Players = game:GetService("Players")
local spawner = script.Parent
local MAX_ZOMBIES = 5
local EVERY = 6
local alive = 0

local function nearest(position)
	local best, bestDist = nil, 120
	for _, player in ipairs(Players:GetPlayers()) do
		local char = player.Character
		local root = char and char:FindFirstChild("HumanoidRootPart")
		local hum = char and char:FindFirstChildOfClass("Humanoid")
		if root and hum and hum.Health > 0 then
			local d = (root.Position - position).Magnitude
			if d < bestDist then
				best, bestDist = char, d
			end
		end
	end
	return best, bestDist
end

local function spawnZombie()
	local desc = Instance.new("HumanoidDescription")
	local green = Color3.fromRGB(110, 170, 90)
	desc.HeadColor = green
	desc.LeftArmColor = green
	desc.RightArmColor = green
	desc.TorsoColor = Color3.fromRGB(70, 80, 110)
	desc.LeftLegColor = Color3.fromRGB(60, 50, 40)
	desc.RightLegColor = Color3.fromRGB(60, 50, 40)
	local zombie = Players:CreateHumanoidModelFromDescription(desc, Enum.HumanoidRigType.R15)
	zombie.Name = "Zombie"
	zombie:PivotTo(spawner.CFrame + Vector3.new(0, 5, 0))
	zombie.Parent = workspace
	local hum = zombie:FindFirstChildOfClass("Humanoid")
	local root = zombie:FindFirstChild("HumanoidRootPart")
	hum.WalkSpeed = 9
	root:SetNetworkOwner(nil)
	alive += 1
	hum.Died:Connect(function()
		alive -= 1
		game:GetService("Debris"):AddItem(zombie, 2)
	end)
	local lastHit = 0
	while zombie.Parent and hum.Health > 0 do
		local target, dist = nearest(root.Position)
		if target then
			hum:MoveTo(target.HumanoidRootPart.Position)
			if dist < 4.5 and os.clock() - lastHit > 1 then
				lastHit = os.clock()
				target:FindFirstChildOfClass("Humanoid"):TakeDamage(10)
			end
		end
		task.wait(0.25)
	end
end

while true do
	if alive < MAX_ZOMBIES then
		task.spawn(spawnZombie)
	end
	task.wait(EVERY)
end
'''

S["npc"] = '''-- TALKING NPC: press E to talk. Change the LINES to write your own story!
local Players = game:GetService("Players")
local LINES = {
	"Hi there, traveler!",
	"They say there's treasure at the top of the tower...",
	"Watch out for the lava. Trust me.",
	"Good luck, hero!",
}
local NAME = "Guide"
local stand = script.Parent
local desc = Instance.new("HumanoidDescription")
desc.HeadColor = Color3.fromRGB(255, 205, 150)
desc.TorsoColor = Color3.fromRGB(60, 120, 255)
desc.LeftArmColor = Color3.fromRGB(255, 205, 150)
desc.RightArmColor = Color3.fromRGB(255, 205, 150)
desc.LeftLegColor = Color3.fromRGB(40, 40, 60)
desc.RightLegColor = Color3.fromRGB(40, 40, 60)
local npc = Players:CreateHumanoidModelFromDescription(desc, Enum.HumanoidRigType.R15)
npc.Name = NAME
npc:PivotTo(stand.CFrame + Vector3.new(0, 4, 0))
npc.Parent = stand.Parent
npc.HumanoidRootPart.Anchored = true

local head = npc:WaitForChild("Head")
local bubble = Instance.new("BillboardGui")
bubble.Size = UDim2.new(0, 260, 0, 70)
bubble.StudsOffset = Vector3.new(0, 3, 0)
bubble.Enabled = false
bubble.Parent = head
local text = Instance.new("TextLabel")
text.Size = UDim2.new(1, 0, 1, 0)
text.BackgroundColor3 = Color3.new(1, 1, 1)
text.TextColor3 = Color3.new(0, 0, 0)
text.TextScaled = true
text.Font = Enum.Font.FredokaOne
text.Parent = bubble

local prompt = Instance.new("ProximityPrompt")
prompt.ActionText = "Talk"
prompt.ObjectText = NAME
prompt.Parent = head
local line = 0
prompt.Triggered:Connect(function()
	line = line % #LINES + 1
	text.Text = LINES[line]
	bubble.Enabled = true
	task.delay(4, function()
		if text.Text == LINES[line] then
			bubble.Enabled = false
		end
	end)
end)
'''

S["tycoonkit"] = STATS_HELPER + '''
-- MINI TYCOON KIT: claim it, then the dropper makes cash for you.
-- Copy "Dropper" parts to add more. Blocks go: Dropper -> Conveyor -> Collector.
local Players = game:GetService("Players")
local kit = script.Parent
local claim = kit:WaitForChild("ClaimPad")
local collector = kit:WaitForChild("Collector")
local conveyor = kit:WaitForChild("Conveyor")
local owner = nil
conveyor.AssemblyLinearVelocity = conveyor.CFrame.LookVector * 10

claim.Touched:Connect(function(hit)
	local player = Players:GetPlayerFromCharacter(hit.Parent)
	if player and not owner then
		owner = player
		stat(player, "Cash")
		claim.Color = Color3.fromRGB(255, 200, 40)
	end
end)

collector.Touched:Connect(function(hit)
	local worth = hit:GetAttribute("Worth")
	if worth then
		hit:SetAttribute("Worth", nil)
		hit:Destroy()
		if owner and owner.Parent then
			stat(owner, "Cash").Value += worth
		end
	end
end)

local function runDropper(dropper)
	task.spawn(function()
		while dropper.Parent do
			if owner then
				local drop = Instance.new("Part")
				drop.Size = Vector3.new(1, 1, 1)
				drop.Color = dropper.Color
				drop.Material = Enum.Material.Neon
				drop.Position = dropper.Position - Vector3.new(0, dropper.Size.Y / 2 + 1, 0)
				drop:SetAttribute("Worth", 1)
				drop.Parent = kit
				drop:SetNetworkOwner(nil)
				game:GetService("Debris"):AddItem(drop, 20)
			end
			task.wait(2)
		end
	end)
end

for _, child in ipairs(kit:GetChildren()) do
	if child.Name == "Dropper" then
		runDropper(child)
	end
end
kit.ChildAdded:Connect(function(child)
	if child.Name == "Dropper" then
		runDropper(child)
	end
end)
'''

S["shoppad"] = STATS_HELPER + '''
-- SHOP PAD: spend Coins to get faster. Change PRICE and SPEED!
local Players = game:GetService("Players")
local PRICE = 20
local SPEED = 28
local pad = script.Parent
local gui = Instance.new("BillboardGui")
gui.Size = UDim2.new(0, 200, 0, 50)
gui.StudsOffset = Vector3.new(0, 3, 0)
gui.AlwaysOnTop = true
gui.Parent = pad
local label = Instance.new("TextLabel")
label.Size = UDim2.new(1, 0, 1, 0)
label.BackgroundTransparency = 1
label.TextScaled = true
label.Font = Enum.Font.FredokaOne
label.TextColor3 = Color3.new(1, 1, 1)
label.TextStrokeTransparency = 0
label.Text = "Speed Upgrade: " .. PRICE .. " coins"
label.Parent = gui
local owned = {}
pad.Touched:Connect(function(hit)
	local player = Players:GetPlayerFromCharacter(hit.Parent)
	if not player or owned[player] then
		return
	end
	local coins = stat(player, "Coins")
	if coins.Value >= PRICE then
		owned[player] = true
		coins.Value -= PRICE
		local humanoid = hit.Parent:FindFirstChildOfClass("Humanoid")
		if humanoid then
			humanoid.WalkSpeed = SPEED
		end
		player.CharacterAdded:Connect(function(character)
			character:WaitForChild("Humanoid").WalkSpeed = SPEED
		end)
	end
end)
'''
