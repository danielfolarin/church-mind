// Shapes for a Church Mind story. A story is plain data: the engine and the
// screens in `src/App.tsx` know nothing about any particular plot.
//
// A story is a week lived in a neighbourhood. The week is cut into time slots
// (a morning and an evening on each day). In every slot the player sees the
// map and picks one thing to do: an Opportunity, which happens at a Place and
// plays a short scene made of StoryNodes. Time, money and energy are limited,
// so choosing one thing means leaving another undone.

export const QUALITY_IDS = ["wisdom", "integrity", "compassion", "courage", "trust"] as const;
export type QualityId = (typeof QUALITY_IDS)[number];
export type Qualities = Record<QualityId, number>;

export type SettingId = "garden" | "cafe" | "kitchen" | "room" | "river" | "hall";

/** The expression on a character's face. */
export type Mood = "neutral" | "warm" | "sad" | "hurt" | "thoughtful" | "worried";

export type HairStyle = "short" | "side" | "puff" | "wavy" | "bun" | "long" | "curly";
export type TopStyle = "plain" | "cardigan" | "apron" | "hoodie" | "collar";

/** What someone does with their hands when they are standing about. */
export type Stance = "relaxed" | "akimbo" | "hip" | "pockets" | "clasped" | "book" | "cup" | "wave" | "open";

/**
 * How someone carries themselves: the rhythm and size of their movements when
 * they are standing about. It is what makes two people in the same pose look
 * like different people.
 */
export type Manner = "calm" | "confident" | "lively" | "graceful" | "easy" | "brisk" | "steady" | "warm";

/** A person's frame. Every part is optional; sizes are in the figure's own units. */
export interface Build {
  /** 1 is average height; 0.93 is short, 1.06 is tall. */
  height?: number;
  /** Width across the shoulders (about 88 to 116). */
  shoulders?: number;
  /** Width across the hips (about 78 to 96). */
  hips?: number;
  /** Thickness of arms and legs (about 16 to 24). */
  limbs?: number;
}

/** How a character is drawn. Colours are hex values. */
export interface Look {
  skin: string;
  /** A slightly darker skin tone, for the neck, ears and nose. */
  shade: string;
  hair: string;
  hairStyle: HairStyle;
  /** Clothing colour. */
  top: string;
  topStyle?: TopStyle;
  /** Second clothing colour: shirt under a cardigan, apron, collar, drawstrings. */
  accent?: string;
  lip?: string;
  /** Iris colour. */
  eyes?: string;
  /** Narrower shoulders. */
  slim?: boolean;
  glasses?: boolean;
  beard?: boolean;
  earrings?: boolean;
  /** A knitted hat of this colour. */
  beanie?: string;
  /** A scarf of this colour. */
  scarf?: string;
  /** A small cross on a chain. */
  pendant?: boolean;
  /** Full figure: how they stand. `akimbo` is hands on hips; `hip` is one hand on a hip. */
  stance?: Stance;
  /** Full figure: how they move while standing. */
  manner?: Manner;
  /** Full figure: their frame. */
  build?: Build;
  /** Full figure: trouser colour. */
  legs?: string;
  /** Full figure: trousers cut wide all the way down. */
  wideLegs?: boolean;
  /** Full figure: wears a skirt of this colour instead of trousers. */
  skirt?: string;
  longSkirt?: boolean;
  shoes?: string;
}

/**
 * How a character sounds when lines are read aloud. Devices offer different
 * voices, so this asks for a kind of voice rather than a particular one.
 */
export interface VoiceStyle {
  kind: "female" | "male";
  /** Picks a different voice of that kind where the device has several. */
  variant?: number;
  /** 1 is normal; lower is deeper. */
  pitch?: number;
  /** 1 is normal; lower is slower. */
  rate?: number;
  volume?: number;
}

/** Decides whether something is shown, offered, or chosen. Every listed test must pass. */
export interface Condition {
  /** All of these flags are set. */
  all?: string[];
  /** At least one of these flags is set. */
  any?: string[];
  /** None of these flags are set. */
  none?: string[];
  /** Each quality is at least this value. */
  min?: Partial<Qualities>;
  /** Each quality is at most this value. */
  max?: Partial<Qualities>;
  minMoney?: number;
  maxMoney?: number;
  /** Closeness with each named person is at least this value. */
  bond?: Record<string, number>;
}

/** What doing something changes. Every part is optional. */
export interface Effects {
  /** Qualities that grow. Growth never goes down. */
  grow?: Partial<Qualities>;
  /** Flags remembered for later. */
  flags?: string[];
  /** Dollars gained (or spent, if negative). */
  money?: number;
  /** Pays this much, or whatever the player has if that is less. */
  payUpTo?: number;
  /** Energy gained (or used, if negative). */
  energy?: number;
  /** Closeness gained or lost with people, e.g. `{ dev: 1 }`. */
  bond?: Record<string, number>;
}

export interface Scripture {
  reference: string;
  translation: string;
  text: string;
  /** Heading above the explanation, e.g. "How this speaks to the decision". */
  contextTitle: string;
  /** Short paragraphs placing the passage in context. */
  context: string[];
}

/**
 * One piece of a scene. Text may use the tokens {you}, {partner}, {he}, {him},
 * {his}, {himself}, {He}, {Him}, {His} and {money}; they are filled in from the
 * lead character the player picked and the money they have.
 */
export type Beat = {
  when?: Condition;
  /** Changes other characters' expressions at this moment, e.g. `{ partner: "hurt" }`. */
  react?: Record<string, Mood>;
} & (
  | { type: "narration"; text: string }
  | { type: "thought"; text: string }
  | { type: "dialogue"; speaker: string; text: string; /** The speaker's expression. */ mood?: Mood }
  | { type: "message"; speaker: string; text: string }
  | { type: "scripture"; scripture: Scripture }
);

/**
 * Where a scene goes next: a node id, `map` to return to the neighbourhood, or
 * a list of branches where the first one whose `when` passes wins (finish the
 * list with a branch that has no `when`).
 */
export type Next = string | { when?: Condition; to: string }[];

/**
 * Marks something as a temptation, so the game makes it look as attractive as
 * it would feel: `money` glitters, `ease` glows like the easy way out.
 */
export type Tempt = "money" | "ease";

/** Something the player does inside a scene. */
export interface Choice extends Effects {
  id: string;
  label: string;
  tempt?: Tempt;
  /** Only offered when this passes. */
  when?: Condition;
  next: Next;
}

export interface StoryNode {
  setting: SettingId;
  /** Time and place line, e.g. "Monday evening · Kindling Café". */
  caption: string;
  beats: Beat[];
  /**
   * Characters standing in the scene from its first moment. Defaults to
   * everyone who speaks in it; anyone left out walks in at their first line.
   * The player is always present.
   */
  onStage?: string[];
  /** Applied when the scene reaches this node. */
  effects?: Effects;
  /** Question shown above the choices. */
  prompt?: string;
  choices?: Choice[];
  /** Used when the node has no choices: a single "Continue" step. */
  next?: Next;
}

export type PlaceId = string;
export type PlaceIcon = "home" | "cup" | "leaf" | "table" | "water" | "chapel" | "door";

export interface Place {
  name: string;
  /** Position on the map, as percentages from the left and top. */
  x: number;
  y: number;
  icon: PlaceIcon;
  /** The road junction (see `Story.roads`) this place's front path joins. */
  at: string;
}

/** The streets people walk along. Positions are percentages, like places. */
export interface Roads {
  junctions: Record<string, [x: number, y: number]>;
  /** Pairs of junction ids joined by a street. */
  streets: [string, string][];
}

export interface Slot {
  /** Used by opportunities, e.g. "mon-eve". */
  id: string;
  day: string;
  time: "Morning" | "Evening";
}

/** One thing the player could do with a slot of time. */
export interface Opportunity extends Effects {
  id: string;
  place: PlaceId;
  title: string;
  /** One line on why it matters. May use tokens. */
  blurb: string;
  /** People who will be there; shown as faces on the map. */
  with?: string[];
  /** The slots in which this is on offer. */
  slots: string[];
  when?: Condition;
  /** Marks a moment the story is waiting on. */
  key?: boolean;
  tempt?: Tempt;
  /** A quick game played on the way in: `coffee`, `seeds` or `boxes`. See MiniGame.tsx. */
  game?: "coffee" | "seeds" | "boxes";
  /** Can be done more than once (rest, prayer). */
  repeatable?: boolean;
  /** Happens by itself at the start of the slot and doesn't use up the time. */
  auto?: boolean;
  /** The node the scene starts at. */
  scene: string;
}

/** How the week turned out. The first ending whose `when` passes is used. */
export interface Ending {
  id: string;
  when?: Condition;
  title: string;
  /** Short label for the kind of ending, e.g. "A changed course". */
  kind: string;
  setting: SettingId;
  beats: Beat[];
  scripture: Scripture;
  /** Questions for the player to carry into real life. */
  questions: string[];
}

/**
 * Something the player takes away from a week and keeps: usually a small gift
 * from someone, marking a moment with them. Collected across weeks.
 */
export interface Keepsake {
  id: string;
  name: string;
  /** A single emoji shown on the keepsake's token. */
  icon: string;
  /** One or two lines about it. May use tokens. */
  text: string;
  /** The week must have gone this way to earn it. */
  when: Condition;
}

/** A strand of the week summed up at the end, e.g. "Dev" or "Rent". */
export interface Thread {
  title: string;
  /** Usually one conditional beat per way the strand can turn out. */
  beats: Beat[];
}

export interface Lead {
  id: string;
  name: string;
  partner: string;
  pronouns: { he: string; him: string; his: string; himself: string };
  look: Look;
  partnerLook: Look;
  voice: VoiceStyle;
  partnerVoice: VoiceStyle;
}

export interface Character {
  /** Speaker id used in dialogue beats. `you` and `partner` are reserved. */
  id: string;
  name: string;
  /** Short points shown beside them on the cast screen. */
  traits: string[];
  look: Look;
  voice: VoiceStyle;
}

export interface Story {
  id: string;
  title: string;
  subtitle: string;
  minutes: number;
  intro: {
    place: string;
    paragraphs: string[];
    /** Short points about the player and their partner; may use tokens. */
    playerTraits: string[];
    partnerTraits: string[];
    /** How the week works, in a sentence or two. */
    howToPlay: string;
  };
  leads: Lead[];
  cast: Character[];
  /** The voice that reads narration and Scripture. */
  narrator: VoiceStyle;
  qualityNotes: Record<QualityId, string>;
  /** What the player begins the week with. */
  start: { money: number; energy: number; bond: number; place: PlaceId };
  slots: Slot[];
  places: Record<PlaceId, Place>;
  roads: Roads;
  opportunities: Opportunity[];
  nodes: Record<string, StoryNode>;
  endings: Ending[];
  threads: Thread[];
  keepsakes: Keepsake[];
}
