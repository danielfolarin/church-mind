import { useRef, useState, type ReactNode, type RefObject } from "react";
import { fill, strongestQuality, tokensFor, type GameState } from "./engine";
import { buy, loadProfile, SHOP, type WeekReward } from "./rewards";
import { FullFigure } from "./Rig";
import { shareWeekCard } from "./shareCard";
import type { Ending, Keepsake, Lead, Story } from "./types";
import { QUALITY_LABELS } from "./ui";

// Rewards: the coins and keepsakes a week leaves the player with, the
// collection they build up over many weeks, and the shop where coins are spent.

export function Coin({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={`inline-block ${className}`}>
      <circle cx="10" cy="10" r="9" fill="#F2C14E" stroke="#B98B1E" strokeWidth="1.6" />
      <circle cx="10" cy="10" r="5.4" fill="none" stroke="#B98B1E" strokeWidth="1.2" opacity="0.7" />
    </svg>
  );
}

function Token({ keepsake, text, dim = false, fresh = false }: { keepsake: Keepsake; text: (raw: string) => string; dim?: boolean; fresh?: boolean }) {
  return (
    <li className={`flex gap-3 rounded-2xl border px-4 py-3 ${dim ? "border-white/10 bg-white/[0.02]" : "border-cm-gold/30 bg-cm-gold/[0.05]"}`}>
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border text-xl ${dim ? "border-white/15 text-cm-cream/30" : "border-cm-gold/60 bg-cm-night"}`} aria-hidden="true">
        {dim ? "?" : keepsake.icon}
      </span>
      <span className="min-w-0">
        <span className={`block font-story text-lg leading-snug ${dim ? "text-cm-cream/40" : "text-cm-cream"}`}>
          {dim ? "Still out there" : text(keepsake.name)}
          {fresh && <span className="ml-2 rounded-full bg-cm-gold/20 px-2 py-0.5 align-middle font-sans text-[10px] font-semibold uppercase tracking-wider text-cm-gold">New</span>}
        </span>
        {!dim && <span className="mt-0.5 block text-sm leading-snug text-cm-cream/70">{text(keepsake.text)}</span>}
      </span>
    </li>
  );
}

const CONFETTI = ["#E2B36B", "#E8622C", "#F4EBDD", "#7FB04F", "#5FA8CC", "#D9A7B5"];

/** A burst of paper, for when something good has just been earned. */
export function Confetti({ delay = 0 }: { delay?: number }) {
  const pieces = Array.from({ length: 36 }, (_, index) => ({
    left: (index * 37) % 100,
    delay: (index % 9) * 0.07,
    drift: ((index * 53) % 120) - 60,
    colour: CONFETTI[index % CONFETTI.length],
    tall: index % 3 === 0,
  }));
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 -top-4 z-50 h-0">
      {pieces.map((piece, index) => (
        <span
          key={index}
          className="absolute top-0 animate-cm-confetti rounded-sm"
          style={{ left: `${piece.left}%`, width: 8, height: piece.tall ? 14 : 8, backgroundColor: piece.colour, animationDelay: `${delay + piece.delay}s`, ["--drift" as string]: `${piece.drift}px` }}
        />
      ))}
    </div>
  );
}

/** Shown at the end of a week: what the player takes away from it. */
export function WeekRewards({ story, lead, game, ending, reward }: { story: Story; lead: Lead; game: GameState; ending: Ending; reward: WeekReward }) {
  const tokens = tokensFor(lead, game.money);
  const text = (raw: string) => fill(raw, tokens);
  const figure = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState<"idle" | "working" | "saved" | "failed">("idle");
  const strongest = strongestQuality(game.qualities);

  async function share() {
    setSharing("working");
    try {
      await shareWeekCard({
        figure: figure.current?.querySelector("svg") ?? null,
        name: lead.name,
        place: story.intro.place,
        ending: ending.title,
        keepsakes: reward.earned.map((keepsake) => `${keepsake.icon}  ${text(keepsake.name)}`),
        grew: strongest ? QUALITY_LABELS[strongest] : null,
      });
      setSharing("saved");
    } catch {
      setSharing("failed");
    }
  }

  return (
    <section className="relative">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-sand">What you take with you</h2>
      <div className="mt-4 rounded-2xl border border-cm-gold/25 bg-gradient-to-b from-cm-gold/[0.08] to-transparent p-5 sm:p-6">
        <p className="flex items-center gap-2.5 font-story text-2xl text-cm-cream">
          <Coin className="h-6 w-6 animate-cm-coin" />
          <span>
            {reward.coins} coins <span className="text-base text-cm-sand">· {reward.profile.coins} in your purse</span>
          </span>
        </p>
        <p className="mt-1 text-sm leading-relaxed text-cm-sand">For living the week, for what grew in you, and for each new keepsake. Spend them in your Collection.</p>

        {reward.earned.length > 0 ? (
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {reward.earned.map((keepsake) => (
              <Token key={keepsake.id} keepsake={keepsake} text={text} fresh={reward.fresh.includes(keepsake)} />
            ))}
          </ul>
        ) : (
          <p className="mt-5 text-sm leading-relaxed text-cm-cream/75">No keepsakes this time. They come from showing up for people, and from going back to put things right.</p>
        )}
        <p className="mt-4 text-xs text-cm-sand">
          {reward.profile.keepsakes.length} of {story.keepsakes.length} keepsakes collected.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-cm-gold/15 pt-5">
          <button
            type="button"
            onClick={share}
            disabled={sharing === "working"}
            className="inline-flex min-h-10 items-center rounded-full border border-cm-gold/50 px-5 py-2 text-sm font-semibold text-cm-gold transition hover:bg-cm-gold/10 disabled:opacity-50"
          >
            {sharing === "working" ? "Making your card…" : "Share your week"}
          </button>
          <p className="text-xs text-cm-sand">
            {sharing === "saved" ? "Done. Your card is ready to post." : sharing === "failed" ? "That didn’t work on this device. A screenshot will do." : "Saves a picture of your week to post or send."}
          </p>
        </div>
      </div>

      {/* Drawn off-screen, so the card can include the player's character. */}
      <div ref={figure} aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-[600px] w-[320px]">
        <FullFigure look={lead.look} className="h-full w-full" />
      </div>
    </section>
  );
}

/** The player's keepsakes and the shop, reached from the title screen. */
export function CollectionScreen({ story, lead, wordmark, headingRef, onBack }: { story: Story; lead: Lead; wordmark: ReactNode; headingRef: RefObject<HTMLHeadingElement>; onBack: () => void }) {
  const [profile, setProfile] = useState(loadProfile);
  const text = (raw: string) => fill(raw, tokensFor(lead));
  const have = story.keepsakes.filter((keepsake) => profile.keepsakes.includes(keepsake.id));
  const missing = story.keepsakes.length - have.length;

  return (
    <div className="min-h-screen bg-cm-night text-cm-cream">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 sm:px-10">
        {wordmark}
        <button type="button" onClick={onBack} className="text-xs font-medium text-cm-cream/70 underline-offset-4 hover:text-cm-cream hover:underline">
          Back
        </button>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-20 pt-6 sm:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cm-gold">
          {profile.weeks} week{profile.weeks === 1 ? "" : "s"} lived
        </p>
        <h1 ref={headingRef} tabIndex={-1} className="mt-2 font-story text-4xl outline-none sm:text-5xl">
          Your collection
        </h1>
        <p className="mt-4 flex items-center gap-2.5 font-story text-2xl">
          <Coin className="h-6 w-6" /> {profile.coins} coins
        </p>

        <section className="mt-10">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-sand">
            Keepsakes · {have.length} of {story.keepsakes.length}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cm-sand/85">Small things people gave you, or that mark a moment with them. A different week finds different ones.</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {have.map((keepsake) => (
              <Token key={keepsake.id} keepsake={keepsake} text={text} />
            ))}
            {Array.from({ length: missing }, (_, index) => (
              <Token key={index} keepsake={story.keepsakes[0]} text={text} dim />
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-sand">Shop</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cm-sand/85">Spend coins on new looks. Whatever you buy appears when you create your own character.</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {SHOP.map((item) => {
              const owned = profile.owned.includes(item.id);
              const short = item.price - profile.coins;
              return (
                <li key={item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
                  <span className="min-w-0">
                    <span className="block font-story text-xl text-cm-cream">{item.name}</span>
                    <span className="mt-0.5 block text-sm leading-snug text-cm-cream/70">{item.blurb}</span>
                  </span>
                  {owned ? (
                    <span className="shrink-0 rounded-full border border-cm-gold/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cm-gold">Yours</span>
                  ) : (
                    <button
                      type="button"
                      disabled={short > 0}
                      onClick={() => setProfile(buy(item))}
                      title={short > 0 ? `${short} more coins needed` : `Buy for ${item.price} coins`}
                      className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full bg-cm-ember px-4 py-2 text-sm font-semibold text-white transition hover:bg-cm-ember-dark disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-cm-cream/50"
                    >
                      <Coin /> {item.price}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
