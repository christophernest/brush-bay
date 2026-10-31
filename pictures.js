/* Stroke Sea pictures, style A "stickers": flat shapes on a white die-cut circle, no outlines.
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
    // World 1: First lines
    "人": person(50, 84, 1.05, { pose: "walk" }),
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

    // World 3: Boxes
    "口": `<path d="M18 46 Q50 30 82 46 Q70 80 50 80 Q30 80 18 46 Z" fill="${K.red}"/>
           <path d="M24 48 Q50 40 76 48 L74 54 Q50 48 26 54 Z" fill="${K.white}"/>
           <path d="M34 68 Q50 60 66 68 Q58 76 50 76 Q42 76 34 68 Z" fill="${K.blush}"/>`,
    "中": `<circle cx="50" cy="50" r="34" fill="${K.red}"/><circle cx="50" cy="50" r="24" fill="${K.white}"/><circle cx="50" cy="50" r="14" fill="${K.red}"/>
           <circle cx="50" cy="50" r="5" fill="${K.white}"/>
           <path d="M50 50 L80 20" stroke="${K.brown}" stroke-width="4" stroke-linecap="round"/><path d="M74 16 L86 14 L84 26 Z" fill="${K.yellow}"/>`,
    "日": `<path d="M50 10v10M50 80v10M10 50h10M80 50h10M22 22l7 7M71 71l7 7M22 78l7-7M71 29l7-7" stroke="${K.sun}" stroke-width="6" stroke-linecap="round"/>
           <circle cx="50" cy="50" r="22" fill="${K.yellow}"/><circle cx="43" cy="43" r="6" fill="${K.cream}"/>`,
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

    // World 4: Nature
    "土": `<path d="M14 78 Q20 46 50 44 Q80 46 86 78 Z" fill="${K.soil}"/><path d="M22 70 Q34 58 48 60" stroke="${K.brown}" stroke-width="4" fill="none" stroke-linecap="round"/>
           <circle cx="62" cy="64" r="3" fill="${K.brown}"/><circle cx="36" cy="72" r="2.5" fill="${K.brown}"/>
           <path d="M50 46 V30" stroke="${K.deep}" stroke-width="4" stroke-linecap="round"/>
           <path d="M50 34 Q38 30 36 20 Q48 20 50 32 Z" fill="${K.green}"/><path d="M50 30 Q60 22 68 24 Q64 34 50 34 Z" fill="${K.leaf}"/>`,
    "山": `<path d="M12 74 L36 34 L50 54 L62 26 L88 74 Z" fill="${K.hill}"/>
           <path d="M62 26 L67 36 L63.5 34 L60.5 37 L58 35 Z" fill="${K.white}"/><path d="M36 34 L39.5 40 L36.5 38 L33.5 41 L31.5 41.5 Z" fill="${K.white}"/>
           <rect x="12" y="72" width="76" height="5" rx="2.5" fill="${K.deep}"/>`,
    "川": `<circle cx="50" cy="50" r="40" fill="${K.leaf}"/>
           <path d="M36 12 Q24 40 38 60 Q48 76 40 90 H66 Q74 74 62 58 Q50 40 62 12 Z" fill="${K.blue}"/>
           <path d="M44 24 Q40 36 46 46 M54 62 Q60 72 56 82" stroke="${K.white}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    "水": `<path d="M50 16 C50 16 26 44 26 60 A24 24 0 0 0 74 60 C74 44 50 16 50 16 Z" fill="${K.blue}"/>
           <path d="M39 58 Q39 69 48 72" stroke="${K.white}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    "火": `<path d="M50 12 C58 30 76 38 74 60 C72 78 60 86 50 86 C40 86 26 78 26 60 C26 46 36 40 38 28 C44 36 46 40 46 46 C50 36 52 26 50 12 Z" fill="${K.rust}"/>
           <path d="M50 44 C56 54 64 60 62 70 C60 80 54 84 50 84 C44 84 38 80 38 70 C38 62 46 58 50 44 Z" fill="${K.yellow}"/>`,
    "木": tree(50, 50, 1),
    "月": `<path d="M58 18 A32 32 0 1 0 80 70 A25 25 0 1 1 58 18 Z" fill="#ffd34d"/>
           <circle cx="72" cy="28" r="3.5" fill="${K.yellow}"/><circle cx="80" cy="44" r="2.5" fill="${K.yellow}"/>`,
    "石": `<ellipse cx="38" cy="66" rx="22" ry="14" fill="${K.slate}"/><ellipse cx="64" cy="70" rx="18" ry="11" fill="${K.grey}"/>
           <ellipse cx="50" cy="44" rx="18" ry="13" fill="${K.grey}"/><ellipse cx="44" cy="40" rx="6" ry="3" fill="${K.mist}"/>`,

    // World 5: My body
    "手": `<path d="M30 86 V54 Q30 46 36 46 V26 Q36 20 41 20 Q46 20 46 26 V44 V20 Q46 14 51 14 Q56 14 56 20 V44 V24 Q56 18 61 18 Q66 18 66 24 V48 V34 Q66 28 71 28 Q76 28 76 34 V62 Q76 86 54 86 Z" fill="${K.skin}"/>
           <path d="M30 60 Q20 50 18 40 Q16 34 22 34 Q28 36 32 48" fill="${K.skin}"/>`,
    "牙": `<circle cx="50" cy="50" r="40" fill="${K.sky}"/>
           <path d="M30 30 Q30 18 42 20 Q50 24 58 20 Q70 18 70 30 Q70 46 64 56 L60 80 Q57 86 54 78 L50 62 L46 78 Q43 86 40 80 L36 56 Q30 46 30 30 Z" fill="${K.white}"/>
           <path d="M74 22 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill="${K.yellow}"/>`,
    "心": heart(50, 54, 2.6, K.red) + `<ellipse cx="34" cy="38" rx="6" ry="4" fill="#ff9a9a" transform="rotate(-30 34 38)"/>`,
    "毛": `<path d="M74 18 Q30 22 24 70 Q40 74 52 64 Q74 44 74 18 Z" fill="${K.lilac}"/><path d="M74 18 Q48 40 26 82" stroke="${K.purple}" stroke-width="4" fill="none" stroke-linecap="round"/>
           <path d="M60 30 l6 6 M52 40 l7 6 M44 50 l7 6" stroke="${K.white}" stroke-width="2.5" stroke-linecap="round"/>`,
    "头": bust(50, 44, 1.6, { hairStyle: "short", shirt: K.blue }),
    "耳": `<path d="M40 16 Q72 14 72 44 Q72 60 60 66 Q56 70 56 78 Q56 88 44 86 Q32 84 32 70" fill="none" stroke="${K.skin}" stroke-width="14" stroke-linecap="round"/>
           <path d="M44 34 Q58 32 58 46 Q58 54 50 56" fill="none" stroke="${K.skin2}" stroke-width="6" stroke-linecap="round"/>`,
    "足": `<path d="M34 42 Q30 22 46 20 Q64 18 66 40 Q68 60 62 76 Q58 88 46 86 Q34 84 36 70 Q40 56 34 42 Z" fill="${K.skin}"/>
           <circle cx="72" cy="30" r="5" fill="${K.skin}"/><circle cx="72" cy="42" r="4.5" fill="${K.skin}"/><circle cx="71" cy="53" r="4" fill="${K.skin}"/><circle cx="68" cy="62" r="3.5" fill="${K.skin}"/><circle cx="70" cy="18" r="6" fill="${K.skin}"/>`,

    // World 6: Opposites
    "上": `<rect x="18" y="62" width="64" height="7" rx="3.5" fill="${K.slate}"/><circle cx="50" cy="38" r="15" fill="${K.red}"/><circle cx="45" cy="33" r="4" fill="#ff9a9a"/>
           ${arrow("M78 52 V22 M70 30 L78 22 L86 30", K.green)}`,
    "下": `<rect x="18" y="34" width="64" height="7" rx="3.5" fill="${K.slate}"/><circle cx="50" cy="62" r="15" fill="${K.red}"/><circle cx="45" cy="57" r="4" fill="#ff9a9a"/>
           ${arrow("M78 48 V78 M70 70 L78 78 L86 70", K.orange)}`,
    "小": `<ellipse cx="50" cy="60" rx="20" ry="17" fill="${K.yellow}"/><circle cx="50" cy="40" r="13" fill="${K.yellow}"/>
           <path d="M60 41 L70 44 L60 47 Z" fill="${K.rust}"/><circle cx="54" cy="38" r="2.5" fill="${K.ink}"/>
           <path d="M34 60 Q28 52 36 50" fill="${K.sun}"/><path d="M44 77 v6 M56 77 v6" stroke="${K.rust}" stroke-width="3" stroke-linecap="round"/>`,
    // few / many: fish in a pond, so they don't look like the numbers 二 and 八
    "少": `${SKY}${fish(36, 56, 0.34, 0)}${fish(64, 44, 0.34, 2)}`,
    "多": `${SKY}${LAYOUT[10].map(([x, y], i) => fish(x, y, 0.22, i)).join("")}${fish(50, 86, 0.18, 4)}${fish(50, 14, 0.18, 3)}`,
    "左": arrow("M78 50 H24 M40 34 L24 50 L40 66", K.green),
    "右": arrow("M22 50 H76 M60 34 L76 50 L60 66", K.blue),

    // World 7: Around me
    "门": `<rect x="28" y="16" width="44" height="70" rx="4" fill="${K.wood}"/><rect x="33" y="21" width="34" height="65" rx="3" fill="${K.brown}"/>
           <rect x="38" y="28" width="24" height="20" rx="3" fill="${K.wood}"/><rect x="38" y="54" width="24" height="24" rx="3" fill="${K.wood}"/><circle cx="60" cy="52" r="3" fill="${K.yellow}"/>`,
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

    // World 8: Moving
    "入": `${box}${arrow("M50 14 V46 M40 36 L50 46 L60 36", K.green)}`,
    "开": `<rect x="26" y="16" width="48" height="70" rx="4" fill="${K.yellow}"/><path d="M30 20 L54 26 V90 L30 84 Z" fill="${K.brown}"/>
           <circle cx="49" cy="58" r="3" fill="${K.yellow}"/>`,
    "去": `${stingray(58, 44, 0.5, 45)}<path d="M20 62 L32 56 M18 74 L34 66 M28 82 L40 74" stroke="${K.navy}" stroke-width="4" stroke-linecap="round" opacity=".6"/>`,
    "出": `${box}${arrow("M50 52 V16 M40 26 L50 16 L60 26", K.orange)}`,
    "立": `<rect x="20" y="82" width="60" height="5" rx="2.5" fill="${K.slate}"/>${person(50, 82, 1.1, { pose: "stand", shirt: K.green })}`,
    "关": `<rect x="34" y="20" width="32" height="60" rx="8" fill="${K.mist}"/><rect x="40" y="48" width="20" height="26" rx="5" fill="${K.slate}"/>
           <circle cx="50" cy="32" r="5" fill="${K.grey}"/>`,
    "来": `${stingray(50, 48, 0.85, 0)}<path d="M22 22 L30 30 M78 22 L70 30 M50 12 V20" stroke="${K.navy}" stroke-width="4" stroke-linecap="round" opacity=".6"/>`,

    // World 9: Sky and weather
    "云": `${SKY}${cloud(50, 52, 1.35)}`,
    "风": `<path d="M16 38 H58 Q72 38 72 28 Q72 18 62 20 M16 54 H70 Q84 54 84 64 Q84 74 74 72 M22 70 H50" stroke="${K.blue}" stroke-width="6" fill="none" stroke-linecap="round"/>
           <path d="M30 22 Q38 12 46 20 Q38 30 30 22 Z" fill="${K.green}"/>`,
    "气": `<ellipse cx="50" cy="40" rx="22" ry="26" fill="${K.red}"/><path d="M46 66 L54 66 L50 60 Z" fill="${K.berry}"/>
           <path d="M50 66 Q44 76 52 82 Q58 88 50 94" stroke="${K.slate}" stroke-width="2.5" fill="none"/><ellipse cx="42" cy="30" rx="5" ry="8" fill="#ff9a9a"/>`,
    "电": `<path d="M58 12 L28 54 H48 L40 88 L74 42 H54 Z" fill="${K.yellow}"/><path d="M58 12 L48 40 H54 L74 42 L54 42 Z" fill="${K.sun}" opacity=".5"/>`,
    "光": `<path d="M50 14 Q54 42 82 50 Q54 58 50 86 Q46 58 18 50 Q46 42 50 14 Z" fill="${K.yellow}"/>
           <path d="M76 18 Q78 26 86 28 Q78 30 76 38 Q74 30 66 28 Q74 26 76 18 Z" fill="${K.sun}"/><path d="M26 66 Q27 72 32 73 Q27 74 26 80 Q25 74 20 73 Q25 72 26 66 Z" fill="${K.sun}"/>`,
    "雨": `${cloud(50, 36, 1.3, K.mist)}<path d="M32 62 l-4 10 M50 62 l-4 10 M68 62 l-4 10 M41 76 l-4 10 M59 76 l-4 10" stroke="${K.blue}" stroke-width="5" stroke-linecap="round"/>`,
    "雪": `<g stroke="${K.navy}" stroke-width="5" stroke-linecap="round"><path d="M50 16 V84 M21 33 L79 67 M21 67 L79 33"/>
           <path d="M42 22 L50 30 L58 22 M42 78 L50 70 L58 78 M22 44 L32 41 L28 31 M78 56 L68 59 L72 69 M22 56 L32 59 L28 69 M78 44 L68 41 L72 31" fill="none"/></g>`,

    // World 10: Animals
    "马": `<path d="M30 84 V60 Q28 40 40 30 L36 16 L48 24 Q66 22 74 40 L80 56 Q82 64 74 64 Q68 64 64 56 L58 50 Q56 66 62 84 Z" fill="${K.brown}"/>
           <path d="M40 30 Q30 40 28 56 L24 50 Q24 36 36 26 Z" fill="${K.hair}"/><circle cx="58" cy="36" r="3" fill="${K.ink}"/><circle cx="74" cy="56" r="2" fill="${K.hair}"/>`,
    "牛": `<path d="M24 30 Q14 26 16 18 Q24 22 30 26 Z M76 30 Q86 26 84 18 Q76 22 70 26 Z" fill="${K.cream}"/>
           <ellipse cx="50" cy="46" rx="26" ry="24" fill="${K.white}" stroke="${K.mist}" stroke-width="2"/>
           <path d="M30 34 Q36 26 44 32 Q40 44 30 42 Z" fill="${K.ink}"/><ellipse cx="50" cy="68" rx="20" ry="13" fill="${K.blush}"/>
           <circle cx="44" cy="68" r="2.5" fill="${K.rose}"/><circle cx="56" cy="68" r="2.5" fill="${K.rose}"/><circle cx="40" cy="48" r="3" fill="${K.ink}"/><circle cx="60" cy="48" r="3" fill="${K.ink}"/>`,
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

    // World 11: Garden and food
    "瓜": `<path d="M14 40 H86 Q86 80 50 80 Q14 80 14 40 Z" fill="${K.green}"/><path d="M20 40 H80 Q80 74 50 74 Q20 74 20 40 Z" fill="${K.red}"/>
           <g fill="${K.ink}"><ellipse cx="38" cy="52" rx="2" ry="3"/><ellipse cx="50" cy="58" rx="2" ry="3"/><ellipse cx="62" cy="52" rx="2" ry="3"/><ellipse cx="44" cy="64" rx="2" ry="3"/><ellipse cx="56" cy="64" rx="2" ry="3"/></g>`,
    "禾": `<path d="M50 86 V30 Q50 18 62 16" stroke="${K.deep}" stroke-width="4" fill="none" stroke-linecap="round"/>
           <path d="M50 60 Q36 54 30 44 Q42 46 50 56 M50 66 Q64 60 70 50 Q58 52 50 62" fill="${K.green}" stroke="${K.green}" stroke-width="3"/>
           <g fill="${K.yellow}"><ellipse cx="64" cy="20" rx="4" ry="6"/><ellipse cx="70" cy="28" rx="4" ry="6"/><ellipse cx="72" cy="38" rx="4" ry="6"/><ellipse cx="58" cy="26" rx="3.5" ry="5"/></g>`,
    "米": `<path d="M16 50 H84 Q82 82 50 82 Q18 82 16 50 Z" fill="${K.blue}"/><path d="M22 50 Q30 34 50 34 Q70 34 78 50 Z" fill="${K.white}" stroke="#e9eef3" stroke-width="2"/>
           <path d="M66 14 L44 44 M76 18 L52 46" stroke="${K.wood}" stroke-width="4" stroke-linecap="round"/><rect x="40" y="62" width="20" height="6" rx="3" fill="${K.navy}"/>`,
    "竹": `<g fill="${K.green}"><rect x="30" y="16" width="12" height="70" rx="5"/><rect x="56" y="22" width="12" height="64" rx="5"/></g>
           <path d="M30 40 H42 M30 64 H42 M56 46 H68 M56 68 H68" stroke="${K.deep}" stroke-width="3"/>
           <path d="M42 40 Q54 30 60 18 Q48 22 42 36 Z M68 46 Q80 42 86 32 Q74 32 68 42 Z M30 62 Q18 58 14 48 Q26 50 30 58 Z" fill="${K.leaf}"/>`,
    "花": `<path d="M50 58 V88" stroke="${K.deep}" stroke-width="4" stroke-linecap="round"/><path d="M50 76 Q36 64 30 72 Q40 82 50 78" fill="${K.green}"/>
           <g fill="${K.pink}"><circle cx="50" cy="26" r="11"/><circle cx="66" cy="38" r="11"/><circle cx="60" cy="56" r="11"/><circle cx="40" cy="56" r="11"/><circle cx="34" cy="38" r="11"/></g>
           <circle cx="50" cy="42" r="9" fill="${K.yellow}"/>`,
    "豆": `<path d="M18 62 Q16 40 40 36 L70 30 Q86 28 84 42 Q82 56 60 60 L34 68 Q20 72 18 62 Z" fill="${K.green}"/>
           <g fill="${K.leaf}"><circle cx="34" cy="54" r="8"/><circle cx="50" cy="49" r="8"/><circle cx="66" cy="44" r="8"/></g>
           <path d="M84 36 Q90 28 86 20" stroke="${K.deep}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    "果": `<path d="M50 32 Q30 22 22 40 Q16 62 32 80 Q42 88 50 82 Q58 88 68 80 Q84 62 78 40 Q70 22 50 32 Z" fill="${K.red}"/>
           <path d="M50 32 Q50 22 54 14" stroke="${K.brown}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M54 20 Q64 10 74 16 Q64 26 54 20 Z" fill="${K.green}"/>
           <ellipse cx="34" cy="46" rx="5" ry="8" fill="#ff9a9a" transform="rotate(20 34 46)"/>`,

    // World 12: Family
    "女": bust(50, 44, 1.6, { hairStyle: "long", shirt: K.purple }),
    "子": bust(50, 46, 1.6, { hairStyle: "baby", shirt: K.yellow }),
    "妈": `${bust(38, 40, 1.15, { hairStyle: "long", shirt: K.pink })}${bust(66, 58, 0.85, { hairStyle: "pigtails", shirt: K.yellow })}`,
    "我": `${bust(50, 42, 1.5, { hairStyle: "pigtails", shirt: K.pink })}<path d="M70 86 Q66 72 54 74" stroke="${K.skin}" stroke-width="8" fill="none" stroke-linecap="round"/>`,
    "弟": bust(50, 52, 1.25, { hairStyle: "short", shirt: K.green }),
    "爸": bust(50, 42, 1.6, { hairStyle: "short", shirt: K.navy, hair: K.ink }),
    "姐": bust(50, 42, 1.6, { hairStyle: "pony", shirt: K.purple }),
    "妹": bust(50, 52, 1.25, { hairStyle: "pigtails", shirt: K.orange }),

    // World 13: Put together
    "从": `${person(36, 84, 0.85, { pose: "walk", shirt: K.blue })}${person(66, 84, 0.85, { pose: "walk", shirt: K.pink })}`,
    "好": `${bust(36, 44, 1.1, { hairStyle: "long", shirt: K.purple })}${bust(66, 56, 0.85, { hairStyle: "baby", shirt: K.yellow })}${heart(54, 22, 0.5, K.pink)}`,
    "休": `${tree(64, 40, 0.75)}${person(36, 84, 0.85, { pose: "sit", shirt: K.orange })}<path d="M14 84 H86" stroke="${K.green}" stroke-width="5" stroke-linecap="round"/>`,
    "众": `${person(50, 52, 0.62, { shirt: K.blue })}${person(32, 86, 0.62, { shirt: K.pink })}${person(68, 86, 0.62, { shirt: K.green })}`,
    "男": `${field(50, 32, 0.6)}${person(50, 88, 0.72, { pose: "wide", shirt: K.navy })}`,
    "明": `<path d="M30 28 v5 M30 67 v5 M8 50 h5 M47 50 h5 M15 35 l3 3 M15 65 l3 -3 M45 35 l-3 3 M45 65 l-3 -3" stroke="${K.sun}" stroke-width="4" stroke-linecap="round"/>
           <circle cx="30" cy="50" r="13" fill="${K.yellow}"/>
           <g transform="translate(36 19) scale(.6)"><path d="M58 18 A32 32 0 1 0 80 70 A25 25 0 1 1 58 18 Z" fill="#ffd34d"/></g>`,
    "林": `${tree(32, 52, 0.62)}${tree(68, 52, 0.62, K.hill)}`,
    "森": `${pine(50, 36, 0.85)}${pine(30, 66, 0.85)}${pine(70, 66, 0.85)}`,

    // World 14: Her world
    "文": `<rect x="24" y="18" width="52" height="66" rx="5" fill="${K.cream}"/><rect x="18" y="14" width="64" height="8" rx="4" fill="${K.wood}"/><rect x="18" y="80" width="64" height="8" rx="4" fill="${K.wood}"/>
           <path d="M32 34 H68 M32 44 H68 M32 54 H60 M32 64 H66" stroke="${K.brown}" stroke-width="3" stroke-linecap="round" opacity=".55"/>`,
    "字": `<rect x="18" y="20" width="50" height="62" rx="5" fill="${K.white}" stroke="${K.mist}" stroke-width="2"/>
           <path d="M28 36 H58 M43 36 V50 M28 50 H58 M36 62 Q44 58 52 66" stroke="${K.ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
           <g transform="rotate(35 70 54)"><rect x="64" y="20" width="12" height="46" rx="2" fill="${K.yellow}"/><path d="M64 66 L70 78 L76 66 Z" fill="${K.cream}"/><path d="M68.5 75 L70 78 L71.5 75 Z" fill="${K.ink}"/><rect x="64" y="16" width="12" height="6" rx="2" fill="${K.pink}"/></g>`,
    "学": `<rect x="20" y="40" width="60" height="44" rx="3" fill="${K.cream}"/><path d="M14 42 L50 22 L86 42 Z" fill="${K.red}"/>
           <rect x="44" y="62" width="12" height="22" rx="2" fill="${K.brown}"/><rect x="26" y="50" width="12" height="10" rx="2" fill="${K.blue}"/><rect x="62" y="50" width="12" height="10" rx="2" fill="${K.blue}"/>
           <circle cx="50" cy="36" r="5" fill="${K.white}"/><path d="M50 22 V8" stroke="${K.slate}" stroke-width="2.5"/><path d="M50 8 H62 L58 12 L62 16 H50 Z" fill="${K.yellow}"/>`,
    "海": `<circle cx="50" cy="50" r="40" fill="${K.sky}"/><path d="M10 56 Q20 46 30 56 T50 56 T70 56 T90 56 V90 H10 Z" fill="${K.blue}"/>
           <path d="M10 70 Q20 60 30 70 T50 70 T70 70 T90 70 V90 H10 Z" fill="${K.navy}"/>${stingray(50, 30, 0.42, 0)}`,
    "爱": `${heart(50, 56, 2.5, K.pink)}${heart(24, 26, 0.6, K.red)}${heart(78, 22, 0.5, K.rose)}<ellipse cx="34" cy="42" rx="6" ry="4" fill="${K.blush}" transform="rotate(-30 34 42)"/>`,
    "家": house(50, 60, 1.3),
    "球": `<circle cx="50" cy="50" r="30" fill="#d7e84a"/><path d="M28 30 Q46 50 28 70 M72 30 Q54 50 72 70" stroke="${K.white}" stroke-width="4" fill="none" stroke-linecap="round"/>
           <circle cx="40" cy="38" r="5" fill="#eaf59a"/>`,
  };

  // ---------- Sea creatures: one joins her ocean for each world she finishes ----------
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
    dolphin: `<path d="M14 58 Q30 26 64 30 Q80 32 86 44 Q76 42 70 46 Q74 60 62 70 Q54 64 52 58 Q36 60 26 66 Q30 58 14 58 Z" fill="${K.navy}"/>
           <path d="M50 30 L46 18 L58 28 Z M60 62 L70 78 L58 70 Z" fill="${K.navy}"/><path d="M30 56 Q48 50 66 50" stroke="${K.sky}" stroke-width="4" fill="none" stroke-linecap="round"/>
           <circle cx="72" cy="40" r="2.5" fill="${K.ink}"/>`,
    seahorse: `<path d="M52 18 Q70 18 68 34 Q66 44 58 48 Q70 58 62 72 Q56 82 46 80 Q42 88 50 88" stroke="${K.orange}" stroke-width="12" fill="none" stroke-linecap="round"/>
           <path d="M54 22 L72 28 L56 32 Z" fill="${K.orange}"/><path d="M60 48 Q72 50 72 40" stroke="${K.rust}" stroke-width="4" fill="none"/><circle cx="58" cy="26" r="2.5" fill="${K.ink}"/>`,
    shell: `<path d="M50 18 L18 70 Q50 86 82 70 Z" fill="${K.blush}"/><path d="M50 18 L32 74 M50 18 L50 78 M50 18 L68 74" stroke="${K.pink}" stroke-width="4" stroke-linecap="round"/>
           <rect x="40" y="70" width="20" height="10" rx="4" fill="${K.pink}"/>`,
    shrimp: `<path d="M74 30 Q86 50 74 66 Q62 80 44 76 Q30 72 28 60" stroke="${K.rust}" stroke-width="16" fill="none" stroke-linecap="round"/>
           <path d="M28 60 L18 54 L22 66 Z" fill="${K.rust}"/><path d="M72 28 Q56 16 40 22 M74 30 Q60 26 48 32" stroke="${K.orange}" stroke-width="2.5" fill="none"/>
           <path d="M64 62 l4 8 M54 66 l2 9 M44 66 l0 9" stroke="${K.orange}" stroke-width="3" stroke-linecap="round"/><circle cx="74" cy="34" r="2.5" fill="${K.ink}"/>`,
    jelly: `<path d="M22 48 Q22 20 50 20 Q78 20 78 48 Q70 44 64 48 Q57 44 50 48 Q43 44 36 48 Q29 44 22 48 Z" fill="${K.lilac}"/>
           <path d="M32 50 Q28 64 34 74 M44 50 Q40 66 46 82 M56 50 Q60 66 54 82 M68 50 Q72 64 66 74" stroke="${K.purple}" stroke-width="4" fill="none" stroke-linecap="round"/>
           <ellipse cx="40" cy="32" rx="6" ry="4" fill="${K.white}" opacity=".7"/>`,
    seal: `<path d="M20 70 Q20 44 44 40 Q50 24 64 26 Q78 28 76 44 Q74 56 66 64 L80 74 Q66 80 56 72 Q38 80 20 70 Z" fill="${K.grey}"/>
           <path d="M40 66 Q34 76 26 78" stroke="${K.slate}" stroke-width="6" stroke-linecap="round" fill="none"/>
           <circle cx="62" cy="36" r="3" fill="${K.ink}"/><circle cx="72" cy="38" r="3" fill="${K.ink}"/><ellipse cx="68" cy="45" rx="3" ry="2" fill="${K.ink}"/>`,
    whale: `<path d="M14 54 Q14 32 42 32 Q66 32 74 50 Q80 46 82 38 Q90 44 86 56 Q80 62 74 60 Q66 74 42 74 Q14 74 14 54 Z" fill="${K.blue}"/>
           <path d="M18 60 Q42 70 70 60 Q66 72 42 72 Q22 72 18 60 Z" fill="${K.sky}"/><circle cx="28" cy="48" r="3" fill="${K.ink}"/>
           <path d="M38 30 Q36 20 30 16 M38 30 Q40 20 46 16" stroke="${K.blue}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
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

  // ---------- Buttons and small marks (simple line icons) ----------
  const line = (d, extra = "") => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${d}${extra}</svg>`;
  const ICONS = {
    home: line(`<path d="M3 11 L12 4 L21 11"/><path d="M5.5 9.5 V20 H18.5 V9.5"/><path d="M10 20 V14 H14 V20"/>`),
    speaker: line(`<path d="M4 9.5 H8 L13 5 V19 L8 14.5 H4 Z" fill="currentColor"/><path d="M16.5 9 Q18.5 12 16.5 15 M19 6.5 Q23 12 19 17.5"/>`),
    eye: line(`<path d="M2 12 Q12 3 22 12 Q12 21 2 12 Z"/><circle cx="12" cy="12" r="3.2" fill="currentColor"/>`),
    pencil: line(`<path d="M4 20 L5 15 L16 4 L20 8 L9 19 Z"/><path d="M13.5 6.5 L17.5 10.5"/>`),
    next: line(`<path d="M4 12 H19 M13 6 L19 12 L13 18"/>`),
    book: line(`<path d="M12 6 Q8 3.5 3 4.5 V19 Q8 18 12 20 Q16 18 21 19 V4.5 Q16 3.5 12 6 Z"/><path d="M12 6 V20"/>`),
    gear: line(`<circle cx="12" cy="12" r="3"/><path d="M12 2.5 V5 M12 19 V21.5 M2.5 12 H5 M19 12 H21.5 M5.3 5.3 L7 7 M17 17 L18.7 18.7 M5.3 18.7 L7 17 M17 7 L18.7 5.3"/>`),
    close: line(`<path d="M6 6 L18 18 M18 6 L6 18"/>`),
    lock: line(`<rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor"/><path d="M8 10.5 V8 Q8 4 12 4 Q16 4 16 8 V10.5"/>`),
  };
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
  window.SCENE = (key) => {
    const s = SCENES[key] || SCENES.home;
    return { water: s.water, sand: s.sand, plants: `<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${s.plants}</svg>` };
  };

  window.ICON = (name) => ICONS[name] || "";
  window.STAR_SVG = STAR;
  window.CREATURE_SVG = (name) => CREATURES[name]
    ? `<svg viewBox="0 0 100 100" aria-hidden="true">${CREATURES[name]}</svg>` : "";

  window.PICTURE_SVG = (char) => {
    const art = ART[char];
    if (!art) return "";
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="52" r="46" fill="${K.shadow}"/><circle cx="50" cy="50" r="46" fill="${K.white}"/>${art}</svg>`;
  };
  window.PICTURE_COUNT = Object.keys(ART).length;
})();
