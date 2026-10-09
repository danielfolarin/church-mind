import { QUALITY_IDS, type Look, type Qualities, type Scripture, type SettingId } from "../types";

// A Home on Juniper Lane.
//
// The fourth world works differently from the others. There is no plot and no
// last day: the player lives season after season, and decides what to do with
// each one. This file holds what a life is made of and how it is saved.
//
// Two things this world must never teach: that prayer is a lever which pays
// out if pulled correctly, and that giving is an investment. Answers to
// prayer here are "yes", "not yet" and "something different", and none of
// them is earned.

export const SEASONS = ["Spring", "Summer", "Autumn", "Winter"] as const;
export const TIME_PER_SEASON = 4;
export const MAX_ENERGY = 5;
export const MAX_GROWTH = 8;
export const MAX_BOND = 5;

export type RoomId = "living" | "kitchen" | "bedroom" | "second" | "study" | "garden";

export interface Room {
  built: boolean;
  wall: string;
  /** Ids of the things in it. See ITEMS. */
  items: string[];
  /** Colours chosen for things that come in colours, by item id. */
  tints: Record<string, string>;
}

export interface Prayer {
  /** A topic from the prayer list, or `own:<number>` for one the player wrote. */
  id: string;
  text: string;
  since: number;
  answer?: "yes" | "wait" | "other";
  note?: string;
  answeredAt?: number;
}

export interface Child {
  name: string;
  /** The turn they arrived. */
  arrived: number;
  /** Their age in seasons on the day they arrived: 0 for a newborn. */
  ageThen: number;
  how: "born" | "adopted";
}

export interface Memory {
  turn: number;
  icon: string;
  text: string;
}

export interface LifeState {
  v: 1;
  /** Seasons lived so far. */
  turn: number;
  /** Time left this season. */
  time: number;
  money: number;
  mortgage: number;
  payment: number;
  /** Mortgage payments missed and not yet dealt with. */
  arrears: number;
  energy: number;
  /** What a turn of work pays. */
  pay: number;
  qualities: Qualities;
  /** Closeness: `partner`, `walt`, `church`, `kids`. */
  bonds: Record<string, number>;
  stage: "single" | "courting" | "engaged" | "married";
  /** The id of the person the player is seeing or married to. */
  partner: string | null;
  children: Child[];
  hoping: "birth" | "adopt" | null;
  hopingSince: number;
  /** The turn a baby is due. */
  due: number | null;
  rooms: Record<RoomId, Room>;
  exterior: { roof: string; trim: string };
  prayers: Prayer[];
  flags: string[];
  /** Events already lived through. */
  seen: string[];
  /** How many times each activity has been done, ever. */
  counts: Record<string, number>;
  /** Activities done this season. */
  season: string[];
  /** When things happened, so that later things can follow from them. */
  marks: Record<string, number>;
  scrapbook: Memory[];
  /** An event waiting to be played before the season is planned. */
  pending: string | null;
  /** The dog, if there is one. */
  pet: { name: string } | null;
  /** The mortgage at the start of this year, for the year's review. */
  yearStart: { mortgage: number; hosted: number; prayed: number };
}

export interface LifeEffects {
  money?: number;
  energy?: number;
  time?: number;
  grow?: Partial<Qualities>;
  bond?: Record<string, number>;
  flags?: string[];
  /** Flags to clear. */
  unflag?: string[];
  mortgage?: number;
  payment?: number;
  pay?: number;
  memory?: { icon: string; text: string };
}

/** Who the player is, carried in from the character screen. */
export interface Me {
  name: string;
  base: string;
  look: Look;
}

export interface LifeChoice {
  label: string;
  tempt?: "money" | "ease";
  /** Only offered when this passes. */
  when?: (state: LifeState) => boolean;
  effects?: LifeEffects;
  /** Anything the effects above can't express. `name` is whatever the player typed, if the scene asked for a name. */
  then?: (state: LifeState, name: string) => LifeState;
  result: string[] | ((state: LifeState) => string[]);
  scripture?: Scripture;
}

export interface LifeEvent {
  id: string;
  title: string;
  setting: SettingId;
  /** Faces shown with the scene: `you`, `partner`, `walt`. */
  with?: string[];
  beats: string[] | ((state: LifeState) => string[]);
  scripture?: Scripture;
  /** Asks the player for a name before the choices are shown: a child, or a dog. */
  naming?: "born" | "adopted" | "pet";
  choices: LifeChoice[];
}

// ——— The house ———

export const ROOMS: Record<RoomId, { name: string; cost: number; blurb: string }> = {
  living: { name: "Front room", cost: 0, blurb: "Where people end up, whatever you planned." },
  kitchen: { name: "Kitchen", cost: 0, blurb: "A table changes what a kitchen is for." },
  bedroom: { name: "Bedroom", cost: 0, blurb: "Yours. The mattress came with you." },
  second: { name: "Second bedroom", cost: 900, blurb: "Under the eaves. Storage now; one day, perhaps, somebody’s room." },
  study: { name: "Study", cost: 700, blurb: "A lean-to on the side of the house, with a door that shuts." },
  garden: { name: "Garden", cost: 0, blurb: "Mostly dandelions, so far." },
};

export const WALLS = ["#E8DCC8", "#DCE4E1", "#E7C9A9", "#C9D4C3", "#D9B8B0", "#B9C4D6", "#F0D9A0", "#B7A8C4"];
export const ROOFS = ["#7A4A3A", "#3F566B", "#4E6A4A", "#5B3A4A", "#3A3A3F"];
export const TRIMS = ["#F4EBDD", "#3A2A22", "#2F6F73", "#B5574A", "#B8862F"];
const FABRICS = ["#2F6F73", "#A8553A", "#55704F", "#6B3F5A", "#B8862F", "#3F5A7A"];

export interface Item {
  room: RoomId;
  name: string;
  price: number;
  /** What it makes possible, if anything. */
  note?: string;
  /** The colours it comes in. */
  tints?: string[];
}

export const ITEMS: Record<string, Item> = {
  sofa: { room: "living", name: "Sofa", price: 180, tints: FABRICS, note: "Somewhere for other people to sit." },
  rug: { room: "living", name: "Rug", price: 60, tints: FABRICS },
  lamp: { room: "living", name: "Standing lamp", price: 40 },
  books: { room: "living", name: "Bookshelves", price: 110 },
  plant: { room: "living", name: "A plant you will try to keep alive", price: 25 },
  picture: { room: "living", name: "A picture for the wall", price: 30 },
  piano: { room: "living", name: "Second-hand piano", price: 400 },
  stove: { room: "living", name: "A wood-burning stove", price: 450, note: "Somewhere for everyone to end up in winter." },

  table: { room: "kitchen", name: "Kitchen table and chairs", price: 150, note: "Lets you have people round for dinner." },
  fridge: { room: "kitchen", name: "A fridge that doesn’t hum", price: 200 },
  shelves: { room: "kitchen", name: "Shelves and jars", price: 70 },
  kettle: { room: "kitchen", name: "A proper kettle", price: 20 },
  flowers: { room: "kitchen", name: "Flowers in a jug", price: 15 },
  clock: { room: "kitchen", name: "Kitchen clock", price: 25 },

  bed: { room: "bedroom", name: "A bed frame", price: 160, tints: ["#8A6A48", "#3A2A22", "#D9CDB2", "#3F5A7A"], note: "The mattress finally leaves the floor." },
  quilt: { room: "bedroom", name: "Quilt", price: 50, tints: FABRICS },
  wardrobe: { room: "bedroom", name: "Wardrobe", price: 140 },
  bedside: { room: "bedroom", name: "Bedside table and lamp", price: 35 },
  curtains: { room: "bedroom", name: "Curtains", price: 45, tints: FABRICS },

  cot: { room: "second", name: "Cot", price: 120 },
  mobile: { room: "second", name: "A mobile of paper birds", price: 20 },
  toybox: { room: "second", name: "Toy box", price: 45 },
  rocker: { room: "second", name: "Rocking chair", price: 110 },
  bunk: { room: "second", name: "Bunk beds", price: 220 },

  desk: { room: "study", name: "Desk and lamp", price: 130 },
  armchair: { room: "study", name: "An armchair by the window", price: 150, tints: FABRICS, note: "A place to be still. Rest and prayer do more here." },
  studyshelf: { room: "study", name: "A shelf of books", price: 100 },
  map: { room: "study", name: "A map for the wall", price: 30 },

  tree: { room: "garden", name: "An apple tree", price: 70 },
  swing: { room: "garden", name: "A swing", price: 110 },
  bench: { room: "garden", name: "Garden bench", price: 90, note: "A place to be still. Rest does more here." },
  veg: { room: "garden", name: "Vegetable patch", price: 60, note: "Takes a little off the shopping every season." },
  blooms: { room: "garden", name: "A border of flowers", price: 30 },
  fence: { room: "garden", name: "A new front fence", price: 80 },
  greenhouse: { room: "garden", name: "A small greenhouse", price: 380, note: "Walt will have views about your tomatoes." },
};

// ——— A new life ———

const emptyRoom = (built: boolean, wall = WALLS[0], items: string[] = []): Room => ({ built, wall, items, tints: {} });

export function newLife(): LifeState {
  return {
    v: 1,
    turn: 0,
    time: TIME_PER_SEASON,
    money: 400,
    mortgage: 12000,
    payment: 600,
    arrears: 0,
    energy: 4,
    pay: 650,
    qualities: { wisdom: 0, integrity: 0, compassion: 0, courage: 0, trust: 0 },
    bonds: { partner: 0, walt: 0, church: 0, kids: 0 },
    stage: "single",
    partner: null,
    children: [],
    hoping: null,
    hopingSince: 0,
    due: null,
    rooms: {
      living: emptyRoom(true),
      kitchen: emptyRoom(true, WALLS[1]),
      bedroom: emptyRoom(true, WALLS[2]),
      second: emptyRoom(false, WALLS[3]),
      study: emptyRoom(false, WALLS[5]),
      garden: emptyRoom(true),
    },
    exterior: { roof: ROOFS[0], trim: TRIMS[0] },
    prayers: [],
    flags: [],
    seen: [],
    counts: {},
    season: [],
    marks: {},
    scrapbook: [],
    pending: "welcome",
    pet: null,
    yearStart: { mortgage: 12000, hosted: 0, prayed: 0 },
  };
}

// ——— Reading a life ———

export const yearOf = (turn: number) => Math.floor(turn / 4) + 1;
export const seasonOf = (turn: number) => SEASONS[turn % 4];
export const when = (turn: number) => `${seasonOf(turn)}, year ${yearOf(turn)}`;
export const has = (state: LifeState, flag: string) => state.flags.includes(flag);
export const count = (state: LifeState, id: string) => state.counts[id] ?? 0;
export const owns = (state: LifeState, item: string) => state.rooms[ITEMS[item].room].built && state.rooms[ITEMS[item].room].items.includes(item);
export const since = (state: LifeState, mark: string) => (mark in state.marks ? state.turn - state.marks[mark] : -1);
export const ageOf = (state: LifeState, child: Child) => child.ageThen + (state.turn - child.arrived);
/** A place in the house made for sitting still. */
export const hasStillPlace = (state: LifeState) => owns(state, "armchair") || owns(state, "bench");

const clamp = (value: number, max: number) => Math.max(0, Math.min(max, value));

export function applyEffects(state: LifeState, effects: LifeEffects | undefined): LifeState {
  if (!effects) return state;
  const qualities = { ...state.qualities };
  for (const id of QUALITY_IDS) {
    if (effects.grow?.[id]) qualities[id] = Math.min(MAX_GROWTH, qualities[id] + (effects.grow[id] ?? 0));
  }
  const bonds = { ...state.bonds };
  for (const [id, change] of Object.entries(effects.bond ?? {})) bonds[id] = clamp((bonds[id] ?? 0) + change, MAX_BOND);
  const flags = [...state.flags.filter((flag) => !(effects.unflag ?? []).includes(flag)), ...(effects.flags ?? []).filter((flag) => !state.flags.includes(flag))];
  const marks = { ...state.marks };
  for (const flag of effects.flags ?? []) if (!(flag in marks)) marks[flag] = state.turn;
  return {
    ...state,
    qualities,
    bonds,
    flags,
    marks,
    money: state.money + (effects.money ?? 0),
    energy: clamp(state.energy + (effects.energy ?? 0), MAX_ENERGY),
    time: Math.max(0, state.time + (effects.time ?? 0)),
    mortgage: Math.max(0, state.mortgage + (effects.mortgage ?? 0)),
    payment: state.payment + (effects.payment ?? 0),
    pay: state.pay + (effects.pay ?? 0),
    scrapbook: effects.memory ? [...state.scrapbook, { turn: state.turn, ...effects.memory }] : state.scrapbook,
  };
}

// ——— Building and decorating ———

export function buildRoom(state: LifeState, id: RoomId): LifeState {
  const room = state.rooms[id];
  if (room.built || state.money < ROOMS[id].cost || state.time < 1) return state;
  return {
    ...state,
    money: state.money - ROOMS[id].cost,
    time: state.time - 1,
    rooms: { ...state.rooms, [id]: { ...room, built: true } },
    scrapbook: [...state.scrapbook, { turn: state.turn, icon: "🔨", text: `You built the ${ROOMS[id].name.toLowerCase()}.` }],
  };
}

export function buyItem(state: LifeState, id: string): LifeState {
  const item = ITEMS[id];
  const room = state.rooms[item.room];
  if (!room.built || room.items.includes(id) || state.money < item.price) return state;
  const tints = item.tints ? { ...room.tints, [id]: room.tints[id] ?? item.tints[0] } : room.tints;
  return { ...state, money: state.money - item.price, rooms: { ...state.rooms, [item.room]: { ...room, items: [...room.items, id], tints } } };
}

export function tintItem(state: LifeState, id: string, colour: string): LifeState {
  const room = state.rooms[ITEMS[id].room];
  return { ...state, rooms: { ...state.rooms, [ITEMS[id].room]: { ...room, tints: { ...room.tints, [id]: colour } } } };
}

export function paintRoom(state: LifeState, id: RoomId, wall: string): LifeState {
  return { ...state, rooms: { ...state.rooms, [id]: { ...state.rooms[id], wall } } };
}

// ——— Saving ———

const STORAGE_KEY = "church-mind:life";

export function loadLife(): LifeState | null {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as LifeState | null;
    if (saved && saved.v === 1 && typeof saved.turn === "number" && saved.rooms?.living) return { ...newLife(), ...saved };
  } catch {
    // Nothing saved, or storage is unavailable.
  }
  return null;
}

export function saveLife(state: LifeState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private browsing: this life lasts for the visit only.
  }
}

export function clearLife() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
}
