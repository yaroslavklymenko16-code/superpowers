# Creator Mode: launch plan

**Product:** Creator Mode, a $29 printable course (13-page PDF) where a parent and kid (ages 9–14) build a Roblox game together using Claude, learning one AI idea per mission.
**Buyer:** parents of kids who spend a lot of time on Roblox.
**Hook:** stop playing Roblox, start building it. Screen time that produces something, plus AI skills.

## What's built (this folder)

| File | What it is |
| --- | --- |
| `course/Creator-Mode-Workbook.pdf` | **The product.** Upload this to your store. |
| `course/workbook.html` | Source for the PDF (edit, then re-export). |
| `site/creator-mode-site.html` | Sales page, ready for any static host. |
| `site/index.html` | Same page, as published to the Claude artifact preview. |
| `ads/ads.md` | Ad copy for Meta, TikTok, Google, with targeting and budgets. |

Course outline: setup → rainbow block (scripts) → lava (prompting) → coins (debugging AI mistakes) → moving platforms (iteration) → speed pads (how AI learns) → secret door (AI safety) → own obby + publish (you're the creator). Plus parent guide, prompt cheat sheet, Creator Hours chart and certificate.

## Two things built into the design on purpose

1. **Parent co-pilot model.** Claude's consumer terms require users to be 18+. The course runs on the parent's Claude account with the parent present. This is also the selling point for parents.
2. **Independent course.** No Roblox or Anthropic logos or implied endorsement; a disclaimer is on the cover, the page footer and the ad rules.

## Launch today: checklist (about 2–3 hours of your time)

1. **Store, 20 min.** Create a Gumroad (or Lemon Squeezy / Stripe Payment Link) product:
   - Name: Creator Mode: Build a Roblox Game with AI (Parent + Kid Course)
   - Price: $29. Upload `Creator-Mode-Workbook.pdf`.
   - Description: paste sections from the sales page.
   - Refund policy: the page promises 30 days. Change the FAQ if you want something different.
2. **Sales page, 15 min.**
   - Fastest: send ads straight to the Gumroad product page and skip this step.
   - Better: open `site/creator-mode-site.html`, set `CHECKOUT_URL` near the bottom to your store link, then drag the file (renamed `index.html`) into Netlify Drop (app.netlify.com/drop) or Cloudflare Pages. You get a public URL in a minute.
3. **Tracking, 15 min.** Create a Meta Pixel and add it to the store (Gumroad supports it in Settings → Advanced).
4. **Ad creatives, 30 min.** Use the Canva designs (square + story) and adjust. Best performer is usually a real 20-second phone video of your kid building (script in `ads/ads.md`).
5. **Launch ads, 30 min.** Meta Ads Manager: one Sales campaign, $20/day, Ads A–D from `ads/ads.md`. Optional: TikTok $20/day, Google Search $10/day.
   - Ads go through review, usually a few hours, sometimes up to a day.
6. **Free push, 30 min.** Post the video to your own Reels/TikTok and text the link to 10 parent friends.

## Week 1 after launch

- Check ads daily. After 3–4 days, kill losers and move budget to the winner (rules in `ads/ads.md`).
- Run through Mission 1–2 with a real kid. Fix anything confusing in the workbook.
- Collect real testimonials and screenshots of kids' games (with permission) and add them to the page and ads.
- Target numbers: cost per sale under $15 to stay profitable at $29 after fees.

## Later

- $49 "Creator Mode Plus": video walkthroughs of each mission.
- Mission pack 2: tycoon game, round timers, shops.
- Live weekend workshops on Zoom for parent + kid pairs.
