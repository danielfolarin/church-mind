import type { VoiceStyle } from "./types";

// Reads lines aloud with the voices built into the player's phone or computer.
// Which voices exist differs from device to device, so each character asks for
// a kind of voice and gets the closest match available.

const PREFERRED: Record<VoiceStyle["kind"], string[]> = {
  female: ["Samantha", "Karen", "Moira", "Tessa", "Catherine", "Martha", "Nicky", "Serena", "Kate", "Susan", "Allison", "Ava", "Victoria", "Fiona", "Zira", "Hazel", "Aria", "Jenny", "Sonia", "Libby", "Female"],
  male: ["Daniel", "Alex", "Tom", "Oliver", "Aaron", "Arthur", "Gordon", "Rishi", "David", "Mark", "George", "Guy", "Ryan", "Male"],
};

// Joke voices some systems ship with; never right for this story.
const NOVELTY = /albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|deranged|hysterical|junior|ralph|fred/i;

class Voice {
  private turn = 0;
  private watchdog = 0;
  // Browsers can drop an utterance that nothing refers to before it finishes.
  private queue: SpeechSynthesisUtterance[] = [];

  get supported() {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  /** Call from a click: loads the voice list and lets later lines play. */
  prime() {
    if (!this.supported) return;
    window.speechSynthesis.getVoices();
    const quiet = new SpeechSynthesisUtterance(" ");
    quiet.volume = 0;
    window.speechSynthesis.speak(quiet);
  }

  speak(text: string, style: VoiceStyle, onEnd: () => void) {
    if (!this.supported) {
      onEnd();
      return;
    }
    this.cancel();
    const turn = this.turn;
    const voice = this.pick(style);

    // Sentence by sentence: some browsers cut off a long passage partway through.
    const sentences = text.match(/[^.!?…]+[.!?…]+[”’")]*|[^.!?…]+$/g) ?? [text];
    const finish = () => {
      if (turn !== this.turn) return;
      window.clearTimeout(this.watchdog);
      this.turn += 1;
      onEnd();
    };
    // Some browsers never report that speech finished; don't wait forever.
    this.watchdog = window.setTimeout(finish, 4000 + text.length * 110);

    this.queue = sentences
      .map((sentence) => sentence.trim())
      .filter(Boolean)
      .map((sentence, index, all) => {
        const utterance = new SpeechSynthesisUtterance(sentence);
        if (voice) utterance.voice = voice;
        utterance.lang = voice?.lang ?? "en-US";
        utterance.pitch = style.pitch ?? 1;
        utterance.rate = style.rate ?? 1;
        utterance.volume = style.volume ?? 1;
        if (index === all.length - 1) {
          utterance.onend = finish;
          utterance.onerror = finish;
        }
        return utterance;
      });

    if (!this.queue.length) {
      onEnd();
      return;
    }
    for (const utterance of this.queue) window.speechSynthesis.speak(utterance);
  }

  cancel() {
    window.clearTimeout(this.watchdog);
    this.turn += 1;
    this.queue = [];
    if (this.supported) window.speechSynthesis.cancel();
  }

  private pick(style: VoiceStyle): SpeechSynthesisVoice | null {
    const english = window.speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith("en"));
    const named = PREFERRED[style.kind].flatMap((name) =>
      english.filter((voice) => voice.name.toLowerCase().includes(name.toLowerCase()))
    );
    const pool = [...new Set(named)];
    const fallback = english.filter((voice) => !NOVELTY.test(voice.name));
    const choices = pool.length ? pool : fallback.length ? fallback : english;
    if (!choices.length) return null;
    return choices[(style.variant ?? 0) % choices.length];
  }
}

export const voice = new Voice();

/** Turns "2 Corinthians 6:14" into something that reads naturally aloud. */
export function spokenReference(reference: string): string {
  return reference
    .replace(/^1 /, "First ")
    .replace(/^2 /, "Second ")
    .replace(/^3 /, "Third ")
    .replace(/:(\d+)[–-](\d+)/, ", verses $1 to $2")
    .replace(/:(\d+)/, ", verse $1");
}
