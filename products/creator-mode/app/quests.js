// Skill Quests: 3 short lessons before each big game (Missions 2-8). Each one prepares for the next game.
// icon: model | code | look | ai
window.QUESTS = [
  // ---- Unit 0: warm-up before Mission 1 ----
  {
    id: "0a", before: 1, icon: "look", title: "Get Your Tools", time: "15 min",
    learn: "Install the two free apps you'll build with: Roblox Studio and Claude.",
    know: [
      "Every Roblox game, even the giant ones, was built in Roblox Studio. It's free, and it runs on a Windows PC or a Mac.",
      "Claude is the AI that will build with you. It lives in the Claude Desktop app on the same computer.",
      "Claude is for grown-ups (18+), so it runs on your grown-up's account. You're the game designer: you decide what Claude builds!"
    ],
    prompt: null,
    steps: [
      { t: "Grown-up: download Roblox Studio from create.roblox.com, install it and log in." },
      { t: "Grown-up: download the Claude Desktop app from claude.ai/download and sign in." },
      { t: "Open Studio. Click New, then the Baseplate template.", fig: "new" }
    ],
    check: { q: "Where are Roblox games built?", options: ["In the Roblox app on a phone", "In Roblox Studio on a computer", "In a web browser game"], answer: 1, explain: "Roblox Studio on a PC or Mac. You've got it now!" }
  },
  {
    id: "0b", before: 1, icon: "look", title: "Studio Tour", time: "10 min",
    learn: "Find the panels you'll watch while Claude builds.",
    know: [
      "Explorer is the list of everything in your game. When Claude adds scripts and parts, they show up here.",
      "Properties shows the settings of whatever you click: color, size, material...",
      "Output is where messages and errors show up. Claude can read it too, to find and fix bugs."
    ],
    prompt: null,
    steps: [
      { t: "Click the View tab and turn on Explorer, Properties and Output.", fig: "panels" },
      { t: "Find ServerScriptService in the Explorer. That's where Claude puts game scripts.", fig: "explorer" },
      { t: "On the Home tab click Part. Then change its Color and Material in Properties.", fig: "properties" },
      { t: "Press Play to walk around your world. Press Stop to go back to building.", fig: "play" }
    ],
    check: { q: "Which panel shows errors when something breaks?", options: ["Properties", "Output", "Toolbox"], answer: 1, explain: "Output! Red text there means something needs fixing. Claude checks it too." }
  },
  {
    id: "0c", before: 1, icon: "ai", title: "Connect Claude to Studio", time: "10 min",
    learn: "Plug Claude into Roblox Studio so it can build for you.",
    know: [
      "Roblox Studio has a built-in connector (called an MCP server) that lets Claude work inside Studio.",
      "Once it's on, Claude can add scripts, build parts, insert models, press Play and read errors, all by itself.",
      "Every change happens through Claude. Your job: describe what you want, test it, and say what to fix."
    ],
    prompt: null,
    steps: [
      { t: "In Studio, open the Assistant. Click the ⋯ menu and choose Manage MCP Servers. Turn on Enable Studio as MCP server.", fig: "mcp" },
      { t: "Under Quick connect, switch on Claude Desktop.", fig: "mcp" },
      { t: "Restart Claude Desktop and Roblox Studio. Open your Baseplate again." },
      { t: "Check for the green light under Enable Studio as MCP server. That means Claude is connected!", fig: "mcp" }
    ],
    check: { q: "What does the Studio connector let Claude do?", options: ["Play Roblox games for you", "Build and test inside Roblox Studio", "Change your Roblox password"], answer: 1, explain: "Claude can build, test and fix your game right inside Studio." }
  },
  {
    id: "0d", before: 1, icon: "ai", title: "Hello, Claude", time: "15 min",
    learn: "Your first build: you describe it, Claude makes it in Studio.",
    know: [
      "Now Claude can see your Studio place. You type what you want, Claude builds it.",
      "Sometimes Claude asks permission to use a Studio tool. Your grown-up clicks Allow.",
      "Then YOU test it. Press Play and check it does what you asked. You're the boss!"
    ],
    prompt: "Hi Claude! I'm learning to make Roblox games with my parent. You're connected to my open Roblox Studio place. First, tell me what's in it right now. Then build a big glowing Neon block floating above the spawn that changes to a random color every second and slowly spins. Playtest it, check for errors, and tell me when it's ready.",
    steps: [
      { t: "Grown-up: send the prompt in Claude Desktop.", fig: "claude" },
      { t: "If Claude asks to use a Roblox Studio tool, the grown-up clicks Allow.", fig: "allow" },
      { t: "Watch the Explorer: Claude's new script appears in ServerScriptService!", fig: "explorer" },
      { t: "Press Play. Is your block glowing and spinning?", fig: "play" },
      { t: "Ask Claude for one change, like \"make it twice as big\". Watch it update!" }
    ],
    check: { q: "Who makes the changes to your game?", options: ["I copy and paste code", "Claude builds it in Studio, and I test it and decide what's next", "Nobody"], answer: 1, explain: "Claude builds, you design and test. A great team!" }
  },
  // ---- before Mission 2: Coin Rush ----
  {
    id: "2a", before: 2, icon: "model", title: "Model Maker: Detail Boost", time: "15 min",
    learn: "Turn a plain block into a detailed model, just by describing it.",
    know: [
      "Claude can build 3D models out of parts with code. The secret is describing it like an artist.",
      "Say the SHAPE (cylinder, ball, block), SIZE, COLOR, MATERIAL (Neon, Foil, Wood, Glass) and EXTRAS (glow, sparkles, a pattern).",
      "\"Make a coin\" gets a boring disc. \"A thick gold Foil coin with a raised rim, a neon star on the front and a soft glow\" gets treasure."
    ],
    prompt: "In my open Roblox Studio place, add a Script to ServerScriptService that builds a detailed treasure coin out of parts, floating at position (0, 6, 0):\n- a thick gold cylinder with Foil material\n- a thinner raised rim around the edge in a darker gold\n- a 5-pointed star on the front made of small yellow Neon parts\n- a PointLight so it glows, and Sparkles\nWeld all the parts together into a Model called FancyCoin and make it spin slowly. Then playtest it and fix any errors.",
    steps: ["Send the prompt and watch Claude build it in Studio. Then press Play", "Ask Claude to add ONE more detail you choose (gems? a crown? a pattern?)", "Compare: build a plain coin with \"make a coin\". Which looks cooler?"],
    check: { q: "Which prompt gets a more detailed model?", options: ["make a sword", "A sword with a glowing blue Neon blade, a gold Foil handle wrapped in black stripes, and a red gem on the hilt"], answer: 1, explain: "Shape, color, material and extras. That's how you get detail." }
  },
  {
    id: "2b", before: 2, icon: "code", title: "Leaderboard Lab", time: "10 min",
    learn: "Make your own scoreboard in the top-right corner.",
    know: [
      "Roblox has a built-in leaderboard. To use it, you put a Folder named exactly \"leaderstats\" inside a player.",
      "Every number value inside that folder (like Coins or Points) shows up on the scoreboard.",
      "You'll need this for coins, cash, kills, wins... almost every game!"
    ],
    prompt: "In my open Roblox Studio place, add a Script to ServerScriptService that gives every player a leaderboard with Points and Level. Also build a big glowing button part at (0, 1, -15). Every time a player touches it they get +1 Point (only once per second), and every 10 Points they go up 1 Level. Explain how leaderstats works. Playtest it when you're done.",
    steps: ["Send the prompt and watch Claude build it in Studio. Then press Play", "Touch the button until you reach Level 2", "Ask Claude to add a third stat of your choice"],
    check: { q: "What must the leaderboard folder be named?", options: ["Scoreboard", "leaderstats", "Points"], answer: 1, explain: "Exactly \"leaderstats\", all lowercase, or the scoreboard won't show." }
  },
  {
    id: "2c", before: 2, icon: "look", title: "Floating Signs", time: "10 min",
    learn: "Put floating text over things, like price tags in a shop.",
    know: [
      "A BillboardGui is a little screen that floats in the 3D world and always faces you.",
      "Put a TextLabel inside it and you get name tags, price tags, warnings and signs.",
      "Shop pads in your next game will use these to show prices!"
    ],
    prompt: "In my open Roblox Studio place, add a Script to ServerScriptService that builds 3 colorful pads in a row near the spawn. Each pad has a floating BillboardGui label above it: \"Speed Shop\", \"Jump Shop\" and \"Mystery Box\", in big bold text with a black outline. Make the labels gently bob up and down. Playtest it when you're done.",
    steps: ["Send the prompt and watch Claude build it in Studio. Then press Play", "Walk around the signs. Do they always face you?", "Ask Claude to change the font and add a price line under each name"],
    check: { q: "What does a BillboardGui do?", options: ["Plays music", "Shows text or images floating in the 3D world", "Saves your coins"], answer: 1, explain: "Perfect for name tags, prices and signs." }
  },

  // ---- before Mission 3: Tycoon Factory ----
  {
    id: "3a", before: 3, icon: "code", title: "Loop Machine", time: "10 min",
    learn: "Use loops to make things happen over and over.",
    know: [
      "A loop repeats code. while true do ... end repeats forever. Always put task.wait() inside, or the game freezes!",
      "Spawning lots of parts can make a game laggy. Clean them up with Debris:AddItem(part, seconds).",
      "Tycoon droppers are just loops that make a part every few seconds."
    ],
    prompt: "In my open Roblox Studio place, add a Script to ServerScriptService that builds a ball fountain: a stone base at (0, 1, -20) that shoots a random-colored Neon ball upward every 0.3 seconds. Each ball disappears after 5 seconds using Debris. Put SPEED and COLORS settings at the top. Playtest it when you're done.",
    steps: ["Send the prompt and watch Claude build it in Studio. Then press Play", "Change the wait time to make it faster. What happens?", "Ask Claude to make the fountain switch between two colors every 10 seconds"],
    check: { q: "What happens if a while true loop has no task.wait()?", options: ["Nothing", "The game freezes", "It runs slower"], answer: 1, explain: "Without a wait, the loop never lets the game breathe. Freeze!" }
  },
  {
    id: "3b", before: 3, icon: "code", title: "Conveyor Science", time: "10 min",
    learn: "Move things with physics: conveyors, slides and push pads.",
    know: [
      "An anchored part doesn't move, but you can give it a velocity with AssemblyLinearVelocity. Anything sitting on it gets pushed!",
      "That's exactly how tycoon conveyor belts work.",
      "Unanchored parts fall and roll. Anchored parts stay put."
    ],
    prompt: "In my open Roblox Studio place, add a Script to ServerScriptService that builds a conveyor belt course: 4 dark conveyor parts in a square loop with yellow side rails, each pushing in the next direction using AssemblyLinearVelocity, so anything on it goes around and around. Drop 5 unanchored crates on it to test. Playtest it when you're done.",
    steps: ["Send the prompt and watch Claude build it in Studio. Then press Play", "Stand on the conveyor and ride it", "Ask Claude to add a speed-up section that's twice as fast"],
    check: { q: "How does a conveyor push things without moving itself?", options: ["It's anchored but has a velocity set", "It uses magic", "It's unanchored and rolls"], answer: 0, explain: "Anchored + AssemblyLinearVelocity = conveyor." }
  },
  {
    id: "3c", before: 3, icon: "model", title: "Model Maker: Factory Machines", time: "15 min",
    learn: "Build detailed machines in layers.",
    know: [
      "Pro builders work in layers: 1) the big base shape, 2) details like pipes and panels, 3) lights, 4) effects like smoke or sparks.",
      "Ask Claude for one layer at a time, then look at it before adding the next.",
      "Hazard stripes, rivets and glowing windows make machines look real."
    ],
    prompt: "In my open Roblox Studio place, add a Script to ServerScriptService that builds a detailed factory dropper machine out of parts at (0, 0, -20): a metal box body on 4 legs, a glass window on the front with a glowing orange inside, pipes on the top, yellow and black hazard stripes along the bottom, a red warning light that blinks, and Smoke coming out of a chimney. Group it into a Model called Dropper. Playtest it when you're done.",
    steps: ["Send the prompt and watch Claude build it in Studio. Then press Play", "Ask Claude to add one more layer of detail", "Insert the Mini Tycoon Kit from the Creator Vault and compare"],
    check: { q: "What's the best order to build a detailed model?", options: ["Effects first, then the shape", "Big shape, then details, then lights, then effects", "All at once"], answer: 1, explain: "Big to small. Layers keep it tidy." }
  },

  // ---- before Mission 4: Zombie Night ----
  {
    id: "4a", before: 4, icon: "look", title: "Mood Lighting", time: "10 min",
    learn: "Change the time of day, fog and colors to set the mood.",
    know: [
      "The Lighting service controls the sky. ClockTime sets the hour (0 = midnight, 12 = noon).",
      "Fog, Atmosphere and Ambient colors make a game feel spooky, cozy or epic.",
      "Mood matters! A zombie game at noon isn't scary."
    ],
    prompt: "In my open Roblox Studio place, add a Script to ServerScriptService that makes a full day-night cycle: one full day every 2 minutes. At night, add purple fog and turn on glowing lamp posts around the spawn. At sunrise, the fog fades away and the lamps turn off. Playtest it when you're done.",
    steps: ["Send the prompt and watch Claude build it in Studio. Then press Play. Watch a full day!", "Change the cycle to 1 minute", "Ask Claude for a \"spooky mode\" with green fog that's always night"],
    check: { q: "What ClockTime is midnight?", options: ["12", "0", "24 only"], answer: 1, explain: "ClockTime 0 is midnight, 12 is noon." }
  },
  {
    id: "4b", before: 4, icon: "code", title: "Tool Time", time: "15 min",
    learn: "Make items players can hold and use.",
    know: [
      "A Tool is something players hold, like a sword or a wand. It needs a part named exactly \"Handle\".",
      "When the player clicks, the tool's Activated event fires. That's where the magic happens.",
      "Put tools in StarterPack and every player gets one when they spawn."
    ],
    prompt: "In my open Roblox Studio place, add a Script to ServerScriptService that puts a Tool called Party Wand into StarterPack. The Handle is a thin glowing stick with a star on the tip. When you click, it shoots 10 tiny confetti parts out in front of you that fall and disappear after 3 seconds. Add a 1-second cooldown. Playtest it when you're done.",
    steps: ["Send the prompt and watch Claude build it in Studio. Then press Play", "Equip the wand (press 1) and click", "Ask Claude to make it shoot something else, like bubbles or fireworks"],
    check: { q: "What must the part a player holds be named?", options: ["Grip", "Handle", "Tool"], answer: 1, explain: "Tools need a part named Handle." }
  },
  {
    id: "4c", before: 4, icon: "ai", title: "NPC Buddy", time: "15 min",
    learn: "Make a character that walks around on its own.",
    know: [
      "NPCs are characters controlled by code, not players. Players:CreateHumanoidModelFromDescription makes one.",
      "Humanoid:MoveTo(position) tells it where to walk. An NPC's \"brain\" is a loop that keeps choosing where to go.",
      "Zombies are NPCs whose brain says: walk toward the closest player!"
    ],
    prompt: "In my open Roblox Studio place, add a Script to ServerScriptService that spawns a friendly NPC guard with a blue shirt. It patrols between 4 glowing marker parts in a square, waits 2 seconds at each one, and shows a floating name tag \"Guard Bob\". Use Players:CreateHumanoidModelFromDescription and Humanoid:MoveTo. Playtest it when you're done.",
    steps: ["Send the prompt and watch Claude build it in Studio. Then press Play", "Follow the guard around his patrol", "Ask Claude to make him wave or jump at each marker"],
    check: { q: "What makes an NPC walk to a spot?", options: ["Humanoid:MoveTo(position)", "Teleport()", "WalkSpeed = 0"], answer: 0, explain: "MoveTo tells the Humanoid where to walk." }
  },

  // ---- before Mission 5: Pet Hatchery ----
  {
    id: "5a", before: 5, icon: "code", title: "Lucky Dice", time: "10 min",
    learn: "Use random numbers and chance tables.",
    know: [
      "math.random(1, 6) picks a random whole number from 1 to 6, like rolling a dice.",
      "A chance table gives each thing its odds: Common 70, Rare 25, Legendary 5 (out of 100).",
      "Egg hatching, loot boxes and random events all use chance tables."
    ],
    prompt: "In my open Roblox Studio place, add a Script to ServerScriptService that builds a giant glowing dice block. When a player touches it (once every 2 seconds), it spins and lands on a random number 1-6 shown on a floating label. Rolling a 6 makes confetti burst out. Keep a Rolls counter on the leaderboard. Playtest it when you're done.",
    steps: ["Send the prompt and watch Claude build it in Studio. Then press Play", "Roll 10 times. How many sixes did you get?", "Ask Claude to add a chance table: 1% chance of a GOLDEN roll worth 100 points"],
    check: { q: "In a table of Common 70, Rare 25, Legendary 5, how rare is Legendary?", options: ["5 in 100", "5 in 10", "1 in 5"], answer: 0, explain: "5 out of 100, about 1 in 20 tries." }
  },
  {
    id: "5b", before: 5, icon: "look", title: "Smooth Moves", time: "10 min",
    learn: "Animate things smoothly with tweens.",
    know: [
      "TweenService slides a property from one value to another smoothly: position, size, color, transparency.",
      "TweenInfo sets how long it takes, the style (Bounce, Elastic, Sine) and whether it repeats.",
      "Floating pets, opening doors and bouncy buttons are all tweens."
    ],
    prompt: "In my open Roblox Studio place, add a Script to ServerScriptService that builds a tween showcase: a gem that floats up and down forever, a door that slides open when you touch it and closes after 3 seconds, and a button that grows bigger with a Bounce style when touched. Use TweenService for all of them. Playtest it when you're done.",
    steps: ["Send the prompt and watch Claude build it in Studio. Then press Play", "Try each one", "Ask Claude to change the gem's EasingStyle to Elastic. What changes?"],
    check: { q: "What does TweenService do?", options: ["Smoothly animates a property from one value to another", "Saves data", "Makes NPCs"], answer: 0, explain: "Tweens make movement smooth instead of jumpy." }
  },
  {
    id: "5c", before: 5, icon: "model", title: "Model Maker: Cute Creatures", time: "15 min",
    learn: "Design an adorable pet using shape tricks.",
    know: [
      "Cute design trick: a BIG head, a small body, big eyes set low on the face, and tiny limbs.",
      "Eyes look alive with a tiny white shine dot. Pink blush cheeks make anything cuter.",
      "Weld every part to the body so the pet moves as one piece."
    ],
    prompt: "In my open Roblox Studio place, add a Script to ServerScriptService that builds a cute pet out of parts at (0, 4, -12): a big round head, a small round body, huge black eyes set low with tiny white shine dots, pink blush cheeks, little ears, and a short tail. All parts welded to the head. Make it bob up and down. Name it after this animal: [your animal]. Playtest it when you're done.",
    steps: ["Pick an animal and send the prompt in Claude", "Press Play and check out your pet", "Ask Claude for a second version in a rare rainbow color"],
    check: { q: "Which makes a character look cuter?", options: ["Tiny head, big body", "Big head, small body, big eyes", "No eyes"], answer: 1, explain: "Big head + big eyes = cute. Game artists use this trick everywhere!" }
  },

  // ---- before Mission 6: Round Arena ----
  {
    id: "6a", before: 6, icon: "look", title: "Screen GUI", time: "10 min",
    learn: "Put text and buttons on the player's screen.",
    know: [
      "A ScreenGui shows things on the player's screen (not in the 3D world). It lives in the player's PlayerGui.",
      "TextLabels show text. Frames are boxes. UICorner rounds the corners.",
      "Timers, health bars and menus are all ScreenGuis."
    ],
    prompt: "In my open Roblox Studio place, add a Script to ServerScriptService that gives every player a ScreenGui with a rounded box at the top of the screen saying \"Welcome, [their name]!\" and below it a timer counting how many seconds they've played. Set ResetOnSpawn to false so it stays after respawning. Playtest it when you're done.",
    steps: ["Send the prompt and watch Claude build it in Studio. Then press Play", "Reset your character (Esc, Reset). Is the timer still there?", "Ask Claude to change the colors and add a rainbow border"],
    check: { q: "Where do ScreenGuis show up?", options: ["Floating over parts", "On the player's screen", "In the Output window"], answer: 1, explain: "ScreenGui = on screen. BillboardGui = in the world." }
  },
  {
    id: "6b", before: 6, icon: "code", title: "Teleporters", time: "10 min",
    learn: "Move players anywhere instantly.",
    know: [
      "Every part has a position in the world (X, Y, Z). Y is up!",
      "character:PivotTo(CFrame) teleports a whole character to a spot.",
      "Minigames teleport everyone from the lobby to the arena and back."
    ],
    prompt: "In my open Roblox Studio place, add a Script to ServerScriptService that builds 3 teleporter pads: a blue one at the spawn, a green one on a floating island high in the sky, and a red one on a tiny island far away. Each pad teleports you to the next one in the loop, with a 2-second cooldown and a sparkle effect. Playtest it when you're done.",
    steps: ["Send the prompt and watch Claude build it in Studio. Then press Play", "Ride the full teleporter loop", "Ask Claude to add a secret 4th teleporter hidden somewhere"],
    check: { q: "In Roblox, which direction is Y?", options: ["Left and right", "Up and down", "Forward and back"], answer: 1, explain: "Y is up. Bigger Y = higher in the sky." }
  },
  {
    id: "6c", before: 6, icon: "code", title: "Countdown Clock", time: "10 min",
    learn: "Build the timer that runs every round-based game.",
    know: [
      "To count down, use a for loop with a step of -1: for t = 10, 1, -1 do.",
      "Show the number on a big sign, wait 1 second, repeat. When it hits zero, something happens!",
      "Every round-based game is a countdown, a round, a winner, then repeat."
    ],
    prompt: "In my open Roblox Studio place, add a Script to ServerScriptService that builds a giant scoreboard sign near the spawn. It counts down from 10 to 0 in huge text, then shoots fireworks (Neon balls that fly up and pop), shows \"GO!\" for 3 seconds, and starts the countdown again forever. Playtest it when you're done.",
    steps: ["Send the prompt and watch Claude build it in Studio. Then press Play", "Watch two full countdowns", "Ask Claude to change the countdown to 30 and turn the text red for the last 5 seconds"],
    check: { q: "Which loop counts DOWN from 10 to 1?", options: ["for t = 10, 1, 1 do", "for t = 10, 1, -1 do", "for t = 1, 10 do"], answer: 1, explain: "Counting down needs a step of -1." }
  },

  // ---- before Mission 7: Boss Battle ----
  {
    id: "7a", before: 7, icon: "code", title: "Health & Damage", time: "10 min",
    learn: "Hurt, heal and show health bars.",
    know: [
      "Humanoid:TakeDamage(10) removes health (and respects force fields). Setting Health directly ignores them.",
      "MaxHealth is the top of the bar. You can make bosses with 1000+ health!",
      "A health bar is just a Frame whose width matches Health / MaxHealth."
    ],
    prompt: "In my open Roblox Studio place, add a Script to ServerScriptService that builds a training area: a training dummy NPC with 500 health and a floating health bar above its head that shrinks as it takes damage, a red damage pad that hurts you 10 per second, and a green healing pad. Give every player a simple sword to hit the dummy. The dummy respawns 5 seconds after it's defeated. Playtest it when you're done.",
    steps: ["Send the prompt and watch Claude build it in Studio. Then press Play", "Defeat the training dummy", "Ask Claude to make the health bar change from green to red as it drops"],
    check: { q: "How do you work out how full a health bar should be?", options: ["Health / MaxHealth", "Health + 10", "MaxHealth only"], answer: 0, explain: "250 / 500 = 0.5, so the bar is half full." }
  },
  {
    id: "7b", before: 7, icon: "look", title: "Special Effects", time: "15 min",
    learn: "Make things explode, sparkle, burn and glow.",
    know: [
      "ParticleEmitter shoots out tons of tiny images: sparks, smoke, magic dust.",
      "Fire, Smoke, Sparkles and PointLight add instant effects to any part.",
      "Explosion with BlastPressure = 0 looks cool without flinging everything."
    ],
    prompt: "In my open Roblox Studio place, add a Script to ServerScriptService that builds a magic effects garden: a portal ring with swirling purple ParticleEmitter sparks, a campfire with Fire and Smoke, a crystal that pulses its glow brighter and dimmer, and a button that makes a safe Explosion (BlastPressure 0) with a flash of light when touched. Playtest it when you're done.",
    steps: ["Send the prompt and watch Claude build it in Studio. Then press Play", "Try every effect", "Ask Claude to make the portal change color every few seconds"],
    check: { q: "How do you make an explosion that doesn't fling everything?", options: ["BlastPressure = 0", "Make it bigger", "Use Fire instead"], answer: 0, explain: "BlastPressure 0 = all the looks, none of the chaos." }
  },
  {
    id: "7c", before: 7, icon: "model", title: "Model Maker: Boss Design", time: "15 min",
    learn: "Design a boss that looks epic and scary.",
    know: [
      "Great bosses have a strong silhouette: you can tell what they are from their shadow alone. Think horns, a crown, giant shoulders.",
      "Give a boss a color theme (fire = red and orange, ice = blue and white) and a glowing weak spot.",
      "You can add parts like a crown or armor to a character by welding them on."
    ],
    prompt: "In my open Roblox Studio place, add a Script to ServerScriptService that spawns a giant boss character (scaled up 3x with Model:ScaleTo) using Players:CreateHumanoidModelFromDescription. Give it a theme: [fire / ice / robot / your idea]. Weld on extra parts to make a strong silhouette: a crown or horns, big shoulder armor, and a glowing Neon core on its chest. Make it stand on a stone platform and slowly turn to face the nearest player. Playtest it when you're done.",
    steps: ["Pick a theme and send the prompt in Claude", "Press Play and walk around your boss", "Ask Claude to add one more scary detail"],
    check: { q: "What makes a boss design easy to recognize?", options: ["A strong silhouette (big unique shape)", "Being gray", "Being small"], answer: 0, explain: "A great boss is recognizable from its shadow alone." }
  },

  // ---- before Mission 8: Dream Game ----
  {
    id: "8a", before: 8, icon: "look", title: "World Builder", time: "15 min",
    learn: "Generate islands, mountains and water with Terrain.",
    know: [
      "Terrain is Roblox's ground material: grass, sand, water, rock. It's smoother than parts.",
      "Code can paint terrain: workspace.Terrain:FillBall makes a hill, FillBlock makes a flat area.",
      "One prompt can build a whole world for your dream game."
    ],
    prompt: "In my open Roblox Studio place, add a Script to ServerScriptService that generates a tropical island with Terrain: a sand beach, grassy hills in the middle made with FillBall, a small rocky mountain, and ocean water all around. Then place 10 simple palm trees made of parts on the island. Remove the baseplate first. Playtest it when you're done.",
    steps: ["Send the prompt and watch Claude build it in Studio. Then press Play", "Explore your island and swim in the ocean", "Ask Claude for a different world: snowy, desert or volcano"],
    check: { q: "What's Terrain good for?", options: ["Smooth natural ground like grass, sand and water", "Leaderboards", "Saving data"], answer: 0, explain: "Terrain = landscapes. Parts = buildings and objects." }
  },
  {
    id: "8b", before: 8, icon: "ai", title: "Game Designer Brain", time: "15 min",
    learn: "Use Claude as your game design partner, not just a coder.",
    know: [
      "Every great game has a core loop: the thing you do again and again. Collect coins, buy upgrades, collect coins faster.",
      "Claude can interview you with questions to help shape your idea. You make the decisions.",
      "Write down your answers. That's your game design doc!"
    ],
    prompt: "I want to design my own Roblox game. Interview me like a game designer: ask me 6 questions, ONE at a time, and wait for my answer each time. Ask about the goal, the core loop, the rewards, the world, the challenge, and what makes it special. At the end, write a one-page game design doc from my answers.",
    steps: ["Send the prompt in Claude and answer every question", "Read your design doc out loud to your grown-up", "Save or print your design doc for the Dream Game mission"],
    check: { q: "What's a core loop?", options: ["The main thing you do again and again in a game", "A while true loop", "A roller coaster"], answer: 0, explain: "Core loop = what players repeat. Make it fun and the game is fun." }
  },
  {
    id: "8c", before: 8, icon: "ai", title: "Polish & Publish", time: "10 min",
    learn: "The small details that make a game feel finished.",
    know: [
      "Polish is the little stuff: a cool spawn area, sounds, a clear goal, a good name and icon.",
      "Playtesting is the best polish tool. Watch someone play and don't help them!",
      "Publishing: File > Publish to Roblox. Start with Friends only in Game Settings."
    ],
    prompt: "I'm about to publish my first Roblox game. Here's what it is: [describe your game]. Give me a polish checklist of the 10 most important small things to add or fix before publishing, from easiest to hardest, and 3 ideas for a game name that's totally original.",
    steps: ["Send the prompt (with your game idea) in Claude", "Pick your top 3 polish ideas", "Practice publishing: File > Publish to Roblox with a test place (Friends only)"],
    check: { q: "What's the best way to find what needs polish?", options: ["Watch someone else playtest without helping", "Ask nobody", "Publish and hope"], answer: 0, explain: "Playtesters find problems you'd never notice yourself." }
  }
];
