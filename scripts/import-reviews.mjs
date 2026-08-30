#!/usr/bin/env node
/**
 * Turn reviews copied out of a Google Business profile into public/reviews.json.
 *
 * Copy the reviews from your profile (or the Google Maps listing) into a plain
 * text file — one review after another, roughly like this:
 *
 *   Maria Lopez
 *   5 stars · 2 weeks ago
 *   They worked with my credit when two other dealers would not…
 *
 *   James T.
 *   ★★★★★  3 months ago
 *   Straightforward people. No pressure, the price was the price…
 *
 * Blank lines separate the reviews. The first line of a block is the name, a
 * line with stars or "N stars" gives the rating and anything date-ish on it
 * becomes the date, and the rest is the review text.
 *
 *   node scripts/import-reviews.mjs reviews.txt
 *   node scripts/import-reviews.mjs reviews.txt --rating 4.9 --count 63
 */
import fs from "node:fs";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const flag = (n) => { const i = args.indexOf(`--${n}`); return i > -1 ? args[i + 1] : null; };

if (!file) {
  console.error("usage: node scripts/import-reviews.mjs <reviews.txt> [--rating 4.9] [--count 63] [--source Google]");
  process.exit(1);
}

const source = flag("source") || "Google";
const raw = fs.readFileSync(file, "utf8").replace(/\r/g, "");
const blocks = raw.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

const DATEISH = /(\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b|\b\d+\s+(?:day|week|month|year)s?\s+ago\b|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}\b)/i;
const STARS = /(★+)|(\b([1-5])(?:\.\d)?\s*(?:stars?|\/\s*5)\b)/i;

const reviews = [];
for (const block of blocks) {
  const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) continue;

  const name = lines.shift();
  let rating = 5;
  let date = "";
  const body = [];

  for (const line of lines) {
    const st = line.match(STARS);
    const dt = line.match(DATEISH);
    if (st || (dt && line.length < 40)) {
      if (st) rating = st[1] ? st[1].length : Number(st[3]);
      if (dt) date = dt[0];
      // a line that is only rating/date metadata isn't part of the text
      const stripped = line.replace(STARS, "").replace(DATEISH, "").replace(/[·•|,\-–—\s]/g, "");
      if (!stripped) continue;
    }
    body.push(line);
  }

  const text = body.join(" ").replace(/\s+/g, " ").trim();
  if (!text) continue;
  reviews.push({ name, rating, date, source, text });
}

if (!reviews.length) {
  console.error("No reviews parsed — check that reviews are separated by a blank line.");
  process.exit(1);
}

const rating = flag("rating");
const count = flag("count");
const out = rating
  ? { rating: Number(rating), count: count ? Number(count) : reviews.length, reviews }
  : reviews;

fs.writeFileSync("public/reviews.json", JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote public/reviews.json — ${reviews.length} reviews${rating ? `, headline rating ${rating}` : ""}.`);
reviews.forEach((r) => console.log(`  ${"★".repeat(r.rating)} ${r.name}${r.date ? ` (${r.date})` : ""}`));
