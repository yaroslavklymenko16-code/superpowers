# Persona test: Creator Quest (v5, Claude-in-Studio)

Three simulated kid testers walked through the real app (the built `Creator Quest.html`), driven by a headless browser that counted taps and screens, plus scripts that measured reading level, jargon and quiz patterns. These are invented personas, not real children. Treat this as a structured pre-beta review; confirm it with real families.

## Measured facts

| Check | Result |
| --- | --- |
| Taps until the first thing Claude builds (end of "Hello, Claude") | **47 taps, 16 lesson screens**, about 50 minutes of warm-up |
| Taps to finish the warm-up up to "Connect Claude" (nothing built yet) | 34 taps, 12 screens |
| Path at start | 32 of 33 steps locked |
| Lava Tower: taps from opening it to seeing the Mega Prompt | 13 |
| Mega Prompt length | 171–185 words each; **not editable in the app** (copy only) |
| Reading level of kid-facing text (Flesch-Kincaid) | average grade 4.4 (quests), 4.2 (games); peaks: Teleporters 7.3, Special Effects 6.7, Factory Machines 5.8 |
| Jargon in kid text | "ServerScriptService" 29×, "Humanoid" 14×, "MCP" 4×, "DataStoreService" 3× |
| Warm-up steps only a grown-up can do | 3 of 16 (installs and sign-ins), plus the connection quest is mostly grown-up work |
| Quiz answer patterns | **Correct answer is the longest option in 36 of 41 quizzes and 6 of 6 Prompt Lab rounds.** Correct answer is never the 3rd option; it's option B in 29 of 41. |
| Wrong quiz answer | Button shakes, unlimited retries, no hint, same XP |
| Checklist "Done ✓" | Honor system: tapping it gives XP whether or not the kid did the step |
| XP toasts | Up to 4 stacked at once, covering buttons on a phone-sized screen |
| Reward pop-up timing | "Unit complete" appears 0.5 s after the last screen; a fast tapper sees it land on top of the next screen |

## Persona 1: Ava, 9

Loves pets and obbies, reads slowly, first time in Studio, uses her mom's Mac.

**Loved:** the bright path and START bubble, confetti, choosing her color, the spinning 3D pets in the Vault, Pet Hatchery as something to look forward to.

**Struggled with:**
- **Waiting.** Get Your Tools and Connect Claude are mostly mom installing and clicking. Ava has nothing to do for about 25 minutes before anything happens on screen.
- **Big words.** "ServerScriptService", "MCP server", "Humanoid", "AssemblyLinearVelocity" appear in tips and prompts with no explanation. Teleporters reads at grade 7.
- **The Mega Prompt.** 174 words in a code font. She won't read it, and "change any part you like" isn't possible because the box can't be edited.
- **Wrong answers.** The shake feels like failing. No hint about why.

> "I clicked Got it like a hundred times. What's a Server Script Service?"

**Would help:** a read-aloud button; tap-to-explain words ("ServerScriptService = the folder for your game's rules"); a short kid version of each Mega Prompt with choices to tap (lava color, number of stages); a kid task while the grown-up installs (pick your avatar color, design your first obby on paper, guess-the-next-word game).

## Persona 2: Jayden, 12

Plays Roblox every day, impatient, already has Studio installed, came for zombies and bosses.

**Loved:** XP, levels and the streak; the big game list (Zombie Night, Boss Battle); Boss Bugs; unlocking Vault packs.

**Frustrated by:**
- **47 taps before Claude builds anything.** He already has Studio, but he can't skip Get Your Tools or Studio Tour. Tapping Lava Tower says "Finish Hello, Claude first!"
- **Gating he can beat by mashing.** "Got it! Next tip" one at a time, then "Done ✓" on every step (honor system), then guessing quizzes until one turns green. He learns that tapping fast is the fastest way to XP.
- **Quizzes are gameable.** He figures out within a few questions that the longest answer is always right.
- **Toast pile-up.** Four XP pop-ups stack up and cover the Continue button.

> "Why do I have to do the tour? I've used Studio. Just let me make the zombie game."

**Would help:** a "Test out" option for the warm-up (a 3-question check skips Get Your Tools and Studio Tour); moving "Hello, Claude" earlier so the first build happens in about 15 minutes; first-try bonuses (full XP for a first-try answer, less after a miss) instead of free retries; mixing up answer lengths and positions; one combined XP counter instead of stacked toasts.

## Persona 3: Priya, 14

Did Scratch at school, curious how code really works, allergic to anything "babyish".

**Loved:** Boss Bugs (real code), "Peek at the backup code", the AI lessons on hallucination and randomness, the Dream Game Designer, Prompt Lab as an idea.

**Frustrated by:**
- **She never touches code.** Now that Claude makes every change, the only code she reads is Boss Bugs and the backup peek. She wants to understand what Claude built.
- **Prompt Lab is too easy.** 6 rounds, and the right answer is always the longest.
- **Tone.** "Noob Builder", confetti on every tap and beep sounds feel young at 14. Sound can be turned off, but confetti and ranks can't.
- **Waiting on a grown-up.** Claude is 18+, so a parent has to send every prompt. She finds that slow, though it's required.

> "Claude built the zombies, cool. But I have no idea how the chase thing works. Can it show me?"

**Would help:** an "Explain it" step in every big game (a prompt like "Explain the zombie chase code to me in 5 simple steps", then one question about it); harder Prompt Lab rounds where kids write or fix a prompt; a "Teen mode" toggle (calmer effects, ranks like Builder → Developer → Lead Dev); a "spot the problem in Claude's answer" challenge.

## What all three agreed on

1. The first build comes too late. Get to "Claude builds something" in about 15 minutes.
2. Quizzes and checklists are too easy to game, which makes the rewards feel cheap.
3. Kids want to change the prompts, not just copy them.
4. Jargon needs tap-to-explain.
5. Fewer pop-ups at once.

## Recommended fixes (most impact first)

| # | Fix | Helps | Effort |
| --- | --- | --- | --- |
| 1 | Shuffle quiz answers at runtime and rewrite options so the right one isn't always the longest | All | Small |
| 2 | First-try bonus XP, and a hint after a wrong answer | Jayden, Ava | Small |
| 3 | Collapse XP toasts into one counter; fix the late reward pop-up | Jayden | Small |
| 4 | Warm-up "test out" and move the first Claude build earlier (connect → Hello Claude → tour) | Jayden | Medium |
| 5 | Kid tasks during grown-up install steps (design-on-paper, mini-game) | Ava | Medium |
| 6 | Editable prompts with tap-to-choose blanks (color, size, number) | All | Medium |
| 7 | Tap-to-explain glossary for Studio words | Ava | Medium |
| 8 | "Explain it" step after every big game + "spot Claude's mistake" Boss Bug variant | Priya | Medium |
| 9 | Read-aloud button (browser speech) | Ava | Small |
| 10 | Teen mode: calmer effects and grown-up rank names | Priya | Small |
| 11 | Harder Prompt Lab: write/fix-a-prompt rounds, 12+ rounds | Priya | Medium |

## Next step

Run the same three checks with 3–5 real families during the beta: minutes to first build, where kids tap without reading, and which words they ask about.
