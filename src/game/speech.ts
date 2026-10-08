import { spokenReference } from "./voice";
import type { Beat, Lead, Story, VoiceStyle } from "./types";

// What is said aloud for each line, and by whom. The game and the script that
// records the voices (`scripts/generate-voices.mjs`) both use this, so a
// recording made for a line is always found again when that line is played.

export interface Speech {
  text: string;
  style: VoiceStyle;
  /** Who is speaking: `narrator`, the lead's id, the partner's name, or a cast id. */
  voiceId: string;
  /** Names the recording of this exact line in this voice. */
  clip: string;
}

/** A short, stable name for one line spoken by one voice. */
export function clipId(voiceId: string, text: string): string {
  let hash = 0x811c9dc5;
  const input = `${voiceId}|${text}`;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return `${voiceId}-${(hash >>> 0).toString(16).padStart(8, "0")}${input.length.toString(36)}`;
}

export function speechFor(story: Story, lead: Lead, beat: Beat, text: (raw: string) => string): Speech {
  const partnerId = lead.partner.toLowerCase();
  const who = (speaker: string): { voiceId: string; style: VoiceStyle } => {
    if (speaker === "you") return { voiceId: lead.id, style: lead.voice };
    if (speaker === "partner") return { voiceId: partnerId, style: lead.partnerVoice };
    const character = story.cast.find((candidate) => candidate.id === speaker);
    return character ? { voiceId: character.id, style: character.voice } : { voiceId: "narrator", style: story.narrator };
  };
  const line = (spoken: string, voiceId: string, style: VoiceStyle): Speech => ({ text: spoken, style, voiceId, clip: clipId(voiceId, spoken) });

  switch (beat.type) {
    case "narration":
      return line(text(beat.text), "narrator", story.narrator);
    case "thought":
      return line(text(beat.text), lead.id, { ...lead.voice, volume: 0.8 });
    case "dialogue":
    case "message": {
      const { voiceId, style } = who(beat.speaker);
      return line(text(beat.text), voiceId, style);
    }
    case "scripture":
      return line(
        [`${spokenReference(beat.scripture.reference)}.`, beat.scripture.text, ...beat.scripture.context].join(" "),
        "narrator",
        story.narrator
      );
  }
}
