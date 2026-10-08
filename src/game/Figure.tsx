import { useId, type CSSProperties } from "react";
import type { Look, Mood, Stance } from "./types";

// Illustrated people, drawn in SVG. Each figure breathes and blinks on its own,
// changes expression with `mood`, and moves its mouth while `speaking`.

const INK = "#1E1512";
const BOX: CSSProperties = { transformBox: "fill-box", transformOrigin: "center" };
const EASE: CSSProperties = { ...BOX, transition: "transform 0.5s ease" };

interface Face {
  mouth: string;
  /** Degrees each brow tilts; negative lifts the inner end of the left brow. */
  browLeft: number;
  browRight: number;
  browLift: number;
  eyeX: number;
  eyeY: number;
  /** How far the upper and lower lids close in, 0 to 1. */
  lid: number;
  squint: number;
  lipY: number;
  blush: number;
}

const FACES: Record<Mood, Face> = {
  neutral: { mouth: "M89 139 Q100 142.5 111 139", browLeft: 0, browRight: 0, browLift: 0, eyeX: 0, eyeY: 0, lid: 0.15, squint: 0, lipY: 144.5, blush: 0 },
  warm: { mouth: "M85 136.5 Q100 148 115 136.5", browLeft: 2, browRight: -2, browLift: -1.5, eyeX: 0, eyeY: 0, lid: 0.2, squint: 0.7, lipY: 148, blush: 0.12 },
  sad: { mouth: "M90 142 Q100 138 110 142", browLeft: -11, browRight: 11, browLift: 0, eyeX: 0, eyeY: 1.6, lid: 0.6, squint: 0, lipY: 145.5, blush: 0 },
  hurt: { mouth: "M91 143 Q100 137 109 143", browLeft: -17, browRight: 17, browLift: -1, eyeX: 0, eyeY: 0.8, lid: 0.4, squint: 0.3, lipY: 146, blush: 0.08 },
  thoughtful: { mouth: "M91 140 Q100 140.5 109 139", browLeft: -4, browRight: -9, browLift: -1, eyeX: 1.8, eyeY: 1.2, lid: 0.45, squint: 0, lipY: 145, blush: 0 },
  worried: { mouth: "M92 141 Q100 139.5 108 141", browLeft: -9, browRight: 9, browLift: -2, eyeX: 0, eyeY: 0, lid: 0, squint: 0, lipY: 145.5, blush: 0 },
};

function HairBack({ look }: { look: Look }) {
  switch (look.hairStyle) {
    case "puff":
      return <circle cx="100" cy="74" r="60" fill={look.hair} />;
    case "wavy":
      return (
        <path
          d="M50 98 Q42 38 100 36 Q158 38 150 98 Q156 150 168 184 Q146 198 128 182 L128 108 L72 108 L72 182 Q54 198 32 184 Q44 150 50 98Z"
          fill={look.hair}
        />
      );
    case "long":
      return (
        <path
          d="M52 98 Q44 38 100 36 Q156 38 148 98 L154 226 Q132 236 126 204 L126 108 L74 108 L74 204 Q68 236 46 226Z"
          fill={look.hair}
        />
      );
    case "bun":
      return <circle cx="100" cy="42" r="21" fill={look.hair} />;
    default:
      return null;
  }
}

function HairFront({ look }: { look: Look }) {
  const fill = look.hair;
  switch (look.hairStyle) {
    case "short":
      return <path d="M57 100 Q52 48 100 45 Q148 48 143 100 Q140 74 124 67 Q100 61 76 67 Q60 74 57 100Z" fill={fill} />;
    case "side":
      return <path d="M56 102 Q48 42 100 40 Q152 42 144 102 Q143 80 133 70 Q112 80 82 66 Q64 74 56 102Z" fill={fill} />;
    case "puff":
      return <path d="M57 100 Q54 46 100 45 Q146 46 143 100 Q135 70 100 67 Q65 70 57 100Z" fill={fill} />;
    case "wavy":
      return <path d="M57 102 Q54 48 100 46 Q146 48 143 102 Q141 82 128 68 Q104 84 76 70 Q62 80 57 102Z" fill={fill} />;
    case "bun":
      return <path d="M57 102 Q54 50 100 48 Q146 50 143 102 Q138 70 100 65 Q62 70 57 102Z" fill={fill} />;
    case "long":
      return <path d="M57 104 Q56 48 100 46 Q144 48 143 104 Q139 76 100 60 Q61 76 57 104Z" fill={fill} />;
    case "curly":
      return (
        <g fill={fill}>
          <path d="M57 100 Q52 52 100 50 Q148 52 143 100 Q140 76 124 70 Q100 64 76 70 Q60 76 57 100Z" />
          {[[66, 64, 13], [82, 50, 14], [102, 45, 14], [121, 51, 13], [135, 65, 12]].map(([cx, cy, r]) => (
            <circle key={cx} cx={cx} cy={cy} r={r} />
          ))}
        </g>
      );
  }
}

function Clothes({ look }: { look: Look }) {
  const accent = look.accent ?? "#F4EBDD";
  switch (look.topStyle) {
    case "cardigan":
      return (
        <g>
          <path d="M84 180 Q100 200 116 180 L124 260 H76Z" fill={accent} />
          <path d="M66 185 L84 179 Q88 226 96 260 H70Z M134 185 L116 179 Q112 226 104 260 H130Z" fill="#000" opacity="0.14" />
        </g>
      );
    case "apron":
      return (
        <g fill={accent}>
          <path d="M72 216 H128 V260 H72Z" />
          <path d="M72 216 L84 181 H90 L80 218Z M128 216 L116 181 H110 L120 218Z" />
        </g>
      );
    case "hoodie":
      return (
        <g>
          <path d="M70 186 Q100 214 130 186 Q122 204 100 208 Q78 204 70 186Z" fill="#000" opacity="0.2" />
          <path d="M92 206 V236 M108 206 V236" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case "collar":
      return <path d="M84 179 L100 198 L88 208 L72 186Z M116 179 L100 198 L112 208 L128 186Z" fill={accent} />;
    default:
      return null;
  }
}

/** The head: face, hair and expression. Shared by the bust and the full figure. */
function Head({
  look,
  mood,
  speaking,
  facing,
  blinkDelay,
}: {
  look: Look;
  mood: Mood;
  speaking: boolean;
  facing: -1 | 0 | 1;
  blinkDelay: string;
}) {
  const face = FACES[mood];
  const brow = look.hairStyle === "bun" ? "#3A2C26" : look.hair;
  const id = useId().replace(/:/g, "");
  const turn = facing * 3;
  const lip = look.lip ?? "#6A2E28";

  return (
    <g
      className={speaking ? "animate-cm-nod" : "animate-cm-sway"}
      style={{ transformBox: "fill-box", transformOrigin: "50% 100%", animationDelay: speaking ? "0s" : blinkDelay }}
    >
      <ellipse cx="56" cy="110" rx="6" ry="10" fill={look.shade} />
      <ellipse cx="144" cy="110" rx="6" ry="10" fill={look.shade} />
      {look.earrings && (
        <g fill="#E2B36B">
          <circle cx="55" cy="124" r="3" />
          <circle cx="145" cy="124" r="3" />
        </g>
      )}
      <path d="M58 100 Q58 52 100 52 Q142 52 142 100 Q142 134 124 151 Q112 161 100 161 Q88 161 76 151 Q58 134 58 100Z" fill={look.skin} />
      {/* The side of the face turned away from the light */}
      <path
        d="M58 100 Q58 52 100 52 Q78 72 75 104 Q74 138 100 161 Q88 161 76 151 Q58 134 58 100Z"
        fill={look.shade}
        opacity="0.36"
        transform={facing < 0 ? "translate(200 0) scale(-1 1)" : undefined}
      />
      {look.beard && (
        <path
          d="M60 116 Q62 150 80 158 Q100 168 120 158 Q138 150 140 116 Q134 134 118 132 Q100 126 82 132 Q66 134 60 116Z"
          fill={look.hair}
          opacity="0.88"
        />
      )}
      <HairFront look={look} />

      <g style={{ transform: `translateX(${turn}px)`, transition: "transform 0.5s ease" }}>
        <g fill="#E8622C" style={{ opacity: face.blush, transition: "opacity 0.5s ease" }}>
          <circle cx="74" cy="130" r="9" />
          <circle cx="126" cy="130" r="9" />
        </g>

        <g stroke={brow} strokeWidth="3.2" strokeLinecap="round" fill="none">
          <path d="M73 96 Q83 91 93 95" style={{ ...EASE, transform: `translateY(${face.browLift}px) rotate(${face.browLeft}deg)` }} />
          <path d="M107 95 Q117 91 127 96" style={{ ...EASE, transform: `translateY(${face.browLift}px) rotate(${face.browRight}deg)` }} />
        </g>

        <g className="animate-cm-blink" style={{ ...BOX, animationDelay: blinkDelay }}>
          {[83, 117].map((cx) => {
            const top = 101 + face.lid * 5;
            const bottom = 117 - face.squint * 3.5;
            const opening = `M${cx - 10} 110 Q${cx} ${top} ${cx + 10} 110 Q${cx} ${bottom} ${cx - 10} 110Z`;
            return (
              <g key={cx}>
                <clipPath id={`${id}-eye-${cx}`}>
                  <path d={opening} />
                </clipPath>
                <path d={opening} fill="#F3EAE1" />
                <g clipPath={`url(#${id}-eye-${cx})`}>
                  <g style={{ ...EASE, transform: `translate(${face.eyeX}px, ${face.eyeY * 0.6}px)` }}>
                    <circle cx={cx} cy="109.6" r="4.7" fill={look.eyes ?? "#3B2418"} />
                    <circle cx={cx} cy="109.6" r="2.2" fill="#120C0A" />
                    <circle cx={cx + 1.7} cy="107.9" r="1.3" fill="#FFF" opacity="0.9" />
                  </g>
                </g>
                <path d={`M${cx - 10.5} 110 Q${cx} ${top} ${cx + 10.5} 110`} fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
              </g>
            );
          })}
        </g>

        {look.glasses && (
          <g fill="#FFF" fillOpacity="0.06" stroke="#D8B777" strokeWidth="2">
            <circle cx="83" cy="110" r="12" />
            <circle cx="117" cy="110" r="12" />
            <path d="M95 109 Q100 106 105 109 M71 108 L58 104 M129 108 L142 104" fill="none" />
          </g>
        )}

        <path d="M100 113 Q96 125 100 127 Q103 128 105 126" fill="none" stroke={look.shade} strokeWidth="2.4" strokeLinecap="round" />

        <ellipse
          cx="100"
          cy={speaking ? 148.5 : face.lipY}
          rx="7"
          ry="2.3"
          fill={lip}
          opacity={mood === "warm" && !speaking ? 0 : 0.38}
        />
        {speaking ? (
          <ellipse cx="100" cy="141.5" rx="7.5" ry="5.5" fill="#3A1512" stroke={lip} strokeWidth="2" className="animate-cm-talk" style={BOX} />
        ) : (
          <path d={face.mouth} fill="none" stroke={lip} strokeWidth="3" strokeLinecap="round" />
        )}
      </g>
    </g>
  );
}

export function Figure({
  look,
  mood = "neutral",
  speaking = false,
  /** Shifts the face a little so the figure seems to look across the stage. */
  facing = 0,
  viewBox = "0 0 200 260",
  preserveAspectRatio = "xMidYMax meet",
  blinkDelay = "0s",
  className = "",
}: {
  look: Look;
  mood?: Mood;
  speaking?: boolean;
  facing?: -1 | 0 | 1;
  viewBox?: string;
  preserveAspectRatio?: string;
  blinkDelay?: string;
  className?: string;
}) {
  return (
    <svg viewBox={viewBox} preserveAspectRatio={preserveAspectRatio} aria-hidden="true" className={`block ${className}`}>
      <g className="animate-cm-breathe">
        <HairBack look={look} />
        <g transform={look.slim ? "translate(9 0) scale(0.91 1)" : undefined}>
          <path d="M16 260 Q16 202 64 186 L84 179 Q100 192 116 179 L136 186 Q184 202 184 260Z" fill={look.top} />
          <Clothes look={look} />
          <g fill="#000">
            <path d="M16 260 Q16 202 64 186 Q38 212 40 260Z" opacity="0.14" />
            <path d="M184 260 Q184 202 136 186 Q162 212 160 260Z" opacity="0.14" />
            <path d="M66 185 L84 179 Q100 192 116 179 L134 185 Q100 206 66 185Z" opacity="0.14" />
          </g>
        </g>
        <path d="M84 150 V181 Q100 196 116 181 V150Z" fill={look.shade} />
        <path d="M84 152 Q100 176 116 152 V163 Q100 184 84 163Z" fill="#000" opacity="0.2" />

        <Head look={look} mood={mood} speaking={speaking} facing={facing} blinkDelay={blinkDelay} />
      </g>
    </svg>
  );
}

/** A head-and-shoulders crop of a figure, for cast lists and character cards. */
export function Portrait({ look, mood = "warm", className = "" }: { look: Look; mood?: Mood; className?: string }) {
  return (
    <span className={`block overflow-hidden rounded-full bg-cm-clay ring-1 ring-white/10 ${className}`}>
      <Figure look={look} mood={mood} viewBox="30 24 140 140" preserveAspectRatio="xMidYMid slice" className="h-full w-full" />
    </span>
  );
}

// ——— Full figures ———

type Arm = "relaxed" | "akimbo" | "pockets" | "clasped" | "book" | "cup" | "wave" | "open";

// Each stance as [left arm, right arm]. Left means the viewer's left.
const STANCES: Record<Stance, [Arm, Arm]> = {
  relaxed: ["relaxed", "relaxed"],
  akimbo: ["akimbo", "akimbo"],
  hip: ["akimbo", "relaxed"],
  pockets: ["pockets", "pockets"],
  clasped: ["clasped", "clasped"],
  book: ["book", "book"],
  cup: ["relaxed", "cup"],
  wave: ["relaxed", "wave"],
  open: ["relaxed", "open"],
};

// Shoulder, elbow and hand positions for the left arm; the right arm mirrors them.
const ARMS: Record<Arm, [number, number][]> = {
  relaxed: [[46, 202], [33, 268], [37, 330]],
  akimbo: [[46, 202], [10, 262], [57, 316]],
  pockets: [[46, 202], [35, 266], [58, 322]],
  clasped: [[46, 202], [40, 272], [91, 312]],
  book: [[46, 202], [38, 270], [82, 272]],
  cup: [[46, 202], [34, 270], [76, 262]],
  wave: [[46, 202], [16, 240], [22, 170]],
  open: [[46, 202], [30, 262], [4, 280]],
};

/**
 * A whole person, standing. Their `look.stance` decides what they do with
 * their hands, and they shift their weight, blink, and move as they wait.
 */
export function FullFigure({ look, mood = "warm", delay = "0s", className = "" }: { look: Look; mood?: Mood; /** Offsets the movement so a row of people isn't in step. */ delay?: string; className?: string }) {
  const stance = look.stance ?? "relaxed";
  const [leftArm, rightArm] = STANCES[stance];
  const legs = look.legs ?? "#2A2F3A";
  const shoes = look.shoes ?? "#1A1614";
  const hem = look.longSkirt ? 478 : 424;
  const flowing = look.hairStyle === "long" || look.hairStyle === "wavy";
  const pivot = { transformBox: "fill-box", transformOrigin: "50% 0%" } as const;

  const arm = (kind: Arm, side: "left" | "right") => {
    const flip = (x: number) => (side === "left" ? x : 200 - x);
    const [shoulder, elbow, hand] = ARMS[kind].map(([x, y]) => [flip(x), y] as const);
    const sleeve = { fill: "none", stroke: look.top, strokeWidth: 21, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
    const forearm = (
      <>
        <path d={`M${elbow[0]} ${elbow[1]} L${hand[0]} ${hand[1]}`} {...sleeve} />
        {kind !== "pockets" && <circle cx={hand[0]} cy={hand[1]} r="10.5" fill={look.skin} />}
      </>
    );
    return (
      <g key={side}>
        <path d={`M${shoulder[0]} ${shoulder[1]} L${elbow[0]} ${elbow[1]}`} {...sleeve} />
        {kind === "wave" ? (
          <g className="animate-cm-wave" style={{ transformBox: "view-box", transformOrigin: `${elbow[0]}px ${elbow[1]}px` }}>
            {forearm}
          </g>
        ) : (
          forearm
        )}
      </g>
    );
  };

  return (
    <svg viewBox="0 0 200 520" preserveAspectRatio="xMidYMax meet" aria-hidden="true" className={`block ${className}`}>
      <ellipse cx="100" cy="507" rx="62" ry="8" fill="#000" opacity="0.3" />
      <g className="animate-cm-shift" style={{ transformBox: "fill-box", transformOrigin: "50% 100%", animationDelay: delay }}>
        {flowing ? (
          <g className="animate-cm-hairswing" style={{ ...pivot, animationDelay: delay }}>
            <HairBack look={look} />
          </g>
        ) : (
          <HairBack look={look} />
        )}

        {/* Legs and shoes */}
        {look.skirt ? (
          <>
            <rect x="72" y={hem - 6} width="17" height={500 - hem + 6} rx="6" fill={look.skin} />
            <rect x="111" y={hem - 6} width="17" height={500 - hem + 6} rx="6" fill={look.skin} />
          </>
        ) : (
          <>
            <path d="M54 322 H103 L97 500 H68Z" fill={legs} />
            <path d="M97 322 H146 L132 500 H103Z" fill={legs} />
          </>
        )}
        <ellipse cx="78" cy="503" rx="19" ry="8" fill={shoes} />
        <g className={stance === "akimbo" ? "animate-cm-tap" : undefined} style={{ transformBox: "fill-box", transformOrigin: "0% 100%" }}>
          <ellipse cx="122" cy="503" rx="19" ry="8" fill={shoes} />
        </g>
        {look.skirt && <path d={`M52 322 H148 L${look.longSkirt ? 158 : 164} ${hem} H${look.longSkirt ? 42 : 36}Z`} fill={look.skirt} />}

        {/* Body */}
        <g transform={look.slim ? "translate(7 0) scale(0.93 1)" : undefined}>
          <path d="M46 190 L84 179 Q100 192 116 179 L154 190 Q164 204 158 240 L148 334 H52 L42 240 Q36 204 46 190Z" fill={look.top} />
          {look.topStyle === "collar" && <path d="M84 179 L100 198 L88 208 L72 186Z M116 179 L100 198 L112 208 L128 186Z" fill={look.accent ?? "#F4EBDD"} />}
          {look.topStyle === "cardigan" && <path d="M84 180 Q100 200 116 180 L121 334 H79Z" fill={look.accent ?? "#F4EBDD"} />}
          {look.topStyle === "hoodie" && (
            <>
              <path d="M70 186 Q100 214 130 186 Q122 204 100 208 Q78 204 70 186Z M70 288 H130 L136 322 H64Z" fill="#000" opacity="0.18" />
              <path d="M92 206 V238 M108 206 V238" stroke={look.accent ?? "#F4EBDD"} strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}
          {look.topStyle === "apron" && (
            <g fill={look.accent ?? "#2A2523"}>
              <path d="M66 222 H134 V408 H66Z" />
              <path d="M66 222 L84 181 H90 L76 224Z M134 222 L116 181 H110 L124 224Z" />
            </g>
          )}
          <path d="M42 240 Q36 204 46 190 Q52 230 60 334 H52Z M158 240 Q164 204 154 190 Q148 230 140 334 H148Z" fill="#000" opacity="0.12" />
          {arm(leftArm, "left")}
          {arm(rightArm, "right")}

          {stance === "book" && (
            <g>
              <rect x="80" y="246" width="40" height="50" rx="3" fill="#6B2E26" />
              <path d="M100 258 V282 M91 266 H109" stroke="#E2B36B" strokeWidth="3" strokeLinecap="round" />
              <circle cx="82" cy="272" r="10.5" fill={look.skin} />
              <circle cx="118" cy="272" r="10.5" fill={look.skin} />
            </g>
          )}
          {stance === "cup" && (
            <g>
              <path d="M112 232 q-6 -10 0 -20 q6 -10 0 -20" fill="none" stroke="#F4EBDD" strokeWidth="2.5" strokeLinecap="round" className="animate-cm-steam" />
              <rect x="103" y="240" width="22" height="26" rx="4" fill="#F4EBDD" />
              <circle cx="124" cy="262" r="10.5" fill={look.skin} />
            </g>
          )}
        </g>

        <path d="M84 150 V181 Q100 196 116 181 V150Z" fill={look.shade} />
        <path d="M84 152 Q100 176 116 152 V163 Q100 184 84 163Z" fill="#000" opacity="0.2" />
        <Head look={look} mood={mood} speaking={false} facing={0} blinkDelay={delay} />
      </g>
    </svg>
  );
}
