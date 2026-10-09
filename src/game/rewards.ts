import { matches, type GameState } from "./engine";
import { QUALITY_IDS, type Ending, type Keepsake, type Story } from "./types";

// What a player keeps between weeks: coins, keepsakes, and things bought with
// coins. Saved on the device, so it is still there next time they play.
//
// Coins come from finishing a week, from what grew in the player, and from
// keepsakes, which mark moments with people (including going back to put
// something right). Nothing here measures how good the player was.

const STORAGE_KEY = "church-mind:profile";

export interface Profile {
  coins: number;
  /** Ids of keepsakes collected. */
  keepsakes: string[];
  /** Ids of shop items bought. */
  owned: string[];
  weeks: number;
  /** Best score in each quick game, by game id. */
  best: Record<string, number>;
  /** Endings reached, as `story id:ending id`. */
  endings: string[];
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  blurb: string;
}

/** Things to spend coins on. Each unlocks options in the character creator. */
export const SHOP: ShopItem[] = [
  { id: "pendant", name: "Cross pendant", price: 80, blurb: "A small cross on a chain, worn every day." },
  { id: "hair", name: "Bold hair colours", price: 70, blurb: "Burgundy, honey and blue-black." },
  { id: "jewel", name: "Jewel-tone tops", price: 90, blurb: "Emerald, royal purple and coral." },
  { id: "scarf", name: "Scarf", price: 100, blurb: "For cold mornings at the community garden." },
  { id: "beanie", name: "Beanie", price: 120, blurb: "A knitted hat. Dev says it suits you." },
];

export function loadProfile(): Profile {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<Profile> | null;
    if (saved && typeof saved.coins === "number") {
      return { coins: saved.coins, keepsakes: saved.keepsakes ?? [], owned: saved.owned ?? [], weeks: saved.weeks ?? 0, best: saved.best ?? {}, endings: saved.endings ?? [] };
    }
  } catch {
    // Nothing saved, or storage is unavailable: start fresh.
  }
  return { coins: 0, keepsakes: [], owned: [], weeks: 0, best: {}, endings: [] };
}

function saveProfile(profile: Profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Private browsing: rewards last for this visit only.
  }
}

export interface WeekReward {
  coins: number;
  /** Keepsakes this week's choices led to. */
  earned: Keepsake[];
  /** The ones the player did not already have. */
  fresh: Keepsake[];
  /** This is the first time the player has reached this ending. */
  newEnding: boolean;
  /** The week was reached by going back and choosing differently. */
  replay: boolean;
  profile: Profile;
}

const endingKey = (story: Story, ending: Ending) => `${story.id}:${ending.id}`;

/** The endings of a story the player has reached so far. */
export function endingsFound(story: Story, profile: Profile): Ending[] {
  return story.endings.filter((ending) => profile.endings.includes(endingKey(story, ending)));
}

/**
 * Works out what a finished week is worth, saves it, and returns it. A week
 * reached by going back and choosing differently pays only for what is new.
 */
export function rewardWeek(story: Story, state: GameState, ending: Ending, replay = false): WeekReward {
  const profile = loadProfile();
  const earned = story.keepsakes.filter((keepsake) => matches(keepsake.when, state));
  const fresh = earned.filter((keepsake) => !profile.keepsakes.includes(keepsake.id));
  const newEnding = !profile.endings.includes(endingKey(story, ending));
  const growth = QUALITY_IDS.reduce((sum, id) => sum + state.qualities[id], 0);
  const coins = (replay ? 0 : 25 + growth * 4) + fresh.length * 8 + (newEnding ? 10 : 0);
  const next: Profile = {
    ...profile,
    coins: profile.coins + coins,
    keepsakes: [...profile.keepsakes, ...fresh.map((keepsake) => keepsake.id)],
    weeks: profile.weeks + (replay ? 0 : 1),
    endings: newEnding ? [...profile.endings, endingKey(story, ending)] : profile.endings,
  };
  saveProfile(next);
  return { coins, earned, fresh, newEnding, replay, profile: next };
}

/** Adds coins won in passing: a mini-game, or a dog who was glad to see you. */
export function addCoins(coins: number): Profile {
  const profile = loadProfile();
  if (coins <= 0) return profile;
  const next = { ...profile, coins: profile.coins + coins };
  saveProfile(next);
  return next;
}

/** The quick games, by the name players see. */
export const GAME_NAMES: Record<string, string> = { coffee: "The 9:15 rush", seeds: "Beans from peas", boxes: "Third floor, no lift", books: "The returns trolley", inbox: "Inbox, 8:58 a.m." };

/** Notes a quick-game score. Returns the player's best, and whether this score just beat it. */
export function recordBest(game: string, score: number): { best: number; fresh: boolean } {
  const profile = loadProfile();
  const before = profile.best[game] ?? 0;
  if (score <= before) return { best: before, fresh: false };
  saveProfile({ ...profile, best: { ...profile.best, [game]: score } });
  return { best: score, fresh: before > 0 };
}

/** Buys a shop item if the player can afford it. Returns the updated profile. */
export function buy(item: ShopItem): Profile {
  const profile = loadProfile();
  if (profile.owned.includes(item.id) || profile.coins < item.price) return profile;
  const next = { ...profile, coins: profile.coins - item.price, owned: [...profile.owned, item.id] };
  saveProfile(next);
  return next;
}
