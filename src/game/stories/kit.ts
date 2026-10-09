import type { Beat, Condition, Lead, Look, Mood, Scripture, VoiceStyle } from "../types";
import { CALEB, NAOMI } from "./alderRowWeek";

// Shared pieces for writing a world. Every story follows the same rules:
//
// - A week is eight slots of time. In each one the player picks an
//   Opportunity from the map, which plays a short scene made of nodes.
// - Text may use {partner}, {he}, {him}, {his}, {He}, {Him}, {His} and
//   {money}. Don't use the player's name ({you}) in anything spoken: players
//   bring their own character, and every line is recorded in advance.
// - Scripture is quoted from the World English Bible (public domain), always
//   with its context, and never as a punishment.
// - Every wrong turn has a way back, and no one in the story is a villain.

type Extra = { when?: Condition; react?: Record<string, Mood> };
/** Narration. */
export const n = (text: string, extra: Extra = {}): Beat => ({ type: "narration", text, ...extra });
/** The player's private thought. */
export const t = (text: string, extra: Extra = {}): Beat => ({ type: "thought", text, ...extra });
/** A spoken line, with the speaker's expression. */
export const d = (speaker: string, text: string, mood?: Mood, extra: Extra = {}): Beat => ({ type: "dialogue", speaker, text, mood, ...extra });
/** A phone message. */
export const m = (speaker: string, text: string, extra: Extra = {}): Beat => ({ type: "message", speaker, text, ...extra });
/** A Scripture reflection. */
export const s = (scripture: Scripture, extra: Extra = {}): Beat => ({ type: "scripture", scripture, ...extra });

export const WEB = "World English Bible";

/**
 * The two leading roles of a world, one for each recorded player voice. The
 * player's own character supplies the name and looks; the world supplies the
 * person at the centre of its story.
 */
export function leadsWith(partner: { name: string; pronouns: Lead["pronouns"]; look: Look; voice: VoiceStyle }): Lead[] {
  const shared = { partner: partner.name, pronouns: partner.pronouns, partnerLook: partner.look, partnerVoice: partner.voice };
  return [
    { id: "naomi", name: "Naomi", look: NAOMI, voice: { kind: "female", variant: 0 }, ...shared },
    { id: "caleb", name: "Caleb", look: CALEB, voice: { kind: "male", variant: 0, pitch: 0.95 }, ...shared },
  ];
}

export const HE: Lead["pronouns"] = { he: "he", him: "him", his: "his", himself: "himself" };
export const SHE: Lead["pronouns"] = { he: "she", him: "her", his: "her", himself: "herself" };
