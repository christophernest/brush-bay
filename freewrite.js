/* Brush Bay: checking free writing (practice mode's last round).
   She writes a character at any size and anywhere in the box, and each stroke is still checked: its shape,
   direction and order, and (from the second stroke on) where it sits compared with the strokes she has already
   written. The first stroke sets her size and position, and every accepted stroke refines it.
   Kept apart from app.js so tools/check_freewrite.mjs can test it on every character. */
(() => {
  "use strict";
  const N = 24;  // points each stroke is resampled to

  function pathLength(pts) {
    let n = 0;
    for (let i = 1; i < pts.length; i++) n += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    return n;
  }
  // N points evenly spaced along the stroke.
  function resample(pts, n = N) {
    const d = [0];
    for (let i = 1; i < pts.length; i++) d.push(d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const total = d[d.length - 1] || 1, out = [];
    for (let k = 0, j = 0; k < n; k++) {
      const at = (total * k) / (n - 1);
      while (j < d.length - 2 && d[j + 1] < at) j++;
      const f = d[j + 1] > d[j] ? (at - d[j]) / (d[j + 1] - d[j]) : 0;
      const a = pts[j], b = pts[Math.min(j + 1, pts.length - 1)];
      out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
    }
    return out;
  }
  // The scale and shift (no turning) that best lays her points onto the character's, with the scale kept in range.
  // Each pair can carry a weight (default 1), so strokes already accepted can count for more than a new one.
  function fit(pairs, sMin, sMax) {
    let n = 0, ux = 0, uy = 0, mx = 0, my = 0;
    for (const [u, m, w = 1] of pairs) u.forEach((p, i) => { n += w; ux += w * p[0]; uy += w * p[1]; mx += w * m[i][0]; my += w * m[i][1]; });
    ux /= n; uy /= n; mx /= n; my /= n;
    let num = 0, den = 0;
    for (const [u, m, w = 1] of pairs) u.forEach((p, i) => {
      num += w * ((p[0] - ux) * (m[i][0] - mx) + (p[1] - uy) * (m[i][1] - my));
      den += w * ((p[0] - ux) ** 2 + (p[1] - uy) ** 2);
    });
    const s = Math.max(sMin, Math.min(sMax, den ? num / den : sMax));
    return { s, tx: mx - s * ux, ty: my - s * uy };
  }
  const meanErr = (u, m, f) => u.reduce((n, p, i) => n + Math.hypot(f.s * p[0] + f.tx - m[i][0], f.s * p[1] + f.ty - m[i][1]), 0) / u.length;

  // A judge for one character written in a box `size` pixels wide.
  function judge(char, size, strict) {
    // The character's strokes in Hanzi Writer's 1024 box, the right way up (y down, as on screen).
    const medians = CHAR_DATA[char].medians.map((m) => m.map(([x, y]) => [x, 900 - y]));
    const targets = medians.map((m) => resample(m));
    const lens = medians.map(pathLength);
    const margin = size * 0.07, s0 = 1024 / (size - 2 * margin);  // s0: the character filling the box
    const sMin = s0 / 1.25, sMax = s0 / 0.3;  // from a bit bigger than the box to about a third of it
    const tol = (strict ? 0.1 : 0.14) * 1024;     // how far, on average, a stroke may be from where it belongs
    const posTol = (strict ? 0.11 : 0.15) * 1024;  // how far its middle may be from where it belongs
    const accepted = [];
    return {
      strokes: targets.length,
      // Does this stroke (screen points) fit as stroke k, given the strokes accepted so far?
      fits(pts, k) {
        const u = resample(pts), m = targets[k];
        // Her strokes so far count three times as much as the new one, so a stroke in the wrong place can't pull
        // her size and position over to suit itself.
        const f = fit([...accepted.map(([a, b]) => [a, b, 3]), [u, m, 1]], sMin, sMax);
        if (meanErr(u, m, f) >= tol || !accepted.every(([a, b]) => meanErr(a, b, f) < tol)) return false;
        // Where it sits: laid over the character by her strokes so far alone (once they're long enough to show her
        // size), its middle must land near the right stroke's middle.
        if (accepted.reduce((n, [, b]) => n + pathLength(b), 0) > 200) {
          const fp = fit(accepted, sMin, sMax), mid = (q) => q.reduce((n, p) => [n[0] + p[0] / N, n[1] + p[1] / N], [0, 0]);
          const cu = mid(u), cm = mid(m);
          if (Math.hypot(fp.s * cu[0] + fp.tx - cm[0], fp.s * cu[1] + fp.ty - cm[1]) >= posTol) return false;
        }
        // For strokes long enough to have a shape (not dots): on its own it must match the right stroke's shape
        // (laid over it at any size), point the same way (within about 35 degrees), and be about the right length.
        if (lens[k] > 150) {
          const du = [u[N - 1][0] - u[0][0], u[N - 1][1] - u[0][1]], dm = [m[N - 1][0] - m[0][0], m[N - 1][1] - m[0][1]];
          const cos = (du[0] * dm[0] + du[1] * dm[1]) / (Math.hypot(...du) * Math.hypot(...dm) || 1);
          const ratio = (pathLength(pts) * f.s) / lens[k];
          const alone = fit([[u, m]], s0 / 3, s0 * 3);
          if (cos <= (strict ? 0.85 : 0.8) || ratio <= 0.45 || ratio >= 2.2) return false;
          if (meanErr(u, m, alone) / lens[k] >= (strict ? 0.15 : 0.2)) return false;
        }
        return true;
      },
      add(pts, k) { accepted.push([resample(pts), targets[k]]); },
      // Stroke k drawn where it belongs at her size and position so far (screen points), for after 4 misses.
      place(k) {
        const f = accepted.length ? fit(accepted, sMin, sMax) : { s: s0, tx: -margin * s0, ty: -margin * s0 };
        return medians[k].map(([x, y]) => [(x - f.tx) / f.s, (y - f.ty) / f.s]);
      },
    };
  }

  window.FreeWriting = { judge, pathLength };
})();
