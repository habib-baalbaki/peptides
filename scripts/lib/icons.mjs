/*
 * Site icons, drawn from one shape list (a simplified assets/img/vial.svg on the
 * brand's dark ink) and emitted as SVG, PNG and ICO with no dependencies.
 * Output is deterministic, so rebuilding never changes the files.
 */
import zlib from "node:zlib";

const INK = "#111316";
// 64x64 design grid. r = corner radius.
const VIAL = [
  { x: 23, y: 7, w: 18, h: 9, r: 2.5, fill: "#c9ccd1" },   // cap
  { x: 26, y: 15, w: 12, h: 6, r: 0, fill: "#dfe2e6" },    // neck
  { x: 16, y: 20, w: 32, h: 38, r: 7, fill: "#ffffff" },   // body
  { x: 16, y: 32, w: 32, h: 13, r: 0, fill: "#9aa0a8" }    // label
];
const shapes = (rounded) => [{ x: 0, y: 0, w: 64, h: 64, r: rounded ? 14 : 0, fill: INK }, ...VIAL];

export function svg() {
  const rect = (s) => `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}"${s.r ? ` rx="${s.r}"` : ""} fill="${s.fill}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${shapes(true).map(rect).join("")}</svg>\n`;
}

/* ---------- rasteriser: rounded rects, 4x4 supersampling ---------- */
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

function inside(s, x, y) {
  if (x < s.x || y < s.y || x > s.x + s.w || y > s.y + s.h) return false;
  if (!s.r) return true;
  const cx = Math.min(Math.max(x, s.x + s.r), s.x + s.w - s.r);
  const cy = Math.min(Math.max(y, s.y + s.r), s.y + s.h - s.r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= s.r ** 2;
}

function raster(size, rounded) {
  const SS = 4, k = 64 / size, px = new Float64Array(size * size * 4); // premultiplied RGBA 0..1
  for (const s of shapes(rounded)) {
    const [r, g, b] = hex(s.fill).map((v) => v / 255);
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      let hit = 0;
      for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++)
        if (inside(s, (x + (sx + 0.5) / SS) * k, (y + (sy + 0.5) / SS) * k)) hit++;
      if (!hit) continue;
      const a = hit / (SS * SS), i = (y * size + x) * 4;
      px[i] = r * a + px[i] * (1 - a);
      px[i + 1] = g * a + px[i + 1] * (1 - a);
      px[i + 2] = b * a + px[i + 2] * (1 - a);
      px[i + 3] = a + px[i + 3] * (1 - a);
    }
  }
  return px;
}

const CRC = new Int32Array(256).map((_, n) => { for (let k = 0; k < 8; k++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1; return n; });
const crc32 = (buf) => { let c = -1; for (const b of buf) c = CRC[(c ^ b) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

export function png(size, { rounded = true } = {}) {
  const px = raster(size, rounded);
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4, o = y * (size * 4 + 1) + 1 + x * 4, a = px[i + 3];
      for (let c = 0; c < 3; c++) raw[o + c] = a ? Math.round((px[i + c] / a) * 255) : 0;
      raw[o + 3] = Math.round(a * 255);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

/* ICO with embedded PNGs (supported by every current browser) */
export function ico(sizes = [16, 32, 48]) {
  const imgs = sizes.map((s) => png(s));
  const head = Buffer.alloc(6 + 16 * sizes.length);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(sizes.length, 4);
  let offset = head.length;
  sizes.forEach((s, n) => {
    const e = 6 + 16 * n;
    head[e] = s; head[e + 1] = s; head[e + 2] = 0; head[e + 3] = 0;
    head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(imgs[n].length, e + 8); head.writeUInt32LE(offset, e + 12);
    offset += imgs[n].length;
  });
  return Buffer.concat([head, ...imgs]);
}
