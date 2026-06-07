// optimize-images.mjs — recompress + cap dimensions of car photos in place.
// Originals are preserved in ./cars_original_backup (gitignored).
//
// Run with: npm run optimize-images
import { readdir, stat, rename, unlink } from "node:fs/promises";
import { join, extname } from "node:path";
import sharp from "sharp";

const DIR = "public/assets/cars";
const MAX_WIDTH = 1000; // plenty for the detail view; grid shows much smaller
const QUALITY = 70;

const isImage = (f) => /\.(jpe?g|png)$/i.test(f);

async function run() {
  const files = (await readdir(DIR)).filter(isImage);
  let before = 0;
  let after = 0;
  let done = 0;

  for (const file of files) {
    const src = join(DIR, file);
    const tmp = join(DIR, `.tmp-${file}`);
    const { size: origSize } = await stat(src);
    before += origSize;

    try {
      const ext = extname(file).toLowerCase();
      let pipeline = sharp(src).rotate().resize({
        width: MAX_WIDTH,
        withoutEnlargement: true,
      });
      pipeline =
        ext === ".png"
          ? pipeline.png({ quality: QUALITY, compressionLevel: 9 })
          : pipeline.jpeg({ quality: QUALITY, mozjpeg: true });

      await pipeline.toFile(tmp);
      const { size: newSize } = await stat(tmp);

      // Keep whichever is smaller
      if (newSize < origSize) {
        await rename(tmp, src);
        after += newSize;
      } else {
        await unlink(tmp);
        after += origSize;
      }
      done++;
      if (done % 50 === 0) console.log(`  …${done}/${files.length}`);
    } catch (err) {
      console.error(`! ${file}: ${err.message}`);
      try { await unlink(tmp); } catch {}
      after += origSize;
    }
  }

  const mb = (b) => (b / 1024 / 1024).toFixed(1);
  console.log(`\nDone. ${files.length} images.`);
  console.log(`Before: ${mb(before)} MB → After: ${mb(after)} MB (saved ${mb(before - after)} MB)`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
