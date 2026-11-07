# Creator Mode: launch plan

**Product:** Creator Mode, a $29 download for kids 9–14 (with a grown-up co-pilot).
**Buyer:** parents of kids who spend a lot of time on Roblox. **User:** the kid.
**Hook:** stop playing Roblox, start building it. Screen time that produces something, plus AI skills.

## What's in the download (`dist/Creator-Mode.zip`)

| Item | What it is |
| --- | --- |
| **Creator Quest.html** | The kid-facing game. Opens in any browser, works offline (3D previews need internet). A Duolingo-style path of 29 steps (8 big games + 21 skill quests), XP + 10 ranks, daily streak, 14 badges, AI Brain quizzes, Boss Bug challenges, Prompt Lab mini-game, Dream Game Designer, Vault browser, certificate. Progress saves in the browser. |
| **Creator Vault/** | 118 Roblox models in 10 packs (.rbxmx, Insert from File). 46 have working scripts: checkpoints, jump pads, moving platforms, coins, gems, portals, follow-you pets, swords, coils, zombie spawner, talking NPC, mini tycoon. |
| **Rescue Scripts/** | A tested, single-script build of each of Missions 1–7. |
| **Parent Guide.pdf** | 5 pages: co-pilot rule, setup, mission list, troubleshooting, safety, Creator Hours chart. |

### The path
8 units. Each unit ends with a big game. From Unit 2 on, 3 skill quests (10–15 min: learn → try one prompt in Studio → one quiz question) come first and prepare for that game. Every unit has a "Model Maker" quest about getting detailed 3D models from prompts.

| Before | Skill quests |
| --- | --- |
| Coin Rush | Model Maker: Detail Boost · Leaderboard Lab · Floating Signs |
| Tycoon Factory | Loop Machine · Conveyor Science · Model Maker: Factory Machines |
| Zombie Night | Mood Lighting · Tool Time · NPC Buddy |
| Pet Hatchery | Lucky Dice · Smooth Moves (tweens) · Model Maker: Cute Creatures |
| Round Arena | Screen GUI · Teleporters · Countdown Clock |
| Boss Battle | Health & Damage · Special Effects · Model Maker: Boss Design |
| Dream Game | World Builder (terrain) · Game Designer Brain · Polish & Publish |

Quest content lives in `app/quests.js`.

### The big games (each builds a whole game system from one "Mega Prompt")
1. Lava Tower: 25-stage spiral obby (elevators, spinning lasers, vanishing blocks, checkpoints, win pad). *AI = prediction.*
2. Coin Rush: coins, Gold Rain event, shop with Speed Boots/Moon Jump/Giant Mode, saving. *Prompting.*
3. Tycoon Factory: claim, droppers, conveyor, collector, 7 upgrades, Golden Statue. *Break it down.*
4. Zombie Night: swords, zombie waves, giant zombies. *AI makes mistakes.*
5. Pet Hatchery: eggs, 5 rarities, 8 pet types that follow you. *Chance and patterns.*
6. Round Arena: lobby → countdown → Falling Tiles / Rising Lava → winner. *Online safety.*
7. Boss Battle: giant Lava King, health bar, 3 attack phases. *Iteration.*
8. Dream Game: design, build with the Vault, playtest, publish. *You're the creator.*

## Built in on purpose

- **Parent co-pilot model.** Claude requires users to be 18+. Claude runs on the parent's account; the parent "stamps" each mission.
- **Independent course.** No Roblox/Anthropic logos or implied endorsement. Disclaimers in the app, guide, page and ads.
- **Never stuck.** Every mission has a rescue script, so a bad AI answer can't end the session.

## Before launch: test in Roblox Studio (1–2 hours, required)

The scripts are syntax-checked and the app is click-tested, but nothing has been run inside Roblox Studio yet.
1. Try 3–4 skill quest prompts in Claude and run the results (they have no rescue scripts, so check Claude handles them well).
2. For each rescue script: new Baseplate → Script in ServerScriptService → paste → Play. Note anything broken.
3. Insert each Vault pack (right-click Workspace → Insert from File) and press Play. Try a checkpoint, jump pad, coin, pet, sword, portal.
4. Send any errors back here and they'll get fixed.

## Launch checklist

1. **Store (20 min).** Gumroad / Lemon Squeezy product, $29, upload `dist/Creator-Mode.zip`. Product name: *Creator Mode: Build Roblox Games with AI (Ages 9–14)*.
2. **Sales page (15 min).** Set `CHECKOUT_URL` at the bottom of `site/creator-mode-site.html`, rename to `index.html`, drop into Netlify Drop or Cloudflare Pages. Or send ads straight to the Gumroad page.
3. **Pixel (15 min).** Meta Pixel on the store.
4. **Creatives (30 min).** Screenshots in `build/img/`, the Canva designs, and best of all a 20-second phone video of a kid playing Mission 1 (script in `ads/ads.md`).
5. **Ads (30 min).** Meta Sales campaign, $20/day, Ads A–F. Review takes a few hours.
6. **Free push.** Post the video on Reels/TikTok; text 10 parent friends.

## Rebuilding after edits

```
python3 build/vault.py        # models -> vault/*.rbxmx + catalog
python3 build/build_app.py    # app + zip -> dist/
python3 build/build_site.py   # sales page -> site/
```
Mission text lives in `app/missions.js`, rescue scripts in `missions/*.luau`, models in `build/vault.py`.

## Later

- Video walkthroughs per mission ($49 tier).
- Mission Pack 2: racing, tower defense, horror escape.
- Weekend live workshops for parent + kid pairs.
