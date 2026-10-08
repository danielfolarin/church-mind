import { useMemo, useState, type ReactNode, type RefObject } from "react";
import { fill, MAX_BOND, offers, tokensFor, type GameState, type Offer } from "./engine";
import { Portrait } from "./Figure";
import { MapArt } from "./SceneArt";
import type { Lead, Look, Opportunity, PlaceId, Story } from "./types";
import { EffectChips, GrowthStrip, PlaceGlyph, Purse, WeekProgress } from "./ui";

// The neighbourhood, between scenes. This is where the player spends the
// week: one place per morning or evening, chosen from whatever is on offer.

const TRAVEL_MS = 750;

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

  // Walking there: the player's marker moves across the map before the scene opens.
  const [heading, setHeading] = useState<Opportunity | null>(null);
  const standing = heading?.place ?? game.place;
  const still = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  function set(opportunity: Opportunity) {
    if (heading) return;
    if (still) {
      onGo(opportunity);
      return;
    }
    setHeading(opportunity);
    window.setTimeout(() => onGo(opportunity), TRAVEL_MS);
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
            <MapArt evening={evening} />

            {Object.entries(story.places).map(([id, place]) => {
              const here = byPlace.get(id) ?? [];
              const open = here.length > 0;
              const key = here.some((offer) => offer.opportunity.key);
              const faces = [...new Set(here.flatMap((offer) => offer.opportunity.with ?? []))].slice(0, 3);
              const selected = focused === id;
              return (
                <button
                  key={id}
                  type="button"
                  disabled={!open || Boolean(heading)}
                  onClick={() => setFocus(selected ? null : { slot: game.slot, place: id })}
                  aria-pressed={selected}
                  aria-label={`${place.name}${open ? `, ${here.length} thing${here.length === 1 ? "" : "s"} to do` : ", nothing right now"}`}
                  className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 disabled:cursor-default"
                  style={{ left: `${place.x}%`, top: `${place.y}%` }}
                >
                  <span
                    className={`relative grid h-10 w-10 place-items-center rounded-full border-2 transition sm:h-12 sm:w-12 ${
                      selected
                        ? "border-cm-ember bg-cm-ember text-white"
                        : open
                          ? "border-cm-ember/80 bg-cm-night/90 text-cm-cream group-hover:bg-cm-ember/30"
                          : "border-white/15 bg-cm-night/60 text-cm-cream/35"
                    }`}
                  >
                    {open && !selected && <span className="absolute inset-0 animate-ping rounded-full border border-cm-ember/50 [animation-duration:2.6s]" />}
                    <PlaceGlyph icon={place.icon} />
                    {key && (
                      <span aria-hidden="true" className="absolute -right-1.5 -top-1.5 grid h-4 w-4 place-items-center rounded-full bg-cm-gold text-[10px] font-bold leading-none text-cm-night">
                        !
                      </span>
                    )}
                    {faces.length > 0 && (
                      <span className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 -space-x-1.5">
                        {faces.map((face) => {
                          const look = lookOf(story, lead, face);
                          return look ? <Portrait key={face} look={look} mood="neutral" className="h-5 w-5 ring-cm-night sm:h-6 sm:w-6" /> : null;
                        })}
                      </span>
                    )}
                  </span>
                  <span
                    className={`mt-1.5 max-w-[5.5rem] rounded bg-cm-night/70 px-1.5 py-0.5 text-center text-[10px] font-semibold leading-tight sm:max-w-none sm:text-[11px] ${
                      open ? "text-cm-cream" : "text-cm-cream/40"
                    }`}
                  >
                    {place.name}
                  </span>
                </button>
              );
            })}

            {/* You */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-[left,top] ease-in-out"
              style={{
                left: `calc(${story.places[standing].x}% - 26px)`,
                top: `calc(${story.places[standing].y}% - 22px)`,
                transitionDuration: `${TRAVEL_MS}ms`,
              }}
            >
              <Portrait look={lead.look} className="h-8 w-8 ring-2 ring-cm-cream sm:h-9 sm:w-9" />
            </span>
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
                    } ${blocked ? "opacity-60" : ""}`}
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
                        <EffectChips effects={opportunity} />
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
