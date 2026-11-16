// Shared drawing helpers for every shot. Everything here depends only on its arguments,
// so a page's picture depends only on t.
export const W = 1920, H = 1080;
export const C = {
  cyan: "#3fd8ff", amber: "#ffb347", coral: "#ff6b6b", violet: "#9b7bff",
  green: "#4fe0a0", white: "#eef6fb", grey: "#8c98a6", red: "#d8394a", blue: "#4f8bff",
};

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, u) => a + (b - a) * u;
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const ease = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
export const easeOut = (u) => 1 - Math.pow(1 - u, 3);
export const easeIn = (u) => u * u * u;
export const bump = (u) => Math.sin(Math.PI * clamp(u)); // 0 → 1 → 0

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The shot's length: film.html passes it as ?d=, so the shot can be retimed to its voice-over.
export function duration(def) {
  const v = new URLSearchParams(location.search).get("d");
  return v ? +v : def;
}

export function canvas() {
  const c = document.getElementById("c");
  c.width = W; c.height = H;
  return c.getContext("2d");
}

export function rgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
}
export function shade(hex, k, a = 1) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.round(clamp(k >= 0 ? v + (255 - v) * k : v * (1 + k), 0, 255));
  return `rgba(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)},${a})`;
}

// Deep void with drifting dust.
export function background(ctx, t, seed = 1, tint = C.cyan, glowAt = [0.5, 0.45]) {
  const g = ctx.createRadialGradient(W * glowAt[0], H * glowAt[1], 0, W * 0.5, H * 0.5, W * 0.8);
  g.addColorStop(0, "#0c1726");
  g.addColorStop(0.55, "#060b14");
  g.addColorStop(1, "#020308");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  const r = rng(seed);
  for (let i = 0; i < 90; i++) {
    const x0 = r() * W, y0 = r() * H, s = r() * 2.4 + 0.4, sp = r() * 12 + 3, ph = r() * 6.28, a = 0.05 + 0.2 * r();
    const x = (((x0 + t * sp) % (W + 40)) + W + 40) % (W + 40) - 20;
    const y = y0 + Math.sin(t * 0.25 + ph) * 24;
    ctx.fillStyle = rgba(i % 6 ? tint : C.amber, a);
    ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill();
  }
}

// A glowing, shaded atom.
export function sphere(ctx, x, y, r, col, alpha = 1, glow = 0.6) {
  if (r <= 0.3 || alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  if (glow > 0) {
    const h = ctx.createRadialGradient(x, y, r * 0.6, x, y, r * 2.6);
    h.addColorStop(0, rgba(col, 0.32 * glow));
    h.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = h;
    ctx.beginPath(); ctx.arc(x, y, r * 2.6, 0, 7); ctx.fill();
  }
  const b = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.05, x, y, r);
  b.addColorStop(0, shade(col, 0.85));
  b.addColorStop(0.35, shade(col, 0.15));
  b.addColorStop(0.85, shade(col, -0.45));
  b.addColorStop(1, shade(col, -0.7));
  ctx.fillStyle = b;
  ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  ctx.restore();
}

// A glowing bond between two points.
export function bond(ctx, x1, y1, x2, y2, w, col, alpha = 1) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.lineCap = "round";
  ctx.strokeStyle = rgba(col, 0.18);
  ctx.lineWidth = w * 3.2;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.strokeStyle = shade(col, 0.35, 0.95);
  ctx.lineWidth = w;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.restore();
}

// Perspective camera: rotate by yaw (y axis) and pitch (x axis), then project.
export function camera({ yaw = 0, pitch = 0, dist = 1400, f = 1400, cx = W / 2, cy = H / 2, scale = 1 } = {}) {
  const cy_ = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  return ([x, y, z]) => {
    const x1 = x * cy_ + z * sy, z1 = -x * sy + z * cy_;
    const y1 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
    const k = (f / (dist + z2)) * scale;
    return { x: cx + x1 * k, y: cy + y1 * k, k, z: z2 };
  };
}

// A chain of beads along points [{x,y,r,col,a}], with bonds between neighbours.
export function beads(ctx, pts, bondCol = C.white, bondW = 6) {
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    bond(ctx, a.x, a.y, b.x, b.y, bondW * ((a.r + b.r) / 2 / 20), b.bondCol || bondCol, Math.min(a.a ?? 1, b.a ?? 1) * (b.bondA ?? 1));
  }
  for (const p of pts) sphere(ctx, p.x, p.y, p.r, p.col, p.a ?? 1, p.glow ?? 0.7);
}

// Place a DOM label; it stays editable in Studio.
export function place(el, x, y, opacity = 1, scale = 1) {
  if (!el) return;
  el.style.left = x + "px";
  el.style.top = y + "px";
  el.style.opacity = clamp(opacity).toFixed(3);
  el.style.transform = `translate(-50%, -50%) scale(${scale})`;
}
export const show = (el, opacity) => { if (el) el.style.opacity = clamp(opacity).toFixed(3); };

// Fade a label in at [a, a+0.6] and out at [b-0.6, b] (seconds).
export const inOut = (t, a, b, f = 0.6) => Math.min(seg(t, a, a + f), 1 - seg(t, b - f, b));

// Each shot fades up from black and back down; the chapter marker rides with it.
export function frameFade(t, d, fin = 0.7, fout = 0.7) {
  const v = 1 - Math.min(seg(t, 0, fin), 1 - seg(t, d - fout, d));
  const el = document.getElementById("fade");
  if (el) el.style.opacity = v.toFixed(3);
  show(document.querySelector(".chapter"), inOut(t, 0.6, d - 0.4, 0.8) * 0.9);
}

// Everything a page waits on before its first frame.
export const fontsReady = () => document.fonts.ready.then(() => new Promise((r) => setTimeout(r, 50)));

// A protein: one long chain folded into a compact 3D tangle with helical stretches.
export function proteinPath(M = 560) {
  const out = [];
  for (let i = 0; i < M; i++) {
    const u = i / (M - 1);
    let x = 105 * Math.sin(u * 47.3) + 70 * Math.sin(u * 83.1 + 1.3) + 40 * Math.cos(u * 131.7);
    let y = 105 * Math.cos(u * 41.7 + 0.4) + 70 * Math.sin(u * 77.4) + 40 * Math.sin(u * 119.9 + 2);
    let z = 105 * Math.sin(u * 53.9 + 2.1) + 70 * Math.cos(u * 89.2) + 40 * Math.cos(u * 107.1 + 1);
    const helix = Math.sin(u * 6.28 * 9) > 0.3 ? 1 : 0;
    x += helix * 16 * Math.cos(u * 420); y += helix * 16 * Math.sin(u * 420);
    out.push([x, y, z, u]);
  }
  return out;
}
export function ribbon(ctx, path, cam, { grow = 1, alpha = 1, width = 18, cols = [C.violet, C.blue, C.cyan] } = {}) {
  if (alpha <= 0) return;
  const P = path.map((p) => ({ ...cam(p), u: p[3] }));
  const n = Math.max(2, Math.floor(grow * P.length));
  const segs = [];
  for (let i = 1; i < n; i++) segs.push([P[i - 1], P[i], (P[i - 1].z + P[i].z) / 2]);
  segs.sort((a, b) => b[2] - a[2]);
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.lineCap = "round";
  for (const [a, b, z] of segs) {
    const depth = clamp((300 - z) / 600);
    const col = cols[Math.min(cols.length - 1, Math.floor(a.u * cols.length))];
    // a dark rim, a body and a highlight: reads as a tube
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = "rgba(2,4,10,.9)"; ctx.lineWidth = width * a.k + 5; ctx.stroke();
    ctx.strokeStyle = shade(col, lerp(-0.6, 0.15, depth), 1); ctx.lineWidth = width * a.k; ctx.stroke();
    ctx.strokeStyle = shade(col, lerp(-0.2, 0.6, depth), 0.9); ctx.lineWidth = width * a.k * 0.3; ctx.stroke();
  }
  ctx.restore();
}

// Retime a shot to its voice-over: points are [designed second, spoken second] pairs, in order.
// Beats written in designed seconds land on the words; between points, time stretches evenly.
export function warp(points) {
  return (s) => {
    if (s <= points[0][0]) return points[0][1] + (s - points[0][0]);
    for (let i = 1; i < points.length; i++) {
      const [a0, b0] = points[i - 1], [a1, b1] = points[i];
      if (s <= a1) return b0 + ((s - a0) / (a1 - a0)) * (b1 - b0);
    }
    const [a, b] = points[points.length - 1];
    return b + (s - a);
  };
}
