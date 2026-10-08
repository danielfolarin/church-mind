import { useEffect, useMemo, useRef } from "react";
import { HairBack, Head, Neckwear } from "./Figure";
import type { Look, Manner, Mood, Stance } from "./types";

// Full-body characters built on a skeleton.
//
//   Hips ── Spine ── Head
//    │        ├── RightArm ── RightForeArm ── RightHand
//    │        └── LeftArm ── LeftForeArm ── LeftHand
//    ├── RightUpLeg ── RightLeg ── RightFoot
//    └── LeftUpLeg ── LeftLeg ── LeftFoot
//
// Every bone turns about the joint where it meets its parent, so a pose is
// just a set of joint angles and movement is those angles changing over time.
// A character's `build` sets the size of the frame, their `stance` sets the
// pose, and their `manner` sets how the joints move while they stand.
//
// "Right" and "left" are the character's own, as on the rig: their right arm
// is on the viewer's left.

const TAU = Math.PI * 2;

// Joint positions and bone lengths, in the figure's own units.
const FLOOR = 498;
const HIPS: [number, number] = [100, 330];
const SHOULDER_Y = 204;
const NECK: [number, number] = [100, 170];
const UPPER_ARM = 66;
const FOREARM = 62;
const THIGH = 86;
const SHIN = 82;

/** [shoulder, elbow] in degrees. Shoulder: away from the body. Elbow: negative bends the forearm in front. */
type ArmPose = [number, number];

const POSES: Record<Stance, { right: ArmPose; left: ArmPose; handsHidden?: boolean }> = {
  relaxed: { right: [8, -8], left: [8, -8] },
  akimbo: { right: [38, -100], left: [38, -100] },
  hip: { right: [38, -100], left: [8, -8] },
  pockets: { right: [13, -28], left: [13, -28], handsHidden: true },
  clasped: { right: [12, -52], left: [12, -52] },
  book: { right: [10, -80], left: [10, -80] },
  cup: { right: [8, -8], left: [10, -114] },
  wave: { right: [8, -8], left: [55, 112] },
  open: { right: [8, -8], left: [18, 44] },
};

/** How big and how fast each part moves: [size, cycles per second]. */
interface Motion {
  /** The upper body leaning from the hips, in degrees. */
  sway: [number, number];
  /** Rising and settling with the breath, as a fraction of height. */
  breathe: [number, number];
  /** The head tilting, in degrees. */
  head: [number, number];
  /** Both arms drifting at the shoulder, in degrees. */
  arms: [number, number];
  /** The forearm of whichever hand is doing something: waving, sipping, offering. */
  gesture: [number, number];
  /** Long hair following the head, in degrees. */
  hair: [number, number];
  /** Bouncing on the toes, in units. */
  hop?: number;
  /** One foot tapping. */
  tap?: boolean;
}

const MANNERS: Record<Manner, Motion> = {
  calm: { sway: [0.8, 0.1], breathe: [0.006, 0.16], head: [2.2, 0.11], arms: [0.8, 0.1], gesture: [3, 0.12], hair: [2, 0.1] },
  confident: { sway: [1, 0.16], breathe: [0.008, 0.2], head: [2, 0.14], arms: [1.6, 0.16], gesture: [4, 0.16], hair: [3, 0.16], tap: true },
  lively: { sway: [2.4, 0.5], breathe: [0.01, 0.5], head: [4.5, 0.5], arms: [4, 0.5], gesture: [18, 1.6], hair: [8, 0.5], hop: 5 },
  graceful: { sway: [2.6, 0.2], breathe: [0.007, 0.2], head: [4, 0.2], arms: [5, 0.2], gesture: [8, 0.2], hair: [11, 0.2] },
  easy: { sway: [1.6, 0.13], breathe: [0.012, 0.26], head: [2.4, 0.13], arms: [1.2, 0.13], gesture: [4, 0.13], hair: [4, 0.13] },
  brisk: { sway: [1.3, 0.3], breathe: [0.008, 0.3], head: [2.6, 0.3], arms: [2, 0.3], gesture: [12, 0.14], hair: [7, 0.3] },
  steady: { sway: [0.6, 0.09], breathe: [0.007, 0.15], head: [3, 0.2], arms: [1.2, 0.09], gesture: [2, 0.1], hair: [1.5, 0.09] },
  warm: { sway: [1.5, 0.15], breathe: [0.008, 0.18], head: [3.2, 0.15], arms: [2, 0.15], gesture: [9, 0.2], hair: [4, 0.15] },
};

interface Frame {
  root: string;
  spine: string;
  head: string;
  hair: string;
  rightArm: string;
  rightForeArm: string;
  leftArm: string;
  leftForeArm: string;
  rightUpLeg: string;
  leftUpLeg: string;
  leftFoot: string;
}

/**
 * A whole person, standing, built on the skeleton above. `look.build` shapes
 * the frame, `look.stance` sets the pose and `look.manner` sets the movement.
 */
export function FullFigure({ look, mood = "warm", delay = "0s", className = "" }: { look: Look; mood?: Mood; /** Offsets the movement so a row of people isn't in step. */ delay?: string; className?: string }) {
  const stance = look.stance ?? "relaxed";
  const manner = look.manner ?? "easy";
  const pose = POSES[stance];
  const height = look.build?.height ?? 1;
  const shoulders = look.build?.shoulders ?? (look.slim ? 92 : 110);
  const hips = look.build?.hips ?? (look.slim ? 84 : 88);
  const limbs = look.build?.limbs ?? (look.slim ? 18 : 21);
  const waist = Math.min(shoulders, hips) * 0.86;
  const shoulderX = shoulders / 2 - 5;
  const hipX = hips / 4;
  const offset = Number.parseFloat(delay) || 0;

  const legColour = look.skirt ? look.skin : (look.legs ?? "#2A2F3A");
  // Trousers fill out to the hips; bare legs under a skirt are slimmer.
  const wide = Boolean(look.wideLegs) && !look.skirt;
  const thigh = look.skirt ? limbs * 0.9 : hips / 2;
  const knee = look.skirt ? limbs * 0.8 : wide ? hips / 2 : limbs * 1.05;
  const ankle = look.skirt ? limbs * 0.66 : wide ? hips * 0.56 : limbs * 0.86;
  const shoes = look.shoes ?? "#1A1614";
  const hem = look.longSkirt ? 476 : 424;

  // Where every joint is at a given moment.
  const frameAt = useMemo(() => {
    const motion = MANNERS[manner];
    return (time: number): Frame => {
      const t = time - offset;
      const wave = ([size, speed]: [number, number], phase = 0) => size * Math.sin(TAU * speed * t + phase);
      const lean = wave(motion.sway);
      const tilt = wave(motion.head, 1.1) - lean * 0.5;
      const drift = wave(motion.arms, 0.6);
      const gesture = wave(motion.gesture);
      const lift = motion.hop ? -Math.abs(Math.sin(TAU * motion.sway[1] * t)) * motion.hop : 0;
      const tap = motion.tap ? Math.max(0, Math.sin(TAU * 1.7 * t)) * -18 : 0;
      // The left hand is the one that waves, sips or offers; other poses only stir.
      const busy = stance === "wave" || stance === "cup" || stance === "open";
      return {
        root: `translate(100 ${FLOOR + lift}) scale(${height} ${height * (1 + wave(motion.breathe))}) translate(-100 ${-FLOOR})`,
        spine: `rotate(${lean} ${HIPS[0]} ${HIPS[1]})`,
        head: `rotate(${tilt} ${NECK[0]} ${NECK[1]})`,
        hair: `rotate(${tilt * 0.4 + wave(motion.hair, -1.2)} 100 70)`,
        rightArm: `translate(${100 - shoulderX} ${SHOULDER_Y}) rotate(${pose.right[0] + drift})`,
        rightForeArm: `translate(0 ${UPPER_ARM}) rotate(${pose.right[1] + (busy ? 0 : gesture * 0.4)})`,
        leftArm: `translate(${100 + shoulderX} ${SHOULDER_Y}) rotate(${-(pose.left[0] - drift)})`,
        leftForeArm: `translate(0 ${UPPER_ARM}) rotate(${-(pose.left[1] + (busy ? gesture : gesture * 0.4))})`,
        rightUpLeg: `translate(${100 - hipX} ${HIPS[1]}) rotate(${1.5 - lean * 0.25})`,
        leftUpLeg: `translate(${100 + hipX} ${HIPS[1]}) rotate(${-1.5 - lean * 0.25})`,
        leftFoot: `translate(0 ${SHIN}) rotate(${tap})`,
      };
    };
  }, [manner, stance, pose, height, shoulderX, hipX, offset]);

  const bones = useRef<Partial<Record<keyof Frame, SVGGElement | null>>>({});
  const bone = (name: keyof Frame) => (element: SVGGElement | null) => {
    bones.current[name] = element;
  };
  const rest = frameAt(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const step = (now: number) => {
      const next = frameAt(now / 1000);
      for (const name of Object.keys(next) as (keyof Frame)[]) bones.current[name]?.setAttribute("transform", next[name]);
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [frameAt]);

  const sleeve = { stroke: look.top, strokeWidth: limbs, strokeLinecap: "round" as const };
  const arm = (side: "right" | "left") => {
    const [shoulder, elbow] = pose[side];
    // Things held in the hand stay upright whatever the arm is doing.
    const upright = (side === "right" ? -1 : 1) * (shoulder + elbow);
    return (
      <g ref={bone(`${side}Arm`)} transform={rest[`${side}Arm`]}>
        <line x1="0" y1="0" x2="0" y2={UPPER_ARM} {...sleeve} />
        <g ref={bone(`${side}ForeArm`)} transform={rest[`${side}ForeArm`]}>
          <line x1="0" y1="0" x2="0" y2={FOREARM} {...sleeve} />
          {stance === "book" && side === "right" && (
            <g transform={`translate(0 ${FOREARM}) rotate(${upright})`}>
              <rect x="-2" y="-34" width="40" height="52" rx="3" fill="#6B2E26" />
              <path d="M18 -22 V4 M9 -14 H27" stroke="#E2B36B" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}
          {stance === "cup" && side === "left" && (
            <g transform={`translate(0 ${FOREARM}) rotate(${upright})`}>
              <path d="M-4 -34 q-6 -10 0 -20 q6 -10 0 -20" fill="none" stroke="#F4EBDD" strokeWidth="2.5" strokeLinecap="round" className="animate-cm-steam" />
              <rect x="-16" y="-26" width="22" height="26" rx="4" fill="#F4EBDD" />
            </g>
          )}
          {!pose.handsHidden && <circle cx="0" cy={FOREARM} r={limbs * 0.5} fill={look.skin} />}
        </g>
      </g>
    );
  };

  const leg = (side: "right" | "left") => {
    const out = side === "right" ? -1 : 1;
    return (
      <g ref={bone(`${side}UpLeg`)} transform={rest[`${side}UpLeg`]}>
        <path d={`M${-thigh / 2} 0 H${thigh / 2} L${knee / 2} ${THIGH} H${-knee / 2}Z`} fill={legColour} />
        <g transform={`translate(0 ${THIGH})`}>
          <circle r={knee / 2} fill={legColour} />
          <path d={`M${-knee / 2} 0 H${knee / 2} L${ankle / 2} ${SHIN} H${-ankle / 2}Z`} fill={legColour} />
          <g ref={side === "left" ? bone("leftFoot") : undefined} transform={side === "left" ? rest.leftFoot : `translate(0 ${SHIN})`}>
            <ellipse cx={out * 5} cy="4" rx="18" ry="8" fill={shoes} />
          </g>
        </g>
      </g>
    );
  };

  const half = shoulders / 2;
  const torso = `M${100 - half} 192 L84 179 Q100 192 116 179 L${100 + half} 192 Q${100 + half + 7} 206 ${100 + waist / 2} 276 L${100 + hips / 2} 336 H${100 - hips / 2} L${100 - waist / 2} 276 Q${100 - half - 7} 206 ${100 - half} 192Z`;

  return (
    <svg viewBox="-40 0 280 524" preserveAspectRatio="xMidYMax meet" aria-hidden="true" className={`block ${className}`}>
      <ellipse cx="100" cy={FLOOR + 8} rx={58 * height} ry="8" fill="#000" opacity="0.3" />
      <g ref={bone("root")} transform={rest.root}>
        {/* Hips → legs → feet */}
        {leg("right")}
        {leg("left")}
        {look.skirt && <path d={`M${100 - hips / 2 - 2} 324 H${100 + hips / 2 + 2} L${100 + hips / 2 + (look.longSkirt ? 12 : 18)} ${hem} H${100 - hips / 2 - (look.longSkirt ? 12 : 18)}Z`} fill={look.skirt} />}

        {/* Hips → spine → arms and head */}
        <g ref={bone("spine")} transform={rest.spine}>
          <g ref={bone("hair")} transform={rest.hair}>
            <HairBack look={look} />
          </g>
          <path d={torso} fill={look.top} />
          {look.topStyle === "collar" && <path d="M84 179 L100 198 L88 208 L72 186Z M116 179 L100 198 L112 208 L128 186Z" fill={look.accent ?? "#F4EBDD"} />}
          {look.topStyle === "cardigan" && <path d="M84 180 Q100 200 116 180 L120 336 H80Z" fill={look.accent ?? "#F4EBDD"} />}
          {look.topStyle === "hoodie" && (
            <>
              <path d="M70 186 Q100 214 130 186 Q122 204 100 208 Q78 204 70 186Z M72 290 H128 L133 322 H67Z" fill="#000" opacity="0.18" />
              <path d="M92 206 V238 M108 206 V238" stroke={look.accent ?? "#F4EBDD"} strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}
          {look.topStyle === "apron" && (
            <g fill={look.accent ?? "#2A2523"}>
              <path d={`M${100 - waist / 2 + 2} 222 H${100 + waist / 2 - 2} V408 H${100 - waist / 2 + 2}Z`} />
              <path d={`M${100 - waist / 2 + 2} 222 L84 181 H90 L${100 - waist / 2 + 12} 224Z M${100 + waist / 2 - 2} 222 L116 181 H110 L${100 + waist / 2 - 12} 224Z`} />
            </g>
          )}
          {arm("right")}
          {arm("left")}

          <path d="M84 150 V181 Q100 196 116 181 V150Z" fill={look.shade} />
          <path d="M84 152 Q100 176 116 152 V163 Q100 184 84 163Z" fill="#000" opacity="0.2" />
          <Neckwear look={look} />
          <g ref={bone("head")} transform={rest.head}>
            <Head look={look} mood={mood} speaking={false} facing={0} blinkDelay={delay} />
          </g>
        </g>
      </g>
    </svg>
  );
}
