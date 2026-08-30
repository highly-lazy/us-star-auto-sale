#!/usr/bin/env node
/**
 * Compare a dealer feed (CarGurus / CARFAX export or a copy-pasted listing
 * page) against public/cars.json and report the drift:
 *
 *   • on the feed but missing from the site   → needs to be posted
 *   • available on the site but not on the feed → almost certainly sold
 *   • price / mileage that no longer agree
 *
 * CarGurus blocks automated fetching, so the feed has to be handed over as a
 * file. Both of these work:
 *
 *   CSV   — any headers containing year, make, model, price, mileage, vin, stock
 *   Paste — the listing page copied as plain text; lines like
 *           "2019 Mercedes-Benz GLS 450"  /  "$30,500"  /  "69,971 mi"
 *
 * Usage:
 *   node scripts/sync-inventory.mjs feed.csv
 *   node scripts/sync-inventory.mjs feed.txt --apply-sold   # mark the missing ones sold
 *   node scripts/sync-inventory.mjs feed.csv --emit-new     # write new-cars.json stubs
 */
import fs from "node:fs";
import path from "node:path";

const CARS = path.resolve("public/cars.json");
const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const APPLY_SOLD = args.includes("--apply-sold");
const EMIT_NEW = args.includes("--emit-new");

if (!file) {
  console.error("usage: node scripts/sync-inventory.mjs <feed.csv|feed.txt> [--apply-sold] [--emit-new]");
  process.exit(1);
}

const norm = (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const num = (s) => {
  const n = Number(String(s ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
};
// "2019 Mercedes-Benz GLS 450 Sport Utility 4D" → "2019 mercedes benz gls 450"
const key = (year, make, model) => `${year} ${norm(make)} ${norm(model).split(" ").slice(0, 3).join(" ")}`.trim();

function parseCSV(text) {
  const rows = text.trim().split(/\r?\n/).map((l) => l.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((c) => c.replace(/^"|"$/g, "").trim()));
  const head = rows.shift().map((h) => h.toLowerCase());
  const col = (...names) => head.findIndex((h) => names.some((n) => h.includes(n)));
  const iY = col("year"), iMk = col("make"), iMd = col("model", "trim"),
        iP = col("price"), iMi = col("mileage", "miles", "odometer"),
        iV = col("vin"), iS = col("stock");
  return rows.filter((r) => r.length > 1).map((r) => ({
    year: num(r[iY]),
    make: r[iMk] ?? "",
    model: r[iMd] ?? "",
    price: num(r[iP]),
    mileage: num(r[iMi]),
    vin: (r[iV] ?? "").toUpperCase(),
    stock: r[iS] ?? "",
  }));
}

// Free-form paste: a "YYYY Make Model" line starts a record; the price and
// mileage that follow before the next such line belong to it.
function parsePaste(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const start = /^((?:19|20)\d{2})\s+([A-Za-z][\w-]*)\s*(.*)$/;
  const out = [];
  let cur = null;
  for (const line of lines) {
    const m = line.match(start);
    if (m) {
      if (cur) out.push(cur);
      cur = { year: Number(m[1]), make: m[2], model: m[3] || "", price: null, mileage: null, vin: "", stock: "" };
      continue;
    }
    if (!cur) continue;
    const vin = line.match(/\b([A-HJ-NPR-Z0-9]{17})\b/);
    if (vin) cur.vin = vin[1];
    const mi = line.match(/([\d,]{3,})\s*(?:mi|miles)\b/i);
    if (mi && cur.mileage === null) cur.mileage = num(mi[1]);
    const pr = line.match(/\$\s?([\d,]{3,})/);
    if (pr && cur.price === null) cur.price = num(pr[1]);
  }
  if (cur) out.push(cur);
  return out;
}

const raw = fs.readFileSync(file, "utf8");
const feed = /,/.test(raw.split("\n")[0]) && /year|make|vin/i.test(raw.split("\n")[0])
  ? parseCSV(raw)
  : parsePaste(raw);

const cars = JSON.parse(fs.readFileSync(CARS, "utf8"));
const isSold = (c) => (c.status || "available") === "sold";

const byVin = new Map();
const byKey = new Map();
for (const c of cars) {
  if (c.vin) byVin.set(String(c.vin).toUpperCase(), c);
  const k = key(c.year, c.make, c.model);
  if (!byKey.has(k)) byKey.set(k, []);
  byKey.get(k).push(c);
}

const matchOf = (f) => {
  if (f.vin && byVin.has(f.vin)) return byVin.get(f.vin);
  const list = byKey.get(key(f.year, f.make, f.model)) || [];
  if (list.length === 1) return list[0];
  if (list.length > 1 && f.price) {
    return list.reduce((best, c) =>
      Math.abs((num(c.price) ?? 0) - f.price) < Math.abs((num(best.price) ?? 0) - f.price) ? c : best);
  }
  return list[0] || null;
};

const missing = [];   // on the feed, not on the site
const drift = [];     // matched but the numbers disagree
const matched = new Set();

for (const f of feed) {
  if (!f.year || !f.make) continue;
  const c = matchOf(f);
  if (!c) { missing.push(f); continue; }
  matched.add(String(c.id));
  const cp = num(c.price), cm = num(c.mileage);
  const notes = [];
  if (f.price && cp && Math.abs(f.price - cp) > 1) notes.push(`price site $${cp} → feed $${f.price}`);
  if (f.mileage && cm && Math.abs(f.mileage - cm) > 200) notes.push(`miles site ${cm} → feed ${f.mileage}`);
  if (isSold(c)) notes.push("site says SOLD but it is still on the feed");
  if (notes.length) drift.push({ c, notes });
}

const goneFromFeed = cars.filter((c) => !isSold(c) && !matched.has(String(c.id)));
const name = (c) => `${c.year} ${c.make} ${c.model}`.trim();

const line = "─".repeat(72);
console.log(`\nFeed rows parsed: ${feed.length}   Site records: ${cars.length}   Available on site: ${cars.filter((c) => !isSold(c)).length}`);

console.log(`\n${line}\n1. ON THE FEED, NOT ON THE SITE — needs to be posted (${missing.length})\n${line}`);
missing.forEach((f) => console.log(`  ${f.year} ${f.make} ${f.model}`.padEnd(52) + `${f.price ? "$" + f.price.toLocaleString() : "—"}  ${f.mileage ? f.mileage.toLocaleString() + " mi" : ""}  ${f.vin}`));
if (!missing.length) console.log("  (none)");

console.log(`\n${line}\n2. AVAILABLE ON THE SITE, GONE FROM THE FEED — likely sold (${goneFromFeed.length})\n${line}`);
goneFromFeed.forEach((c) => console.log(`  id ${String(c.id).padEnd(4)} ${name(c).padEnd(46)} ${num(c.price) ? "$" + num(c.price).toLocaleString() : ""}`));
if (!goneFromFeed.length) console.log("  (none)");

console.log(`\n${line}\n3. NUMBERS THAT NO LONGER AGREE (${drift.length})\n${line}`);
drift.forEach(({ c, notes }) => console.log(`  id ${String(c.id).padEnd(4)} ${name(c).padEnd(46)} ${notes.join("; ")}`));
if (!drift.length) console.log("  (none)");

if (EMIT_NEW && missing.length) {
  let nextId = Math.max(...cars.map((c) => Number(c.id) || 0)) + 1;
  const stubs = missing.map((f) => ({
    id: nextId++,
    make: f.make,
    model: f.model,
    year: f.year,
    price: f.price ?? "",
    mileage: f.mileage ?? "",
    color: "",
    engine: "",
    transmission: "",
    stock: f.stock || (f.vin ? f.vin.slice(-6) : ""),
    vin: f.vin || "",
    carfax: true,
    financing: true,
    features: [],
    img: "",
    images: [],
    description: "",
  }));
  fs.writeFileSync("new-cars.json", JSON.stringify(stubs, null, 2));
  console.log(`\n→ wrote new-cars.json with ${stubs.length} stubs (add photos, then merge into public/cars.json)`);
}

if (APPLY_SOLD && goneFromFeed.length) {
  const ids = new Set(goneFromFeed.map((c) => String(c.id)));
  const next = cars.map((c) => (ids.has(String(c.id)) ? { ...c, status: "sold" } : c));
  fs.writeFileSync(CARS, JSON.stringify(next, null, 2) + "\n");
  console.log(`\n→ marked ${ids.size} vehicles as sold in public/cars.json`);
}
console.log("");
