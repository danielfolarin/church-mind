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
import { CharacterCreator, leadFor, loadCharacter, loadChoice, PRESETS, saveCharacter, saveChoice, type CustomCharacter } from "./game/Creator";
import { Coin, CollectionScreen, Confetti, WeekRewards } from "./game/Collection";
import { DownloadPanel } from "./game/Download";
import { HouseArt } from "./game/life/House";
import { LifeScreen } from "./game/life/LifeScreen";
import { loadLife, newLife, when as lifeWhen } from "./game/life/model";
import { MiniGame } from "./game/MiniGame";
import { addCoins, endingsFound, loadProfile, rewardWeek, type WeekReward } from "./game/rewards";
import { FullFigure } from "./game/Rig";
import { clearWeek, loadWeek, saveWeek, type SavedWeek } from "./game/save";
import { SceneArt, TitleArt } from "./game/SceneArt";
import { TownArt } from "./game/Town";
import { Stage, type StagePerson } from "./game/Stage";
import { STORIES } from "./game/stories";
import { QUALITY_IDS, type Beat, type Lead, type Mood, type Story, type StoryNode, type Opportunity } from "./game/types";
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

// The games page one folder up, when this game is served from a folder of a bigger site
// (games.thecuriousseekers.com/church-mind/). At a domain of its own there is nothing to link to.
const HUB_LINK =
  location.protocol.startsWith("http") && location.pathname.split("/").some((part) => part && !part.endsWith(".html"))
    ? "../"
    : null;

if (import.meta.env.DEV) {
  for (const candidate of STORIES) {
    const problems = validateStory(candidate);
    if (problems.length) console.warn(`Church Mind story "${candidate.id}" has problems:`, problems);
  }
}

type Screen = "title" | "character" | "worlds" | "intro" | "play" | "collection" | "life";

function joinNames(names: string[]) {
  if (names.length < 2) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/** The character the player last chose, ready-made or their own. */
function chosenCharacter(): CustomCharacter {
  const choice = loadChoice();
  return choice === "custom" ? loadCharacter() : (PRESETS.find((preset) => preset.id === choice) ?? PRESETS[0]);
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("title");
  const [character, setCharacter] = useState<CustomCharacter>(chosenCharacter);
  const [story, setStory] = useState<Story>(STORIES[0]);
  const [lead, setLead] = useState<Lead>(() => leadFor(STORIES[0], chosenCharacter()));
  const [game, setGame] = useState<GameState>(() => startWeek(STORIES[0]));
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
    if (screen === "life") return; // Juniper Lane sets its own.
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

  // A quick game on the way in to some activities.
  const [mini, setMini] = useState<Opportunity | null>(null);

  // How things stood at the start of each morning and evening, so the player
  // can go back from the ending and choose differently.
  const [trail, setTrail] = useState<GameState[]>([]);
  const [rewound, setRewound] = useState(false);
  useEffect(() => {
    if (screen === "play" && game.phase !== "summary" && trail.length === game.slot) setTrail([...trail, game]);
  }, [screen, game, trail]);

  // A finished week pays out once: coins and keepsakes, kept for next time.
  const [reward, setReward] = useState<WeekReward | null>(null);
  const rewarded = useRef<GameState | null>(null);
  useEffect(() => {
    if (screen !== "play" || game.phase !== "summary" || rewarded.current === game) return;
    rewarded.current = game;
    setReward(rewardWeek(story, game, endingFor(story, game), rewound));
  }, [screen, game, story, rewound]);

  // The week is saved after every step, so it can be picked up later.
  useEffect(() => {
    if (screen !== "play") return;
    if (game.phase === "summary") clearWeek();
    else saveWeek(story, lead, game, trail);
  }, [screen, story, lead, game, trail]);

  function begin() {
    setLead(leadFor(story, character));
    setGame(startWeek(story));
    setTrail([]);
    setRewound(false);
    setMini(null);
    setScreen("play");
  }

  function resume(saved: SavedWeek) {
    setStory(saved.story);
    setLead(saved.lead);
    setGame(saved.game);
    setTrail(saved.trail);
    setRewound(false);
    setMini(null);
    setScreen("play");
  }

  /** From the ending: back to the start of an earlier morning or evening. */
  function rewind(slot: number) {
    if (!trail[slot]) return;
    setGame(trail[slot]);
    setTrail(trail.slice(0, slot + 1));
    setRewound(true);
    setMini(null);
  }

  if (screen === "title") {
    return <TitleScreen audio={audio} headingRef={headingRef} onBegin={() => setScreen("character")} onContinue={resume} onCollection={() => setScreen("collection")} />;
  }

  if (screen === "collection") {
    return <CollectionScreen stories={STORIES} character={character} wordmark={<Wordmark />} headingRef={headingRef} onBack={() => setScreen("title")} />;
  }

  if (screen === "character") {
    return (
      <CharacterScreen
        audio={audio}
        headingRef={headingRef}
        onBack={() => setScreen("title")}
        onDone={(chosen) => {
          setCharacter(chosen);
          setScreen("worlds");
        }}
      />
    );
  }

  if (screen === "worlds") {
    return (
      <WorldsScreen
        character={character}
        audio={audio}
        headingRef={headingRef}
        onBack={() => setScreen("character")}
        onChoose={(chosen) => {
          setStory(chosen);
          setScreen("intro");
        }}
        onLife={() => setScreen("life")}
      />
    );
  }

  if (screen === "life") {
    return <LifeScreen me={{ name: character.name, base: character.base, look: character.look }} audio={audio} headingRef={headingRef} onExit={() => setScreen("worlds")} />;
  }

  if (screen === "intro") {
    return <IntroScreen story={story} lead={leadFor(story, character)} audio={audio} headingRef={headingRef} onBack={() => setScreen("worlds")} onStart={begin} />;
  }

  const exit = () => setScreen("title");

  if (game.phase === "summary") {
    return (
      <EndingScreen
        story={story}
        lead={lead}
        game={game}
        reward={reward}
        trail={trail}
        audio={audio}
        headingRef={headingRef}
        onRewind={rewind}
        onReplay={() => setScreen("intro")}
        onWorlds={() => setScreen("worlds")}
        onTitle={exit}
      />
    );
  }

  if (mini?.game) {
    return (
      <MiniGame
        id={mini.game}
        lead={lead}
        onDone={({ coins }) => {
          addCoins(coins);
          setMini(null);
          setGame(go(story, game, mini));
        }}
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
          if (opportunity.game) setMini(opportunity);
          else setGame(go(story, game, opportunity));
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
  audio,
  headingRef,
  onBegin,
  onContinue,
  onCollection,
}: {
  audio: SoundSettings;
  headingRef: HeadingRef;
  onBegin: () => void;
  onContinue: (saved: SavedWeek) => void;
  onCollection: () => void;
}) {
  const profile = loadProfile();
  const saved = loadWeek(STORIES);
  const keepsakeCount = STORIES.reduce((sum, story) => sum + story.keepsakes.length, 0);
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-cm-night text-cm-cream">
      <div className="absolute inset-0 animate-cm-fade">
        <TitleArt />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-cm-night via-cm-night/65 to-cm-night/10" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-cm-night/60 via-cm-night/20 to-transparent sm:block" />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cm-cream/70">A story game</span>
        {HUB_LINK && (
          <a
            href={HUB_LINK}
            className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cm-cream/70 underline-offset-4 hover:text-cm-cream hover:underline"
          >
            All games
          </a>
        )}
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
          Choose who you are, then choose a world: a neighbourhood, a university, an office. Live one week there. Decide
          where to be, who to show up for, and what to do with your time, money and energy. You determine how it ends.
          No ending is beyond grace.
        </p>

        {saved ? (
          <div {...stagger(7, "mt-9")}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <PrimaryAction onClick={() => onContinue(saved)}>
                Continue your week <span aria-hidden="true">→</span>
              </PrimaryAction>
              <QuietAction onClick={onBegin}>Start a new week</QuietAction>
            </div>
            <p className="mt-4 text-sm text-cm-sand">
              <span className="font-story text-base italic text-cm-cream">
                {saved.lead.name}, {slotLabel(saved.story.slots[saved.game.slot])}
              </span>
              <span className="mx-2 text-cm-sand/50">·</span>
              {saved.story.intro.place}, saved where you stopped
            </p>
          </div>
        ) : (
          <div {...stagger(7, "mt-9 flex flex-col gap-5 sm:flex-row sm:items-center")}>
            <PrimaryAction onClick={onBegin}>
              Begin Story <span aria-hidden="true">→</span>
            </PrimaryAction>
            <p className="text-sm text-cm-sand">
              <span className="font-story text-base italic text-cm-cream">{STORIES.length} worlds</span>
              <span className="mx-2 text-cm-sand/50">·</span>
              about {STORIES[0].minutes} minutes each
            </p>
          </div>
        )}

        <div {...stagger(9, "mt-8 flex flex-wrap items-center gap-x-4 gap-y-2")}>
          <SoundControls settings={audio} />
          <p className="text-xs text-cm-sand/80">Atmosphere and spoken lines are optional, and start off.</p>
        </div>

        <div {...stagger(10, "mt-4 flex flex-wrap items-start gap-2")}>
          <button
            type="button"
            onClick={onCollection}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold tracking-wide text-cm-cream/80 transition hover:border-white/40 hover:text-cm-cream"
          >
            <Coin /> {profile.coins} · Collection{profile.keepsakes.length ? ` (${profile.keepsakes.length} of ${keepsakeCount})` : ""}
          </button>
          <DownloadPanel />
        </div>
      </main>
    </div>
  );
}

/** A frame shared by the screens before a week begins. */
function Prologue({ audio, onBack, children }: { audio: SoundSettings; onBack: () => void; children: ReactNode }) {
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

      <main className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-16 pt-10 sm:px-10 sm:pt-16">{children}</main>
    </div>
  );
}

/** First of all: who will you be? A ready-made character, or one of your own. */
function CharacterScreen({ audio, headingRef, onBack, onDone }: { audio: SoundSettings; headingRef: HeadingRef; onBack: () => void; onDone: (character: CustomCharacter) => void }) {
  const [custom, setCustom] = useState(loadCharacter);
  const [choice, setChoice] = useState(loadChoice);
  const chosen: CustomCharacter = choice === "custom" ? custom : (PRESETS.find((preset) => preset.id === choice) ?? PRESETS[0]);
  const changeCustom = (next: CustomCharacter) => {
    setCustom(next);
    saveCharacter(next);
  };
  const pick = (next: string) => {
    setChoice(next);
    saveChoice(next);
  };

  return (
    <Prologue audio={audio} onBack={onBack}>
      <p {...stagger(0, "text-[11px] font-semibold uppercase tracking-[0.22em] text-cm-gold")}>Step 1 of 2</p>
      <h1 ref={headingRef} tabIndex={-1} {...stagger(1, "mt-3 font-story text-4xl leading-tight outline-none sm:text-5xl")}>
        Who will you be?
      </h1>
      <p {...stagger(2, "mt-5 max-w-2xl font-story text-lg leading-[1.75] text-cm-cream/85")}>
        Choose someone to live this week as, or make your own. Whoever you pick goes with you into every world.
      </p>

      <section {...stagger(4, "mt-8")}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" role="radiogroup" aria-label="Choose your character">
          {PRESETS.map((option, index) => {
            const selected = option.id === choice;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => pick(option.id)}
                className={`flex flex-col items-center rounded-2xl border px-3 pb-4 pt-4 text-center transition ${
                  selected ? "border-cm-ember bg-cm-ember/10" : "border-white/10 bg-white/[0.04] hover:border-white/30"
                }`}
              >
                <FullFigure look={option.look} mood={selected ? "warm" : "neutral"} delay={`${index * -1.3}s`} className="h-44 w-full sm:h-56" />
                <span className="mt-3 block font-story text-2xl text-cm-cream">{option.name}</span>
                <span className="mt-0.5 block text-xs leading-snug text-cm-sand sm:text-sm">{option.about}</span>
              </button>
            );
          })}
          <button
            type="button"
            role="radio"
            aria-checked={choice === "custom"}
            onClick={() => pick("custom")}
            className={`col-span-2 flex flex-col items-center rounded-2xl border px-3 pb-4 pt-4 text-center transition ${
              choice === "custom" ? "border-cm-ember bg-cm-ember/10" : "border-dashed border-white/25 bg-white/[0.02] hover:border-white/50"
            }`}
          >
            <FullFigure look={custom.look} mood={choice === "custom" ? "warm" : "neutral"} delay="-2.1s" className="h-44 w-full sm:h-56" />
            <span className="mt-3 block font-story text-2xl text-cm-cream">{custom.name.trim() || "Create your own"}</span>
            <span className="mt-0.5 block text-xs text-cm-sand sm:text-sm">your name, your look, your way of standing</span>
          </button>
        </div>

        {choice === "custom" && (
          <div className="mt-4">
            <CharacterCreator value={custom} onChange={changeCustom} />
          </div>
        )}
      </section>

      <div {...stagger(6, "mt-10")}>
        <PrimaryAction onClick={() => onDone(chosen)}>
          Choose a world as {chosen.name.trim() || "yourself"} <span aria-hidden="true">→</span>
        </PrimaryAction>
      </div>
    </Prologue>
  );
}

/** Then: where will you live a week? One world at a time. */
function WorldsScreen({
  character,
  audio,
  headingRef,
  onBack,
  onChoose,
  onLife,
}: {
  character: CustomCharacter;
  audio: SoundSettings;
  headingRef: HeadingRef;
  onBack: () => void;
  onChoose: (story: Story) => void;
  onLife: () => void;
}) {
  const profile = loadProfile();
  // The fourth world is a whole life, and shows the player's own house.
  const life = useMemo(() => loadLife(), []);
  const house = life ?? newLife();
  // Nothing is open at first: three circles, and the one you pick unfolds.
  const [open, setOpen] = useState<string | null>(null);
  const shown = STORIES.find((world) => world.id === open) ?? null;
  // Bring the unfolded world into view, so its button is never left below the screen.
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => panel.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 350);
    return () => window.clearTimeout(timer);
  }, [open]);
  return (
    <Prologue audio={audio} onBack={onBack}>
      <p {...stagger(0, "text-[11px] font-semibold uppercase tracking-[0.22em] text-cm-gold")}>Step 2 of 2</p>
      <h1 ref={headingRef} tabIndex={-1} {...stagger(1, "mt-3 font-story text-4xl leading-tight outline-none sm:text-5xl")}>
        Where will you live?
      </h1>
      <p {...stagger(2, "mt-5 max-w-2xl font-story text-lg leading-[1.75] text-cm-cream/85")}>
        Each world is a different part of life, with its own people and its own pressures. Tap one to open it, {character.name.trim() || "friend"}. The
        others will be here when you come back.
      </p>

      <div {...stagger(4, "mt-10 grid grid-cols-4 gap-1 sm:flex sm:gap-10")} role="radiogroup" aria-label="Choose a world">
        {STORIES.map((world) => {
          const selected = world.id === open;
          return (
            <button
              key={world.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setOpen(selected ? null : world.id)}
              className="group flex flex-col items-center pt-2 text-center sm:w-28"
            >
              <span
                className={`relative block h-16 w-16 overflow-hidden rounded-full bg-cm-dusk ring-2 ring-offset-4 ring-offset-cm-night transition duration-300 sm:h-24 sm:w-24 ${
                  selected ? "scale-110 ring-cm-ember" : "ring-white/20 group-hover:scale-105 group-hover:ring-white/60"
                }`}
              >
                <span className="absolute left-1/2 top-0 block aspect-[4/3] h-full -translate-x-1/2">
                  <TownArt story={world} evening={false} />
                </span>
              </span>
              <span className={`mt-4 block font-story text-[13px] leading-tight transition-colors sm:text-lg ${selected ? "text-cm-cream" : "text-cm-cream/75 group-hover:text-cm-cream"}`}>
                {world.world.name}
              </span>
            </button>
          );
        })}
        <button type="button" role="radio" aria-checked={open === "life"} onClick={() => setOpen(open === "life" ? null : "life")} className="group flex flex-col items-center pt-2 text-center sm:w-28">
          <span
            className={`relative block h-16 w-16 overflow-hidden rounded-full bg-cm-dusk ring-2 ring-offset-4 ring-offset-cm-night transition duration-300 sm:h-24 sm:w-24 ${
              open === "life" ? "scale-110 ring-cm-ember" : "ring-white/20 group-hover:scale-105 group-hover:ring-white/60"
            }`}
          >
            <span className="absolute left-[46%] top-[-22%] block aspect-[3/2] h-[150%] -translate-x-1/2">
              <HouseArt state={house} />
            </span>
          </span>
          <span className={`mt-4 block font-story text-[13px] leading-tight transition-colors sm:text-lg ${open === "life" ? "text-cm-cream" : "text-cm-cream/75 group-hover:text-cm-cream"}`}>A Home on Juniper Lane</span>
        </button>
      </div>

      {/* The chosen world unfolds beneath the three circles. */}
      <div ref={panel} className={`grid scroll-mb-6 transition-[grid-template-rows] duration-500 ease-out ${open ? "mt-8 grid-rows-[1fr]" : "grid-rows-[0fr]"}`} aria-live="polite">
        <div className="overflow-hidden">
          {open === "life" && (
            <div className="animate-cm-rise overflow-hidden rounded-2xl border border-cm-ember/40 bg-white/[0.04] md:grid md:grid-cols-2">
              <div className="relative h-44 w-full overflow-hidden bg-cm-dusk md:h-auto md:aspect-[3/2]">
                <div className="absolute inset-x-0 top-1/2 aspect-[3/2] -translate-y-1/2 md:static md:translate-y-0">
                  <HouseArt state={house} />
                </div>
              </div>
              <div className="flex flex-col p-5 sm:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-gold">A life, season by season</p>
                <h2 className="mt-2 font-story text-3xl leading-tight text-cm-cream">A Home on Juniper Lane</h2>
                <p className="mt-3 text-base leading-relaxed text-cm-cream/85">
                  Build and decorate a house, work to pay the mortgage, love your neighbour, marry, raise children, pray. There is no plot and no last day. What you do with it is up to you.
                </p>
                <p className="mt-4 flex flex-wrap gap-1.5">
                  {["Home", "Work", "Family", "Prayer"].map((theme) => (
                    <span key={theme} className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] font-medium text-cm-sand">
                      {theme}
                    </span>
                  ))}
                </p>
                <p className="mt-4 text-xs text-cm-sand">{life ? `Your life so far: ${lifeWhen(life.turn).toLowerCase()} · saved as you go` : "Starts on moving day · play as long as you like · saved as you go"}</p>
                <div className="mt-auto pt-6">
                  <PrimaryAction onClick={onLife}>
                    {life ? "Go home to Juniper Lane" : "Go to Juniper Lane"} <span aria-hidden="true">→</span>
                  </PrimaryAction>
                </div>
              </div>
            </div>
          )}
          {shown && (
            <div key={shown.id} className="animate-cm-rise overflow-hidden rounded-2xl border border-cm-ember/40 bg-white/[0.04] md:grid md:grid-cols-2">
              <div className="relative h-44 w-full overflow-hidden bg-cm-dusk md:h-auto md:aspect-[4/3]">
                <div className="absolute inset-x-0 top-1/2 aspect-[4/3] -translate-y-1/2 md:static md:translate-y-0">
                  <TownArt story={shown} evening={false} />
                </div>
              </div>
              <div className="flex flex-col p-5 sm:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-gold">{shown.title}</p>
                <h2 className="mt-2 font-story text-3xl leading-tight text-cm-cream">{shown.world.name}</h2>
                <p className="mt-3 text-base leading-relaxed text-cm-cream/85">{shown.world.tagline}</p>
                <p className="mt-4 flex flex-wrap gap-1.5">
                  {shown.world.themes.map((theme) => (
                    <span key={theme} className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] font-medium text-cm-sand">
                      {theme}
                    </span>
                  ))}
                </p>
                <p className="mt-4 text-xs text-cm-sand">
                  Endings found: {endingsFound(shown, profile).length} of {shown.endings.length} · Keepsakes: {shown.keepsakes.filter((keepsake) => profile.keepsakes.includes(keepsake.id)).length} of{" "}
                  {shown.keepsakes.length} · about {shown.minutes} minutes
                </p>
                <div className="mt-auto pt-6">
                  <PrimaryAction onClick={() => onChoose(shown)}>
                    Go to {shown.intro.place} <span aria-hidden="true">→</span>
                  </PrimaryAction>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Prologue>
  );
}

function IntroScreen({ story, lead, audio, headingRef, onBack, onStart }: { story: Story; lead: Lead; audio: SoundSettings; headingRef: HeadingRef; onBack: () => void; onStart: () => void }) {
  const tokens = tokensFor(lead);

  return (
    <Prologue audio={audio} onBack={onBack}>
      <p {...stagger(0, "text-[11px] font-semibold uppercase tracking-[0.22em] text-cm-gold")}>
        {story.title}
      </p>
      <h1 ref={headingRef} tabIndex={-1} {...stagger(1, "mt-3 font-story text-4xl leading-tight outline-none sm:text-5xl")}>
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

      <div {...stagger(6, "mt-10")}>
        <p className="max-w-xl text-sm leading-relaxed text-cm-sand">{story.intro.howToPlay}</p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-cm-sand">
          Along the way five qualities quietly take shape: wisdom, integrity, compassion, courage and trust. They are not a score, and they do not measure
          how much God loves you. How the week ends is yours to decide, and you can always go back and choose differently.
        </p>
        <div className="mt-6">
          <PrimaryAction onClick={onStart}>
            Step into {story.intro.place} <span aria-hidden="true">→</span>
          </PrimaryAction>
        </div>
      </div>
    </Prologue>
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
  reward,
  trail,
  audio,
  headingRef,
  onRewind,
  onReplay,
  onWorlds,
  onTitle,
}: {
  story: Story;
  lead: Lead;
  game: GameState;
  reward: WeekReward | null;
  trail: GameState[];
  audio: SoundSettings;
  headingRef: HeadingRef;
  onRewind: (slot: number) => void;
  onReplay: () => void;
  onWorlds: () => void;
  onTitle: () => void;
}) {
  const ending = endingFor(story, game);
  const found = reward ? endingsFound(story, reward.profile) : [];
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

      {reward && <Confetti delay={0.5} />}

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

          {reward && <WeekRewards story={story} lead={lead} game={game} ending={ending} reward={reward} />}

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

          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-sand">
              The ways this week can end · {found.length} of {story.endings.length} found
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {story.endings.map((option) => {
                const seen = found.includes(option);
                return (
                  <li
                    key={option.id}
                    className={`rounded-xl border px-4 py-3 ${option === ending ? "border-cm-gold/60 bg-cm-gold/[0.07]" : seen ? "border-white/15 bg-white/[0.03]" : "border-dashed border-white/15"}`}
                  >
                    <span className={`block font-story text-lg leading-snug ${seen ? "text-cm-cream" : "text-cm-cream/40"}`}>{seen ? option.title : "An ending you haven’t found"}</span>
                    <span className="mt-0.5 block text-xs text-cm-sand">{option === ending ? "This week" : seen ? option.kind : "Another choice leads here"}</span>
                  </li>
                );
              })}
            </ul>

            {trail.length > 1 && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="font-story text-xl text-cm-cream">Go back and choose differently</h3>
                <p className="mt-1 text-sm leading-relaxed text-cm-sand">Return to the start of any morning or evening. Everything before it stays as it was; everything after it is yours to decide again.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {trail.map((_, slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => onRewind(slot)}
                      className="min-h-10 rounded-full border border-white/15 px-4 py-2 text-sm text-cm-cream/85 transition hover:border-cm-ember/70 hover:bg-white/5"
                    >
                      {story.slots[slot].day} {story.slots[slot].time.toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:flex-wrap sm:items-center">
            <PrimaryAction onClick={onReplay}>Play Again</PrimaryAction>
            <QuietAction onClick={onWorlds}>Choose another world</QuietAction>
            <QuietAction onClick={onTitle}>Back to title</QuietAction>
            <p className="w-full text-sm text-cm-sand">A different week is waiting. You can’t be everywhere, so try being somewhere else.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
