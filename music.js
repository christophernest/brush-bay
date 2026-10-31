/* Stroke Sea background music: a gentle sea lullaby made live in the browser, so there are no recordings to licence.
   Soft chords, a slow music-box tune on the five-note scale, waves rolling in and the odd bubble popping. Each sea plays in its own key.
   It never repeats exactly, because the tune is a small random walk over the scale. */
window.SeaMusic = (() => {
  "use strict";

  // One mood per scene (see SCENES in pictures.js): the key (MIDI note), major or minor, and seconds per beat.
  const MOODS = {
    home:     { root: 60, minor: false, beat: 0.75 },  // C
    reef:     { root: 62, minor: false, beat: 0.68 },  // D, a little brighter
    lagoon:   { root: 65, minor: false, beat: 0.75 },  // F
    twilight: { root: 57, minor: true,  beat: 0.9 },   // A minor, slow and dreamy for the deep water
    kelp:     { root: 55, minor: false, beat: 0.8 },   // G, low
    shallows: { root: 64, minor: false, beat: 0.65 },  // E, sunny
    seagrass: { root: 62, minor: false, beat: 0.78 },  // D
    garden:   { root: 67, minor: false, beat: 0.72 },  // G, high
    sandbar:  { root: 60, minor: false, beat: 0.7 },   // C
    rocks:    { root: 58, minor: false, beat: 0.8 },   // B flat
    sunset:   { root: 63, minor: false, beat: 0.88 },  // E flat, slow, end of the day
  };
  // Four chords, each held for 8 beats, as notes above or below the key note.
  const CHORDS = {
    major: [[0, 7, 12, 16], [-3, 4, 9, 12], [-7, 0, 5, 9], [-5, 2, 7, 14]],    // I, vi, IV, V (open)
    minor: [[0, 7, 12, 15], [-4, 3, 8, 12], [-7, 0, 5, 8], [-2, 5, 10, 14]],   // i, VI, iv, VII
  };
  const SCALE = { major: [0, 2, 4, 7, 9], minor: [0, 3, 5, 7, 10] };  // five-note (pentatonic) scales
  const BEATS_PER_CHORD = 8;
  const VOLUME = 0.55;  // the whole mix; the voice and the game's chimes stay louder

  const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);
  let ctx, out, level, waves, timer;
  let mood = MOODS.home, nextMood = null;
  let beatAt = 0, beat = 0, chord = 0, step = 5, playing = false, levelNow = 1;

  // The sound chain: everything → a soft low-pass (so it sounds like it's under water) → speakers,
  // with an echo on the side for the music box.
  function build(c) {
    ctx = c;
    level = ctx.createGain();
    level.gain.value = 0;
    const muffle = ctx.createBiquadFilter();
    muffle.type = "lowpass";
    muffle.frequency.value = 2600;
    level.connect(muffle).connect(ctx.destination);
    out = ctx.createGain();
    out.connect(level);
    const echo = ctx.createDelay(2);
    echo.delayTime.value = 0.42;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.32;
    const echoTone = ctx.createBiquadFilter();
    echoTone.type = "lowpass";
    echoTone.frequency.value = 1400;
    const echoLevel = ctx.createGain();
    echoLevel.gain.value = 0.35;
    out.connect(echo).connect(echoTone).connect(feedback).connect(echo);
    echoTone.connect(echoLevel).connect(level);
  }

  // A pad note: two slightly detuned soft voices that fade in and out slowly.
  function pad(midi, t, dur, vol = 0.028) {
    [["sine", 0], ["triangle", 5]].forEach(([type, cents]) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = hz(midi);
      o.detune.value = cents;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol * (type === "sine" ? 1 : 0.4), t + 1.6);
      g.gain.setValueAtTime(vol * (type === "sine" ? 1 : 0.4), t + dur - 0.4);
      g.gain.linearRampToValueAtTime(0, t + dur + 1.8);
      o.connect(g).connect(out);
      o.start(t);
      o.stop(t + dur + 2);
    });
  }

  // A music-box note: a quick pluck that rings out, with a quieter overtone for sparkle.
  function pluck(midi, t, vol = 0.055) {
    [[1, 1, 1.8], [2, 0.25, 0.7], [3, 0.08, 0.4]].forEach(([mult, part, ring]) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = hz(midi) * mult;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol * part, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + ring);
      o.connect(g).connect(out);
      o.start(t);
      o.stop(t + ring + 0.05);
    });
  }

  // A bubble pop: a tiny note that slides quickly upwards, the way a rising bubble sounds.
  function bubble(t, vol = 0.03) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const from = 380 + Math.random() * 500;
    const len = 0.035 + Math.random() * 0.04;
    o.type = "sine";
    o.frequency.setValueAtTime(from, t);
    o.frequency.exponentialRampToValueAtTime(from * (2.2 + Math.random()), t + len);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(g).connect(out);
    o.start(t);
    o.stop(t + len + 0.02);
  }

  // Waves: soft filtered noise that swells and falls back, about once per chord.
  function startWaves(t) {
    const len = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }  // brown noise
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 520;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    src.connect(tone).connect(g).connect(level);
    src.start(t);
    waves = { src, g };
  }
  function swell(t, len) {
    if (!waves) return;
    const g = waves.g.gain;
    g.setValueAtTime(0.012, t);
    g.linearRampToValueAtTime(0.07, t + len * 0.4);
    g.linearRampToValueAtTime(0.012, t + len);
  }

  // Plan one beat: a new chord (and wave) every 8 beats, and sometimes a note of the tune.
  function playBeat(t) {
    if (beat % BEATS_PER_CHORD === 0 && nextMood) { mood = nextMood; nextMood = null; }
    const kind = mood.minor ? "minor" : "major";
    if (beat % BEATS_PER_CHORD === 0) {
      const len = mood.beat * BEATS_PER_CHORD;
      CHORDS[kind][chord % 4].forEach((n) => pad(mood.root - 12 + n, t, len));
      swell(t, len);
      chord++;
    }
    const scale = SCALE[kind];
    const inChord = beat % BEATS_PER_CHORD;
    // The tune rests more than it plays, and always rests on the last beat of a chord.
    if (inChord !== BEATS_PER_CHORD - 1 && Math.random() < (inChord % 2 ? 0.35 : 0.65)) {
      step = Math.max(0, Math.min(11, step + [-2, -1, -1, 0, 1, 1, 2][Math.floor(Math.random() * 7)]));
      const note = mood.root + 12 * Math.floor(step / 5) + scale[step % 5];
      pluck(note, t);
      if (Math.random() < 0.18) {  // now and then, a quick second note
        const up = Math.min(11, step + 1);
        pluck(mood.root + 12 * Math.floor(up / 5) + scale[up % 5], t + mood.beat / 2, 0.04);
      }
    }
    // Now and then, a few bubbles rise past: one to four pops close together, somewhere in the beat.
    if (Math.random() < 0.22) {
      let at = t + Math.random() * mood.beat;
      for (let i = 0, n = 1 + Math.floor(Math.random() * 4); i < n; i++) {
        bubble(at, 0.012 + Math.random() * 0.02);
        at += 0.06 + Math.random() * 0.14;
      }
    }
    beat++;
  }

  function schedule() {
    while (beatAt < ctx.currentTime + 0.8) {
      playBeat(beatAt);
      beatAt += mood.beat;
    }
  }

  return {
    // Start, given the app's AudioContext (it must already have been unlocked by a tap on iPad and iPhone).
    start(c) {
      if (playing) return;
      if (!ctx) build(c);
      playing = true;
      beat = 0;
      const t = ctx.currentTime + 0.1;
      beatAt = t;
      startWaves(t);
      level.gain.cancelScheduledValues(t);
      level.gain.setValueAtTime(0, t);
      level.gain.linearRampToValueAtTime(VOLUME * levelNow, t + 3);
      schedule();
      timer = setInterval(schedule, 200);
    },
    stop() {
      if (!playing) return;
      playing = false;
      clearInterval(timer);
      const t = ctx.currentTime;
      level.gain.cancelScheduledValues(t);
      level.gain.setValueAtTime(level.gain.value, t);
      level.gain.linearRampToValueAtTime(0, t + 0.8);
      if (waves) { waves.src.stop(t + 1); waves = null; }
    },
    get playing() { return playing; },
    // Change key at the next chord, so the music never jumps mid-phrase.
    mood(key) { nextMood = MOODS[key] || MOODS.home; },
    // Quieter while she's writing (0 to 1).
    level(x) {
      levelNow = x;
      if (!playing) return;
      const t = ctx.currentTime;
      level.gain.cancelScheduledValues(t);
      level.gain.setValueAtTime(level.gain.value, t);
      level.gain.linearRampToValueAtTime(VOLUME * x, t + 0.6);
    },
    // Dip under the voice for a few seconds, then come back.
    duck(secs) {
      if (!playing) return;
      const t = ctx.currentTime;
      level.gain.cancelScheduledValues(t);
      level.gain.setValueAtTime(level.gain.value, t);
      level.gain.linearRampToValueAtTime(VOLUME * levelNow * 0.25, t + 0.15);
      level.gain.setValueAtTime(VOLUME * levelNow * 0.25, t + secs);
      level.gain.linearRampToValueAtTime(VOLUME * levelNow, t + secs + 1.2);
    },
    // For tools: plan a whole stretch at once (used to render a listening sample offline).
    renderInto(c, key, seconds) {
      build(c);
      mood = MOODS[key] || MOODS.home;
      level.gain.value = VOLUME;
      startWaves(0);
      beatAt = 0.05;
      while (beatAt < seconds) { playBeat(beatAt); beatAt += mood.beat; }
    },
  };
})();
