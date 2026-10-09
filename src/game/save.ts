import type { GameState } from "./engine";
import type { Lead, Story } from "./types";

// The week in progress, kept on the device so a player can close the game and
// pick it up later exactly where they stopped. It is saved after every step
// and cleared once the week is finished.

const STORAGE_KEY = "church-mind:week";
const VERSION = 2;

export interface SavedWeek {
  story: Story;
  lead: Lead;
  game: GameState;
  /** How things stood at the start of each morning and evening so far. */
  trail: GameState[];
}

export function saveWeek(story: Story, lead: Lead, game: GameState, trail: GameState[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: VERSION, story: story.id, lead, game, trail }));
  } catch {
    // Private browsing: the week lasts for this visit only.
  }
}

export function clearWeek() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
}

function fits(story: Story, game: GameState | undefined): game is GameState {
  return Boolean(
    game &&
      (game.phase === "map" || game.phase === "scene") &&
      Number.isInteger(game.slot) &&
      game.slot >= 0 &&
      game.slot < story.slots.length &&
      (game.phase === "map" || (game.nodeId !== null && game.nodeId in story.nodes)) &&
      game.place in story.places &&
      typeof game.money === "number" &&
      typeof game.energy === "number" &&
      Array.isArray(game.flags) &&
      Array.isArray(game.done) &&
      Array.isArray(game.path)
  );
}

/** The week the player left off, if there is one and it still fits its story. */
export function loadWeek(stories: Story[]): SavedWeek | null {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as { v?: number; story?: string; lead?: Lead; game?: GameState; trail?: GameState[] } | null;
    if (!saved || (saved.v !== 1 && saved.v !== VERSION)) return null;
    const story = stories.find((candidate) => candidate.id === saved.story);
    const { lead, game } = saved;
    if (!story || !lead || typeof lead.name !== "string" || !lead.look) return null;
    if (!story.leads.some((option) => option.id === lead.id)) return null;
    // A story update may have moved things; only resume a week that still makes sense.
    if (!fits(story, game)) return null;
    const trail = Array.isArray(saved.trail) && saved.trail.every((step) => fits(story, step)) ? saved.trail : [];
    return { story, lead, game, trail };
  } catch {
    return null;
  }
}
