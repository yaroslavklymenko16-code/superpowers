// Creator Quest mission content. Rescue scripts are injected at build time into RESCUE[id].
window.MISSIONS = [
  {
    id: 1, key: "01-lava-tower", title: "Lava Tower", color: "#ff5a36", time: "45 min", stars: 1,
    badge: "Lava Lord",
    tagline: "Build a 25-stage obby with ONE prompt.",
    story: "The floor is lava. Literally. Your first mission: get Claude to build a giant rainbow tower that spirals out of a lava lake. You'll have a playable obby in under an hour.",
    builds: ["Lava lake that knocks you out", "25 rainbow stages in a spiral", "Elevators, spinning lasers, vanishing blocks", "Checkpoints + a Stage leaderboard", "Golden winner's pad at the top"],
    brain: {
      title: "What even IS AI?",
      text: [
        "Claude is an AI. It learned by reading a gigantic amount of writing, including tons of code.",
        "When you send a message, Claude writes back one small piece at a time, guessing what should come next. It's a super-powered prediction machine.",
        "That's why it's amazing at code (code has patterns!) but can also be confidently wrong. It doesn't know your game unless you tell it."
      ],
      quiz: [
        { q: "How does Claude write its answers?", options: ["It looks them up in a giant book", "It predicts the next words, piece by piece", "A human types them really fast"], answer: 1, explain: "Yep! Claude predicts what comes next, over and over, super fast." },
        { q: "Is Claude a person?", options: ["Yes, it's my friend", "No, it's a tool that predicts words", "Only on weekends"], answer: 1, explain: "Claude can be fun to talk to, but it's a tool, not a person." }
      ]
    },
    megaPrompt: "I'm making a Roblox game in Roblox Studio with my parent. Write ONE Script for ServerScriptService that builds a whole obby out of code when the game starts:\n- a big neon lava lake at the bottom that knocks players out\n- 25 rainbow platforms spiraling upward like a tower\n- some platforms move up and down, some have spinning laser bars that knock you out, some vanish when you step on them\n- a checkpoint every 5 stages that saves where you respawn\n- a Stage counter and a Wins counter on the leaderboard\n- a glowing golden winner's pad at the top that gives +1 Win\nMake sure every jump is possible with normal jump height. Put settings like the number of stages at the top so I can change them. Explain exactly where to paste it.",
    test: ["Climb to Stage 5 and see the checkpoint flag", "Fall in the lava and respawn at your checkpoint", "Reach the golden pad and get +1 Win"],
    bossBug: {
      intro: "This lava is supposed to knock players out... but it's HEALING them instead! Which line is the bug?",
      code: ["local lava = script.Parent", "lava.Touched:Connect(function(hit)", "\tlocal humanoid = hit.Parent:FindFirstChildOfClass(\"Humanoid\")", "\tif humanoid then", "\t\thumanoid.Health = 100", "\tend", "end)"],
      bug: 4,
      explain: "Health = 100 means FULL health. To knock someone out, set Health = 0."
    },
    powerups: [
      { name: "Mega Tower", prompt: "Change my obby so it has 60 stages and gets harder the higher you go." },
      { name: "Speedrun Timer", prompt: "Add a timer to my obby that starts when I leave the start platform and shows my finish time on the leaderboard." },
      { name: "Boss Stage", prompt: "Add a final stage before the winner's pad with a giant spinning wheel of lasers I have to jump through." }
    ],
    copilot: "Ask: \"How is Claude different from a friend?\""
  },
  {
    id: 2, key: "02-coin-rush", title: "Coin Rush", color: "#ffc83d", time: "50 min", stars: 2,
    badge: "Coin Collector",
    tagline: "Coins, a shop, power-ups and a Gold Rain event.",
    story: "Every great game has stuff to collect and stuff to buy. Build a world where coins spin everywhere, gold rains from the sky every minute, and a shop sells Speed Boots, Moon Jump and Giant Mode.",
    builds: ["Spinning coins that keep spawning", "Rare diamond coins worth 5", "GOLD RAIN event with countdown", "A shop: Speed Boots, Moon Jump, Giant Mode", "Coins that save when you leave"],
    brain: {
      title: "Prompt Power",
      text: [
        "A prompt is the message you send to an AI. Better prompts = better games.",
        "Claude only knows what you tell it. \"Make coins\" leaves a LOT of guessing. How many? Where? What happens when you touch one?",
        "Pro prompt formula: say WHAT you want, WHERE it goes, and HOW it should behave. Give context like \"I'm making a Roblox game\"."
      ],
      quiz: [
        { q: "Which prompt will get a better result?", options: ["make shop", "Write a Roblox script for ServerScriptService that makes a shop pad. Touching it costs 10 coins and makes the player run faster."], answer: 1, explain: "The second one says what, where and how. Claude doesn't have to guess." },
        { q: "Why does context (like \"I'm making a Roblox game\") help?", options: ["It doesn't matter", "It tells Claude what kind of code and language to use", "It makes Claude type faster"], answer: 1, explain: "Context points Claude at the right patterns: Roblox, Luau, Studio." }
      ]
    },
    megaPrompt: "I'm making a Roblox game in Roblox Studio. Write ONE Script for ServerScriptService that:\n- spawns spinning gold coins at random spots on the map (max 40 at a time) and keeps topping them up\n- 1 in 10 coins is a rare diamond coin worth 5\n- shows a Coins counter on the leaderboard\n- every 60 seconds runs a GOLD RAIN event: a countdown sign in the sky, then 30 coins fall from the sky\n- builds 3 glowing shop pads with floating labels: Speed Boots (10 coins), Moon Jump (25), Giant Mode (50). Touching a pad buys it if you have enough coins, and you keep it after you respawn\n- saves coins and items with DataStoreService, wrapped in pcall so it doesn't crash in Studio\nPut settings at the top and explain where to paste it.",
    test: ["Collect 10 coins and buy Speed Boots", "Wait for GOLD RAIN and grab the falling coins", "Respawn and check you still have your power-ups"],
    bossBug: {
      intro: "You touch a coin... and your score doesn't go up. The Output says \"Coin is not a valid member of Folder\". Which line is the bug?",
      code: ["local coin = script.Parent", "local Players = game:GetService(\"Players\")", "coin.Touched:Connect(function(hit)", "\tlocal player = Players:GetPlayerFromCharacter(hit.Parent)", "\tif player then", "\t\tplayer.leaderstats.Coin.Value += 1", "\t\tcoin:Destroy()", "\tend", "end)"],
      bug: 5,
      explain: "The leaderboard value is called \"Coins\" (with an s). Names must match EXACTLY."
    },
    powerups: [
      { name: "Daily Reward", prompt: "Add a daily reward to my game: once every 24 hours, players get 100 coins when they join. Save the time with DataStoreService." },
      { name: "Coin Magnet", prompt: "Add a fourth shop item called Coin Magnet for 100 coins that pulls nearby coins toward the player." },
      { name: "Shop Menu", prompt: "Replace my shop pads with a shop button on the screen that opens a menu with buy buttons. Use a RemoteEvent so buying happens on the server." }
    ],
    copilot: "Ask: \"What made your second prompt better than your first?\""
  },
  {
    id: 3, key: "03-tycoon-factory", title: "Tycoon Factory", color: "#36d67a", time: "60 min", stars: 2,
    badge: "Tycoon Tycoon",
    tagline: "Droppers, conveyors, upgrades. Build an empire.",
    story: "Tycoon games are some of the most popular games on Roblox. Now you'll build one: claim a factory, watch droppers make cash, and buy upgrades until you unlock the Golden Statue.",
    builds: ["Claim pad: the factory becomes yours", "Droppers that drop glowing blocks", "Conveyor belt and cash collector", "7 upgrades unlocked in order", "x2 Upgrader gate and MEGA Dropper"],
    brain: {
      title: "Break It Down",
      text: [
        "A tycoon has a LOT of moving parts. Pro developers (and AI) do better when big jobs are split into small steps.",
        "Dropper -> conveyor -> collector -> cash -> buttons -> upgrades. Each piece can be built and tested on its own.",
        "When something breaks, test one piece at a time. Is the dropper dropping? Is the belt moving? Is the collector collecting?"
      ],
      quiz: [
        { q: "Your tycoon isn't giving you cash. What's the best move?", options: ["Ask Claude to rewrite the entire game", "Test each piece: are blocks dropping? Moving? Reaching the collector?", "Delete everything and start over"], answer: 1, explain: "Find which piece is broken, then fix just that piece." },
        { q: "Why split a big game into small steps?", options: ["Small steps are easier to build, test and fix", "Because AI can only write 3 lines", "It's not useful"], answer: 0, explain: "Small steps = fewer bugs and easier fixes." }
      ]
    },
    megaPrompt: "I'm making a tycoon game in Roblox Studio. Write ONE Script for ServerScriptService that builds a whole tycoon:\n- a factory floor with a green CLAIM pad. The first player to touch it owns the factory\n- a dropper that drops a glowing block every 2 seconds onto a conveyor belt (use AssemblyLinearVelocity on an anchored part to move blocks)\n- a collector at the end that destroys blocks and gives the owner Cash on the leaderboard\n- buy buttons with floating price labels that appear one after another: Dropper #2 ($25), Fast Conveyor ($60), x2 Upgrader gate ($100), MEGA Dropper worth 10 per block ($250), Factory Walls ($400), Roof + Lights ($600), Golden Statue ($1500)\n- each button only works for the owner and disappears after you buy it\nPut prices at the top so I can change them. Explain where to paste it.",
    test: ["Claim the factory and earn your first $25", "Buy the x2 Upgrader and watch blocks turn purple", "Save up for the Golden Statue"],
    bossBug: {
      intro: "Blocks reach the collector, but your cash goes DOWN instead of up! Find the bug.",
      code: ["collector.Touched:Connect(function(hit)", "\tlocal worth = hit:GetAttribute(\"Worth\")", "\tif worth then", "\t\thit:Destroy()", "\t\towner.leaderstats.Cash.Value -= worth", "\tend", "end)"],
      bug: 4,
      explain: "-= takes cash away. It should be += to add the block's worth."
    },
    powerups: [
      { name: "Rebirth", prompt: "Add a Rebirth button to my tycoon for $5000 that resets the factory but gives a permanent x2 cash multiplier shown on the leaderboard." },
      { name: "Two Players", prompt: "Change my tycoon so there are 4 factory plots side by side and each player can claim their own." },
      { name: "Auto Save", prompt: "Save the owner's Cash and which buttons they bought with DataStoreService, and rebuild their factory when they come back." }
    ],
    copilot: "Ask: \"What's a big job at home we could break into small steps?\""
  },
  {
    id: 4, key: "04-zombie-night", title: "Zombie Night", color: "#7cc642", time: "60 min", stars: 3,
    badge: "Zombie Slayer",
    tagline: "Swords, zombie waves, and GIANT bosses.",
    story: "It's midnight in the graveyard. Zombies are rising in waves, and every 5th wave a GIANT zombie stomps in. Give every player a sword and see how long you can survive.",
    builds: ["Spooky midnight graveyard with fog", "A sword every player spawns with", "Zombies that chase the closest player", "Waves that get bigger each round", "A GIANT zombie every 5th wave"],
    brain: {
      title: "AI Makes Mistakes",
      text: [
        "AI code can look perfect and still be broken. AI can mix up names, forget a step, or invent things that don't exist. That's called a hallucination.",
        "Real developers ALWAYS test. Press Play and check that every part works.",
        "When something breaks: copy the red error from Output AND your code, and send both to Claude. You're the detective. Claude is your assistant."
      ],
      quiz: [
        { q: "Claude says the code is perfect, but Output shows a red error. Who's right?", options: ["Claude, it's an AI", "The error. Code that crashes is broken, no matter who wrote it", "Nobody"], answer: 1, explain: "Testing beats guessing. Always trust what actually happens." },
        { q: "What should you send Claude to fix a bug?", options: ["\"it's broken\"", "The red error message AND your script", "Just a thumbs down"], answer: 1, explain: "The error message tells Claude exactly what went wrong and where." }
      ]
    },
    megaPrompt: "I'm making a zombie survival game in Roblox Studio. Write ONE Script for ServerScriptService that:\n- makes it night with green fog and builds a graveyard with random tombstones and glowing lanterns\n- gives every player a sword Tool when they spawn (use a toolanim StringValue set to \"Slash\" for the swing animation)\n- spawns zombies in waves using Players:CreateHumanoidModelFromDescription with green skin\n- zombies chase the closest player with Humanoid:MoveTo and hurt them when close\n- each wave has more zombies than the last, and every 5th wave adds a GIANT zombie (scaled up with Model:ScaleTo, 400 health)\n- a big floating sign shows the wave number and zombies left\n- Kills and Best Wave on the leaderboard\nPut settings at the top. Explain where to paste it.",
    test: ["Survive wave 3", "Beat a GIANT zombie on wave 5", "Check your Kills on the leaderboard"],
    bossBug: {
      intro: "The zombies spawn... and just stand there! They should chase you. Which line is the bug?",
      code: ["while zombie.Parent and humanoid.Health > 0 do", "\tlocal target = nearestCharacter(root.Position)", "\tif target then", "\t\thumanoid:MoveTo(root.Position)", "\tend", "\ttask.wait(0.25)", "end"],
      bug: 3,
      explain: "root.Position is the zombie's OWN position, so it walks to where it already is! It should be target.HumanoidRootPart.Position."
    },
    powerups: [
      { name: "Zombie Types", prompt: "Add two new zombie types to my game: fast runner zombies (red, low health) and tank zombies (big, slow, lots of health)." },
      { name: "Upgrade Shop", prompt: "Give players coins for each kill and add a shop pad that upgrades sword damage for 50 coins." },
      { name: "Safe House", prompt: "Build a small safe house in the middle of the map with a door that closes during waves and opens between them." }
    ],
    copilot: "Ask: \"When could AI be wrong about something besides code?\""
  },
  {
    id: 5, key: "05-pet-hatchery", title: "Pet Hatchery", color: "#ff5fa8", time: "55 min", stars: 3,
    badge: "Lucky Hatcher",
    tagline: "Hatch eggs. Collect pets. Chase the 1% MYTHIC.",
    story: "Pets are everywhere in Roblox, and now you'll know how they really work. Collect gems, hatch mystery eggs, and get pets that float behind you and multiply your gems. Can you hatch a 1-in-100 MYTHIC?",
    builds: ["Gems that spawn all over the map", "A mystery egg that shakes when it hatches", "5 rarities: Common to MYTHIC", "8 pet types built from parts", "Pets that follow you and boost gems"],
    brain: {
      title: "Chance & Patterns",
      text: [
        "Egg rarity is chance: a 1% Mythic means about 1 egg in 100. Your rarity table is literally the odds.",
        "AI uses chance too! When Claude picks the next word, it doesn't always pick the same one. That's why the same prompt can give a different answer twice.",
        "And how did Claude learn coding patterns? From a huge number of examples during training. More examples = better pattern spotting."
      ],
      quiz: [
        { q: "Why can the same prompt give a different answer each time?", options: ["Claude is in a different mood", "Claude picks words with a bit of randomness, like rolling for egg rarity", "The internet changed"], answer: 1, explain: "A little randomness makes AI more creative, and less predictable." },
        { q: "If Mythic has a 1% chance, about how many eggs to get one?", options: ["About 10", "About 100", "Exactly 1"], answer: 1, explain: "1% is 1 in 100 on average. You might get lucky sooner, or later!" }
      ]
    },
    megaPrompt: "I'm making a pet simulator in Roblox Studio. Write ONE Script for ServerScriptService that:\n- spawns collectible gems around the map and shows Gems and Hatched on the leaderboard\n- builds a big mystery egg on a stand with a floating label. Touching it costs 15 gems and hatches a pet\n- uses a rarity table at the top: Common 60%, Rare 25%, Epic 10%, Legendary 4%, MYTHIC 1%, each with a color and a gem multiplier\n- builds each pet out of parts (a ball body, eyes, plus ears/horns/wings depending on the pet type) welded together\n- makes the egg shake before hatching and shows a big announcement of what you got\n- pets float and bob behind their owner, up to 3 pets, and multiply the gems you collect\nExplain where to paste it.",
    test: ["Hatch your first pet", "Get 3 pets following you", "Hatch an Epic or better (keep trying!)"],
    bossBug: {
      intro: "You've hatched 50 eggs and gotten ONLY Commons. Something's wrong with the dice! Find the bug.",
      code: ["local function rollRarity()", "\tlocal roll = math.random(1, 10)", "\tlocal total = 0", "\tfor _, rarity in ipairs(RARITIES) do", "\t\ttotal += rarity.chance", "\t\tif roll <= total then", "\t\t\treturn rarity", "\t\tend", "\tend", "end"],
      bug: 1,
      explain: "The chances add up to 100, but the roll only goes 1 to 10. That's always inside Common's 60! It should be math.random(1, 100)."
    },
    powerups: [
      { name: "Golden Pets", prompt: "Add a Golden Machine pad: put in 5 of the same pet and get one Golden version with double the boost." },
      { name: "Second Egg", prompt: "Add a second egg called the Lava Egg for 100 gems with better odds and fire-themed pets." },
      { name: "Pet Inventory", prompt: "Add a pet inventory menu on the screen where players can see all their pets and choose which 3 to equip. Use a RemoteEvent." }
    ],
    copilot: "Ask: \"Why might a game make Mythic pets SO rare?\""
  },
  {
    id: 6, key: "06-round-arena", title: "Round Arena", color: "#3d8bff", time: "60 min", stars: 4,
    badge: "Arena Champ",
    tagline: "A real minigame loop: lobby, countdown, survive!",
    story: "Lobby. Countdown. Teleport. Survive. That loop powers some of the biggest games ever made. Build an arena with two deadly modes, Falling Tiles and Rising Lava, and a timer on everyone's screen.",
    builds: ["Lobby with an intermission countdown", "A timer on every player's screen", "FALLING TILES mode", "RISING LAVA mode with steps to climb", "Wins for the last one standing"],
    brain: {
      title: "Stay Safe Online",
      text: [
        "Your private info stays private: full name, address, school, passwords, photos. Never type them into an AI or a game chat.",
        "In multiplayer games, you don't know who's really behind an avatar. If someone asks personal questions or makes you uncomfortable, tell a grown-up.",
        "AI is a tool, not a friend. It's fun to work with, but real friends and family are people."
      ],
      quiz: [
        { q: "Someone in your game asks what school you go to. What do you do?", options: ["Tell them, they seem nice", "Don't answer, and tell a grown-up", "Make up a school that's near yours"], answer: 1, explain: "Never share where you live or go to school. Telling a grown-up is the smart move." },
        { q: "Is it OK to type your home address into an AI chat?", options: ["Yes, AI keeps secrets", "No, keep personal info private", "Only if it asks nicely"], answer: 1, explain: "Keep personal info out of AI chats and games." }
      ]
    },
    megaPrompt: "I'm making a round-based minigame in Roblox Studio. Write ONE Script for ServerScriptService that runs a game loop forever:\n- a lobby SpawnLocation where players wait\n- a ScreenGui with a status label created for every player (ResetOnSpawn = false) that the server updates\n- a 10 second intermission countdown\n- builds a floating arena of colorful tiles high in the sky and teleports everyone onto it\n- picks a random mode: FALLING TILES (tiles turn orange and fall after you step on them) or RISING LAVA (lava rises from below and there are floating steps to climb)\n- the round ends when one player is left (or when the 60 second timer ends if you're playing solo)\n- winners get +1 Wins on the leaderboard, then everyone goes back to the lobby\nPut settings at the top. Explain where to paste it.",
    test: ["Play a FALLING TILES round", "Play a RISING LAVA round", "Win a round and get +1 Win"],
    bossBug: {
      intro: "The countdown never shows up. The round starts instantly every time! Which line is the bug?",
      code: ["for t = INTERMISSION, 1, 1 do", "\tsetStatus(\"Next round in \" .. t)", "\ttask.wait(1)", "end", "buildTiles()"],
      bug: 0,
      explain: "Counting DOWN from 10 to 1 needs a step of -1. With +1 the loop never runs at all."
    },
    powerups: [
      { name: "Third Mode", prompt: "Add a third mode to my arena called SPINNER, where a giant spinning laser bar sweeps across the tiles and you have to jump over it." },
      { name: "Spectate", prompt: "When a player is knocked out, move their camera to watch the remaining players until the round ends. Use a LocalScript and a RemoteEvent." },
      { name: "Map Vote", prompt: "Before each round, let players vote on the mode by standing on one of two glowing vote pads in the lobby." }
    ],
    copilot: "Ask: \"What would you do if someone online made you feel uncomfortable?\""
  },
  {
    id: 7, key: "07-boss-battle", title: "Boss Battle", color: "#ff8a2b", time: "60 min", stars: 5,
    badge: "Boss Breaker",
    tagline: "A giant boss with phases, meteors and a health bar.",
    story: "Every epic game needs an epic boss. Meet the Lava King: giant, angry, and armed with ground slams, meteor rain and a rage mode. Build him, then team up to take him down.",
    builds: ["Fiery arena with flaming pillars", "A giant boss (4x size)", "Boss health bar on every screen", "3 phases: SLAM, METEOR RAIN, RAGE", "Victory, rewards and a respawn timer"],
    brain: {
      title: "Feedback Loops",
      text: [
        "Nobody makes a perfect boss on the first try. Game studios playtest, tweak numbers, and playtest again. That's called iterating.",
        "AI works the same way. \"Make it better\" is vague. \"Lower BOSS_HEALTH to 1000 and make meteors fall half as often\" is a clear change you can test.",
        "Change ONE thing, test it, then change the next thing."
      ],
      quiz: [
        { q: "The boss is way too hard. Which prompt is best?", options: ["make it better", "Lower BOSS_HEALTH to 1000 and make meteors fall half as often", "make the boss easy and also add pets and a shop and fix everything"], answer: 1, explain: "Specific, small, testable changes win every time." },
        { q: "What's iterating?", options: ["Building, testing, and improving in small loops", "Getting it perfect on the first try", "Copying another game"], answer: 0, explain: "Build, test, tweak, repeat. That's how great games get made." }
      ]
    },
    megaPrompt: "I'm making a boss fight game in Roblox Studio. Write ONE Script for ServerScriptService that:\n- builds a round lava-rock arena with flaming pillars around the edge\n- gives every player a sword Tool when they spawn\n- spawns a giant boss called The Lava King (R15 model from a HumanoidDescription, scaled up 4x, red and orange) with 1500 health\n- shows a boss health bar ScreenGui on every player's screen that the server updates\n- has 3 phases: above 50% health it does GROUND SLAM shockwave rings you have to jump over; 20-50% it does METEOR RAIN with red warning circles where meteors will land; under 20% it goes into RAGE MODE, faster, doing both\n- when the boss dies, everyone gets +1 Boss Wins and the boss returns after 15 seconds\nPut the settings at the top. Explain where to paste it.",
    test: ["Jump over a shockwave", "Dodge the meteor rain", "Defeat the Lava King!"],
    bossBug: {
      intro: "The fight starts and the boss is INSTANTLY defeated without doing anything. Find the bug!",
      code: ["local model, hum = spawnBoss()", "while hum.Health < 0 do", "\tlocal target = randomTargetPlayerPosition()", "\thum:MoveTo(target)", "\tgroundSlam(model.HumanoidRootPart.Position)", "end", "print(\"VICTORY!\")"],
      bug: 1,
      explain: "Health starts at 1500, which is never less than 0, so the fight loop is skipped. It should be while hum.Health > 0 do."
    },
    powerups: [
      { name: "Boss Minions", prompt: "During phase 2, make the Lava King summon 3 small fire minions that chase players." },
      { name: "Power-Up Drops", prompt: "Every 20 seconds, drop a glowing power-up in the arena that gives the player who grabs it double sword damage for 10 seconds." },
      { name: "Your Own Boss", prompt: "Make a second boss for my game with a completely different theme and attacks. Here's my idea: [describe your boss]" }
    ],
    copilot: "Ask: \"What's something you got better at by practicing?\""
  },
  {
    id: 8, key: null, title: "Dream Game", color: "#b46bff", time: "2+ hours", stars: 5,
    badge: "Dream Maker",
    tagline: "Design YOUR game. Then publish it for real.",
    story: "This is it. You've built obbies, shops, tycoons, zombies, pets, minigames and bosses. Now you're the game designer. Mix your favorite ideas into your own game, publish it on Roblox, and get your family and friends to play.",
    builds: ["Your own game design", "Built from your favorite missions + the Creator Vault", "Playtested by real people", "Published on Roblox", "Your Creator Certificate"],
    brain: {
      title: "You're the Creator",
      text: [
        "AI wrote a lot of code for you. But YOU picked the ideas, wrote the prompts, tested, found bugs and decided what was fun. That's what a game designer does.",
        "Be original. Make up your own game name and characters. Don't copy other games' names, logos or art.",
        "Be proud AND honest: when you share your game, it's cool to say AI helped you build it."
      ],
      quiz: [
        { q: "Your friend wants to call their game \"Minecraft 2\". Good idea?", options: ["Sure, more people will click", "No, make up your own original name", "Only if they add pets"], answer: 1, explain: "Other games' names belong to them. Your own name is way cooler anyway." },
        { q: "Who's the game designer when you build with Claude?", options: ["Claude", "You! You make the decisions", "Roblox"], answer: 1, explain: "Claude is your tool. You're the creator." }
      ]
    },
    megaPrompt: null,
    test: ["Get one family member to playtest without your help", "Fix the #1 thing they got stuck on", "Publish: File > Publish to Roblox"],
    bossBug: null,
    powerups: [
      { name: "Game Icon", prompt: "Give me 5 ideas for a cool game icon and thumbnail for my game, [game name]. Describe what's in each picture." },
      { name: "Game Description", prompt: "Write a short, exciting game description for my Roblox game: [describe your game]. Keep it kid-friendly." },
      { name: "Update Plan", prompt: "I just published my game [describe it]. Suggest 5 updates I could add next, from easiest to hardest." }
    ],
    copilot: "Grown-up: help set who can play in Game Settings on create.roblox.com (start with Friends only)."
  }
];

window.PROMPT_LAB = [
  { goal: "You want a part that turns invisible when touched.", options: ["make invisible", "Write a Roblox script that goes inside a Part. When a player touches it, the part becomes invisible for 3 seconds, then comes back.", "Roblox invisible thing please"], answer: 1, why: "It says WHERE (inside a Part), WHAT (invisible) and HOW (3 seconds, then back)." },
  { goal: "Your script has a red error.", options: ["It doesn't work. Fix it.", "Fix my code", "Here's the error from Output: [error]. Here's my script: [script]. What's wrong?"], answer: 2, why: "Claude needs the actual error and the code to find the problem." },
  { goal: "You want to learn, not just copy.", options: ["Explain this script line by line like I'm 10: [script]", "Write it for me", "Is this good?"], answer: 0, why: "Asking for an explanation turns copying into learning." },
  { goal: "The jump pad launches you way too high.", options: ["jump pad bad", "Make it better", "In my jump pad script, lower the launch power by half. Show me the full updated script."], answer: 2, why: "One specific change. Easy to test!" },
  { goal: "You need ideas for a new obby stage.", options: ["Give me 5 ideas for a fun obby stage that's easy to build in Roblox Studio.", "ideas", "Make my game popular"], answer: 0, why: "A clear ask with a number and a limit gets great ideas." },
  { goal: "You want Claude to give a hint, not the answer.", options: ["Answer pls", "Don't give me the answer. Give me a hint so I can figure out why my coin isn't adding to my score.", "Fix coin"], answer: 1, why: "You can ask Claude to coach you instead of solving it for you." }
];

window.RANKS = ["Noob Builder", "Block Stacker", "Script Kid", "Bug Hunter", "Prompt Wizard", "Game Dev", "Studio Boss", "Legendary Creator"];

window.DREAM = {
  genre: ["Obby", "Tycoon", "Survival", "Pet Simulator", "Minigames", "Boss Rush", "Adventure", "Racing"],
  theme: ["Candy Land", "Outer Space", "Haunted Castle", "Underwater", "Jungle", "Volcano", "Sky Islands", "Robot City"],
  twist: ["gravity flips every 30 seconds", "you can only jump 3 times per stage", "the map slowly shrinks", "pets help you fight", "everything is giant", "it's always night", "every win makes you faster", "there's a secret room"]
};
