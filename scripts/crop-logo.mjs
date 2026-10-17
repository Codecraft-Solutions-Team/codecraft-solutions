// One-off: derive clean brand assets from the ORIGINAL logo pixels (crop only, never redraw).
import sharp from "sharp";

const src = "public/brand/codecraft-logo.png";
const meta = await sharp(src).metadata();
const W = meta.width;
const H = meta.height;
const out = (name) => `public/brand/${name}`;
const px = (frac, dim) => Math.round(frac * dim);

async function extractTrim(region, name) {
  const buf = await sharp(src).extract(region).toBuffer();
  await sharp(buf).trim({ background: "#000000", threshold: 18 }).toFile(out(name));
}

// Tightly trimmed full lockup (mark + wordmark + tagline).
await sharp(src).trim({ background: "#000000", threshold: 18 }).toFile(out("logo-trimmed.png"));

// The bracket mark only (favicon / nav icon / accents).
await extractTrim(
  { left: px(0.215, W), top: px(0.145, H), width: px(0.57, W), height: px(0.4, H) },
  "logo-mark.png"
);

// Lockup without the tagline (mark + CODECRAFT SOLUTIONS) — for nav/footer.
// Generate candidates to pick the best bottom cut.
for (const h of [0.6, 0.63, 0.66]) {
  await extractTrim(
    { left: px(0.05, W), top: px(0.14, H), width: px(0.9, W), height: px(h, H) },
    `logo-lockup-${Math.round(h * 100)}.png`
  );
}

for (const f of ["logo-trimmed.png", "logo-mark.png", "logo-lockup-60.png", "logo-lockup-63.png", "logo-lockup-66.png"]) {
  const m = await sharp(out(f)).metadata();
  console.log(f, `${m.width}x${m.height}`);
}
