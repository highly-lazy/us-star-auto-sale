// utils.js — shared helpers (ported from the original js/utils.js + inline scripts)

const FEATURE_MAP = {
  "air bag": "Airbags",
  "driver air bag": "Driver Airbag",
  "passenger air bag": "Passenger Airbag",
  "side air bag": "Side Airbags",
  "air conditioning": "Air Conditioning",
  "am/fm stereo": "AM/FM Stereo",
  "cruise control": "Cruise Control",
  "interval wipers": "Interval Wipers",
  "power steering": "Power Steering",
  "power brakes": "Power Brakes",
  "tilt wheel": "Tilt Wheel",
  "trip odometer": "Trip Odometer",
  "power driver's seat": "Power Driver Seat",
  "power driver seat": "Power Driver Seat",
  "power passenger seat": "Power Passenger Seat",
  "cloth interior": "Cloth Interior",
  "leather interior": "Leather Interior",
  "power door locks": "Power Door Locks",
  "power mirrors": "Power Mirrors",
  "power windows": "Power Windows",
  bluetooth: "Bluetooth",
  "backup camera": "Backup Camera",
  "rear view camera": "Backup Camera",
  navigation: "Navigation",
  sunroof: "Sunroof",
  moonroof: "Moonroof",
  "keyless entry": "Keyless Entry",
  "remote start": "Remote Start",
  "heated seats": "Heated Seats",
  "alloy wheels": "Alloy Wheels",
  abs: "ABS",
};

const toKey = (s) =>
  String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

export function cleanFeatures(features) {
  if (!Array.isArray(features)) return [];
  const out = [];
  const seen = new Set();
  for (const f of features) {
    const key = toKey(f);
    if (!key) continue;
    const label = FEATURE_MAP[key] || String(f).trim();
    const dedupeKey = toKey(label);
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    out.push(label);
  }
  return out;
}

// Ensure an image path is absolute so it resolves from any route (e.g. /car/5).
export function imgPath(p) {
  const s = String(p || "");
  if (!s) return "";
  if (/^https?:\/\//.test(s) || s.startsWith("/")) return s;
  return "/" + s.replace(/^\.?\//, "");
}

export function normalizeCar(raw, idx = 0) {
  const r = raw && typeof raw === "object" ? raw : {};
  const id = r.id ?? r.stock ?? r.vin ?? idx + 1;
  return {
    ...r, // keep every original field (status, carfax, financing, description, fuel…)
    id: String(id),
    make: (r.make ?? "").toString(),
    model: (r.model ?? "").toString(),
    year: r.year ?? "",
    price: r.price ?? "",
    mileage: r.mileage ?? "",
    color: (r.color ?? "").toString(),
    engine: (r.engine ?? "").toString(),
    transmission: (r.transmission ?? "").toString(),
    stock: (r.stock ?? "").toString(),
    vin: (r.vin ?? "").toString(),
    img: imgPath(r.img ?? ""),
    images: Array.isArray(r.images) ? r.images.filter(Boolean).map(imgPath) : [],
    features: cleanFeatures(r.features),
  };
}

export const normalize = (v) => String(v ?? "").toLowerCase().trim();

export const toNum = (v) => {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export function fuelType(c) {
  const explicit = c.fuel || c.fuelType || c.fuel_type;
  if (explicit) return String(explicit);
  const m = `${c.make ?? ""} ${c.model ?? ""} ${c.engine ?? ""}`;
  if (/hybrid/i.test(m)) return "Hybrid";
  if (/electric|\bev\b|tesla/i.test(m)) return "Electric";
  if (/diesel/i.test(m)) return "Diesel";
  return "Gas";
}

export function isSold(c) {
  return (c.status || "available") === "sold";
}

// Inventory badge (matches collection.html inline logic)
export function badgeFor(c) {
  if (isSold(c)) return { text: "SOLD", cls: "badge-sold" };
  const p = toNum(c.price);
  const m = toNum(c.mileage);
  if (p !== null && p <= 8000) return { text: "SPECIAL", cls: "badge-special" };
  if (m !== null && m <= 70000) return { text: "LOW MILES", cls: "badge-low" };
  return { text: "FEATURED", cls: "badge-featured" };
}

export const carName = (c) =>
  [c.year, c.make, c.model].filter(Boolean).join(" ").trim();

export const fmtPrice = (v) => {
  const n = toNum(v);
  return n !== null ? `$${n.toLocaleString()}` : v ?? "";
};

export const fmtMiles = (v) => {
  const n = toNum(v);
  return n !== null ? n.toLocaleString() : v ?? "";
};
