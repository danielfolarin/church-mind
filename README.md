# Church Mind

*See life through the way of Jesus.*

Church Mind is a Christian formation game set in a living neighbourhood where
Christians and non-Christians share ordinary life. It is its own app and does
not depend on any other project.

## How it plays

The first story is **A Week in Alder Row**. You live four days, each with a
morning and an evening: eight turns in all.

- **A living town, not a quiz.** Each turn opens on the town: houses, streets,
  a river, neighbours out walking. Whoever is waiting for you stands outside
  their door. You pick one place and your character walks there along the
  streets. The other things don't all wait for you.
- **Temptation looks tempting.** Money left unwatched glows and glitters on
  screen, and the easy way out shimmers. Mark any choice or opportunity with
  `tempt: "money"` or `tempt: "ease"` in the story file.
- **Limited time, money and energy.** Work pays the rent but wears you out.
  A friend needs help the same morning your boss needs cover. Rent is due on
  Saturday whether or not you lent money on Monday.
- **People remember.** Closeness with each person rises and falls with how you
  treat them, and what you did earlier changes what they say later.
- **Everyday themes.** Relationships (a serious question from someone who
  doesn't share your faith), friendship (a friend short on his deposit), work
  (an over-full till, a cruel customer), money (rent), conflict and
  forgiveness (a debt, an avoided conversation), and faith (prayer, the
  Thursday table, a colleague who asks what you believe).
- **Your own character.** Players can pick Naomi or Caleb, or make their own:
  a name, skin, hair, clothes, extras and stance. The character is saved on
  their device and appears on the map and in every scene. They take the story
  place of one of the leads, so the recorded voices still work; for that
  reason spoken lines never include the player's name.
- **Scripture in context.** Passages arrive where they belong: in a mentor's
  kitchen, in the Sunday reading, on a walk by the river. Each comes with a
  short explanation, and none is used as a punishment.
- **Room to turn around.** Almost every mistake has a later chance to put it
  right: take the money back, knock on the door, go and apologise. Those
  chances are never locked behind money or energy.
- **A summary, not a score.** The week ends with how things stand with each
  person, what grew in you (wisdom, integrity, compassion, courage, trust),
  and questions to carry into real life.

Scenes have illustrated, animated characters and unfold a line at a time.
Sound and spoken lines are optional and start switched off.

## Real voices (Fish Audio)

Lines can be spoken by recorded voices from [Fish Audio](https://fish.audio)
instead of the device's built-in voice. The recordings are made once, saved in
`public/audio/`, and shipped with the game, so players never need an account
and your API key is never exposed.

1. Create a Fish Audio account and an API key.
2. Put the key in a file called `.env.local` in this folder:
   `FISH_API_KEY=your-key-here` (this file is never uploaded to GitHub).
3. Open `voices.config.json` and paste a Fish Audio voice id beside each
   speaker. Use voices you have the right to publish.
4. Run `npm run voices`. It records only what is missing, so it is safe to
   stop and run again. `npm run voices -- --dry` just counts the lines, and
   `npm run voices -- --redo=ruth` re-records one speaker.

Any line without a recording falls back to the device's own voice. Re-run the
command after editing the story so new lines get recorded.

## Run it

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Then open <http://127.0.0.1:5174>.

`npm run build` type-checks the project and writes a deployable copy to
`dist/`, which any static web host can serve.

## Hosting

The game is published free with GitHub Pages. Every push to `main` runs
`.github/workflows/deploy.yml`, which builds the game and puts it online at
<https://game.thecuriousseekers.com>. Nothing else needs doing to release a
change.

## Installing and playing offline

Church Mind can be downloaded without an app store. On the title screen,
"Download the game" offers two things:

- **Put it on your device.** Installs the game with its own icon, opening full
  screen like an app. Android and desktop Chrome or Edge show an Install
  button; on iPhone and iPad it is Share, then "Add to Home Screen" in Safari.
- **Play without internet.** Saves the whole game, voices included (about
  25 MB), so it works with no connection.

`public/manifest.webmanifest` describes the app, `public/sw.js` serves saved
files when offline, and `src/game/offline.ts` handles installing and saving.

## Edit the story

Everything a player reads is in `src/game/stories/alderRowWeek.ts`. From top
to bottom it holds:

- **People:** how each one looks, stands, moves and sounds, plus the short
  `traits` shown beside their full-body figure on the cast screen. Full
  figures are built on a skeleton (hips, spine, head, two-part arms and legs),
  and three settings shape each person:
  - `build` is their frame: `height`, `shoulders`, `hips`, `limbs`.
  - `stance` is their pose: `akimbo`, `hip`, `pockets`, `clasped`, `book`,
    `cup`, `wave`, `open` or `relaxed`.
  - `manner` is how they move while standing: `calm`, `confident`, `lively`,
    `graceful`, `easy`, `brisk`, `steady` or `warm`.
- **Scripture:** each passage with its explanation.
- **`start`, `slots`, `places`:** starting money and energy, the days of the
  week, and where places sit on the map.
- **`opportunities`:** what the player can do and when. Each has a place, the
  slots it is offered in, what it costs or gives (`money`, `energy`, `bond`),
  an optional `when` condition, and the scene it opens.
- **`nodes`:** the scenes. Lines are written with short helpers: `n(...)` for
  narration, `d("ruth", "...", "warm")` for speech with an expression,
  `t(...)` for a thought, `m(...)` for a phone message, `s(...)` for
  Scripture. A scene ends with choices or with `next: "map"`.
- **`endings` and `threads`:** how the week is summed up.

Choices and opportunities can set `flags`, and anything can be made
conditional on them with `when`. Doing an opportunity also sets `did:<id>`.

To add another story, copy that file, change its content, and add it to the
list in `src/game/stories/index.ts`. In development the app checks every
story for broken links and prints any problems in the browser console.

## Where things are

```
src/App.tsx                 title, introduction, scene and summary screens
src/game/MapScreen.tsx      the town screen and the list of things to do
src/game/Town.tsx           the town artwork, streets, and the walking figures
src/game/stories/           story content, one file per story
src/game/types.ts           the shape a story must follow
src/game/engine.ts          time, money, energy, closeness, branching, checks
src/game/ui.tsx             dialogue, Scripture panel, growth, week tracker
src/game/SceneArt.tsx       scene and map illustrations, drawn in code
src/game/Figure.tsx         the characters' heads: faces, hair, expressions
src/game/Rig.tsx            full-body characters on a skeleton: poses and movement
src/game/Creator.tsx        the make-your-own-character screen
src/game/Stage.tsx          places the characters in the scene and lights them
src/game/audio.ts           atmosphere for each place and small story sounds
src/game/voice.ts           plays recorded voices, or the device's own as a fallback
src/game/speech.ts          decides what each line sounds like and names its recording
scripts/generate-voices.mjs records every line with Fish Audio
voices.config.json          which Fish Audio voice each speaker uses
tailwind.config.js          colours, fonts, and motion
```

## Before sharing it widely

- The story, its theology and the Scripture explanations are a first draft and
  should be reviewed by a pastor.
- The balance of money and energy was checked by simulation, not by watching
  real people play. Expect to tune it after a few playtests.
- The sound was tuned by measurement, not by ear, and the voices are whatever
  each device provides. Listen on a phone and a computer first.
- Scripture is quoted from the World English Bible, which is public domain.
  Another translation may need a licence.
