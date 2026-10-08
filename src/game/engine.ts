import {
  QUALITY_IDS,
  type Beat,
  type Choice,
  type Condition,
  type Effects,
  type Ending,
  type Lead,
  type Next,
  type Opportunity,
  type PlaceId,
  type Qualities,
  type QualityId,
  type Slot,
  type Story,
} from "./types";

export const MAX_QUALITY = 4;
export const MAX_ENERGY = 4;
export const MAX_BOND = 4;
/** Energy that comes back with a night's sleep. */
const SLEEP = 2;
const MAP = "map";

export interface PathEntry {
  slot: number;
  label: string;
}

export interface GameState {
  /** Choosing on the map, inside a scene, or looking back on the week. */
  phase: "map" | "scene" | "summary";
  /** Index into `story.slots`. */
  slot: number;
  nodeId: string | null;
  /** The opportunity being played. */
  activity: string | null;
  /** Where the player is standing on the map. */
  place: PlaceId;
  money: number;
  energy: number;
  bonds: Record<string, number>;
  qualities: Qualities;
  flags: string[];
  /** Ids of opportunities already taken. */
  done: string[];
  /** What the player did, for the summary. */
  path: PathEntry[];
  /** Qualities the most recent action grew. */
  grew: QualityId[];
}

export function matches(condition: Condition | undefined, state: GameState): boolean {
  if (!condition) return true;
  const has = (flag: string) => state.flags.includes(flag);
  if (condition.all && !condition.all.every(has)) return false;
  if (condition.any && !condition.any.some(has)) return false;
  if (condition.none && condition.none.some(has)) return false;
  if (condition.minMoney !== undefined && state.money < condition.minMoney) return false;
  if (condition.maxMoney !== undefined && state.money > condition.maxMoney) return false;
  for (const [id, least] of Object.entries(condition.bond ?? {})) {
    if ((state.bonds[id] ?? 0) < least) return false;
  }
  for (const id of QUALITY_IDS) {
    const min = condition.min?.[id];
    const max = condition.max?.[id];
    if (min !== undefined && state.qualities[id] < min) return false;
    if (max !== undefined && state.qualities[id] > max) return false;
  }
  return true;
}

export function visibleBeats(beats: Beat[], state: GameState): Beat[] {
  return beats.filter((beat) => matches(beat.when, state));
}

export function visibleChoices(choices: Choice[] | undefined, state: GameState): Choice[] {
  return (choices ?? []).filter((choice) => matches(choice.when, state));
}

const clamp = (value: number, max: number) => Math.max(0, Math.min(max, value));

function apply(state: GameState, effects: Effects | undefined): GameState {
  if (!effects) return state;
  const qualities = { ...state.qualities };
  const grew = [...state.grew];
  for (const id of QUALITY_IDS) {
    const amount = effects.grow?.[id];
    if (!amount) continue;
    qualities[id] = Math.min(MAX_QUALITY, qualities[id] + amount);
    if (!grew.includes(id)) grew.push(id);
  }
  const bonds = { ...state.bonds };
  for (const [id, change] of Object.entries(effects.bond ?? {})) {
    bonds[id] = clamp((bonds[id] ?? 0) + change, MAX_BOND);
  }
  return {
    ...state,
    qualities,
    grew,
    bonds,
    money: state.money + (effects.money ?? 0) - Math.min(Math.max(state.money, 0), effects.payUpTo ?? 0),
    energy: clamp(state.energy + (effects.energy ?? 0), MAX_ENERGY),
    flags: [...state.flags, ...(effects.flags ?? []).filter((flag) => !state.flags.includes(flag))],
  };
}

function resolve(next: Next, state: GameState): string {
  if (typeof next === "string") return next;
  const branch = next.find((option) => matches(option.when, state));
  if (!branch) throw new Error("Church Mind: no branch matched and there is no fallback.");
  return branch.to;
}

function onOffer(story: Story, state: GameState, opportunity: Opportunity): boolean {
  const slot = story.slots[state.slot];
  if (!slot || !opportunity.slots.includes(slot.id)) return false;
  if (!opportunity.repeatable && state.done.includes(opportunity.id)) return false;
  return matches(opportunity.when, state);
}

export interface Offer {
  opportunity: Opportunity;
  /** Why it can't be done right now, if it can't. */
  blocked: string | null;
}

/** Everything the player could do in the current slot. */
export function offers(story: Story, state: GameState): Offer[] {
  return story.opportunities
    .filter((opportunity) => !opportunity.auto && onOffer(story, state, opportunity))
    .map((opportunity) => {
      const energyNeeded = -(opportunity.energy ?? 0);
      const moneyNeeded = -(opportunity.money ?? 0);
      let blocked: string | null = null;
      if (energyNeeded > state.energy) blocked = "You're too worn out for this. Rest first.";
      else if (moneyNeeded > state.money) blocked = "You can't afford this right now.";
      return { opportunity, blocked };
    });
}

function begin(story: Story, state: GameState, opportunity: Opportunity): GameState {
  const started = apply(
    {
      ...state,
      phase: "scene",
      activity: opportunity.id,
      place: opportunity.place,
      done: state.done.includes(opportunity.id) ? state.done : [...state.done, opportunity.id],
      flags: state.flags.includes(`did:${opportunity.id}`) ? state.flags : [...state.flags, `did:${opportunity.id}`],
      grew: [],
    },
    opportunity
  );
  return enter(story, started, opportunity.scene);
}

/** Starts a slot: anything marked `auto` plays first, otherwise the map opens. */
function open(story: Story, state: GameState): GameState {
  if (state.slot >= story.slots.length) return { ...state, phase: "summary", nodeId: null, activity: null };
  const auto = story.opportunities.find((opportunity) => opportunity.auto && onOffer(story, state, opportunity));
  if (auto) return begin(story, state, auto);
  return { ...state, phase: "map", nodeId: null, activity: null };
}

function enter(story: Story, state: GameState, target: string): GameState {
  if (target !== MAP) return apply({ ...state, nodeId: target }, story.nodes[target].effects);

  const finished = story.opportunities.find((opportunity) => opportunity.id === state.activity);
  if (finished?.auto) return open(story, state);

  // Time moves on. A night's sleep comes between an evening and the next morning.
  const slot = state.slot + 1;
  const slept = story.slots[state.slot]?.time === "Evening" && slot < story.slots.length;
  return open(story, { ...state, slot, energy: slept ? clamp(state.energy + SLEEP, MAX_ENERGY) : state.energy });
}

export function startWeek(story: Story): GameState {
  const bonds: Record<string, number> = { partner: story.start.bond };
  for (const character of story.cast) bonds[character.id] = story.start.bond;
  return open(story, {
    phase: "map",
    slot: 0,
    nodeId: null,
    activity: null,
    place: story.start.place,
    money: story.start.money,
    energy: story.start.energy,
    bonds,
    qualities: { wisdom: 0, integrity: 0, compassion: 0, courage: 0, trust: 0 },
    flags: [],
    done: [],
    path: [],
    grew: [],
  });
}

/** Go and do something from the map. */
export function go(story: Story, state: GameState, opportunity: Opportunity): GameState {
  return begin(story, { ...state, path: [...state.path, { slot: state.slot, label: opportunity.title }] }, opportunity);
}

/** Make a choice inside a scene. */
export function choose(story: Story, state: GameState, choice: Choice): GameState {
  const after = apply({ ...state, grew: [], path: [...state.path, { slot: state.slot, label: choice.label }] }, choice);
  return enter(story, after, resolve(choice.next, after));
}

/** Moves on from a node that has no choices. */
export function advance(story: Story, state: GameState): GameState {
  const next = state.nodeId ? story.nodes[state.nodeId].next : undefined;
  if (!next) return state;
  const cleared = { ...state, grew: [] };
  return enter(story, cleared, resolve(next, cleared));
}

export function endingFor(story: Story, state: GameState): Ending {
  return story.endings.find((ending) => matches(ending.when, state)) ?? story.endings[story.endings.length - 1];
}

/** "Monday evening" */
export function slotLabel(slot: Slot | undefined): string {
  return slot ? `${slot.day} ${slot.time.toLowerCase()}` : "";
}

/** The quality that grew most; ties go to the earlier one in QUALITY_IDS. */
export function strongestQuality(qualities: Qualities): QualityId | null {
  let best: QualityId | null = null;
  for (const id of QUALITY_IDS) {
    if (qualities[id] > 0 && (best === null || qualities[id] > qualities[best])) best = id;
  }
  return best;
}

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function tokensFor(lead: Lead, money = 0): Record<string, string> {
  const { he, him, his, himself } = lead.pronouns;
  return {
    you: lead.name,
    partner: lead.partner,
    he,
    him,
    his,
    himself,
    He: capitalize(he),
    Him: capitalize(him),
    His: capitalize(his),
    money: `$${money}`,
  };
}

/** Replaces {tokens} in story text. Unknown tokens are left in place so they are easy to spot. */
export function fill(text: string, tokens: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (match, name: string) => tokens[name] ?? match);
}

/**
 * Checks a story for broken links and typos. Returns a list of problems; an
 * empty list means every link works and every scene can be reached.
 */
export function validateStory(story: Story): string[] {
  const problems: string[] = [];
  const speakers = new Set(["you", "partner", ...story.cast.map((character) => character.id)]);
  const slotIds = new Set(story.slots.map((slot) => slot.id));
  const tokens = story.leads[0] ? tokensFor(story.leads[0]) : {};
  const reached = new Set<string>();

  const checkText = (where: string, text: string) => {
    for (const [match, name] of text.matchAll(/\{(\w+)\}/g)) {
      if (!(name in tokens)) problems.push(`${where}: unknown token ${match}`);
    }
  };
  const checkPeople = (where: string, ids: string[]) => {
    for (const id of ids) if (!speakers.has(id)) problems.push(`${where}: unknown character "${id}"`);
  };
  const checkBeats = (where: string, beats: Beat[]) => {
    for (const beat of beats) {
      checkPeople(where, Object.keys(beat.react ?? {}));
      if (beat.type === "scripture") continue;
      checkText(where, beat.text);
      if (beat.type === "dialogue" || beat.type === "message") checkPeople(where, [beat.speaker]);
    }
  };
  const checkNext = (where: string, next: Next) => {
    const targets = typeof next === "string" ? [next] : next.map((branch) => branch.to);
    if (typeof next !== "string" && next[next.length - 1]?.when) {
      problems.push(`${where}: the last branch needs no "when" so there is always a way forward`);
    }
    for (const target of targets) {
      if (target === MAP) continue;
      reached.add(target);
      if (!(target in story.nodes)) problems.push(`${where}: leads to "${target}", which does not exist`);
    }
  };

  if (!(story.start.place in story.places)) problems.push(`start: place "${story.start.place}" does not exist`);

  for (const opportunity of story.opportunities) {
    const where = `opportunity "${opportunity.id}"`;
    checkText(where, opportunity.title);
    checkText(where, opportunity.blurb);
    checkPeople(where, [...(opportunity.with ?? []), ...Object.keys(opportunity.bond ?? {})]);
    if (!(opportunity.place in story.places)) problems.push(`${where}: place "${opportunity.place}" does not exist`);
    for (const slot of opportunity.slots) {
      if (!slotIds.has(slot)) problems.push(`${where}: slot "${slot}" does not exist`);
    }
    reached.add(opportunity.scene);
    if (!(opportunity.scene in story.nodes)) problems.push(`${where}: scene "${opportunity.scene}" does not exist`);
  }

  for (const [id, node] of Object.entries(story.nodes)) {
    const where = `node "${id}"`;
    checkText(where, node.caption);
    checkBeats(where, node.beats);
    checkPeople(where, [...(node.onStage ?? []), ...Object.keys(node.effects?.bond ?? {})]);
    if (node.choices?.length) {
      if (node.choices.every((choice) => choice.when)) {
        problems.push(`${where}: every choice has a "when", so the player could be left with none`);
      }
      for (const choice of node.choices) {
        checkText(where, choice.label);
        checkPeople(where, Object.keys(choice.bond ?? {}));
        checkNext(`${where}, choice "${choice.id}"`, choice.next);
      }
    } else if (node.next) {
      checkNext(where, node.next);
    } else {
      problems.push(`${where}: has neither choices nor next`);
    }
  }
  for (const id of Object.keys(story.nodes)) {
    if (!reached.has(id)) problems.push(`node "${id}": nothing leads here`);
  }

  for (const ending of story.endings) checkBeats(`ending "${ending.id}"`, ending.beats);
  if (story.endings[story.endings.length - 1]?.when) problems.push(`endings: the last one needs no "when"`);
  for (const thread of story.threads) checkBeats(`thread "${thread.title}"`, thread.beats);

  return problems;
}
