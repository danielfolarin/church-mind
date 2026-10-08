import { useMemo, useState, type ReactNode, type RefObject } from "react";
import { fill, MAX_BOND, offers, tokensFor, type GameState, type Offer } from "./engine";
import { Portrait } from "./Figure";
import { doorstep, Strollers, TownArt, walkBetween, Walker, type Point } from "./Town";
import type { Lead, Look, Opportunity, PlaceId, Story } from "./types";
import { EffectChips, GrowthStrip, PlaceGlyph, Purse, WeekProgress } from "./ui";

// The neighbourhood, between scenes. This is where the player spends the
// week: one place per morning or evening, chosen from whatever is on offer.

/** Nudges people standing at the same door apart, so they don't overlap. */
const beside = ([x, y]: Point, step: number): Point => [x + 3.6 * step, y + 0.6];

function lookOf(story: Story, lead: Lead, id: string): Look | null {
  if (id === "you") return lead.look;
  if (id === "partner") return lead.partnerLook;
  return story.cast.find((character) => character.id === id)?.look ?? null;
}

function nameOf(story: Story, lead: Lead, id: string): string {
  if (id === "partner") return lead.partner;
  return story.cast.find((character) => character.id === id)?.name ?? id;
}

export function MapScreen({
  story,
  lead,
  game,
  header,
  headingRef,
  onGo,
}: {
  story: Story;
  lead: Lead;
  game: GameState;
  /** The top bar, shared with the other screens. */
  header: ReactNode;
  headingRef: RefObject<HTMLHeadingElement>;
  onGo: (opportunity: Opportunity) => void;
}) {
  const slot = story.slots[game.slot];
  const evening = slot.time === "Evening";
  const tokens = useMemo(() => tokensFor(lead, game.money), [lead, game.money]);
  const text = (raw: string) => fill(raw, tokens);

  const available = offers(story, game);
  const byPlace = new Map<PlaceId, Offer[]>();
  for (const offer of available) {
    byPlace.set(offer.opportunity.place, [...(byPlace.get(offer.opportunity.place) ?? []), offer]);
  }

  // Tapping a place on the map narrows the list to what is on offer there.
  const [focus, setFocus] = useState<{ slot: number; place: PlaceId } | null>(null);
  const focused = focus?.slot === game.slot && byPlace.has(focus.place) ? focus.place : null;
  const listed = focused ? (byPlace.get(focused) ?? []) : available;

  // Walking there: the player's figure follows the streets before the scene opens.
  const [heading, setHeading] = useState<Opportunity | null>(null);
  const still = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const walk = useMemo(
    () => (heading ? [beside(doorstep(story, game.place), -1), ...walkBetween(story, game.place, heading.place).slice(1, -1), beside(doorstep(story, heading.place), -1)] : null),
    [story, game.place, heading]
  );

  function set(opportunity: Opportunity) {
    if (heading) return;
    if (still) {
      onGo(opportunity);
      return;
    }
    setHeading(opportunity);
  }

  const people = ["partner", ...story.cast.map((character) => character.id)];

  return (
    <div className="min-h-screen bg-cm-night text-cm-cream">
      {header}

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-6 sm:px-8 lg:grid lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-12 lg:pt-10">
        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-gold">
                {slot.day} · {slot.time}
              </p>
              <h1 ref={headingRef} tabIndex={-1} className="mt-1 font-story text-3xl outline-none sm:text-4xl">
                Where will you go?
              </h1>
            </div>
            <WeekProgress slots={story.slots} current={game.slot} />
          </div>

          <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-2xl bg-cm-dusk shadow-2xl shadow-black/40 ring-1 ring-white/10">
            <TownArt story={story} evening={evening} />
            {!still && <Strollers story={story} />}

            {/* Whoever is waiting for you stands outside */}
            {Object.entries(story.places).flatMap(([id]) => {
              const faces = [...new Set((byPlace.get(id) ?? []).flatMap((offer) => offer.opportunity.with ?? []))].slice(0, 3);
              return faces.map((face, index) => {
                const look = lookOf(story, lead, face);
                return look ? <Walker key={`${id}-${face}`} look={look} at={beside(doorstep(story, id), index + 1)} className="h-[8.5%] w-[3.8%]" /> : null;
              });
            })}

            {Object.entries(story.places).map(([id, place]) => {
              const here = byPlace.get(id) ?? [];
              const open = here.length > 0;
              const key = here.some((offer) => offer.opportunity.key);
              const lure = here.some((offer) => offer.opportunity.tempt === "money");
              const selected = focused === id;
              return (
                <button
                  key={id}
                  type="button"
                  disabled={!open || Boolean(heading)}
                  onClick={() => setFocus(selected ? null : { slot: game.slot, place: id })}
                  aria-pressed={selected}
                  aria-label={`${place.name}${open ? `, ${here.length} thing${here.length === 1 ? "" : "s"} to do` : ", nothing right now"}`}
                  className="group absolute flex h-[22%] w-[17%] -translate-x-1/2 -translate-y-[78%] flex-col items-center justify-end disabled:cursor-default"
                  style={{ left: `${place.x}%`, top: `${place.y}%` }}
                >
                  {open && (
                    <span
                      aria-hidden="true"
                      className={`absolute -top-1 grid h-6 w-6 animate-cm-hop place-items-center rounded-full text-xs font-bold shadow-lg sm:h-7 sm:w-7 ${
                        lure ? "bg-cm-gold text-cm-night" : key ? "bg-cm-gold text-cm-night" : "bg-cm-ember text-white"
                      }`}
                    >
                      {lure ? "$" : key ? "!" : "•"}
                    </span>
                  )}
                  <span
                    className={`translate-y-[115%] whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold leading-tight shadow sm:text-[11px] ${
                      selected ? "bg-cm-ember text-white" : open ? "bg-cm-night/85 text-cm-cream group-hover:bg-cm-ember/80" : "bg-cm-night/55 text-cm-cream/60"
                    }`}
                  >
                    {place.name}
                  </span>
                </button>
              );
            })}

            {/* You */}
            <Walker
              key={`${game.slot}-${game.place}`}
              look={lead.look}
              at={beside(doorstep(story, game.place), -1)}
              path={walk}
              onArrive={() => heading && onGo(heading)}
              className="z-10 h-[9.5%] w-[4.2%]"
            >
              <span className="absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2 animate-cm-hop border-x-[5px] border-t-[7px] border-x-transparent border-t-cm-cream" />
            </Walker>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <Purse money={game.money} energy={game.energy} />
            <ul className="flex flex-wrap gap-x-4 gap-y-2" aria-label="How close you are to people">
              {people.map((id) => {
                const look = lookOf(story, lead, id);
                const bond = game.bonds[id] ?? 0;
                return (
                  <li key={id} className="flex items-center gap-2">
                    {look && <Portrait look={look} mood={bond >= 3 ? "warm" : bond <= 1 ? "sad" : "neutral"} className="h-7 w-7" />}
                    <span>
                      <span className="block text-[11px] font-semibold leading-none text-cm-cream/90">{nameOf(story, lead, id)}</span>
                      <span className="mt-1 flex gap-0.5" aria-label={`Closeness ${bond} of ${MAX_BOND}`}>
                        {Array.from({ length: MAX_BOND }, (_, index) => (
                          <span key={index} className={`h-1 w-2.5 rounded-full transition-colors duration-700 ${index < bond ? "bg-cm-ember" : "bg-white/15"}`} />
                        ))}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-6 hidden lg:block">
            <GrowthStrip qualities={game.qualities} grew={[]} note />
          </div>
        </section>

        <section className="mt-9 lg:mt-0" aria-label="What you could do">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-sand">
              {focused ? `At ${story.places[focused].name}` : `This ${slot.time.toLowerCase()} you could`}
            </h2>
            {focused && (
              <button type="button" onClick={() => setFocus(null)} className="text-xs font-medium text-cm-cream/70 underline-offset-4 hover:text-cm-cream hover:underline">
                Show everything
              </button>
            )}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-cm-sand/80">You have time for one. The others won’t all wait.</p>

          <ul className="mt-4 space-y-3">
            {listed.map(({ opportunity, blocked }) => {
              const place = story.places[opportunity.place];
              const going = heading?.id === opportunity.id;
              return (
                <li key={opportunity.id}>
                  <div
                    className={`animate-cm-rise rounded-2xl border px-5 py-4 transition ${
                      going ? "border-cm-ember bg-cm-ember/10" : opportunity.key ? "border-cm-gold/35 bg-cm-gold/[0.05]" : "border-white/10 bg-white/[0.04]"
                    } ${blocked ? "opacity-60" : opportunity.tempt ? `cm-tempt cm-tempt-${opportunity.tempt}` : ""}`}
                  >
                    <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cm-sand">
                      <PlaceGlyph icon={place.icon} className="h-3.5 w-3.5" />
                      {place.name}
                      {opportunity.key && <span className="rounded-full bg-cm-gold/15 px-2 py-0.5 text-[10px] tracking-[0.1em] text-cm-gold">Waiting on you</span>}
                    </p>
                    <h3 className="mt-2 font-story text-xl leading-snug text-cm-cream">{text(opportunity.title)}</h3>
                    {opportunity.blurb && <p className="mt-1 text-[0.9375rem] leading-relaxed text-cm-cream/75">{text(opportunity.blurb)}</p>}

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        {(opportunity.with ?? []).length > 0 && (
                          <span className="flex -space-x-1.5">
                            {(opportunity.with ?? []).map((id) => {
                              const look = lookOf(story, lead, id);
                              return look ? <Portrait key={id} look={look} mood="neutral" className="h-7 w-7 ring-cm-night" /> : null;
                            })}
                          </span>
                        )}
                        <EffectChips effects={opportunity} lively={opportunity.tempt === "money"} />
                      </div>
                      <button
                        type="button"
                        disabled={Boolean(blocked) || Boolean(heading)}
                        onClick={() => set(opportunity)}
                        className="inline-flex min-h-10 items-center gap-2 rounded-full bg-cm-ember px-5 py-2 text-sm font-semibold text-white transition hover:bg-cm-ember-dark disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-cm-cream/50"
                      >
                        {going ? "On your way…" : "Go"} {!going && <span aria-hidden="true">→</span>}
                      </button>
                    </div>
                    {blocked && <p className="mt-2 text-xs text-cm-gold/90">{blocked}</p>}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 lg:hidden">
            <GrowthStrip qualities={game.qualities} grew={[]} />
          </div>
        </section>
      </main>
    </div>
  );
}
