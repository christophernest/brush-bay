/* Stroke Sea: Chinese character writing practice for a young child.
   Each turn uses one box: the strokes play in order over a grey outline, then she writes over that outline.
   A character is mastered after four good turns; hints come later as she climbs. */
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const WORD = Object.fromEntries(WORDS.map((w) => [w.char, w]));

  // ---------- Saved progress (only on this device) ----------
  const STORE_KEY = "stroke-sea-v1";
  const blank = () => ({ chars: {}, settings: { pinyin: false, strict: false, unlock: false } });
  let progress = blank();
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    if (saved && saved.chars) progress = { ...blank(), ...saved, settings: { ...blank().settings, ...saved.settings } };
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
  const worldDone = (w) => masteredIn(w) === w.chars.length;
  const worldStars = (w) => Math.floor((3 * masteredIn(w)) / w.chars.length);  // one star per third mastered
  // A category opens once the one before it has its first star.
  const worldUnlocked = (i) =>
    i === 0 || progress.settings.unlock || (worldUnlocked(i - 1) && worldStars(WORLDS[i - 1]) >= 1);
  const starRow = (n) => [1, 2, 3].map((k) => `<i class="${k <= n ? "on" : ""}">${STAR_SVG}</i>`).join("");

  // ---------- Sound ----------
  let audio;
  function tone(freq, dur = 0.2, type = "sine", vol = 0.14, when = 0) {
    try {
      audio ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
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
  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    if (zhVoice) u.voice = zhVoice;
    u.rate = 0.8;
    speechSynthesis.speak(u);
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
  const screens = ["home", "world", "practice", "done", "book", "parent"];
  let here = null;  // the category she's in, or null on the home page
  function show(id) {
    screens.forEach((s) => ($(s).hidden = s !== id));
    if (id !== "practice") clearPads();
    // A category's creatures swim on its page and its end screen, never while she's writing.
    if (id === "world" || id === "done") fillAquarium(); else emptyAquarium();
  }

  // Each category has its own water colours and plants; the home page has the open sea.
  function setScene(key) {
    const sc = SCENE(key);
    const sea = $("sea").style;
    sea.setProperty("--top", sc.water[0]);
    sea.setProperty("--mid", sc.water[1]);
    sea.setProperty("--deep", sc.water[2]);
    sea.setProperty("--sandc", sc.sand);
    $("plants").innerHTML = sc.plants;
  }

  // ---------- The fish tank: one creature for each character mastered in this category ----------
  let swimmers = [];
  const FACES_RIGHT = new Set(["dolphin", "shrimp", "seal", "seahorse"]);  // the rest are drawn facing left
  function emptyAquarium() {
    swimmers.forEach((f) => clearTimeout(f.timer));
    swimmers = [];
    $("aquarium").innerHTML = "";
  }
  function swimTo(f) {
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
    for (let i = 0; i < masteredIn(here); i++) {
      const el = document.createElement("div");
      const size = 56 + Math.round(Math.random() * 28);
      el.className = "swimmer";
      el.style.width = el.style.height = size + "px";
      el.innerHTML = `<div class="body">${CREATURE_SVG(here.creature)}</div>`;
      $("aquarium").appendChild(el);
      const f = { el, size, name: here.creature, x: Math.random() * (innerWidth - size), y: Math.random() * (innerHeight - size), speed: 40 + Math.random() * 40 };
      el.style.transform = `translate(${f.x}px, ${f.y}px)`;
      swimmers.push(f);
      setTimeout(() => swimTo(f), 200 + Math.random() * 800);
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
      const stars = worldStars(w);
      const sc = SCENE(w.scene);
      b.className = "cat" + (unlocked ? "" : " locked");
      b.style.setProperty("--top", sc.water[0]);
      b.style.setProperty("--mid", sc.water[1]);
      b.style.setProperty("--bot", sc.water[2]);
      b.setAttribute("aria-label", `${w.name}, ${stars} of 3 stars${unlocked ? "" : " (locked)"}`);
      b.innerHTML = `<span class="cat-creature">${CREATURE_SVG(w.creature)}</span>
        <span class="cat-zh">${w.zh}</span><span class="cat-name">${w.name}</span>
        <span class="cat-stars">${starRow(stars)}</span>
        ${unlocked ? "" : `<span class="lock">${ICON("lock")}</span>`}`;
      b.addEventListener("click", () => {
        if (!unlocked) { thud(); restartAnim(b, "wobble"); return; }
        openWorld(w);
      });
      $("cats").appendChild(b);
    });
    show("home");
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
      b.innerHTML = `${c}<span class="word-stars">${starRow(best)}</span>`;
      b.addEventListener("click", () => startWorld(w, c));
      $("words").appendChild(b);
    });
    show("world");
  }

  // ---------- A practice session ----------
  let session = null;

  function buildQueue(world) {
    const fresh = world.chars.filter((c) => stageOf(c) < MASTERED).slice(0, 2);
    const items = fresh.map((c) => ({ char: c, review: false }));
    const learned = WORDS.map((w) => w.char)
      .filter((c) => stageOf(c) >= MASTERED && !fresh.includes(c))
      .sort((a, b) => charState(a).last - charState(b).last);
    if (items.length === 0) {
      // Whole world mastered: practise its characters again, oldest first.
      world.chars.slice().sort((a, b) => charState(a).last - charState(b).last).slice(0, 3)
        .forEach((c) => items.push({ char: c, review: true }));
    } else if (learned.length) {
      items.push({ char: learned[0], review: true });
    }
    return items;
  }

  // Play: the next characters in order plus one review. Tapping a character practises just that one.
  function startWorld(world, onlyChar) {
    const items = onlyChar ? [{ char: onlyChar, review: stageOf(onlyChar) >= MASTERED }] : buildQueue(world);
    session = { world, items, i: 0, stars: [], mastered: [], wasDone: worldDone(world) };
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
    speak(word.say);
    lesson();
  }

  function buttons({ replay = false, next = false }) {
    $("replay").hidden = !replay;
    $("next").hidden = !next;
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
    clearPads();
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
    const { item, word, quizStage } = current();
    const stars = mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1;
    const cs = charState(item.char);
    cs.last = Date.now();
    cs.best = Math.max(cs.best, stars);
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
    setTimeout(() => speak(word.char), 500);
    buttons({ next: true });
  }

  function nextItem() {
    session.i++;
    if (session.i < session.items.length) { showItem(); return; }
    showDone();
  }

  function showDone() {
    const s = session;
    $("done-guide").innerHTML = stingray();
    restartAnim($("done-guide"), "happy");
    $("done-stars").innerHTML = STAR_SVG.repeat(s.stars.reduce((a, b) => a + b, 0));
    // Each character mastered this time adds a creature to this category's tank.
    let html = s.mastered.length ? `<span class="new-stickers">${ICON("book")} ${s.mastered.join(" ")}</span>` : "";
    if (s.mastered.length) {
      html += `<span class="creatures-new">${s.mastered.map(() => `<span class="creature">${CREATURE_SVG(s.world.creature)}</span>`).join("")}</span>`;
    }
    $("done-new").innerHTML = html;
    show("done");
    fanfare();
    bubbles(24);
  }

  // ---------- Sticker book ----------
  function renderBook() {
    $("stickers").innerHTML = "";
    WORDS.forEach((w) => {
      const b = document.createElement("button");
      const got = stageOf(w.char) >= MASTERED;
      b.className = "sticker" + (got ? "" : " locked");
      b.innerHTML = got ? w.char : "<i class='empty-bubble'></i>";
      b.setAttribute("aria-label", got ? w.char : "Not collected yet");
      if (got) b.addEventListener("click", () => { speak(w.say); restartAnim(b, "bounce"); });
      $("stickers").appendChild(b);
    });
    show("book");
  }

  // ---------- Parent corner (hold the gear for 3 seconds) ----------
  function renderParent() {
    const mastered = WORDS.filter((w) => stageOf(w.char) >= MASTERED).length;
    const started = WORDS.filter((w) => stageOf(w.char) > 0 && stageOf(w.char) < MASTERED).length;
    const worlds = WORLDS.filter(worldDone).length;
    $("progress-summary").textContent =
      `${mastered} of ${WORDS.length} characters mastered, ${started} in progress. ${worlds} of ${WORLDS.length} categories finished.`;
    $("set-pinyin").checked = progress.settings.pinyin;
    $("set-strict").checked = progress.settings.strict;
    $("set-unlock").checked = progress.settings.unlock;
    pickVoice();
    $("voice-status").textContent = !("speechSynthesis" in window)
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
  $("go-home").addEventListener("click", () => openWorld(here));
  $("world-home").addEventListener("click", renderHome);
  $("world-play").addEventListener("click", () => startWorld(here));
  $("say").addEventListener("click", () => session && speak(current().word.say));
  // "Again": in guided steps, show the current stroke again; otherwise replay the whole character.
  $("replay").addEventListener("click", () => (guide.w ? showNextStroke() : lesson()));
  $("next").addEventListener("click", nextItem);
  $("done-home").addEventListener("click", () => openWorld(here));
  $("open-book").addEventListener("click", renderBook);
  $("book-home").addEventListener("click", renderHome);
  $("parent-home").addEventListener("click", renderHome);
  holdToOpen($("open-parent"), 3000, renderParent);

  const setting = (id, key) => $(id).addEventListener("change", (e) => { progress.settings[key] = e.target.checked; save(); });
  setting("set-pinyin", "pinyin");
  setting("set-strict", "strict");
  setting("set-unlock", "unlock");
  $("voice-test").addEventListener("click", () => speak("你好！大，大象的大。"));
  $("reset").addEventListener("click", () => {
    if (!confirm("Reset all progress? Every character goes back to the start.")) return;
    if (!confirm("Are you sure? This can't be undone.")) return;
    progress = { ...blank(), settings: progress.settings };
    save();
    renderParent();
  });

  // Redraw the writing boxes when the screen turns or resizes.
  let resizeTimer;
  addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if ($("practice").hidden || !$("next").hidden) return;
      lesson();
    }, 250);
  });

  // Stop pinch-zoom and double-tap zoom while she's writing.
  document.addEventListener("gesturestart", (e) => e.preventDefault());
  document.addEventListener("dblclick", (e) => e.preventDefault());

  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  document.querySelectorAll("[data-icon]").forEach((el) => { el.innerHTML = ICON(el.dataset.icon); });
  renderHome();
})();
