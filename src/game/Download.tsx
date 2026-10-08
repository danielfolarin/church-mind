import { useState } from "react";
import { offlineSupported, savedForOffline, saveForOffline, useInstall } from "./offline";

// The "Download the game" panel on the title screen: install it like an app,
// and save everything so it plays without internet.

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19h14" />
    </svg>
  );
}

export function DownloadPanel() {
  const { state, install } = useInstall();
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(savedForOffline);
  const [progress, setProgress] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const canSave = offlineSupported();

  async function save() {
    setFailed(false);
    setProgress(0);
    try {
      await saveForOffline(setProgress);
      setSaved(true);
    } catch {
      setFailed(true);
    }
    setProgress(null);
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold tracking-wide text-cm-cream/80 transition hover:border-white/40 hover:text-cm-cream"
      >
        <DownloadIcon />
        Download the game
      </button>

      {open && (
        <div className="mt-3 max-w-xl animate-cm-rise space-y-5 rounded-2xl border border-white/10 bg-cm-night/85 p-5 backdrop-blur">
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cm-gold">Put it on your device</h2>
            {state === "installed" && <p className="mt-2 text-sm leading-relaxed text-cm-cream/85">Church Mind is installed. Look for its icon on your home screen or in your apps.</p>}
            {state === "ready" && (
              <>
                <p className="mt-2 text-sm leading-relaxed text-cm-cream/85">Install Church Mind and it opens from its own icon, full screen, like any other app. It is free and takes a few seconds.</p>
                <button type="button" onClick={install} className="mt-3 inline-flex min-h-10 items-center rounded-full bg-cm-ember px-5 py-2 text-sm font-semibold text-white transition hover:bg-cm-ember-dark">
                  Install Church Mind
                </button>
              </>
            )}
            {state === "ios" && (
              <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-cm-cream/85">
                <li>Open this page in Safari.</li>
                <li>Tap the Share button (the square with an arrow pointing up).</li>
                <li>Scroll down and tap “Add to Home Screen”, then “Add”.</li>
              </ol>
            )}
            {state === "manual" && (
              <p className="mt-2 text-sm leading-relaxed text-cm-cream/85">
                Open your browser’s menu and choose “Install Church Mind”, “Add to Home Screen” or “Add to Dock”. In Chrome and Edge there is also an install icon at the right-hand end of the address bar.
              </p>
            )}
          </section>

          {canSave && (
            <section className="border-t border-white/10 pt-5">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cm-gold">Play without internet</h2>
              {saved && progress === null ? (
                <p className="mt-2 text-sm leading-relaxed text-cm-cream/85">Saved. The whole game, voices included, now plays on this device with no connection.</p>
              ) : (
                <>
                  <p className="mt-2 text-sm leading-relaxed text-cm-cream/85">Save the whole game, voices included, to this device. About 25 MB; best done on Wi-Fi.</p>
                  {progress === null ? (
                    <button type="button" onClick={save} className="mt-3 inline-flex min-h-10 items-center rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-cm-cream transition hover:border-white/50 hover:bg-white/5">
                      Save for offline play
                    </button>
                  ) : (
                    <div className="mt-3" role="progressbar" aria-label="Saving the game" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-cm-gold transition-[width] duration-300" style={{ width: `${progress * 100}%` }} />
                      </div>
                      <p className="mt-2 text-xs text-cm-sand">Saving… {Math.round(progress * 100)}%</p>
                    </div>
                  )}
                  {failed && <p className="mt-2 text-xs text-cm-gold">That didn’t finish. Check your connection and try again; what was saved is kept.</p>}
                </>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
