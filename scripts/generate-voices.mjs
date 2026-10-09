// Records every spoken line of the game with Fish Audio (https://fish.audio)
// and saves the recordings in public/audio/, where the game finds them.
//
//   1. Put your Fish Audio API key in a file called .env.local:
//        FISH_API_KEY=your-key-here
//      (.env.local is never uploaded to GitHub.)
//   2. Choose a voice for each speaker in voices.config.json.
//   3. Run:  npm run voices            record anything not yet recorded
//            npm run voices -- --dry   just count lines, record nothing
//            npm run voices -- --redo=ruth   re-record one speaker
//
// It is safe to stop and run again: lines already recorded are skipped.

import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "audio");
const args = process.argv.slice(2);
const dry = args.includes("--dry");
const redo = args.find((arg) => arg.startsWith("--redo="))?.slice(7);

function readKey() {
  if (process.env.FISH_API_KEY) return process.env.FISH_API_KEY;
  const file = join(root, ".env.local");
  if (!existsSync(file)) return null;
  const match = readFileSync(file, "utf8").match(/^\s*FISH_API_KEY\s*=\s*(.+)\s*$/m);
  return match ? match[1].trim().replace(/^["']|["']$/g, "") : null;
}

// Load the game's own story and rules, so this script says exactly what the game says.
const vite = await createServer({ root, server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
const { STORIES } = await vite.ssrLoadModule("/src/game/stories/index.ts");
const engine = await vite.ssrLoadModule("/src/game/engine.ts");
const { speechFor } = await vite.ssrLoadModule("/src/game/speech.ts");

// Play the week many times over, taking every path, and note every line heard.
const lines = new Map();
let seed = 20261008;
const random = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
  return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
};
const pick = (list) => list[Math.floor(random() * list.length)];

for (const story of STORIES) {
  for (const lead of story.leads) {
    for (let run = 0; run < 40000; run++) {
      let state = engine.startWeek(story);
      for (let step = 0; step < 200 && state.phase !== "summary"; step++) {
        if (state.phase === "map") {
          const open = engine.offers(story, state).filter((offer) => !offer.blocked);
          state = engine.go(story, state, pick(open).opportunity);
          continue;
        }
        const node = story.nodes[state.nodeId];
        const tokens = engine.tokensFor(lead, state.money);
        for (const beat of engine.visibleBeats(node.beats, state)) {
          const speech = speechFor(story, lead, beat, (raw) => engine.fill(raw, tokens));
          if (!lines.has(speech.clip)) lines.set(speech.clip, speech);
        }
        const choices = engine.visibleChoices(node.choices, state);
        state = choices.length ? engine.choose(story, state, pick(choices)) : engine.advance(story, state);
      }
    }
  }
}
await vite.close();

const config = JSON.parse(readFileSync(join(root, "voices.config.json"), "utf8"));
const bySpeaker = {};
let characters = 0;
for (const speech of lines.values()) {
  bySpeaker[speech.voiceId] = (bySpeaker[speech.voiceId] ?? 0) + 1;
  characters += speech.text.length;
}
mkdirSync(outDir, { recursive: true });
const recorded = () => readdirSync(outDir).filter((file) => file.endsWith(".mp3")).map((file) => file.slice(0, -4));
const todo = [...lines.values()].filter((speech) => !existsSync(join(outDir, `${speech.clip}.mp3`)) || speech.voiceId === redo);

console.log(`Lines in the game: ${lines.size} (${characters.toLocaleString()} characters)`);
console.log("By speaker:", bySpeaker);
console.log(`Already recorded: ${lines.size - todo.length}. To record now: ${todo.length}.`);

function saveManifest() {
  const wanted = new Set(lines.keys());
  const kept = recorded().filter((id) => {
    if (wanted.has(id)) return true;
    unlinkSync(join(outDir, `${id}.mp3`)); // a line that is no longer in the story
    return false;
  });
  writeFileSync(join(outDir, "manifest.json"), JSON.stringify(kept.sort()));
  return kept.length;
}

if (dry) {
  console.log("Dry run: nothing recorded.");
  process.exit(0);
}

const key = readKey();
if (!key) {
  console.error("\nNo API key found. Create .env.local containing:  FISH_API_KEY=your-key-here");
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let done = 0;
for (const speech of todo) {
  const voice = config.voices?.[speech.voiceId] || undefined;
  const body = {
    text: speech.text,
    format: "mp3",
    mp3_bitrate: 64,
    prosody: { speed: speech.style.rate ?? 1, volume: 0, normalize_loudness: true },
    ...(voice ? { reference_id: voice } : {}),
  };
  let saved = false;
  for (let attempt = 1; attempt <= 5 && !saved; attempt++) {
    const response = await fetch("https://api.fish.audio/v1/tts", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", model: config.model ?? "s2.1-pro-free" },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      writeFileSync(join(outDir, `${speech.clip}.mp3`), Buffer.from(await response.arrayBuffer()));
      saved = true;
    } else if (response.status === 429 || response.status >= 500) {
      await sleep(4000 * attempt); // busy or rate-limited: wait and try again
    } else {
      const detail = await response.text();
      console.error(`\nFish Audio refused the request (${response.status}): ${detail.slice(0, 300)}`);
      console.error(`Stopped after ${done} new recordings. Fix the problem and run again; finished lines are kept.`);
      saveManifest();
      process.exit(1);
    }
  }
  if (!saved) {
    console.error(`\nGave up on one line after several tries. Stopped after ${done} new recordings; run again later.`);
    saveManifest();
    process.exit(1);
  }
  done += 1;
  if (done % 10 === 0 || done === todo.length) console.log(`  recorded ${done} of ${todo.length}`);
  await sleep(350);
}
console.log(`Done. ${saveManifest()} recordings are ready in public/audio/.`);
