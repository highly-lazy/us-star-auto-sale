import { Link } from "react-router-dom";
import { isSold } from "../lib/utils.js";
import { useLang } from "../lib/i18n.jsx";

// Maps a feed make ("Mercedes-Benz", "Land Rover") to the logo file in
// /public/assets/brands. Anything without a file is simply skipped.
const LOGO = {
  "mercedes-benz": "mercedes", mercedes: "mercedes", bmw: "bmw", audi: "audi",
  ford: "ford", honda: "honda", toyota: "toyota", kia: "kia", hyundai: "hyundai",
  nissan: "nissan", jeep: "jeep", dodge: "dodge", chevrolet: "chevrolet",
  subaru: "subaru", mazda: "mazda", lexus: "lexus", infiniti: "infiniti",
  cadillac: "cadillac", mitsubishi: "mitsubishi", "land rover": "landrover",
  volkswagen: "volkswagen", chrysler: "chrysler", ram: "ram", lincoln: "lincoln",
};

export default function BrandStrip({ cars }) {
  const { t } = useLang();

  const counts = new Map();
  for (const c of cars) {
    if (isSold(c) || !c.make) continue;
    const slug = LOGO[c.make.toLowerCase()];
    if (!slug) continue;
    const cur = counts.get(slug) || { make: c.make, n: 0 };
    cur.n += 1;
    counts.set(slug, cur);
  }

  const brands = [...counts.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 10);
  if (brands.length < 3) return null;

  return (
    <section className="brandstrip" aria-label="Brands we stock">
      <div className="container brandstrip__inner">
        <span className="brandstrip__label">{t("brands.label")}</span>
        {brands.map(([slug, { make }]) => (
          <Link key={slug} to={`/inventory?make=${encodeURIComponent(make)}`} title={make}>
            <img src={`/assets/brands/${slug}.svg`} alt={make} loading="lazy" decoding="async" />
          </Link>
        ))}
      </div>
    </section>
  );
}
