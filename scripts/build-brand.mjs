// Favicon set + social share image from the Nightfall globe.
//   node scripts/build-brand.mjs
import { writeFile, unlink, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import sharp from "sharp";

const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#0a0a0a"/>
  <g fill="none" stroke="#f3f3f0" stroke-width="3.2" stroke-linecap="round">
    <circle cx="32" cy="32" r="21"/>
    <ellipse cx="32" cy="32" rx="21" ry="8" transform="rotate(-18 32 32)"/>
    <ellipse cx="32" cy="32" rx="8.5" ry="21" transform="rotate(20 32 32)"/>
  </g>
  <circle cx="41.5" cy="41" r="3.6" fill="#ff3b14"/>
</svg>`;

await writeFile("src/app/icon.svg", ICON_SVG);
await sharp(Buffer.from(ICON_SVG)).resize(180, 180).png().toFile("src/app/apple-icon.png");

// favicon.ico with an embedded 48px PNG (valid in every browser)
const png48 = await sharp(Buffer.from(ICON_SVG)).resize(48, 48).png().toBuffer();
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
const entry = Buffer.alloc(16);
entry.writeUInt8(48, 0);
entry.writeUInt8(48, 1);
entry.writeUInt8(0, 2);
entry.writeUInt8(0, 3);
entry.writeUInt16LE(1, 4);
entry.writeUInt16LE(32, 6);
entry.writeUInt32LE(png48.length, 8);
entry.writeUInt32LE(22, 12);
if (existsSync("src/app/favicon.ico")) await unlink("src/app/favicon.ico");
await writeFile("src/app/favicon.ico", Buffer.concat([header, entry, png48]));

// Open Graph: the real logo on paper, with the REC horizon line
const logo = await sharp("media-src/images/logo-globe-black.webp").trim({ threshold: 10 }).resize({ width: 940, height: 430, fit: "inside" }).png().toBuffer();
const meta = await sharp(logo).metadata();
const OG_W = 1200;
const OG_H = 630;
const frame = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}">
  <rect width="100%" height="100%" fill="#f3f3f0"/>
  <rect x="0" y="${OG_H - 10}" width="${OG_W}" height="10" fill="#0a0a0a"/>
  <rect x="0" y="${OG_H - 12}" width="${OG_W}" height="2" fill="#ff3b14"/>
</svg>`);
await sharp(frame)
  .composite([{ input: logo, left: Math.round((OG_W - meta.width) / 2), top: Math.round((OG_H - meta.height) / 2) - 10 }])
  .jpeg({ quality: 88 })
  .toFile("public/og.jpg");

// The real logo lockup (globe + NIGHTFALL-WORLDWIDE), trimmed, for the header.
await mkdir("public/brand", { recursive: true });
for (const tone of ["black", "white"]) {
  await sharp(`media-src/brand/logo-globe-${tone}.webp`)
    .trim({ threshold: 10 })
    .resize({ height: 240, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(`public/brand/nightfall-logo-${tone}.png`);
}
// The "Nightfall will always come again" badge (white, for dark grounds).
await sharp("media-src/brand/badge-come-again.webp").trim({ threshold: 10 }).resize({ width: 720 }).png({ compressionLevel: 9 }).toFile("public/brand/nightfall-badge-white.png");
// Official Spotify wordmark, used beside the lifetime-streams figure (as on the original site).
await sharp("media-src/brand/spotify-logo-black.webp").trim({ threshold: 10 }).resize({ height: 72 }).png({ compressionLevel: 9 }).toFile("public/brand/spotify-logo-black.png");
for (const f of ["nightfall-logo-black.png", "nightfall-logo-white.png", "nightfall-badge-white.png", "spotify-logo-black.png"]) {
  const m = await sharp(`public/brand/${f}`).metadata();
  console.log(`  brand/${f}  ${m.width}x${m.height}`);
}

console.log("brand assets written: icon.svg, apple-icon.png, favicon.ico, public/og.jpg, public/brand/*");
