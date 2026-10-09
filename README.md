# Church Mind

*See life through the way of Jesus.*

Church Mind is a Christian formation game set in living communities where
Christians and non-Christians share ordinary life. It is its own app and does
not depend on any other project.

## How it starts

1. **Choose who you are.** Six ready-made characters, or make your own: name,
   skin, hair, clothes, frame, stance and voice. The character is chosen once
   and goes into every world (`src/game/Creator.tsx`).
2. **Choose a world.** Three small circles with a name under each; the one
   you tap unfolds to show its map, what it is about, and a button to go
   there. Each is a different part of life, lived one at a time:
   - **The Neighbourhood of Alder Row:** relationships, friendship, rent.
   - **Wrenfield University:** a first-year far from home, a scholarship, and
     a leaked exam paper.
   - **The Offices of Halden Pryce:** a pitch the team needs to win, and a
     director who wants the honest eleven percent to say eighteen.
   - **A Home on Juniper Lane:** not a week but a whole life, season after
     season, with no plot and no last day. See "The fourth world" below.
3. **Live the week.** Four days, each with a morning and an evening: eight
   turns in all.
4. **You determine the end.** Every world has five endings. The ending screen
   shows which you have found, and lets you go back to the start of any
   morning or evening and choose differently.

## The fourth world: A Home on Juniper Lane

This one works differently. The player lives season after season (four to a
year) and decides what to do with each: there are four parts to a season, and
never time for everything.

- **Build and decorate.** The house is drawn with a wall taken off. Rooms can
  be built (a second bedroom, a study), walls painted, and about thirty things
  bought and coloured, from a sofa to an apple tree. A few open things up: a
  kitchen table lets you have people round; an armchair or garden bench makes
  rest and prayer do more.
- **Work and the mortgage.** Work pays; bills and the mortgage come out when
  the season ends. Miss a payment and the bank writes, and there are honest
  ways through. Debt never spirals: past a point, the chapel food bank covers
  the gap.
- **Family.** Meet someone at the chapel, court, marry (or don't: a single
  life is a whole one here). Hope for a child or adopt, name them, raise them.
- **Neighbours.** Walt at number 12 doesn't believe, and takes years to know.
- **Prayer.** A prayer list the player writes. Answers come as "yes", "not
  yet" and "something different", and are never earned by praying harder.
  Giving money away never pays it back.
- **Life comes to the door.** About thirty events with choices and Scripture
  in context: a rate rise, a catalogue, a leaking roof, a quarrel, envy of a
  friend's kitchen, a hard question from Walt. Wrong turns come round again
  later with a way to put them right.
- **Looking back.** Every fourth season reviews the year, with a passage and
  a question.

It is saved on the device as it goes. The code is in `src/game/life/`:
`model.ts` (what a life is made of, the rooms and things), `content.ts`
(people, activities, events, the prayer list, how a season ends), `House.tsx`
(the drawing) and `LifeScreen.tsx` (the screen).

The family and the dog wander the house by themselves. There is a dog to
adopt from the shelter (and name, and walk), a few days away by the sea, and,
once the mortgage is paid, a fund towards somebody else's deposit.

This world is narrated by one voice, like an audiobook. `lines.ts` lives
several hundred lives to find every line the narrator could read, and
`npm run voices` records them with the rest. Lines that carry something only
the player knows (a child's name, the dog's name, a bank balance) can't be
recorded in advance, so the device's own voice reads those.

## How it plays

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
- **Your own character.** Whoever the player chose appears on the map and in
  every scene. Each character uses one of two recorded player voices, so
  spoken lines never include the player's name.
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
<https://games.thecuriousseekers.com/church-mind/>. Nothing else needs doing to
release a change.

The address comes from the account's games page (the `danielfolarin.github.io`
repository, which owns the `games.thecuriousseekers.com` domain): every game
repository with Pages turned on appears as a folder under it. This repository
must therefore have no custom domain of its own.

## Rewards

Finishing a week pays out, and what is earned is kept on the player's device.

- **Keepsakes** are small things people give the player, each tied to how a
  week went (`keepsakes` in the story file, each with a `when` condition).
  Several are only earned by going back to put something right.
- **Coins** come from finishing a week, from what grew in the player, and from
  new keepsakes. They are spent in the Collection on new looks for the
  character creator (the `SHOP` list in `src/game/rewards.ts`).
- **Share your week** makes a picture of the player's character, ending and
  keepsakes to post or send.

Rewards mark showing up for people and making repairs. They are deliberately
not a measure of how good the player was.

## Picking up where you stopped

The week in progress is saved on the player's device after every step: each
choice, each scene, each quick game. Closing the game and coming back shows
**Continue your week** on the title screen, which returns to the same moment
with the same character, money, energy and choices. "Start a new week" is
still there, and replaces the saved week once the new one begins. The save is
cleared when a week is finished. It lives in `src/game/save.ts`, and is
dropped quietly if a story update means it no longer fits.

## Just for fun

Not everything in the week is a decision. Some of it is only there to enjoy.

- **Quick games** sit inside three activities: a coffee rush on a Kindling
  shift, sorting beans from peas at the seed library, and stacking boxes on
  Dev's moving day. Each lasts about twenty seconds, pays a few coins, can be
  skipped, and never changes the story. An activity gets one by adding
  `game: "coffee" | "seeds" | "boxes"` to it in the story file; the games
  themselves are in `src/game/MiniGame.tsx`.
  The coffee rush has customers with faces and a patience bar; both matching
  games call out a run of right answers. Each player's best score is kept on
  their device and shown in the Collection.
  The library desk at Wrenfield has a book-shelving game and Monday at
  Halden Pryce has an inbox to triage (`game: "books"` and `game: "inbox"`).
- **The town answers back.** Tap someone out walking and they say something
  (each story's `banter` list). Every world has a dog (`dog` in the story
  file) to tap for a woof and, once per part of the day, a coin.
- **Confetti** falls when a week ends and on a top score in a quick game.

## Installing and playing offline

Church Mind can be downloaded without an app store. On the title screen,
"Download the game" offers two things:

- **Put it on your device.** Installs the game with its own icon, opening full
  screen like an app. Android and desktop Chrome or Edge show an Install
  button; on iPhone and iPad it is Share, then "Add to Home Screen" in Safari.
- **Play without internet.** Saves the whole game, voices included (about
  55 MB), so it works with no connection.

`public/manifest.webmanifest` describes the app, `public/sw.js` serves saved
files when offline, and `src/game/offline.ts` handles installing and saving.

## Edit a story, or add a world

Everything a player reads is in `src/game/stories/`, one file per world:
`alderRowWeek.ts`, `wrenfieldWeek.ts` and `haldenPryceWeek.ts`. They are listed
in `index.ts`, which is the order the worlds are offered in. To add a world,
copy one of the newer files, change its `id`, and add it to that list.
`kit.ts` holds what every world shares, including the rules of the house:
Scripture in context and never as punishment, a way back from every wrong
turn, and nobody written as a villain.

Each story has a `world` card (name, one-line pitch, themes), a `map` style
(`ground`: green or paved; `backdrop`: houses, halls or towers; `mirror` to
flip the scenery), and `leads` built with `leadsWith(...)`, which names the
person at the centre of that world's story. Scenes can be set in a garden,
café, kitchen, room, riverside, hall, office, lecture theatre or library.
Keepsake ids must be different in every world.

From top to bottom a story file holds:

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
src/game/stories/           the worlds, one file each, plus kit.ts (shared rules and helpers)
src/game/types.ts           the shape a story must follow
src/game/engine.ts          time, money, energy, closeness, branching, checks
src/game/ui.tsx             dialogue, Scripture panel, growth, week tracker
src/game/SceneArt.tsx       scene and map illustrations, drawn in code
src/game/Figure.tsx         the characters' heads: faces, hair, expressions
src/game/Rig.tsx            full-body characters on a skeleton: poses and movement
src/game/Creator.tsx        ready-made characters and the make-your-own screen
src/game/MiniGame.tsx       the quick games: coffee rush, seed sorting, box stacking
src/game/rewards.ts         coins, keepsakes and the shop: what is earned and kept
src/game/save.ts            the week in progress, saved so it can be continued later
src/game/Collection.tsx     the end-of-week rewards and the Collection screen
src/game/shareCard.ts       draws the picture for "Share your week"
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
