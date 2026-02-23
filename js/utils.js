// utils.js - shared helpers (no dependencies)
(function () {
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
    "bluetooth": "Bluetooth",
    "backup camera": "Backup Camera",
    "rear view camera": "Backup Camera",
    "navigation": "Navigation",
    "sunroof": "Sunroof",
    "moonroof": "Moonroof",
    "keyless entry": "Keyless Entry",
    "remote start": "Remote Start",
    "heated seats": "Heated Seats",
    "alloy wheels": "Alloy Wheels",
    "abs": "ABS",
  };

  function toKey(s) {
    return String(s || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function cleanFeatures(features) {
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

  function normalizeCar(raw, idx) {
    const r = raw && typeof raw === "object" ? raw : {};
    const id = r.id ?? r.stock ?? r.vin ?? (idx + 1);
    return {
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
      img: (r.img ?? "").toString(),
      images: Array.isArray(r.images) ? r.images.filter(Boolean) : [],
      features: cleanFeatures(r.features),
      // allow unknown fields for future
      _raw: r
    };
  }

  window.USStarUtils = { normalizeCar, cleanFeatures };
})();
