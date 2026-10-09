import { ACTIVITIES, afterReview, blockedReason, CANDIDATES, doActivity, endSeason, EVENTS, resolveChoice, resultLines, reviewOf, say } from "./content";
import { buyItem, ITEMS, newLife, owns, type LifeState, type Me } from "./model";
import { scriptureSpeech } from "./speech";

// Every line of Juniper Lane that can be recorded in advance. Used only by
// scripts/generate-voices.mjs: it lives many lives, taking every turning, and
// notes what the narrator would have read.

const PERSONAL = /\{(you|child|eldest|money|pet)\}/;
const ABOUT_PARTNER = /\{(partner|he|him|his|He|His)\}/;

export function collectLifeLines(lives = 220, seasons = 44): string[] {
  let seed = 20261009;
  const random = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
  const pick = <T,>(list: T[]) => list[Math.floor(random() * list.length)];

  /** Lines before names are filled in, each with the kind of player it was met by. */
  const raw = new Map<string, Set<string>>();
  const spoken = new Set<string>();
  const note = (line: string, base: string) => {
    if (!line) return;
    if (!raw.has(line)) raw.set(line, new Set());
    raw.get(line)?.add(base);
  };

  for (const base of Object.keys(CANDIDATES)) {
    const me: Me = { name: "", base, look: { skin: "", shade: "", hair: "", hairStyle: "short", top: "" } };
    for (let life = 0; life < lives; life++) {
      let state: LifeState = newLife();
      const play = (id: string) => {
        const event = EVENTS.find((candidate) => candidate.id === id);
        if (!event) return;
        for (const beat of typeof event.beats === "function" ? event.beats(state) : event.beats) note(beat, base);
        if (event.scripture) spoken.add(scriptureSpeech(event.scripture));
        const open = event.choices.map((choice, index) => ({ choice, index })).filter(({ choice }) => !choice.when || choice.when(state));
        // Hear how every choice would turn out, then live with one of them.
        for (const { choice, index } of open) {
          for (const line of resultLines(choice, resolveChoice(state, event, index, me, "Ada").state)) note(line, base);
          if (choice.scripture) spoken.add(scriptureSpeech(choice.scripture));
        }
        state = resolveChoice(state, event, pick(open).index, me, "Ada").state;
      };

      for (let season = 0; season < seasons; season++) {
        for (let guard = 0; guard < 6 && state.pending; guard++) {
          if (state.pending === "review") {
            spoken.add(scriptureSpeech(reviewOf(state, me).scripture));
            state = afterReview(state);
          } else play(state.pending);
        }
        for (let step = 0; step < 12; step++) {
          const open = ACTIVITIES.filter((activity) => activity.show(state, me) && !blockedReason(state, activity));
          if (!open.length) break;
          // Lean towards work, so that these lives reach the later chapters.
          const activity = random() < 0.4 ? (open.find((candidate) => candidate.id === "work") ?? pick(open)) : pick(open);
          const done = doActivity(state, activity, me);
          for (const line of done.outcome.text) note(line, base);
          if (done.outcome.scripture) spoken.add(scriptureSpeech(done.outcome.scripture));
          state = done.state;
          if (done.outcome.event) play(done.outcome.event);
          if (random() < 0.3) {
            const wanted = Object.keys(ITEMS).filter((id) => !owns(state, id) && state.rooms[ITEMS[id].room].built && ITEMS[id].price <= state.money - 300);
            if (wanted.length) state = buyItem(state, pick(wanted));
          }
        }
        state = endSeason(state, me).state;
      }
    }
  }

  for (const [line, bases] of raw) {
    if (PERSONAL.test(line)) continue;
    for (const base of bases) {
      const me: Me = { name: "", base, look: { skin: "", shade: "", hair: "", hairStyle: "short", top: "" } };
      const partners = ABOUT_PARTNER.test(line) ? CANDIDATES[base].map((person) => person.id) : [null];
      for (const partner of partners) spoken.add(say(line, { ...newLife(), partner }, me));
    }
  }
  return [...spoken];
}
