import type { ReactNode } from "react";
import { MiniPerson } from "../Town";
import type { Look } from "../types";
import { ageOf, ROOMS, type LifeState, type Me, type RoomId } from "./model";

// Number 14, Juniper Lane, drawn with one wall taken off so the rooms can be
// seen. Everything the player builds or buys appears here.

const W = 900;
const H = 600;
const GROUND = 470;

/** Where each room is, for tapping on it. */
export const ROOM_BOXES: Record<RoomId, { x: number; y: number; w: number; h: number }> = {
  bedroom: { x: 170, y: 150, w: 240, h: 160 },
  second: { x: 410, y: 150, w: 240, h: 160 },
  living: { x: 170, y: 310, w: 240, h: 160 },
  kitchen: { x: 410, y: 310, w: 240, h: 160 },
  study: { x: 650, y: 330, w: 150, h: 140 },
  garden: { x: 0, y: 480, w: 900, h: 120 },
};

const WOOD = "#8A6A48";
const DARK = "#3A2A22";

/** One thing in the house, drawn where it lives. */
function thing(id: string, tint: string | undefined, state: LifeState): ReactNode {
  const c = tint ?? "#2F6F73";
  switch (id) {
    // Front room
    case "rug":
      return <ellipse cx="250" cy="464" rx="74" ry="7" fill={c} opacity="0.85" />;
    case "sofa":
      return (
        <g>
          <rect x="198" y="424" width="94" height="30" rx="8" fill={c} />
          <rect x="192" y="436" width="16" height="26" rx="6" fill={c} />
          <rect x="282" y="436" width="16" height="26" rx="6" fill={c} />
          <rect x="204" y="444" width="82" height="16" rx="5" fill="#fff" opacity="0.16" />
          <rect x="202" y="460" width="6" height="6" fill={DARK} />
          <rect x="282" y="460" width="6" height="6" fill={DARK} />
        </g>
      );
    case "lamp":
      return (
        <g>
          <rect x="305" y="392" width="3" height="72" fill={DARK} />
          <rect x="298" y="462" width="17" height="4" rx="2" fill={DARK} />
          <path d="M296 394 L300 372 H313 L317 394Z" fill="#F0D9A0" />
          <circle cx="306" cy="396" r="22" fill="#FFD796" opacity="0.18" className="animate-cm-twinkle" />
        </g>
      );
    case "books":
      return (
        <g>
          <rect x="325" y="366" width="74" height="4" fill={WOOD} />
          <rect x="325" y="340" width="74" height="4" fill={WOOD} />
          {["#7A4A3A", "#3F5A7A", "#55704F", "#B8862F", "#6B3F5A", "#2F6F73", "#A8553A"].map((colour, i) => (
            <rect key={i} x={329 + i * 9.5} y={346 + (i % 3) * 2} width="7" height={20 - (i % 3) * 2} fill={colour} />
          ))}
        </g>
      );
    case "plant":
      return (
        <g>
          <rect x="180" y="452" width="12" height="14" rx="2" fill="#A8553A" />
          <path d="M186 452 q-10 -16 -4 -26 M186 452 q8 -14 5 -24 M186 452 q0 -18 0 -30" stroke="#4E8447" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </g>
      );
    case "picture":
      return (
        <g>
          <rect x="262" y="342" width="44" height="34" fill={WOOD} />
          <rect x="266" y="346" width="36" height="26" fill="#C6E0EA" />
          <path d="M266 372 l12 -14 8 8 6 -5 10 11Z" fill="#6F9152" />
          <circle cx="294" cy="353" r="3" fill="#F2C14E" />
        </g>
      );
    case "piano":
      return (
        <g>
          <rect x="320" y="410" width="78" height="56" rx="3" fill="#2A1F1A" />
          <rect x="316" y="432" width="86" height="8" rx="2" fill="#3A2A22" />
          <rect x="322" y="434" width="74" height="4" fill="#F4EBDD" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <rect key={i} x={326 + i * 9} y="434" width="3" height="2.500" fill="#14110F" />
          ))}
        </g>
      );

    // Kitchen
    case "table":
      return (
        <g>
          {[466, 532].map((x) => (
            <g key={x}>
              <rect x={x - 4} y="430" width="4" height="36" fill={DARK} />
              <rect x={x - 6} y="446" width="14" height="4" fill={DARK} />
            </g>
          ))}
          <rect x="468" y="436" width="64" height="6" rx="2" fill={WOOD} />
          <rect x="474" y="442" width="5" height="24" fill={WOOD} />
          <rect x="521" y="442" width="5" height="24" fill={WOOD} />
        </g>
      );
    case "fridge":
      return (
        <g>
          <rect x="420" y="390" width="32" height="76" rx="3" fill="#DCE4E1" />
          <path d="M420 418 H452" stroke="#9FB0AE" strokeWidth="2" />
          <rect x="446" y="398" width="2.500" height="12" fill="#7F9090" />
          <rect x="446" y="426" width="2.500" height="16" fill="#7F9090" />
        </g>
      );
    case "shelves":
      return (
        <g>
          <rect x="572" y="374" width="70" height="4" fill={WOOD} />
          <rect x="572" y="350" width="70" height="4" fill={WOOD} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={578 + i * 16} y="360" width="10" height="14" rx="2" fill={["#E8DCC8", "#C4692F", "#7FB04F", "#E8DCC8"][i]} />
          ))}
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={586 + i * 20} cy="344" r="5" fill={["#B5574A", "#F0D9A0", "#3F5A7A"][i]} />
          ))}
        </g>
      );
    case "kettle":
      return (
        <g>
          <path d="M574 426 q0 -12 9 -12 t9 12Z" fill="#B9C4CC" />
          <path d="M592 420 l7 -3" stroke="#B9C4CC" strokeWidth="3" strokeLinecap="round" />
          <circle cx="583" cy="404" r="5" fill="#F4EBDD" opacity="0.4" className="animate-cm-steam" />
        </g>
      );
    case "flowers": {
      const x = state.rooms.kitchen.items.includes("table") ? 500 : 622;
      const y = state.rooms.kitchen.items.includes("table") ? 436 : 426;
      return (
        <g>
          <rect x={x - 4} y={y - 12} width="8" height="12" rx="2" fill="#9DB8D9" />
          {[-6, 0, 6].map((dx, i) => (
            <g key={dx}>
              <path d={`M${x} ${y - 12} L${x + dx} ${y - 26}`} stroke="#4E8447" strokeWidth="1.5" />
              <circle cx={x + dx} cy={y - 27} r="3.500" fill={["#E8622C", "#F2C14E", "#D9A7B5"][i]} />
            </g>
          ))}
        </g>
      );
    }
    case "clock":
      return (
        <g>
          <circle cx="440" cy="356" r="12" fill="#F4EBDD" stroke={DARK} strokeWidth="3" />
          <path d="M440 356 V348 M440 356 H446" stroke={DARK} strokeWidth="2" strokeLinecap="round" />
        </g>
      );

    // Bedroom
    case "bed":
      return (
        <g>
          <rect x="194" y="244" width="8" height="62" rx="2" fill={tint ?? WOOD} />
          <rect x="298" y="268" width="8" height="38" rx="2" fill={tint ?? WOOD} />
          <rect x="198" y="286" width="104" height="8" fill={tint ?? WOOD} />
          <rect x="202" y="272" width="98" height="16" rx="5" fill="#F4EBDD" />
          <rect x="204" y="266" width="26" height="12" rx="5" fill="#fff" />
        </g>
      );
    case "quilt":
      return <path d={state.rooms.bedroom.items.includes("bed") ? "M232 270 H300 V292 H232Z" : "M232 290 H300 V304 H232Z"} fill={c} />;
    case "wardrobe":
      return (
        <g>
          <rect x="346" y="212" width="54" height="94" rx="3" fill={WOOD} />
          <path d="M373 216 V302" stroke="#6B4630" strokeWidth="2" />
          <circle cx="368" cy="262" r="2.500" fill="#E2B36B" />
          <circle cx="378" cy="262" r="2.500" fill="#E2B36B" />
        </g>
      );
    case "bedside":
      return (
        <g>
          <rect x="312" y="284" width="22" height="22" rx="2" fill={WOOD} />
          <rect x="321.500" y="270" width="3" height="14" fill={DARK} />
          <path d="M314 272 L318 258 H328 L332 272Z" fill="#F0D9A0" />
          <circle cx="323" cy="270" r="16" fill="#FFD796" opacity="0.16" className="animate-cm-twinkle" />
        </g>
      );
    case "curtains":
      return (
        <g fill={c}>
          <path d="M208 180 h18 q-6 30 0 60 h-18Z" />
          <path d="M282 180 h-18 q6 30 0 60 h18Z" />
          <rect x="204" y="176" width="82" height="5" rx="2" fill={DARK} />
        </g>
      );

    // Second bedroom
    case "cot":
      return (
        <g>
          <rect x="425" y="270" width="46" height="4" fill="#F4EBDD" />
          <rect x="425" y="296" width="46" height="5" fill="#F4EBDD" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={426 + i * 8.600} y="272" width="2.500" height="26" fill="#F4EBDD" />
          ))}
          <rect x="425" y="268" width="3" height="38" fill="#F4EBDD" />
          <rect x="468" y="268" width="3" height="38" fill="#F4EBDD" />
        </g>
      );
    case "mobile":
      return (
        <g>
          <path d="M448 152 V196 M432 196 H464 M436 196 V208 M448 196 V214 M460 196 V206" stroke="#D9D2C4" strokeWidth="1.5" fill="none" />
          <g className="animate-cm-sway" style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}>
            <path d="M431 210 l5 -4 5 4 -5 3Z" fill="#E8622C" />
            <path d="M443 216 l5 -4 5 4 -5 3Z" fill="#F2C14E" />
            <path d="M455 208 l5 -4 5 4 -5 3Z" fill="#9DB8D9" />
          </g>
        </g>
      );
    case "toybox":
      return (
        <g>
          <rect x="478" y="288" width="36" height="18" rx="2" fill="#B5574A" />
          <rect x="476" y="284" width="40" height="6" rx="2" fill="#8A3F36" />
          <circle cx="488" cy="282" r="5" fill="#F2C14E" />
          <rect x="498" y="276" width="8" height="8" fill="#3F5A7A" />
        </g>
      );
    case "rocker":
      return (
        <g>
          <path d="M522 306 q18 8 40 0" stroke={WOOD} strokeWidth="4" fill="none" strokeLinecap="round" />
          <rect x="528" y="262" width="5" height="42" rx="2" fill={WOOD} />
          <rect x="528" y="284" width="28" height="6" rx="2" fill={WOOD} />
          <rect x="551" y="284" width="4" height="20" fill={WOOD} />
          <rect x="531" y="266" width="6" height="18" rx="3" fill="#D9A7B5" />
        </g>
      );
    case "bunk":
      return (
        <g>
          <rect x="580" y="222" width="5" height="84" fill={WOOD} />
          <rect x="640" y="222" width="5" height="84" fill={WOOD} />
          {[248, 290].map((y) => (
            <g key={y}>
              <rect x="582" y={y} width="62" height="6" fill={WOOD} />
              <rect x="586" y={y - 10} width="54" height="10" rx="3" fill={y === 248 ? "#9DB8D9" : "#F0D9A0"} />
            </g>
          ))}
          <path d="M624 254 V290 M632 254 V290 M624 266 H632 M624 278 H632" stroke={WOOD} strokeWidth="2" />
        </g>
      );

    // Study
    case "desk":
      return (
        <g>
          <rect x="662" y="430" width="62" height="5" rx="2" fill={WOOD} />
          <rect x="666" y="435" width="4" height="31" fill={WOOD} />
          <rect x="716" y="435" width="4" height="31" fill={WOOD} />
          <rect x="672" y="424" width="16" height="6" fill="#F4EBDD" />
          <path d="M706 430 V414 l-10 -6" stroke={DARK} strokeWidth="2.500" fill="none" strokeLinecap="round" />
          <circle cx="695" cy="410" r="12" fill="#FFD796" opacity="0.2" className="animate-cm-twinkle" />
        </g>
      );
    case "armchair":
      return (
        <g>
          <rect x="746" y="416" width="40" height="34" rx="9" fill={c} />
          <rect x="740" y="436" width="12" height="26" rx="5" fill={c} />
          <rect x="780" y="436" width="12" height="26" rx="5" fill={c} />
          <rect x="750" y="442" width="32" height="14" rx="4" fill="#fff" opacity="0.16" />
          <rect x="746" y="460" width="5" height="6" fill={DARK} />
          <rect x="781" y="460" width="5" height="6" fill={DARK} />
        </g>
      );
    case "studyshelf":
      return (
        <g>
          <rect x="662" y="392" width="56" height="4" fill={WOOD} />
          {["#6B3F5A", "#B8862F", "#2F6F73", "#7A4A3A", "#3F5A7A"].map((colour, i) => (
            <rect key={i} x={666 + i * 9.500} y={374 + (i % 2) * 3} width="7" height={18 - (i % 2) * 3} fill={colour} />
          ))}
        </g>
      );
    case "map":
      return (
        <g>
          <rect x="664" y="402" width="40" height="22" fill="#E8DCC8" stroke={WOOD} strokeWidth="2" />
          <path d="M670 414 q6 -8 12 -2 t14 -2" stroke="#6F9152" strokeWidth="3" fill="none" />
        </g>
      );

    // Garden
    case "tree":
      return (
        <g>
          <rect x="64" y="380" width="12" height="92" rx="3" fill="#6B4630" />
          <g className="animate-cm-sway" style={{ transformBox: "fill-box", transformOrigin: "50% 100%", animationDuration: "6s" }}>
            <circle cx="70" cy="346" r="48" fill="#3C6C3A" />
            <circle cx="56" cy="330" r="30" fill="#4E8447" />
            {[
              [46, 352],
              [84, 330],
              [70, 368],
              [96, 356],
            ].map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="4.500" fill="#C2553F" />
            ))}
          </g>
        </g>
      );
    case "swing":
      return (
        <g>
          <path d="M104 472 L122 400 L140 472" stroke={WOOD} strokeWidth="4" fill="none" strokeLinecap="round" />
          <g className="animate-cm-sway" style={{ transformBox: "fill-box", transformOrigin: "50% 0%", animationDuration: "3s" }}>
            <path d="M116 404 V446 M128 404 V446" stroke="#D9D2C4" strokeWidth="1.500" />
            <rect x="112" y="446" width="20" height="4" rx="1.500" fill="#B5574A" />
          </g>
        </g>
      );
    case "bench":
      return (
        <g>
          <rect x="812" y="450" width="68" height="6" rx="2" fill={WOOD} />
          <rect x="812" y="434" width="68" height="5" rx="2" fill={WOOD} />
          <path d="M818 456 V472 M874 456 V472 M818 434 V456 M874 434 V456" stroke="#6B4630" strokeWidth="3.500" />
        </g>
      );
    case "veg":
      return (
        <g>
          <rect x="190" y="496" width="150" height="40" rx="5" fill="#5C4030" />
          {[0, 1, 2].map((row) =>
            [0, 1, 2, 3, 4, 5, 6].map((i) => <circle key={`${row}-${i}`} cx={202 + i * 21} cy={504 + row * 12} r="4.500" fill={["#7FB04F", "#9BC46A", "#C2553F"][(row + i) % 3]} />)
          )}
        </g>
      );
    case "blooms":
      return (
        <g>
          {Array.from({ length: 14 }, (_, i) => (
            <g key={i}>
              <path d={`M${428 + i * 16} 490 v-10`} stroke="#4E8447" strokeWidth="2" />
              <circle cx={428 + i * 16} cy="478" r="4.500" fill={["#E8622C", "#F2C14E", "#D9A7B5", "#F4EBDD"][i % 4]} />
            </g>
          ))}
        </g>
      );
    case "fence":
      return (
        <g>
          <rect x="0" y="556" width="900" height="5" fill="#F4EBDD" />
          <rect x="0" y="572" width="900" height="5" fill="#F4EBDD" />
          {Array.from({ length: 45 }, (_, i) => (
            <path key={i} d={`M${6 + i * 20} 584 V550 l5 -6 5 6 V584Z`} fill="#F4EBDD" />
          ))}
        </g>
      );
    default:
      return null;
  }
}

function Window({ x, y, w = 60, h = 50, dusk }: { x: number; y: number; w?: number; h?: number; dusk: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={dusk ? "#2B3A66" : "#BFE0EE"} style={{ transition: "fill 1.2s ease" }} />
      <path d={`M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}`} stroke="#F4EBDD" strokeWidth="3" />
      <rect x={x} y={y} width={w} height={h} fill="none" stroke="#F4EBDD" strokeWidth="4" />
    </g>
  );
}

/** The house itself. `dusk` draws it in the evening, for autumn and winter. */
export function HouseArt({ state, dusk = false, className = "" }: { state: LifeState; dusk?: boolean; className?: string }) {
  const { rooms, exterior } = state;
  const shade = dusk ? 0.3 : 0;
  const trim = exterior.trim;
  const draw = (room: RoomId) => (rooms[room].built ? rooms[room].items.map((id) => <g key={id}>{thing(id, rooms[room].tints[id], state)}</g>) : null);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true" className={`block h-full w-full ${className}`}>
      <defs>
        <linearGradient id="life-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={dusk ? "#1B2440" : "#9CCBE0"} />
          <stop offset="1" stopColor={dusk ? "#C97A5A" : "#DDEFE9"} />
        </linearGradient>
      </defs>
      <rect width={W} height={GROUND} fill="url(#life-sky)" />
      <circle cx="800" cy="90" r="34" fill={dusk ? "#F4EBDD" : "#FFE39A"} opacity={dusk ? 0.85 : 1} />
      <rect y={GROUND} width={W} height={H - GROUND} fill={dusk ? "#33503F" : "#7FA05E"} style={{ transition: "fill 1.2s ease" }} />
      <ellipse cx="450" cy="600" rx="520" ry="70" fill={dusk ? "#2B4436" : "#6F9152"} />

      {draw("garden")?.filter((_, index) => rooms.garden.items[index] === "tree")}

      {/* Back walls */}
      <rect x="170" y="150" width="240" height="160" fill={rooms.bedroom.wall} />
      <rect x="410" y="150" width="240" height="160" fill={rooms.second.built ? rooms.second.wall : "#4A3F3A"} />
      <rect x="170" y="310" width="240" height="160" fill={rooms.living.wall} />
      <rect x="410" y="310" width="240" height="160" fill={rooms.kitchen.wall} />
      {rooms.study.built && <path d="M650 330 L800 360 V470 H650Z" fill={rooms.study.wall} />}
      {/* Skirting and floors */}
      <rect x="170" y="462" width="480" height="8" fill="#8A6A48" />
      <rect x="170" y="302" width="480" height="8" fill="#8A6A48" />
      {rooms.study.built && <rect x="650" y="462" width="150" height="8" fill="#8A6A48" />}

      {/* Windows that come with the house */}
      <Window x={196} y={340} w={52} h={48} dusk={dusk} />
      <Window x={470} y={338} dusk={dusk} />
      <Window x={215} y={184} dusk={dusk} />
      {rooms.second.built && <Window x={500} y={184} dusk={dusk} />}
      {rooms.study.built && <Window x={738} y={378} w={46} h={34} dusk={dusk} />}

      {/* What every kitchen and bedroom starts with */}
      <rect x="560" y="428" width="86" height="38" rx="2" fill="#B9A58A" />
      <rect x="556" y="424" width="94" height="6" rx="2" fill="#6B4630" />
      <rect x="604" y="434" width="36" height="26" rx="2" fill="#3A2A22" opacity="0.55" />
      {!rooms.bedroom.items.includes("bed") && <rect x="204" y="292" width="96" height="14" rx="5" fill="#F4EBDD" />}
      {!rooms.second.built && (
        <g opacity="0.8">
          <rect x="440" y="276" width="34" height="30" fill="#8A6A48" />
          <rect x="482" y="286" width="28" height="20" fill="#A6805A" />
          <rect x="446" y="254" width="26" height="22" fill="#A6805A" />
          <path d="M430 150 L530 310 M650 150 L550 310" stroke="#3A2A22" strokeWidth="4" opacity="0.5" />
        </g>
      )}

      {draw("living")}
      {draw("kitchen")}
      {draw("bedroom")}
      {draw("second")}
      {draw("study")}

      {/* Evening falls inside as well as out */}
      <rect x="170" y="150" width="480" height="320" fill="#141126" opacity={shade} style={{ transition: "opacity 1.2s ease" }} />

      {/* The frame of the house */}
      <path d="M150 154 L410 46 L670 154Z" fill={exterior.roof} />
      <rect x="520" y="62" width="30" height="50" fill="#8A5A44" />
      <rect x="516" y="56" width="38" height="8" fill="#6B4630" />
      <circle cx="535" cy="44" r="7" fill="#F4EBDD" opacity="0.5" className="animate-cm-steam" />
      <g fill={trim}>
        <rect x="166" y="150" width="8" height="320" />
        <rect x="646" y="150" width="8" height="320" />
        <rect x="406" y="150" width="8" height="118" />
        <rect x="406" y="310" width="8" height="118" />
        <rect x="166" y="146" width="488" height="8" />
      </g>
      {rooms.study.built && (
        <g>
          <path d="M646 322 L812 356 V366 L646 332Z" fill={exterior.roof} />
          <rect x="796" y="360" width="8" height="110" fill={trim} />
        </g>
      )}

      {draw("garden")?.filter((_, index) => rooms.garden.items[index] !== "tree")}
    </svg>
  );
}

interface Standing {
  key: string;
  look: Look;
  x: number;
  floor: number;
  scale: number;
}

/** Looks for the children: their parent's colouring, in smaller clothes. */
function childLook(me: Me, index: number): Look {
  return { skin: me.look.skin, shade: me.look.shade, hair: me.look.hair, hairStyle: index % 2 ? "puff" : "short", top: ["#E0B84C", "#C2553F", "#4F86A8"][index % 3] };
}

/** The house with the family in it, and (when decorating) rooms that can be tapped. */
export function HouseView({
  state,
  me,
  partnerLook,
  selected,
  onSelect,
}: {
  state: LifeState;
  me: Me;
  partnerLook: Look | null;
  selected?: RoomId | null;
  onSelect?: (room: RoomId) => void;
}) {
  const dusk = state.turn % 4 >= 2;
  const people: Standing[] = [{ key: "you", look: me.look, x: 250, floor: 466, scale: 1 }];
  if (state.stage === "married" && partnerLook) people.push({ key: "partner", look: partnerLook, x: 505, floor: 466, scale: 1 });
  const spots: [number, number][] = state.rooms.second.built
    ? [
        [545, 306],
        [330, 306],
        [372, 466],
      ]
    : [
        [330, 306],
        [372, 466],
        [600, 466],
      ];
  state.children.forEach((child, index) => {
    const age = ageOf(state, child);
    people.push({ key: `child-${index}`, look: childLook(me, index), x: spots[index % 3][0], floor: spots[index % 3][1], scale: age < 4 ? 0.4 : age < 20 ? 0.58 : 0.78 });
  });

  return (
    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-cm-dusk shadow-2xl shadow-black/40 ring-1 ring-white/10">
      <HouseArt state={state} dusk={dusk} />
      {people.map((person) => (
        <div
          key={person.key}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full"
          style={{ left: `${(person.x / W) * 100}%`, top: `${(person.floor / H) * 100}%`, width: `${6 * person.scale}%`, height: `${15 * person.scale}%`, filter: dusk ? "brightness(0.8)" : undefined }}
        >
          <MiniPerson look={person.look} walking={false} className="h-full w-full" />
        </div>
      ))}
      {onSelect &&
        (Object.keys(ROOM_BOXES) as RoomId[]).map((id) => {
          const box = ROOM_BOXES[id];
          const on = selected === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              aria-pressed={on}
              aria-label={`${ROOMS[id].name}${state.rooms[id].built ? "" : ", not built yet"}`}
              className={`absolute rounded-md border-2 transition ${on ? "border-cm-ember bg-cm-ember/10" : "border-transparent hover:border-white/70 hover:bg-white/10"}`}
              style={{ left: `${(box.x / W) * 100}%`, top: `${(box.y / H) * 100}%`, width: `${(box.w / W) * 100}%`, height: `${(box.h / H) * 100}%` }}
            >
              <span className={`absolute left-1 top-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${on ? "bg-cm-ember text-white" : "bg-cm-night/70 text-cm-cream"}`}>
                {ROOMS[id].name}
                {!state.rooms[id].built && " · build"}
              </span>
            </button>
          );
        })}
    </div>
  );
}
