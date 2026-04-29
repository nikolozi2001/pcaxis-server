/**
 * Generates favicon.ico (16x16 + 32x32) — bar chart on blue background
 * Run: node scripts/generate-favicon.js
 */
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Design helpers ──────────────────────────────────────────────────────────

const BLUE   = { r: 37,  g: 99,  b: 235, a: 255 }; // #2563eb
const WHITE  = { r: 255, g: 255, b: 255, a: 255 };
const TRANSP = { r: 0,   g: 0,   b: 0,   a: 0   };

/** Returns true if (x,y) is inside a rounded-corner zone of an N×N image */
function isCorner(x, y, n, r = 2) {
  return (x < r      && y < r      && Math.hypot(x - r + 1,     y - r + 1)     > r) ||
         (x >= n - r && y < r      && Math.hypot(x - (n - r),   y - r + 1)     > r) ||
         (x < r      && y >= n - r && Math.hypot(x - r + 1,     y - (n - r))   > r) ||
         (x >= n - r && y >= n - r && Math.hypot(x - (n - r),   y - (n - r))   > r) ;
}

/**
 * Bar-chart pixel function — works for any square size N.
 * Three white bars of ascending height on a blue background.
 * y=0 is visual TOP.
 */
function pixelFn(x, y, n) {
  if (isCorner(x, y, n, Math.max(2, Math.round(n / 8)))) return TRANSP;

  const pad    = Math.round(n * 0.08);   // ~1px on 16, ~3px on 32
  const bottom = n - 1 - pad;            // baseline y (visual)
  const bw     = Math.round(n * 0.25);   // bar width  (~4px on 16, ~8px on 32)
  const gap    = Math.round(n * 0.125);  // gap between bars (~2px / ~4px)

  const bars = [
    { x0: pad,                 h: Math.round(n * 0.50) }, // left  — 50% height
    { x0: pad + bw + gap,      h: Math.round(n * 0.75) }, // mid   — 75% height
    { x0: pad + 2*(bw + gap),  h: Math.round(n * 0.94) }, // right — full height
  ];

  for (const bar of bars) {
    const x1 = bar.x0 + bw - 1;
    const y0 = bottom - bar.h + 1; // visual top of bar
    if (x >= bar.x0 && x <= x1 && y >= y0 && y <= bottom) return WHITE;
  }

  return BLUE;
}

// ── ICO builder ─────────────────────────────────────────────────────────────

function buildBMPImage(size) {
  const pixelBytes  = size * size * 4;                               // 32bpp BGRA
  const maskRowSize = Math.ceil(Math.ceil(size / 8) / 4) * 4;       // AND mask, 4-byte aligned
  const maskBytes   = maskRowSize * size;
  const total       = 40 + pixelBytes + maskBytes;
  const buf         = Buffer.alloc(total, 0);
  let   off         = 0;

  // BITMAPINFOHEADER
  buf.writeUInt32LE(40, off);        off += 4;
  buf.writeInt32LE(size, off);       off += 4;
  buf.writeInt32LE(size * 2, off);   off += 4; // height × 2 (includes AND mask)
  buf.writeUInt16LE(1, off);         off += 2; // planes
  buf.writeUInt16LE(32, off);        off += 2; // bpp
  off += 24; // compression, imageSize, ppm×2, clrUsed, clrImportant → all zero

  // XOR (colour) data — BMP is bottom-up
  for (let y = size - 1; y >= 0; y--) {
    for (let x = 0; x < size; x++) {
      const { r, g, b, a } = pixelFn(x, y, size);
      buf[off++] = b;
      buf[off++] = g;
      buf[off++] = r;
      buf[off++] = a;
    }
  }

  // AND mask — 0 = opaque (all zeros already)

  return buf;
}

function buildICO(sizes) {
  const images  = sizes.map(buildBMPImage);
  const dirSize = sizes.length * 16;
  const fileHdr = 6;
  const dataStart = fileHdr + dirSize;
  let   dataOffset = dataStart;

  const parts = [Buffer.alloc(fileHdr + dirSize, 0)];

  // File header
  const hdr = parts[0];
  hdr.writeUInt16LE(0, 0);             // reserved
  hdr.writeUInt16LE(1, 2);             // type: ICO
  hdr.writeUInt16LE(sizes.length, 4);  // count

  sizes.forEach((size, i) => {
    const img      = images[i];
    const dirOff   = fileHdr + i * 16;
    hdr.writeUInt8(size === 256 ? 0 : size, dirOff);      // width  (0 = 256)
    hdr.writeUInt8(size === 256 ? 0 : size, dirOff + 1);  // height
    hdr.writeUInt8(0, dirOff + 2);     // colour count
    hdr.writeUInt8(0, dirOff + 3);     // reserved
    hdr.writeUInt16LE(1, dirOff + 4);  // planes
    hdr.writeUInt16LE(32, dirOff + 6); // bpp
    hdr.writeUInt32LE(img.length, dirOff + 8);
    hdr.writeUInt32LE(dataOffset, dirOff + 12);
    dataOffset += img.length;
    parts.push(img);
  });

  return Buffer.concat(parts);
}

// ── Generate & save ─────────────────────────────────────────────────────────

const ico  = buildICO([16, 32]);
const dest = resolve(__dirname, '..', 'favicon.ico');
writeFileSync(dest, ico);
console.log(`✅  favicon.ico written to ${dest}  (${ico.length} bytes, 16×16 + 32×32)`);
