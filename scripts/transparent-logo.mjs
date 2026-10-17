// Turn the black-background crops into clean transparent PNGs.
// The logo art is bright on black, so per-pixel alpha = max(r,g,b) cleanly
// drops the black while keeping smooth anti-aliased edges. Works on any surface.
import sharp from "sharp";

async function toTransparent(input, output) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const max = Math.max(data[i], data[i + 1], data[i + 2]);
    // Lift midtones slightly so the bright strokes read as fully opaque.
    data[i + 3] = Math.min(255, Math.round(max * 1.18));
  }
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(output);
  const m = await sharp(output).metadata();
  console.log(`${output} ${m.width}x${m.height} (alpha)`);
}

await toTransparent("public/brand/logo-mark.png", "public/brand/logo-mark-t.png");
await toTransparent("public/brand/logo-lockup.png", "public/brand/logo-lockup-t.png");
