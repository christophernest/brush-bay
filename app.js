/* Brush Bay: Chinese character writing practice for a young child.
   Each turn uses one box: the strokes play in order over a grey outline, then she writes over that outline.
   A character is mastered after four good turns; hints come later as she climbs. */
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const WORD = Object.fromEntries(WORDS.map((w) => [w.char, w]));

  // ---------- Saved progress (only on this device) ----------
  const STORE_KEY = "stroke-sea-v1";
  // practice: characters finished in practice mode, with her latest free-written version (see Practice mode below)
  // opened: ids of the categories that have opened, so they stay open when new words raise the stars needed
  const blank = () => ({ chars: {}, practice: {}, opened: [], settings: { pinyin: false, strict: false, unlock: false, music: true } });
  let progress = blank();
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    if (saved && saved.chars) progress = { ...blank(), ...saved, settings: { ...blank().settings, ...saved.settings } };
    // Progress saved by an older version may lack a field (best stars came later): fill in zeros, never NaN.
    if (!progress.practice || typeof progress.practice !== "object") progress.practice = {};
    if (!Array.isArray(progress.opened)) progress.opened = [];
    for (const [c, s] of Object.entries(progress.chars)) {
      progress.chars[c] = { stage: +s?.stage || 0, tries: +s?.tries || 0, best: +s?.best || 0, last: +s?.last || 0 };
    }
  } catch (e) { /* private mode or blocked storage: start fresh */ }
  const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) {} };
  const charState = (c) => (progress.chars[c] ||= { stage: 0, tries: 0, best: 0, last: 0 });
  const stageOf = (c) => (progress.chars[c] ? progress.chars[c].stage : 0);

  const MASTERED = 5;
  // Every step uses one box with a soft outline of the character.
  // Steps 1-2 are guided: each stroke is shown (in order and direction) just before she draws it.
  // Steps 3-4: the whole character plays first, then she writes it all; hints come later.
  const STAGES = {
    1: { guided: true, hints: 1 },
    2: { guided: true, hints: 1 },
    3: { hints: 2 },
    4: { hints: 3 },
  };

  // WORLDS are the categories (Numbers, Nature, ...). Each is a page with its own scene and fish tank.
  const masteredIn = (w) => w.chars.filter((c) => stageOf(c) >= MASTERED).length;
  // Stars are earned once per character: its best turn counts (2 stars, then 3 later, adds just 1).
  const bestOf = (c) => (progress.chars[c] ? progress.chars[c].best : 0);
  const worldStars = (w) => w.chars.reduce((n, c) => n + bestOf(c), 0);
  // Creatures in a category's tank: one for each of its characters that has had a 3-star turn. The big ones
  // (stingray, orca, whale) would crowd the tank, so those come one for every 10% of the category's possible
  // stars instead, up to 10: e.g. Animals (22 characters, 66 stars) wins its first orca at 7 stars.
  const BIG_CREATURES = new Set(["stingray", "orca", "whale"]);
  const MAX_BIG = 10;
  const fishIn = (w) => BIG_CREATURES.has(w.creature)
    ? Math.min(MAX_BIG, Math.floor((MAX_BIG * worldStars(w)) / (3 * w.chars.length)))
    : w.chars.filter((c) => bestOf(c) === 3).length;
  const MAX_SWIMMERS = 40;  // more than this would crowd the screen
  const worldDone = (w) => masteredIn(w) === w.chars.length;
  // A category opens once the one before it has two thirds (67%) of its possible stars, e.g. 20 of 30.
  const unlockAt = (w) => 2 * w.chars.length;  // two of the three stars per character, on average
  // Once open, a category stays open: it was opened before (saved), or she has played one of its characters, which
  // covers progress from before "opened" was saved. Adding words to a category never locks the next one again.
  const worldUnlocked = (i) => {
    const w = WORLDS[i];
    if (i === 0 || progress.settings.unlock || progress.opened.includes(w.id) || w.chars.some((c) => progress.chars[c])) return true;
    return worldUnlocked(i - 1) && worldStars(WORLDS[i - 1]) >= unlockAt(WORLDS[i - 1]);
  };
  const starRow = (n) => [1, 2, 3].map((k) => `<i class="${k <= n ? "on" : ""}">${STAR_SVG}</i>`).join("");

  // ---------- Sound ----------
  let audio;
  // Play even with the iPad's silent switch on (it otherwise mutes the clips and music, but not the device's voice).
  if (navigator.audioSession) navigator.audioSession.type = "playback";
  function audioCtx() {
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    // "interrupted" is how iPads report sound stopped by a call, an alarm or Siri: start it again too.
    if (audio.state !== "running" && audio.state !== "closed") audio.resume();
    return audio;
  }
  function tone(freq, dur = 0.2, type = "sine", vol = 0.14, when = 0) {
    try {
      audioCtx();
      const t = audio.currentTime + when;
      const o = audio.createOscillator();
      const g = audio.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g).connect(audio.destination);
      o.start(t);
      o.stop(t + dur + 0.05);
    } catch (e) {}
  }
  const PENTA = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51, 1567.98, 1760, 2093];
  const chime = (i) => tone(PENTA[Math.min(i, PENTA.length - 1)], 0.3);
  const thud = () => tone(196, 0.22, "triangle", 0.12);
  const fanfare = () => [0, 2, 4, 7].forEach((n, i) => tone(PENTA[n], 0.35, "sine", 0.14, i * 0.12));

  // ---------- Background music (music.js): on unless it's switched off; it can only start after a tap ----------
  function musicOn() {
    if (progress.settings.music && !document.hidden) SeaMusic.start(audioCtx());
  }
  function showMusicButton() {
    $("music").innerHTML = ICON(progress.settings.music ? "music" : "musicOff");
    $("music").setAttribute("aria-pressed", progress.settings.music);
  }
  // iPads only let sound start from the end of a tap, so listen for that too (starting twice does nothing).
  ["pointerdown", "touchend", "click"].forEach((ev) => document.addEventListener(ev, musicOn, { capture: true }));
  document.addEventListener("visibilitychange", () => (document.hidden ? SeaMusic.stop() : musicOn()));

  // ---------- Voice (the device's own Chinese voice) ----------
  let zhVoice = null;
  function pickVoice() {
    if (!("speechSynthesis" in window)) return;
    const vs = speechSynthesis.getVoices();
    const lang = (v) => v.lang.replace("_", "-");
    zhVoice =
      vs.find((v) => lang(v) === "zh-CN") ||
      vs.find((v) => /^zh/i.test(lang(v)) && !/HK|TW/i.test(lang(v))) ||
      vs.find((v) => /^zh/i.test(lang(v))) ||
      null;
  }
  if ("speechSynthesis" in window) {
    pickVoice();
    speechSynthesis.addEventListener?.("voiceschanged", pickVoice);
  }
  // ---------- Voice clips (a recording cut by tools/cut_recording.py, or made by tools/make_audio.py) ----------
  // Each character has "<code>-say.mp3" (the voice line) and "<code>.mp3" (the character alone).
  // Clips play through Web Audio so they also work after a short delay, not only straight after a tap.
  let clips = new Set();
  let clipVoice = "";
  const buffers = {};
  fetch("audio/clips.json").then((r) => (r.ok ? r.json() : null)).then((d) => {
    if (!d) return;
    clips = new Set(d.clips);
    clipVoice = d.voice;
    // Fetch every clip once in the background so they're stored for offline use.
    if (navigator.onLine) d.clips.forEach((name, i) => setTimeout(() => fetch("audio/" + name).catch(() => {}), 50 * i));
  }).catch(() => {});

  let voiceToken = 0;
  async function playClip(name) {
    const my = ++voiceToken;
    const ctx = audioCtx();
    if (!buffers[name]) {
      const data = await (await fetch("audio/" + name)).arrayBuffer();
      buffers[name] = await ctx.decodeAudioData(data);
    }
    if (my !== voiceToken) return;  // a newer line was asked for while this one loaded
    stopClip();
    const src = ctx.createBufferSource();
    const level = ctx.createGain();
    src.buffer = buffers[name];
    src.connect(level).connect(ctx.destination);
    SeaMusic.duck(src.buffer.duration + 0.3);
    src.start();
    playClip.current = { src, level };
  }
  // Stop the clip that's playing with a quick fade, never a sudden cut (which clicks).
  function stopClip() {
    const c = playClip.current;
    if (!c) return;
    playClip.current = null;
    try {
      const t = audio.currentTime;
      c.level.gain.setValueAtTime(c.level.gain.value, t);
      c.level.gain.linearRampToValueAtTime(0, t + 0.04);
      c.src.stop(t + 0.05);
    } catch (e) {}
  }

  // Say a character: kind "say" is its voice line (大，大象); "char" is the character alone.
  function sayWord(word, kind = "say") {
    const name = `${word.char.codePointAt(0).toString(16)}${kind === "say" ? "-say" : ""}.mp3`;
    const text = kind === "say" ? word.say : word.char;
    if (clips.has(name)) {
      if ("speechSynthesis" in window) speechSynthesis.cancel();
      const my = voiceToken + 1;  // playClip takes this number straight away
      // If the clip can't play, use the device's voice, unless a newer line has been asked for since.
      playClip(name).catch(() => { if (my === voiceToken) speak(text); });
    } else {
      speak(text);
    }
  }

  // The device's own voice: the fallback when there's no clip.
  function speak(text) {
    voiceToken++;
    stopClip();
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    if (zhVoice) u.voice = zhVoice;
    u.rate = 0.8;
    SeaMusic.duck(3);
    speechSynthesis.speak(u);
  }

  // Stop whatever is being said (when she leaves the writing screen).
  function stopVoice() {
    voiceToken++;
    stopClip();
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }

  // ---------- Little visual helpers ----------
  function bubbles(n = 12) {
    for (let i = 0; i < n; i++) {
      const b = document.createElement("div");
      const size = 10 + Math.random() * 30;
      b.className = "bubble";
      Object.assign(b.style, {
        width: size + "px", height: size + "px",
        left: Math.random() * 100 + "vw",
        animationDuration: 2.5 + Math.random() * 2.5 + "s",
        animationDelay: Math.random() * 0.6 + "s",
      });
      b.style.setProperty("--drift", (Math.random() * 60 - 30).toFixed(0) + "px");
      b.addEventListener("animationend", () => b.remove());
      document.body.appendChild(b);
    }
  }
  function restartAnim(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  function stingray() {
    return `<svg viewBox="0 0 200 160" aria-hidden="true">
      <path d="M100 150 C 104 130, 98 118, 100 104" stroke="#d94d8f" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M100 18 C 135 26, 178 52, 196 74 C 172 86, 132 96, 100 112 C 68 96, 28 86, 4 74 C 22 52, 65 26, 100 18 Z" fill="#f06aa6"/>
      <path d="M100 30 C 125 38, 150 56, 160 70 C 140 78, 118 86, 100 96 C 82 86, 60 78, 40 70 C 50 56, 75 38, 100 30 Z" fill="#ff8fc0"/>
      <circle cx="58" cy="66" r="4" fill="#ffd1e4"/><circle cx="142" cy="66" r="4" fill="#ffd1e4"/>
      <circle cx="70" cy="80" r="3" fill="#ffd1e4"/><circle cx="130" cy="80" r="3" fill="#ffd1e4"/>
      <circle cx="86" cy="54" r="9" fill="#fff"/><circle cx="114" cy="54" r="9" fill="#fff"/>
      <circle cx="88" cy="56" r="4.5" fill="#2f2346"/><circle cx="116" cy="56" r="4.5" fill="#2f2346"/>
      <path d="M90 72 Q 100 80 110 72" stroke="#2f2346" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  // ---------- Screens ----------
  const screens = ["home", "world", "pick", "practice", "done", "parent"];
  let here = null;  // the category she's in, or null on the home page
  function show(id) {
    screens.forEach((s) => ($(s).hidden = s !== id));
    $("capture").hidden = true;
    if (id !== "practice") { clearPads(); stopVoice(); }
    // A category's creatures swim on its page and its end screen, never while she's writing.
    if (id === "world" || id === "done") fillAquarium(); else emptyAquarium();
    SeaMusic.level(id === "practice" ? 0.6 : 1);  // softer while she's writing
  }

  // Each category has its own water colours and plants; the home page has the open sea.
  function setScene(key) {
    const sc = SCENE(key);
    SeaMusic.mood(key);
    const sea = $("sea").style;
    sea.setProperty("--top", sc.water[0]);
    sea.setProperty("--mid", sc.water[1]);
    sea.setProperty("--deep", sc.water[2]);
    sea.setProperty("--sandc", sc.sand);
    $("plants").innerHTML = sc.plants;
  }

  // ---------- The fish tank: one creature per 3-star character, or per 10% of the stars for big ones (see fishIn) ----------
  let swimmers = [];
  const FACES_RIGHT = new Set(["seal", "seahorse"]);  // the rest are drawn facing left
  // Some creatures swim bigger than the fish: a killer whale much bigger, a ray a little (it's thin side to side),
  // and whales bigger still, from babies to adults ([smallest, largest]). None is wider than 60% of the screen.
  const SIZE_SCALE = { orca: 4.4, stingray: 1.7, whale: [2.1, 6] };
  const sizeScale = (name) => { const s = SIZE_SCALE[name] || 1; return Array.isArray(s) ? s[0] + Math.random() * (s[1] - s[0]) : s; };
  // Whales let a few small bubbles out of the blowhole now and then. Where it is in the 100 × 100 drawing (facing left):
  const BLOWHOLE = { whale: [25, 41] };
  function puff(f) {
    if (!f.el.isConnected) return;  // the tank was emptied
    const r = f.el.getBoundingClientRect(), [bx, by] = BLOWHOLE[f.name];
    const x = r.left + r.width * (f.el.classList.contains("flip") ? 100 - bx : bx) / 100;
    const y = r.top + r.height * by / 100;
    const n = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      const b = document.createElement("span");
      const d = Math.max(6, Math.min(16, f.size / 22)) * (0.7 + Math.random() * 0.6);
      b.className = "puff";
      b.style.cssText = `left:${x}px;top:${y}px;width:${d}px;height:${d}px;animation-delay:${i * 0.22}s;` +
        `--drift:${Math.round(Math.random() * 16 - 8)}px;--rise:${Math.round(40 + Math.random() * 50 + f.size / 8)}px`;
      b.addEventListener("animationend", () => b.remove());
      $("aquarium").appendChild(b);
    }
    f.puffTimer = setTimeout(() => puff(f), 3000 + Math.random() * 8000);
  }
  function emptyAquarium() {
    swimmers.forEach((f) => { clearTimeout(f.timer); clearTimeout(f.puffTimer); });
    swimmers = [];
    $("aquarium").innerHTML = "";
  }
  function swimTo(f) {
    if (!f.el.isConnected) return;  // the tank was emptied
    const size = f.size;
    const x = Math.random() * (innerWidth - size);
    const y = Math.random() * (innerHeight - size);
    const dist = Math.hypot(x - f.x, y - f.y);
    const secs = Math.max(2.5, dist / f.speed);
    f.el.classList.toggle("flip", FACES_RIGHT.has(f.name) ? x < f.x : x > f.x);  // always face the way it swims
    f.el.style.transitionDuration = secs + "s";
    f.el.style.transform = `translate(${x}px, ${y}px)`;
    f.x = x; f.y = y;
    f.timer = setTimeout(() => swimTo(f), secs * 1000 + 300 + Math.random() * 1500);
  }
  function fillAquarium() {
    emptyAquarium();
    if (!here) return;
    for (let i = 0; i < Math.min(fishIn(here), MAX_SWIMMERS); i++) {
      const el = document.createElement("div");
      const size = Math.round(Math.min((56 + Math.random() * 28) * sizeScale(here.creature), innerWidth * 0.6));
      el.className = "swimmer";
      el.style.width = el.style.height = size + "px";
      el.innerHTML = `<div class="body">${CREATURE_SVG(here.creature)}</div>`;
      $("aquarium").appendChild(el);
      const f = { el, size, name: here.creature, x: Math.random() * (innerWidth - size), y: Math.random() * (innerHeight - size), speed: 40 + Math.random() * 40 };
      el.style.transform = `translate(${f.x}px, ${f.y}px)`;
      swimmers.push(f);
      f.timer = setTimeout(() => swimTo(f), 200 + Math.random() * 800);
      if (BLOWHOLE[f.name]) f.puffTimer = setTimeout(() => puff(f), 1000 + Math.random() * 6000);
    }
  }

  // ---------- Home: one tile per category ----------
  function renderHome() {
    here = null;
    setScene("home");
    $("home-guide").innerHTML = stingray();
    $("cats").innerHTML = "";
    WORLDS.forEach((w, i) => {
      const b = document.createElement("button");
      const unlocked = worldUnlocked(i);
      if (unlocked && !progress.settings.unlock && !progress.opened.includes(w.id)) { progress.opened.push(w.id); save(); }
      const stars = worldStars(w);
      const sc = SCENE(w.scene);
      b.className = "cat" + (unlocked ? "" : " locked");
      b.style.setProperty("--top", sc.water[0]);
      b.style.setProperty("--mid", sc.water[1]);
      b.style.setProperty("--bot", sc.water[2]);
      b.setAttribute("aria-label", `${w.name}, ${stars} of ${3 * w.chars.length} stars${unlocked ? "" : " (locked)"}`);
      b.innerHTML = `<span class="cat-creature">${CREATURE_SVG(w.creature)}</span>
        <span class="cat-zh" lang="zh-CN">${w.zh}</span><span class="cat-name">${w.name}</span>
        <span class="cat-stars"><i class="on">${STAR_SVG}</i><b>${stars}</b> / ${3 * w.chars.length}</span>
        ${unlocked ? "" : `<span class="lock">${ICON("lock")}</span>`}`;
      b.addEventListener("click", () => {
        if (!unlocked) { thud(); restartAnim(b, "wobble"); return; }
        openWorld(w);
      });
      $("cats").appendChild(b);
    });
    show("home");
    // Some creatures are drawn off-centre in their 100x100 box (a fin, a curled tail); centre each in its circle.
    document.querySelectorAll(".cat-creature svg").forEach((svg) => {
      const b = svg.getBBox();
      if (b.width) svg.setAttribute("viewBox", `${b.x + b.width / 2 - 50} ${b.y + b.height / 2 - 50} 100 100`);
    });
  }

  // ---------- A category page: its characters in order ----------
  function openWorld(w) {
    here = w;
    setScene(w.scene);
    $("world-zh").textContent = w.zh;
    $("world-name").textContent = w.name;
    $("words").innerHTML = "";
    w.chars.forEach((c) => {
      const b = document.createElement("button");
      const best = progress.chars[c] ? progress.chars[c].best : 0;
      const got = stageOf(c) >= MASTERED;
      b.className = "word" + (got ? " got" : "");
      b.setAttribute("aria-label", `${c}, ${best} of 3 stars${got ? ", mastered" : ""}`);
      b.innerHTML = `<span class="word-char" lang="zh-CN">${c}</span><span class="word-stars">${starRow(best)}</span>`;
      b.addEventListener("click", () => startWorld(w, c));
      $("words").appendChild(b);
    });
    show("world");
  }

  // ---------- A practice session ----------
  let session = null;

  // A turn goes through the category's characters in order, one after another, from where it starts to the
  // end of the category. Play starts at the first character without 3 stars yet (or the first, once all have 3);
  // tapping a character starts there. The stars screen comes after the category's last character.
  function startWorld(world, from) {
    from = from || world.chars.find((c) => bestOf(c) < 3) || world.chars[0];
    const items = world.chars.slice(world.chars.indexOf(from)).map((c) => ({ char: c, review: stageOf(c) >= MASTERED }));
    session = { mode: "play", world, items, i: 0, stars: [], mastered: [], newFish: 0, gained: 0, wasDone: worldDone(world), turnDone: false };
    show("practice");
    showItem();
  }

  let token = 0;         // stops callbacks from an old writer touching a new screen
  let writers = [];
  function clearPads() {
    token++;
    clearTimeout(guide.timer);
    guide.w = null;
    writers.forEach((w) => { try { w.cancelQuiz(); } catch (e) {} });
    writers = [];
    $("pads").innerHTML = "";
    $("stars").innerHTML = "";
  }

  function padSize() {
    const stage = document.querySelector(".stage").getBoundingClientRect();
    const card = document.querySelector(".card").getBoundingClientRect();
    const landscape = innerWidth > innerHeight;
    let size;
    if (landscape) size = Math.min(stage.width - card.width - 16, stage.height);
    else size = Math.min(stage.width, stage.height - card.height - 14);
    size = Math.max(160, Math.min(560, Math.floor(size)));
    document.documentElement.style.setProperty("--pad", size + "px");
    return size;
  }

  function makePad() {
    const el = document.createElement("div");
    el.className = "pad";
    $("pads").appendChild(el);
    return el;
  }

  function writerOptions(size, extra) {
    return {
      width: size, height: size,
      padding: Math.round(size * 0.07),
      showCharacter: false,
      showOutline: true,
      strokeColor: "#2f2346",
      outlineColor: "#d8cde4",
      drawingColor: "#f06aa6",
      drawingWidth: Math.max(10, Math.round(size / 20)),
      highlightColor: "#ffc83d",
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 350,
      charDataLoader: (c) => CHAR_DATA[c],
      ...extra,
    };
  }

  function current() {
    const item = session.items[session.i];
    const st = charState(item.char).stage;
    // Reviews of mastered characters use the top step (hints come latest).
    const quizStage = item.review ? 4 : Math.max(1, Math.min(st, 4));
    return { item, word: WORD[item.char], st, quizStage };
  }

  function showItem() {
    const { word } = current();
    $("picture").innerHTML = PICTURE_SVG(word.char);
    $("card-char").textContent = word.char;
    $("card-meaning").textContent = word.meaning;
    $("pinyin").textContent = progress.settings.pinyin ? word.pinyin : "";
    $("pinyin").hidden = !progress.settings.pinyin;
    sayWord(word);
    lesson();
  }

  function buttons({ replay = false }) {
    $("replay").hidden = !replay;
  }

  // One box: the strokes play in order (and direction) over the grey outline,
  // then the drawn character fades back to the outline and she writes over it.
  // Guided steps: show the next stroke now, and again every few seconds until she draws it.
  const guide = { w: null, stroke: 0, total: 0, timer: 0 };
  function showNextStroke() {
    clearTimeout(guide.timer);
    if (!guide.w || guide.stroke >= guide.total) return;
    guide.w.highlightStroke(guide.stroke);
    guide.timer = setTimeout(showNextStroke, 4000);
  }

  function lesson() {
    if (session.mode === "practice") { practiceRound(); return; }
    clearPads();
    $("rounds").hidden = true;
    $("card-trophy").hidden = true;
    const { word, quizStage } = current();
    const cfg = STAGES[quizStage];
    const pad = makePad();
    const w = HanziWriter.create(pad, word.char, writerOptions(padSize(), cfg.guided ? { strokeHighlightSpeed: 0.8 } : {}));
    writers = [w];
    const my = token;
    if (cfg.guided) {
      Object.assign(guide, { w, stroke: 0, total: CHAR_DATA[word.char].strokes.length });
      buttons({ replay: true });
      write(w, pad, cfg, my);
      setTimeout(() => { if (my === token) showNextStroke(); }, 500);
      return;
    }
    buttons({});
    w.animateCharacter({
      onComplete: () => {
        if (my !== token) return;
        setTimeout(() => {
          if (my !== token) return;
          w.hideCharacter();
          buttons({ replay: true });
          write(w, pad, cfg, my);
        }, 700);
      },
    });
  }

  // She writes over the outline; Hanzi Writer checks each stroke's order and direction.
  function write(w, pad, cfg, my) {
    const strict = progress.settings.strict;
    w.quiz({
      leniency: strict ? 1.0 : 1.5,
      showHintAfterMisses: cfg.hints,
      markStrokeCorrectAfterMisses: strict ? 6 : 4,
      acceptBackwardsStrokes: false,
      onCorrectStroke: (d) => {
        if (my !== token) return;
        chime(d.strokeNum);
        if (cfg.guided) { guide.stroke = d.strokeNum + 1; setTimeout(() => { if (my === token) showNextStroke(); }, 400); }
      },
      onMistake: () => {
        if (my !== token) return;
        thud();
        restartAnim(pad, "wobble");
        if (cfg.guided) setTimeout(() => { if (my === token) showNextStroke(); }, 500);
      },
      onComplete: (d) => {
        if (my !== token) return;
        clearTimeout(guide.timer);
        finish(d.totalMistakes, pad);
      },
    });
  }

  function finish(mistakes, pad) {
    if (session.mode === "practice") { finishRound(mistakes, pad); return; }
    const { item, word, quizStage } = current();
    const stars = mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1;
    const cs = charState(item.char);
    cs.last = Date.now();
    const before = cs.best;
    const home = WORLDS.find((w) => w.id === word.world);
    const fishBefore = fishIn(home);
    cs.best = Math.max(cs.best, stars);
    session.gained += cs.best - before;  // only stars above her best so far are new
    if (!item.review) {
      cs.tries++;
      // Move up a step after a good try, or after two tries at the same step.
      if (stars >= 2 || cs.tries >= 2) {
        cs.stage = quizStage + 1;
        cs.tries = 0;
        if (cs.stage >= MASTERED) session.mastered.push(item.char);
      }
    }
    save();
    session.stars.push(stars);
    pad.classList.add("glow");
    fanfare();
    bubbles(10);
    $("stars").innerHTML = [1, 2, 3].map((n) => `<span class="${n <= stars ? "" : "dim"}">${STAR_SVG}</span>`).join("");
    // A creature for the tank: a first 3-star turn, or (big creatures) new stars reaching the next 10% of the category's.
    const won = fishIn(home) - fishBefore;
    if (won > 0) {
      if (home === session.world) session.newFish += won;
      $("stars").insertAdjacentHTML("beforeend", `<span class="fish-won">${CREATURE_SVG(home.creature)}</span>`.repeat(won));
    }
    const my = token;
    setTimeout(() => { if (my === token) sayWord(word, "char"); }, 500);
    // Move on by itself after a moment to enjoy the stars (no Next button to find).
    session.turnDone = true;
    buttons({});
    setTimeout(() => { if (my === token) nextItem(); }, 2800);
  }

  function nextItem() {
    session.turnDone = false;
    session.i++;
    if (session.i < session.items.length) { showItem(); return; }
    showDone();
  }

  function showDone() {
    const s = session;
    if (s.mode === "practice") { showPracticeDone(); return; }
    $("done-guide").innerHTML = stingray();
    restartAnim($("done-guide"), "happy");
    $("done-stars").innerHTML = STAR_SVG.repeat(s.gained);  // new stars only
    // The category's stars so far, so the screen is never empty after a turn with no new stars.
    $("done-total").innerHTML = `<i class="on">${STAR_SVG}</i><b>${worldStars(s.world)}</b> / ${3 * s.world.chars.length}`;
    // Characters mastered (each in a gold ring, as on its word bubble), and the creatures won this time.
    let html = s.mastered.length ? `<span class="new-mastered" lang="zh-CN">${s.mastered.map((c) => `<b>${c}</b>`).join("")}</span>` : "";
    if (s.newFish) {
      html += `<span class="creatures-new">${Array(s.newFish).fill(`<span class="creature">${CREATURE_SVG(s.world.creature)}</span>`).join("")}</span>`;
    }
    $("done-new").innerHTML = html;
    show("done");
    fanfare();
    bubbles(24);
  }

  // ---------- Practice mode: one character written 11 times, with less help each time ----------
  // Any character with 3 stars can be practised. Practice never changes stars, steps or fish; finishing all 11 rounds
  // wins the character a trophy, and her latest free-written version is kept with it (only on this device).
  const practiceable = (c) => bestOf(c) === 3;
  const hasTrophy = (c) => !!progress.practice[c];
  const PRACTICE_ROUNDS = 11;
  // Rounds 1-6: the help fades. Rounds 7-10: no outline and no hints. Round 11: free writing (see freeWrite).
  // outline: the grey outline's colour (fainter and fainter, then none); demo: the whole character is shown first;
  // guided: each next stroke lights up; flash: only the first stroke lights up, once; hints: misses before a hint.
  const ROUNDS = {
    1: { outline: "#d8cde4", demo: true, guided: true, hints: 1 },
    2: { outline: "#d8cde4", guided: true, hints: 1 },
    3: { outline: "#d8cde4", hints: 1 },
    4: { outline: "#e8e1f0", hints: 1 },
    5: { outline: "#f3eff7", hints: 2 },
    6: { outline: null, flash: true, hints: 3 },
    7: { outline: null, hints: false }, 8: { outline: null, hints: false },
    9: { outline: null, hints: false }, 10: { outline: null, hints: false },
  };

  function renderPick() {
    here = null;
    setScene("home");
    const box = $("pick-words");
    box.innerHTML = "";
    let any = false;
    WORLDS.forEach((world) => {
      const chars = world.chars.filter(practiceable);
      if (!chars.length) return;
      any = true;
      const h = document.createElement("h3");
      h.className = "group-head";
      h.innerHTML = `<span lang="zh-CN">${world.zh}</span> <small>${world.name}</small>`;
      box.appendChild(h);
      chars.forEach((c) => {
        const b = document.createElement("button");
        // A card with the word's picture and character, in a gold ring like a 3-star bubble.
        b.className = "pick-card";
        b.setAttribute("aria-label", `${c}, ${WORD[c].meaning}${hasTrophy(c) ? ", practised: trophy won" : ""}`);
        b.innerHTML = `<span class="pick-pic">${PICTURE_SVG(c)}</span><span class="pick-char" lang="zh-CN">${c}</span>` +
          (hasTrophy(c) ? `<span class="word-trophy">${TROPHY_SVG}</span>` : "");
        b.addEventListener("click", () => startPractice(c));
        box.appendChild(b);
      });
    });
    if (!any) box.innerHTML = `<p class="pick-empty"><span class="guide">${stingray()}</span>Get 3 stars on a character, and it can be practised here.</p>`;
    show("pick");
  }

  function startPractice(c) {
    const world = WORLDS.find((w) => w.id === WORD[c].world);
    session = { mode: "practice", char: c, world, items: [{ char: c, review: true }], i: 0, round: 1, stars: [], turnDone: false };
    show("practice");
    const word = WORD[c];
    $("picture").innerHTML = PICTURE_SVG(c);
    $("card-char").textContent = c;
    $("card-meaning").textContent = word.meaning;
    $("pinyin").textContent = progress.settings.pinyin ? word.pinyin : "";
    $("pinyin").hidden = !progress.settings.pinyin;
    sayWord(word);
    practiceRound();
  }

  // Dots for the 11 rounds: done ones gold, this one ringed, the last one a pencil (free writing).
  function showRounds() {
    $("rounds").hidden = false;
    $("rounds").innerHTML = Array.from({ length: PRACTICE_ROUNDS }, (_, i) => {
      const n = i + 1, cls = n < session.round ? "done" : n === session.round ? "now" : "";
      return n === PRACTICE_ROUNDS ? `<i class="free ${cls}">${ICON("pencil")}</i>` : `<i class="${cls}"></i>`;
    }).join("");
    $("rounds").setAttribute("aria-label", `Round ${session.round} of ${PRACTICE_ROUNDS}`);
  }
  function showCardTrophy() {
    const c = session.char;
    $("card-trophy").hidden = !hasTrophy(c);
    $("card-trophy").innerHTML = TROPHY_SVG;
  }

  function practiceRound() {
    clearPads();
    session.turnDone = false;
    showRounds();
    showCardTrophy();
    if (session.round === PRACTICE_ROUNDS) { freeWrite(); return; }
    const cfg = ROUNDS[session.round];
    const pad = makePad();
    const w = HanziWriter.create(pad, session.char, writerOptions(padSize(), {
      showOutline: !!cfg.outline, outlineColor: cfg.outline || "#d8cde4", ...(cfg.guided || cfg.flash ? { strokeHighlightSpeed: 0.8 } : {}),
    }));
    writers = [w];
    const my = token;
    buttons({ replay: !!cfg.guided });
    const startGuided = () => {
      Object.assign(guide, { w, stroke: 0, total: CHAR_DATA[session.char].strokes.length });
      write(w, pad, cfg, my);
      setTimeout(() => { if (my === token) showNextStroke(); }, 500);
    };
    if (cfg.demo) {
      buttons({});
      w.animateCharacter({ onComplete: () => setTimeout(() => {
        if (my !== token) return;
        w.hideCharacter();
        buttons({ replay: true });
        startGuided();
      }, 700) });
    } else if (cfg.guided) {
      startGuided();
    } else {
      write(w, pad, cfg, my);
      if (cfg.flash) setTimeout(() => { if (my === token) w.highlightStroke(0); }, 500);
    }
  }

  // A round's stars are only for fun: practice never changes her stars, steps or fish.
  function finishRound(mistakes, pad, ink) {
    const stars = mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1;
    session.stars.push(stars);
    session.turnDone = true;
    buttons({});
    pad.classList.add("glow");
    fanfare();
    bubbles(8);
    $("stars").innerHTML = [1, 2, 3].map((n) => `<span class="${n <= stars ? "" : "dim"}">${STAR_SVG}</span>`).join("");
    const my = token;
    setTimeout(() => { if (my === token) sayWord(WORD[session.char], "char"); }, 500);
    if (session.round === PRACTICE_ROUNDS) {
      progress.practice[session.char] = { at: Date.now(), ink };
      save();
    }
    setTimeout(() => {
      if (my !== token) return;
      if (session.round < PRACTICE_ROUNDS) { session.round++; practiceRound(); } else showDone();
    }, 2200);
  }

  function showPracticeDone() {
    const c = session.char;
    $("done-guide").innerHTML = stingray();
    restartAnim($("done-guide"), "happy");
    $("done-stars").innerHTML = "";
    $("done-total").innerHTML = `<span class="done-char" lang="zh-CN">${c}</span>`;
    $("done-new").innerHTML = `<button class="done-trophy" aria-label="See the handwriting">${TROPHY_SVG}</button>`;
    $("done-new").querySelector("button").addEventListener("click", () => openCapture(c));
    show("done");
    fanfare();
    bubbles(24);
  }

  // Her free-written strokes, kept as points in a 100 × 100 box, drawn back as her handwriting.
  const inkSvg = (ink) => `<svg viewBox="0 0 100 100" aria-hidden="true">${ink.map((s) =>
    `<path d="M${s.map((p, i) => (i % 2 ? " " : i ? " L" : "") + p).join("")}"/>`).join("")}</svg>`;
  function openCapture(c) {
    const p = progress.practice[c];
    if (!p) return;
    $("capture-art").innerHTML = inkSvg(p.ink);
    const when = new Date(p.at).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
    $("capture-note").innerHTML = `<span lang="zh-CN">${c}</span> ${when}`;
    $("capture").hidden = false;
  }

  // ---------- Round 11: free writing ----------
  // She writes the character at any size and anywhere in the box. Each stroke is still checked: its shape,
  // direction and order, and (from the second stroke on) where it sits compared with the strokes she has already
  // written. The first stroke sets her size and position, and every accepted stroke refines it. A wrong stroke is
  // undone; after 4 misses on one stroke it fills itself in, so she never gets stuck.
  function freeWrite() {
    const c = session.char, size = padSize(), my = token;
    buttons({});
    const pad = makePad();
    pad.classList.add("free");
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    pad.appendChild(svg);
    const judge = FreeWriting.judge(c, size, progress.settings.strict);
    const width = Math.max(8, Math.round(size / 22));
    const ink = [];
    let k = 0, misses = 0, mistakes = 0, drawing = null, filling = false;

    const newPath = (cls) => {
      const p = document.createElementNS(NS, "path");
      p.setAttribute("class", cls);
      p.setAttribute("stroke-width", width);
      svg.appendChild(p);
      return p;
    };
    const setPath = (p, pts) => p.setAttribute("d", "M" + pts.map((q) => q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" L"));
    const local = (e) => { const r = svg.getBoundingClientRect(); return [(e.clientX - r.left) * size / r.width, (e.clientY - r.top) * size / r.height]; };

    function accept(pts, path) {
      path.setAttribute("class", "ink");
      judge.add(pts, k);
      ink.push(pts);
      chime(k);
      k++;
      misses = 0;
      if (k === judge.strokes) {
        svg.style.pointerEvents = "none";
        // Keep her strokes in a 100 × 100 box, every other point, to one decimal place.
        const kept = ink.map((s) => s.filter((_, i) => i % 2 === 0 || i === s.length - 1).flatMap(([x, y]) => [+(x * 100 / size).toFixed(1), +(y * 100 / size).toFixed(1)]));
        finishRound(mistakes, pad, kept);
      }
    }
    // After 4 misses: draw the stroke where it belongs, at her size and position so far.
    function fillIn() {
      const pts = judge.place(k);
      const p = newPath("ink");
      setPath(p, pts);
      accept(pts, p);
    }
    function check(pts, path) {
      const ok = judge.fits(pts, k);
      if (ok) { accept(pts, path); return; }
      mistakes++;
      misses++;
      thud();
      restartAnim(pad, "wobble");
      path.setAttribute("class", "wrong");
      setTimeout(() => path.remove(), 450);
      // No new strokes while the missed one fills itself in.
      if (misses >= 4) { filling = true; setTimeout(() => { if (my === token) { filling = false; fillIn(); } }, 500); }
    }
    svg.addEventListener("pointerdown", (e) => {
      if (drawing || filling) return;
      e.preventDefault();
      svg.setPointerCapture?.(e.pointerId);
      drawing = { id: e.pointerId, pts: [local(e)], path: newPath("drawing") };
    });
    svg.addEventListener("pointermove", (e) => {
      if (!drawing || e.pointerId !== drawing.id) return;
      (e.getCoalescedEvents?.() || [e]).forEach((ev) => drawing.pts.push(local(ev)));
      setPath(drawing.path, drawing.pts);
    });
    const end = (e) => {
      if (!drawing || e.pointerId !== drawing.id) return;
      const { pts, path } = drawing;
      drawing = null;
      if (pts.length < 2 || FreeWriting.pathLength(pts) < size * 0.015) { path.remove(); return; }  // a tap, not a stroke
      check(pts, path);
    };
    svg.addEventListener("pointerup", end);
    svg.addEventListener("pointercancel", end);
  }

  // ---------- Parent corner (hold the parent button for 3 seconds) ----------
  function renderParent() {
    const mastered = WORDS.filter((w) => stageOf(w.char) >= MASTERED).length;
    const started = WORDS.filter((w) => stageOf(w.char) > 0 && stageOf(w.char) < MASTERED).length;
    const worlds = WORLDS.filter(worldDone).length;
    const stars = WORLDS.reduce((n, w) => n + worldStars(w), 0);
    $("progress-summary").textContent =
      `${stars} of ${3 * WORDS.length} stars. ${mastered} of ${WORDS.length} characters mastered, ${started} in progress. ${worlds} of ${WORLDS.length} categories finished. ` +
      "A category opens when the one before it has two thirds of its stars (20 of 30, for example).";
    $("set-pinyin").checked = progress.settings.pinyin;
    $("set-strict").checked = progress.settings.strict;
    $("set-unlock").checked = progress.settings.unlock;
    pickVoice();
    const haveClips = WORDS.filter((w) => clips.has(`${w.char.codePointAt(0).toString(16)}-say.mp3`)).length;
    $("voice-status").textContent = haveClips
      ? `Recorded voice clips (${clipVoice}) for ${haveClips} of ${WORDS.length} characters.` +
        (haveClips < WORDS.length ? " The rest use this device's own voice." : "")
      : !("speechSynthesis" in window)
      ? "This browser has no speech support, so the speaker button stays silent."
      : zhVoice
        ? `Using the voice "${zhVoice.name}" (${zhVoice.lang}).`
        : "No Chinese voice found yet. On an iPad or iPhone, add one in Settings → Accessibility → Spoken Content → Voices → Chinese, then reopen the app. The button below still tries.";
    show("parent");
  }

  function holdToOpen(btn, ms, action) {
    let timer = null;
    const stop = () => { clearTimeout(timer); timer = null; btn.classList.remove("holding"); };
    btn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      btn.classList.add("holding");
      timer = setTimeout(() => { stop(); action(); }, ms);
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => btn.addEventListener(ev, stop));
    btn.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  // ---------- Wiring ----------
  $("go-home").addEventListener("click", () => (session?.mode === "practice" ? renderPick() : openWorld(here)));
  $("world-home").addEventListener("click", renderHome);
  $("world-play").addEventListener("click", () => startWorld(here));
  $("say").addEventListener("click", () => session && sayWord(current().word));
  // "Again": in guided steps, show the current stroke again; otherwise replay the whole character.
  $("replay").addEventListener("click", () => (guide.w ? showNextStroke() : lesson()));
  $("done-home").addEventListener("click", () => (session?.mode === "practice" ? renderHome() : openWorld(here)));
  // Keep going: the category is finished, so on to the next one if it's open; otherwise this one again.
  $("done-next").addEventListener("click", () => {
    if (session?.mode === "practice") { renderPick(); return; }
    const i = WORLDS.indexOf(here);
    const next = i + 1 < WORLDS.length && worldUnlocked(i + 1) ? WORLDS[i + 1] : here;
    here = next;
    setScene(next.scene);
    startWorld(next);
  });
  $("open-practice").addEventListener("click", renderPick);
  $("pick-home").addEventListener("click", renderHome);
  $("card-trophy").addEventListener("click", () => openCapture(session.char));
  $("capture-close").addEventListener("click", () => ($("capture").hidden = true));
  $("capture").addEventListener("click", (e) => { if (e.target === $("capture")) $("capture").hidden = true; });
  $("parent-home").addEventListener("click", renderHome);
  holdToOpen($("open-parent"), 3000, renderParent);
  $("music").addEventListener("click", () => {
    progress.settings.music = !progress.settings.music;
    save();
    showMusicButton();
    if (progress.settings.music) musicOn(); else SeaMusic.stop();
  });

  const setting = (id, key) => $(id).addEventListener("change", (e) => { progress.settings[key] = e.target.checked; save(); });
  setting("set-pinyin", "pinyin");
  setting("set-strict", "strict");
  setting("set-unlock", "unlock");
  $("voice-test").addEventListener("click", () => sayWord(WORD["大"]));
  $("reset").addEventListener("click", () => {
    if (!confirm("Reset all progress? Every character goes back to the start.")) return;
    if (!confirm("Are you sure? This can't be undone.")) return;
    progress = { ...blank(), settings: progress.settings };  // trophies and handwriting go too
    save();
    renderParent();
  });

  // Redraw the writing boxes when the screen turns or resizes.
  let resizeTimer;
  addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if ($("practice").hidden || (session && session.turnDone)) return;
      lesson();
    }, 250);
  });

  // Stop pinch-zoom and double-tap zoom while she's writing.
  document.addEventListener("gesturestart", (e) => e.preventDefault());
  document.addEventListener("dblclick", (e) => e.preventDefault());

  // The offline copy is for the website; the iOS app already carries every file inside it.
  if ("serviceWorker" in navigator && !window.Capacitor && (location.protocol === "https:" || location.hostname === "localhost")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  document.querySelectorAll("[data-icon]").forEach((el) => { el.innerHTML = ICON(el.dataset.icon); });
  showMusicButton();
  renderHome();
})();
