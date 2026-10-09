import type { GameState } from "./engine";
import type { Lead, Story } from "./types";

// The week in progress, kept on the device so a player can close the game and
// pick it up later exactly where they stopped. It is saved after every step
// and cleared once the week is finished.

const STORAGE_KEY = "church-mind:week";
const VERSION = 1;

export interface SavedWeek {
  lead: Lead;
  game: GameState;
}

export function saveWeek(story: Story, lead: Lead, game: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: VERSION, story: story.id, lead, game }));
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

/** The week the player left off, if there is one and it still fits the story. */
export function loadWeek(story: Story): SavedWeek | null {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as { v?: number; story?: string; lead?: Lead; game?: GameState } | null;
    if (!saved || saved.v !== VERSION || saved.story !== story.id) return null;
    const { lead, game } = saved;
    if (!lead || !game || typeof lead.name !== "string" || !lead.look) return null;
    if (!story.leads.some((option) => option.id === lead.id)) return null;
    // A story update may have moved things; only resume a week that still makes sense.
    const fits =
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
      Array.isArray(game.path);
    return fits ? { lead, game } : null;
  } catch {
    return null;
  }
}
