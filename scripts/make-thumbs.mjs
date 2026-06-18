// make-thumbs.mjs — generate small grid thumbnails into public/assets/cars/thumb/
// The full images stay for the detail-page gallery; the inventory/home grids
// load these much smaller versions, so scrolling is fast and light.
//
// Run with: npm run make-thumbs
import { readdir, stat, mkdir } from "node:fs/promises";
import { join, extname } from "node:path";
import sharp from "sharp";

const SRC = "public/assets/cars";
const OUT = "public/assets/cars/thumb";
const WIDTH = 480; // grid cards never display wider than this
const QUALITY = 64;

const isImage = (f) => /\.(jpe?g|png)$/i.test(f);

async function run() {
  await mkdir(OUT, { recursive: true });
  const files = (await readdir(SRC)).filter(isImage);
  let out = 0;
  let done = 0;

  for (const file of files) {
    const src = join(SRC, file);
    const dst = join(OUT, file.replace(/\.png$/i, ".jpg")); // thumbs always jpg
    try {
      await sharp(src)
        .rotate()
        .resize({ width: WIDTH, withoutEnlargement: true })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(dst);
      out += (await stat(dst)).size;
      done++;
      if (done % 100 === 0) console.log(`  …${done}/${files.length}`);
    } catch (err) {
      console.error(`! ${file}: ${err.message}`);
    }
  }

  const mb = (b) => (b / 1024 / 1024).toFixed(1);
  console.log(`\nDone. ${done} thumbnails → ${OUT}`);
  console.log(`Total thumbnail size: ${mb(out)} MB`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
