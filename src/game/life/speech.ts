import { useEffect, useRef } from "react";
import { clipId } from "../speech";
import type { Scripture, VoiceStyle } from "../types";
import { spokenReference, voice } from "../voice";

// Reading Juniper Lane aloud. This world is told by one narrator, like an
// audiobook: the same voice that reads narration and Scripture elsewhere.
// Lines that carry something only the player knows (their name, a child's
// name, their bank balance) can't be recorded in advance; the device's own
// voice reads those.

export const NARRATOR: VoiceStyle = { kind: "female", variant: 2, pitch: 0.95, rate: 0.95 };

/** A passage as it is read out: where it is from, the words, and what they mean here. */
export const scriptureSpeech = (scripture: Scripture) => [`${spokenReference(scripture.reference)}.`, scripture.text, ...scripture.context].join(" ");

/** Reads lines one after another while `on`. Starts again whenever `key` changes. */
export function useReadAloud(lines: string[], on: boolean, key: string) {
  const latest = useRef(lines);
  latest.current = lines;
  useEffect(() => {
    if (!on) return;
    const queue = [...latest.current];
    let stopped = false;
    const next = () => {
      const line = queue.shift();
      if (stopped || !line) return;
      voice.speak(line, NARRATOR, next, clipId("narrator", line));
    };
    next();
    return () => {
      stopped = true;
      voice.cancel();
    };
  }, [on, key]);
}
