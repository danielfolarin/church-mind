import { useEffect, useState } from "react";

// Installing the game like an app, and saving it to play without internet.
// The service worker in public/sw.js does the serving; this decides when to
// offer installing and fetches the recorded voices ahead of time.

/** Must match AUDIO in public/sw.js. */
const AUDIO_CACHE = "church-mind-audio";
const SAVED_KEY = "church-mind:offline";

interface InstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let pending: InstallPrompt | null = null;
let installed = false;
const watchers = new Set<() => void>();
const announce = () => watchers.forEach((watcher) => watcher());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault(); // we show our own button instead of the browser's banner
    pending = event as InstallPrompt;
    announce();
  });
  window.addEventListener("appinstalled", () => {
    pending = null;
    installed = true;
    announce();
  });
}

export function registerServiceWorker() {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // The game still works; it just can't be installed or played offline.
    });
  });
}

export type InstallState =
  /** Already running as an installed app. */
  | "installed"
  /** The browser will install it when asked. */
  | "ready"
  /** iPhone and iPad: installing is done by hand from the Share menu. */
  | "ios"
  /** No install button here; the browser's own menu may still offer it. */
  | "manual";

export function useInstall(): { state: InstallState; install: () => Promise<void> } {
  const [, refresh] = useState(0);
  useEffect(() => {
    const watcher = () => refresh((count) => count + 1);
    watchers.add(watcher);
    return () => {
      watchers.delete(watcher);
    };
  }, []);

  const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const state: InstallState = installed || standalone ? "installed" : pending ? "ready" : ios ? "ios" : "manual";

  return {
    state,
    install: async () => {
      if (!pending) return;
      const prompt = pending;
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === "accepted") pending = null;
      announce();
    },
  };
}

export const offlineSupported = () => typeof caches !== "undefined" && "serviceWorker" in navigator;

export function savedForOffline(): boolean {
  try {
    return localStorage.getItem(SAVED_KEY) === "yes";
  } catch {
    return false;
  }
}

/**
 * Fetches every recorded voice and the game's own files so the whole game
 * works without internet. Calls `onProgress` with a number from 0 to 1.
 */
export async function saveForOffline(onProgress: (done: number) => void): Promise<void> {
  const base = import.meta.env.BASE_URL;
  const clips = (await (await fetch(`${base}audio/manifest.json`)).json()) as string[];
  const cache = await caches.open(AUDIO_CACHE);
  let finished = 0;

  // The scripts and styles this page is running, so the saved game is complete.
  const own = [...document.querySelectorAll<HTMLScriptElement | HTMLLinkElement>("script[src], link[rel=stylesheet]")]
    .map((element) => (element instanceof HTMLScriptElement ? element.src : element.href))
    .filter(Boolean);
  await Promise.all(own.map((url) => fetch(url).catch(() => null)));

  const queue = clips.map((clip) => new URL(`${base}audio/${clip}.mp3`, window.location.href).href);
  const worker = async () => {
    for (let url = queue.pop(); url; url = queue.pop()) {
      if (!(await cache.match(url))) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Could not save ${url}`);
        await cache.put(url, response);
      }
      finished += 1;
      onProgress(finished / clips.length);
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));

  try {
    localStorage.setItem(SAVED_KEY, "yes");
  } catch {
    // The voices are saved even if this note can't be.
  }
}
