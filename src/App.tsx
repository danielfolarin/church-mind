import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import {
  advance,
  choose,
  endingFor,
  fill,
  go,
  slotLabel,
  startWeek,
  strongestQuality,
  tokensFor,
  validateStory,
  visibleBeats,
  visibleChoices,
  type GameState,
} from "./game/engine";
import { MapScreen } from "./game/MapScreen";
import { sound } from "./game/audio";
import { CharacterCreator, customLead, loadCharacter, saveCharacter, type CustomCharacter } from "./game/Creator";
import { FullFigure } from "./game/Rig";
import { SceneArt, TitleArt } from "./game/SceneArt";
import { Stage, type StagePerson } from "./game/Stage";
import { STORIES } from "./game/stories";
import { QUALITY_IDS, type Beat, type Lead, type Mood, type Story, type StoryNode } from "./game/types";
import {
  BeatView,
  EffectChips,
  GrowthStrip,
  Purse,
  QUALITY_LABELS,
  ScripturePanel,
  SoundControls,
  stagger,
  voicesFor,
  type SoundSettings,
} from "./game/ui";
import { speechFor } from "./game/speech";
import { voice } from "./game/voice";

const story = STORIES[0];

if (import.meta.env.DEV) {
  for (const candidate of STORIES) {
    const problems = validateStory(candidate);
    if (problems.length) console.warn(`Church Mind story "${candidate.id}" has problems:`, problems);
  }
}

type Screen = "title" | "intro" | "play";

function joinNames(names: string[]) {
  if (names.length < 2) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("title");
  const [lead, setLead] = useState<Lead>(story.leads[0]);
  const [game, setGame] = useState<GameState>(() => startWeek(story));
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Sound and voices always start off; browsers only allow audio after a click anyway.
  const [soundOn, setSoundOn] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  // Real recorded voices, where they exist; the device's own voice otherwise.
  const [recordings, setRecordings] = useState(0);
  useEffect(() => {
    void voice.loadClips().then(setRecordings);
  }, []);
  const audio: SoundSettings = {
    soundOn,
    voiceOn,
    soundAvailable: sound.supported,
    voiceAvailable: voice.supported || recordings > 0,
    onToggleSound: () => {
      sound.setEnabled(!soundOn);
      setSoundOn(!soundOn);
    },
    onToggleVoice: () => {
      if (voiceOn) voice.cancel();
      else voice.prime();
      setVoiceOn(!voiceOn);
    },
  };

  // The atmosphere follows wherever the story is.
  useEffect(() => {
    if (screen !== "play" || game.phase === "map") sound.setAmbience("title");
    else if (game.phase === "summary") sound.setAmbience(endingFor(story, game).setting);
    else if (game.nodeId) sound.setAmbience(story.nodes[game.nodeId].setting);
    // Only the place matters here, not every change to the game.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, game.phase, game.nodeId]);

  // Each new scene starts at the top, with focus on its heading for screen readers.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    headingRef.current?.focus({ preventScroll: true });
  }, [screen, game.phase, game.nodeId, game.slot]);

  useEffect(() => {
    if (screen === "play" && game.phase === "summary") sound.play("ending");
  }, [screen, game.phase]);

  function begin(chosen: Lead) {
    setLead(chosen);
    setGame(startWeek(story));
    setScreen("play");
  }

  if (screen === "title") {
    return <TitleScreen story={story} audio={audio} headingRef={headingRef} onBegin={() => setScreen("intro")} />;
  }

  if (screen === "intro") {
    return (
      <IntroScreen
        story={story}
        initialLead={lead}
        audio={audio}
        headingRef={headingRef}
        onBack={() => setScreen("title")}
        onStart={begin}
      />
    );
  }

  const exit = () => setScreen("title");

  if (game.phase === "summary") {
    return (
      <EndingScreen
        story={story}
        lead={lead}
        game={game}
        audio={audio}
        headingRef={headingRef}
        onReplay={() => setScreen("intro")}
        onTitle={exit}
      />
    );
  }

  if (game.phase === "map") {
    return (
      <MapScreen
        story={story}
        lead={lead}
        game={game}
        header={<TopBar audio={audio} onExit={exit} />}
        headingRef={headingRef}
        onGo={(opportunity) => {
          sound.play("choice");
          setGame(go(story, game, opportunity));
        }}
      />
    );
  }

  return <PlayScreen story={story} lead={lead} game={game} audio={audio} headingRef={headingRef} onChange={setGame} onExit={exit} />;
}

type HeadingRef = RefObject<HTMLHeadingElement>;

function Wordmark() {
  return (
    <span className="font-story text-base tracking-wide text-cm-cream">
      Church <span className="text-cm-gold">Mind</span>
    </span>
  );
}

function TopBar({ audio, onExit, children }: { audio: SoundSettings; onExit: () => void; children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-cm-night/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Wordmark />
        <div className="flex items-center gap-3 sm:gap-5">
          {children}
          <SoundControls settings={audio} compact />
          <button type="button" onClick={onExit} className="text-xs font-medium text-cm-cream/60 underline-offset-4 hover:text-cm-cream hover:underline">
            Exit
          </button>
        </div>
      </div>
    </header>
  );
}

function PrimaryAction({ children, onClick, disabled }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cm-ember px-8 py-3 text-sm font-semibold tracking-wide text-white shadow-lg shadow-cm-ember/20 transition hover:-translate-y-0.5 hover:bg-cm-ember-dark disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
    >
      {children}
    </button>
  );
}

function QuietAction({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-7 py-3 text-sm font-semibold tracking-wide text-cm-cream transition hover:border-white/40 hover:bg-white/5"
    >
      {children}
    </button>
  );
}

function TitleScreen({
  story,
  audio,
  headingRef,
  onBegin,
}: {
  story: Story;
  audio: SoundSettings;
  headingRef: HeadingRef;
  onBegin: () => void;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-cm-night text-cm-cream">
      <div className="absolute inset-0 animate-cm-fade">
        <TitleArt />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-cm-night via-cm-night/65 to-cm-night/10" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-cm-night/60 via-cm-night/20 to-transparent sm:block" />

      <header className="relative z-10 px-6 py-5 sm:px-10">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cm-cream/70">A story game</span>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col justify-end px-6 pb-12 pt-24 sm:px-10 sm:pb-20">
        <h1
          ref={headingRef}
          tabIndex={-1}
          {...stagger(1, "font-story text-6xl leading-none tracking-tight outline-none sm:text-8xl")}
        >
          Church <span className="text-cm-gold">Mind</span>
        </h1>
        <p {...stagger(3, "mt-5 font-story text-2xl italic text-cm-cream/90 sm:text-3xl")}>
          See life through the way of Jesus.
        </p>
        <p {...stagger(5, "mt-6 max-w-xl text-base leading-relaxed text-cm-cream/75")}>
          Live one week in an ordinary neighbourhood. Decide where to be, who to show up for, and what to do with your
          time, money and energy. Every choice has consequences. None of them is beyond grace.
        </p>

        <div {...stagger(7, "mt-9 flex flex-col gap-5 sm:flex-row sm:items-center")}>
          <PrimaryAction onClick={onBegin}>
            Begin Story <span aria-hidden="true">→</span>
          </PrimaryAction>
          <p className="text-sm text-cm-sand">
            <span className="font-story text-base italic text-cm-cream">{story.title}</span>
            <span className="mx-2 text-cm-sand/50">·</span>
            about {story.minutes} minutes
          </p>
        </div>

        <div {...stagger(9, "mt-8 flex flex-wrap items-center gap-x-4 gap-y-2")}>
          <SoundControls settings={audio} />
          <p className="text-xs text-cm-sand/80">Atmosphere and spoken lines are optional, and start off.</p>
        </div>
      </main>
    </div>
  );
}

function IntroScreen({
  story,
  initialLead,
  audio,
  headingRef,
  onBack,
  onStart,
}: {
  story: Story;
  initialLead: Lead;
  audio: SoundSettings;
  headingRef: HeadingRef;
  onBack: () => void;
  onStart: (lead: Lead) => void;
}) {
  // Either one of the story's own leads, or a character the player makes.
  const [custom, setCustom] = useState(() => (story.leads.includes(initialLead) ? loadCharacter(story) : { ...loadCharacter(story), look: initialLead.look }));
  const [choice, setChoice] = useState(() => (story.leads.includes(initialLead) ? initialLead.id : "custom"));
  const lead = choice === "custom" ? customLead(story, custom) : (story.leads.find((option) => option.id === choice) ?? story.leads[0]);
  const tokens = tokensFor(lead);
  const changeCustom = (next: CustomCharacter) => {
    setCustom(next);
    saveCharacter(next);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-cm-night text-cm-cream">
      <div className="absolute inset-x-0 top-0 h-[26rem] opacity-50">
        <TitleArt />
      </div>
      <div className="absolute inset-x-0 top-0 h-[26rem] bg-gradient-to-b from-cm-night/30 via-cm-night/70 to-cm-night" />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <Wordmark />
        <div className="flex items-center gap-4">
          <SoundControls settings={audio} compact />
          <button type="button" onClick={onBack} className="text-xs font-medium text-cm-cream/70 underline-offset-4 hover:text-cm-cream hover:underline">
            Back
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-16 pt-10 sm:px-10 sm:pt-16">
        <p {...stagger(0, "text-[11px] font-semibold uppercase tracking-[0.22em] text-cm-gold")}>
          {story.title}
        </p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          {...stagger(1, "mt-3 font-story text-4xl leading-tight outline-none sm:text-5xl")}
        >
          Welcome to {story.intro.place}
        </h1>
        <div {...stagger(2, "mt-6 max-w-3xl space-y-4")}>
          {story.intro.paragraphs.map((paragraph) => (
            <p key={paragraph} className="font-story text-lg leading-[1.75] text-cm-cream/85">
              {paragraph}
            </p>
          ))}
        </div>

        <section {...stagger(4, "mt-10")}>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-sand">Who will you be?</h2>
          <div className="mt-3 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Choose your character">
            {story.leads.map((option, index) => {
              const selected = option.id === choice;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setChoice(option.id)}
                  className={`flex flex-col items-center rounded-2xl border px-3 pb-4 pt-4 text-center transition ${
                    selected ? "border-cm-ember bg-cm-ember/10" : "border-white/10 bg-white/[0.04] hover:border-white/30"
                  }`}
                >
                  <FullFigure look={option.look} mood={selected ? "warm" : "neutral"} delay={`${index * -1.3}s`} className="h-48 w-full sm:h-60" />
                  <span className="mt-3 block font-story text-2xl text-cm-cream">{option.name}</span>
                  <span className="mt-0.5 block text-xs text-cm-sand sm:text-sm">dating {option.partner}</span>
                </button>
              );
            })}
            <button
              type="button"
              role="radio"
              aria-checked={choice === "custom"}
              onClick={() => setChoice("custom")}
              className={`col-span-2 flex flex-col items-center rounded-2xl border px-3 pb-4 pt-4 text-center transition sm:col-span-1 ${
                choice === "custom" ? "border-cm-ember bg-cm-ember/10" : "border-dashed border-white/25 bg-white/[0.02] hover:border-white/50"
              }`}
            >
              <FullFigure look={custom.look} mood={choice === "custom" ? "warm" : "neutral"} delay="-2.1s" className="h-48 w-full sm:h-60" />
              <span className="mt-3 block font-story text-2xl text-cm-cream">{custom.name.trim() || "Create your own"}</span>
              <span className="mt-0.5 block text-xs text-cm-sand sm:text-sm">your name, your look</span>
            </button>
          </div>

          {choice === "custom" && (
            <div className="mt-4">
              <CharacterCreator story={story} value={custom} onChange={changeCustom} />
            </div>
          )}
        </section>

        <section {...stagger(6, "mt-10")}>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-sand">The people in this story</h2>
          <ul className="mt-3 grid gap-3 md:grid-cols-2">
            {[
              { name: lead.name, look: lead.look, traits: story.intro.playerTraits },
              { name: lead.partner, look: lead.partnerLook, traits: story.intro.partnerTraits },
              ...story.cast,
            ].map((person, index) => (
              <li key={person.name} className="flex items-end gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 pb-4 pt-5 sm:gap-5 sm:px-5">
                <FullFigure look={person.look} delay={`${index * -0.9}s`} className="h-52 w-24 shrink-0 sm:h-60 sm:w-28" />
                <div className="min-w-0 self-center">
                  <h3 className="font-story text-2xl text-cm-cream">{person.name}</h3>
                  <ul className="mt-2.5 space-y-2">
                    {person.traits.map((trait) => (
                      <li key={trait} className="flex gap-2.5 text-[0.9375rem] leading-snug text-cm-cream/80">
                        <span aria-hidden="true" className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-cm-gold" />
                        {fill(trait, tokens)}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div {...stagger(8, "mt-10")}>
          <p className="max-w-xl text-sm leading-relaxed text-cm-sand">
            {story.intro.howToPlay}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-cm-sand">
            Along the way five qualities quietly take shape: wisdom, integrity, compassion, courage and trust. They are
            not a score, and they do not measure how much God loves you.
          </p>
          <div className="mt-6">
            <PrimaryAction onClick={() => onStart(lead)}>
              Step into {story.intro.place} <span aria-hidden="true">→</span>
            </PrimaryAction>
          </div>
        </div>
      </main>
    </div>
  );
}

/** Where the player is within the scene on screen: lines arrive one at a time. */
interface Pace {
  nodeId: string;
  /** How many beats have been revealed. */
  shown: number;
  /** The newest line has finished being written out. */
  lineDone: boolean;
  /** Write the newest line out all at once. */
  instant: boolean;
  /** The scene was laid out whole rather than line by line, so nothing is read aloud. */
  whole: boolean;
}

function startPace(nodeId: string, beatCount: number, allAtOnce: boolean): Pace {
  return allAtOnce
    ? { nodeId, shown: beatCount, lineDone: true, instant: true, whole: true }
    : { nodeId, shown: 1, lineDone: false, instant: false, whole: false };
}

/** Who is standing in the scene, how they feel, and who is talking. */
function peopleOnStage(story: Story, lead: Lead, node: StoryNode, beats: Beat[], shown: number, speaker: string | null): StagePerson[] {
  const speakers = (list: Beat[]) => list.flatMap((beat) => (beat.type === "dialogue" ? [beat.speaker] : []));
  const revealed = beats.slice(0, shown);
  const ids = [...new Set(["you", ...(node.onStage ?? speakers(beats)), ...speakers(revealed)])];

  const moods: Record<string, Mood> = {};
  for (const beat of revealed) {
    if (beat.type === "thought") moods.you = "thoughtful";
    if (beat.type === "dialogue" && beat.mood) moods[beat.speaker] = beat.mood;
    Object.assign(moods, beat.react);
  }

  const lookOf = (id: string) => {
    if (id === "you") return lead.look;
    if (id === "partner") return lead.partnerLook;
    return story.cast.find((character) => character.id === id)?.look ?? lead.look;
  };

  return ids.map((id) => ({ id, look: lookOf(id), mood: moods[id] ?? "neutral", speaking: id === speaker }));
}

function PlayScreen({
  story,
  lead,
  game,
  audio,
  headingRef,
  onChange,
  onExit,
}: {
  story: Story;
  lead: Lead;
  game: GameState;
  audio: SoundSettings;
  headingRef: HeadingRef;
  onChange: (next: GameState) => void;
  onExit: () => void;
}) {
  const nodeId = game.nodeId ?? "";
  const node = story.nodes[nodeId];
  const tokens = useMemo(() => tokensFor(lead, game.money), [lead, game.money]);
  const voices = useMemo(() => voicesFor(story, lead.partner), [story, lead]);
  const text = (raw: string) => fill(raw, tokens);
  const beats = visibleBeats(node.beats, game);
  const choices = visibleChoices(node.choices, game);
  // What is tempting the player here, if anything.
  const moneyOnOffer = choices.find((choice) => choice.tempt === "money")?.money ?? 0;
  const activity = story.opportunities.find((opportunity) => opportunity.id === game.activity);
  const grewNames = game.grew.map((id) => QUALITY_LABELS[id]);

  // People who ask for less motion get each scene whole, as a page to read.
  const stillness = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const [savedPace, setPace] = useState(() => startPace(nodeId, beats.length, stillness));
  // A new scene starts again from its first line.
  const pace = savedPace.nodeId === nodeId ? savedPace : startPace(nodeId, beats.length, stillness);
  if (pace !== savedPace) setPace(pace);

  const current = beats[pace.shown - 1];
  const lineDone = pace.lineDone || current.type === "scripture";
  const finished = pace.shown >= beats.length && lineDone;

  // With voices on, the newest line is read aloud as it appears.
  const [voiceBusy, setVoiceBusy] = useState(false);
  const speechTurn = audio.voiceOn && !pace.whole ? `${nodeId}:${pace.shown}` : null;
  const speechRef = useRef(() => speechFor(story, lead, current, text));
  speechRef.current = () => speechFor(story, lead, current, text);
  useEffect(() => {
    if (!speechTurn) return;
    const line = speechRef.current();
    setVoiceBusy(true);
    voice.speak(line.text, line.style, () => setVoiceBusy(false), line.clip);
    return () => {
      voice.cancel();
      setVoiceBusy(false);
    };
  }, [speechTurn]);
  useEffect(() => sound.duck(voiceBusy), [voiceBusy]);

  // Temptation announces itself.
  const tempting = finished && choices.some((choice) => choice.tempt);
  useEffect(() => {
    if (tempting) sound.play("tempt");
  }, [tempting, nodeId]);

  // A small sound as each new line arrives.
  const heard = useRef(`${nodeId}:${pace.shown}`);
  useEffect(() => {
    const turn = `${nodeId}:${pace.shown}`;
    if (heard.current === turn) return;
    heard.current = turn;
    if (pace.shown === 1 || pace.whole) return;
    sound.play(current.type === "scripture" ? "scripture" : current.type === "message" ? "message" : "advance");
  }, [nodeId, pace.shown, pace.whole, current.type]);

  const speaker = current.type === "dialogue" && (!lineDone || voiceBusy) ? current.speaker : null;
  const people = peopleOnStage(story, lead, node, beats, pace.shown, speaker);

  // First press finishes the line being written; the next brings the following one.
  const next = useCallback(() => {
    setPace((now) => {
      if (!now.lineDone && beats[now.shown - 1].type !== "scripture") return { ...now, lineDone: true, instant: true };
      if (now.shown >= beats.length) return now;
      return { ...now, shown: now.shown + 1, lineDone: false, instant: false, whole: false };
    });
  }, [beats]);
  const nextRef = useRef(next);
  nextRef.current = next;

  useEffect(() => {
    if (finished) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== " " && event.key !== "Enter" && event.key !== "ArrowRight") return;
      if (event.target instanceof HTMLElement && event.target.closest("button, a, input, textarea")) return;
      event.preventDefault();
      nextRef.current();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finished]);

  // Keep the newest line, and whatever comes after it, in view.
  const controlsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (pace.shown === 1 && !finished) return;
    controlsRef.current?.scrollIntoView({ block: "nearest", behavior: stillness ? "auto" : "smooth" });
  }, [pace.shown, finished, stillness]);

  return (
    <div className="min-h-screen bg-cm-night text-cm-cream">
      <TopBar audio={audio} onExit={onExit}>
        <Purse money={game.money} energy={game.energy} lure={finished ? moneyOnOffer : 0} />
      </TopBar>

      <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14 lg:pt-10">
        {/* On phones the scene stays pinned under the header while the story scrolls beneath it. */}
        <aside className="contents lg:sticky lg:top-24 lg:block lg:self-start">
          <div className="sticky top-14 z-10 -mx-5 bg-cm-night px-5 pb-3 pt-4 sm:-mx-8 sm:px-8 lg:static lg:m-0 lg:p-0">
            <Stage
              setting={node.setting}
              caption={text(node.caption)}
              people={people}
              lure={moneyOnOffer > 0 ? "money" : null}
              onClick={finished ? undefined : next}
            />
          </div>
          <div className="mt-1 lg:mt-6">
            <GrowthStrip qualities={game.qualities} grew={game.grew} note />
          </div>
        </aside>

        <article key={nodeId} className="mt-7 lg:mt-0">
          <p className="animate-cm-fade text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-gold">
            {slotLabel(story.slots[game.slot])}
          </p>
          <h1 ref={headingRef} tabIndex={-1} className="mt-1 animate-cm-fade font-story text-3xl outline-none sm:text-4xl">
            {text(activity?.title ?? "")}
          </h1>

          {grewNames.length > 0 && (
            <p role="status" className="mt-3 animate-cm-fade text-sm text-cm-gold/90">
              {joinNames(grewNames)} grew.
            </p>
          )}

          <div className="mt-6 space-y-5">
            {beats.slice(0, pace.shown).map((beat, index) => {
              const newest = index === pace.shown - 1;
              return (
                <div
                  key={index}
                  className={`transition-opacity duration-700 ${newest || finished ? "opacity-100" : "opacity-60"}`}
                >
                  <div className="animate-cm-rise">
                    <BeatView
                      beat={beat}
                      voices={voices}
                      text={text}
                      typing={
                        newest
                          ? {
                              instant: pace.instant,
                              onDone: () => setPace((now) => (now.lineDone ? now : { ...now, lineDone: true })),
                            }
                          : undefined
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div ref={controlsRef} className="mt-8 scroll-mb-6">
            {!finished ? (
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold tracking-wide text-cm-cream transition hover:border-cm-ember/70 hover:bg-white/5"
                >
                  Next <span aria-hidden="true">→</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPace({ nodeId: nodeId, shown: beats.length, lineDone: true, instant: true, whole: true })}
                  className="text-xs font-medium text-cm-sand/80 underline-offset-4 hover:text-cm-cream hover:underline"
                >
                  Show the whole scene
                </button>
              </div>
            ) : choices.length ? (
              <div className="animate-cm-rise">
                {node.prompt && (
                  <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-sand">{node.prompt}</h2>
                )}
                <ol className="space-y-3">
                  {choices.map((choice, index) => (
                    <li key={choice.id}>
                      <button
                        type="button"
                        onClick={() => {
                          sound.play("choice");
                          onChange(choose(story, game, choice));
                        }}
                        className={`group flex w-full items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-left transition hover:-translate-y-0.5 hover:border-cm-ember/70 hover:bg-white/[0.07] ${
                          choice.tempt ? `cm-tempt cm-tempt-${choice.tempt}` : ""
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/20 text-[11px] font-semibold text-cm-sand transition group-hover:border-cm-ember group-hover:text-cm-ember"
                        >
                          {index + 1}
                        </span>
                        <span>
                          <span className="block font-story text-[1.0625rem] leading-snug text-cm-cream sm:text-lg sm:leading-snug">
                            {text(choice.label)}
                          </span>
                          {(choice.money || choice.energy) && (
                            <span className="mt-2 block">
                              <EffectChips effects={choice} lively={choice.tempt === "money"} />
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <div className="animate-cm-rise">
                <PrimaryAction
                  onClick={() => {
                    sound.play("advance");
                    onChange(advance(story, game));
                  }}
                >
                  Continue <span aria-hidden="true">→</span>
                </PrimaryAction>
              </div>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}

function EndingScreen({
  story,
  lead,
  game,
  audio,
  headingRef,
  onReplay,
  onTitle,
}: {
  story: Story;
  lead: Lead;
  game: GameState;
  audio: SoundSettings;
  headingRef: HeadingRef;
  onReplay: () => void;
  onTitle: () => void;
}) {
  const ending = endingFor(story, game);
  const tokens = tokensFor(lead, game.money);
  const voices = voicesFor(story, lead.partner);
  const text = (raw: string) => fill(raw, tokens);
  const beats = visibleBeats(ending.beats, game);
  const threads = story.threads
    .map((thread) => ({ title: thread.title, beats: visibleBeats(thread.beats, game) }))
    .filter((thread) => thread.beats.length > 0);
  const strongest = strongestQuality(game.qualities);

  return (
    <div className="min-h-screen bg-cm-night text-cm-cream">
      <div className="relative h-64 overflow-hidden sm:h-80">
        <div className="h-full w-full animate-cm-fade">
          <SceneArt setting={ending.setting} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-cm-night via-cm-night/50 to-cm-night/20" />
        <div className="absolute inset-x-0 top-0 mx-auto flex max-w-3xl items-center justify-between px-6 py-5 sm:px-10">
          <Wordmark />
          <SoundControls settings={audio} compact />
        </div>
      </div>

      <main className="relative mx-auto -mt-24 max-w-3xl px-6 pb-20 sm:px-10">
        <p {...stagger(0, "text-[11px] font-semibold uppercase tracking-[0.22em] text-cm-gold")}>
          Your week · {ending.kind}
        </p>
        <h1 ref={headingRef} tabIndex={-1} {...stagger(1, "mt-2 font-story text-4xl leading-tight outline-none sm:text-5xl")}>
          {ending.title}
        </h1>

        <div className="mt-7 space-y-5">
          {beats.map((beat, index) => (
            <div key={index} {...stagger(index + 2)}>
              <BeatView beat={beat} voices={voices} text={text} />
            </div>
          ))}
        </div>

        <div className="mt-10 animate-cm-fade space-y-10" style={{ animationDelay: "0.9s" }}>
          <ScripturePanel scripture={ending.scripture} />

          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-sand">The rest of your week</h2>
            <dl className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
              {threads.map((thread) => (
                <div key={thread.title} className="px-5 py-4 sm:flex sm:gap-6">
                  <dt className="font-story text-xl text-cm-cream sm:w-28 sm:shrink-0">{thread.title}</dt>
                  <dd className="mt-1 space-y-3 sm:mt-0.5">
                    {thread.beats.map((beat, index) => (
                      <BeatView key={index} beat={beat} voices={voices} text={text} />
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-sand">What grew along the way</h2>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <GrowthStrip qualities={game.qualities} grew={strongest ? [strongest] : []} />
              {strongest && (
                <p className="mt-5 font-story text-lg leading-relaxed text-cm-cream/90">
                  <span className="text-cm-gold">{QUALITY_LABELS[strongest]}.</span> {story.qualityNotes[strongest]}
                </p>
              )}
              <p className="mt-4 text-sm leading-relaxed text-cm-sand">
                {QUALITY_IDS.every((id) => game.qualities[id] === 0) ? "Little grew this time, and that is allowed. " : ""}
                None of this is a grade. God’s love for you was settled before your first choice and is not altered by
                your last one. Growth is what happens inside that love, not the price of it.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-sand">How you spent it</h2>
            <ol className="mt-4 space-y-3">
              {game.path.map((step, index) => {
                const first = index === 0 || game.path[index - 1].slot !== step.slot;
                return (
                  <li key={index} className="flex gap-4">
                    <span className="mt-1 w-28 shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-cm-sand/80 sm:w-36">
                      {first ? slotLabel(story.slots[step.slot]) : ""}
                    </span>
                    <span className={`font-story text-[1.0625rem] leading-snug ${first ? "text-cm-cream/90" : "text-cm-cream/65"}`}>
                      {text(step.label)}
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>

          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-sand">Questions to carry with you</h2>
            <ul className="mt-4 space-y-3">
              {ending.questions.map((question) => (
                <li key={question} className="border-l-2 border-cm-gold/40 pl-4 font-story text-lg italic leading-relaxed text-cm-cream/90">
                  {question}
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
            <PrimaryAction onClick={onReplay}>Play Again</PrimaryAction>
            <QuietAction onClick={onTitle}>Back to title</QuietAction>
            <p className="text-sm text-cm-sand sm:ml-2">A different week is waiting. You can’t be everywhere, so try being somewhere else.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
