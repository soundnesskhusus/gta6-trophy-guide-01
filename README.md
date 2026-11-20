[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/soundnesskhusus/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/soundnesskhusus/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Trophy Guide — GTA VI, all 55 trophies

An offline guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI, built for the [make.fun bounty gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01).

Every trophy is shown with its official name, description and grade, a guide written for this page, and the sources each guide draws on — PowerPyx's trophy guide and roadmap for the methods, Exophase for the live rarity figures (20 November 2026). There is a three-step roadmap to the platinum (about 200 hours, difficulty 4/10, one playthrough, no online trophies), a loud warning for the one trophy that can be missed, and a tracker: tick trophies off, watch the progress ring fill, filter by story / missable / collectibles / activities, hide story spoilers until a trophy is earned, and export or import your progress as a file.

## Run it

Serve `app/` with any static server and open `app/index.html` in a desktop browser. It works with the network off — every file it loads lives under `app/`.

```sh
node serve.ts   # serves app/ at http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.

## Layout

- `app/index.html` — page, roadmap, toolbar and footer
- `app/style.css` — dark theme, grade colours
- `app/app.js` — boot, toolbar wiring, screenshot states (`?shot=`)
- `app/render.js` — trophy cards, progress ring, empty states
- `app/filters.js` — kind, search and spoiler matching
- `app/tracker.js` — localStorage progress, export and import
- `app/data/trophies.json` — the 55 trophies: official name, description, grade, guide, kind, rarity and sources
- `screenshots/` — 3–4 real renders of the app
- `main.ts` — the entrypoint; `vendor/makefun-frontend.ts` is the kit's library, unchanged

Grand Theft Auto and GTA are trademarks of their owner. This is an independent fan-made guide, not affiliated with or endorsed by Rockstar Games. No official artwork is used here.
