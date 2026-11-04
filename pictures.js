/* Brush Bay pictures, style A "stickers": flat shapes on a white die-cut circle, no outlines.
   Every picture is drawn here as SVG (no image files, no emoji). Each one fits a 100×100 box. */
(() => {
  "use strict";

  const K = {
    ink: "#2f2346", white: "#ffffff", shadow: "#cfe7f1", sky: "#c9ecf8",
    yellow: "#ffc83d", sun: "#ffb000", cream: "#ffe08a",
    green: "#6cc070", leaf: "#93d993", hill: "#5fb68f", deep: "#3f8f6b",
    blue: "#4cb8ea", navy: "#2f9fd0", orange: "#f6a04d", rust: "#f08a3c",
    pink: "#f06aa6", rose: "#e0559a", blush: "#ffb3d1", red: "#ef5b5b", berry: "#d64545",
    brown: "#a8744a", wood: "#c9926a", soil: "#8a5a3a", grey: "#9aa6c4", slate: "#8592b4", mist: "#b9c3dc",
    skin: "#f5c9a0", skin2: "#e9b48a", hair: "#5a3d2b", purple: "#9b7fe0", lilac: "#c7b5f2",
  };
  const FISH = [[K.orange, K.rust], [K.pink, K.rose], [K.blue, K.navy], [K.green, K.deep], [K.yellow, K.sun]];

  // ---------- Shared parts ----------
  const fish = (x, y, s, i = 0) => {
    const [body, tail] = FISH[i % FISH.length];
    return `<g transform="translate(${x - 52 * s} ${y - 50 * s}) scale(${s})">
      <path d="M68 50 L88 35 L88 65 Z" fill="${tail}"/><ellipse cx="45" cy="50" rx="27" ry="18" fill="${body}"/>
      <path d="M50 34 Q57 50 50 66" stroke="#ffffff" stroke-opacity=".45" stroke-width="5" fill="none" stroke-linecap="round"/>
      <circle cx="32" cy="46" r="4.5" fill="${K.ink}"/></g>`;
  };
  const LAYOUT = {
    1: [[50, 50]], 2: [[50, 34], [50, 66]], 3: [[36, 30], [64, 50], [36, 70]],
    4: [[34, 36], [66, 36], [34, 64], [66, 64]], 5: [[34, 30], [66, 30], [50, 50], [34, 70], [66, 70]],
    6: [[34, 28], [66, 28], [34, 50], [66, 50], [34, 72], [66, 72]],
    7: [[38, 29], [62, 29], [26, 50], [50, 50], [74, 50], [38, 71], [62, 71]],
    8: [[28, 30], [50, 30], [72, 30], [38, 50], [62, 50], [28, 70], [50, 70], [72, 70]],
    9: [[28, 29], [50, 29], [72, 29], [28, 50], [50, 50], [72, 50], [28, 71], [50, 71], [72, 71]],
    10: [[30, 29], [50, 29], [70, 29], [20, 50], [40, 50], [60, 50], [80, 50], [30, 71], [50, 71], [70, 71]],
  };
  // Place any 100×100 drawing at (x, y), scaled by s; flip mirrors it left to right.
  const mini = (art, x, y, s, flip = false) =>
    `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s}) translate(-50 -50)">${art}</g>`;

  const face = (x, y, s = 1) =>
    `<circle cx="${x - 3.5 * s}" cy="${y}" r="${1.4 * s}" fill="${K.ink}"/><circle cx="${x + 3.5 * s}" cy="${y}" r="${1.4 * s}" fill="${K.ink}"/>
     <path d="M${x - 2.5 * s} ${y + 3.5 * s} Q${x} ${y + 5.5 * s} ${x + 2.5 * s} ${y + 3.5 * s}" stroke="${K.ink}" stroke-width="${1.3 * s}" fill="none" stroke-linecap="round"/>`;

  // A whole small person, standing on (x, y) = feet. pose: stand | walk | wide | point | sit
  const person = (x, y, s, o = {}) => {
    const shirt = o.shirt || K.blue, skin = o.skin || K.skin, hair = o.hair || K.hair, pants = o.pants || K.slate;
    const pose = o.pose || "stand";
    const legs = {
      stand: `M-4 -16 V0 M4 -16 V0`, walk: `M-3 -16 L-9 0 M3 -16 L9 0`, wide: `M-3 -16 L-8 0 M3 -16 L8 0`,
      point: `M-4 -16 V0 M4 -16 V0`, sit: `M-5 -14 H10 V0 M3 -14 H14 V0`,
    }[pose];
    const arms = {
      stand: `M-9 -32 L-11 -18 M9 -32 L11 -18`, walk: `M-9 -32 L-15 -20 M9 -32 L14 -22`,
      wide: `M-9 -32 L-24 -38 M9 -32 L24 -38`, point: `M-9 -32 L-11 -18 M9 -32 L2 -28`, sit: `M-9 -32 L-12 -20 M9 -32 L12 -20`,
    }[pose];
    const long = o.long ? `<path d="M-9 -46 Q-12 -34 -8 -32 M9 -46 Q12 -34 8 -32" stroke="${hair}" stroke-width="5" stroke-linecap="round" fill="none"/>` : "";
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <path d="${legs}" stroke="${pants}" stroke-width="6" stroke-linecap="round" fill="none"/>
      <path d="${arms}" stroke="${skin}" stroke-width="5" stroke-linecap="round" fill="none"/>
      <rect x="-10" y="${pose === "sit" ? -36 : -38}" width="20" height="24" rx="7" fill="${shirt}"/>
      ${long}
      <circle cx="0" cy="-47" r="10" fill="${skin}"/>
      <path d="M-10 -48 Q-10 -59 0 -59 Q10 -59 10 -48 Q5 -53 -10 -48 Z" fill="${hair}"/>
      ${face(0, -46, 0.9)}
    </g>`;
  };

  // Head and shoulders, centred on (x, y) = middle of the face. hairStyle: short | long | pony | pigtails | baby | bob
  const bust = (x, y, s, o = {}) => {
    const skin = o.skin || K.skin, hair = o.hair || K.hair, shirt = o.shirt || K.pink;
    const back = {
      long: `<path d="M-17 -4 Q-19 22 -12 26 H12 Q19 22 17 -4 Z" fill="${hair}"/>`,
      pony: `<circle cx="17" cy="-8" r="7" fill="${hair}"/><path d="M19 -4 Q26 8 18 16" stroke="${hair}" stroke-width="7" stroke-linecap="round" fill="none"/>`,
      pigtails: `<circle cx="-17" cy="0" r="7" fill="${hair}"/><circle cx="17" cy="0" r="7" fill="${hair}"/><circle cx="-17" cy="-6" r="3" fill="${K.pink}"/><circle cx="17" cy="-6" r="3" fill="${K.pink}"/>`,
      bob: `<path d="M-16 -4 Q-17 12 -10 12 H10 Q17 12 16 -4 Z" fill="${hair}"/>`,
    }[o.hairStyle] || "";
    const top = o.hairStyle === "baby"
      ? `<path d="M-2 -15 Q2 -22 6 -16" stroke="${hair}" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : `<path d="M-15 -2 Q-16 -18 0 -18 Q16 -18 15 -2 Q8 -11 -15 -2 Z" fill="${hair}"/>`;
    return `<g transform="translate(${x} ${y}) scale(${s})">
      ${back}
      <path d="M-22 34 Q-22 16 0 16 Q22 16 22 34 Z" fill="${shirt}"/>
      <rect x="-5" y="10" width="10" height="9" fill="${skin}"/>
      <circle cx="0" cy="0" r="15" fill="${skin}"/>
      ${top}
      ${face(0, 1, 1.3)}
    </g>`;
  };

  const tree = (x, y, s, c = K.green) => `<g transform="translate(${x - 50 * s} ${y - 50 * s}) scale(${s})">
      <rect x="44" y="52" width="12" height="32" rx="4" fill="${K.brown}"/>
      <circle cx="50" cy="38" r="22" fill="${c}"/><circle cx="33" cy="50" r="14" fill="${c}"/><circle cx="67" cy="50" r="14" fill="${c}"/>
      <circle cx="43" cy="31" r="6" fill="${K.leaf}"/></g>`;
  const pine = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
      <rect x="-4" y="10" width="8" height="12" rx="2" fill="${K.brown}"/>
      <path d="M0 -26 L16 -2 H8 L20 14 H-20 L-8 -2 H-16 Z" fill="${K.hill}"/></g>`;
  const cloud = (x, y, s, c = K.white) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}">
      <circle cx="-12" cy="4" r="10"/><circle cx="2" cy="-4" r="14"/><circle cx="15" cy="4" r="10"/><rect x="-22" y="4" width="47" height="10" rx="5"/></g>`;
  const stingray = (x, y, s, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
      <path d="M0 40 C 2 30, -2 24, 0 18" stroke="${K.rose}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M0 -26 C 18 -22, 40 -8, 48 2 C 36 8, 16 14, 0 22 C -16 14, -36 8, -48 2 C -40 -8, -18 -22, 0 -26 Z" fill="${K.pink}"/>
      <path d="M0 -18 C 12 -14, 24 -4, 28 2 C 20 6, 10 10, 0 14 C -10 10, -20 6, -28 2 C -24 -4, -12 -14, 0 -18 Z" fill="#ff8fc0"/>
      <circle cx="-7" cy="-8" r="3.5" fill="${K.ink}"/><circle cx="7" cy="-8" r="3.5" fill="${K.ink}"/></g>`;
  const house = (x, y, s, roof = K.red, wall = K.cream) => `<g transform="translate(${x} ${y}) scale(${s})">
      <rect x="-22" y="-8" width="44" height="34" rx="3" fill="${wall}"/>
      <path d="M-30 -6 L0 -32 L30 -6 Z" fill="${roof}" stroke="${roof}" stroke-width="4" stroke-linejoin="round"/>
      <rect x="-7" y="8" width="14" height="18" rx="3" fill="${K.brown}"/>
      <rect x="10" y="-2" width="8" height="8" rx="1.5" fill="${K.blue}"/></g>`;
  const arrow = (d, c) => `<path d="${d}" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const bulb = (x, y, s, on = true) => `<g transform="translate(${x} ${y}) scale(${s})">
      ${on ? `<path d="M0 -34v-6M-24 -24l-4-4M24 -24l4-4M-32 -2h-6M32 -2h6" stroke="${K.sun}" stroke-width="4" stroke-linecap="round"/>` : ""}
      <circle cx="0" cy="-4" r="20" fill="${on ? K.yellow : K.mist}"/>
      <rect x="-9" y="12" width="18" height="12" rx="3" fill="${K.slate}"/>
      ${on ? `<circle cx="-7" cy="-11" r="5" fill="${K.cream}"/>` : ""}</g>`;
  const heart = (x, y, s, c) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 12 C-26 -4 -18 -26 0 -14 C18 -26 26 -4 0 12 Z" fill="${c}"/>`;
  const box = `<path d="M22 50 L50 62 L78 50 V78 L50 90 L22 78 Z" fill="${K.wood}"/><path d="M22 50 L50 62 V90 L22 78 Z" fill="${K.brown}"/>`;
  const field = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
      <rect x="-30" y="-30" width="28" height="28" rx="4" fill="${K.green}"/><rect x="2" y="-30" width="28" height="28" rx="4" fill="${K.hill}"/>
      <rect x="-30" y="2" width="28" height="28" rx="4" fill="${K.hill}"/><rect x="2" y="2" width="28" height="28" rx="4" fill="${K.green}"/>
      <path d="M-26 -22h20M-26 -14h20M6 10h20M6 18h20" stroke="${K.leaf}" stroke-width="3" stroke-linecap="round"/></g>`;
  const SKY = `<circle cx="50" cy="50" r="40" fill="${K.sky}"/>`;

  // ---------- The 101 pictures ----------
  const ART = {
    // First lines
    "力": `<rect x="14" y="58" width="16" height="24" rx="5" fill="${K.blue}"/>
           <path d="M28 70 H54 Q64 70 64 60 V38" stroke="${K.skin}" stroke-width="15" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
           <ellipse cx="44" cy="61" rx="13" ry="10" fill="${K.skin}"/><ellipse cx="41" cy="58" rx="5" ry="3" fill="#fbe0c4"/>
           <circle cx="64" cy="31" r="11" fill="${K.skin2}"/>
           <path d="M78 30 l8 -4 M80 42 l9 0 M50 22 l-4 -7" stroke="${K.sun}" stroke-width="4" stroke-linecap="round"/>`,
    "大": `<rect x="38" y="64" width="9" height="16" rx="3" fill="${K.slate}"/><rect x="66" y="64" width="9" height="16" rx="3" fill="${K.slate}"/>
           <ellipse cx="58" cy="56" rx="26" ry="18" fill="${K.grey}"/>
           <rect x="46" y="64" width="9" height="16" rx="3" fill="${K.grey}"/><rect x="74" y="62" width="9" height="16" rx="3" fill="${K.grey}"/>
           <path d="M22 50 Q16 64 25 71" stroke="${K.grey}" stroke-width="8" fill="none" stroke-linecap="round"/>
           <circle cx="32" cy="45" r="15" fill="${K.grey}"/><ellipse cx="42" cy="46" rx="9" ry="12" fill="${K.mist}"/>
           <circle cx="27" cy="41" r="2.8" fill="${K.ink}"/>`,
    "天": `${SKY}<circle cx="70" cy="30" r="9" fill="${K.yellow}"/>${cloud(38, 32, 0.8)}
           <path d="M14 76 Q50 66 86 76 L80 88 H20 Z" fill="${K.green}"/>${person(50, 82, 0.55, { pose: "wide", shirt: K.pink })}`,

    // Boxes
    "目": `<path d="M14 50 Q50 18 86 50 Q50 82 14 50 Z" fill="${K.white}" stroke="${K.mist}" stroke-width="3"/>
           <circle cx="50" cy="50" r="15" fill="${K.blue}"/><circle cx="50" cy="50" r="7" fill="${K.ink}"/><circle cx="45" cy="45" r="3.5" fill="${K.white}"/>
           <path d="M30 30 l-4 -7 M42 25 l-1 -8 M58 25 l1 -8 M70 30 l4 -7" stroke="${K.ink}" stroke-width="3" stroke-linecap="round"/>`,
    "田": field(50, 50, 1.05),
    "白": `<circle cx="50" cy="50" r="40" fill="${K.lilac}"/>
           <ellipse cx="42" cy="22" rx="6" ry="16" fill="${K.white}"/><ellipse cx="58" cy="22" rx="6" ry="16" fill="${K.white}"/>
           <ellipse cx="42" cy="24" rx="2.5" ry="10" fill="${K.blush}"/><ellipse cx="58" cy="24" rx="2.5" ry="10" fill="${K.blush}"/>
           <ellipse cx="50" cy="68" rx="22" ry="16" fill="${K.white}"/><circle cx="50" cy="46" r="15" fill="${K.white}"/>
           <circle cx="45" cy="45" r="2.2" fill="${K.ink}"/><circle cx="55" cy="45" r="2.2" fill="${K.ink}"/><circle cx="50" cy="50" r="2" fill="${K.pink}"/>`,
    "回": `${house(54, 58, 0.95)}${arrow("M22 70 Q12 40 30 24", K.pink)}<path d="M22 22 L36 18 L32 32 Z" fill="${K.pink}"/>`,

    // Nature
    "土": `<path d="M14 78 Q20 46 50 44 Q80 46 86 78 Z" fill="${K.soil}"/><path d="M22 70 Q34 58 48 60" stroke="${K.brown}" stroke-width="4" fill="none" stroke-linecap="round"/>
           <circle cx="62" cy="64" r="3" fill="${K.brown}"/><circle cx="36" cy="72" r="2.5" fill="${K.brown}"/>
           <path d="M50 46 V30" stroke="${K.deep}" stroke-width="4" stroke-linecap="round"/>
           <path d="M50 34 Q38 30 36 20 Q48 20 50 32 Z" fill="${K.green}"/><path d="M50 30 Q60 22 68 24 Q64 34 50 34 Z" fill="${K.leaf}"/>`,
    "月": `<path d="M58 18 A32 32 0 1 0 80 70 A25 25 0 1 1 58 18 Z" fill="#ffd34d"/>
           <circle cx="72" cy="28" r="3.5" fill="${K.yellow}"/><circle cx="80" cy="44" r="2.5" fill="${K.yellow}"/>`,
    "石": `<ellipse cx="38" cy="66" rx="22" ry="14" fill="${K.slate}"/><ellipse cx="64" cy="70" rx="18" ry="11" fill="${K.grey}"/>
           <ellipse cx="50" cy="44" rx="18" ry="13" fill="${K.grey}"/><ellipse cx="44" cy="40" rx="6" ry="3" fill="${K.mist}"/>`,

    // My body
    "毛": `<path d="M74 18 Q30 22 24 70 Q40 74 52 64 Q74 44 74 18 Z" fill="${K.lilac}"/><path d="M74 18 Q48 40 26 82" stroke="${K.purple}" stroke-width="4" fill="none" stroke-linecap="round"/>
           <path d="M60 30 l6 6 M52 40 l7 6 M44 50 l7 6" stroke="${K.white}" stroke-width="2.5" stroke-linecap="round"/>`,
    "耳": `<path d="M40 16 Q72 14 72 44 Q72 60 60 66 Q56 70 56 78 Q56 88 44 86 Q32 84 32 70" fill="none" stroke="${K.skin}" stroke-width="14" stroke-linecap="round"/>
           <path d="M44 34 Q58 32 58 46 Q58 54 50 56" fill="none" stroke="${K.skin2}" stroke-width="6" stroke-linecap="round"/>`,

    // Opposites
    "上": `<rect x="18" y="62" width="64" height="7" rx="3.5" fill="${K.slate}"/><circle cx="50" cy="38" r="15" fill="${K.red}"/><circle cx="45" cy="33" r="4" fill="#ff9a9a"/>
           ${arrow("M78 52 V22 M70 30 L78 22 L86 30", K.green)}`,
    "下": `<rect x="18" y="34" width="64" height="7" rx="3.5" fill="${K.slate}"/><circle cx="50" cy="62" r="15" fill="${K.red}"/><circle cx="45" cy="57" r="4" fill="#ff9a9a"/>
           ${arrow("M78 48 V78 M70 70 L78 78 L86 70", K.orange)}`,
    // few / many: fish in a pond, so they don't look like the numbers 二 and 八
    "少": `${SKY}${fish(36, 56, 0.34, 0)}${fish(64, 44, 0.34, 2)}`,
    "多": `${SKY}${LAYOUT[10].map(([x, y], i) => fish(x, y, 0.22, i)).join("")}${fish(50, 86, 0.18, 4)}${fish(50, 14, 0.18, 3)}`,

    // Around me
    "车": `<path d="M16 64 V52 Q16 46 24 44 L34 30 Q36 26 42 26 H62 Q68 26 70 30 L78 44 Q86 46 86 54 V64 Z" fill="${K.red}"/>
           <path d="M38 32 H50 V44 H31 Z M54 32 H64 L70 44 H54 Z" fill="${K.sky}"/>
           <circle cx="32" cy="66" r="9" fill="${K.ink}"/><circle cx="32" cy="66" r="4" fill="${K.mist}"/><circle cx="70" cy="66" r="9" fill="${K.ink}"/><circle cx="70" cy="66" r="4" fill="${K.mist}"/>`,
    "书": `<path d="M50 30 Q34 22 16 26 V74 Q34 70 50 78 Q66 70 84 74 V26 Q66 22 50 30 Z" fill="${K.blue}"/>
           <path d="M50 32 Q36 26 21 29 V70 Q36 67 50 74 Z" fill="${K.white}"/><path d="M50 32 Q64 26 79 29 V70 Q64 67 50 74 Z" fill="#f4f8fb"/>
           <path d="M27 40 H43 M27 48 H43 M27 56 H40 M57 40 H73 M57 48 H73 M57 56 H70" stroke="${K.mist}" stroke-width="3" stroke-linecap="round"/>`,
    "包": `<path d="M36 30 Q36 16 50 16 Q64 16 64 30" stroke="${K.rose}" stroke-width="6" fill="none"/>
           <rect x="26" y="28" width="48" height="56" rx="14" fill="${K.pink}"/><rect x="34" y="56" width="32" height="20" rx="6" fill="${K.rose}"/>
           <rect x="34" y="38" width="32" height="6" rx="3" fill="${K.blush}"/>`,
    "衣": `<path d="M36 18 L22 26 L12 44 L24 50 L30 40 V84 H70 V40 L76 50 L88 44 L78 26 L64 18 Q50 30 36 18 Z" fill="${K.blue}"/>
           <path d="M36 18 Q50 30 64 18" stroke="${K.navy}" stroke-width="4" fill="none"/><circle cx="50" cy="58" r="7" fill="${K.yellow}"/>`,
    "伞": `<path d="M14 50 Q16 18 50 16 Q84 18 86 50 Q78 44 68 50 Q59 44 50 50 Q41 44 32 50 Q22 44 14 50 Z" fill="${K.pink}"/>
           <path d="M50 16 Q40 30 32 50 M50 16 Q60 30 68 50" stroke="${K.rose}" stroke-width="2.5" fill="none"/>
           <path d="M50 50 V78 Q50 86 42 86 Q36 86 36 80" stroke="${K.slate}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    "灯": bulb(50, 52, 1.05, true),

    // Moving
    "去": `${stingray(58, 44, 0.5, 45)}<path d="M20 62 L32 56 M18 74 L34 66 M28 82 L40 74" stroke="${K.navy}" stroke-width="4" stroke-linecap="round" opacity=".6"/>`,
    "立": `<rect x="20" y="82" width="60" height="5" rx="2.5" fill="${K.slate}"/>${person(50, 82, 1.1, { pose: "stand", shirt: K.green })}`,
    "来": `${house(30, 62, 0.72)}${stingray(64, 42, 0.42, -90)}<path d="M76 32 H84 M78 42 H86 M76 52 H84" stroke="${K.navy}" stroke-width="4" stroke-linecap="round" opacity=".6"/>`,

    // Sky and weather
    "云": `${SKY}${cloud(50, 52, 1.35)}`,
    "风": `<path d="M16 38 H58 Q72 38 72 28 Q72 18 62 20 M16 54 H70 Q84 54 84 64 Q84 74 74 72 M22 70 H50" stroke="${K.blue}" stroke-width="6" fill="none" stroke-linecap="round"/>
           <path d="M30 22 Q38 12 46 20 Q38 30 30 22 Z" fill="${K.green}"/>`,
    "雨": `${cloud(50, 36, 1.3, K.mist)}<path d="M32 62 l-4 10 M50 62 l-4 10 M68 62 l-4 10 M41 76 l-4 10 M59 76 l-4 10" stroke="${K.blue}" stroke-width="5" stroke-linecap="round"/>`,
    "雪": `<g stroke="${K.navy}" stroke-width="5" stroke-linecap="round"><path d="M50 16 V84 M21 33 L79 67 M21 67 L79 33"/>
           <path d="M42 22 L50 30 L58 22 M42 78 L50 70 L58 78 M22 44 L32 41 L28 31 M78 56 L68 59 L72 69 M22 56 L32 59 L28 69 M78 44 L68 41 L72 31" fill="none"/></g>`,

    // Animals
    "马": `<path d="M30 84 V60 Q28 40 40 30 L36 16 L48 24 Q66 22 74 40 L80 56 Q82 64 74 64 Q68 64 64 56 L58 50 Q56 66 62 84 Z" fill="${K.brown}"/>
           <path d="M40 30 Q30 40 28 56 L24 50 Q24 36 36 26 Z" fill="${K.hair}"/><circle cx="58" cy="36" r="3" fill="${K.ink}"/><circle cx="74" cy="56" r="2" fill="${K.hair}"/>`,
    "鸟": `<ellipse cx="48" cy="54" rx="26" ry="22" fill="${K.blue}"/><circle cx="62" cy="38" r="14" fill="${K.blue}"/>
           <path d="M74 38 L86 42 L74 46 Z" fill="${K.yellow}"/><circle cx="66" cy="35" r="2.8" fill="${K.ink}"/>
           <path d="M30 50 Q44 44 50 60 Q36 66 30 50 Z" fill="${K.navy}"/><ellipse cx="54" cy="64" rx="12" ry="8" fill="${K.sky}"/>
           <path d="M42 76 v8 M52 76 v8" stroke="${K.rust}" stroke-width="3" stroke-linecap="round"/>`,
    "羊": `<g fill="${K.white}" stroke="${K.mist}" stroke-width="2"><circle cx="36" cy="44" r="12"/><circle cx="52" cy="38" r="13"/><circle cx="68" cy="46" r="12"/><circle cx="40" cy="60" r="12"/><circle cx="58" cy="60" r="13"/><circle cx="72" cy="58" r="9"/></g>
           <path d="M42 70 v14 M64 70 v14" stroke="${K.ink}" stroke-width="5" stroke-linecap="round"/>
           <ellipse cx="26" cy="54" rx="10" ry="12" fill="${K.ink}"/><circle cx="23" cy="51" r="2" fill="${K.white}"/>`,
    "虫": `<circle cx="24" cy="60" r="10" fill="${K.green}"/><circle cx="38" cy="54" r="11" fill="${K.leaf}"/><circle cx="53" cy="56" r="11" fill="${K.green}"/><circle cx="67" cy="50" r="12" fill="${K.leaf}"/>
           <circle cx="78" cy="38" r="12" fill="${K.green}"/><circle cx="82" cy="35" r="2.5" fill="${K.ink}"/><path d="M74 26 l-3 -8 M82 26 l3 -8" stroke="${K.deep}" stroke-width="3" stroke-linecap="round"/>`,
    "鱼": `<path d="M68 50 L88 35 L88 65 Z" fill="${K.rust}"/><ellipse cx="45" cy="50" rx="27" ry="18" fill="${K.orange}"/>
           <path d="M50 34 Q57 50 50 66" stroke="#ffd2a8" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="32" cy="46" r="4.5" fill="${K.ink}"/>`,
    "狗": `<ellipse cx="50" cy="52" rx="24" ry="22" fill="${K.wood}"/><ellipse cx="26" cy="46" rx="9" ry="18" fill="${K.brown}" transform="rotate(15 26 46)"/>
           <ellipse cx="74" cy="46" rx="9" ry="18" fill="${K.brown}" transform="rotate(-15 74 46)"/><ellipse cx="50" cy="64" rx="12" ry="9" fill="${K.cream}"/>
           <ellipse cx="50" cy="59" rx="5" ry="3.5" fill="${K.ink}"/><circle cx="41" cy="46" r="3" fill="${K.ink}"/><circle cx="59" cy="46" r="3" fill="${K.ink}"/>
           <path d="M50 70 Q50 76 55 75" fill="${K.pink}"/>`,

    // Garden and food
    "瓜": `<path d="M14 40 H86 Q86 80 50 80 Q14 80 14 40 Z" fill="${K.green}"/><path d="M20 40 H80 Q80 74 50 74 Q20 74 20 40 Z" fill="${K.red}"/>
           <g fill="${K.ink}"><ellipse cx="38" cy="52" rx="2" ry="3"/><ellipse cx="50" cy="58" rx="2" ry="3"/><ellipse cx="62" cy="52" rx="2" ry="3"/><ellipse cx="44" cy="64" rx="2" ry="3"/><ellipse cx="56" cy="64" rx="2" ry="3"/></g>`,
    "禾": `<path d="M10 74 Q50 66 90 74 V86 H10 Z" fill="${K.soil}"/><path d="M26 74 V54" stroke="${K.deep}" stroke-width="3.5" stroke-linecap="round"/><path d="M26 60 Q12 58 10 44 Q22 46 26 60 Z M26 56 Q40 52 42 38 Q30 40 26 56 Z" fill="${K.green}"/><path d="M50 74 V54" stroke="${K.deep}" stroke-width="3.5" stroke-linecap="round"/><path d="M50 60 Q36 58 34 44 Q46 46 50 60 Z M50 56 Q64 52 66 38 Q54 40 50 56 Z" fill="${K.green}"/><path d="M74 74 V54" stroke="${K.deep}" stroke-width="3.5" stroke-linecap="round"/><path d="M74 60 Q60 58 58 44 Q70 46 74 60 Z M74 56 Q88 52 90 38 Q78 40 74 56 Z" fill="${K.green}"/>`,
    "米": `<path d="M16 50 H84 Q82 82 50 82 Q18 82 16 50 Z" fill="${K.blue}"/><path d="M22 50 Q30 34 50 34 Q70 34 78 50 Z" fill="${K.white}" stroke="#e9eef3" stroke-width="2"/>
           <path d="M66 14 L44 44 M76 18 L52 46" stroke="${K.wood}" stroke-width="4" stroke-linecap="round"/><rect x="40" y="62" width="20" height="6" rx="3" fill="${K.navy}"/>`,
    "竹": `<g fill="${K.green}"><rect x="30" y="16" width="12" height="70" rx="5"/><rect x="56" y="22" width="12" height="64" rx="5"/></g>
           <path d="M30 40 H42 M30 64 H42 M56 46 H68 M56 68 H68" stroke="${K.deep}" stroke-width="3"/>
           <path d="M42 40 Q54 30 60 18 Q48 22 42 36 Z M68 46 Q80 42 86 32 Q74 32 68 42 Z M30 62 Q18 58 14 48 Q26 50 30 58 Z" fill="${K.leaf}"/>`,
    "豆": `<path d="M18 62 Q16 40 40 36 L70 30 Q86 28 84 42 Q82 56 60 60 L34 68 Q20 72 18 62 Z" fill="${K.green}"/>
           <g fill="${K.leaf}"><circle cx="34" cy="54" r="8"/><circle cx="50" cy="49" r="8"/><circle cx="66" cy="44" r="8"/></g>
           <path d="M84 36 Q90 28 86 20" stroke="${K.deep}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    "果": `<path d="M50 32 Q30 22 22 40 Q16 62 32 80 Q42 88 50 82 Q58 88 68 80 Q84 62 78 40 Q70 22 50 32 Z" fill="${K.red}"/>
           <path d="M50 32 Q50 22 54 14" stroke="${K.brown}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M54 20 Q64 10 74 16 Q64 26 54 20 Z" fill="${K.green}"/>
           <ellipse cx="34" cy="46" rx="5" ry="8" fill="#ff9a9a" transform="rotate(20 34 46)"/>`,

    // Family
    "子": bust(50, 46, 1.6, { hairStyle: "baby", shirt: K.yellow }),
    "妈": `${bust(38, 40, 1.15, { hairStyle: "long", shirt: K.pink })}${bust(66, 58, 0.85, { hairStyle: "pigtails", shirt: K.yellow })}`,
    "弟": bust(50, 52, 1.25, { hairStyle: "short", shirt: K.green }),
    "爸": bust(50, 42, 1.6, { hairStyle: "short", shirt: K.navy, hair: K.ink }),
    "姐": bust(50, 42, 1.6, { hairStyle: "pony", shirt: K.purple }),
    "妹": bust(50, 52, 1.25, { hairStyle: "pigtails", shirt: K.orange }),

    // Put together
    "休": `${tree(64, 40, 0.75)}${person(36, 84, 0.85, { pose: "sit", shirt: K.orange })}<path d="M14 84 H86" stroke="${K.green}" stroke-width="5" stroke-linecap="round"/>`,
    "众": `${person(50, 52, 0.62, { shirt: K.blue })}${person(32, 86, 0.62, { shirt: K.pink })}${person(68, 86, 0.62, { shirt: K.green })}`,
    "男": `${bust(50, 54, 1.25, { hairStyle: "short", shirt: K.navy })}<path d="M30 44 Q30 25 50 25 Q70 25 70 44 Z" fill="${K.orange}"/><path d="M62 43 H84 Q82 49 64 48 Z" fill="${K.rust}"/>`,
    "林": `${tree(32, 52, 0.62)}${tree(68, 52, 0.62, K.hill)}`,
    "森": `${pine(50, 36, 0.85)}${pine(30, 66, 0.85)}${pine(70, 66, 0.85)}`,

    // Her world
    "文": `<rect x="24" y="18" width="52" height="66" rx="5" fill="${K.cream}"/><rect x="18" y="14" width="64" height="8" rx="4" fill="${K.wood}"/><rect x="18" y="80" width="64" height="8" rx="4" fill="${K.wood}"/>
           <text x="50" y="49" font-size="24" text-anchor="middle" font-family="PingFang SC, Hiragino Sans GB, Noto Sans SC, sans-serif" font-weight="700" fill="${K.ink}">中</text>
           <text x="50" y="74" font-size="24" text-anchor="middle" font-family="PingFang SC, Hiragino Sans GB, Noto Sans SC, sans-serif" font-weight="700" fill="${K.ink}">文</text>
           <rect x="64" y="66" width="8" height="8" rx="1.5" fill="${K.red}"/>`,
    "字": `<rect x="18" y="20" width="50" height="62" rx="5" fill="${K.white}" stroke="${K.mist}" stroke-width="2"/>
           <path d="M28 36 H58 M43 36 V50 M28 50 H58 M36 62 Q44 58 52 66" stroke="${K.ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
           <g transform="rotate(35 70 54)"><rect x="64" y="20" width="12" height="46" rx="2" fill="${K.yellow}"/><path d="M64 66 L70 78 L76 66 Z" fill="${K.cream}"/><path d="M68.5 75 L70 78 L71.5 75 Z" fill="${K.ink}"/><rect x="64" y="16" width="12" height="6" rx="2" fill="${K.pink}"/></g>`,
    "学": `<rect x="20" y="40" width="60" height="44" rx="3" fill="${K.cream}"/><path d="M14 42 L50 22 L86 42 Z" fill="${K.red}"/>
           <rect x="44" y="62" width="12" height="22" rx="2" fill="${K.brown}"/><rect x="26" y="50" width="12" height="10" rx="2" fill="${K.blue}"/><rect x="62" y="50" width="12" height="10" rx="2" fill="${K.blue}"/>
           <circle cx="50" cy="36" r="5" fill="${K.white}"/><path d="M50 22 V8" stroke="${K.slate}" stroke-width="2.5"/><path d="M50 8 H62 L58 12 L62 16 H50 Z" fill="${K.yellow}"/>`,
    "海": `<circle cx="50" cy="50" r="40" fill="${K.sky}"/><path d="M10 56 Q20 46 30 56 T50 56 T70 56 T90 56 V90 H10 Z" fill="${K.blue}"/>
           <path d="M10 70 Q20 60 30 70 T50 70 T70 70 T90 70 V90 H10 Z" fill="${K.navy}"/>${stingray(50, 30, 0.42, 0)}`,
    "家": house(50, 60, 1.3),
    "球": `<circle cx="50" cy="50" r="30" fill="#d7e84a"/><path d="M28 30 Q46 50 28 70 M72 30 Q54 50 72 70" stroke="${K.white}" stroke-width="4" fill="none" stroke-linecap="round"/>
           <circle cx="40" cy="38" r="5" fill="#eaf59a"/>`,
  };

  // ---------- Sea creatures: one joins a category's tank for each of its characters with a 3-star turn ----------
  const CREATURES = {
    fish: `<path d="M70 50 L88 36 L88 64 Z" fill="${K.rust}"/><ellipse cx="46" cy="50" rx="28" ry="20" fill="${K.orange}"/>
           <path d="M40 31 Q46 50 40 69 M56 33 Q62 50 56 67" stroke="${K.white}" stroke-width="6" fill="none"/><circle cx="30" cy="46" r="4.5" fill="${K.ink}"/>`,
    puffer: `<g stroke="${K.sun}" stroke-width="4" stroke-linecap="round"><path d="M50 16 V24 M50 76 V84 M24 30 L29 35 M76 30 L71 35 M24 70 L29 65 M76 70 L71 65"/></g>
           <path d="M76 50 L88 40 L88 60 Z" fill="${K.sun}"/><circle cx="50" cy="50" r="27" fill="${K.yellow}"/><ellipse cx="50" cy="60" rx="18" ry="12" fill="${K.cream}"/>
           <circle cx="40" cy="44" r="4" fill="${K.ink}"/><circle cx="58" cy="44" r="4" fill="${K.ink}"/>`,
    crab: `<path d="M26 40 Q14 30 22 20 Q26 28 32 28 M74 40 Q86 30 78 20 Q74 28 68 28" fill="${K.red}" stroke="${K.red}" stroke-width="6" stroke-linejoin="round"/>
           <path d="M28 66 L16 74 M30 72 L22 82 M72 66 L84 74 M70 72 L78 82" stroke="${K.berry}" stroke-width="4" stroke-linecap="round"/>
           <ellipse cx="50" cy="58" rx="26" ry="18" fill="${K.red}"/><path d="M42 40 V34 M58 40 V34" stroke="${K.berry}" stroke-width="3"/>
           <circle cx="42" cy="32" r="4.5" fill="${K.white}"/><circle cx="58" cy="32" r="4.5" fill="${K.white}"/><circle cx="42" cy="32" r="2.2" fill="${K.ink}"/><circle cx="58" cy="32" r="2.2" fill="${K.ink}"/>`,
    octopus: `<path d="M30 52 Q22 72 14 74 M40 56 Q36 78 30 84 M50 58 V86 M60 56 Q64 78 70 84 M70 52 Q78 72 86 74" stroke="${K.purple}" stroke-width="7" fill="none" stroke-linecap="round"/>
           <ellipse cx="50" cy="40" rx="24" ry="24" fill="${K.purple}"/><circle cx="42" cy="40" r="4" fill="${K.ink}"/><circle cx="58" cy="40" r="4" fill="${K.ink}"/>
           <ellipse cx="42" cy="28" rx="6" ry="4" fill="${K.lilac}"/>`,
    turtle: `<ellipse cx="22" cy="52" rx="10" ry="8" fill="${K.leaf}"/><ellipse cx="34" cy="70" rx="8" ry="6" fill="${K.leaf}"/><ellipse cx="66" cy="70" rx="8" ry="6" fill="${K.leaf}"/>
           <ellipse cx="34" cy="34" rx="8" ry="6" fill="${K.leaf}"/><ellipse cx="66" cy="34" rx="8" ry="6" fill="${K.leaf}"/><path d="M78 52 L88 50 L80 56 Z" fill="${K.leaf}"/>
           <ellipse cx="52" cy="52" rx="28" ry="22" fill="${K.hill}"/><path d="M42 38 L52 46 L62 38 M40 62 L52 56 L64 62 M52 46 V56" stroke="${K.deep}" stroke-width="3" fill="none"/>
           <circle cx="19" cy="50" r="2" fill="${K.ink}"/>`,
    // Drawn facing right: a curled tail, a round belly with cream ridges, a crown and a long snout.
    seahorse: `<path d="M46 66 Q38 82 50 86 Q60 88 60 80 Q60 73 52 75" stroke="${K.orange}" stroke-width="9" fill="none" stroke-linecap="round"/>
           <path d="M38 47 Q26 52 36 62 Z" fill="${K.rust}"/>
           <path d="M46 34 Q64 36 64 52 Q64 66 50 70 Q40 72 38 60 Q36 46 46 34 Z" fill="${K.orange}"/>
           <path d="M50 43 Q57 45 62 42 M47 51 Q56 53 63 50 M46 59 Q54 61 61 58" stroke="${K.cream}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
           <path d="M58 22 L80 25 Q85 28 80 31 L58 33 Z" fill="${K.orange}"/>
           <circle cx="52" cy="28" r="13" fill="${K.orange}"/>
           <path d="M44 18 L45 9 L50 15 L54 8 L57 17 Z" fill="${K.rust}"/>
           <circle cx="55" cy="26" r="4" fill="${K.ink}"/><circle cx="56.5" cy="24.5" r="1.4" fill="${K.white}"/>`,
    // A killer whale, facing left, drawn from measurements of Ernest's reference picture: a long body with a
    // pointed snout, a lighter grey back, a swept-back fin just behind the flipper, and white patches (chin,
    // behind the eye, and under the back half) cut to the body's outline.
    orca: `<defs><clipPath id="orca-body"><path d="M1.5 61.2 C2.6 59.8 5.6 55 8 52.6 C10.4 50.2 13 48.6 16 47.1 C19 45.6 22.7 44.5 26 43.7 C29.3 42.9 32.3 42.7 36 42.5 C39.7 42.3 44.3 42.2 48 42.4 C51.7 42.6 54.7 42.9 58 43.6 C61.3 44.3 64.7 45.5 68 46.8 C71.3 48.1 74.7 49.6 78 51.4 C81.3 53.2 85.7 56.4 88 57.6 C90.3 58.9 90.8 58.7 92 58.9 C93.2 59.1 93.9 58.6 95 58.7 C96.1 58.8 97.9 59.5 98.5 59.6 C98.2 60 97.1 61 96.6 61.8 C96.1 62.6 95.6 63.5 95.6 64.4 C95.6 65.3 95.9 65.9 96.4 67.4 C96.9 68.9 98.2 72.2 98.6 73.2 C98 72.9 96.1 72.1 95 71.3 C93.9 70.5 92.8 69.5 92 68.5 C91.2 67.5 90.7 66 90 65.3 C89.3 64.5 88.3 64.2 88 64 C87.3 63.8 85.7 63.1 84 62.7 C82.3 62.3 80 61.9 78 61.6 C76 61.4 74.3 61.2 72 61.2 C69.7 61.2 66.7 61.4 64 61.8 C61.3 62.2 58.7 63.1 56 63.6 C53.3 64.1 51 64.5 48 64.8 C45 65.1 41.3 65.2 38 65.3 C34.7 65.4 31.3 65.4 28 65.3 C24.7 65.2 21 65.1 18 64.9 C15 64.7 12.3 64.5 10 64.2 C7.7 63.9 5.4 63.5 4 63 C2.6 62.5 1.9 61.5 1.5 61.2 Z"/></clipPath></defs>
           <path d="M1.5 61.2 C2.6 59.8 5.6 55 8 52.6 C10.4 50.2 13 48.6 16 47.1 C19 45.6 22.7 44.5 26 43.7 C29.3 42.9 32.3 42.7 36 42.5 C39.7 42.3 44.3 42.2 48 42.4 C51.7 42.6 54.7 42.9 58 43.6 C61.3 44.3 64.7 45.5 68 46.8 C71.3 48.1 74.7 49.6 78 51.4 C81.3 53.2 85.7 56.4 88 57.6 C90.3 58.9 90.8 58.7 92 58.9 C93.2 59.1 93.9 58.6 95 58.7 C96.1 58.8 97.9 59.5 98.5 59.6 C98.2 60 97.1 61 96.6 61.8 C96.1 62.6 95.6 63.5 95.6 64.4 C95.6 65.3 95.9 65.9 96.4 67.4 C96.9 68.9 98.2 72.2 98.6 73.2 C98 72.9 96.1 72.1 95 71.3 C93.9 70.5 92.8 69.5 92 68.5 C91.2 67.5 90.7 66 90 65.3 C89.3 64.5 88.3 64.2 88 64 C87.3 63.8 85.7 63.1 84 62.7 C82.3 62.3 80 61.9 78 61.6 C76 61.4 74.3 61.2 72 61.2 C69.7 61.2 66.7 61.4 64 61.8 C61.3 62.2 58.7 63.1 56 63.6 C53.3 64.1 51 64.5 48 64.8 C45 65.1 41.3 65.2 38 65.3 C34.7 65.4 31.3 65.4 28 65.3 C24.7 65.2 21 65.1 18 64.9 C15 64.7 12.3 64.5 10 64.2 C7.7 63.9 5.4 63.5 4 63 C2.6 62.5 1.9 61.5 1.5 61.2 Z" fill="#585060"/>
           <g clip-path="url(#orca-body)">
             <path d="M0 61.2 C0.7 60.8 2.3 59.9 4 58.8 C5.7 57.7 7.7 55.8 10 54.5 C12.3 53.2 15 52.1 18 51.1 C21 50.1 24.3 49.1 28 48.5 C31.7 47.9 36 47.6 40 47.6 C44 47.6 48 47.8 52 48.3 C56 48.8 60 49.4 64 50.4 C68 51.4 72.5 53 76 54.3 C79.5 55.6 82.8 57.4 85 58 C87.2 58.6 88.3 58 89 58 L89 0 L0 0 Z" fill="#686068"/>
             <path d="M0 61.6 C1 61.5 3.7 61.4 6 61.2 C8.3 61 11.7 60.5 14 60.3 C16.3 60.1 18.2 59.8 20 59.9 C21.8 60 23.4 60.1 25 60.6 C26.6 61.1 28.8 62.6 29.6 63 L29.6 72 L0 72 Z" fill="#f0e8e0"/>
           </g>
           <path d="M46.8 64.9 C47.3 64.4 48.8 63 50 62.1 C51.2 61.2 52.7 60.2 54 59.5 C55.3 58.8 56.7 58.2 58 57.7 C59.3 57.2 60.7 56.9 62 56.7 C63.3 56.5 64.8 56.3 66 56.4 C67.2 56.5 68.6 56.8 69.5 57.1 C70.4 57.4 71.7 57.6 71.4 58 C71.2 58.4 69.2 59 68 59.5 C66.8 60 65.3 60.3 64 60.8 C62.7 61.3 61.7 62.1 60 62.6 C58.3 63.1 56 63.7 54 64.1 C52 64.5 49.2 64.9 48 65 C46.8 65.1 47 64.9 46.8 64.9 Z" fill="#f0e8e0"/>
           <path d="M17.2 55.5 C17.7 55.1 18.9 53.8 20 53.2 C21.1 52.6 22.7 52.2 24 51.9 C25.3 51.6 27.2 51.5 28 51.5 C28.8 51.5 29.2 51.6 28.9 52.1 C28.6 52.6 27.1 53.9 26 54.6 C24.9 55.3 23.2 56.2 22 56.5 C20.8 56.8 19.3 56.7 18.5 56.5 C17.7 56.3 17.4 55.7 17.2 55.5 Z" fill="#f0e8e0"/>
           <path d="M35 42.8 C35.8 42.2 38.5 41.1 40 39.2 C41.5 37.4 42.7 33.8 44 31.7 C45.3 29.6 46.7 27.6 48 26.5 C49.3 25.4 50.8 25.2 51.6 25.1 C52.4 25 52.9 25.3 53 26 C53.1 26.7 52.4 28.2 52 29.5 C51.6 30.8 50.6 32.5 50.4 34 C50.2 35.5 50.2 37.2 50.6 38.5 C51 39.8 51.9 40.7 53 41.6 C54.1 42.5 56.3 43.6 57 44 Z" fill="#686068"/>
           <path d="M29.3 60.5 C29.5 61.4 29.7 64 30.5 65.6 C31.3 67.1 32.8 68.6 34 69.8 C35.2 71 36.9 72.2 38 73 C39.1 73.8 40 74.8 40.6 74.9 C41.2 75 41.6 74.8 41.7 73.6 C41.8 72.4 41.5 69.9 41.4 68 C41.3 66.1 41.6 63.4 41 62.2 C40.4 61 38.5 60.9 38 60.6 Z" fill="#686068"/>`,
    // A grey stingray seen from above, swimming left with its tail out behind; the face stays upright.
    stingray: `<g transform="rotate(-90 50 50)"><path d="M45 50 Q49 74 50 94 Q52 74 55 50 Z" fill="${K.slate}"/>
           <path d="M50 14 C 66 18, 86 30, 94 42 C 83 48, 64 54, 50 62 C 36 54, 17 48, 6 42 C 14 30, 34 18, 50 14 Z" fill="${K.slate}"/>
           <path d="M50 20 C 62 24, 74 33, 78 40 C 68 44, 58 48, 50 54 C 42 48, 32 44, 22 40 C 26 33, 38 24, 50 20 Z" fill="${K.grey}"/>
           <circle cx="28" cy="40" r="2" fill="${K.mist}"/><circle cx="72" cy="40" r="2" fill="${K.mist}"/><circle cx="34" cy="46" r="1.5" fill="${K.mist}"/><circle cx="66" cy="46" r="1.5" fill="${K.mist}"/></g>
           <circle cx="27" cy="45" r="4.2" fill="${K.white}"/><circle cx="38" cy="45" r="4.2" fill="${K.white}"/>
           <circle cx="26" cy="46" r="2.2" fill="${K.ink}"/><circle cx="37" cy="46" r="2.2" fill="${K.ink}"/>
           <path d="M28 53 Q32.5 57 37 53" stroke="${K.ink}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
    shell: `<path d="M50 18 L18 70 Q50 86 82 70 Z" fill="${K.blush}"/><path d="M50 18 L32 74 M50 18 L50 78 M50 18 L68 74" stroke="${K.pink}" stroke-width="4" stroke-linecap="round"/>
           <rect x="40" y="70" width="20" height="10" rx="4" fill="${K.pink}"/>`,
    jelly: `<path d="M22 48 Q22 20 50 20 Q78 20 78 48 Q70 44 64 48 Q57 44 50 48 Q43 44 36 48 Q29 44 22 48 Z" fill="${K.lilac}"/>
           <path d="M32 50 Q28 64 34 74 M44 50 Q40 66 46 82 M56 50 Q60 66 54 82 M68 50 Q72 64 66 74" stroke="${K.purple}" stroke-width="4" fill="none" stroke-linecap="round"/>
           <ellipse cx="40" cy="32" rx="6" ry="4" fill="${K.white}" opacity=".7"/>`,
    seal: `<path d="M20 70 Q20 44 44 40 Q50 24 64 26 Q78 28 76 44 Q74 56 66 64 L80 74 Q66 80 56 72 Q38 80 20 70 Z" fill="${K.grey}"/>
           <path d="M40 66 Q34 76 26 78" stroke="${K.slate}" stroke-width="6" stroke-linecap="round" fill="none"/>
           <circle cx="62" cy="36" r="3" fill="${K.ink}"/><circle cx="72" cy="38" r="3" fill="${K.ink}"/><ellipse cx="68" cy="45" rx="3" ry="2" fill="${K.ink}"/>`,
    // A humpback-style whale, facing left, from Ernest's reference: navy with a speckled back, a long pale throat
    // with grooves, a small back fin, long spotted flippers and a tail pointing back with two broad flukes, all navy.
    whale: `<defs><clipPath id="whale-body"><path d="M2.5 47.2 C2.9 46.7 3.8 45 5 44.2 C6.2 43.4 7.8 42.8 10 42.3 C12.2 41.8 14.7 41.5 18 41.2 C21.3 41 26 40.8 30 40.8 C34 40.8 38 41 42 41.4 C46 41.8 50.3 42.3 54 43 C57.7 43.7 61 44.7 64 45.6 C67 46.5 69.7 47.6 72 48.2 C74.3 48.8 76.2 49.1 78 49.2 C79.8 49.3 81.7 49.1 83 49 C84.3 48.9 85.5 48.8 86 48.8 C85.5 48.7 83.9 48.6 83 48.2 C82.1 47.8 81.1 47.3 80.4 46.6 C79.7 45.9 79.1 45.1 78.6 44.2 C78.1 43.3 77.8 41.9 77.6 41.4 C78.1 41.5 79.4 41.7 80.4 42 C81.4 42.3 82.5 42.6 83.6 43 C84.7 43.4 85.9 43.8 86.8 44.2 C87.7 44.6 88.6 45 89.2 45.3 C89.8 45.6 90.3 45.9 90.5 46 C90.8 45.8 91.3 45.3 92 44.8 C92.7 44.3 93.7 43.7 94.6 43.2 C95.5 42.7 96.6 42.2 97.4 41.8 C98.2 41.4 99.2 41 99.6 40.8 C99.5 41.3 99.4 42.7 99 43.6 C98.6 44.5 98.1 45.5 97.4 46.4 C96.7 47.3 95.9 48.1 95 48.8 C94.1 49.5 93 50.3 92 50.8 C91 51.3 89.5 51.8 89 52 C88.2 52.2 85.8 52.9 84 53.4 C82.2 53.9 80 54.4 78 54.8 C76 55.2 74.3 55.6 72 56 C69.7 56.4 66.7 56.6 64 57 C61.3 57.4 59 58 56 58.6 C53 59.2 49.3 60.1 46 60.6 C42.7 61.1 39.3 61.7 36 61.8 C32.7 61.9 29.3 61.9 26 61.4 C22.7 60.9 19 60.1 16 59 C13 57.9 10 56 8 54.6 C6 53.2 4.9 52 4 50.8 C3.1 49.6 2.8 47.8 2.5 47.2 Z"/></clipPath></defs>
           <path d="M30 59 C30.7 59.6 32.7 61.2 34 62.5 C35.3 63.8 36.7 65.3 38 66.5 C39.3 67.7 41.1 69.1 42 69.4 C42.9 69.7 43.6 69.1 43.4 68.2 C43.2 67.3 42 65.3 41 64 C40 62.7 38.7 61.1 37.5 60.2 C36.3 59.3 34.6 58.8 34 58.5 Z" fill="#8fb8e6"/>
           <path d="M2.5 47.2 C2.9 46.7 3.8 45 5 44.2 C6.2 43.4 7.8 42.8 10 42.3 C12.2 41.8 14.7 41.5 18 41.2 C21.3 41 26 40.8 30 40.8 C34 40.8 38 41 42 41.4 C46 41.8 50.3 42.3 54 43 C57.7 43.7 61 44.7 64 45.6 C67 46.5 69.7 47.6 72 48.2 C74.3 48.8 76.2 49.1 78 49.2 C79.8 49.3 81.7 49.1 83 49 C84.3 48.9 85.5 48.8 86 48.8 C85.5 48.7 83.9 48.6 83 48.2 C82.1 47.8 81.1 47.3 80.4 46.6 C79.7 45.9 79.1 45.1 78.6 44.2 C78.1 43.3 77.8 41.9 77.6 41.4 C78.1 41.5 79.4 41.7 80.4 42 C81.4 42.3 82.5 42.6 83.6 43 C84.7 43.4 85.9 43.8 86.8 44.2 C87.7 44.6 88.6 45 89.2 45.3 C89.8 45.6 90.3 45.9 90.5 46 C90.8 45.8 91.3 45.3 92 44.8 C92.7 44.3 93.7 43.7 94.6 43.2 C95.5 42.7 96.6 42.2 97.4 41.8 C98.2 41.4 99.2 41 99.6 40.8 C99.5 41.3 99.4 42.7 99 43.6 C98.6 44.5 98.1 45.5 97.4 46.4 C96.7 47.3 95.9 48.1 95 48.8 C94.1 49.5 93 50.3 92 50.8 C91 51.3 89.5 51.8 89 52 C88.2 52.2 85.8 52.9 84 53.4 C82.2 53.9 80 54.4 78 54.8 C76 55.2 74.3 55.6 72 56 C69.7 56.4 66.7 56.6 64 57 C61.3 57.4 59 58 56 58.6 C53 59.2 49.3 60.1 46 60.6 C42.7 61.1 39.3 61.7 36 61.8 C32.7 61.9 29.3 61.9 26 61.4 C22.7 60.9 19 60.1 16 59 C13 57.9 10 56 8 54.6 C6 53.2 4.9 52 4 50.8 C3.1 49.6 2.8 47.8 2.5 47.2 Z" fill="#1f3566"/>
           <g clip-path="url(#whale-body)">
             <path d="M1 47.4 C1.7 47.7 3.2 48.6 5 49.3 C6.8 50 9.5 51 12 51.8 C14.5 52.6 17.3 53.4 20 53.9 C22.7 54.4 25.3 54.7 28 55 C30.7 55.3 33 55.4 36 55.8 C39 56.2 43 56.8 46 57.2 C49 57.6 51.7 57.9 54 58.4 C56.3 58.9 59 59.7 60 60 L60 80 L0 80 Z" fill="#9cc3ec"/>
             <path d="M1 48.4 C1.7 48.7 3.2 49.5 5 50.2 C6.8 51 9.5 52 12 52.8 C14.5 53.5 17.3 54.3 20 54.9 C22.7 55.4 25.3 55.6 28 56 C30.7 56.3 33 56.4 36 56.8 C39 57.1 43 57.7 46 58.2 C49 58.6 52.7 59.2 54 59.4 M1 49.3 C1.7 49.6 3.2 50.5 5 51.2 C6.8 51.9 9.5 52.9 12 53.7 C14.5 54.5 17.3 55.3 20 55.8 C22.7 56.3 25.3 56.6 28 56.9 C30.7 57.2 33 57.3 36 57.7 C39 58.1 43 58.7 46 59.1 C49 59.5 52.7 60.1 54 60.3 M1 50.2 C1.7 50.6 3.2 51.4 5 52.1 C6.8 52.9 9.5 53.9 12 54.6 C14.5 55.4 17.3 56.2 20 56.8 C22.7 57.3 25.3 57.5 28 57.9 C30.7 58.2 33 58.3 36 58.6 C39 59 43 59.6 46 60.1 C49 60.5 52.7 61 54 61.2 M1 51.2 C1.7 51.5 3.2 52.4 5 53.1 C6.8 53.8 9.5 54.8 12 55.6 C14.5 56.4 17.3 57.2 20 57.7 C22.7 58.2 25.3 58.5 28 58.8 C30.7 59.1 33 59.2 36 59.6 C39 60 43 60.6 46 61 C49 61.4 52.7 62 54 62.2 M1 52.1 C1.7 52.5 3.2 53.3 5 54 C6.8 54.8 9.5 55.8 12 56.5 C14.5 57.3 17.3 58.1 20 58.6 C22.7 59.2 25.3 59.4 28 59.8 C30.7 60.1 33 60.2 36 60.5 C39 60.9 43 61.5 46 62 C49 62.4 52.7 63 54 63.1 M1 53.1 C1.7 53.4 3.2 54.3 5 55 C6.8 55.7 9.5 56.7 12 57.5 C14.5 58.3 17.3 59.1 20 59.6 C22.7 60.1 25.3 60.4 28 60.7 C30.7 61 33 61.1 36 61.5 C39 61.9 43 62.5 46 62.9 C49 63.3 52.7 63.9 54 64.1 M1 54 C1.7 54.4 3.2 55.2 5 55.9 C6.8 56.7 9.5 57.7 12 58.4 C14.5 59.2 17.3 60 20 60.5 C22.7 61.1 25.3 61.3 28 61.6 C30.7 62 33 62.1 36 62.4 C39 62.8 43 63.4 46 63.9 C49 64.3 52.7 64.8 54 65 M1 55 C1.7 55.3 3.2 56.2 5 56.9 C6.8 57.6 9.5 58.6 12 59.4 C14.5 60.2 17.3 61 20 61.5 C22.7 62 25.3 62.3 28 62.6 C30.7 62.9 33 63 36 63.4 C39 63.8 43 64.4 46 64.8 C49 65.2 52.7 65.8 54 66" stroke="#4f6fa8" stroke-width="0.32" fill="none"/>
           </g>
           <g fill="#9cc3ec"><circle cx="28.2" cy="43.4" r="0.45"/> <circle cx="42.6" cy="43.5" r="0.38"/> <circle cx="37.6" cy="44.8" r="0.45"/> <circle cx="16.6" cy="45.7" r="0.38"/> <circle cx="17.1" cy="43.0" r="0.38"/> <circle cx="32.7" cy="47.8" r="0.38"/> <circle cx="19.4" cy="43.9" r="0.52"/> <circle cx="41.6" cy="49.0" r="0.52"/> <circle cx="39.4" cy="45.0" r="0.52"/> <circle cx="57.0" cy="45.4" r="0.38"/> <circle cx="51.8" cy="45.7" r="0.52"/> <circle cx="27.6" cy="47.7" r="0.45"/> <circle cx="22.0" cy="46.2" r="0.38"/> <circle cx="42.1" cy="45.3" r="0.45"/> <circle cx="38.1" cy="42.8" r="0.38"/> <circle cx="43.9" cy="46.0" r="0.52"/> <circle cx="27.8" cy="46.2" r="0.52"/> <circle cx="33.9" cy="44.3" r="0.45"/> <circle cx="49.0" cy="47.1" r="0.52"/> <circle cx="24.7" cy="46.1" r="0.45"/> <circle cx="37.1" cy="48.1" r="0.52"/> <circle cx="46.1" cy="44.8" r="0.45"/> <circle cx="20.7" cy="45.6" r="0.52"/> <circle cx="15.7" cy="46.7" r="0.45"/> <circle cx="47.6" cy="46.3" r="0.52"/> <circle cx="44.6" cy="47.2" r="0.38"/> <circle cx="51.0" cy="48.5" r="0.38"/> <circle cx="34.9" cy="46.7" r="0.45"/> <circle cx="50.2" cy="45.4" r="0.38"/> <circle cx="31.0" cy="46.7" r="0.52"/> <circle cx="15.0" cy="45.4" r="0.52"/> <circle cx="21.4" cy="43.2" r="0.52"/> <circle cx="31.2" cy="48.1" r="0.38"/> <circle cx="26.3" cy="45.1" r="0.45"/> <circle cx="29.8" cy="48.1" r="0.45"/> <circle cx="55.9" cy="48.1" r="0.38"/> <circle cx="36.7" cy="46.4" r="0.38"/> <circle cx="53.6" cy="48.1" r="0.38"/> <circle cx="31.3" cy="45.0" r="0.38"/> <circle cx="18.6" cy="46.5" r="0.52"/> <circle cx="23.2" cy="43.5" r="0.52"/> <circle cx="14.0" cy="43.4" r="0.45"/> <circle cx="18.5" cy="44.8" r="0.45"/> <circle cx="15.1" cy="48.1" r="0.38"/> <circle cx="41.0" cy="43.7" r="0.38"/> <circle cx="25.1" cy="44.7" r="0.38"/> <circle cx="30.0" cy="43.2" r="0.52"/> <circle cx="52.0" cy="47.5" r="0.45"/> <circle cx="21.3" cy="47.4" r="0.52"/> <circle cx="49.7" cy="48.5" r="0.52"/> <circle cx="55.2" cy="49.3" r="0.45"/> <circle cx="56.0" cy="46.6" r="0.52"/> <circle cx="42.7" cy="48.2" r="0.38"/> <circle cx="29.4" cy="46.0" r="0.52"/> <circle cx="19.8" cy="42.5" r="0.45"/> <circle cx="19.8" cy="48.3" r="0.38"/> <circle cx="39.7" cy="48.3" r="0.45"/> <circle cx="38.4" cy="47.5" r="0.38"/> <circle cx="54.1" cy="46.7" r="0.38"/> <circle cx="41.0" cy="46.0" r="0.45"/> <circle cx="33.9" cy="45.9" r="0.45"/> <circle cx="35.0" cy="48.5" r="0.38"/> <circle cx="44.8" cy="49.0" r="0.45"/> <circle cx="23.7" cy="48.6" r="0.45"/> <circle cx="57.6" cy="49.0" r="0.45"/> <circle cx="45.8" cy="43.6" r="0.52"/> <circle cx="16.8" cy="48.8" r="0.45"/> <circle cx="25.9" cy="43.2" r="0.38"/> <circle cx="47.4" cy="45.0" r="0.38"/> <circle cx="36.0" cy="43.6" r="0.45"/></g>
           <path d="M56 43.6 C56.7 43.4 58.8 42.9 60 42.4 C61.2 41.9 62.4 41.1 63.2 40.8 C64 40.5 64.3 40.3 64.6 40.6 C64.9 40.9 64.4 41.8 64.8 42.6 C65.2 43.4 66.6 44.9 67 45.4 Z" fill="#1f3566"/>
           <path d="M22 57 C22.7 57.6 24.7 59.2 26 60.5 C27.3 61.8 28.7 63.5 30 65 C31.3 66.5 32.6 68.1 34 69.5 C35.4 70.9 37.4 72.6 38.5 73.4 C39.6 74.2 40.4 74.4 40.6 74.2 C40.9 74 40.5 73.2 40 72 C39.5 70.8 38.4 68.7 37.5 67 C36.6 65.3 35.6 63.3 34.5 61.8 C33.4 60.3 31.6 58.6 31 58 Z" fill="#1f3566"/>
           <g fill="#9cc3ec"><circle cx="29" cy="62.6" r="0.7"/> <circle cx="32.3" cy="66.3" r="0.7"/> <circle cx="35.6" cy="69.7" r="0.7"/> <circle cx="38.6" cy="72.3" r="0.7"/></g>
           <ellipse cx="22.5" cy="50.6" rx="2.1" ry="1.3" fill="#ffffff"/><circle cx="22" cy="50.7" r="0.95" fill="#14213f"/>
           <path d="M20.2 49.4 Q22.5 48.3 24.8 49.4" stroke="#9cc3ec" stroke-width="0.5" fill="none" stroke-linecap="round"/>`,
    clownfish: `<path d="M70 50 L88 36 L88 64 Z" fill="${K.rust}"/><ellipse cx="46" cy="50" rx="28" ry="19" fill="${K.rust}"/>
           <path d="M34 32 Q30 50 34 68 M52 31 Q48 50 52 69" stroke="${K.white}" stroke-width="7" fill="none"/><circle cx="26" cy="46" r="4" fill="${K.ink}"/>`,
    star: `<path d="M50 14 L60 38 L86 40 L66 57 L72 84 L50 70 L28 84 L34 57 L14 40 L40 38 Z" fill="${K.orange}" stroke="${K.orange}" stroke-width="6" stroke-linejoin="round"/>
           <g fill="${K.cream}"><circle cx="50" cy="34" r="2.5"/><circle cx="62" cy="50" r="2.5"/><circle cx="38" cy="50" r="2.5"/><circle cx="56" cy="64" r="2.5"/><circle cx="44" cy="64" r="2.5"/></g>`,
  };

  // ---------- Numbers: each picture shows what its voice line counts (一只小狗, 三只小猫 …) ----------
  // Items are kept apart in tidy rows so a 4-year-old can count them. 二 is second place (第二名), since you count things with 两, not 二.
  const kitten = (c, d) => `<path d="M24 44 L26 14 L46 30 Z M76 44 L74 14 L54 30 Z" fill="${c}"/>
      <path d="M29 34 L30 22 L39 30 Z M71 34 L70 22 L61 30 Z" fill="${K.blush}"/>
      <ellipse cx="50" cy="54" rx="30" ry="27" fill="${c}"/><ellipse cx="50" cy="66" rx="14" ry="10" fill="${d}"/>
      <circle cx="39" cy="50" r="4" fill="${K.ink}"/><circle cx="61" cy="50" r="4" fill="${K.ink}"/>
      <path d="M46 60 H54 L50 65 Z" fill="${K.pink}"/>
      <path d="M36 62 H18 M36 67 L20 72 M64 62 H82 M64 67 L80 72" stroke="${K.ink}" stroke-width="2" stroke-linecap="round"/>`;
  const duckling = `<ellipse cx="58" cy="62" rx="30" ry="21" fill="${K.yellow}"/><path d="M60 58 Q72 50 82 60 Q72 70 60 64 Z" fill="${K.sun}"/>
      <circle cx="34" cy="38" r="18" fill="${K.yellow}"/><path d="M18 36 L4 42 L18 47 Z" fill="${K.orange}"/>
      <circle cx="30" cy="34" r="3.5" fill="${K.ink}"/><path d="M50 82 V88 M64 82 V88" stroke="${K.orange}" stroke-width="5" stroke-linecap="round"/>`;
  const balloon = (c, d) => `<path d="M50 74 Q45 80 51 84 Q56 88 50 92" stroke="${K.slate}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M45 76 L55 76 L50 68 Z" fill="${d}"/><ellipse cx="50" cy="40" rx="25" ry="29" fill="${c}"/>
      <ellipse cx="40" cy="28" rx="6" ry="9" fill="#ffffff" fill-opacity=".5" transform="rotate(20 40 28)"/>`;
  const bigStar = `<path d="M50 10 L61 37 L90 39 L68 58 L75 87 L50 71 L25 87 L32 58 L10 39 L39 37 Z" fill="${K.yellow}" stroke="${K.yellow}" stroke-width="6" stroke-linejoin="round"/>
      <circle cx="44" cy="40" r="6" fill="${K.cream}"/>`;
  const flowerHead = (c) => `<g fill="${c}"><circle cx="50" cy="20" r="15"/><circle cx="78" cy="41" r="15"/><circle cx="68" cy="74" r="15"/><circle cx="32" cy="74" r="15"/><circle cx="22" cy="41" r="15"/></g>
      <circle cx="50" cy="50" r="13" fill="${K.yellow}"/>`;
  // An open hand with five separate fingers, so each one can be counted. Thumb on the left (thumbs point outwards in 十).
  const openHand = `<g fill="${K.skin}"><rect x="30" y="48" width="44" height="40" rx="14"/>
      <rect x="31" y="20" width="9.5" height="40" rx="4.75"/><rect x="42.5" y="12" width="9.5" height="46" rx="4.75"/>
      <rect x="54" y="15" width="9.5" height="44" rx="4.75"/><rect x="65.5" y="24" width="8.5" height="36" rx="4.25"/>
</g>
      <path d="M36 74 L17 48" stroke="${K.skin}" stroke-width="9.5" stroke-linecap="round"/>`;
  const BALLOONS = [[K.red, K.berry], [K.blue, K.navy], [K.yellow, K.sun], [K.green, K.deep], [K.pink, K.rose], [K.purple, "#7a5fc4"], [K.orange, K.rust]];
  const grid = (cols, rows, x0, x1, y0, y1) => {
    const out = [];
    for (let r = 0; r < rows.length; r++) for (let c = 0; c < rows[r]; c++) {
      const n = rows[r], span = (x1 - x0) * (n - 1) / (cols - 1);
      out.push([50 - span / 2 + (n > 1 ? span * c / (n - 1) : 0), rows.length > 1 ? y0 + (y1 - y0) * r / (rows.length - 1) : (y0 + y1) / 2]);
    }
    return out;
  };
  Object.assign(ART, {
    "一": mini(ART["狗"], 50, 50, 1),
    "二": `<rect x="38" y="44" width="24" height="44" rx="3" fill="${K.mist}"/><rect x="62" y="64" width="26" height="24" rx="3" fill="${K.mist}"/>
      <rect x="12" y="56" width="26" height="32" rx="3" fill="${K.blue}"/>
      <g font-family="ui-rounded, system-ui, sans-serif" font-weight="800" text-anchor="middle">
        <text x="25" y="80" font-size="20" fill="${K.white}">2</text>
        <text x="50" y="70" font-size="16" fill="${K.white}">1</text><text x="75" y="82" font-size="14" fill="${K.white}">3</text></g>
      <path d="M18 36 L10 24 M32 36 L40 24" stroke="${K.skin}" stroke-width="5" stroke-linecap="round"/>
      <path d="M21 50 V56 M29 50 V56" stroke="${K.ink}" stroke-width="5" stroke-linecap="round"/>
      <rect x="16" y="32" width="18" height="20" rx="7" fill="${K.pink}"/>
      <circle cx="25" cy="22" r="9" fill="${K.skin}"/><path d="M16 21 Q17 11 25 11 Q33 11 34 21 Q30 15 25 15 Q20 15 16 21 Z" fill="${K.soil}"/>
      <circle cx="22" cy="22" r="1.5" fill="${K.ink}"/><circle cx="28" cy="22" r="1.5" fill="${K.ink}"/><path d="M22 26 Q25 28.5 28 26" stroke="${K.ink}" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      <path d="M21 32 L25 40 L29 32" stroke="${K.red}" stroke-width="2.5" fill="none"/><circle cx="25" cy="43" r="4.5" fill="#dfe4ee" stroke="${K.grey}" stroke-width="1.5"/>`,
    "三": [[30, 37, K.orange, K.cream], [70, 37, K.grey, K.white], [50, 69, K.wood, K.cream]]
      .map(([x, y, c, d]) => mini(kitten(c, d), x, y, 0.4)).join(""),
    "四": [[32, 36], [68, 36], [32, 64], [68, 64]].map(([x, y], i) => fish(x, y, 0.36, i)).join(""),
    "五": grid(3, [3, 2], 22, 78, 36, 66).map(([x, y], i) => mini(flowerHead([K.pink, K.red, K.purple, K.orange, K.rose][i]), x, y, 0.27)).join(""),
    "六": grid(3, [3, 3], 26, 74, 38, 66).map(([x, y]) => mini(duckling, x, y, 0.26)).join(""),
    "七": grid(4, [3, 4], 22, 78, 36, 64).map(([x, y]) => mini(bigStar, x, y, 0.2)).join(""),
    "八": `<path d="M33 42 Q20 40 12 48 Q8 54 13 56 M36 48 Q22 54 17 66 Q14 74 20 74 M40 54 Q30 66 27 82 M45 57 Q44 74 41 86 Q39 92 45 92
             M67 42 Q80 40 88 48 Q92 54 87 56 M64 48 Q78 54 83 66 Q86 74 80 74 M60 54 Q70 66 73 82 M55 57 Q56 74 59 86 Q61 92 55 92"
             stroke="${K.purple}" stroke-width="5.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="50" cy="36" rx="20" ry="20" fill="${K.purple}"/><circle cx="43" cy="36" r="3.5" fill="${K.ink}"/><circle cx="57" cy="36" r="3.5" fill="${K.ink}"/>
      <path d="M46 43 Q50 46 54 43" stroke="${K.ink}" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="43" cy="25" rx="5" ry="3.5" fill="${K.lilac}"/>`,
    "九": grid(3, [3, 3, 3], 26, 74, 23, 71).map(([x, y], i) => mini(balloon(...BALLOONS[i % BALLOONS.length]), x, y, 0.26)).join(""),
    "十": mini(openHand, 30, 52, 0.56) + mini(openHand, 70, 52, 0.56, true),
  });

  // ---------- Pictures of the word the voice says ----------
  // The voice says the character, then a word with it (火，火车), so each picture shows that word: a train for 火车,
  // not a fire. These replace pictures that showed the character's own meaning.
  const star5 = (x, y, r, c, rot = -90) => {
    const p = [];
    for (let i = 0; i < 10; i++) {
      const a = ((rot + i * 36) * Math.PI) / 180, d = i % 2 ? r * 0.42 : r;
      p.push(`${(x + d * Math.cos(a)).toFixed(1)} ${(y + d * Math.sin(a)).toFixed(1)}`);
    }
    return `<path d="M${p.join(" L")} Z" fill="${c}"/>`;
  };
  // A raised hand seen from the back, thumb on the left (a right hand); flipped for a left hand.
  const backHand = `<path d="M30 86 V54 Q30 46 36 46 V26 Q36 20 41 20 Q46 20 46 26 V44 V20 Q46 14 51 14 Q56 14 56 20 V44 V24 Q56 18 61 18 Q66 18 66 24 V48 V34 Q66 28 71 28 Q76 28 76 34 V62 Q76 86 54 86 Z" fill="${K.skin}"/>
      <path d="M30 60 Q20 50 18 40 Q16 34 22 34 Q28 36 32 48" fill="${K.skin}"/>`;
  const tooth = `<path d="M30 30 Q30 18 42 20 Q50 24 58 20 Q70 18 70 30 Q70 46 64 56 L60 80 Q57 86 54 78 L50 62 L46 78 Q43 86 40 80 L36 56 Q30 46 30 30 Z" fill="${K.white}" stroke="${K.mist}" stroke-width="2"/>`;
  const bubble = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${K.white}" stroke="${K.blue}" stroke-width="1.8"/><circle cx="${x - r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.25}" fill="${K.sky}"/>`;
  const sunDisc = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${K.yellow}"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.28}" fill="${K.cream}"/>`;
  const doorway = (dark = K.hair) => `<rect x="14" y="18" width="72" height="66" rx="4" fill="${K.cream}"/><rect x="34" y="32" width="32" height="52" rx="3" fill="${dark}"/>`;

  Object.assign(ART, {
    // 小鱼: one little fish in the water
    "小": `${SKY}${fish(52, 52, 0.42, 1)}${bubble(28, 40, 3.5)}${bubble(32, 30, 2.5)}${bubble(26, 22, 2)}`,
    // 左手, 右手: a raised hand, with an arrow to its side
    "左": `${mini(backHand, 56, 42, 0.62, true)}${arrow("M64 80 H26 M36 70 L26 80 L36 90", K.green)}`,
    "右": `${mini(backHand, 44, 42, 0.62)}${arrow("M36 80 H74 M64 70 L74 80 L64 90", K.blue)}`,
    // 中间: the red ball in the middle of three, with an arrow pointing at it
    "中": `<rect x="12" y="68" width="76" height="7" rx="3.5" fill="${K.slate}"/>
      <circle cx="24" cy="58" r="10" fill="${K.mist}"/><circle cx="76" cy="58" r="10" fill="${K.mist}"/>
      <circle cx="50" cy="53" r="15" fill="${K.red}"/><circle cx="45" cy="48" r="4" fill="#ff9a9a"/>
      ${arrow("M50 12 V30 M41 22 L50 31 L59 22", K.blue)}`,
    // 大人: a grown-up holding a child's hand
    "人": `${person(38, 86, 1.12, { pose: "stand", shirt: K.blue, hair: K.ink })}${person(68, 86, 0.66, { pose: "stand", shirt: K.pink, long: true })}
      <path d="M50 66 Q56 70 60 74" stroke="${K.skin}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    // 门口: the doorway, with a mat and shoes left by the door
    "口": `<rect x="14" y="16" width="72" height="68" rx="4" fill="${K.cream}"/><path d="M14 22 H86" stroke="${K.wood}" stroke-width="5"/>
      <rect x="34" y="30" width="32" height="50" rx="3" fill="${K.brown}"/><rect x="38" y="35" width="24" height="18" rx="2" fill="${K.wood}"/><rect x="38" y="57" width="24" height="18" rx="2" fill="${K.wood}"/>
      <circle cx="61" cy="56" r="2.5" fill="${K.yellow}"/>${tree(22, 70, 0.3)}
      <rect x="26" y="80" width="48" height="7" rx="3.5" fill="${K.red}"/>
      <path d="M33 82 Q33 76 39 77 L45 79 Q47 82 44 83 Z M47 82 Q47 76 53 77 L59 79 Q61 82 58 83 Z" fill="${K.blue}"/>`,
    // 开心: a big happy face
    "心": `<circle cx="50" cy="50" r="34" fill="${K.yellow}"/><path d="M33 44 Q38 37 43 44 M57 44 Q62 37 67 44" stroke="${K.ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M32 56 Q50 80 68 56 Z" fill="${K.ink}"/><path d="M40 66 Q50 74 60 66 Q56 72 50 72 Q44 72 40 66 Z" fill="${K.red}"/>
      <ellipse cx="29" cy="56" rx="5" ry="3.5" fill="${K.blush}"/><ellipse cx="71" cy="56" rx="5" ry="3.5" fill="${K.blush}"/>
      ${heart(80, 20, 0.45, K.pink)}${heart(18, 24, 0.35, K.pink)}`,
    // 洗手: hands under the tap, with soap bubbles
    "手": `<path d="M16 20 H50 Q58 20 58 28 V32" stroke="${K.grey}" stroke-width="8" fill="none" stroke-linecap="round"/><rect x="22" y="12" width="8" height="10" rx="2" fill="${K.slate}"/>
      <path d="M55 36 V48 M61 36 V46" stroke="${K.blue}" stroke-width="3.5" stroke-linecap="round"/>
      ${mini(backHand, 48, 70, 0.42, true)}${mini(backHand, 68, 70, 0.42)}
      ${bubble(30, 54, 5)}${bubble(80, 48, 4)}${bubble(24, 70, 3.5)}${bubble(84, 64, 3)}`,
    // 刷牙: a toothbrush with foam, brushing a tooth
    "牙": `${mini(tooth, 38, 54, 0.62)}
      <g transform="rotate(-35 66 46)"><rect x="60" y="30" width="44" height="9" rx="4.5" fill="${K.blue}"/><rect x="58" y="22" width="16" height="10" rx="2" fill="${K.white}" stroke="${K.mist}" stroke-width="2"/></g>
      ${bubble(48, 30, 4)}${bubble(56, 24, 3)}${bubble(44, 22, 2.5)}${bubble(60, 34, 2.5)}`,
    // 梳头: combing long hair
    "头": `${bust(46, 46, 1.5, { hairStyle: "long", shirt: K.pink })}
      <g transform="rotate(-20 66 24)"><rect x="50" y="18" width="34" height="8" rx="3" fill="${K.purple}"/>
      <path d="M54 26 V33 M58 26 V33 M62 26 V33 M66 26 V33 M70 26 V33 M74 26 V33 M78 26 V33" stroke="${K.purple}" stroke-width="2.5" stroke-linecap="round"/></g>`,
    // 足球: a football
    "足": `<circle cx="50" cy="50" r="32" fill="${K.white}" stroke="${K.slate}" stroke-width="3"/>
      <path d="M50 38 L61.4 46.3 L57.1 59.7 L42.9 59.7 L38.6 46.3 Z" fill="${K.ink}"/>
      <path d="M50 38 V20 M61.4 46.3 L78 40 M57.1 59.7 L68 74 M42.9 59.7 L32 74 M38.6 46.3 L22 40" stroke="${K.slate}" stroke-width="3" stroke-linecap="round"/>
      <path d="M42 20 L50 18 L58 20 L56 24 H44 Z M78 32 L82 40 L80 50 L76 46 L76 36 Z M22 32 L18 40 L20 50 L24 46 L24 36 Z M64 74 L72 72 L74 78 L66 80 Z M36 74 L28 72 L26 78 L34 80 Z" fill="${K.ink}"/>`,
    // 从前: "once upon a time", a storybook with a castle rising out of it
    "从": `<path d="M50 62 Q34 54 14 58 V84 Q34 80 50 88 Q66 80 86 84 V58 Q66 54 50 62 Z" fill="${K.purple}"/>
      <path d="M50 64 Q36 58 19 61 V80 Q36 77 50 84 Z" fill="${K.white}"/><path d="M50 64 Q64 58 81 61 V80 Q64 77 50 84 Z" fill="#f4f8fb"/>
      <rect x="34" y="32" width="32" height="26" fill="${K.lilac}"/><rect x="28" y="22" width="10" height="36" fill="${K.lilac}"/><rect x="62" y="22" width="10" height="36" fill="${K.lilac}"/>
      <path d="M26 22 L33 12 L40 22 Z M60 22 L67 12 L74 22 Z" fill="${K.pink}"/><path d="M45 58 V48 Q50 42 55 48 V58 Z" fill="${K.purple}"/>
      <path d="M67 12 V4 M67 4 L75 7 L67 10" stroke="${K.rose}" stroke-width="2" fill="${K.rose}"/>
      ${star5(18, 36, 4, K.yellow)}${star5(84, 34, 3.5, K.yellow)}`,
    // 爬山: climbing a mountain, with a flag at the top
    "山": `<path d="M10 80 L44 24 L60 48 L68 38 L90 80 Z" fill="${K.hill}"/><path d="M44 24 L51 36 L46 33 L42 37 L38 34 Z" fill="${K.white}"/>
      <rect x="10" y="78" width="80" height="5" rx="2.5" fill="${K.deep}"/>
      <path d="M44 24 V10" stroke="${K.slate}" stroke-width="2.5"/><path d="M44 10 L56 13 L44 17 Z" fill="${K.red}"/>
      <g transform="rotate(-30 30 62)">${person(30, 66, 0.42, { pose: "walk", shirt: K.orange })}</g>`,
    // 山川: mountains with a river running down from them
    "川": `${SKY}<path d="M10 56 L30 28 L44 46 L58 24 L84 56 Z" fill="${K.hill}"/><path d="M58 24 L64 32 L58 30 L53 32 Z M30 28 L35 35 L30 33 L26 35 Z" fill="${K.white}"/>
      <path d="M10 54 H90 V70 Q90 90 50 90 Q10 90 10 70 Z" fill="${K.green}"/>
      <path d="M48 54 Q38 64 50 72 Q62 80 46 90 H62 Q74 78 62 70 Q52 62 58 54 Z" fill="${K.blue}"/>`,
    // 喝水: a glass of water with a straw
    "水": `<path d="M60 34 L70 10 L76 12" stroke="${K.pink}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M28 26 H72 L66 86 H34 Z" fill="${K.white}" stroke="${K.mist}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M31 44 H69 L66 83 H34 Z" fill="${K.blue}"/><path d="M38 52 Q38 68 42 76" stroke="${K.white}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M60 34 L54 80" stroke="${K.pink}" stroke-width="4" stroke-linecap="round"/>`,
    // 火车: a train
    "火": `<circle cx="28" cy="18" r="6" fill="${K.mist}"/><circle cx="20" cy="10" r="4" fill="${K.mist}"/>
      <rect x="22" y="26" width="10" height="16" rx="2" fill="${K.slate}"/>
      <rect x="14" y="40" width="44" height="28" rx="5" fill="${K.red}"/><rect x="52" y="26" width="30" height="42" rx="4" fill="${K.blue}"/>
      <rect x="58" y="32" width="18" height="14" rx="3" fill="${K.sky}"/><rect x="48" y="24" width="38" height="6" rx="3" fill="${K.navy}"/>
      <path d="M14 66 L6 74 H16" fill="${K.slate}"/><rect x="10" y="66" width="76" height="6" rx="3" fill="${K.ink}"/>
      <circle cx="26" cy="76" r="8" fill="${K.ink}"/><circle cx="26" cy="76" r="3" fill="${K.mist}"/><circle cx="46" cy="76" r="8" fill="${K.ink}"/><circle cx="46" cy="76" r="3" fill="${K.mist}"/>
      <circle cx="70" cy="76" r="8" fill="${K.ink}"/><circle cx="70" cy="76" r="3" fill="${K.mist}"/><circle cx="20" cy="50" r="3" fill="${K.yellow}"/>`,
    // 木头: a pile of logs
    "木": [[26, 66], [50, 66], [74, 66], [38, 44], [62, 44]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="${K.brown}"/>
      <circle cx="${x}" cy="${y}" r="9.5" fill="${K.wood}"/><circle cx="${x}" cy="${y}" r="5.5" fill="none" stroke="${K.brown}" stroke-width="1.8"/><circle cx="${x}" cy="${y}" r="1.8" fill="${K.brown}"/>`).join(""),
    // 日出: the sun coming up over the hills
    "日": `<circle cx="50" cy="50" r="40" fill="#ffe3b3"/>
      <path d="M50 18 V26 M26 30 L32 36 M74 30 L68 36 M14 52 H22 M78 52 H86" stroke="${K.sun}" stroke-width="5" stroke-linecap="round"/>
      ${sunDisc(50, 60, 22)}<path d="M10 62 Q30 52 50 62 Q70 52 90 62 V70 Q90 90 50 90 Q10 90 10 70 Z" fill="${K.hill}"/>
      <path d="M10 72 Q34 64 58 74 Q76 66 90 72 V76 Q86 90 50 90 Q14 90 10 76 Z" fill="${K.green}"/>`,
    // 明天: tomorrow, the next page of the calendar
    "明": `<path d="M30 16 A13 13 0 1 0 40 36 A10 10 0 1 1 30 16 Z" fill="${K.purple}"/>${star5(14, 40, 3, K.lilac)}
      <rect x="44" y="34" width="42" height="48" rx="5" fill="${K.white}" stroke="${K.mist}" stroke-width="2.5"/><rect x="44" y="34" width="42" height="12" rx="5" fill="${K.red}"/>
      <path d="M54 30 V38 M76 30 V38" stroke="${K.slate}" stroke-width="3" stroke-linecap="round"/>${sunDisc(65, 64, 11)}
      ${arrow("M22 56 Q22 76 36 78", K.pink)}<path d="M34 70 L44 78 L34 86 Z" fill="${K.pink}"/>`,
    // 天气: the weather, sun, cloud and rain
    "气": `<path d="M34 14 V20 M14 34 H20 M20 20 L24 24 M48 20 L44 24" stroke="${K.sun}" stroke-width="4" stroke-linecap="round"/>${sunDisc(34, 34, 14)}
      ${cloud(56, 52, 1.25, K.mist)}<path d="M40 76 l-3 8 M54 76 l-3 8 M68 76 l-3 8" stroke="${K.blue}" stroke-width="4.5" stroke-linecap="round"/>`,
    // 电视: a television showing a fish
    "电": `<path d="M40 14 L50 26 L62 12" stroke="${K.slate}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <rect x="14" y="26" width="72" height="50" rx="8" fill="${K.slate}"/><rect x="20" y="32" width="50" height="38" rx="4" fill="${K.sky}"/>
      ${fish(45, 51, 0.32, 0)}<circle cx="78" cy="40" r="3.5" fill="${K.mist}"/><circle cx="78" cy="52" r="3.5" fill="${K.mist}"/>
      <path d="M30 76 L24 86 M70 76 L76 86" stroke="${K.slate}" stroke-width="4" stroke-linecap="round"/>`,
    // 阳光: sunshine pouring down on a flower
    "光": `<path d="M30 30 L52 86 H72 Z M30 30 L84 66 L80 80 Z M30 30 L24 86 H40 Z" fill="${K.yellow}" opacity=".35"/>
      <path d="M30 6 V12 M8 30 H14 M14 14 L18 18 M46 14 L42 18 M14 46 L18 42" stroke="${K.sun}" stroke-width="4" stroke-linecap="round"/>${sunDisc(30, 30, 14)}
      <path d="M14 84 Q50 76 86 84" stroke="${K.green}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M62 82 V66" stroke="${K.deep}" stroke-width="3"/>${mini(flowerHead(K.pink), 62, 60, 0.2)}`,
    // 牛奶: a carton of milk and a glass
    "牛": `<path d="M20 34 L30 20 H52 L60 34 Z" fill="${K.mist}"/><rect x="20" y="34" width="40" height="52" rx="3" fill="${K.white}" stroke="${K.mist}" stroke-width="2"/>
      <rect x="20" y="48" width="40" height="22" fill="${K.blue}"/><path d="M27 54 Q31 50 35 54 Q33 60 27 58 Z M45 60 Q49 56 53 60 Q51 66 45 64 Z" fill="${K.white}"/>
      <path d="M62 50 H84 L81 86 H65 Z" fill="${K.white}" stroke="${K.mist}" stroke-width="2.5" stroke-linejoin="round"/><path d="M63.5 58 H82.5 L80.5 84 H65.5 Z" fill="#f4f8fb"/>`,
    // 种花: planting a flower in a pot, with a watering can
    "花": `<path d="M40 60 V40" stroke="${K.deep}" stroke-width="4" stroke-linecap="round"/><path d="M40 52 Q28 46 26 38 Q36 40 40 50 Z" fill="${K.green}"/>
      ${mini(flowerHead(K.pink), 40, 30, 0.3)}
      <path d="M20 58 H60 L54 88 H26 Z" fill="${K.rust}"/><rect x="17" y="56" width="46" height="8" rx="3" fill="${K.orange}"/>
      <path d="M70 52 L58 40" stroke="${K.blue}" stroke-width="4" stroke-linecap="round"/><rect x="66" y="46" width="22" height="20" rx="4" fill="${K.blue}"/>
      <path d="M86 50 Q94 56 86 62" stroke="${K.navy}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M54 42 L50 48 M58 46 L55 52 M50 38 L46 42" stroke="${K.blue}" stroke-width="2.5" stroke-linecap="round"/>`,
    // 水果: fruit, an apple, a banana and grapes
    "果": `${mini(ART["果"], 34, 58, 0.48)}
      <path d="M50 28 Q80 26 86 52 Q72 40 52 36 Z" fill="${K.yellow}" stroke="${K.sun}" stroke-width="2" stroke-linejoin="round"/>
      <g fill="${K.purple}"><circle cx="64" cy="58" r="6"/><circle cx="76" cy="58" r="6"/><circle cx="70" cy="68" r="6"/><circle cx="58" cy="68" r="6"/><circle cx="82" cy="68" r="6"/><circle cx="64" cy="78" r="6"/><circle cx="76" cy="78" r="6"/><circle cx="70" cy="87" r="5.5"/></g>
      <path d="M70 52 V46" stroke="${K.deep}" stroke-width="3" stroke-linecap="round"/>`,
    // 入口: the way in, an arrow going into the doorway
    "入": `${doorway()}<path d="M38 36 Q50 34 62 36 V80 H38 Z" fill="${K.yellow}" opacity=".25"/>${arrow("M10 66 H50 M40 56 L50 66 L40 76", K.green)}`,
    // 出口: the way out, someone walking out of the door
    "出": `${doorway()}${arrow("M44 22 H76 M68 14 L76 22 L68 30", K.orange)}${person(66, 86, 0.66, { pose: "walk", shirt: K.green })}`,
    // 开窗: opening the window
    "开": `<rect x="14" y="14" width="72" height="72" rx="4" fill="${K.cream}"/>
      <rect x="28" y="26" width="44" height="46" rx="2" fill="${K.sky}" stroke="${K.white}" stroke-width="4"/>${cloud(52, 44, 0.5)}
      <path d="M28 26 L16 20 V78 L28 72 Z" fill="${K.blue}"/><path d="M72 26 L84 20 V78 L72 72 Z" fill="${K.blue}"/>
      <rect x="22" y="74" width="56" height="6" rx="3" fill="${K.wood}"/>`,
    // 关灯: turning the light off, a switch flicked down and a dark bulb
    "关": `${bulb(34, 50, 0.85, false)}
      <rect x="58" y="30" width="26" height="40" rx="7" fill="${K.mist}"/><rect x="64" y="50" width="14" height="14" rx="4" fill="${K.slate}"/><path d="M71 40 V36 M71 74 V80" stroke="${K.slate}" stroke-width="2"/>
      <path d="M78 18 A9 9 0 1 0 88 28 A7 7 0 1 1 78 18 Z" fill="${K.purple}"/>`,
    // 开门: the door swinging open
    "门": `<rect x="26" y="16" width="48" height="70" rx="4" fill="${K.yellow}"/><path d="M30 20 L54 26 V90 L30 84 Z" fill="${K.brown}"/>
      <circle cx="49" cy="58" r="3" fill="${K.yellow}"/>`,
    // 女儿: a daughter, with her dad
    "女": `${bust(66, 40, 1.05, { hairStyle: "short", shirt: K.navy, hair: K.ink })}${bust(42, 56, 1.15, { hairStyle: "pigtails", shirt: K.pink })}${heart(78, 74, 0.45, K.pink)}`,
    // 你好: hello, a child waving
    "好": `${bust(46, 46, 1.4, { hairStyle: "bob", shirt: K.yellow })}
      <path d="M70 84 Q76 64 76 44" stroke="${K.skin}" stroke-width="8" fill="none" stroke-linecap="round"/>
      ${mini(backHand, 77, 34, 0.26)}<path d="M88 22 Q92 30 88 38 M64 20 Q60 26 62 32" stroke="${K.sun}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    // 我们: us, friends holding hands
    "我": `${person(23, 86, 0.82, { pose: "wide", shirt: K.pink, long: true })}${person(50, 86, 0.9, { pose: "wide", shirt: K.blue })}${person(77, 86, 0.82, { pose: "wide", shirt: K.green })}${heart(50, 22, 0.5, K.pink)}`,
    // 可爱: cute, a kitten with big shiny eyes
    "爱": `${mini(kitten(K.orange, K.cream), 50, 52, 0.95)}
      <circle cx="40" cy="50" r="7" fill="${K.ink}"/><circle cx="60" cy="50" r="7" fill="${K.ink}"/><circle cx="42.5" cy="47.5" r="2.5" fill="${K.white}"/><circle cx="62.5" cy="47.5" r="2.5" fill="${K.white}"/>
      <ellipse cx="32" cy="60" rx="5" ry="3" fill="${K.blush}"/><ellipse cx="68" cy="60" rx="5" ry="3" fill="${K.blush}"/>${heart(80, 18, 0.45, K.pink)}`,
  });

  // ---------- Buttons and small marks (simple line icons) ----------
  const line = (d, extra = "") => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${d}${extra}</svg>`;
  const ICONS = {
    home: line(`<path d="M3 11 L12 4 L21 11"/><path d="M5.5 9.5 V20 H18.5 V9.5"/><path d="M10 20 V14 H14 V20"/>`),
    speaker: line(`<path d="M4 9.5 H8 L13 5 V19 L8 14.5 H4 Z" fill="currentColor"/><path d="M16.5 9 Q18.5 12 16.5 15 M19 6.5 Q23 12 19 17.5"/>`),
    eye: line(`<path d="M2 12 Q12 3 22 12 Q12 21 2 12 Z"/><circle cx="12" cy="12" r="3.2" fill="currentColor"/>`),
    pencil: line(`<path d="M4 20 L5 15 L16 4 L20 8 L9 19 Z"/><path d="M13.5 6.5 L17.5 10.5"/>`),
    next: line(`<path d="M4 12 H19 M13 6 L19 12 L13 18"/>`),
    book: line(`<path d="M12 6 Q8 3.5 3 4.5 V19 Q8 18 12 20 Q16 18 21 19 V4.5 Q16 3.5 12 6 Z"/><path d="M12 6 V20"/>`),
    // The parent corner: a grown-up with a small padlock (it's for grown-ups, behind a 3-second hold)
    parent: line(`<circle cx="9.5" cy="6.8" r="3.6"/><path d="M2.8 21 V18.6 Q2.8 13.4 9.5 13.4 Q11.6 13.4 12.9 14"/>`,
      `<rect x="13.6" y="15.6" width="8.6" height="6.6" rx="1.6" fill="currentColor" stroke="none"/><path d="M15.6 15.8 V14 Q15.6 11.4 17.9 11.4 Q20.2 11.4 20.2 14 V15.8" stroke-width="2"/>`),
    music: line(`<path d="M9 18 V5.5 L19 3.5 V16"/><ellipse cx="6.5" cy="18" rx="2.6" ry="2.1" fill="currentColor"/><ellipse cx="16.5" cy="16" rx="2.6" ry="2.1" fill="currentColor"/>`),
    musicOff: line(`<path d="M9 18 V5.5 L19 3.5 V16" opacity=".45"/><ellipse cx="6.5" cy="18" rx="2.6" ry="2.1" fill="currentColor" opacity=".45"/><ellipse cx="16.5" cy="16" rx="2.6" ry="2.1" fill="currentColor" opacity=".45"/><path d="M3.5 3.5 L20.5 20.5"/>`),
    close: line(`<path d="M6 6 L18 18 M18 6 L6 18"/>`),
    lock: line(`<rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor"/><path d="M8 10.5 V8 Q8 4 12 4 Q16 4 16 8 V10.5"/>`),
  };
  // The trophy for a character finished in practice mode
  const TROPHY = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4 H17 V9 Q17 14 12 14 Q7 14 7 9 Z" fill="#ffc83d" stroke="#e8a200" stroke-width="1.1" stroke-linejoin="round"/>
    <path d="M7 5.5 H4.5 Q4.2 9.6 7.4 10.2 M17 5.5 H19.5 Q19.8 9.6 16.6 10.2" fill="none" stroke="#e8a200" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M10.6 14 H13.4 V17 H10.6 Z" fill="#e8a200"/><rect x="8" y="17" width="8" height="3.2" rx="1" fill="#f06aa6"/>
    <path d="M10 6.5 Q10 9.5 12 10.5" stroke="#fff6cf" stroke-width="1.1" fill="none" stroke-linecap="round"/></svg>`;
  const STAR = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5 L14.8 8.6 L21.5 9.3 L16.5 13.8 L17.9 20.4 L12 17 L6.1 20.4 L7.5 13.8 L2.5 9.3 L9.2 8.6 Z" fill="#ffc83d" stroke="#e8a200" stroke-width="1.2" stroke-linejoin="round"/></svg>`;

  // ---------- Background scenes, one per category ----------
  // Water colours (top, middle, deep), the sand, and plants along the bottom (a 1000×300 strip).
  const kelp = (x, h, c) => `<path d="M${x} 300 C${x - 18} ${300 - h * 0.3} ${x + 18} ${300 - h * 0.6} ${x} ${300 - h} C${x + 22} ${300 - h * 0.6} ${x - 2} ${300 - h * 0.3} ${x + 14} 300 Z" fill="${c}"/>
      <ellipse cx="${x + 8}" cy="${300 - h * 0.55}" rx="9" ry="4" fill="${c}" transform="rotate(-30 ${x + 8} ${300 - h * 0.55})"/>`;
  const coral = (x, s, c) => `<g transform="translate(${x} 300) scale(${s})" fill="${c}">
      <rect x="-6" y="-70" width="12" height="70" rx="6"/><rect x="-30" y="-50" width="10" height="44" rx="5"/><rect x="20" y="-56" width="10" height="50" rx="5"/>
      <rect x="-30" y="-16" width="60" height="10" rx="5"/><circle cx="0" cy="-72" r="9"/><circle cx="-25" cy="-52" r="8"/><circle cx="25" cy="-58" r="8"/></g>`;
  const rock = (x, w, h, c) => `<ellipse cx="${x}" cy="300" rx="${w}" ry="${h}" fill="${c}"/>`;
  const grass = (x, h, c) => `<path d="M${x} 300 Q${x - 10} ${300 - h / 2} ${x - 4} ${300 - h} Q${x + 2} ${300 - h / 2} ${x + 6} 300 M${x + 10} 300 Q${x + 16} ${300 - h / 2} ${x + 22} ${300 - h * 0.8} Q${x + 18} ${300 - h / 2} ${x + 16} 300" fill="${c}"/>`;
  const anemone = (x, c, d) => `<g transform="translate(${x} 284)"><path d="M-14 16 Q-18 -6 -10 -16 M-6 16 Q-8 -10 -2 -20 M4 16 Q6 -10 4 -20 M12 16 Q18 -6 12 -16" stroke="${c}" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="0" cy="12" r="10" fill="${d}"/></g>`;
  const shellAt = (x, c) => `<path transform="translate(${x} 292)" d="M0 -14 L-12 6 Q0 12 12 6 Z" fill="${c}"/>`;
  const starAt = (x, c) => `<path transform="translate(${x} 290) scale(.45)" d="M0 -26 L8 -8 L28 -8 L12 4 L18 24 L0 12 L-18 24 L-12 4 L-28 -8 L-8 -8 Z" fill="${c}"/>`;
  const glow = (x, y) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff6a8" opacity=".8"/>`;
  const SCENES = {
    home: { water: ["#7fd3e8", "#1f86b8", "#0b4f7a"], sand: "#f6e7c8", plants: kelp(60, 140, "#3f8f6b") + kelp(930, 170, "#3f8f6b") + rock(820, 60, 26, "#9aa6c4") },
    reef: { water: ["#8fe0f0", "#2fa6c9", "#0d5f86"], sand: "#f6e7c8",
      plants: coral(90, 1.1, "#f06aa6") + coral(230, 0.8, "#f6a04d") + coral(780, 1, "#9b7fe0") + coral(920, 1.2, "#f08a3c") + shellAt(500, "#ffb3d1") },
    lagoon: { water: ["#b4f0e4", "#3cbfae", "#11707a"], sand: "#f3e3bd",
      plants: rock(120, 90, 40, "#8592b4") + rock(200, 50, 26, "#9aa6c4") + coral(860, 0.9, "#ffc83d") + rock(940, 70, 30, "#8592b4") },
    twilight: { water: ["#b9a8f0", "#6a55c4", "#2a1f6b"], sand: "#d9cfe8",
      plants: kelp(70, 200, "#7a5fc4") + kelp(140, 140, "#9b7fe0") + kelp(880, 220, "#7a5fc4") + glow(300, 120) + glow(620, 80) + glow(720, 160) + glow(420, 200) },
    kelp: { water: ["#a9e6d0", "#2f9e86", "#0e5148"], sand: "#e8dcb5",
      plants: kelp(40, 260, "#3f8f6b") + kelp(110, 200, "#5fb68f") + kelp(180, 240, "#3f8f6b") + kelp(820, 230, "#5fb68f") + kelp(900, 270, "#3f8f6b") + kelp(960, 190, "#5fb68f") },
    shallows: { water: ["#d6f6ff", "#6fd0ef", "#1f86b8"], sand: "#fbefd2",
      plants: shellAt(150, "#ffb3d1") + starAt(260, "#f6a04d") + shellAt(760, "#c7b5f2") + starAt(880, "#f06aa6") + grass(560, 50, "#6cc070") },
    seagrass: { water: ["#c4f1d9", "#4fbf95", "#1c6e5a"], sand: "#efe2bf",
      plants: [30, 80, 140, 200, 260, 720, 780, 840, 900, 960].map((x, i) => grass(x, 70 + (i % 3) * 30, i % 2 ? "#6cc070" : "#3f8f6b")).join("") },
    garden: { water: ["#e4f7c6", "#86c86a", "#2f7a4a"], sand: "#f4e6c0",
      plants: anemone(100, "#f06aa6", "#ffc83d") + anemone(190, "#ffb000", "#f06aa6") + grass(260, 80, "#3f8f6b") + anemone(800, "#9b7fe0", "#ffc83d") + anemone(900, "#f06aa6", "#4cb8ea") + grass(960, 90, "#3f8f6b") },
    sandbar: { water: ["#c9f2fb", "#53bfe0", "#1b7aa3"], sand: "#f8e2b0",
      plants: starAt(120, "#ef5b5b") + shellAt(220, "#ffb3d1") + starAt(330, "#ffc83d") + shellAt(700, "#c7b5f2") + starAt(820, "#f06aa6") + shellAt(930, "#ffe08a") },
    rocks: { water: ["#b8dcf0", "#4d8fbf", "#1c4a70"], sand: "#d8d2c4",
      plants: rock(80, 110, 70, "#8592b4") + rock(190, 60, 40, "#9aa6c4") + kelp(150, 150, "#3f8f6b") + rock(880, 120, 80, "#8592b4") + rock(760, 50, 30, "#9aa6c4") },
    sunset: { water: ["#ffd6c2", "#f59bb4", "#7a4d9e"], sand: "#f7dcc6",
      plants: coral(100, 1, "#e0559a") + coral(210, 0.7, "#ffb000") + coral(860, 1.1, "#f06aa6") + shellAt(520, "#ffffff") },
  };
  // ---------- Pictures for the draft words (vocabulary-new.md), drawn 3 Nov 2026 ----------
  Object.assign(ART, {
    // 一个苹果: one red apple with a leaf, on a little plate
    "个": `<ellipse cx="50" cy="78" rx="32" ry="8" fill="${K.mist}"/><ellipse cx="50" cy="76.5" rx="24" ry="5" fill="#e3e8f2"/>
      <path d="M50 34 Q34 24 24 38 Q16 54 28 70 Q38 82 50 76 Q62 82 72 70 Q84 54 76 38 Q66 24 50 34 Z" fill="${K.red}"/>
      <path d="M50 34 Q50 24 54 16" stroke="${K.brown}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M54 22 Q64 12 74 18 Q64 28 54 22 Z" fill="${K.green}"/>
      <ellipse cx="34" cy="46" rx="5" ry="8" fill="#ff9a9a" transform="rotate(20 34 46)"/>`,
    // 两只手: two open hands held out side by side, palms up, with sleeves
    "两": `<g transform="translate(50 52) scale(.9) translate(-50 -52)">${[false, true].map((f) => `<g transform="translate(50 0) scale(${f ? -1 : 1} 1) translate(-56 0)">
        <rect x="27" y="70" width="20" height="20" rx="5" fill="${K.blue}" transform="rotate(-10 37 80)"/>
        <g transform="rotate(-14 40 66)">
          <rect x="23" y="24" width="8" height="30" rx="4" fill="${K.skin}"/><rect x="31.5" y="19" width="8" height="34" rx="4" fill="${K.skin}"/>
          <rect x="40" y="20" width="8" height="34" rx="4" fill="${K.skin}"/><rect x="48.5" y="25" width="7.5" height="30" rx="3.75" fill="${K.skin}"/>
          <rect x="23" y="42" width="33" height="32" rx="12" fill="${K.skin}"/>
          <path d="M28 62 L14 44" stroke="${K.skin}" stroke-width="8.5" stroke-linecap="round"/>
          <path d="M31 52 Q39 58 49 52 M33 62 Q41 66 49 60" stroke="${K.skin2}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        </g></g>`).join("")}</g>`,

    // 一半: half a round cake seen from above; a dashed outline shows where the other half was
    "半": `<path d="M50 20 A32 32 0 0 1 50 84 Z" fill="${K.shadow}" opacity=".6"/>
      <path d="M50 20 A32 32 0 0 1 50 84" stroke="${K.grey}" stroke-width="3" stroke-dasharray="5 5" fill="none"/>
      <path d="M48 24 A32 32 0 0 0 48 88 Z" fill="${K.rose}"/>
      <path d="M48 20 A32 32 0 0 0 48 84 Z" fill="${K.blush}"/>
      <path d="M48 29 A23 23 0 0 0 48 75" stroke="${K.white}" stroke-width="3.5" stroke-dasharray="3 6" fill="none" stroke-linecap="round"/>
      <rect x="44" y="20" width="5" height="64" rx="1" fill="${K.cream}"/>
      <g fill="${K.red}"><circle cx="36" cy="36" r="5.5"/><circle cx="28" cy="52" r="5.5"/><circle cx="36" cy="68" r="5.5"/></g>
      <g fill="${K.green}"><circle cx="36" cy="31.5" r="2"/><circle cx="28" cy="47.5" r="2"/><circle cx="36" cy="63.5" r="2"/></g>`,

    // 一双鞋: a matching pair of pink shoes side by side, seen from above, each with a strap and buckle
    "双": `${[false, true].map((f) => `<g transform="translate(50 0) scale(${f ? -1 : 1} 1) translate(-50 0)">
        <path d="M33 19 C46 19 47 35 45 48 C43 63 44 79 34 83 C24 85 21 74 22 60 C22 45 19 19 33 19 Z" fill="${K.rose}" transform="translate(1 2)"/>
        <path d="M33 19 C46 19 47 35 45 48 C43 63 44 79 34 83 C24 85 21 74 22 60 C22 45 19 19 33 19 Z" fill="${K.pink}"/>
        <ellipse cx="33" cy="64" rx="8" ry="14" fill="${K.rose}"/><ellipse cx="33" cy="66" rx="5.5" ry="10" fill="${K.blush}"/>
        <rect x="20" y="46" width="27" height="6" rx="3" fill="${K.rose}"/><circle cx="24" cy="49" r="3.4" fill="${K.yellow}"/>
        <path d="M28 25 Q31 22 36 23" stroke="${K.white}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/></g>`).join("")}`,

    // 零食: a striped box of popcorn
    "零": `<g fill="${K.cream}"><circle cx="34" cy="38" r="9"/><circle cx="48" cy="30" r="10"/><circle cx="62" cy="34" r="9"/><circle cx="70" cy="42" r="7"/>
        <circle cx="40" cy="24" r="7"/><circle cx="56" cy="20" r="7"/><circle cx="29" cy="44" r="6"/></g>
      <g fill="${K.white}"><circle cx="44" cy="34" r="6"/><circle cx="58" cy="28" r="6"/><circle cx="36" cy="30" r="4.5"/><circle cx="66" cy="38" r="4.5"/></g>
      <g fill="${K.yellow}"><circle cx="50" cy="26" r="2.5"/><circle cx="38" cy="38" r="2.5"/><circle cx="64" cy="31" r="2.2"/></g>
      <path d="M26 44 H74 L67 86 H33 Z" fill="${K.white}"/>
      <path d="M26 44 H34 L37.4 86 H33 Z M42 44 H50 V86 H44.7 Z M58 44 H66 L63.3 86 H55.3 Z M74 44 L67 86 H71 Z" fill="${K.red}"/>
      <rect x="24" y="42" width="52" height="6" rx="3" fill="${K.berry}"/>
      <g fill="${K.cream}"><circle cx="18" cy="70" r="4"/><circle cx="84" cy="64" r="4"/><circle cx="80" cy="78" r="3"/></g>`,

    // 长颈鹿: a giraffe with a very long neck
    "长": `<g transform="translate(50 50) scale(.94) translate(-50 -48)"><path d="M30 72 V88 M38 74 V88 M54 74 V88 M62 72 V88" stroke="${K.yellow}" stroke-width="6" stroke-linecap="round"/>
      <path d="M24 66 Q16 70 18 80" stroke="${K.sun}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse cx="46" cy="66" rx="22" ry="12" fill="${K.yellow}"/>
      <path d="M56 62 L64 24" stroke="${K.yellow}" stroke-width="12" stroke-linecap="round"/>
      <path d="M60 60 L67 26" stroke="${K.sun}" stroke-width="3" stroke-linecap="round" stroke-dasharray="4 4"/>
      <path d="M62 14 V8 M70 14 V8" stroke="${K.brown}" stroke-width="3" stroke-linecap="round"/><circle cx="62" cy="8" r="2.5" fill="${K.brown}"/><circle cx="70" cy="8" r="2.5" fill="${K.brown}"/>
      <ellipse cx="56" cy="17" rx="5" ry="3" fill="${K.sun}" transform="rotate(-20 56 17)"/>
      <ellipse cx="72" cy="22" rx="13" ry="8" fill="${K.yellow}" transform="rotate(15 72 22)"/>
      <ellipse cx="81" cy="26" rx="6" ry="5" fill="${K.cream}"/>
      <circle cx="68" cy="18" r="2.6" fill="${K.ink}"/>
      <g fill="${K.brown}"><circle cx="38" cy="62" r="4"/><circle cx="50" cy="60" r="3.5"/><circle cx="44" cy="70" r="3.5"/><circle cx="58" cy="68" r="3"/><circle cx="30" cy="68" r="3"/>
        <circle cx="61" cy="48" r="3"/><circle cx="63" cy="36" r="2.8"/></g></g>`,
    // 短裤: a pair of shorts with a drawstring
    "短": `<path d="M24 34 H76 L82 72 Q70 76 56 72 L50 50 L44 72 Q30 76 18 72 Z" fill="${K.orange}"/>
      <rect x="23" y="26" width="54" height="10" rx="4" fill="${K.rust}"/>
      <path d="M50 36 V48" stroke="${K.rust}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M47 36 Q42 44 40 48 M53 36 Q58 44 60 48" stroke="${K.white}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M28 42 Q34 48 40 42 M60 42 Q66 48 72 42" stroke="${K.rust}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M22 66 Q30 70 42 66 M58 66 Q70 70 78 66" stroke="${K.cream}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    // 高楼: a tall building reaching up past the clouds, a little house at its foot
    "高": `${SKY}<path d="M50 9 V14" stroke="${K.slate}" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="9" r="2.5" fill="${K.red}"/>
      <rect x="38" y="14" width="24" height="74" rx="3" fill="${K.navy}"/><rect x="38" y="14" width="7" height="74" fill="${K.blue}"/>
      ${[20, 30, 40, 50, 60, 70].map((y) => `<rect x="44" y="${y}" width="5" height="6" rx="1" fill="${K.cream}"/><rect x="52" y="${y}" width="5" height="6" rx="1" fill="${K.cream}"/>`).join("")}
      ${cloud(71, 32, 0.6)}${house(29, 80, 0.34)}
      <path d="M27 88 H73" stroke="${K.green}" stroke-width="6" stroke-linecap="round"/>`,
    // 弟弟比哥哥矮: two brothers; the short little brother is highlighted, the tall big brother faded
    "矮": `<g opacity=".35">${person(32, 86, 1.12, { shirt: K.navy, hair: K.ink })}</g>
      <circle cx="68" cy="62" r="22" fill="${K.cream}"/>
      ${person(68, 86, 0.66, { shirt: K.orange })}
      ${arrow("M68 18 V34 M60 27 L68 35 L76 27", K.pink)}`,
    // 前面: the red ball in front of the box
    "前": `<rect x="12" y="78" width="76" height="7" rx="3.5" fill="${K.slate}"/>
      ${mini(box, 50, 46, 0.9)}<path d="M25 44 L50 33 L75 44 L50 55 Z" fill="#e0b48c"/><path d="M37.5 38.5 L62.5 49.5" stroke="${K.cream}" stroke-width="4"/>
      <circle cx="50" cy="70" r="14" fill="${K.red}"/><circle cx="45" cy="65" r="4" fill="#ff9a9a"/>`,
    // 后面: the red ball peeking out from behind the box
    "后": `<rect x="12" y="78" width="76" height="7" rx="3.5" fill="${K.slate}"/>
      <circle cx="70" cy="50" r="14" fill="${K.red}"/><circle cx="65" cy="45" r="4" fill="#ff9a9a"/>
      ${mini(box, 44, 50, 0.9)}<path d="M19 48 L44 37 L69 48 L44 59 Z" fill="#e0b48c"/><path d="M31.5 42.5 L56.5 53.5" stroke="${K.cream}" stroke-width="4"/>`,

    // 里面: the red ball inside an open box
    "里": `<rect x="12" y="80" width="76" height="7" rx="3.5" fill="${K.slate}"/>
      <path d="M22 50 L50 38 L32 28 L10 40 Z M78 50 L50 38 L68 28 L90 40 Z" fill="#e0b48c"/>
      <path d="M22 50 L50 38 L78 50 L50 62 Z" fill="${K.soil}"/>
      <circle cx="50" cy="50" r="13" fill="${K.red}"/><circle cx="45" cy="45" r="4" fill="#ff9a9a"/>
      ${box}${arrow("M50 8 V24 M42 17 L50 25 L58 17", K.green)}`,

    // 外面: the red ball outside, next to the same open box, now empty
    "外": `<rect x="12" y="80" width="76" height="7" rx="3.5" fill="${K.slate}"/>
      ${mini(`<path d="M22 50 L50 38 L32 28 L10 40 Z M78 50 L50 38 L68 28 L90 40 Z" fill="#e0b48c"/><path d="M22 50 L50 38 L78 50 L50 62 Z" fill="${K.soil}"/>${box}`, 36, 54, 0.78)}
      <circle cx="76" cy="68" r="12" fill="${K.red}"/><circle cx="72" cy="64" r="3.5" fill="#ff9a9a"/>
      ${arrow("M42 30 Q60 12 74 40 M66 36 L74 42 L78 32", K.orange)}`,

    // 四方形: a square block
    "方": `<rect x="23" y="27" width="56" height="56" rx="6" fill="${K.navy}"/>
      <rect x="21" y="23" width="56" height="56" rx="6" fill="${K.blue}"/>
      <rect x="31" y="33" width="36" height="36" rx="3" fill="none" stroke="${K.white}" stroke-width="4" stroke-opacity=".6"/>
      <rect x="26" y="28" width="12" height="5" rx="2.5" fill="${K.white}" opacity=".55"/>`,
    // 圆圈: a striped hoop
    "圆": `<circle cx="50" cy="50" r="30" fill="none" stroke="${K.pink}" stroke-width="11"/>
      <circle cx="50" cy="50" r="30" fill="none" stroke="${K.yellow}" stroke-width="11" stroke-dasharray="11.78 11.78"/>
      <path d="M30 34 A26 26 0 0 1 46 24" stroke="${K.white}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>`,
    // 哥哥跑得很快: a boy running fast, leaning forward, with speed lines and dust behind him
    "快": `<path d="M12 40 H28 M8 52 H28 M14 64 H28" stroke="${K.blue}" stroke-width="4.5" stroke-linecap="round"/>
      ${cloud(26, 80, 0.38, K.mist)}
      <g transform="translate(54 80) rotate(16) scale(1.08)">
        <path d="M-3 -16 L-12 -6 L-24 -8 M3 -16 L14 -8 L12 2" stroke="${K.slate}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M-8 -32 L-18 -24 L-20 -14 M8 -32 L16 -22 L24 -28" stroke="${K.skin}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <rect x="-10" y="-38" width="20" height="24" rx="7" fill="${K.red}"/>
        <circle cx="0" cy="-47" r="10" fill="${K.skin}"/>
        <path d="M-10 -48 Q-12 -60 0 -59 Q10 -59 10 -48 Q5 -53 -10 -48 Z M-10 -52 L-16 -55 L-11 -48 Z" fill="${K.hair}"/>
        ${face(2, -46, 0.9)}</g>`,
    // 慢吞吞: a snail slowly creeping along, leaving a shiny trail
    "慢": `<path d="M14 76 H26" stroke="${K.sky}" stroke-width="5" stroke-linecap="round"/><path d="M17 76 H19" stroke="${K.white}" stroke-width="3" stroke-linecap="round"/>
      <path d="M18 78 Q18 70 28 70 H66 Q72 70 74 62 L76 46 Q78 38 84 40 Q88 42 86 52 L82 70 Q80 78 70 78 Z" fill="${K.wood}"/>
      <path d="M77 42 L71 28 M82 41 L83 27" stroke="${K.wood}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="71" cy="27" r="3.5" fill="${K.ink}"/><circle cx="83" cy="26" r="3.5" fill="${K.ink}"/>
      <path d="M78 52 Q81 55 84 52" stroke="${K.ink}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <circle cx="46" cy="48" r="24" fill="${K.orange}"/>
      <path d="M46 48 m-3 0 a3 3 0 0 1 6 0 a7 7 0 0 1 -13 1 a11 11 0 0 1 21 -2 a15 15 0 0 1 -28 3 a18 18 0 0 1 33 -3" stroke="${K.rust}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="36" cy="32" rx="6" ry="3.5" fill="${K.cream}" transform="rotate(-30 36 32)" opacity=".8"/>`,

    // 皮肤: skin, an arm with a plaster on it and a dab of lotion being squeezed on
    "皮": `<path d="M8 50 Q8 44 14 44 H30 V72 H14 Q8 72 8 66 Z" fill="${K.blue}"/>
      <path d="M28 58 H70" stroke="${K.skin}" stroke-width="20" stroke-linecap="round"/>
      <ellipse cx="78" cy="58" rx="12" ry="11" fill="${K.skin}"/><path d="M70 50 Q78 46 86 52" stroke="${K.skin2}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M34 54 H62" stroke="#fbe0c4" stroke-width="4" stroke-linecap="round"/>
      <g transform="rotate(-20 52 62)"><rect x="38" y="55" width="28" height="13" rx="6.5" fill="${K.blush}"/><rect x="47" y="56.5" width="10" height="10" rx="2" fill="${K.white}" opacity=".8"/></g>
      <g transform="translate(4 8) rotate(30 40 26)"><rect x="30" y="10" width="20" height="26" rx="6" fill="${K.yellow}"/><rect x="34" y="14" width="5" height="16" rx="2.5" fill="${K.cream}"/><rect x="35" y="34" width="10" height="7" rx="2" fill="${K.white}" stroke="${K.mist}" stroke-width="1.5"/></g>
      <path d="M32 50 Q28 47 32 45 Q37 43 36 47 Q40 49 35 51 Z" fill="${K.white}" stroke="${K.mist}" stroke-width="1.5"/>`,
    // 生气: an angry boy, red in the face, cross eyebrows and a frown, puffing steam
    "生": `<circle cx="50" cy="50" r="40" fill="#ffd9d2"/>
      ${bust(50, 40, 1.35, { hairStyle: "short", shirt: K.green, skin: "#f6a58f" })}
      <g transform="translate(50 40) scale(1.35)"><ellipse cx="0" cy="4" rx="11" ry="9" fill="#f6a58f"/>
        <path d="M-10 -3 L-3 0 M10 -3 L3 0" stroke="${K.ink}" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="-5" cy="3" r="1.7" fill="${K.ink}"/><circle cx="5" cy="3" r="1.7" fill="${K.ink}"/>
        <path d="M-5 11 Q0 6.5 5 11" stroke="${K.ink}" stroke-width="2" fill="none" stroke-linecap="round"/></g>
      ${cloud(25, 25, 0.36, K.mist)}${cloud(75, 25, 0.36, K.mist)}`,
    // 笑脸: a girl laughing, eyes squeezed happy and mouth wide open
    "笑": `<circle cx="50" cy="50" r="40" fill="${K.cream}"/>
      ${bust(50, 40, 1.35, { hairStyle: "bob", shirt: K.blue })}
      <g transform="translate(50 40) scale(1.35)"><ellipse cx="0" cy="4" rx="11" ry="9" fill="${K.skin}"/>
        <path d="M-8 2 Q-5 -2 -2 2 M2 2 Q5 -2 8 2" stroke="${K.ink}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M-7 5.5 Q0 17 7 5.5 Z" fill="${K.ink}"/><path d="M-3.5 9.5 Q0 13 3.5 9.5 Q0 8 -3.5 9.5 Z" fill="${K.red}"/>
        <ellipse cx="-9" cy="6" rx="2.6" ry="1.8" fill="${K.blush}"/><ellipse cx="9" cy="6" rx="2.6" ry="1.8" fill="${K.blush}"/></g>
      ${star5(18, 34, 6, K.yellow)}${star5(82, 34, 6, K.yellow)}${star5(24, 18, 3.5, K.sun)}${star5(77, 17, 3.5, K.sun)}`,
    // 大哭: a child crying hard, tears streaming down
    "哭": `<circle cx="50" cy="50" r="40" fill="#d9f0fb"/>
      ${bust(50, 40, 1.35, { hairStyle: "pigtails", shirt: K.purple })}
      <g transform="translate(50 40) scale(1.35)"><ellipse cx="0" cy="4" rx="11" ry="9" fill="${K.skin}"/>
        <path d="M-9 -2 L-3 -4 M9 -2 L3 -4" stroke="${K.ink}" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M-8 2 Q-5 5 -2 2 M2 2 Q5 5 8 2" stroke="${K.ink}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M-5 13 Q0 4 5 13 Q0 11 -5 13 Z" fill="${K.ink}" stroke="${K.ink}" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M-6 4 Q-8 9 -7 16 M6 4 Q8 9 7 16" stroke="${K.blue}" stroke-width="3" fill="none" stroke-linecap="round"/></g>
      <path d="M24 16 Q20 22 24 24 Q28 22 24 16 Z M76 16 Q72 22 76 24 Q80 22 76 16 Z M14 54 Q10 60 14 62 Q18 60 14 54 Z M86 54 Q82 60 86 62 Q90 60 86 54 Z" fill="${K.blue}"/>`,
    // 洗脸: washing your face, eyes shut, hands rubbing soapy cheeks, splashes of water
    "脸": `${bust(50, 40, 1.35, { hairStyle: "short", shirt: K.orange, hair: K.ink })}
      <g transform="translate(50 40) scale(1.35)"><ellipse cx="0" cy="4" rx="11" ry="9" fill="${K.skin}"/>
        <path d="M-8 2 H-3 M3 2 H8" stroke="${K.ink}" stroke-width="2" stroke-linecap="round"/>
        <path d="M-3 8 Q0 10.5 3 8" stroke="${K.ink}" stroke-width="1.8" fill="none" stroke-linecap="round"/></g>
      ${[[28, -14], [72, 14]].map(([x, r]) => `<g transform="rotate(${r} ${x} 52)"><rect x="${x - 7}" y="40" width="14" height="22" rx="7" fill="${K.skin2}"/>
        <path d="M${x - 2.3} 41 V49 M${x + 2.3} 41 V49" stroke="${K.skin}" stroke-width="1.4" stroke-linecap="round"/></g>`).join("")}
      ${bubble(38, 24, 4.5)}${bubble(48, 21, 3.5)}${bubble(58, 23, 4)}${bubble(24, 36, 3.5)}${bubble(77, 36, 3.5)}${bubble(32, 66, 3)}${bubble(69, 66, 2.5)}
      <path d="M15 46 Q11 52 15 54 Q19 52 15 46 Z M85 46 Q81 52 85 54 Q89 52 85 46 Z M18 62 Q14 68 18 70 Q22 68 18 62 Z M82 62 Q78 68 82 70 Q86 68 82 62 Z" fill="${K.blue}"/>`,
    // 自己: me! A child pointing at themself
    "自": `${bust(50, 40, 1.35, { hairStyle: "short", shirt: K.red, hair: K.ink })}
      <path d="M76 86 Q76 76 66 73" stroke="${K.skin}" stroke-width="9" fill="none" stroke-linecap="round"/>
      <ellipse cx="63" cy="73" rx="7.5" ry="6.5" fill="${K.skin}"/><path d="M58 70 H45" stroke="${K.skin}" stroke-width="5" stroke-linecap="round"/>
      <path d="M58 75.5 H66 M58 78.5 H64" stroke="${K.skin2}" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M20 30 L25 33 M18 42 H24 M80 30 L75 33 M82 42 H76" stroke="${K.sun}" stroke-width="3" stroke-linecap="round"/>`,
    // 舌头: sticking out a tongue, with a wink
    "舌": `${bust(50, 40, 1.35, { hairStyle: "pony", shirt: K.pink })}
      <g transform="translate(50 40) scale(1.35)"><ellipse cx="0" cy="4" rx="11" ry="9" fill="${K.skin}"/>
        <circle cx="-5" cy="1" r="1.8" fill="${K.ink}"/><path d="M2.5 1.5 Q5 -1 7.5 1.5" stroke="${K.ink}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M-5 7 Q0 9 5 7" stroke="${K.ink}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M-3.5 7.6 V12 Q-3.5 17 0 17 Q3.5 17 3.5 12 V7.6 Z" fill="${K.pink}"/><path d="M0 9 V14" stroke="${K.rose}" stroke-width="1.2" stroke-linecap="round"/></g>`,
    // 身体: the whole body, a child doing a star jump
    "身": `<g transform="translate(50 86) scale(1.15)">
        <path d="M-3 -16 L-13 0 M3 -16 L13 0" stroke="${K.navy}" stroke-width="6" stroke-linecap="round" fill="none"/>
        <ellipse cx="-14" cy="0" rx="5" ry="3" fill="${K.red}"/><ellipse cx="14" cy="0" rx="5" ry="3" fill="${K.red}"/>
        <path d="M-8 -34 L-22 -53 M8 -34 L22 -53" stroke="${K.skin}" stroke-width="5" stroke-linecap="round" fill="none"/>
        <circle cx="-22" cy="-54" r="3.5" fill="${K.skin}"/><circle cx="22" cy="-54" r="3.5" fill="${K.skin}"/>
        <rect x="-10" y="-38" width="20" height="24" rx="7" fill="${K.orange}"/>
        <circle cx="0" cy="-47" r="10" fill="${K.skin}"/><path d="M-10 -48 Q-10 -59 0 -59 Q10 -59 10 -48 Q5 -53 -10 -48 Z" fill="${K.hair}"/>
        ${face(0, -46, 0.9)}</g>
      <path d="M14 46 L20 50 M12 58 H19 M86 46 L80 50 M88 58 H81" stroke="${K.sun}" stroke-width="3.5" stroke-linecap="round"/>`,
    // 肚子: a round full tummy, both hands patting it
    "肚": `<path d="M40 82 V89 M60 82 V89" stroke="${K.slate}" stroke-width="9" stroke-linecap="round"/>
      <ellipse cx="50" cy="62" rx="27" ry="24" fill="${K.orange}"/>
      <path d="M25 66 Q26 86 50 86 Q74 86 75 66 Q62 58 50 58 Q38 58 25 66 Z" fill="${K.skin}"/>
      <path d="M48 72 Q50 75 52 72" stroke="${K.skin2}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M28 52 Q20 66 32 72 M72 52 Q80 66 68 72" stroke="${K.skin}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <ellipse cx="34" cy="72" rx="6" ry="5" fill="${K.skin2}"/><ellipse cx="66" cy="72" rx="6" ry="5" fill="${K.skin2}"/>
      <circle cx="50" cy="26" r="15" fill="${K.skin}"/><path d="M35 25 Q35 10 50 10 Q65 10 65 25 Q57 17 35 25 Z" fill="${K.hair}"/>
      ${face(50, 28, 1.2)}<ellipse cx="41" cy="31" rx="2.6" ry="1.8" fill="${K.blush}"/><ellipse cx="59" cy="31" rx="2.6" ry="1.8" fill="${K.blush}"/>`,
    // 眼睛: two big bright eyes, close up
    "眼": `<circle cx="50" cy="50" r="42" fill="${K.skin}"/>
      <path d="M8 46 Q8 8 50 8 Q92 8 92 46 Q74 28 50 30 Q26 28 8 46 Z" fill="${K.hair}"/>
      ${[33, 67].map((x) => `<ellipse cx="${x}" cy="56" rx="12" ry="14" fill="${K.white}"/><circle cx="${x}" cy="58" r="9" fill="${K.brown}"/>
        <circle cx="${x}" cy="58" r="5" fill="${K.ink}"/><circle cx="${x - 3}" cy="54" r="3" fill="${K.white}"/>`).join("")}
      <path d="M21 48 L16 44 M24 44 L21 39 M79 48 L84 44 M76 44 L79 39" stroke="${K.ink}" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="22" cy="76" rx="6" ry="3.5" fill="${K.blush}"/><ellipse cx="78" cy="76" rx="6" ry="3.5" fill="${K.blush}"/>
      <path d="M43 82 Q50 87 57 82" stroke="${K.ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
    // 小脚: a little bare foot with five wiggly toes
    "脚": `<path d="M50 88 Q36 88 35 72 Q34 60 30 50 Q26 36 40 32 Q58 28 64 40 Q68 50 63 62 Q60 72 63 80 Q62 88 50 88 Z" fill="${K.skin}"/>
      <path d="M38 50 Q40 64 40 74" stroke="${K.skin2}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>
      <circle cx="37" cy="22" r="8" fill="${K.skin}"/><circle cx="50" cy="18" r="5.5" fill="${K.skin}"/><circle cx="60" cy="21" r="5" fill="${K.skin}"/>
      <circle cx="68" cy="27" r="4.5" fill="${K.skin}"/><circle cx="73" cy="35" r="4" fill="${K.skin}"/>
      <circle cx="37" cy="20" r="3.5" fill="${K.blush}"/><circle cx="50" cy="16.5" r="2.4" fill="${K.blush}"/><circle cx="60" cy="19.5" r="2.2" fill="${K.blush}"/>
      <circle cx="68" cy="25.5" r="2" fill="${K.blush}"/><circle cx="73" cy="33.5" r="1.8" fill="${K.blush}"/>`,
    // 大腿: legs in shorts, with sneakers
    "腿": `<path d="M38 34 V76 M62 34 V76" stroke="${K.skin}" stroke-width="16" stroke-linecap="round"/>
      <path d="M34 56 Q38 53 42 56 M58 56 Q62 53 66 56" stroke="${K.skin2}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M26 12 H74 L78 38 Q66 42 54 38 L50 28 L46 38 Q34 42 22 38 Z" fill="${K.navy}"/><rect x="26" y="12" width="48" height="7" rx="3" fill="${K.blue}"/>
      <path d="M24 88 Q24 78 36 78 Q46 78 48 88 Z" fill="${K.red}"/><path d="M76 88 Q76 78 64 78 Q54 78 52 88 Z" fill="${K.red}"/>
      <path d="M24 86 H48 M52 86 H76" stroke="${K.white}" stroke-width="3" stroke-linecap="round"/>`,
    // 鼻子: a nose sniffing a flower
    "鼻": `<path d="M24 88 Q24 72 42 70 Q58 70 60 88 Q42 94 24 88 Z" fill="${K.blue}"/><rect x="34" y="60" width="14" height="14" fill="${K.skin}"/>
      <circle cx="40" cy="44" r="23" fill="${K.skin}"/>
      <path d="M58 34 Q75 38 74 48 Q72 56 60 55 Z" fill="${K.skin}"/><circle cx="70" cy="49" r="4" fill="${K.blush}"/>
      <path d="M17 44 Q15 19 40 19 Q58 19 62 32 Q46 28 37 34 Q31 42 25 56 Q19 54 17 44 Z" fill="${K.hair}"/>
      <ellipse cx="33" cy="48" rx="5" ry="7" fill="${K.skin2}"/>
      <circle cx="53" cy="39" r="2.8" fill="${K.ink}"/><path d="M53 61 Q57 63 60 60" stroke="${K.ink}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M78 88 V74" stroke="${K.deep}" stroke-width="3" stroke-linecap="round"/><path d="M78 82 Q70 78 68 72 Q76 74 78 80 Z" fill="${K.green}"/>${mini(flowerHead(K.purple), 78, 70, 0.17)}
      <path d="M72 62 Q75 59 73 56 M78 61 Q81 58 79 55" stroke="${K.purple}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    // 树上有九片叶子: a branch with nine leaves on it
    "叶": `<g transform="translate(50 52) scale(.86) translate(-50 -50)"><path d="M14 82 Q46 60 84 22" stroke="${K.brown}" stroke-width="5" fill="none" stroke-linecap="round"/>
      ${[[22, 77, -10], [31, 70, 80], [40, 64, -20], [49, 58, 70], [57, 51, -30], [64, 45, 60], [71, 38, -40], [77, 31, 50], [83, 23, 15]]
        .map(([x, y, r], i) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(1.25)"><path d="M0 0 Q9 -9 0 -20 Q-9 -9 0 0 Z" fill="${i % 2 ? K.green : K.leaf}"/>
          <path d="M0 -2 V-16" stroke="${K.deep}" stroke-width="1.3" stroke-linecap="round" opacity=".6"/></g>`).join("")}</g>`,
    // 地球: the Earth
    "地": `<circle cx="50" cy="50" r="36" fill="${K.blue}"/>
      <path d="M26 28 Q38 22 44 30 Q40 38 46 44 Q42 54 32 52 Q26 60 22 52 Q18 40 26 28 Z" fill="${K.green}"/>
      <path d="M58 22 Q70 20 76 30 Q72 36 64 34 Q60 30 58 22 Z" fill="${K.green}"/>
      <path d="M56 46 Q66 42 76 50 Q80 62 72 72 Q64 80 58 72 Q60 62 54 56 Q52 50 56 46 Z" fill="${K.green}"/>
      <path d="M34 72 Q42 70 46 78 Q40 82 34 78 Z" fill="${K.green}"/>
      <path d="M24 44 Q20 32 30 24" stroke="${K.white}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".55"/>`,
    // 冰块: three ice cubes
    "冰": `${[[34, 64], [66, 64], [50, 36]].map(([x, y]) => `<g transform="translate(${x} ${y})">
        <path d="M-17 -8 L0 -16 L17 -8 L0 0 Z" fill="#eefaff"/><path d="M-17 -8 L0 0 V20 L-17 12 Z" fill="${K.sky}"/><path d="M17 -8 L0 0 V20 L17 12 Z" fill="#9fd9f2"/>
        <path d="M-12 -2 V8" stroke="${K.white}" stroke-width="3" stroke-linecap="round"/></g>`).join("")}
      <path d="M80 18 Q81 26 88 27 Q81 28 80 36 Q79 28 72 27 Q79 26 80 18 Z M20 22 Q21 28 26 29 Q21 30 20 36 Q19 30 14 29 Q19 28 20 22 Z" fill="${K.blue}"/>`,
    // 我喜欢玩泥沙: a sandcastle with a bucket and spade
    "沙": `${SKY}<path d="M10 66 Q30 58 50 62 Q70 58 90 66 V70 Q90 90 50 90 Q10 90 10 70 Z" fill="#f2d48c"/>
      <rect x="30" y="44" width="30" height="22" fill="#e8bd66"/><rect x="26" y="34" width="12" height="32" fill="#e8bd66"/><rect x="52" y="34" width="12" height="32" fill="#e8bd66"/>
      <path d="M26 34 V30 H29 V34 M32 34 V30 H35 V34 M52 34 V30 H55 V34 M58 34 V30 H61 V34" fill="#e8bd66" stroke="#e8bd66" stroke-width="3"/>
      <path d="M41 66 V56 Q45 51 49 56 V66 Z" fill="${K.brown}"/>
      <path d="M58 30 V18" stroke="${K.slate}" stroke-width="2"/><path d="M58 18 L68 21 L58 24 Z" fill="${K.red}"/>
      <path d="M66 64 L84 64 L80 84 H70 Z" fill="${K.red}"/><path d="M66 64 Q75 52 84 64" stroke="${K.berry}" stroke-width="2.5" fill="none"/>
      <path d="M18 54 L26 80" stroke="${K.blue}" stroke-width="3.5" stroke-linecap="round"/><path d="M22 76 L30 74 L32 86 Q28 90 24 86 Z" fill="${K.blue}"/>`,
    // 小岛: a little island with a palm tree in the sea
    "岛": `${SKY}${sunDisc(74, 28, 8)}
      <path d="M10 64 Q20 58 30 64 T50 64 T70 64 T90 64 V70 Q90 90 50 90 Q10 90 10 70 Z" fill="${K.blue}"/>
      <path d="M24 66 Q50 46 76 66 Z" fill="#f2d48c"/>
      <path d="M50 60 Q52 42 44 28" stroke="${K.brown}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M44 28 Q30 22 20 32 Q32 28 44 30 Z M44 28 Q56 18 68 26 Q56 26 44 30 Z M44 28 Q36 12 26 16 Q38 18 44 30 Z M44 28 Q54 34 58 44 Q50 34 44 30 Z" fill="${K.green}" stroke="${K.green}" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="45" cy="32" r="3" fill="${K.brown}"/><circle cx="49" cy="31" r="3" fill="${K.soil}"/>
      <path d="M16 76 Q22 72 28 76 M66 80 Q72 76 78 80" stroke="${K.white}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
    // 小河: a little river flowing between grassy banks, with a fish jumping
    "河": `${SKY}<path d="M11.3 40 H88.7 A40 40 0 1 1 11.3 40 Z" fill="${K.green}"/>
      <path d="M10.2 46 Q30 42 50 46 Q70 50 89.8 46 A40 40 0 1 1 10.2 46 Z" fill="${K.blue}"/>
      <path d="M13.3 66 Q30 70 50 66 Q70 62 86.7 66 A40 40 0 0 1 13.3 66 Z" fill="${K.green}"/>
      <path d="M20 56 H32 M46 60 H60 M68 53 H80" stroke="${K.white}" stroke-width="3" stroke-linecap="round" opacity=".8"/>
      <path d="M30 51 Q36 34 46 46" stroke="${K.navy}" stroke-width="2" fill="none" stroke-dasharray="2 3" stroke-linecap="round"/>
      <g transform="rotate(30 56 46)">${fish(56, 46, 0.22, 0)}</g>
      <ellipse cx="74" cy="62" rx="5" ry="3" fill="${K.grey}"/>
      <path d="M24 82 V74 M28 82 V72 M32 82 V75 M66 84 V76 M70 84 V74" stroke="${K.deep}" stroke-width="2.5" stroke-linecap="round"/>
      ${cloud(38, 27, 0.42)}`,
    // 湖水: a calm lake with reeds, trees across the water reflected in it
    "湖": `${SKY}<path d="M10 50 Q30 38 50 46 Q70 36 90 50 Z" fill="${K.hill}"/>
      <path d="M10.05 48 H89.95 A40 40 0 1 1 10.05 48 Z" fill="${K.green}"/>
      <ellipse cx="48" cy="64" rx="34" ry="16" fill="${K.blue}"/>
      <path d="M28 60 H44 M52 66 H70 M34 72 H50" stroke="${K.sky}" stroke-width="2.5" stroke-linecap="round"/>
      ${pine(34, 40, 0.38)}${pine(60, 38, 0.44)}
      <path d="M74 88 Q76 74 74 62 M80 86 Q80 74 82 64 M68 90 Q70 80 68 70" stroke="${K.deep}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <rect x="72" y="58" width="4.5" height="11" rx="2.2" fill="${K.brown}"/><rect x="79.8" y="60" width="4.5" height="11" rx="2.2" fill="${K.brown}"/><rect x="65.8" y="66" width="4.5" height="10" rx="2.2" fill="${K.brown}"/>`,
    // 小草: tufts of grass with a little flower
    "草": `<path d="M12 74 Q50 66 88 74 Q86 84 50 86 Q14 84 12 74 Z" fill="${K.soil}"/>
      ${[[26, K.green], [50, K.leaf], [72, K.green]].map(([x, c]) => `<path d="M${x - 14} 76 Q${x - 12} 58 ${x - 18} 46 Q${x - 4} 58 ${x - 4} 76 Z M${x - 6} 76 Q${x - 4} 52 ${x} 36 Q${x + 6} 54 ${x + 4} 76 Z M${x + 2} 76 Q${x + 6} 60 ${x + 16} 48 Q${x + 12} 62 ${x + 12} 76 Z" fill="${c}"/>`).join("")}
      <path d="M60 74 V40" stroke="${K.deep}" stroke-width="2.5" stroke-linecap="round"/>${mini(flowerHead(K.pink), 60, 34, 0.22)}`,
    // 请爱护树木: a tree with a heart, and a child giving it a hug
    "树": `${tree(56, 46, 1.0)}${heart(58, 34, 0.75, K.pink)}
      ${person(36, 86, 0.62, { pose: "wide", shirt: K.yellow, long: true })}
      <path d="M14 86 H86" stroke="${K.green}" stroke-width="4" stroke-linecap="round"/>`,
    // 山洞: a cave in a rocky hill
    "洞": `${SKY}<path d="M8 82 Q12 30 50 24 Q88 30 92 82 Z" fill="${K.grey}"/>
      <path d="M22 50 Q30 40 40 42 M66 40 Q74 42 78 52" stroke="${K.mist}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M30 84 V66 Q30 46 50 46 Q70 46 70 66 V84 Z" fill="${K.ink}"/>
      <path d="M10 82 H90 V84 Q80 92 50 92 Q20 92 10 84 Z" fill="${K.green}"/>
      <ellipse cx="22" cy="80" rx="6" ry="4" fill="${K.slate}"/><ellipse cx="80" cy="80" rx="5" ry="3.5" fill="${K.slate}"/>`,

    // 太阳: the sun on its own, a big smiling sun with rays
    "阳": `<path d="M50 9 V19 M50 81 V91 M9 50 H19 M81 50 H91 M22 22 L29 29 M78 22 L71 29 M22 78 L29 71 M78 78 L71 71" stroke="${K.sun}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="50" cy="50" r="26" fill="${K.yellow}"/><circle cx="37" cy="37" r="5" fill="${K.cream}"/>
      <path d="M38 49 Q42 44 46 49 M54 49 Q58 44 62 49" stroke="${K.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M42 58 Q50 66 58 58" stroke="${K.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse cx="35" cy="57" rx="4.5" ry="3" fill="${K.orange}" opacity=".6"/><ellipse cx="65" cy="57" rx="4.5" ry="3" fill="${K.orange}" opacity=".6"/>`,
    // 阴天: a grey sky full of grey clouds, the sun hidden behind them
    "阴": `<circle cx="50" cy="50" r="40" fill="#dfe4ee"/><circle cx="66" cy="34" r="12" fill="${K.cream}"/>
      ${cloud(40, 38, 1.15, K.grey)}${cloud(62, 50, 1.25, K.slate)}${cloud(38, 66, 1.1, K.mist)}`,
    // 早上: morning, a rooster crowing on a fence as the sun comes up
    "早": `<circle cx="50" cy="50" r="40" fill="#ffe3b3"/>${sunDisc(72, 66, 13)}
      <path d="M18 26 Q13 32 16 39 M12 20 Q5 31 9 42" stroke="${K.rust}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M64 56 Q66 26 84 28 Q76 40 74 58 Z" fill="${K.deep}"/><path d="M66 60 Q80 40 88 48 Q78 54 72 64 Z" fill="${K.hill}"/>
      <path d="M40 36 Q34 50 40 58" stroke="${K.orange}" stroke-width="13" fill="none" stroke-linecap="round"/>
      <ellipse cx="54" cy="60" rx="18" ry="14" fill="${K.orange}"/><path d="M48 58 Q60 50 70 58 Q60 68 48 62 Z" fill="${K.rust}"/>
      <circle cx="40" cy="36" r="10" fill="${K.orange}"/>
      <circle cx="35" cy="26.5" r="4" fill="${K.red}"/><circle cx="41" cy="25" r="4.5" fill="${K.red}"/><circle cx="47" cy="28" r="4" fill="${K.red}"/>
      <path d="M31 33 L21 30 L31 37 Z" fill="${K.yellow}"/><path d="M31 39 L22 42 L32 41 Z" fill="${K.sun}"/>
      <ellipse cx="33" cy="45" rx="3" ry="4" fill="${K.red}"/><circle cx="39" cy="34" r="2.2" fill="${K.ink}"/>
      <path d="M50 72 V79 M58 72 V79" stroke="${K.sun}" stroke-width="3" stroke-linecap="round"/>
      <rect x="26" y="79" width="48" height="7" rx="3" fill="${K.wood}"/><rect x="32" y="74" width="7" height="14" rx="2" fill="${K.brown}"/><rect x="62" y="74" width="7" height="14" rx="2" fill="${K.brown}"/>`,
    // 好冷: so cold, a child in a woolly hat and scarf, hugging themselves and shivering
    "冷": `<path d="M17 38 Q12 46 17 54 M11 34 Q6 46 11 58 M83 38 Q88 46 83 54 M89 34 Q94 46 89 58" stroke="${K.blue}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <g transform="translate(50 46) scale(1.3)">
        <path d="M-20 29 Q-20 16 0 16 Q20 16 20 29 Z" fill="${K.blue}"/>
        <path d="M-15 24 Q0 30 13 21" stroke="${K.navy}" stroke-width="5" fill="none" stroke-linecap="round"/>
        <rect x="-5" y="10" width="10" height="7" fill="${K.skin}"/><circle cx="0" cy="0" r="15" fill="${K.skin}"/>
        <path d="M-16 -3 Q-16 -22 0 -22 Q16 -22 16 -3 Z" fill="${K.red}"/><rect x="-17" y="-7" width="34" height="7" rx="3.5" fill="${K.berry}"/>
        <circle cx="0" cy="-23" r="4.5" fill="${K.white}" stroke="${K.mist}" stroke-width="1"/>
        <rect x="-14" y="12" width="28" height="7" rx="3.5" fill="${K.red}"/><rect x="5" y="14" width="6" height="13" rx="2.5" fill="${K.berry}"/>
        <circle cx="-5" cy="3" r="1.8" fill="${K.ink}"/><circle cx="5" cy="3" r="1.8" fill="${K.ink}"/>
        <path d="M-5 9.5 L-2.5 7.5 L0 9.5 L2.5 7.5 L5 9.5" stroke="${K.ink}" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <ellipse cx="-9" cy="7" rx="3" ry="2" fill="${K.blush}"/><ellipse cx="9" cy="7" rx="3" ry="2" fill="${K.blush}"/>
      </g>
      <g fill="${K.sky}"><circle cx="22" cy="22" r="3"/><circle cx="78" cy="20" r="2.5"/><circle cx="82" cy="70" r="2.5"/><circle cx="18" cy="72" r="3"/></g>`,
    // 太空: space, a rocket flying past a ringed planet
    "空": `<circle cx="50" cy="50" r="40" fill="#2a1f6b"/>
      ${star5(24, 30, 3, K.cream)}${star5(80, 56, 2.5, K.cream)}${star5(48, 18, 2, K.white)}${star5(68, 80, 2.5, K.cream)}
      <g transform="rotate(-20 32 64)"><ellipse cx="32" cy="64" rx="18" ry="5" fill="none" stroke="${K.yellow}" stroke-width="3.5"/></g>
      <circle cx="32" cy="64" r="11" fill="${K.orange}"/><path d="M22 60 Q32 63 42 58" stroke="${K.rust}" stroke-width="2.5" fill="none"/><circle cx="28" cy="59" r="3" fill="${K.cream}" opacity=".7"/>
      <g transform="rotate(-20 32 64)"><path d="M14 64 A18 5 0 0 0 50 64" fill="none" stroke="${K.yellow}" stroke-width="3.5"/></g>
      <g transform="translate(62 38) rotate(40) scale(0.85)">
        <path d="M-7 16 Q0 36 7 16 Z" fill="${K.orange}"/><path d="M-4 16 Q0 28 4 16 Z" fill="${K.yellow}"/>
        <path d="M-12 2 L-21 18 H-11 Z M12 2 L21 18 H11 Z" fill="${K.red}"/>
        <path d="M0 -28 Q13 -15 12 4 V17 H-12 V4 Q-13 -15 0 -28 Z" fill="${K.white}"/>
        <path d="M0 -28 Q8 -20 10 -12 H-10 Q-8 -20 0 -28 Z" fill="${K.red}"/>
        <circle cx="0" cy="0" r="5.5" fill="${K.blue}" stroke="${K.mist}" stroke-width="2"/>
      </g>`,
    // 夜空: the night sky, a dark sky with the moon and twinkling stars over the hills
    "夜": `<circle cx="50" cy="50" r="40" fill="${K.ink}"/>
      <path d="M60 16 A18 18 0 1 0 76 44 A14.5 14.5 0 1 1 60 16 Z" fill="#ffd34d"/>
      ${star5(24, 32, 5, K.yellow)}${star5(40, 20, 3, K.cream)}${star5(80, 30, 3, K.cream)}${star5(36, 50, 3.5, K.yellow)}${star5(84, 52, 2.5, K.cream)}
      <path d="M11.84 62 Q28 52 50 64 Q70 54 88.16 62 A40 40 0 0 1 11.84 62 Z" fill="${K.purple}"/><path d="M15.36 70 Q40 62 84.64 70 A40 40 0 0 1 15.36 70 Z" fill="#7a5fc4"/>`,
    // 星星: stars, one big friendly star with a face and two little ones
    "星": `<g stroke="${K.yellow}" stroke-width="6" stroke-linejoin="round">${star5(50, 56, 30, K.yellow)}</g>
      <circle cx="40" cy="46" r="5" fill="${K.cream}"/>
      <circle cx="43" cy="57" r="3" fill="${K.ink}"/><circle cx="57" cy="57" r="3" fill="${K.ink}"/>
      <path d="M45 64 Q50 69 55 64" stroke="${K.ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="37" cy="63" rx="3.5" ry="2.2" fill="${K.orange}" opacity=".6"/><ellipse cx="63" cy="63" rx="3.5" ry="2.2" fill="${K.orange}" opacity=".6"/>
      <g stroke-linejoin="round" stroke-width="3"><g stroke="${K.orange}">${star5(20, 28, 9, K.orange, -80)}</g><g stroke="${K.pink}">${star5(81, 26, 7, K.pink, -100)}</g></g>
      <path d="M80 72 V80 M76 76 H84 M22 70 V76 M19 73 H25" stroke="${K.sun}" stroke-width="2.5" stroke-linecap="round"/>`,
    // 彩虹: a rainbow between two clouds in a blue sky
    "虹": `${SKY}<g fill="none" stroke-width="5.5">
        <path d="M15 72 A35 35 0 0 1 85 72" stroke="${K.red}"/><path d="M20.5 72 A29.5 29.5 0 0 1 79.5 72" stroke="${K.orange}"/>
        <path d="M26 72 A24 24 0 0 1 74 72" stroke="${K.yellow}"/><path d="M31.5 72 A18.5 18.5 0 0 1 68.5 72" stroke="${K.green}"/>
        <path d="M37 72 A13 13 0 0 1 63 72" stroke="${K.blue}"/><path d="M42.5 72 A7.5 7.5 0 0 1 57.5 72" stroke="${K.purple}"/></g>
      ${cloud(22, 70, 0.75)}${cloud(78, 70, 0.75)}`,
    // 好热: so hot, a thermometer up to the top, a red-hot sun and heat waves
    "热": `<path d="M64 8 V14 M84 20 L80 24 M44 20 L48 24 M90 38 H84" stroke="${K.rust}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="64" cy="36" r="17" fill="${K.rust}"/><circle cx="64" cy="36" r="12" fill="${K.orange}"/><circle cx="59" cy="31" r="3.5" fill="${K.cream}"/>
      <path d="M56 60 Q51 66 56 72 Q61 78 56 84 M70 60 Q65 66 70 72 Q75 78 70 84" stroke="${K.orange}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <rect x="24" y="16" width="16" height="58" rx="8" fill="${K.white}" stroke="${K.mist}" stroke-width="2.5"/>
      <circle cx="32" cy="74" r="12" fill="${K.red}"/><rect x="28" y="22" width="8" height="50" rx="4" fill="${K.red}"/>
      <path d="M40 30 H45 M40 40 H45 M40 50 H45 M40 60 H45" stroke="${K.slate}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="28.5" cy="70" r="3" fill="#ff9a9a"/>`,
    // 晚上: evening, an orange and purple sky with the lights on in a house
    "晚": `<circle cx="50" cy="50" r="40" fill="${K.orange}"/>
      <path d="M10.81 58 A40 40 0 1 1 89.19 58 Z" fill="${K.pink}"/><path d="M11.27 40 A40 40 0 0 1 88.73 40 Z" fill="${K.purple}"/>
      <path d="M30 18 A9 9 0 1 0 38 30 A7 7 0 1 1 30 18 Z" fill="${K.cream}"/>${star5(66, 22, 3, K.cream)}${star5(80, 34, 2, K.cream)}
      <path d="M11.84 70 Q30 64 50 68 Q70 64 88.16 70 A40 40 0 0 1 11.84 70 Z" fill="${K.deep}"/>
      <rect x="38" y="52" width="30" height="24" rx="2" fill="${K.ink}"/><path d="M33 54 L53 38 L73 54 Z" fill="${K.ink}" stroke="${K.ink}" stroke-width="3" stroke-linejoin="round"/>
      <rect x="43" y="57" width="9" height="8" rx="1.5" fill="${K.yellow}"/><rect x="56" y="57" width="8" height="8" rx="1.5" fill="${K.yellow}"/>
      <rect x="47" y="67" width="8" height="9" rx="1.5" fill="${K.sun}"/>`,
    // 晴天: a clear sunny day, the sun in sunglasses in a blue sky over green hills, not a cloud in sight
    "晴": `${SKY}
      <path d="M11.84 62 Q36 44 62 60 Q76 52 88.16 62 A40 40 0 0 1 11.84 62 Z" fill="${K.hill}"/>
      <path d="M15.36 70 Q50 56 84.64 70 A40 40 0 0 1 15.36 70 Z" fill="${K.green}"/>
      <path d="M50 12 V17 M50 51 V55 M29 34 H33 M67 34 H71 M35 19 L38 22 M65 19 L62 22 M35 49 L38 46 M65 49 L62 46" stroke="${K.sun}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="50" cy="34" r="14" fill="${K.yellow}"/>
      <rect x="40" y="29" width="9" height="7" rx="3" fill="${K.ink}"/><rect x="51" y="29" width="9" height="7" rx="3" fill="${K.ink}"/><path d="M48 31 H52" stroke="${K.ink}" stroke-width="2"/>
      <path d="M45 40 Q50 44 55 40" stroke="${K.ink}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
    // 打雷: thunder, a dark storm cloud with a lightning bolt and rumbling zigzags
    "雷": `<path d="M12 50 L17 46 L17 54 L22 50 M88 50 L83 46 L83 54 L78 50 M16 66 L21 62 L21 70 L26 66 M84 66 L79 62 L79 70 L74 66" stroke="${K.purple}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      ${cloud(50, 34, 1.45, K.slate)}<path d="M36 34 Q44 28 52 32" stroke="${K.grey}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M50 48 L37 70 H48 L41 90 L64 62 H52 L60 48 Z" fill="${K.yellow}" stroke="${K.sun}" stroke-width="2" stroke-linejoin="round"/>`,

    // 贝壳: a pink scallop seashell
    "贝": `<path d="M50 80 L17 46 Q15 39 20 35 Q21 27 29 25 Q33 17 42 18 Q50 11 58 18 Q67 17 71 25 Q79 27 80 35 Q85 39 83 46 Z" fill="${K.pink}"/>
      <path d="M50 78 L23 40 M50 78 L34 25 M50 78 V18 M50 78 L66 25 M50 78 L77 40" stroke="${K.rose}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M39 76 H61 L57 86 H43 Z" fill="${K.rose}"/><ellipse cx="38" cy="32" rx="4" ry="6" fill="${K.blush}" transform="rotate(-25 38 32)"/>`,
    // 恐龙: a friendly long-necked dinosaur with orange spikes on its back
    "龙": `<path d="M72 54 Q88 60 86 76 Q80 66 70 66 Z" fill="${K.green}"/>
      <rect x="40" y="62" width="9" height="20" rx="4" fill="${K.deep}"/><rect x="62" y="62" width="9" height="20" rx="4" fill="${K.deep}"/>
      <path d="M44 48 L48 38 L53 46 L58 37 L62 46 L67 39 L70 49 Z" fill="${K.orange}"/>
      <path d="M44 56 Q38 40 32 28" stroke="${K.green}" stroke-width="13" fill="none" stroke-linecap="round"/>
      <ellipse cx="57" cy="60" rx="22" ry="14" fill="${K.green}"/>
      <rect x="47" y="66" width="9" height="18" rx="4" fill="${K.green}"/><rect x="68" y="64" width="9" height="18" rx="4" fill="${K.green}"/>
      <ellipse cx="54" cy="64" rx="13" ry="6" fill="${K.leaf}"/>
      <ellipse cx="27" cy="25" rx="12" ry="9" fill="${K.green}"/><circle cx="26" cy="22" r="2.6" fill="${K.ink}"/>
      <path d="M17 28 Q21 31 26 29" stroke="${K.ink}" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="31" cy="27" r="2.5" fill="${K.blush}"/>`,
    // 乌龟: a tortoise walking, with a round patterned shell
    "龟": `<path d="M80 62 L90 66 L80 68 Z" fill="${K.leaf}"/>
      <ellipse cx="34" cy="70" rx="7" ry="10" fill="${K.leaf}"/><ellipse cx="68" cy="70" rx="7" ry="10" fill="${K.leaf}"/>
      <path d="M26 58 Q20 50 18 44" stroke="${K.leaf}" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="18" cy="42" r="10" fill="${K.leaf}"/>
      <circle cx="15" cy="40" r="2.6" fill="${K.ink}"/><path d="M10 46 Q13 48 16 47" stroke="${K.ink}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <path d="M24 64 Q24 30 52 30 Q80 30 82 64 Z" fill="${K.hill}"/><rect x="21" y="60" width="64" height="7" rx="3.5" fill="${K.deep}"/>
      <path d="M45 40 H59 L64 50 L59 60 H45 L40 50 Z" fill="${K.green}"/>
      <path d="M45 40 L38 33 M59 40 L66 33 M64 50 H80 M40 50 H25 M45 60 L42 63 M59 60 L62 63" stroke="${K.deep}" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="40" cy="38" rx="5" ry="3" fill="${K.leaf}" opacity=".7"/>`,
    // 小鸡: a fluffy yellow chick, facing us, standing on the grass
    "鸡": `<path d="M18 82 Q50 74 82 82" stroke="${K.green}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M42 74 V82 M38 82 H46 M58 74 V82 M54 82 H62" stroke="${K.orange}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M46 24 Q46 14 52 18 Q54 12 58 20" stroke="${K.sun}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <circle cx="50" cy="50" r="27" fill="${K.yellow}"/>
      <path d="M24 50 Q16 58 22 66 Q28 62 28 54 Z M76 50 Q84 58 78 66 Q72 62 72 54 Z" fill="${K.sun}"/>
      <circle cx="41" cy="38" r="6" fill="${K.cream}"/>
      <circle cx="41" cy="46" r="3.5" fill="${K.ink}"/><circle cx="59" cy="46" r="3.5" fill="${K.ink}"/>
      <path d="M44 52 L56 52 L50 60 Z" fill="${K.orange}"/>
      <ellipse cx="35" cy="54" rx="4" ry="2.5" fill="${K.blush}"/><ellipse cx="65" cy="54" rx="4" ry="2.5" fill="${K.blush}"/>`,
    // 兔子: a brown rabbit sitting up, with a carrot
    "兔": `<ellipse cx="76" cy="62" rx="7" ry="7" fill="${K.cream}"/>
      <ellipse cx="58" cy="64" rx="20" ry="17" fill="${K.wood}"/><ellipse cx="54" cy="80" rx="12" ry="4.5" fill="${K.brown}"/>
      <ellipse cx="36" cy="28" rx="5.5" ry="14" fill="${K.wood}" transform="rotate(-12 36 28)"/><ellipse cx="47" cy="27" rx="5.5" ry="14" fill="${K.wood}" transform="rotate(12 47 27)"/>
      <ellipse cx="36" cy="29" rx="2.5" ry="9" fill="${K.blush}" transform="rotate(-12 36 29)"/><ellipse cx="47" cy="28" rx="2.5" ry="9" fill="${K.blush}" transform="rotate(12 47 28)"/>
      <circle cx="41" cy="48" r="14" fill="${K.wood}"/><ellipse cx="56" cy="68" rx="9" ry="10" fill="${K.cream}"/>
      <circle cx="36" cy="46" r="2.8" fill="${K.ink}"/><circle cx="29" cy="52" r="2.2" fill="${K.pink}"/><circle cx="42" cy="53" r="3" fill="${K.blush}"/>
      <g transform="rotate(-30 28 72)"><path d="M22 62 H34 L28 84 Z" fill="${K.orange}"/><path d="M25 68 H29 M26 74 H29" stroke="${K.rust}" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M28 62 L23 53 M28 62 V51 M28 62 L33 53" stroke="${K.green}" stroke-width="3.5" stroke-linecap="round"/></g>`,
    // 老虎: a friendly tiger's face, with round ears and stripes
    "虎": `<circle cx="25" cy="28" r="10" fill="${K.orange}"/><circle cx="75" cy="28" r="10" fill="${K.orange}"/>
      <circle cx="25" cy="28" r="5" fill="${K.cream}"/><circle cx="75" cy="28" r="5" fill="${K.cream}"/>
      <ellipse cx="50" cy="52" rx="33" ry="29" fill="${K.orange}"/>
      <path d="M41 26 L44 34 M50 24 V34 M59 26 L56 34 M18 46 H28 M17 56 L27 55 M82 46 H72 M83 56 L73 55" stroke="${K.ink}" stroke-width="3.5" stroke-linecap="round"/>
      <ellipse cx="40" cy="65" rx="12" ry="9" fill="${K.white}"/><ellipse cx="60" cy="65" rx="12" ry="9" fill="${K.white}"/><ellipse cx="50" cy="72" rx="8" ry="5" fill="${K.white}"/>
      <circle cx="38" cy="47" r="4.5" fill="${K.ink}"/><circle cx="62" cy="47" r="4.5" fill="${K.ink}"/><circle cx="39.5" cy="45.5" r="1.5" fill="${K.white}"/><circle cx="63.5" cy="45.5" r="1.5" fill="${K.white}"/>
      <path d="M45 57 H55 L50 62 Z" fill="${K.rose}"/><path d="M44 66 Q50 70 50 62 Q50 70 56 66" stroke="${K.ink}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
    // 鸭子: a duck (green head, white collar) swimming on the water
    "鸭": `<path d="M12.58 66 Q22 60 30 66 T50 66 T70 66 T87.42 66 A40 40 0 0 1 12.58 66 Z" fill="${K.blue}"/>
      <path d="M72 54 L86 44 L82 60 Z" fill="${K.slate}"/>
      <ellipse cx="54" cy="60" rx="26" ry="13" fill="${K.mist}"/><path d="M28 60 Q30 48 42 48 Q46 56 44 70 Q32 70 28 60 Z" fill="${K.brown}"/>
      <path d="M48 56 Q62 48 76 56 Q64 66 48 62 Z" fill="${K.grey}"/>
      <path d="M36 50 L38 34" stroke="${K.deep}" stroke-width="11" stroke-linecap="round"/><path d="M33 47 Q38 50 43 47" stroke="${K.white}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <circle cx="36" cy="32" r="11" fill="${K.deep}"/><path d="M26 32 Q14 32 15 37 Q20 40 27 37 Z" fill="${K.yellow}"/>
      <circle cx="34" cy="29" r="2.5" fill="${K.ink}"/><circle cx="34.8" cy="28.2" r=".9" fill="${K.white}"/>
      <path d="M20 74 Q26 70 32 74 M64 78 Q70 74 76 78" stroke="${K.sky}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
    // 小象: a baby elephant facing us, trunk up, with a pink bow
    "象": `<circle cx="26" cy="44" r="17" fill="${K.grey}"/><circle cx="74" cy="44" r="17" fill="${K.grey}"/>
      <ellipse cx="27" cy="45" rx="10" ry="11" fill="${K.blush}"/><ellipse cx="73" cy="45" rx="10" ry="11" fill="${K.blush}"/>
      <ellipse cx="50" cy="76" rx="18" ry="12" fill="${K.grey}"/><ellipse cx="40" cy="84" rx="6" ry="3.5" fill="${K.mist}"/><ellipse cx="60" cy="84" rx="6" ry="3.5" fill="${K.mist}"/>
      <circle cx="50" cy="44" r="19" fill="${K.grey}"/>
      <path d="M50 54 Q50 70 62 70 Q68 70 68 62" stroke="${K.grey}" stroke-width="10" fill="none" stroke-linecap="round"/>
      <circle cx="42" cy="42" r="3" fill="${K.ink}"/><circle cx="58" cy="42" r="3" fill="${K.ink}"/><circle cx="43" cy="41" r="1" fill="${K.white}"/><circle cx="59" cy="41" r="1" fill="${K.white}"/>
      <ellipse cx="37" cy="50" rx="3.5" ry="2.2" fill="${K.blush}"/><ellipse cx="63" cy="50" rx="3.5" ry="2.2" fill="${K.blush}"/>
      <path d="M50 26 L40 20 L40 32 Z M50 26 L60 20 L60 32 Z" fill="${K.pink}"/><circle cx="50" cy="26" r="3.5" fill="${K.rose}"/>
      ${bubble(72, 60, 3)}${bubble(78, 52, 2.3)}`,
    // 小猫: a whole grey kitten sitting, with its tail curled round
    "猫": `<path d="M64 82 Q84 82 84 66 Q84 56 76 54" stroke="${K.grey}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M34 84 Q30 62 42 52 H58 Q70 62 66 84 Z" fill="${K.grey}"/><ellipse cx="50" cy="66" rx="8" ry="10" fill="${K.white}"/>
      <path d="M33 64 Q38 62 39 66 M67 64 Q62 62 61 66" stroke="${K.slate}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="43" cy="84" rx="6" ry="3.5" fill="${K.white}"/><ellipse cx="57" cy="84" rx="6" ry="3.5" fill="${K.white}"/>
      <path d="M34 36 L33 15 L47 27 Z M66 36 L67 15 L53 27 Z" fill="${K.grey}"/><path d="M36 30 L36 20 L43 27 Z M64 30 L64 20 L57 27 Z" fill="${K.blush}"/>
      <ellipse cx="50" cy="40" rx="18" ry="15" fill="${K.grey}"/>
      <path d="M50 26 V31 M44 27 L45 31 M56 27 L55 31" stroke="${K.slate}" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="43" cy="40" r="3" fill="${K.ink}"/><circle cx="57" cy="40" r="3" fill="${K.ink}"/>
      <path d="M48 45 H52 L50 47.5 Z" fill="${K.pink}"/><path d="M38 47 H28 M38 50 L29 53 M62 47 H72 M62 50 L71 53" stroke="${K.ink}" stroke-width="1.5" stroke-linecap="round"/>`,
    // 小猪: a pink pig with a curly tail
    "猪": `<path d="M80 52 Q88 48 86 42 Q84 38 80 42 Q78 46 84 46" stroke="${K.pink}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <rect x="40" y="62" width="8" height="18" rx="3" fill="${K.pink}"/><rect x="68" y="62" width="8" height="18" rx="3" fill="${K.pink}"/>
      <ellipse cx="57" cy="56" rx="25" ry="19" fill="${K.blush}"/>
      <rect x="47" y="64" width="8" height="18" rx="3" fill="${K.blush}"/><rect x="62" y="64" width="8" height="18" rx="3" fill="${K.blush}"/>
      <path d="M26 30 L22 18 L34 26 Z M38 28 L42 16 L46 30 Z" fill="${K.pink}"/>
      <circle cx="32" cy="46" r="16" fill="${K.blush}"/>
      <ellipse cx="20" cy="50" rx="7" ry="8" fill="${K.pink}"/><ellipse cx="18" cy="47" rx="1.6" ry="2.4" fill="${K.rose}"/><ellipse cx="18" cy="53" rx="1.6" ry="2.4" fill="${K.rose}"/>
      <circle cx="30" cy="41" r="2.8" fill="${K.ink}"/><ellipse cx="36" cy="52" rx="4" ry="2.5" fill="${K.pink}"/>`,
    // 小蛇: a cute little purple snake with a happy face
    "蛇": `<path d="M16 76 Q30 58 44 72 Q58 86 70 68 Q78 56 70 44" stroke="${K.purple}" stroke-width="14" fill="none" stroke-linecap="round"/>
      <g fill="${K.lilac}"><circle cx="26" cy="68" r="2.5"/><circle cx="44" cy="72" r="2.5"/><circle cx="58" cy="76" r="2.5"/><circle cx="73" cy="58" r="2.5"/></g>
      <ellipse cx="66" cy="34" rx="16" ry="13" fill="${K.purple}"/>
      <circle cx="60" cy="31" r="4" fill="${K.white}"/><circle cx="72" cy="31" r="4" fill="${K.white}"/><circle cx="60.5" cy="31.5" r="2.4" fill="${K.ink}"/><circle cx="72.5" cy="31.5" r="2.4" fill="${K.ink}"/>
      <path d="M60 40 Q66 45 72 40" stroke="${K.ink}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <ellipse cx="55" cy="39" rx="3" ry="2" fill="${K.pink}"/><ellipse cx="77" cy="39" rx="3" ry="2" fill="${K.pink}"/>`,
    // 小鹿: a fawn with white spots and little antlers
    "鹿": `<path d="M32 25 V12 M32 17 L26 11 M41 24 L45 12 M43 17 L49 14" stroke="${K.brown}" stroke-width="3" stroke-linecap="round"/>
      <rect x="44" y="62" width="5" height="22" rx="2.5" fill="${K.brown}"/><rect x="66" y="62" width="5" height="22" rx="2.5" fill="${K.brown}"/>
      <path d="M72 50 Q80 46 79 54 Z" fill="${K.cream}"/>
      <ellipse cx="58" cy="58" rx="20" ry="12" fill="${K.wood}"/>
      <rect x="50" y="62" width="5" height="22" rx="2.5" fill="${K.wood}"/><rect x="72" y="60" width="5" height="22" rx="2.5" fill="${K.wood}"/>
      <path d="M32 36 L44 32 L52 56 L40 60 Z" fill="${K.wood}"/>
      <ellipse cx="34" cy="33" rx="11" ry="9" fill="${K.wood}"/><ellipse cx="24" cy="37" rx="7" ry="5.5" fill="${K.wood}"/><circle cx="18.5" cy="36" r="2.6" fill="${K.ink}"/>
      <ellipse cx="45" cy="25" rx="8" ry="3.5" fill="${K.wood}" transform="rotate(-30 45 25)"/><ellipse cx="45" cy="25" rx="4.5" ry="1.6" fill="${K.blush}" transform="rotate(-30 45 25)"/>
      <circle cx="33" cy="31" r="2.6" fill="${K.ink}"/><circle cx="33.8" cy="30.2" r=".9" fill="${K.white}"/>
      <g fill="${K.cream}"><circle cx="52" cy="52" r="2.5"/><circle cx="60" cy="50" r="2.5"/><circle cx="68" cy="53" r="2.5"/><circle cx="57" cy="57" r="2"/><circle cx="64" cy="58" r="2"/></g>`,
    // 猴子: a monkey eating a banana
    "猴": `<path d="M68 80 Q86 80 84 64 Q82 56 76 58" stroke="${K.brown}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <ellipse cx="50" cy="76" rx="17" ry="12" fill="${K.brown}"/><ellipse cx="50" cy="78" rx="10" ry="8" fill="${K.skin}"/>
      <circle cx="26" cy="42" r="9" fill="${K.brown}"/><circle cx="74" cy="42" r="9" fill="${K.brown}"/><circle cx="26" cy="42" r="5" fill="${K.skin}"/><circle cx="74" cy="42" r="5" fill="${K.skin}"/>
      <circle cx="50" cy="42" r="22" fill="${K.brown}"/>
      <g fill="${K.skin}"><circle cx="43" cy="40" r="9"/><circle cx="57" cy="40" r="9"/><ellipse cx="50" cy="53" rx="14" ry="10"/></g>
      <circle cx="43" cy="40" r="3" fill="${K.ink}"/><circle cx="57" cy="40" r="3" fill="${K.ink}"/>
      <circle cx="47.5" cy="49" r="1.3" fill="${K.soil}"/><circle cx="52.5" cy="49" r="1.3" fill="${K.soil}"/>
      <path d="M43 54 Q50 60 57 54" stroke="${K.ink}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M30 66 Q22 70 26 74 M70 66 Q78 70 74 74" stroke="${K.brown}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M22 72 Q20 58 30 50 Q28 62 32 72 Z" fill="${K.yellow}" stroke="${K.sun}" stroke-width="1.5" stroke-linejoin="round"/>`,
    // 熊猫: a panda sitting, holding bamboo
    "熊": `<path d="M74 88 L80 26" stroke="${K.green}" stroke-width="6" stroke-linecap="round"/><path d="M73 72 H81 M76 46 H82" stroke="${K.deep}" stroke-width="2.5"/>
      <path d="M80 30 Q90 24 92 16 Q82 18 80 28 Z M78 52 Q66 46 64 38 Q74 40 78 50 Z" fill="${K.leaf}"/>
      <ellipse cx="50" cy="70" rx="22" ry="17" fill="${K.white}" stroke="${K.mist}" stroke-width="2"/>
      <ellipse cx="34" cy="82" rx="9" ry="7" fill="${K.ink}"/><ellipse cx="66" cy="82" rx="9" ry="7" fill="${K.ink}"/>
      <circle cx="33" cy="24" r="8" fill="${K.ink}"/><circle cx="67" cy="24" r="8" fill="${K.ink}"/>
      <circle cx="50" cy="40" r="21" fill="${K.white}" stroke="${K.mist}" stroke-width="2"/>
      <ellipse cx="41" cy="40" rx="6" ry="8" fill="${K.ink}" transform="rotate(25 41 40)"/><ellipse cx="59" cy="40" rx="6" ry="8" fill="${K.ink}" transform="rotate(-25 59 40)"/>
      <circle cx="42" cy="38" r="2" fill="${K.white}"/><circle cx="58" cy="38" r="2" fill="${K.white}"/>
      <ellipse cx="50" cy="49" rx="3.5" ry="2.5" fill="${K.ink}"/><path d="M46 54 Q50 57 54 54" stroke="${K.ink}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="M32 62 Q40 70 52 66 M68 60 Q74 56 77 54" stroke="${K.ink}" stroke-width="9" fill="none" stroke-linecap="round"/>`,

    // 儿子: a dad carrying his son on his shoulders, the boy waving both arms
    "儿": `<g transform="translate(50 92) scale(0.85)">
        <path d="M-4 -16 V0 M4 -16 V0" stroke="${K.slate}" stroke-width="6" stroke-linecap="round" fill="none"/>
        <rect x="-10" y="-38" width="20" height="24" rx="7" fill="${K.navy}"/>
        <path d="M-9 -33 L-15 -45 M9 -33 L15 -45" stroke="${K.skin}" stroke-width="5" stroke-linecap="round" fill="none"/>
        <circle cx="0" cy="-47" r="10" fill="${K.skin}"/>
        <path d="M-10 -48 Q-10 -59 0 -59 Q10 -59 10 -48 Q5 -53 -10 -48 Z" fill="${K.ink}"/>
        ${face(0, -46, 0.9)}
        <path d="M-7 -78 L-17 -88 M7 -78 L17 -88" stroke="${K.skin}" stroke-width="4" stroke-linecap="round" fill="none"/>
        <rect x="-8" y="-81" width="16" height="20" rx="6" fill="${K.yellow}"/>
        <path d="M-5 -62 L-15 -47 M5 -62 L15 -47" stroke="${K.orange}" stroke-width="5.5" stroke-linecap="round" fill="none"/>
        <circle cx="-15" cy="-45" r="3.4" fill="${K.skin}"/><circle cx="15" cy="-45" r="3.4" fill="${K.skin}"/>
        <circle cx="0" cy="-89" r="8" fill="${K.skin}"/>
        <path d="M-8 -90 Q-8 -99 0 -99 Q8 -99 8 -90 Q4 -94 -8 -90 Z" fill="${K.hair}"/>
        ${face(0, -88, 0.75)}
      </g>`,
    // 友好: friendly, two children giving each other a high five
    "友": `${bust(27, 58, 0.88, { hairStyle: "short", shirt: K.blue })}${bust(73, 58, 0.88, { hairStyle: "pigtails", shirt: K.pink })}
      <path d="M36 76 Q42 52 45 34 M64 76 Q58 52 55 34" stroke="${K.skin}" stroke-width="6" fill="none" stroke-linecap="round"/>
      ${mini(backHand, 44, 26, 0.24)}${mini(backHand, 56, 26, 0.24, true)}
      <path d="M50 12 V6 M38 14 L34 9 M62 14 L66 9" stroke="${K.sun}" stroke-width="3.5" stroke-linecap="round"/>`,
    // 我给外公捶捶背: a child behind grandpa, tapping his shoulders with two little fists
    "公": `${bust(50, 25, 0.72, { hairStyle: "short", shirt: K.orange })}
      ${bust(50, 55, 1.0, { hairStyle: "short", hair: K.mist, shirt: K.green })}
      <path d="M40 60 Q45 56.5 50 59 Q55 56.5 60 60 Q55 63 50 61 Q45 63 40 60 Z" fill="${K.white}"/>
      <path d="M39 41 Q27 52 31 70 M61 41 Q73 52 69 70" stroke="${K.skin}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <circle cx="31" cy="72" r="5.5" fill="${K.skin2}"/><circle cx="69" cy="72" r="5.5" fill="${K.skin2}"/>
      <path d="M20 66 Q17 72 20 78 M80 66 Q83 72 80 78" stroke="${K.sun}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    // 他们: they, a group of boys
    "他": `${bust(30, 44, 0.85, { hairStyle: "short", shirt: K.green })}${bust(70, 44, 0.85, { hairStyle: "short", shirt: K.orange, hair: K.ink })}
      ${bust(50, 56, 0.95, { hairStyle: "short", shirt: K.navy })}`,
    // 你们: you (more than one), a hand pointing at three children
    "们": `${person(44, 82, 0.58, { shirt: K.pink, long: true })}${person(61, 82, 0.62, { shirt: K.blue })}${person(78, 80, 0.56, { shirt: K.green, hair: K.ink })}
      <g transform="rotate(10 24 56)"><rect x="6" y="49" width="10" height="16" rx="3" fill="${K.purple}"/>
      <rect x="13" y="48" width="18" height="17" rx="7" fill="${K.skin}"/><rect x="22" y="48" width="18" height="6.5" rx="3.25" fill="${K.skin}"/>
      <path d="M18 56 H27 M18 61 H27" stroke="${K.skin2}" stroke-width="2" stroke-linecap="round"/></g>`,
    // 奶奶包的饺子真好吃: grandma holding a plate of dumplings
    "奶": `<circle cx="50" cy="20" r="7" fill="#e3e7ef"/>${bust(50, 40, 1.1, { hairStyle: "bob", hair: "#e3e7ef", shirt: K.rose })}
      <ellipse cx="50" cy="76" rx="28" ry="9" fill="${K.blue}"/><ellipse cx="50" cy="75" rx="21" ry="6" fill="${K.sky}"/>
      ${[[37, 74], [50, 72], [63, 74]].map(([x, y]) => `<path d="M${x - 9} ${y + 1} Q${x - 9} ${y - 10} ${x} ${y - 10} Q${x + 9} ${y - 10} ${x + 9} ${y + 1} Q${x} ${y + 4} ${x - 9} ${y + 1} Z" fill="#fbf6ec" stroke="${K.mist}" stroke-width="1.2"/>
        <path d="M${x - 4} ${y - 9} l1 3 M${x} ${y - 10} v3 M${x + 4} ${y - 9} l-1 3" stroke="${K.mist}" stroke-width="1.2" stroke-linecap="round"/>`).join("")}
      <circle cx="22" cy="77" r="5" fill="${K.skin}"/><circle cx="78" cy="77" r="5" fill="${K.skin}"/>
      <path d="M78 52 Q74 46 78 40 Q82 34 78 28 M86 54 Q82 48 86 42" stroke="${K.mist}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    // 兄弟: brothers, two boys side by side in matching striped tops, holding hands
    "兄": `<path d="M16 86 H84" stroke="${K.green}" stroke-width="5" stroke-linecap="round"/>
      ${person(36, 86, 1.0, { shirt: K.blue })}${person(64, 86, 0.9, { shirt: K.blue })}
      <g transform="translate(36 86)"><path d="M-10 -30 H10 M-10 -22 H10" stroke="${K.white}" stroke-width="3"/></g>
      <g transform="translate(64 86) scale(.9)"><path d="M-10 -30 H10 M-10 -22 H10" stroke="${K.white}" stroke-width="3"/></g>
      <path d="M47 68 Q50 70 54 70" stroke="${K.skin}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    // 她们: they, a group of girls
    "她": `${bust(30, 44, 0.85, { hairStyle: "pigtails", shirt: K.yellow })}${bust(70, 44, 0.85, { hairStyle: "pony", shirt: K.green })}
      ${bust(50, 56, 0.95, { hairStyle: "long", shirt: K.pink })}`,
    // 爷爷又在找眼镜了: grandpa looking for his glasses, which are on top of his head
    "爷": `${bust(46, 50, 1.15, { hairStyle: "short", hair: K.mist, shirt: K.blue })}
      <g fill="${K.sky}" stroke="${K.ink}" stroke-width="2.6"><circle cx="38" cy="31" r="6"/><circle cx="54" cy="31" r="6"/></g>
      <path d="M44 31 H48" stroke="${K.ink}" stroke-width="2.6"/>
      <path d="M33 59 Q40 55 46 58 Q52 55 59 59 Q52 62 46 60 Q40 62 33 59 Z" fill="${K.white}"/>
      <path d="M70 22 Q70 14 77 14 Q84 14 84 21 Q84 26 78 28 V32" stroke="${K.purple}" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="78" cy="40" r="2.8" fill="${K.purple}"/>`,
    // 新年: New Year, two red lanterns
    "年": `<path d="M12 30 Q50 40 88 30" stroke="${K.brown}" stroke-width="3" fill="none"/>
      ${[[31, 56], [69, 56]].map(([x, y]) => `<path d="M${x} 35 V${y - 16}" stroke="${K.sun}" stroke-width="2.5"/>
        <rect x="${x - 7}" y="${y - 19}" width="14" height="5" rx="1.5" fill="${K.sun}"/><rect x="${x - 7}" y="${y + 14}" width="14" height="5" rx="1.5" fill="${K.sun}"/>
        <ellipse cx="${x}" cy="${y}" rx="17" ry="15" fill="${K.red}"/>
        <path d="M${x} ${y - 15} V${y + 15} M${x - 9} ${y - 12} Q${x - 14} ${y} ${x - 9} ${y + 12} M${x + 9} ${y - 12} Q${x + 14} ${y} ${x + 9} ${y + 12}" stroke="${K.berry}" stroke-width="2" fill="none"/>
        <ellipse cx="${x - 8}" cy="${y - 6}" rx="3" ry="5" fill="#ff9a9a"/>
        <path d="M${x - 3} ${y + 19} V${y + 30} M${x} ${y + 19} V${y + 32} M${x + 3} ${y + 19} V${y + 30}" stroke="${K.yellow}" stroke-width="2.5" stroke-linecap="round"/>`).join("")}`,
    // 谢谢你: a child handing a flower to a friend, to say thank you
    "你": `${bust(28, 52, 0.92, { hairStyle: "pony", shirt: K.green })}${bust(72, 52, 0.92, { hairStyle: "bob", shirt: K.orange })}
      <path d="M38 76 Q42 66 46 62" stroke="${K.skin}" stroke-width="5.5" fill="none" stroke-linecap="round"/>
      <path d="M48 64 V44" stroke="${K.deep}" stroke-width="3" stroke-linecap="round"/><path d="M48 56 Q40 52 40 46 Q46 48 48 54 Z" fill="${K.green}"/>
      ${mini(flowerHead(K.pink), 48, 38, 0.2)}<circle cx="47" cy="62" r="4" fill="${K.skin}"/>
      <path d="M62 76 Q58 70 54 66" stroke="${K.skin}" stroke-width="5.5" fill="none" stroke-linecap="round"/><circle cx="53" cy="64" r="4" fill="${K.skin}"/>
      ${heart(50, 20, 0.35, K.pink)}`,
    // 朋友: friends, two children standing arm in arm
    "朋": `${bust(36, 48, 1.0, { hairStyle: "short", shirt: K.orange })}${bust(64, 48, 1.0, { hairStyle: "pony", shirt: K.purple })}
      <path d="M44 74 Q60 62 79 68" stroke="${K.skin}" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="80" cy="69" r="4.5" fill="${K.skin}"/>
      ${star5(50, 20, 6, K.yellow)}${star5(26, 22, 3.5, K.yellow)}${star5(75, 20, 3.5, K.yellow)}`,
    // 宝宝: a baby wrapped in a blanket, with a dummy and a bottle
    "宝": `<path d="M26 44 Q26 18 50 18 Q74 18 74 44 L68 80 Q50 92 32 80 Z" fill="${K.blush}"/>
      <path d="M32 62 L68 54 L66 72 Q50 80 34 74 Z" fill="${K.pink}"/>
      <circle cx="50" cy="42" r="15" fill="${K.skin}"/><path d="M48 28 Q52 22 56 28" stroke="${K.hair}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle cx="44.5" cy="40" r="1.8" fill="${K.ink}"/><circle cx="55.5" cy="40" r="1.8" fill="${K.ink}"/>
      <ellipse cx="40" cy="46" rx="3.5" ry="2.2" fill="${K.blush}"/><ellipse cx="60" cy="46" rx="3.5" ry="2.2" fill="${K.blush}"/>
      <ellipse cx="50" cy="49" rx="6" ry="3.5" fill="${K.blue}"/><circle cx="50" cy="53" r="3" fill="none" stroke="${K.navy}" stroke-width="2"/>
      <g transform="rotate(25 74 62) translate(-4 2)"><rect x="73" y="54" width="11" height="22" rx="4" fill="${K.sky}"/><rect x="73" y="64" width="11" height="12" rx="4" fill="${K.white}"/>
      <rect x="72" y="50" width="13" height="5" rx="2" fill="${K.blue}"/><path d="M75 50 Q78.5 40 82 50 Z" fill="${K.cream}"/></g>`,
    // 阿姨: auntie, a young woman in a dress with a handbag
    "姨": `${person(48, 86, 1.12, { shirt: K.purple, long: true, pants: K.skin2 })}
      <g transform="translate(48 86) scale(1.12)"><path d="M-10 -18 H10 L15 -5 H-15 Z" fill="${K.purple}"/>
      <path d="M8 -20 Q13 -26 18 -20" stroke="${K.berry}" stroke-width="1.8" fill="none"/><rect x="7" y="-20" width="13" height="10" rx="3" fill="${K.red}"/>
      <circle cx="-7" cy="-56" r="3" fill="${K.pink}"/><circle cx="-10" cy="-42" r="1.6" fill="${K.yellow}"/><circle cx="10" cy="-42" r="1.6" fill="${K.yellow}"/></g>`,
    // 拜年: a child in a red jacket, bowing with two mandarin oranges
    "拜": `<g transform="rotate(8 50 70)">${bust(50, 38, 1.1, { hairStyle: "bob", shirt: K.red })}
      <path d="M50 56 V75" stroke="${K.berry}" stroke-width="2"/><g fill="${K.yellow}"><circle cx="50" cy="62" r="2"/><circle cx="50" cy="69" r="2"/></g></g>
      <ellipse cx="50" cy="80" rx="20" ry="6" fill="${K.skin}"/>
      ${[[40, 73], [60, 73]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="${K.orange}"/><circle cx="${x - 3.5}" cy="${y - 3.5}" r="2.8" fill="#ffc890"/>
        <path d="M${x} ${y - 10} Q${x + 7} ${y - 16} ${x + 10} ${y - 10} Q${x + 4} ${y - 7} ${x} ${y - 10} Z" fill="${K.green}"/>`).join("")}`,
    // 哥哥比弟弟高: big brother, much taller than little brother, with an arrow pointing at him
    "哥": `<ellipse cx="36" cy="54" rx="22" ry="34" fill="${K.cream}" opacity=".7"/>
      <path d="M14 86 H86" stroke="${K.green}" stroke-width="5" stroke-linecap="round"/>
      ${person(36, 86, 1.12, { shirt: K.navy })}${person(68, 86, 0.66, { shirt: K.green })}
      ${arrow("M82 30 H56 M64 22 L56 30 L64 38", K.orange)}`,
    // 我给外婆倒杯茶: a child pouring a cup of tea for grandma
    "婆": `<circle cx="28" cy="28" r="6" fill="#e3e7ef"/>${bust(28, 46, 0.92, { hairStyle: "bob", hair: "#e3e7ef", shirt: K.purple })}
      ${bust(74, 48, 0.8, { hairStyle: "pigtails", shirt: K.yellow })}
      <rect x="18" y="74" width="64" height="7" rx="3" fill="${K.wood}"/>
      <path d="M38 62 H54 V67 Q54 74 46 74 Q38 74 38 67 Z" fill="${K.blue}"/><path d="M54 64 Q59 65 54 70" stroke="${K.blue}" stroke-width="2.5" fill="none"/>
      <path d="M49 52 Q46 56 46 63" stroke="${K.wood}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <g transform="rotate(-25 62 50)"><ellipse cx="62" cy="52" rx="10" ry="8" fill="${K.green}"/><rect x="58" y="42" width="8" height="4" rx="2" fill="${K.deep}"/>
      <path d="M53 54 L44 48 L46 46 L55 50 Z" fill="${K.green}"/><path d="M71 47 Q77 52 71 57" stroke="${K.deep}" stroke-width="2.5" fill="none"/></g>
      <path d="M66 70 Q66 62 68 58" stroke="${K.skin}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    // 新年快乐: Happy New Year, a red packet with fireworks
    "新": `${[[26, 30, K.pink], [74, 28, K.blue]].map(([x, y, c]) => `<g transform="translate(${x} ${y})" stroke="${c}" stroke-width="3" stroke-linecap="round">
        <path d="M0 -6 V-13 M0 6 V13 M-6 0 H-13 M6 0 H13 M4.5 -4.5 L9 -9 M-4.5 -4.5 L-9 -9 M4.5 4.5 L9 9 M-4.5 4.5 L-9 9"/></g><circle cx="${x}" cy="${y}" r="2.5" fill="${K.yellow}"/>`).join("")}
      ${star5(50, 18, 4, K.yellow)}${star5(18, 54, 3, K.sun)}${star5(82, 52, 3, K.sun)}
      <rect x="32" y="36" width="36" height="50" rx="5" fill="${K.red}"/><path d="M32 41 Q32 36 37 36 H63 Q68 36 68 41 V48 Q50 60 32 48 Z" fill="${K.berry}"/>
      <circle cx="50" cy="56" r="7" fill="${K.yellow}"/><circle cx="50" cy="56" r="3" fill="${K.sun}"/>
      <rect x="38" y="72" width="24" height="3" rx="1.5" fill="${K.sun}"/>`,

    // 飞机: an aeroplane with a row of windows, flying up through the sky
    "飞": `${SKY}${cloud(32, 72, 0.55)}${cloud(70, 26, 0.4)}
      <g transform="translate(50 50) scale(0.86) rotate(-16) translate(-50 -50)">
        <path d="M54 46 L42 26 H50 L66 46 Z" fill="${K.navy}"/>
        <path d="M14 46 L10 28 H18 L30 46 Z" fill="${K.red}"/>
        <path d="M12 50 Q12 43 20 43 H74 Q90 43 90 50 Q90 57 74 57 H20 Q12 57 12 50 Z" fill="${K.white}"/>
        <path d="M14 53 H88 Q85 57 74 57 H20 Q15 57 14 53 Z" fill="${K.mist}"/>
        <path d="M78 44 Q87 45 89 49 H78 Z" fill="${K.navy}"/>
        <g fill="${K.blue}"><circle cx="28" cy="49" r="2.6"/><circle cx="36" cy="49" r="2.6"/><circle cx="44" cy="49" r="2.6"/><circle cx="52" cy="49" r="2.6"/><circle cx="60" cy="49" r="2.6"/><circle cx="68" cy="49" r="2.6"/></g>
        <path d="M50 54 L38 78 H47 L64 54 Z" fill="${K.blue}"/>
        <path d="M12 49 L4 48 L12 46 Z" fill="${K.red}"/>
      </g>`,
    // 你打鼓，我敲锣: a red drum with two drumsticks, and a little gong hanging beside it
    "打": `<path d="M62 30 H88" stroke="${K.brown}" stroke-width="4" stroke-linecap="round"/><path d="M69 30 V36 M81 30 V36" stroke="${K.slate}" stroke-width="2"/>
      <circle cx="75" cy="47" r="12" fill="${K.sun}"/><circle cx="75" cy="47" r="8.5" fill="${K.yellow}"/><circle cx="75" cy="47" r="3.5" fill="${K.sun}"/><circle cx="71" cy="43" r="2" fill="${K.cream}"/>
      <path d="M14 56 V78 Q38 92 62 78 V56 Z" fill="${K.red}"/>
      <path d="M17 60 L25 79 L33 60 L41 81 L49 60 L57 79 L60 64" stroke="${K.cream}" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
      <path d="M15 76 Q38 88 61 76" stroke="${K.yellow}" stroke-width="4" fill="none"/>
      <ellipse cx="38" cy="56" rx="24" ry="8" fill="${K.yellow}"/><ellipse cx="38" cy="55" rx="21" ry="6" fill="${K.cream}"/>
      <path d="M20 22 L33 50 M58 20 L44 50" stroke="${K.wood}" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="33" cy="50" r="4" fill="${K.brown}"/><circle cx="44" cy="50" r="4" fill="${K.brown}"/>
      <path d="M24 42 l-7 -2 M52 42 l7 -3 M38 40 v-7" stroke="${K.sun}" stroke-width="3" stroke-linecap="round"/>`,
    // 写名字: a child at a desk, writing with a pencil on a page (scribbles, no letters)
    "写": `${bust(48, 34, 1.05, { hairStyle: "bob", shirt: K.green })}
      <path d="M12 62 H88 Q86 80 74 87 H26 Q14 80 12 62 Z" fill="${K.wood}"/><path d="M12 62 H88 V66 H12 Z" fill="${K.brown}" opacity=".35"/>
      <g transform="rotate(-6 46 75)"><rect x="26" y="65" width="40" height="20" rx="2" fill="${K.white}"/>
        <path d="M30 72 q3 -5 6 0 t6 0 t6 0 t6 0 M30 79 q3 -5 6 0 t6 0" stroke="${K.blue}" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>
      <g transform="rotate(25 54 77)"><rect x="50.5" y="47" width="7" height="23" rx="1.5" fill="${K.yellow}"/><path d="M50.5 70 L54 77 L57.5 70 Z" fill="${K.cream}"/><path d="M53 74.6 L54 77 L55 74.6 Z" fill="${K.ink}"/><rect x="50.5" y="44" width="7" height="4" rx="1.5" fill="${K.pink}"/></g>
      <path d="M67 54 Q71 62 61 65" stroke="${K.skin}" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="60" cy="65" r="5.5" fill="${K.skin}"/>`,
    // 加油: keep going! a child cheering with pom-poms held up high
    "加": `${star5(18, 44, 5, K.yellow)}${star5(82, 46, 4.5, K.yellow)}${star5(76, 72, 3.5, K.sun)}
      <g transform="translate(50 86)">
        <path d="M-4 -16 L-8 0 M4 -16 L8 0" stroke="${K.slate}" stroke-width="6" stroke-linecap="round"/>
        <path d="M-9 -34 L-20 -54 M9 -34 L20 -54" stroke="${K.skin}" stroke-width="5" stroke-linecap="round"/>
        <path d="M-11 -20 L-15 -8 H15 L11 -20 Z" fill="${K.pink}"/>
        <rect x="-10" y="-38" width="20" height="22" rx="7" fill="${K.red}"/><path d="M-10 -30 H10" stroke="${K.yellow}" stroke-width="3"/>
        <path d="M-9 -46 Q-12 -34 -8 -32 M9 -46 Q12 -34 8 -32" stroke="${K.hair}" stroke-width="5" stroke-linecap="round" fill="none"/>
        <circle cx="0" cy="-47" r="10" fill="${K.skin}"/><path d="M-10 -48 Q-10 -59 0 -59 Q10 -59 10 -48 Q5 -53 -10 -48 Z" fill="${K.hair}"/>
        <circle cx="-3.5" cy="-47" r="1.4" fill="${K.ink}"/><circle cx="3.5" cy="-47" r="1.4" fill="${K.ink}"/><path d="M-3.5 -43 Q0 -36 3.5 -43 Z" fill="${K.ink}"/>
        ${[-21, 21].map((x) => `<g fill="${K.pink}"><circle cx="${x}" cy="-58" r="6"/><circle cx="${x - 5}" cy="-54" r="5"/><circle cx="${x + 5}" cy="-54" r="5"/><circle cx="${x - 4}" cy="-62" r="5"/><circle cx="${x + 4}" cy="-62" r="5"/></g><circle cx="${x - 2}" cy="-60" r="2.2" fill="${K.blush}"/>`).join("")}
      </g>`,
    // 吃饭: a child eating rice from a bowl with chopsticks
    "吃": `${bust(48, 38, 1.35, { hairStyle: "short", shirt: K.orange })}
      <ellipse cx="48" cy="47.5" rx="4" ry="3.5" fill="${K.ink}"/><ellipse cx="48" cy="49" rx="2.4" ry="1.6" fill="${K.red}"/>
      <path d="M78 66 L53 50 M80 61 L54 47" stroke="${K.wood}" stroke-width="3" stroke-linecap="round"/><ellipse cx="55" cy="49" rx="3.5" ry="2.6" fill="${K.white}" stroke="#e9eef3" stroke-width="1"/>
      <circle cx="77" cy="64" r="5.5" fill="${K.skin}"/>
      <path d="M26 66 Q34 56 48 56 Q62 56 70 66 Z" fill="${K.white}" stroke="#e9eef3" stroke-width="2"/>
      <path d="M22 66 H74 Q72 88 48 88 Q24 88 22 66 Z" fill="${K.red}"/><path d="M28 72 H68" stroke="${K.berry}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="24" cy="74" r="5.5" fill="${K.skin}"/>`,
    // 坐下: a child sitting down on a chair
    "坐": `<ellipse cx="50" cy="87" rx="30" ry="4" fill="${K.shadow}"/>
      <path d="M33 70 V86 M63 70 V86" stroke="${K.berry}" stroke-width="5" stroke-linecap="round"/>
      <rect x="28" y="26" width="9" height="48" rx="4" fill="${K.red}"/>
      <rect x="28" y="64" width="40" height="8" rx="3" fill="${K.red}"/>
      <g transform="translate(48 66)">
        <path d="M-6 -22 L-9 -8 M6 -22 L12 -8" stroke="${K.skin}" stroke-width="5" stroke-linecap="round"/>
        <rect x="-10" y="-26" width="20" height="26" rx="7" fill="${K.green}"/>
        <path d="M-2 -3 H16 L18 16 H23" stroke="${K.slate}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M8 -1 H20 L22 18 H27" stroke="${K.grey}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <circle cx="0" cy="-35" r="10" fill="${K.skin}"/><path d="M-10 -36 Q-10 -47 0 -47 Q10 -47 10 -36 Q5 -41 -10 -36 Z" fill="${K.hair}"/>
        ${face(0, -34, 0.9)}
      </g>`,
    // 走路: a child walking along a path in the park
    "走": `${SKY}<path d="M10 54 Q50 44 90 54 V66 Q90 90 50 90 Q10 90 10 66 Z" fill="${K.green}"/>
      <path d="M30 90 Q36 72 52 64 Q64 58 60 49 H66 Q72 60 62 68 Q52 76 58 90 Z" fill="${K.cream}"/>
      ${tree(80, 46, 0.32)}${tree(22, 50, 0.26, K.hill)}
      ${person(46, 84, 0.86, { pose: "walk", shirt: K.orange })}`,
    // 听故事: a grown-up reading a storybook while a child listens
    "听": `${bust(32, 38, 1.05, { hairStyle: "long", shirt: K.purple })}${bust(72, 54, 0.85, { hairStyle: "short", shirt: K.green })}
      <circle cx="59" cy="54" r="3.5" fill="${K.skin2}"/>
      <path d="M53 48 Q49 54 53 60 M48 44 Q42 54 48 64" stroke="${K.sun}" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${mini(ART["书"], 34, 72, 0.46)}<circle cx="18" cy="74" r="4.5" fill="${K.skin}"/><circle cx="50" cy="74" r="4.5" fill="${K.skin}"/>
      ${star5(58, 26, 4, K.yellow)}${star5(68, 18, 3, K.yellow)}`,
    // 爸爸和我玩荡秋千: a child on a swing, with Dad pushing
    "玩": `<path d="M18 80 L28 20 M82 80 L72 20" stroke="${K.brown}" stroke-width="5" stroke-linecap="round"/><path d="M25 20 H75" stroke="${K.wood}" stroke-width="6" stroke-linecap="round"/>
      <path d="M52 20 L66 60" stroke="${K.slate}" stroke-width="2.5"/>
      <g transform="translate(68 62) rotate(-18)">
        <path d="M-2 -6 L12 -6 L20 -12" stroke="${K.navy}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <rect x="-8" y="-27" width="15" height="21" rx="6" fill="${K.pink}"/>
        <path d="M-7 -36 Q-10 -26 -6 -24" stroke="${K.hair}" stroke-width="4" stroke-linecap="round" fill="none"/>
        <circle cx="0" cy="-34" r="8" fill="${K.skin}"/><path d="M-8 -35 Q-8 -43 0 -43 Q8 -43 8 -35 Q4 -39 -8 -35 Z" fill="${K.hair}"/>
        ${face(0, -33, 0.75)}
        <path d="M4 -22 L-3 -16" stroke="${K.skin}" stroke-width="4" stroke-linecap="round"/>
        <rect x="-10" y="-5" width="20" height="4" rx="2" fill="${K.red}"/>
      </g>
      <g transform="translate(36 88) scale(0.88)">
        <path d="M-4 -16 V0 M4 -16 V0" stroke="${K.slate}" stroke-width="6" stroke-linecap="round"/>
        <path d="M-9 -34 L16 -40 M9 -30 L18 -32" stroke="${K.skin}" stroke-width="5" stroke-linecap="round"/>
        <rect x="-10" y="-38" width="20" height="24" rx="7" fill="${K.navy}"/>
        <circle cx="0" cy="-47" r="10" fill="${K.skin}"/><path d="M-10 -48 Q-10 -59 0 -59 Q10 -59 10 -48 Q5 -53 -10 -48 Z" fill="${K.ink}"/>
        ${face(0, -46, 0.9)}
      </g>`,
    // 画画: a child painting a picture on an easel, with a brush and a paint palette
    "画": `<path d="M24 86 L32 24 M56 86 L48 24 M40 86 V44" stroke="${K.brown}" stroke-width="4" stroke-linecap="round"/>
      <rect x="16" y="20" width="46" height="40" rx="2" fill="${K.white}" stroke="${K.mist}" stroke-width="2.5"/>
      <rect x="19" y="23" width="40" height="34" fill="${K.sky}"/>${sunDisc(29, 32, 5)}
      <path d="M19 57 V48 Q30 38 40 46 Q50 38 59 46 V57 Z" fill="${K.green}"/><path d="M48 50 V44" stroke="${K.deep}" stroke-width="2"/><circle cx="48" cy="42" r="3" fill="${K.red}"/>
      <rect x="16" y="58" width="46" height="4" rx="2" fill="${K.wood}"/>
      <g transform="translate(76 86) scale(0.82)">
        <path d="M-4 -16 V0 M4 -16 V0" stroke="${K.slate}" stroke-width="6" stroke-linecap="round"/>
        <path d="M9 -32 L13 -18" stroke="${K.skin}" stroke-width="5" stroke-linecap="round"/>
        <rect x="-10" y="-38" width="20" height="24" rx="7" fill="${K.orange}"/>
        <path d="M-9 -46 Q-12 -34 -8 -32 M9 -46 Q12 -34 8 -32" stroke="${K.hair}" stroke-width="5" stroke-linecap="round" fill="none"/>
        <circle cx="0" cy="-47" r="10" fill="${K.skin}"/><path d="M-10 -48 Q-10 -59 0 -59 Q10 -59 10 -48 Q5 -53 -10 -48 Z" fill="${K.hair}"/>
        ${face(0, -46, 0.9)}
        <path d="M-8 -32 L-20 -40" stroke="${K.skin}" stroke-width="5" stroke-linecap="round"/>
        <path d="M-20 -40 L-30 -52" stroke="${K.wood}" stroke-width="3" stroke-linecap="round"/><path d="M-30 -52 L-33 -56" stroke="${K.red}" stroke-width="4.5" stroke-linecap="round"/>
        <ellipse cx="14" cy="-16" rx="11" ry="7" fill="${K.wood}"/>
        <circle cx="9" cy="-18" r="2.4" fill="${K.red}"/><circle cx="15" cy="-20" r="2.4" fill="${K.blue}"/><circle cx="20" cy="-16" r="2.4" fill="${K.yellow}"/><circle cx="13" cy="-13" r="2.4" fill="${K.green}"/>
      </g>`,
    // 看见: a child looking through binoculars
    "看": `${bust(50, 50, 1.4, { hairStyle: "pigtails", shirt: K.blue })}
      <path d="M34 82 Q28 72 32 60 M66 82 Q72 72 68 60" stroke="${K.skin}" stroke-width="8" fill="none" stroke-linecap="round"/>
      <rect x="44" y="46" width="12" height="7" rx="2" fill="${K.ink}"/>
      <circle cx="39" cy="50" r="10" fill="${K.ink}"/><circle cx="61" cy="50" r="10" fill="${K.ink}"/>
      <circle cx="39" cy="50" r="6.5" fill="${K.blue}"/><circle cx="61" cy="50" r="6.5" fill="${K.blue}"/>
      <circle cx="36.5" cy="47.5" r="2.2" fill="${K.white}"/><circle cx="58.5" cy="47.5" r="2.2" fill="${K.white}"/>
      <circle cx="31" cy="58" r="5" fill="${K.skin}"/><circle cx="69" cy="58" r="5" fill="${K.skin}"/>
      ${star5(20, 22, 4, K.yellow)}${star5(80, 22, 4, K.yellow)}`,
    // 洗澡: a child in a bubble bath
    "洗": `${bust(48, 44, 1.0, { hairStyle: "short", shirt: K.skin })}
      ${[[38, 28, 6], [48, 25, 7], [58, 28, 6], [43, 21, 4.5], [54, 20, 4.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${K.white}" stroke="${K.sky}" stroke-width="1.8"/>`).join("")}
      <path d="M68 50 L74 36" stroke="${K.skin}" stroke-width="6" stroke-linecap="round"/><rect x="68" y="26" width="12" height="9" rx="3" fill="${K.yellow}"/>
      <path d="M14 58 H86 Q84 80 68 82 H32 Q16 80 14 58 Z" fill="${K.blue}"/><rect x="11" y="55" width="78" height="7" rx="3.5" fill="${K.navy}"/>
      <path d="M30 82 L26 88 M70 82 L74 88" stroke="${K.slate}" stroke-width="5" stroke-linecap="round"/>
      ${[[20, 54, 6], [30, 52, 7], [41, 54, 6], [60, 53, 7], [71, 52, 6], [81, 54, 5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${K.white}" stroke="${K.sky}" stroke-width="1.8"/>`).join("")}
      ${bubble(22, 36, 4)}${bubble(84, 40, 3.5)}${bubble(16, 46, 2.5)}`,
    // 姐姐唱歌: a girl singing into a microphone, with music notes
    "唱": `${bust(42, 46, 1.35, { hairStyle: "pony", shirt: K.pink })}
      <ellipse cx="42" cy="55.5" rx="3.6" ry="3.6" fill="${K.ink}"/><ellipse cx="42" cy="57" rx="2.2" ry="1.4" fill="${K.red}"/>
      <path d="M55 70 L64 84" stroke="${K.ink}" stroke-width="5" stroke-linecap="round"/><circle cx="53" cy="65" r="6" fill="${K.slate}"/><circle cx="51" cy="63" r="2" fill="${K.mist}"/>
      <circle cx="60" cy="78" r="5" fill="${K.skin}"/>
      ${[[72, 40, K.purple], [80, 60, K.blue], [62, 28, K.orange]].map(([x, y, c]) => `<ellipse cx="${x}" cy="${y}" rx="4.6" ry="3.6" fill="${c}" transform="rotate(-20 ${x} ${y})"/><path d="M${x + 3.8} ${y - 1} V${y - 13} Q${x + 9} ${y - 10} ${x + 9} ${y - 5}" stroke="${c}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`).join("")}`,
    // 跑步: a girl jogging along a running track
    "跑": `<path d="M10 70 Q50 62 90 70 Q88 84 76 88 Q50 92 24 88 Q12 84 10 70 Z" fill="${K.rust}"/>
      <path d="M14 78 Q50 70 86 78" stroke="${K.white}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle cx="22" cy="68" r="4" fill="${K.mist}"/><circle cx="16" cy="64" r="3" fill="${K.mist}"/>
      <g transform="translate(52 74) rotate(8)">
        <path d="M-3 -16 L-12 -6 L-22 -8 M3 -16 L14 -12 L14 0" stroke="${K.navy}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M-9 -32 L-16 -24 L-22 -30 M9 -32 L14 -22 L22 -26" stroke="${K.skin}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <rect x="-10" y="-38" width="20" height="22" rx="7" fill="${K.purple}"/>
        <path d="M-6 -54 Q-18 -58 -26 -48" stroke="${K.hair}" stroke-width="6" stroke-linecap="round" fill="none"/>
        <circle cx="0" cy="-47" r="10" fill="${K.skin}"/><path d="M-10 -48 Q-10 -59 0 -59 Q10 -59 10 -48 Q5 -53 -10 -48 Z" fill="${K.hair}"/>
        <path d="M-9 -52 Q0 -56 9 -52" stroke="${K.pink}" stroke-width="3" fill="none"/>
        ${face(0, -46, 0.9)}
      </g>`,
    // 喝奶: a child sipping a glass of milk through a straw, holding the glass in front
    "喝": `${bust(46, 42, 1.35, { hairStyle: "bob", shirt: K.green })}
      <path d="M48 53 L60 57 L63 76" stroke="${K.pink}" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M53 61 H75 L72 88 H56 Z" fill="${K.white}"/>
      <path d="M53.6 67 H74.4 L72 88 H56 Z" fill="#fffdf6"/>
      <path d="M53.6 67 H74.4" stroke="${K.mist}" stroke-width="1.4"/>
      <path d="M53 61 H75 L72 88 H56 Z" fill="none" stroke="${K.blue}" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M58 71 L59 83" stroke="${K.sky}" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="53" cy="77" r="5.5" fill="${K.skin}"/><circle cx="75" cy="77" r="5.5" fill="${K.skin}"/>`,
    // 跳舞: a child dancing, arms up and one leg out, in a twirly skirt
    "跳": `<path d="M18 40 Q14 54 22 64 M82 40 Q86 54 78 64" stroke="${K.lilac}" stroke-width="4" fill="none" stroke-linecap="round"/>
      ${star5(24, 26, 4, K.yellow)}${star5(78, 24, 3.5, K.yellow)}
      <ellipse cx="50" cy="86" rx="16" ry="3" fill="${K.shadow}"/>
      <g transform="translate(50 86)">
        <path d="M2 -16 L1 0 M-3 -16 L-14 -14 L-24 -20" stroke="${K.skin}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M-9 -34 Q-24 -50 -6 -62 M9 -34 Q24 -50 6 -62" stroke="${K.skin}" stroke-width="5" stroke-linecap="round" fill="none"/>
        <rect x="-9" y="-38" width="18" height="22" rx="7" fill="${K.pink}"/>
        <path d="M-22 -16 Q0 -26 22 -16 Q12 -9 0 -11 Q-12 -9 -22 -16 Z" fill="${K.blush}"/><path d="M-16 -18 Q0 -25 16 -18 Q8 -14 0 -15 Q-8 -14 -16 -18 Z" fill="${K.pink}"/>
        <circle cx="0" cy="-47" r="10" fill="${K.skin}"/><path d="M-10 -48 Q-10 -59 0 -59 Q10 -59 10 -48 Q5 -53 -10 -48 Z" fill="${K.hair}"/>
        <circle cx="0" cy="-59" r="4.5" fill="${K.hair}"/>
        ${face(0, -46, 0.9)}
      </g>`,
    // 睡觉: a child fast asleep in bed at night, with the moon and sleepy curls
    "睡": `<circle cx="50" cy="50" r="40" fill="${K.lilac}"/>
      <path d="M70 14 A13 13 0 1 0 82 32 A10 10 0 1 1 70 14 Z" fill="${K.yellow}"/>${star5(26, 22, 3.5, K.white)}${star5(48, 16, 2.5, K.white)}
      <circle cx="44" cy="40" r="2" fill="${K.white}"/><circle cx="50" cy="33" r="3" fill="${K.white}"/><circle cx="58" cy="25" r="4.2" fill="${K.white}"/>
      <rect x="14" y="40" width="9" height="46" rx="4" fill="${K.brown}"/><rect x="80" y="56" width="8" height="28" rx="4" fill="${K.brown}"/>
      <rect x="18" y="64" width="66" height="14" rx="3" fill="${K.wood}"/>
      <ellipse cx="32" cy="58" rx="12" ry="7" fill="${K.white}"/>
      <circle cx="33" cy="51" r="9" fill="${K.skin}"/><path d="M24 51 Q24 41 33 41 Q42 41 42 49 Q36 45 24 51 Z" fill="${K.hair}"/>
      <path d="M28 52 Q30 54 32 52 M35 52 Q37 54 39 52" stroke="${K.ink}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <path d="M40 56 Q42 50 50 50 H82 Q86 50 86 56 V68 H40 Z" fill="${K.blue}"/><path d="M40 56 Q42 50 50 50 H58 V68 H40 Z" fill="${K.sky}"/>`,

    // 剪刀: a pair of child's scissors, open, with rounded tips and two coloured handles
    "刀": `${[[K.pink, true], [K.blue, false]].map(([c, flip]) => mini(`<path d="M41 66 L50 50" stroke="${c}" stroke-width="7" stroke-linecap="round"/>
      <circle cx="35" cy="73" r="9.5" fill="none" stroke="${c}" stroke-width="7"/>
      <path d="M50 50 L65 19" stroke="${K.grey}" stroke-width="10" stroke-linecap="round"/><path d="M51 45 L62 22" stroke="${K.white}" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>`, 50, 50, 1, flip)).join("")}
      <circle cx="50" cy="50" r="4" fill="${K.slate}"/><circle cx="49" cy="49" r="1.4" fill="${K.mist}"/>`,
    // 老人: an old man with white hair, leaning on a walking stick
    "老": `<rect x="18" y="84" width="60" height="5" rx="2.5" fill="${K.mist}"/>
      <g transform="rotate(8 42 86)">${person(42, 86, 1.22, { pose: "stand", shirt: K.purple, hair: K.mist, pants: K.slate })}
      <path d="M38.5 32.6 Q42 31 45.5 32.6" stroke="${K.white}" stroke-width="2" fill="none" stroke-linecap="round"/></g>
      <path d="M65 86 V56 Q65 48 58.5 48 Q52.5 48 52.5 54" stroke="${K.brown}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <circle cx="63.5" cy="65" r="3.6" fill="${K.skin}"/>`,
    // 老师: a teacher pointing at shapes on a green board
    "师": `<rect x="40" y="24" width="44" height="38" rx="3" fill="${K.deep}" stroke="${K.wood}" stroke-width="3"/>
      <rect x="44" y="61" width="36" height="4" rx="2" fill="${K.brown}"/>
      <g fill="none" stroke="${K.white}" stroke-width="2.5" stroke-linejoin="round"><circle cx="72" cy="36" r="6"/><path d="M53 30 L59 41 H47 Z"/><rect x="62" y="47" width="11" height="9" rx="1"/></g>
      ${person(25, 86, 1.0, { pose: "point", shirt: K.red, long: true })}
      <path d="M34 54 L42 46" stroke="${K.skin}" stroke-width="5" stroke-linecap="round"/>
      <path d="M42 46 L64 38" stroke="${K.brown}" stroke-width="2.5" stroke-linecap="round"/>`,
    // 起床: getting up, a child sitting up in bed and stretching, with the sun at the window
    "床": `<rect x="56" y="18" width="26" height="24" rx="3" fill="${K.sky}" stroke="${K.wood}" stroke-width="3"/>${sunDisc(69, 31, 6.5)}
      <path d="M69 18 V42 M56 30 H82" stroke="${K.wood}" stroke-width="2"/>
      <rect x="18" y="44" width="9" height="36" rx="4" fill="${K.brown}"/><rect x="76" y="58" width="7" height="22" rx="3" fill="${K.brown}"/>
      <ellipse cx="32" cy="58" rx="8" ry="5" fill="${K.white}" stroke="${K.mist}" stroke-width="1.5"/>
      ${person(37, 74, 0.72, { pose: "wide", shirt: K.yellow })}
      <rect x="24" y="64" width="54" height="8" rx="3" fill="${K.white}" stroke="${K.mist}" stroke-width="1.5"/>
      <path d="M30 62 Q54 58 78 62 V74 H30 Z" fill="${K.blue}"/><g fill="${K.sky}"><circle cx="44" cy="67" r="2"/><circle cx="56" cy="69" r="2"/><circle cx="68" cy="66" r="2"/></g>
      <rect x="22" y="72" width="58" height="6" rx="2" fill="${K.wood}"/>
      <path d="M24 26 l-3 -4 M30 22 l0 -5 M36 26 l3 -4" stroke="${K.sun}" stroke-width="2.5" stroke-linecap="round"/>`,
    // 纸飞机: a folded paper plane flying up through the sky
    "纸": `${SKY}<path d="M16 76 Q24 84 32 76 Q37 70 42 72" stroke="${K.white}" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="4 5"/>
      <path d="M84 22 L44 57 L40 74 Z" fill="${K.grey}"/>
      <path d="M84 22 L44 57 L60 66 Z" fill="#e9eef3" stroke="${K.mist}" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M84 22 L12 46 L44 57 Z" fill="${K.white}" stroke="${K.mist}" stroke-width="1.2" stroke-linejoin="round"/>`,
    // 杯子: a mug on a saucer
    "杯": `<ellipse cx="48" cy="80" rx="32" ry="6" fill="${K.mist}"/>
      <path d="M66 44 Q84 44 84 57 Q84 70 66 70" stroke="${K.orange}" stroke-width="8" fill="none"/>
      <rect x="26" y="30" width="42" height="50" rx="9" fill="${K.orange}"/><ellipse cx="47" cy="32" rx="19" ry="4.5" fill="${K.rust}"/>
      <g fill="${K.cream}"><circle cx="38" cy="48" r="3.5"/><circle cx="54" cy="46" r="3.5"/><circle cx="46" cy="60" r="3.5"/><circle cx="60" cy="62" r="3.5"/><circle cx="36" cy="70" r="3.5"/></g>
      <path d="M31 40 V68" stroke="${K.white}" stroke-width="3" stroke-linecap="round" opacity=".6"/>`,
    // 房子: a two-storey house with a chimney, in a garden
    "房": `<path d="M12 76 Q50 68 88 76 Q86 86 50 88 Q14 86 12 76 Z" fill="${K.green}"/>
      <rect x="60" y="20" width="8" height="16" rx="1.5" fill="${K.rust}"/><circle cx="65" cy="15" r="3.2" fill="${K.mist}"/><circle cx="69" cy="10" r="2.4" fill="${K.mist}"/>
      <rect x="32" y="38" width="38" height="42" rx="2" fill="${K.blush}"/>
      <path d="M26 40 L51 18 L76 40 Z" fill="${K.purple}" stroke="${K.purple}" stroke-width="4" stroke-linejoin="round"/>
      <g fill="${K.sky}" stroke="${K.white}" stroke-width="2"><rect x="37" y="45" width="11" height="11" rx="1.5"/><rect x="54" y="45" width="11" height="11" rx="1.5"/><rect x="37" y="63" width="11" height="10" rx="1.5"/></g>
      <rect x="54" y="62" width="11" height="18" rx="2" fill="${K.brown}"/><circle cx="62" cy="71" r="1.3" fill="${K.yellow}"/>
      ${tree(22, 62, 0.4)}
      <g fill="${K.red}"><circle cx="76" cy="78" r="2.5"/><circle cx="82" cy="76" r="2.5"/><circle cx="28" cy="80" r="2.5"/></g>`,
    // 新加坡: the flag of Singapore on a pole
    "坡": `<rect x="26" y="84" width="16" height="4" rx="2" fill="${K.slate}"/><path d="M34 86 V16" stroke="${K.slate}" stroke-width="3.5" stroke-linecap="round"/><circle cx="34" cy="15" r="3.2" fill="${K.yellow}"/>
      <rect x="35.5" y="20" width="48" height="32" fill="${K.white}" stroke="${K.mist}" stroke-width="1.5"/><rect x="35.5" y="20" width="48" height="16" fill="${K.red}"/>
      <circle cx="44" cy="28" r="5.6" fill="${K.white}"/><circle cx="46.3" cy="28" r="5.2" fill="${K.red}"/>
      ${[0, 1, 2, 3, 4].map((i) => { const a = (-90 + i * 72) * Math.PI / 180; return star5(51.5 + 3.6 * Math.cos(a), 28.4 + 3.6 * Math.sin(a), 1.5, K.white); }).join("")}`,
    // 闹钟: an alarm clock with two bells, ringing
    "钟": `<path d="M34 70 L28 80 M66 70 L72 80" stroke="${K.berry}" stroke-width="5" stroke-linecap="round"/>
      <path d="M17 36 A13 13 0 0 1 38 22 Z" fill="${K.yellow}"/><path d="M83 36 A13 13 0 0 0 62 22 Z" fill="${K.yellow}"/>
      <path d="M50 26 V18" stroke="${K.slate}" stroke-width="3"/><circle cx="50" cy="17" r="3" fill="${K.slate}"/>
      <circle cx="50" cy="52" r="26" fill="${K.red}"/><circle cx="50" cy="52" r="20" fill="${K.white}"/>
      <g fill="${K.ink}"><circle cx="50" cy="37" r="1.8"/><circle cx="65" cy="52" r="1.8"/><circle cx="50" cy="67" r="1.8"/><circle cx="35" cy="52" r="1.8"/></g>
      <path d="M50 52 V41 M50 52 L58 58" stroke="${K.ink}" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="52" r="2.2" fill="${K.red}"/>
      <path d="M12 26 l-4 -3 M16 18 l-2 -5 M88 26 l4 -3 M84 18 l2 -5" stroke="${K.sun}" stroke-width="2.5" stroke-linecap="round"/>`,
    // 铅笔: a big yellow pencil with a pink rubber
    "笔": `<g transform="rotate(-40 50 50)">
      <path d="M30 41 L12 50 L30 59 Z" fill="${K.cream}"/><path d="M12 50 L18.5 46.8 L18.5 53.2 Z" fill="${K.ink}"/>
      <rect x="30" y="41" width="42" height="18" fill="${K.yellow}"/><rect x="30" y="41" width="42" height="5" fill="#ffe08a"/><rect x="30" y="54" width="42" height="5" fill="${K.sun}"/>
      <rect x="72" y="40" width="8" height="20" rx="1" fill="${K.mist}"/><path d="M75 40 V60 M78 40 V60" stroke="${K.grey}" stroke-width="1.2"/>
      <path d="M80 40 H84 Q90 40 90 46 V54 Q90 60 84 60 H80 Z" fill="${K.pink}"/></g>`,
    // 桌子: a wooden table
    "桌": `<rect x="18" y="80" width="64" height="4" rx="2" fill="${K.mist}"/>
      <path d="M22 50 V82 M78 50 V82" stroke="${K.brown}" stroke-width="7" stroke-linecap="round"/>
      <path d="M32 50 V74 M68 50 V74" stroke="${K.soil}" stroke-width="5" stroke-linecap="round"/>
      <path d="M22 34 H78 L88 44 H12 Z" fill="${K.wood}" stroke="${K.wood}" stroke-width="2" stroke-linejoin="round"/>
      <rect x="12" y="44" width="76" height="8" rx="2" fill="${K.brown}"/><path d="M28 38 H50" stroke="${K.cream}" stroke-width="2" stroke-linecap="round" opacity=".7"/>`,
    // 椅子: an empty chair
    "椅": `<path d="M32 18 V60 M68 18 V60" stroke="${K.navy}" stroke-width="6" stroke-linecap="round"/>
      <rect x="31" y="18" width="38" height="22" rx="8" fill="${K.blue}"/><rect x="35" y="44" width="30" height="5" rx="2.5" fill="${K.blue}"/>
      <path d="M34 66 V86 M66 66 V86" stroke="${K.navy}" stroke-width="6" stroke-linecap="round"/><path d="M38 62 V78 M62 62 V78" stroke="${K.slate}" stroke-width="4" stroke-linecap="round"/>
      <path d="M34 56 H66 L74 64 H26 Z" fill="${K.sky}" stroke="${K.sky}" stroke-width="2" stroke-linejoin="round"/><rect x="26" y="64" width="48" height="6" rx="2" fill="${K.navy}"/>`,
    // 窗户: a window with pink curtains tied back and a flower pot on the sill
    "窗": `<rect x="31" y="24" width="38" height="46" fill="${K.sky}" stroke="${K.white}" stroke-width="4"/>
      <path d="M50 24 V70 M31 47 H69" stroke="${K.white}" stroke-width="3.5"/><path d="M36 40 L44 30 M55 64 L63 54" stroke="${K.white}" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>
      <rect x="27" y="70" width="46" height="6" rx="2" fill="${K.wood}"/>
      ${[false, true].map((flip) => mini(`<path d="M20 22 H40 Q38 40 34 50 Q40 64 36 78 H22 Q24 62 26 50 Q20 40 20 22 Z" fill="${K.pink}"/>
        <path d="M27 24 Q29 38 29 48 M33 24 Q34 36 32 46" stroke="${K.rose}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <rect x="24" y="48" width="12" height="4" rx="2" fill="${K.yellow}"/>`, 50, 50, 1, flip)).join("")}
      <path d="M18 21 H82" stroke="${K.brown}" stroke-width="4" stroke-linecap="round"/>
      <path d="M44 70 L46 62 H54 L56 70 Z" fill="${K.rust}"/><path d="M50 62 V56" stroke="${K.deep}" stroke-width="2"/>${mini(flowerHead(K.red), 50, 53, 0.13)}`,
    // 帽子: a straw sun hat with a pink ribbon
    "帽": `<ellipse cx="50" cy="62" rx="38" ry="13" fill="${K.cream}"/><ellipse cx="50" cy="60" rx="30" ry="9" fill="${K.yellow}" opacity=".45"/>
      <path d="M30 60 Q28 32 50 32 Q72 32 70 60 Q50 66 30 60 Z" fill="${K.cream}"/>
      <path d="M30.5 52 Q50 58 69.5 52 L70 60 Q50 66 30 60 Z" fill="${K.pink}"/>
      <path d="M64 56 Q74 48 76 56 Q74 62 64 58 Z M64 57 Q70 64 66 72 L62 70 Q64 64 62 58 Z" fill="${K.rose}"/><circle cx="64" cy="57" r="3" fill="${K.pink}"/>
      <path d="M38 40 Q42 36 48 35" stroke="${K.white}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>`,
    // 鞋子: one red sneaker
    "鞋": `<path d="M16 70 V44 Q16 36 24 36 H34 Q38 46 48 46 L66 54 Q84 58 86 70 Z" fill="${K.red}"/>
      <path d="M24 36 H34 Q38 46 48 46" stroke="${K.berry}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M70 55 Q84 58 86 70 H70 Q66 62 70 55 Z" fill="${K.blush}"/>
      <path d="M46 50 L52 46 M53 53 L59 49 M60 56 L66 52" stroke="${K.white}" stroke-width="3" stroke-linecap="round"/>
      <path d="M14 70 H86 Q88 80 80 80 H20 Q12 80 14 70 Z" fill="${K.white}" stroke="${K.mist}" stroke-width="2"/>
      <path d="M18 75 H82" stroke="${K.mist}" stroke-width="1.5" stroke-dasharray="3 3"/>`,
    // 学校: a big school building with a bell in its tower and a flag on a pole beside it
    "校": `<path d="M14 80 H86" stroke="${K.green}" stroke-width="5" stroke-linecap="round"/>
      <path d="M78 80 V24" stroke="${K.slate}" stroke-width="2.5"/><path d="M78 25 L64 29 L78 34 Z" fill="${K.green}"/>
      <rect x="18" y="46" width="52" height="34" fill="${K.wood}"/><rect x="15" y="42" width="58" height="6" rx="2" fill="${K.navy}"/>
      <rect x="35" y="28" width="18" height="18" fill="${K.wood}"/><path d="M32 30 L44 16 L56 30 Z" fill="${K.navy}" stroke="${K.navy}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M39 44 V36 Q44 30 49 36 V44 Z" fill="${K.soil}"/><path d="M40 43 Q40 35 44 35 Q48 35 48 43 Z" fill="${K.yellow}"/><circle cx="44" cy="44" r="1.6" fill="${K.sun}"/>
      <g fill="${K.sky}" stroke="${K.white}" stroke-width="1.5"><rect x="22" y="52" width="9" height="8" rx="1"/><rect x="57" y="52" width="9" height="8" rx="1"/><rect x="22" y="65" width="9" height="8" rx="1"/><rect x="57" y="65" width="9" height="8" rx="1"/></g>
      <path d="M37 80 V64 Q44 56 51 64 V80 Z" fill="${K.navy}"/><path d="M44 61 V80" stroke="${K.blue}" stroke-width="1.5"/>`,

    // 吃肉: a roast drumstick with its bone sticking out
    "肉": `<path d="M58 58 L74 74" stroke="${K.mist}" stroke-width="13" stroke-linecap="round"/>
      <circle cx="79" cy="71" r="8" fill="${K.mist}"/><circle cx="71" cy="79" r="8" fill="${K.mist}"/>
      <path d="M58 58 L74 74" stroke="${K.white}" stroke-width="9" stroke-linecap="round"/>
      <circle cx="79" cy="71" r="6" fill="${K.white}"/><circle cx="71" cy="79" r="6" fill="${K.white}"/>
      <path d="M64 62 Q52 72 36 68 Q14 62 14 40 Q16 16 40 14 Q62 14 68 36 Q72 50 64 62 Z" fill="${K.brown}"/>
      <path d="M64 62 Q52 72 36 68 Q50 64 58 54 Q66 44 66 32 Q72 48 64 62 Z" fill="${K.soil}"/>
      <ellipse cx="32" cy="30" rx="11" ry="6" transform="rotate(-40 32 30)" fill="${K.wood}"/>
      <circle cx="46" cy="44" r="2.2" fill="${K.wood}"/><circle cx="28" cy="50" r="1.8" fill="${K.wood}"/>`,
    // 喝汤: a bowl of soup with a spoon, steaming
    "汤": `<path d="M32 30 Q27 24 32 18 Q37 12 32 6" transform="translate(0 6)" stroke="${K.mist}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M46 30 Q41 24 46 18 Q51 12 46 6" transform="translate(0 4)" stroke="${K.mist}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <rect x="38" y="80" width="24" height="7" rx="3.5" fill="${K.rose}"/>
      <path d="M14 48 Q16 84 50 84 Q84 84 86 48 Z" fill="${K.pink}"/>
      <path d="M22 62 Q30 56 38 62 T54 62 T70 62 T80 62" stroke="${K.blush}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse cx="50" cy="48" rx="36" ry="10" fill="${K.rose}"/><ellipse cx="50" cy="48" rx="32" ry="7.5" fill="${K.orange}"/>
      <circle cx="34" cy="47" r="3" fill="${K.green}"/><circle cx="44" cy="51" r="2.6" fill="${K.rust}"/><rect x="38" y="44" width="5" height="5" rx="1" fill="${K.cream}"/>
      <circle cx="68" cy="50" r="2.6" fill="${K.green}"/><circle cx="74" cy="46" r="2.4" fill="${K.rust}"/>
      <path d="M58 47 L78 22" stroke="${K.mist}" stroke-width="9" stroke-linecap="round"/><path d="M58 47 L78 22" stroke="${K.white}" stroke-width="5.5" stroke-linecap="round"/>
      <ellipse cx="56" cy="48" rx="8" ry="3" fill="${K.white}"/>`,
    // 黑色: a painter's palette where the black paint is the biggest blob, with a brush dipped in it
    "色": `<path d="M50 16 Q86 16 88 48 Q90 72 72 78 Q62 80 60 70 Q58 62 48 64 Q38 66 34 76 Q30 84 22 78 Q10 66 12 48 Q14 16 50 16 Z" fill="${K.wood}"/>
      <ellipse cx="38" cy="26" rx="10" ry="4" fill="#d9a882"/>
      <path d="M50 34 Q64 30 70 40 Q76 52 66 58 Q56 64 46 58 Q36 52 40 42 Q42 36 50 34 Z" fill="${K.ink}"/>
      <circle cx="26" cy="40" r="6.5" fill="${K.red}"/><circle cx="32" cy="56" r="6" fill="${K.blue}"/>
      <circle cx="44" cy="24" r="6" fill="${K.yellow}"/><circle cx="66" cy="24" r="6" fill="${K.green}"/><circle cx="80" cy="44" r="5.5" fill="${K.white}"/>
      <path d="M58 50 L40 88" stroke="${K.red}" stroke-width="6" stroke-linecap="round"/>
      <path d="M58 50 L54 58" stroke="${K.mist}" stroke-width="7"/><path d="M60 45 Q62 40 59 36 Q55 40 56 47 Z" fill="${K.ink}"/>`,
    // 香喷喷的白米饭: a steaming dome of white rice on a plate
    "饭": `<path d="M36 28 Q31 22 36 16 Q41 10 36 4" transform="translate(0 8)" stroke="${K.mist}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M50 26 Q45 20 50 14 Q55 8 50 2" transform="translate(0 8)" stroke="${K.mist}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M64 28 Q59 22 64 16 Q69 10 64 4" transform="translate(0 8)" stroke="${K.mist}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="50" cy="72" rx="39" ry="14" fill="${K.sun}"/><ellipse cx="50" cy="69" rx="39" ry="14" fill="${K.yellow}"/><ellipse cx="50" cy="69" rx="29" ry="9" fill="${K.cream}"/>
      <path d="M20 68 Q20 34 50 34 Q80 34 80 68 Q50 76 20 68 Z" fill="${K.white}" stroke="#e3e9f1" stroke-width="2"/>
      <g fill="#e3e9f1">${[[34, 50, 30], [44, 42, -20], [56, 44, 40], [66, 54, -30], [48, 56, 10], [30, 62, -10], [60, 64, 20], [40, 64, 50], [70, 64, 0]]
        .map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="1.6" transform="rotate(${r} ${x} ${y})"/>`).join("")}</g>
      <ellipse cx="38" cy="44" rx="6" ry="3.5" transform="rotate(-30 38 44)" fill="${K.white}"/>`,
    // 树苗: a young sapling planted in the ground, tied to a stake
    "苗": `<path d="M18 78 Q50 68 82 78 Q80 88 50 90 Q20 88 18 78 Z" fill="${K.green}"/>
      <rect x="60" y="36" width="5" height="44" rx="2.5" fill="${K.wood}"/>
      <path d="M46 80 Q49 60 47 26" stroke="${K.brown}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M48 58 Q38 52 32 44 M48 46 Q56 40 60 32" stroke="${K.brown}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M48 62 L62 60" stroke="${K.yellow}" stroke-width="3" stroke-linecap="round"/>
      ${[[47, 20, 0, K.green], [38, 26, -50, K.leaf], [56, 25, 50, K.leaf], [28, 40, -30, K.green], [34, 50, 20, K.leaf], [62, 28, 20, K.green], [66, 38, 60, K.leaf]]
        .map(([x, y, r, c]) => `<ellipse cx="${x}" cy="${y}" rx="4.5" ry="8" transform="rotate(${r} ${x} ${y})" fill="${c}"/>`).join("")}`,
    // 喝茶: a teapot pouring side by side with a cup of tea
    "茶": `<path d="M78 46 Q94 52 80 70" stroke="${K.rust}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M40 58 Q32 54 26 38 L20 38 Q24 58 38 68 Z" fill="${K.rust}"/>
      <ellipse cx="58" cy="58" rx="24" ry="20" fill="${K.rust}"/>
      <ellipse cx="58" cy="39" rx="14" ry="4.5" fill="${K.soil}"/><circle cx="58" cy="33" r="4.5" fill="${K.orange}"/>
      <ellipse cx="48" cy="52" rx="5" ry="8" fill="${K.white}" opacity=".35"/>
      <path d="M14 66 H38 L35 84 H17 Z" fill="${K.white}" stroke="${K.mist}" stroke-width="2.5" stroke-linejoin="round"/>
      <ellipse cx="26" cy="67" rx="10.5" ry="2.6" fill="${K.sun}"/>`,
    // 面条: a bowl of noodles, chopsticks lifting some up
    "面": `<path d="M82 20 L48 36 M84 27 L50 41" stroke="${K.wood}" stroke-width="4" stroke-linecap="round"/>
      <rect x="38" y="80" width="24" height="7" rx="3.5" fill="${K.berry}"/>
      <path d="M14 50 Q16 84 50 84 Q84 84 86 50 Z" fill="${K.red}"/>
      <path d="M26 64 H74" stroke="${K.white}" stroke-width="3" stroke-dasharray="6 5" stroke-linecap="round" opacity=".6"/>
      <ellipse cx="50" cy="50" rx="36" ry="10" fill="${K.berry}"/><ellipse cx="50" cy="50" rx="32" ry="7.5" fill="${K.cream}"/>
      <path d="M24 50 Q30 46 36 50 T48 50 M56 52 Q62 47 68 51 T78 50 M32 54 Q40 51 46 55" stroke="${K.yellow}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M46 37 Q40 43 45 48 M50 39 Q46 45 51 50 M54 40 Q58 45 54 50 M42 38 Q36 42 40 48" stroke="${K.yellow}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      <path d="M42 36 Q48 30 56 38" stroke="${K.yellow}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      <circle cx="66" cy="49" r="2.5" fill="${K.green}"/><circle cx="30" cy="51" r="2.2" fill="${K.green}"/>`,
    // 饼干: a chocolate-chip cookie with a bite out of it, and a square biscuit behind
    "饼": `<g transform="rotate(14 64 38)"><rect x="44" y="18" width="40" height="40" rx="6" fill="#efc078"/>
        <rect x="48" y="22" width="32" height="32" rx="4" fill="#f6d293"/>
        <g fill="${K.wood}">${[[56, 30], [72, 30], [64, 38], [56, 46], [72, 46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2"/>`).join("")}</g></g>
      <circle cx="42" cy="60" r="26" fill="#d99a55"/><circle cx="42" cy="58" r="23" fill="#e6ad68"/>
      <g fill="${K.hair}"><circle cx="34" cy="50" r="3.5"/><circle cx="50" cy="48" r="3"/><circle cx="44" cy="62" r="3.5"/><circle cx="56" cy="64" r="3"/><circle cx="30" cy="66" r="3"/><circle cx="42" cy="74" r="2.6"/></g>
      <circle cx="18" cy="76" r="9" fill="${K.white}"/><circle cx="24" cy="86" r="8" fill="${K.white}"/>`,
    // 洋葱: one whole onion with golden-brown skin and a little root tuft
    "洋": `<path d="M44 86 L40 92 M50 86 V93 M56 86 L60 92" stroke="${K.brown}" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M50 14 Q53 24 60 30 Q84 40 84 62 Q82 84 50 86 Q18 84 16 62 Q16 40 40 30 Q47 24 50 14 Z" fill="#e3a352"/>
      <path d="M50 14 Q53 24 60 30 Q84 40 84 62 Q82 84 50 86 Q70 70 66 46 Q62 32 50 14 Z" fill="#cf8c3e"/>
      <path d="M48 24 Q28 44 32 82 M52 24 Q64 50 60 85" stroke="${K.rust}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".55"/>
      <ellipse cx="30" cy="54" rx="5" ry="10" fill="#f4c98a"/>
      <path d="M50 14 Q51 8 54 6" stroke="${K.brown}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    // 黄色的柠檬: one yellow lemon with a leaf
    "柠": `<path d="M71 47 Q54 42 56 24 Q72 30 71 47 Z" fill="${K.green}"/><path d="M71 47 Q62 36 57 26" stroke="${K.deep}" stroke-width="1.8" fill="none"/>
      <g transform="rotate(-25 46 60)"><circle cx="77" cy="60" r="5" fill="${K.yellow}"/><circle cx="15" cy="60" r="4.5" fill="${K.yellow}"/>
        <ellipse cx="46" cy="60" rx="30" ry="22" fill="${K.yellow}"/><path d="M18 64 Q46 90 74 64 Q46 80 18 64 Z" fill="${K.sun}" opacity=".5"/>
        <ellipse cx="36" cy="51" rx="10" ry="4.5" fill="${K.cream}"/></g>`,
    // 橙色的南瓜: an orange pumpkin with a stem and a leaf
    "南": `<path d="M46 32 Q30 14 18 24 Q28 38 46 34 Z" fill="${K.green}"/>
      <path d="M54 34 Q58 24 66 22 Q72 22 70 28" stroke="${K.green}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M50 38 Q48 26 54 18" stroke="${K.deep}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <ellipse cx="29" cy="62" rx="15" ry="22" fill="${K.rust}"/><ellipse cx="71" cy="62" rx="15" ry="22" fill="${K.rust}"/>
      <ellipse cx="39" cy="62" rx="16" ry="24" fill="${K.orange}"/><ellipse cx="61" cy="62" rx="16" ry="24" fill="${K.orange}"/>
      <ellipse cx="50" cy="62" rx="14" ry="25" fill="#f9b468"/>
      <path d="M39 42 Q34 62 39 82 M61 42 Q66 62 61 82" stroke="${K.rust}" stroke-width="2" fill="none" opacity=".6"/>
      <ellipse cx="46" cy="52" rx="4" ry="9" fill="${K.cream}" opacity=".7"/>`,
    // 种子发芽了: a big seed split open, with roots growing down and a two-leaf sprout growing up
    "种": `<path d="M46 70 Q40 80 32 86 M50 72 Q52 82 48 90 M56 70 Q62 78 68 84" stroke="#e7cfa6" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      <g transform="rotate(-12 50 60)"><ellipse cx="50" cy="60" rx="28" ry="17" fill="${K.wood}"/>
        <path d="M24 58 Q50 50 76 58" stroke="${K.brown}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <ellipse cx="38" cy="52" rx="8" ry="3" fill="#e2b994"/><ellipse cx="50" cy="68" rx="6" ry="2.5" fill="${K.brown}" opacity=".5"/></g>
      <path d="M52 52 Q48 38 52 26" stroke="${K.green}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M52 28 Q38 30 30 18 Q46 14 52 26 Z" fill="${K.green}"/><path d="M52 28 Q60 18 72 18 Q68 32 52 30 Z" fill="${K.leaf}"/>`,
    // 桃子: a pink-and-orange peach with a crease and two leaves
    "桃": `<path d="M50 30 Q64 20 78 32 Q90 48 82 66 Q72 86 50 86 Q28 86 18 66 Q10 48 22 32 Q36 20 50 30 Z" fill="#ffc29a"/>
      <path d="M50 30 Q64 20 78 32 Q90 48 82 66 Q72 86 50 86 Q62 66 56 42 Q54 34 50 30 Z" fill="${K.pink}" opacity=".75"/>
      <path d="M50 30 Q60 56 50 86" stroke="${K.rose}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".7"/>
      <ellipse cx="32" cy="50" rx="6" ry="10" fill="${K.white}" opacity=".5"/>
      <path d="M48 30 Q30 14 20 24 Q32 36 48 31 Z" fill="${K.green}"/><path d="M51 30 Q56 14 70 13 Q66 28 51 31 Z" fill="${K.hill}"/>`,
    // 马铃薯: one potato, with its eyes, and a piece cut off to show the pale inside
    "铃": `<path d="M18 50 Q16 30 38 28 Q52 26 62 32 Q78 36 78 52 Q80 70 60 74 Q44 78 30 72 Q16 66 18 50 Z" fill="#d6a463"/>
      <ellipse cx="34" cy="40" rx="8" ry="4" transform="rotate(-20 34 40)" fill="#e9c07f"/>
      <g stroke="${K.brown}" stroke-width="2.2" fill="none" stroke-linecap="round"><path d="M44 42 q3 2 6 0 M30 56 q3 2 6 0 M62 50 q3 2 6 0 M50 64 q3 2 6 0"/></g>
      <ellipse cx="70" cy="74" rx="16" ry="12" fill="#d6a463"/><ellipse cx="70" cy="73" rx="13.5" ry="9.5" fill="#fbe7a8"/>`,
    // 青菜: a bunch of bok choy, pale stalks and dark green leaves
    "菜": `${[[-30, K.hill], [30, K.hill], [-15, K.green], [15, K.green], [0, K.leaf]].map(([r, c]) => `<g transform="rotate(${r} 50 86)">
        <ellipse cx="50" cy="38" rx="12" ry="20" fill="${c}"/><path d="M44 86 Q42 70 46 50 H54 Q58 70 56 86 Z" fill="#eaf6d6"/>
        <path d="M50 52 V26" stroke="#eaf6d6" stroke-width="2.5" stroke-linecap="round"/></g>`).join("")}
      <rect x="40" y="74" width="20" height="6" rx="3" fill="${K.blue}"/>`,
    // 雪梨: a pale yellow pear with a stem and a leaf
    "梨": `<path d="M50 24 Q60 24 62 38 Q64 50 74 58 Q84 68 78 80 Q70 90 50 90 Q30 90 22 80 Q16 68 26 58 Q36 50 38 38 Q40 24 50 24 Z" fill="#ecd46a"/>
      <path d="M50 24 Q60 24 62 38 Q64 50 74 58 Q84 68 78 80 Q70 90 50 90 Q70 76 64 60 Q54 48 56 34 Q54 26 50 24 Z" fill="#dcbc4e"/>
      <g fill="${K.sun}" opacity=".6"><circle cx="44" cy="70" r="1.3"/><circle cx="56" cy="76" r="1.3"/><circle cx="36" cy="78" r="1.3"/><circle cx="50" cy="54" r="1.2"/><circle cx="62" cy="66" r="1.3"/></g>
      <ellipse cx="34" cy="68" rx="5" ry="9" fill="${K.white}" opacity=".5"/>
      <path d="M50 26 Q50 18 54 12" stroke="${K.brown}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M53 18 Q62 8 72 15 Q63 23 53 18 Z" fill="${K.green}"/>`,
    // 鸡蛋: an egg in an egg cup, with a brown egg beside it
    "蛋": `<ellipse cx="38" cy="45" rx="14" ry="18" fill="${K.white}" stroke="${K.mist}" stroke-width="2.5"/>
      <ellipse cx="33" cy="38" rx="4" ry="6" fill="#eef3f8"/>
      <rect x="33" y="74" width="10" height="10" fill="${K.berry}"/><ellipse cx="38" cy="86" rx="14" ry="4" fill="${K.red}"/>
      <path d="M22 56 H54 Q54 78 38 78 Q22 78 22 56 Z" fill="${K.red}"/><circle cx="31" cy="64" r="3" fill="${K.white}" opacity=".5"/>
      <ellipse cx="68" cy="70" rx="15" ry="12" transform="rotate(-15 68 70)" fill="#e2b48a"/>
      <ellipse cx="63" cy="65" rx="5" ry="3" transform="rotate(-15 63 65)" fill="#f2d2b0"/>`,
    // 好甜: an ice cream cone with a cherry on top
    "甜": `<path d="M32 52 L50 90 L68 52 Z" fill="#e9b26a"/>
      <path d="M38 56 L56 76 M46 54 L60 66 M36 64 L50 78 M62 56 L44 76 M54 54 L40 66 M64 64 L50 78" stroke="${K.wood}" stroke-width="2" stroke-linecap="round"/>
      <path d="M28 50 Q28 32 50 32 Q72 32 72 50 Q68 58 62 54 Q58 62 52 56 Q46 62 42 55 Q36 60 32 54 Q28 56 28 50 Z" fill="${K.pink}"/>
      <circle cx="50" cy="28" r="14" fill="${K.cream}"/>
      <g stroke-width="2.5" stroke-linecap="round"><path d="M42 24 l3 -2" stroke="${K.blue}"/><path d="M54 22 l3 2" stroke="${K.green}"/><path d="M48 32 l3 -1" stroke="${K.red}"/><path d="M36 44 l3 -2" stroke="${K.yellow}"/><path d="M60 42 l3 2" stroke="${K.white}"/></g>
      <path d="M52 15 Q54 8 60 6" stroke="${K.deep}" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="51" cy="16" r="5" fill="${K.red}"/>
      <circle cx="40" cy="40" r="3.5" fill="${K.blush}"/>`,
    // 绿色的蔬菜: green vegetables, a head of broccoli, a green pepper and a cucumber
    "绿": `<g transform="rotate(-30 50 50)"><rect x="16" y="24" width="68" height="16" rx="8" fill="${K.deep}"/>
        <g fill="${K.leaf}"><circle cx="28" cy="30" r="1.6"/><circle cx="40" cy="34" r="1.6"/><circle cx="52" cy="29" r="1.6"/><circle cx="64" cy="34" r="1.6"/><circle cx="74" cy="30" r="1.6"/></g></g>
      <path d="M66 46 Q68 40 74 40" stroke="${K.deep}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M66 48 Q54 46 54 60 Q54 76 62 82 Q66 84 68 80 Q70 84 74 82 Q84 74 82 60 Q82 46 70 48 Q68 46 66 48 Z" fill="${K.green}"/>
      <ellipse cx="62" cy="60" rx="3" ry="8" fill="${K.leaf}"/>
      <path d="M30 86 Q32 70 30 60 H42 Q40 70 44 86 Z" fill="#b7e08a"/>
      <g fill="${K.hill}"><circle cx="24" cy="56" r="10"/><circle cx="48" cy="56" r="10"/></g>
      <g fill="${K.green}"><circle cx="30" cy="46" r="11"/><circle cx="44" cy="46" r="11"/><circle cx="37" cy="58" r="10"/></g>
      <g fill="${K.leaf}"><circle cx="28" cy="43" r="3"/><circle cx="42" cy="42" r="3"/><circle cx="36" cy="54" r="2.5"/></g>`,
    // 黑色的芝麻: a wooden bowl heaped with black sesame seeds, a few spilled in front
    "黑": `<ellipse cx="50" cy="54" rx="31" ry="7" fill="${K.brown}"/>
      <path d="M22 54 Q30 30 50 30 Q70 30 78 54 Z" fill="${K.ink}"/>
      <g fill="#6a5a8a">${[[40, 38, 30], [50, 34, -20], [60, 40, 60], [34, 46, -40], [46, 44, 10], [56, 48, -30], [66, 48, 40], [28, 52, 20], [40, 52, 70], [72, 52, -10], [50, 52, 30]]
        .map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.5" transform="rotate(${r} ${x} ${y})"/>`).join("")}</g>
      <path d="M18 54 Q20 80 50 80 Q80 80 82 54 Q66 60 50 60 Q34 60 18 54 Z" fill="${K.wood}"/>
      <path d="M26 64 Q50 72 74 64" stroke="${K.brown}" stroke-width="2" fill="none" opacity=".6"/>
      <g fill="${K.ink}">${[[24, 86, 20], [36, 90, -30], [62, 89, 50], [74, 85, -10], [48, 88, 80]]
        .map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="2.8" ry="1.6" transform="rotate(${r} ${x} ${y})"/>`).join("")}</g>`,
    // 紫色的洋葱: a purple onion and a slice cut from it, showing its rings
    "葱": `${((o) => `<g transform="translate(64 40) scale(.62) translate(-50 -50)"><path d="${o}" fill="${K.purple}"/>
        <path d="M50 14 Q53 24 60 30 Q84 40 84 62 Q82 84 50 86 Q70 70 66 46 Q62 32 50 14 Z" fill="#7a5fc4"/>
        <ellipse cx="30" cy="54" rx="5" ry="10" fill="${K.lilac}"/></g>`)("M50 14 Q53 24 60 30 Q84 40 84 62 Q82 84 50 86 Q18 84 16 62 Q16 40 40 30 Q47 24 50 14 Z")}
      <circle cx="40" cy="62" r="26" fill="${K.purple}"/><circle cx="40" cy="62" r="22.5" fill="#f6f0ff"/>
      <g fill="none" stroke="${K.purple}" stroke-width="2.6"><circle cx="40" cy="62" r="18"/><circle cx="40" cy="62" r="13"/><circle cx="40" cy="62" r="8"/></g>
      <circle cx="40" cy="62" r="3" fill="${K.lilac}"/>`,
    // 糖果: three wrapped sweets with twisted ends
    "糖": `${[[30, 32, 0.55, -20, K.blue, K.navy], [70, 30, 0.55, 20, K.yellow, K.sun], [50, 62, 0.95, -8, K.pink, K.rose]].map(([x, y, s, r, c, d]) =>
        `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M-16 -2 L-36 -16 Q-40 0 -36 16 L-16 2 Z M16 -2 L36 -16 Q40 0 36 16 L16 2 Z" fill="${d}"/>
        <circle cx="0" cy="0" r="18" fill="${c}"/><path d="M-10 -14 L-2 16 M4 -17 L12 13" stroke="${K.white}" stroke-width="4" stroke-linecap="round" opacity=".6"/>
        <ellipse cx="-7" cy="-8" rx="5" ry="3" fill="${K.white}" opacity=".6"/></g>`).join("")}`,
    // 褐色的马铃薯: brown potatoes in a sack
    "薯": `<path d="M24 86 Q16 62 28 42 H72 Q84 62 76 86 Z" fill="#dcc08f"/>
      <path d="M30 52 Q50 56 70 52 M27 66 Q50 70 73 66 M28 78 Q50 82 72 78" stroke="#c9a571" stroke-width="2" fill="none"/>
      ${[[38, 38, 12, 9, -15], [60, 36, 13, 9, 20], [49, 30, 11, 8, 0]].map(([x, y, rx, ry, r]) => `<g transform="rotate(${r} ${x} ${y})">
        <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${K.brown}"/><ellipse cx="${x - 4}" cy="${y - 3}" rx="4" ry="2" fill="${K.wood}"/>
        <circle cx="${x + 4}" cy="${y + 2}" r="1.4" fill="${K.soil}"/><circle cx="${x - 2}" cy="${y + 4}" r="1.2" fill="${K.soil}"/></g>`).join("")}
      <path d="M26 42 Q50 50 74 42 L72 48 Q50 54 28 48 Z" fill="#c9a571"/>
      <g transform="rotate(-10 74 78)"><ellipse cx="74" cy="78" rx="11" ry="8" fill="${K.brown}"/><ellipse cx="71" cy="75" rx="4" ry="2" fill="${K.wood}"/><circle cx="77" cy="80" r="1.4" fill="${K.soil}"/></g>`,
    // 八个黄色的柠檬: eight lemons in two rows of four
    "檬": `${[[25, 30], [50, 30], [75, 30], [37.5, 50], [62.5, 50], [25, 70], [50, 70], [75, 70]].map(([x, y]) => `<g transform="rotate(-20 ${x} ${y})">
        <circle cx="${x + 10.5}" cy="${y}" r="2.6" fill="${K.yellow}"/><circle cx="${x - 10.5}" cy="${y}" r="2.3" fill="${K.yellow}"/>
        <ellipse cx="${x}" cy="${y}" rx="10.5" ry="8" fill="${K.yellow}"/><ellipse cx="${x - 3}" cy="${y - 3}" rx="3.6" ry="1.9" fill="${K.cream}"/></g>`).join("")}`,
    // 花瓣: loose flower petals drifting down
    "瓣": `<path d="M18 30 Q40 22 56 34 M44 74 Q62 66 82 72" stroke="${K.sky}" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${[[30, 40, -30, 1.3, K.pink], [62, 24, 40, 1.1, K.blush], [74, 50, 15, 1.3, "#ff8fc0"], [40, 72, 70, 1.25, K.blush], [20, 62, -60, 1, "#ff8fc0"], [64, 78, -20, 1.05, K.pink], [50, 50, 120, 1, K.rose]].map(([x, y, r, s, c]) =>
        `<path transform="translate(${x} ${y}) rotate(${r}) scale(${s})" d="M0 13 Q-10 2 -7 -7 Q0 -13 7 -7 Q10 2 0 13 Z" fill="${c}"/><path transform="translate(${x} ${y}) rotate(${r}) scale(${s})" d="M0 9 V-4" stroke="${K.white}" stroke-width="1.5" stroke-linecap="round" opacity=".6"/>`).join("")}`,
  });

  window.SCENE = (key) => {
    const s = SCENES[key] || SCENES.home;
    return { water: s.water, sand: s.sand, plants: `<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${s.plants}</svg>` };
  };

  window.ICON = (name) => ICONS[name] || "";
  window.STAR_SVG = STAR;
  window.TROPHY_SVG = TROPHY;
  window.CREATURE_SVG = (name) => CREATURES[name]
    ? `<svg viewBox="0 0 100 100" aria-hidden="true">${CREATURES[name]}</svg>` : "";

  window.PICTURE_SVG = (char) => {
    const art = ART[char];
    if (!art) return "";
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="52" r="46" fill="${K.shadow}"/><circle cx="50" cy="50" r="46" fill="${K.white}"/>${art}</svg>`;
  };
  window.PICTURE_COUNT = Object.keys(ART).length;
})();
