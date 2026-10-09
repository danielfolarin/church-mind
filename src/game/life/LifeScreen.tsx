import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { sound } from "../audio";
import { Portrait } from "../Figure";
import { addCoins } from "../rewards";
import { SceneArt } from "../SceneArt";
import { QUALITY_IDS, type Look, type Scripture } from "../types";
import { QUALITY_LABELS, ScripturePanel, SoundControls, type SoundSettings } from "../ui";
import {
  ACTIVITIES,
  afterReview,
  blockedReason,
  candidatesFor,
  doActivity,
  endSeason,
  EVENTS,
  partnerOf,
  resolveChoice,
  reviewOf,
  say,
  TOPICS,
  WALT,
  type Activity,
  type Ledger,
} from "./content";
import { HouseView } from "./House";
import {
  buildRoom,
  buyItem,
  clearLife,
  ITEMS,
  loadLife,
  MAX_BOND,
  MAX_ENERGY,
  MAX_GROWTH,
  newLife,
  paintRoom,
  ROOFS,
  ROOMS,
  saveLife,
  seasonOf,
  TIME_PER_SEASON,
  tintItem,
  TRIMS,
  WALLS,
  when,
  yearOf,
  type LifeState,
  type Me,
  type RoomId,
} from "./model";

// A Home on Juniper Lane: the screen the whole of this world is played on.
// The player plans a season, lives through whatever comes to the door, and
// builds the house up around the life lived in it.

type View = "home" | "decorate" | "journal" | "scrapbook";

interface Told {
  title: string;
  text: string[];
  scripture?: Scripture;
}

const GROUPS: Activity["group"][] = ["Work and money", "People", "Faith", "Rest"];
const MILESTONE_COINS = 10;

function Pips({ value, max, on = "bg-cm-ember" }: { value: number; max: number; on?: string }) {
  return (
    <span className="flex gap-1" aria-hidden="true">
      {Array.from({ length: max }, (_, index) => (
        <span key={index} className={`h-1.5 w-3 rounded-full ${index < value ? on : "bg-white/15"}`} />
      ))}
    </span>
  );
}

function Chip({ children, good }: { children: ReactNode; good?: boolean }) {
  return <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${good ? "border-cm-gold/40 text-cm-gold" : "border-white/15 text-cm-sand"}`}>{children}</span>;
}

function Button({ children, onClick, disabled, quiet }: { children: ReactNode; onClick: () => void; disabled?: boolean; quiet?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
        quiet ? "border border-white/15 text-cm-cream hover:border-white/40 hover:bg-white/5" : "bg-cm-ember text-white shadow-lg shadow-cm-ember/20 hover:bg-cm-ember-dark"
      }`}
    >
      {children}
    </button>
  );
}

function Swatch({ colour, on, onClick, label }: { colour: string; on: boolean; onClick: () => void; label: string }) {
  return <button type="button" aria-label={label} aria-pressed={on} onClick={onClick} className={`h-7 w-7 rounded-full border-2 transition ${on ? "scale-110 border-cm-cream" : "border-white/15 hover:border-white/50"}`} style={{ backgroundColor: colour }} />;
}

export function LifeScreen({ me, audio, headingRef, onExit }: { me: Me; audio: SoundSettings; headingRef: RefObject<HTMLHeadingElement>; onExit: () => void }) {
  const [life, setLife] = useState<LifeState>(() => loadLife() ?? newLife());
  const [view, setView] = useState<View>("home");
  const [room, setRoom] = useState<RoomId>("living");
  /** What just happened, shown above the things to do. */
  const [told, setTold] = useState<Told | null>(null);
  /** What a choice led to, shown before the season carries on. */
  const [after, setAfter] = useState<Told | null>(null);
  /** An event started by something the player did, not by the turn of the season. */
  const [started, setStarted] = useState<string | null>(null);
  const [ledger, setLedger] = useState<Ledger | null>(null);
  const [childName, setChildName] = useState("");
  const [own, setOwn] = useState("");
  const [sure, setSure] = useState(false);

  useEffect(() => saveLife(life), [life]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [after, ledger, started, life.pending]);
  // On a phone the things to do sit below the house, so bring them up when they change.
  const side = useRef<HTMLElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.innerWidth < 1024) side.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo(0, 0);
  }, [view, told]);

  const partner = partnerOf(life, me);
  const text = (raw: string) => say(raw, life, me);
  const pair = candidatesFor(me);
  const naming = (raw: string) => text(raw.replace("{first}", pair[0].name).replace("{second}", pair[1].name));
  const lookOf = (who: string): Look | null => (who === "you" ? me.look : who === "partner" ? (partner?.look ?? null) : who === "walt" ? WALT : null);

  const eventId = !ledger && !after ? (started ?? (life.pending !== "review" ? life.pending : null)) : null;
  const event = useMemo(() => EVENTS.find((candidate) => candidate.id === eventId) ?? null, [eventId]);
  const reviewing = !ledger && !after && !started && life.pending === "review";

  /** Remembers a milestone with a few coins, the same as keepsakes elsewhere. */
  function update(next: LifeState) {
    if (next.scrapbook.length > life.scrapbook.length) addCoins(MILESTONE_COINS * (next.scrapbook.length - life.scrapbook.length));
    setLife(next);
  }

  function act(activity: Activity) {
    sound.play("choice");
    const { state, outcome } = doActivity(life, activity, me);
    update(state);
    if (outcome.event) {
      setTold(null);
      setStarted(outcome.event);
      return;
    }
    setTold({ title: naming(activity.title), text: outcome.text.map((line) => say(line, state, me)), scripture: outcome.scripture });
    if (outcome.journal) setView("journal");
  }

  function choose(index: number) {
    if (!event) return;
    sound.play("choice");
    const result = resolveChoice(life, event, index, me, childName);
    update(result.state);
    setStarted(null);
    setChildName("");
    setAfter({ title: event.title, text: result.text, scripture: result.scripture });
  }

  function finishSeason() {
    sound.play("choice");
    const closed = endSeason(life, me);
    setTold(null);
    setView("home");
    update(closed.state);
    setLedger(closed.ledger);
  }

  // ——— A scene: something has come to the door ———
  if (event) {
    const beats = typeof event.beats === "function" ? event.beats(life) : event.beats;
    const faces = (event.with ?? []).map(lookOf).filter((look): look is Look => Boolean(look));
    const choices = event.choices.map((choice, index) => ({ choice, index })).filter(({ choice }) => !choice.when || choice.when(life));
    const named = !event.naming || childName.trim().length > 0;
    // The name isn't on a child yet, so show it in the lines as it is typed.
    const line = (raw: string) => text(event.naming ? raw.split("{child}").join(childName.trim() || "your child") : raw);
    return (
      <Frame audio={audio} onExit={onExit} life={life}>
        <div className="mx-auto max-w-3xl">
          <div className="relative h-48 overflow-hidden rounded-2xl ring-1 ring-white/10 sm:h-60">
            <SceneArt setting={event.setting} className="h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-cm-night via-cm-night/20 to-transparent" />
            <div className="absolute bottom-3 left-4 flex gap-2">
              {faces.map((look, index) => (
                <Portrait key={index} look={look} className="h-16 w-16 ring-2 ring-cm-night sm:h-20 sm:w-20" />
              ))}
            </div>
          </div>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-cm-gold">{when(life.turn)}</p>
          <h1 ref={headingRef} tabIndex={-1} className="mt-2 font-story text-4xl leading-tight outline-none">
            {event.title}
          </h1>
          <div className="mt-5 space-y-4">
            {beats.filter(Boolean).map((beat) => (
              <p key={beat} className="animate-cm-rise font-story text-lg leading-[1.75] text-cm-cream/90">
                {line(beat)}
              </p>
            ))}
          </div>
          {event.scripture && (
            <div className="mt-6">
              <ScripturePanel scripture={event.scripture} />
            </div>
          )}
          {event.naming && (
            <div className="mt-6">
              <label htmlFor="child-name" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cm-sand">
                What will you call them?
              </label>
              <input
                id="child-name"
                type="text"
                autoComplete="off"
                maxLength={14}
                value={childName}
                onChange={(input) => setChildName(input.target.value)}
                placeholder="A name"
                className="mt-2 block w-full max-w-xs rounded-lg border border-white/15 bg-cm-night/60 px-3.5 py-2.5 text-base text-cm-cream placeholder:text-cm-cream/35 focus:border-cm-ember"
              />
            </div>
          )}
          <div className="mt-7 space-y-3">
            {choices.map(({ choice, index }) => (
              <button
                key={index}
                type="button"
                disabled={!named}
                onClick={() => choose(index)}
                className={`block w-full rounded-2xl border px-5 py-4 text-left font-story text-lg leading-snug text-cm-cream transition disabled:opacity-40 ${
                  choice.tempt ? `cm-tempt cm-tempt-${choice.tempt} border-cm-gold/50` : "border-white/15 bg-white/[0.04] hover:border-cm-ember/70 hover:bg-white/[0.08]"
                }`}
              >
                {line(choice.label)}
              </button>
            ))}
          </div>
        </div>
      </Frame>
    );
  }

  // ——— What a choice led to ———
  if (after) {
    return (
      <Frame audio={audio} onExit={onExit} life={life}>
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cm-gold">{after.title}</p>
          <div className="mt-4 space-y-4">
            {after.text.map((beat) => (
              <p key={beat} className="animate-cm-rise font-story text-lg leading-[1.75] text-cm-cream/90">
                {beat}
              </p>
            ))}
          </div>
          {after.scripture && (
            <div className="mt-6">
              <ScripturePanel scripture={after.scripture} />
            </div>
          )}
          <div className="mt-8">
            <Button onClick={() => setAfter(null)}>
              Carry on <span aria-hidden="true">→</span>
            </Button>
          </div>
        </div>
      </Frame>
    );
  }

  // ——— The end of a season: what came in and went out ———
  if (ledger) {
    const total = ledger.lines.reduce((sum, entry) => sum + entry.amount, 0);
    return (
      <Frame audio={audio} onExit={onExit} life={life}>
        <div className="mx-auto max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cm-gold">The season turns</p>
          <h1 ref={headingRef} tabIndex={-1} className="mt-2 font-story text-4xl outline-none">
            {when(life.turn)}
          </h1>
          <dl className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
            {ledger.lines.map((entry) => (
              <div key={entry.label} className="flex items-center justify-between px-5 py-3 text-sm">
                <dt className="text-cm-cream/85">{entry.label}</dt>
                <dd className={`tabular-nums font-semibold ${entry.amount >= 0 ? "text-cm-gold" : "text-cm-cream"}`}>
                  {entry.amount >= 0 ? "+" : "−"}${Math.abs(entry.amount)}
                </dd>
              </div>
            ))}
            <div className="flex items-center justify-between px-5 py-3 text-sm">
              <dt className="font-semibold text-cm-cream">This season</dt>
              <dd className="tabular-nums font-semibold text-cm-cream">
                {total >= 0 ? "+" : "−"}${Math.abs(total)} · ${life.money} in the bank
              </dd>
            </div>
          </dl>
          {ledger.notes.map((note) => (
            <p key={note} className="mt-4 text-sm leading-relaxed text-cm-sand">
              {note}
            </p>
          ))}
          {ledger.answered.length > 0 && (
            <div className="mt-6 rounded-2xl border border-cm-gold/25 bg-cm-gold/[0.05] p-5">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-gold">From your prayer list</h2>
              {ledger.answered.map((prayer) => (
                <div key={prayer.id} className="mt-3">
                  <p className="font-story text-lg text-cm-cream">{prayer.text}</p>
                  <p className="mt-1 text-sm leading-relaxed text-cm-cream/80">{text(prayer.note ?? "")}</p>
                </div>
              ))}
            </div>
          )}
          <div className="mt-8">
            <Button onClick={() => setLedger(null)}>
              Begin {seasonOf(life.turn).toLowerCase()} <span aria-hidden="true">→</span>
            </Button>
          </div>
        </div>
      </Frame>
    );
  }

  // ——— Looking back on a year ———
  if (reviewing) {
    const review = reviewOf(life, me);
    return (
      <Frame audio={audio} onExit={onExit} life={life}>
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cm-gold">Looking back</p>
          <h1 ref={headingRef} tabIndex={-1} className="mt-2 font-story text-4xl outline-none">
            {review.title}
          </h1>
          <ul className="mt-6 space-y-3">
            {review.lines.map((entry) => (
              <li key={entry} className="border-l-2 border-white/15 pl-4 font-story text-lg leading-relaxed text-cm-cream/90">
                {entry}
              </li>
            ))}
          </ul>
          <div className="mt-7">
            <Growth life={life} />
          </div>
          <div className="mt-7">
            <ScripturePanel scripture={review.scripture} />
          </div>
          <p className="mt-6 border-l-2 border-cm-gold/40 pl-4 font-story text-lg italic leading-relaxed text-cm-cream/90">{review.question}</p>
          <div className="mt-8">
            <Button onClick={() => update(afterReview(life))}>
              Into year {yearOf(life.turn)} <span aria-hidden="true">→</span>
            </Button>
          </div>
        </div>
      </Frame>
    );
  }

  // ——— An ordinary season ———
  const open = life.prayers.filter((prayer) => prayer.answer !== "yes" && prayer.answer !== "other");
  const answered = life.prayers.filter((prayer) => prayer.answer === "yes" || prayer.answer === "other");
  const people: { name: string; look: Look | null; bond: number }[] = [
    ...(partner ? [{ name: partner.name, look: partner.look, bond: life.bonds.partner }] : []),
    { name: "Walt, next door", look: WALT, bond: life.bonds.walt },
    { name: "The chapel", look: null, bond: life.bonds.church },
    ...(life.children.length ? [{ name: life.children.map((child) => child.name).join(" & "), look: null, bond: life.bonds.kids }] : []),
  ];

  return (
    <Frame audio={audio} onExit={onExit} life={life}>
      <div className="lg:grid lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-10">
        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-gold">{when(life.turn)}</p>
              <h1 ref={headingRef} tabIndex={-1} className="mt-1 font-story text-3xl outline-none sm:text-4xl">
                14 Juniper Lane
              </h1>
            </div>
            <div className="text-right text-xs text-cm-sand">
              <span className="block">Time this season</span>
              <span className="mt-1 flex justify-end">
                <Pips value={life.time} max={TIME_PER_SEASON} on="bg-cm-gold" />
              </span>
            </div>
          </div>

          <div className="mt-4">
            <HouseView state={life} me={me} partnerLook={partner?.look ?? null} selected={view === "decorate" ? room : null} onSelect={view === "decorate" ? setRoom : undefined} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="font-semibold tabular-nums text-cm-cream">${life.money.toLocaleString()}</span>
            <span className="text-cm-sand">
              {life.mortgage > 0 ? (
                <>
                  Mortgage <span className="font-semibold tabular-nums text-cm-cream">${life.mortgage.toLocaleString()}</span> · ${Math.min(life.payment, life.mortgage)} a season
                </>
              ) : (
                "The house is paid for"
              )}
            </span>
            <span className="flex items-center gap-2 text-cm-sand">
              Energy <Pips value={life.energy} max={MAX_ENERGY} on="bg-cm-gold" />
            </span>
          </div>

          <p className="mt-2 text-xs text-cm-sand">
            When the season ends: ${(Math.min(life.payment, life.mortgage) + 220 + life.children.length * 90).toLocaleString()} goes out on {life.mortgage > 0 ? "the mortgage and the bills" : "the bills"}
            {life.stage === "married" && partner ? `, and ${partner.name}’s pay ($420) comes in` : ""}.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {(
              [
                ["home", "This season"],
                ["decorate", "Build and decorate"],
                ["journal", `Prayer list${open.length ? ` (${open.length})` : ""}`],
                ["scrapbook", "Scrapbook"],
              ] as [View, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                aria-pressed={view === id}
                className={`min-h-9 rounded-full border px-4 py-1.5 text-sm transition ${view === id ? "border-cm-ember bg-cm-ember/15 text-cm-cream" : "border-white/15 text-cm-cream/75 hover:border-white/40"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
            {people.map((person) => (
              <li key={person.name} className="flex items-center gap-2">
                {person.look ? <Portrait look={person.look} className="h-8 w-8" /> : <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-sm">{person.name.startsWith("The") ? "⛪" : "🧸"}</span>}
                <span>
                  <span className="block text-xs font-semibold text-cm-cream">{person.name}</span>
                  <Pips value={person.bond} max={MAX_BOND} />
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <Growth life={life} />
          </div>
        </section>

        <section ref={side} className="mt-10 scroll-mt-16 lg:mt-0">
          {view === "home" && (
            <>
              {told && (
                <div className="mb-6 animate-cm-rise rounded-2xl border border-cm-gold/25 bg-cm-gold/[0.05] p-5">
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-gold">{told.title}</h2>
                  {told.text.map((entry) => (
                    <p key={entry} className="mt-3 font-story text-[1.0625rem] leading-relaxed text-cm-cream/90">
                      {entry}
                    </p>
                  ))}
                  {told.scripture && (
                    <div className="mt-4">
                      <ScripturePanel scripture={told.scripture} />
                    </div>
                  )}
                </div>
              )}
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-sand">This {seasonOf(life.turn).toLowerCase()} you could</h2>
              <p className="mt-1 text-sm text-cm-sand/85">It’s your life. Spend the season however you like; there is never time for everything.</p>
              {GROUPS.map((group) => {
                const list = ACTIVITIES.filter((activity) => activity.group === group && activity.show(life, me));
                if (!list.length) return null;
                return (
                  <div key={group} className="mt-5">
                    <h3 className="text-xs font-semibold text-cm-cream/60">{group}</h3>
                    <ul className="mt-2 space-y-2">
                      {list.map((activity) => {
                        const blocked = blockedReason(life, activity);
                        const earns = activity.earns?.(life) ?? 0;
                        return (
                          <li key={activity.id} className={`rounded-2xl border px-4 py-3 ${activity.tempt ? "cm-tempt cm-tempt-money border-cm-gold/40" : "border-white/10 bg-white/[0.03]"}`}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="font-story text-lg leading-snug text-cm-cream">{naming(activity.title)}</p>
                                <p className="mt-0.5 text-sm leading-snug text-cm-cream/70">{naming(activity.blurb)}</p>
                                <p className="mt-2 flex flex-wrap gap-1.5">
                                  {activity.time > 0 ? <Chip>takes time</Chip> : <Chip>no time needed</Chip>}
                                  {earns > 0 && <Chip good>+${earns}</Chip>}
                                  {(activity.costs ?? 0) > 0 && <Chip>−${activity.costs}</Chip>}
                                  {(activity.tiring ?? 0) > 0 && <Chip>−{activity.tiring} energy</Chip>}
                                </p>
                                {blocked && <p className="mt-2 text-xs text-cm-gold">{blocked}</p>}
                              </div>
                              <Button onClick={() => act(activity)} disabled={Boolean(blocked)}>
                                Do it
                              </Button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
              <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
                <Button onClick={finishSeason} quiet={life.time > 0}>
                  End the season <span aria-hidden="true">→</span>
                </Button>
                <p className="text-xs text-cm-sand">{life.time > 0 ? "You still have time. It’s also fine to leave some unspent." : "The season is full. Time to let it turn."}</p>
              </div>
            </>
          )}

          {view === "decorate" && (
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-sand">Build and decorate</h2>
              <p className="mt-1 text-sm text-cm-sand/85">Tap a room in the house. Paint is free. Things cost money, and nothing here is needed to be happy.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(Object.keys(ROOMS) as RoomId[]).map((id) => (
                  <button key={id} type="button" onClick={() => setRoom(id)} aria-pressed={room === id} className={`min-h-9 rounded-full border px-3.5 py-1.5 text-sm ${room === id ? "border-cm-ember bg-cm-ember/15 text-cm-cream" : "border-white/15 text-cm-cream/75 hover:border-white/40"}`}>
                    {ROOMS[id].name}
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="font-story text-2xl text-cm-cream">{ROOMS[room].name}</h3>
                <p className="mt-1 text-sm text-cm-cream/70">{ROOMS[room].blurb}</p>

                {!life.rooms[room].built ? (
                  <div className="mt-4">
                    <Button onClick={() => update(buildRoom(life, room))} disabled={life.money < ROOMS[room].cost || life.time < 1}>
                      Build it · ${ROOMS[room].cost}
                    </Button>
                    <p className="mt-2 text-xs text-cm-sand">{life.time < 1 ? "No time left this season to build." : life.money < ROOMS[room].cost ? `You need $${ROOMS[room].cost - life.money} more.` : "Building takes one part of this season."}</p>
                  </div>
                ) : (
                  <>
                    {room !== "garden" && (
                      <div className="mt-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cm-sand">Walls</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {WALLS.map((wall, index) => (
                            <Swatch key={wall} colour={wall} label={`Wall colour ${index + 1}`} on={life.rooms[room].wall === wall} onClick={() => setLife(paintRoom(life, room, wall))} />
                          ))}
                        </div>
                      </div>
                    )}
                    <ul className="mt-4 space-y-2">
                      {Object.entries(ITEMS)
                        .filter(([, item]) => item.room === room)
                        .map(([id, item]) => {
                          const owned = life.rooms[room].items.includes(id);
                          return (
                            <li key={id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 px-3.5 py-2.5">
                              <span className="min-w-0">
                                <span className="block text-sm font-semibold text-cm-cream">{item.name}</span>
                                {item.note && <span className="block text-xs leading-snug text-cm-sand">{item.note}</span>}
                                {owned && item.tints && (
                                  <span className="mt-2 flex flex-wrap gap-1.5">
                                    {item.tints.map((tint, index) => (
                                      <Swatch key={tint} colour={tint} label={`${item.name} colour ${index + 1}`} on={life.rooms[room].tints[id] === tint} onClick={() => setLife(tintItem(life, id, tint))} />
                                    ))}
                                  </span>
                                )}
                              </span>
                              {owned ? (
                                <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-cm-gold">Yours</span>
                              ) : (
                                <Button onClick={() => { sound.play("choice"); setLife(buyItem(life, id)); }} disabled={life.money < item.price} quiet>
                                  ${item.price}
                                </Button>
                              )}
                            </li>
                          );
                        })}
                    </ul>
                  </>
                )}
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="font-story text-xl text-cm-cream">Outside</h3>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-cm-sand">Roof</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ROOFS.map((roof, index) => (
                    <Swatch key={roof} colour={roof} label={`Roof colour ${index + 1}`} on={life.exterior.roof === roof} onClick={() => setLife({ ...life, exterior: { ...life.exterior, roof } })} />
                  ))}
                </div>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-cm-sand">Woodwork</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {TRIMS.map((trim, index) => (
                    <Swatch key={trim} colour={trim} label={`Woodwork colour ${index + 1}`} on={life.exterior.trim === trim} onClick={() => setLife({ ...life, exterior: { ...life.exterior, trim } })} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === "journal" && (
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-sand">Your prayer list</h2>
              <p className="mt-2 text-sm leading-relaxed text-cm-cream/80">
                Prayer isn’t a lever. It is talking with your Father. Some answers are yes. Some are not yet. Some are something you didn’t know to ask for. Nothing on this list is earned by praying
                harder.
              </p>

              {open.length > 0 && (
                <ul className="mt-5 space-y-2">
                  {open.map((prayer) => (
                    <li key={prayer.id} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <p className="font-story text-lg leading-snug text-cm-cream">{prayer.text}</p>
                      <p className="mt-1 text-xs text-cm-sand">Held in hope since {when(prayer.since).toLowerCase()}</p>
                      {prayer.note && <p className="mt-2 border-l-2 border-cm-gold/40 pl-3 text-sm leading-relaxed text-cm-cream/80">Not yet. {text(prayer.note)}</p>}
                    </li>
                  ))}
                </ul>
              )}

              {open.length < 6 && (
                <div className="mt-6">
                  <h3 className="text-xs font-semibold text-cm-cream/60">Bring something to God</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {TOPICS.filter((topic) => topic.show(life) && !life.prayers.some((prayer) => prayer.id === topic.id)).map((topic) => (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => setLife({ ...life, prayers: [...life.prayers, { id: topic.id, text: topic.text, since: life.turn }] })}
                        className="min-h-9 rounded-full border border-white/15 px-3.5 py-1.5 text-left text-sm text-cm-cream/85 transition hover:border-cm-ember/70 hover:bg-white/5"
                      >
                        {topic.text}
                      </button>
                    ))}
                  </div>
                  <form
                    className="mt-3 flex flex-wrap gap-2"
                    onSubmit={(submit) => {
                      submit.preventDefault();
                      if (!own.trim()) return;
                      setLife({ ...life, prayers: [...life.prayers, { id: `own:${life.prayers.length}:${life.turn}`, text: own.trim(), since: life.turn }] });
                      setOwn("");
                    }}
                  >
                    <label htmlFor="own-prayer" className="sr-only">
                      Something of your own
                    </label>
                    <input
                      id="own-prayer"
                      type="text"
                      maxLength={70}
                      value={own}
                      onChange={(input) => setOwn(input.target.value)}
                      placeholder="Or write your own"
                      className="min-w-0 flex-1 rounded-lg border border-white/15 bg-cm-night/60 px-3.5 py-2 text-sm text-cm-cream placeholder:text-cm-cream/35 focus:border-cm-ember"
                    />
                    <button type="submit" disabled={!own.trim()} className="min-h-10 rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-cm-cream transition hover:border-white/40 hover:bg-white/5 disabled:opacity-40">
                      Add
                    </button>
                  </form>
                </div>
              )}

              {answered.length > 0 && (
                <div className="mt-7">
                  <h3 className="text-xs font-semibold text-cm-cream/60">Answered</h3>
                  <ul className="mt-2 space-y-2">
                    {answered.map((prayer) => (
                      <li key={prayer.id} className="rounded-2xl border border-cm-gold/25 bg-cm-gold/[0.05] px-4 py-3">
                        <p className="font-story text-lg leading-snug text-cm-cream">{prayer.text}</p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-cm-gold">{prayer.answer === "yes" ? "Yes" : "Something different"}</p>
                        <p className="mt-1 text-sm leading-relaxed text-cm-cream/80">{text(prayer.note ?? "")}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-6">
                <Button onClick={() => setView("home")} quiet>
                  Back to the season
                </Button>
              </div>
            </div>
          )}

          {view === "scrapbook" && (
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-sand">Scrapbook</h2>
              <p className="mt-1 text-sm text-cm-sand/85">The days you will still be talking about in twenty years.</p>
              {life.scrapbook.length === 0 ? (
                <p className="mt-5 text-sm text-cm-cream/70">Nothing here yet. It fills up by itself.</p>
              ) : (
                <ul className="mt-5 space-y-2">
                  {[...life.scrapbook].reverse().map((memory, index) => (
                    <li key={index} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-cm-gold/50 bg-cm-night text-lg" aria-hidden="true">
                        {memory.icon}
                      </span>
                      <span>
                        <span className="block font-story text-lg leading-snug text-cm-cream">{memory.text}</span>
                        <span className="block text-xs text-cm-sand">{when(memory.turn)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-8 border-t border-white/10 pt-5">
                {sure ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      onClick={() => {
                        clearLife();
                        setSure(false);
                        setTold(null);
                        setView("home");
                        setLife(newLife());
                      }}
                    >
                      Yes, start again from moving day
                    </Button>
                    <Button onClick={() => setSure(false)} quiet>
                      Keep this life
                    </Button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setSure(true)} className="text-xs text-cm-sand underline-offset-4 hover:text-cm-cream hover:underline">
                    Start a new life
                  </button>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </Frame>
  );
}

function Growth({ life }: { life: LifeState }) {
  return (
    <div>
      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {QUALITY_IDS.map((id) => (
          <li key={id}>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-cm-sand">{QUALITY_LABELS[id]}</span>
            <span className="mt-1 block">
              <Pips value={life.qualities[id]} max={MAX_GROWTH} on="bg-cm-gold" />
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-cm-sand/80">Not a score. Just what this life is growing in you.</p>
    </div>
  );
}

function Frame({ audio, onExit, life, children }: { audio: SoundSettings; onExit: () => void; life: LifeState; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cm-night text-cm-cream">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-cm-night/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <span className="font-story text-base tracking-wide text-cm-cream">
            Church <span className="text-cm-gold">Mind</span>
          </span>
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="text-xs font-semibold tabular-nums text-cm-cream">${life.money.toLocaleString()}</span>
            <SoundControls settings={audio} compact />
            <button type="button" onClick={onExit} className="text-xs font-medium text-cm-cream/60 underline-offset-4 hover:text-cm-cream hover:underline">
              Exit
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-6 sm:px-8 lg:pt-10">{children}</main>
    </div>
  );
}
