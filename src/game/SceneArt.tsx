import type { ReactNode } from "react";
import type { SettingId } from "./types";

// Scene illustrations drawn in SVG, so the game needs no image files.
// Each one is a 800×500 canvas that crops to fill whatever box it is given.

const TWINKLE_DELAYS = ["0s", "1.3s", "2.1s", "0.7s", "2.8s", "1.8s", "3.4s", "0.4s", "2.5s"];

function Twinkle({ cx, cy, r, index, fill = "#FFE0AE" }: { cx: number; cy: number; r: number; index: number; fill?: string }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={fill}
      className="animate-cm-twinkle"
      style={{ animationDelay: TWINKLE_DELAYS[index % TWINKLE_DELAYS.length] }}
    />
  );
}

function Steam({ x, y, delay = "0s" }: { x: number; y: number; delay?: string }) {
  return (
    <path
      d={`M${x} ${y} q-7 -12 0 -24 q7 -12 0 -24`}
      fill="none"
      stroke="#F4EBDD"
      strokeWidth="2.5"
      strokeLinecap="round"
      className="animate-cm-steam"
      style={{ animationDelay: delay }}
    />
  );
}

function Garden() {
  const bulbs = [
    [40, 250], [112, 266], [184, 275], [256, 276], [328, 269], [400, 255],
    [472, 240], [544, 233], [616, 232], [688, 237], [760, 250],
  ];
  const tepee = (x: number) => (
    <g stroke="#120C12" strokeWidth="3" strokeLinecap="round">
      <path d={`M${x - 34} 410 L${x} 286 M${x + 34} 410 L${x} 286 M${x} 410 L${x} 286`} />
      <g fill="#1B1420" stroke="none">
        <ellipse cx={x - 16} cy={352} rx="11" ry="6" transform={`rotate(-30 ${x - 16} 352)`} />
        <ellipse cx={x + 14} cy={336} rx="10" ry="5" transform={`rotate(28 ${x + 14} 336)`} />
        <ellipse cx={x - 6} cy={318} rx="8" ry="4" transform={`rotate(-20 ${x - 6} 318)`} />
        <ellipse cx={x + 20} cy={380} rx="12" ry="6" transform={`rotate(24 ${x + 20} 380)`} />
        <ellipse cx={x - 24} cy={388} rx="11" ry="5" transform={`rotate(-26 ${x - 24} 388)`} />
      </g>
    </g>
  );

  return (
    <>
      <defs>
        <linearGradient id="garden-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1C1930" />
          <stop offset="0.4" stopColor="#5A3248" />
          <stop offset="0.62" stopColor="#C4623F" />
          <stop offset="0.74" stopColor="#F0AC63" />
        </linearGradient>
        <radialGradient id="garden-sun">
          <stop offset="0" stopColor="#FFE2A8" stopOpacity="0.95" />
          <stop offset="0.25" stopColor="#FBC47A" stopOpacity="0.5" />
          <stop offset="1" stopColor="#F0AC63" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="500" fill="url(#garden-sky)" />
      <circle cx="560" cy="318" r="190" fill="url(#garden-sun)" />
      <circle cx="560" cy="318" r="34" fill="#FFE7B8" />
      <path d="M0 318 Q140 262 300 300 T580 296 T800 310 V500 H0Z" fill="#4A2C3A" />
      <path d="M0 356 Q200 318 420 348 T800 338 V500 H0Z" fill="#241821" />
      <g fill="#150F15">
        {[30, 110, 190, 270, 350, 430, 510, 590, 670, 750].map((x) => (
          <rect key={x} x={x} y="342" width="5" height="46" rx="2" />
        ))}
        <rect x="0" y="352" width="800" height="3" />
        <rect x="0" y="370" width="800" height="3" />
      </g>
      {tepee(150)}
      {tepee(290)}
      {tepee(650)}
      <g fill="#110B11">
        <rect x="60" y="408" width="330" height="40" rx="4" />
        <rect x="470" y="408" width="290" height="40" rx="4" />
      </g>
      <g fill="#1B1420">
        {[500, 540, 580, 700, 730].map((x, i) => (
          <path key={x} d={`M${x} 410 q-10 -${18 + i * 2} -18 -22 q14 0 18 14 q4 -18 20 -20 q-12 6 -20 28Z`} />
        ))}
      </g>
      <rect y="446" width="800" height="54" fill="#0E090D" />
      <path d="M40 250 Q220 300 400 255 T760 250" fill="none" stroke="#150F15" strokeWidth="1.5" />
      {bulbs.map(([cx, cy], i) => (
        <g key={cx}>
          <circle cx={cx} cy={cy + 5} r="13" fill="#FFD9A0" opacity="0.12" />
          <Twinkle cx={cx} cy={cy + 5} r={4} index={i} />
        </g>
      ))}
    </>
  );
}

function Cafe() {
  const lamp = (x: number, drop: number, index: number) => (
    <g>
      <line x1={x} y1="0" x2={x} y2={drop} stroke="#0E0907" strokeWidth="2" />
      <circle cx={x} cy={drop + 30} r="62" fill="url(#cafe-glow)" className="animate-cm-twinkle" style={{ animationDelay: TWINKLE_DELAYS[index] }} />
      <path d={`M${x - 22} ${drop + 24} L${x - 9} ${drop} H${x + 9} L${x + 22} ${drop + 24}Z`} fill="#0E0907" />
      <ellipse cx={x} cy={drop + 25} rx="18" ry="4" fill="#FFDFA6" />
    </g>
  );

  return (
    <>
      <defs>
        <linearGradient id="cafe-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2E2019" />
          <stop offset="1" stopColor="#1A120E" />
        </linearGradient>
        <linearGradient id="cafe-window" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F9D697" />
          <stop offset="1" stopColor="#E69457" />
        </linearGradient>
        <radialGradient id="cafe-glow">
          <stop offset="0" stopColor="#FFD08A" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFD08A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cafe-spill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F9D697" stopOpacity="0.22" />
          <stop offset="1" stopColor="#F9D697" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#cafe-wall)" />
      <rect x="70" y="60" width="440" height="270" rx="6" fill="url(#cafe-window)" />
      <g fill="#C97643" opacity="0.55">
        <rect x="70" y="190" width="90" height="140" />
        <rect x="160" y="150" width="120" height="180" />
        <rect x="280" y="210" width="80" height="120" />
        <rect x="360" y="170" width="150" height="160" />
      </g>
      <g fill="#FCE4B4" opacity="0.7">
        {[[182, 176], [214, 176], [246, 176], [182, 214], [246, 214], [386, 196], [426, 196], [466, 196], [386, 240], [466, 240]].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="14" height="20" rx="1" />
        ))}
      </g>
      <g fill="#1A120E">
        <rect x="213" y="60" width="7" height="270" />
        <rect x="360" y="60" width="7" height="270" />
        <rect x="70" y="150" width="440" height="6" />
      </g>
      <rect x="62" y="52" width="456" height="286" rx="8" fill="none" stroke="#120C09" strokeWidth="12" />
      <path d="M70 338 H510 L640 500 H-40Z" fill="url(#cafe-spill)" />
      <rect y="408" width="800" height="92" fill="#130D0A" opacity="0.75" />
      <rect x="560" y="300" width="240" height="200" fill="#0F0A08" />
      <rect x="548" y="292" width="252" height="12" rx="3" fill="#3B291F" />
      <rect x="640" y="222" width="92" height="70" rx="6" fill="#0F0A08" />
      <rect x="652" y="236" width="68" height="8" rx="2" fill="#3B291F" />
      <rect x="586" y="272" width="22" height="20" rx="3" fill="#F4EBDD" opacity="0.85" />
      <Steam x={597} y={264} />
      <Steam x={604} y={266} delay="2.4s" />
      {lamp(590, 96, 0)}
      {lamp(676, 132, 3)}
      {lamp(756, 84, 5)}
      <ellipse cx="270" cy="446" rx="170" ry="20" fill="#0C0806" />
      <rect x="262" y="446" width="16" height="54" fill="#0C0806" />
      <rect x="222" y="418" width="24" height="20" rx="3" fill="#F4EBDD" opacity="0.8" />
      <rect x="300" y="420" width="22" height="18" rx="3" fill="#E8622C" opacity="0.85" />
      <Steam x={234} y={410} delay="1.2s" />
      <path d="M40 500 V396 q0 -14 14 -14 h44 q14 0 14 14 V500Z" fill="#0A0605" />
      <path d="M430 500 V402 q0 -14 14 -14 h44 q14 0 14 14 V500Z" fill="#0A0605" />
    </>
  );
}

function Kitchen() {
  return (
    <>
      <defs>
        <linearGradient id="kitchen-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2F2420" />
          <stop offset="1" stopColor="#1B1411" />
        </linearGradient>
        <linearGradient id="kitchen-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#151C36" />
          <stop offset="1" stopColor="#34406A" />
        </linearGradient>
        <linearGradient id="kitchen-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD796" stopOpacity="0.34" />
          <stop offset="1" stopColor="#FFD796" stopOpacity="0.02" />
        </linearGradient>
        <radialGradient id="kitchen-glow">
          <stop offset="0" stopColor="#FFD796" stopOpacity="0.6" />
          <stop offset="1" stopColor="#FFD796" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="500" fill="url(#kitchen-wall)" />
      <rect x="70" y="80" width="220" height="210" fill="url(#kitchen-night)" />
      <circle cx="232" cy="134" r="17" fill="#F4EBDD" opacity="0.92" />
      <circle cx="232" cy="134" r="40" fill="#F4EBDD" opacity="0.08" />
      {[[104, 118], [150, 160], [120, 216], [196, 232], [262, 204]].map(([cx, cy], i) => (
        <Twinkle key={cx} cx={cx} cy={cy} r={1.6} index={i} fill="#F4EBDD" />
      ))}
      <g fill="#120D0A">
        <rect x="176" y="80" width="8" height="210" />
        <rect x="70" y="182" width="220" height="7" />
      </g>
      <rect x="62" y="72" width="236" height="226" rx="4" fill="none" stroke="#120D0A" strokeWidth="12" />
      <rect x="50" y="296" width="260" height="12" rx="3" fill="#3A2A21" />
      <rect x="92" y="282" width="62" height="14" rx="2" fill="#6B3423" />
      <rect x="96" y="285" width="54" height="3" fill="#E2B36B" opacity="0.6" />
      <path d="M44 64 q30 120 -6 240 h44 q-22 -120 14 -240Z" fill="#4A352B" />
      <path d="M316 64 q-30 120 6 240 h-44 q22 -120 -14 -240Z" fill="#4A352B" />
      <rect x="34" y="56" width="292" height="10" rx="5" fill="#120D0A" />
      <rect x="440" y="168" width="310" height="8" rx="3" fill="#120D0A" />
      <g fill="#150F0C" stroke="#3A2A21" strokeWidth="1.5">
        <rect x="462" y="124" width="30" height="44" rx="5" />
        <rect x="504" y="136" width="26" height="32" rx="5" />
        <rect x="544" y="116" width="32" height="52" rx="5" />
        <rect x="690" y="130" width="36" height="38" rx="5" />
      </g>
      <path d="M632 168 v-18 q-22 -6 -24 -30 q20 4 24 22 q0 -26 22 -36 q2 26 -16 40 v22Z" fill="#33402F" />
      <line x1="520" y1="0" x2="520" y2="196" stroke="#0F0B09" strokeWidth="2" />
      <path d="M492 228 L792 480 H248Z" fill="url(#kitchen-cone)" />
      <circle cx="520" cy="232" r="80" fill="url(#kitchen-glow)" className="animate-cm-twinkle" />
      <path d="M476 228 L506 194 H534 L564 228Z" fill="#0F0B09" />
      <ellipse cx="520" cy="229" rx="38" ry="5" fill="#FFE1AC" />
      <rect x="250" y="404" width="540" height="16" rx="4" fill="#5A4132" />
      <rect x="250" y="418" width="540" height="6" fill="#2A1D16" />
      <rect x="286" y="424" width="14" height="76" fill="#17100C" />
      <rect x="740" y="424" width="14" height="76" fill="#17100C" />
      <g fill="#120D0A">
        <ellipse cx="520" cy="382" rx="40" ry="26" />
        <rect x="508" y="350" width="24" height="10" rx="4" />
        <path d="M556 372 q28 -4 34 -24 l8 4 q-6 30 -40 36Z" />
        <path d="M482 368 q-26 0 -26 16 q0 14 26 12 v-7 q-16 2 -16 -6 q0 -8 16 -8Z" />
        <path d="M408 384 h34 q0 22 -17 22 q-17 0 -17 -22Z" />
        <path d="M612 384 h34 q0 22 -17 22 q-17 0 -17 -22Z" />
      </g>
      <Steam x={425} y={376} />
      <Steam x={629} y={376} delay="2.2s" />
      <Steam x={594} y={340} delay="1.1s" />
      <rect y="470" width="800" height="30" fill="#110C0A" opacity="0.8" />
    </>
  );
}

function Room() {
  const buildings: [number, number, number, number][] = [
    [436, 196, 62, 144], [498, 150, 54, 190], [552, 214, 70, 126], [622, 128, 58, 212], [680, 188, 54, 152],
  ];
  const lit = [
    [448, 212], [472, 236], [448, 262], [510, 168], [530, 200], [510, 232], [530, 268],
    [566, 232], [598, 258], [634, 148], [656, 176], [634, 208], [656, 250], [692, 208], [712, 240],
  ];

  return (
    <>
      <defs>
        <linearGradient id="room-wall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#262029" />
          <stop offset="1" stopColor="#131017" />
        </linearGradient>
        <linearGradient id="room-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0E1326" />
          <stop offset="1" stopColor="#2A3558" />
        </linearGradient>
        <radialGradient id="room-lamp">
          <stop offset="0" stopColor="#FFCB85" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFCB85" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="room-phone">
          <stop offset="0" stopColor="#C9DAFF" stopOpacity="0.5" />
          <stop offset="1" stopColor="#C9DAFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="500" fill="url(#room-wall)" />
      <rect x="430" y="60" width="310" height="280" fill="url(#room-night)" />
      {[[470, 92], [560, 84], [610, 108], [706, 96], [520, 122]].map(([cx, cy], i) => (
        <Twinkle key={cx} cx={cx} cy={cy} r={1.5} index={i} fill="#F4EBDD" />
      ))}
      <g fill="#0A0E1C">
        {buildings.map(([x, y, w, h]) => (
          <rect key={x} x={x} y={y} width={w} height={h} />
        ))}
      </g>
      {lit.map(([x, y], i) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="9"
          height="12"
          fill="#F6C67E"
          className={i % 4 === 0 ? "animate-cm-twinkle" : undefined}
          style={{ animationDelay: TWINKLE_DELAYS[i % TWINKLE_DELAYS.length] }}
          opacity="0.85"
        />
      ))}
      <g fill="#0D0A10">
        <rect x="581" y="60" width="8" height="280" />
        <rect x="430" y="196" width="310" height="6" />
      </g>
      <rect x="422" y="52" width="326" height="296" rx="4" fill="none" stroke="#0D0A10" strokeWidth="12" />
      <rect x="410" y="346" width="350" height="12" rx="3" fill="#2B2430" />
      <circle cx="196" cy="262" r="210" fill="url(#room-lamp)" className="animate-cm-twinkle" />
      <rect x="70" y="372" width="250" height="12" rx="3" fill="#3A2C2A" />
      <rect x="84" y="384" width="12" height="116" fill="#151015" />
      <rect x="294" y="384" width="12" height="116" fill="#151015" />
      <g stroke="#0D0A10" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M150 372 L176 300 L214 262" />
      </g>
      <path d="M190 236 L238 252 L226 290 L176 272Z" fill="#0D0A10" />
      <ellipse cx="204" cy="284" rx="26" ry="6" transform="rotate(18 204 284)" fill="#FFE1AC" />
      <ellipse cx="150" cy="372" rx="26" ry="5" fill="#0D0A10" />
      <rect x="232" y="350" width="52" height="22" rx="2" fill="#5B2F25" />
      <rect x="236" y="344" width="46" height="8" rx="2" fill="#7A4A32" />
      <path d="M360 500 V420 q0 -16 16 -16 H800 V500Z" fill="#0F0C13" />
      <path d="M376 404 H800 V424 H372 q-6 -10 4 -20Z" fill="#221B26" />
      <circle cx="560" cy="412" r="60" fill="url(#room-phone)" className="animate-cm-twinkle" style={{ animationDelay: "1.5s" }} />
      <rect x="538" y="404" width="44" height="14" rx="3" fill="#CFDDFF" transform="rotate(-6 560 411)" />
    </>
  );
}

function River() {
  const reflections: [number, number, number][] = [
    [244, 322, 44], [252, 344, 30], [238, 368, 52], [256, 396, 26],
    [544, 322, 44], [554, 346, 28], [538, 372, 50], [550, 402, 30],
    [380, 336, 36], [392, 362, 22], [372, 392, 40],
  ];

  return (
    <>
      <defs>
        <linearGradient id="river-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#11162E" />
          <stop offset="0.5" stopColor="#3B2E57" />
          <stop offset="0.8" stopColor="#9C5262" />
          <stop offset="1" stopColor="#E59A68" />
        </linearGradient>
        <linearGradient id="river-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5A3A56" />
          <stop offset="0.35" stopColor="#261F3D" />
          <stop offset="1" stopColor="#0C0A14" />
        </linearGradient>
        <radialGradient id="river-lamp">
          <stop offset="0" stopColor="#FFD58E" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FFD58E" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="300" fill="url(#river-sky)" />
      {[[70, 56], [150, 110], [240, 40], [330, 92], [450, 52], [520, 130], [700, 70], [760, 150], [110, 170]].map(([cx, cy], i) => (
        <Twinkle key={cx} cx={cx} cy={cy} r={1.7} index={i} fill="#F4EBDD" />
      ))}
      <circle cx="388" cy="104" r="46" fill="#F4EBDD" opacity="0.08" />
      <circle cx="388" cy="104" r="20" fill="#F7EEDF" />
      <path d="M0 300 V270 q30 -22 60 -4 q24 -30 56 -8 q30 -18 52 6 q40 -26 76 0 q28 -14 48 8 q36 -24 70 -2 q30 -20 60 2 q34 -26 70 -4 q30 -16 54 6 q36 -22 66 0 q30 -20 60 2 q30 -18 68 -4 V300Z" fill="#1A1630" />
      <rect y="298" width="800" height="202" fill="url(#river-water)" />
      <g fill="#0D0B16">
        <rect x="242" y="262" width="16" height="56" />
        <rect x="542" y="262" width="16" height="56" />
        <path d="M-20 284 Q400 214 820 284 V298 Q400 230 -20 298Z" />
      </g>
      <path d="M-20 262 Q400 192 820 262" fill="none" stroke="#0D0B16" strokeWidth="3" />
      <g stroke="#0D0B16" strokeWidth="2">
        {[40, 110, 250, 320, 390, 460, 530, 670, 740].map((x) => {
          const lift = 70 * (1 - ((x - 400) / 420) ** 2);
          return <line key={x} x1={x} y1={262 - lift} x2={x} y2={286 - lift} />;
        })}
      </g>
      {[250, 550].map((x, i) => (
        <g key={x}>
          <line x1={x} y1="172" x2={x} y2="246" stroke="#0D0B16" strokeWidth="4" />
          <circle cx={x} cy="168" r="44" fill="url(#river-lamp)" className="animate-cm-twinkle" style={{ animationDelay: i ? "1.6s" : "0s" }} />
          <circle cx={x} cy="168" r="7" fill="#FFE6B8" />
        </g>
      ))}
      {reflections.map(([x, y, w], i) => (
        <rect
          key={`${x}-${y}`}
          x={x - w / 2 + 8}
          y={y}
          width={w}
          height="3"
          rx="1.5"
          fill={x > 360 && x < 400 ? "#F4EBDD" : "#FFD58E"}
          className="animate-cm-twinkle"
          style={{ animationDelay: TWINKLE_DELAYS[i % TWINKLE_DELAYS.length] }}
        />
      ))}
      <path d="M0 500 V452 q120 -26 260 -8 q160 20 300 0 q120 -18 240 4 V500Z" fill="#08060D" />
      <g stroke="#08060D" strokeWidth="3" strokeLinecap="round">
        <path d="M60 456 l-8 -44 M74 454 l2 -54 M90 452 l10 -40 M700 452 l-10 -46 M716 452 l0 -56 M732 454 l10 -42" />
      </g>
    </>
  );
}

function Hall() {
  const windows = [150, 400, 650];
  return (
    <>
      <defs>
        <linearGradient id="hall-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3B2E26" />
          <stop offset="1" stopColor="#1D1512" />
        </linearGradient>
        <linearGradient id="hall-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FCE7B4" />
          <stop offset="1" stopColor="#EDA867" />
        </linearGradient>
        <linearGradient id="hall-shaft" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#FCE7B4" stopOpacity="0.22" />
          <stop offset="1" stopColor="#FCE7B4" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#hall-wall)" />
      {windows.map((x, i) => (
        <g key={x}>
          <path d={`M${x - 46} 320 V140 a46 46 0 0 1 92 0 V320Z`} fill="url(#hall-glass)" />
          <path d={`M${x} 96 V320 M${x - 46} 190 H${x + 46} M${x - 46} 258 H${x + 46}`} stroke="#2A1F1A" strokeWidth="5" fill="none" />
          <path d={`M${x - 46} 320 V140 a46 46 0 0 1 92 0 V320Z`} fill="none" stroke="#17100D" strokeWidth="10" />
          <path d={`M${x - 46} 320 H${x + 46} L${x + 190} 500 H${x - 10}Z`} fill="url(#hall-shaft)" className="animate-cm-twinkle" style={{ animationDelay: TWINKLE_DELAYS[i * 2], animationDuration: "9s" }} />
        </g>
      ))}
      <rect y="330" width="800" height="8" fill="#17100D" />
      <rect y="338" width="800" height="162" fill="#150F0C" opacity="0.55" />
      <rect x="352" y="318" width="96" height="62" rx="4" fill="#120C0A" />
      <rect x="340" y="310" width="120" height="10" rx="3" fill="#4A3628" />
      <rect x="386" y="290" width="28" height="20" rx="2" fill="#6B3423" />
      <circle cx="470" cy="296" r="26" fill="#FFD796" opacity="0.14" className="animate-cm-twinkle" />
      <rect x="467" y="292" width="6" height="18" rx="2" fill="#F4EBDD" />
      <ellipse cx="470" cy="288" rx="3" ry="6" fill="#FFD58E" />
      {[392, 440].map((y, row) => (
        <g key={y} fill={row ? "#0B0706" : "#100A08"}>
          {Array.from({ length: 9 }, (_, i) => {
            const x = 18 + i * 90 - row * 30;
            return <path key={i} d={`M${x} 500 V${y + 14} q0 -14 14 -14 h44 q14 0 14 14 V500Z`} />;
          })}
        </g>
      ))}
    </>
  );
}

const SCENES: Record<SettingId, () => ReactNode> = {
  garden: Garden,
  cafe: Cafe,
  kitchen: Kitchen,
  room: Room,
  river: River,
  hall: Hall,
};

export function SceneArt({ setting, className = "" }: { setting: SettingId; className?: string }) {
  const Scene = SCENES[setting];
  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={`block h-full w-full ${className}`}
    >
      <Scene />
    </svg>
  );
}

/** The wide dusk-over-Alder-Row backdrop behind the title and intro screens. */
export function TitleArt({ className = "" }: { className?: string }) {
  const stars: [number, number, number][] = [
    [80, 70, 1.6], [190, 150, 1.2], [260, 60, 1.8], [350, 190, 1.1], [430, 96, 1.5], [520, 44, 1.2],
    [610, 160, 1.7], [700, 82, 1.2], [790, 210, 1.4], [860, 58, 1.8], [940, 140, 1.1], [1030, 78, 1.6],
    [1120, 190, 1.3], [1160, 50, 1.2], [140, 250, 1.1], [480, 250, 1.3], [1000, 262, 1.2], [300, 300, 1],
  ];
  // [x, baseline y, width, height, lit windows as [dx, dy]]
  const houses: [number, number, number, number, [number, number][]][] = [
    [610, 520, 54, 44, [[12, 16], [34, 16]]],
    [672, 508, 46, 52, [[16, 20]]],
    [726, 498, 60, 60, [[12, 18], [38, 18], [38, 40]]],
    [796, 486, 50, 96, [[18, 44]]],
    [856, 500, 64, 52, [[14, 18], [42, 18]]],
    [930, 512, 48, 42, [[16, 14]]],
    [988, 522, 58, 40, [[12, 14], [38, 14]]],
  ];

  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={`block h-full w-full ${className}`}
    >
      <defs>
        <linearGradient id="title-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0D0E20" />
          <stop offset="0.38" stopColor="#2A2040" />
          <stop offset="0.58" stopColor="#7C3F4C" />
          <stop offset="0.7" stopColor="#D97B4A" />
        </linearGradient>
        <radialGradient id="title-sun">
          <stop offset="0" stopColor="#FFD79A" stopOpacity="0.85" />
          <stop offset="1" stopColor="#F0A35E" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="title-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F0B77A" stopOpacity="0.5" />
          <stop offset="1" stopColor="#F0B77A" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#title-sky)" />
      {stars.map(([cx, cy, r], i) => (
        <Twinkle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} index={i} fill="#F4EBDD" />
      ))}
      <circle cx="820" cy="560" r="300" fill="url(#title-sun)" />
      <path d="M0 560 Q200 470 430 530 T820 500 T1200 540 V800 H0Z" fill="#4A2B3B" />
      <path d="M0 620 Q260 520 560 570 Q760 500 960 548 T1200 560 V800 H0Z" fill="#241822" />
      <g fill="#120C13">
        {houses.map(([x, y, w, h]) => (
          <path key={x} d={`M${x} ${y + 60} V${y + 60 - h} L${x + w / 2} ${y + 60 - h - w * 0.36} L${x + w} ${y + 60 - h} V${y + 60}Z`} />
        ))}
        <rect x="813" y="436" width="16" height="30" />
        <path d="M809 438 L821 418 L833 438Z" />
        <path d="M560 574 q18 -40 44 -6 q10 -30 34 -2 v24 h-78Z" />
        <path d="M1050 566 q16 -44 42 -8 q14 -26 32 0 v26 h-74Z" />
      </g>
      {houses.flatMap(([x, y, , h, windows]) =>
        windows.map(([dx, dy], i) => (
          <rect
            key={`${x}-${dx}-${dy}`}
            x={x + dx}
            y={y + 60 - h + dy}
            width="9"
            height="12"
            rx="1"
            fill="#FFCF8A"
            className={(x + i) % 3 === 0 ? "animate-cm-twinkle" : undefined}
            style={{ animationDelay: TWINKLE_DELAYS[(x + i) % TWINKLE_DELAYS.length] }}
          />
        ))
      )}
      <path d="M0 668 Q300 580 620 610 Q860 566 1200 600 V800 H0Z" fill="#18101A" />
      <path d="M470 800 Q560 700 700 650 Q780 622 800 592 Q790 630 730 668 Q640 724 640 800Z" fill="url(#title-road)" />
      <path d="M0 720 Q340 660 700 700 T1200 690 V800 H0Z" fill="#0F0A10" />
    </svg>
  );
}
