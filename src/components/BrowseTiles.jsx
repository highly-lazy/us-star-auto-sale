import { Link } from "react-router-dom";
import { bodyStyle, isSold, PRICE_BANDS, priceBand } from "../lib/utils.js";
import { useLang } from "../lib/i18n.jsx";

const STYLE_ORDER = ["SUV", "Sedan", "Truck", "Van", "Coupe", "Wagon"];

// "Shop by …" tiles — price band, body style and make. Counts come straight
// from the live inventory so a tile is never shown for an empty bucket.
export default function BrowseTiles({ cars }) {
  const { t } = useLang();
  const available = cars.filter((c) => !isSold(c));

  const byBand = PRICE_BANDS.map((b) => ({
    ...b,
    n: available.filter((c) => priceBand(c)?.key === b.key).length,
  })).filter((b) => b.n > 0);

  const styleCounts = new Map();
  for (const c of available) {
    const s = bodyStyle(c);
    styleCounts.set(s, (styleCounts.get(s) || 0) + 1);
  }
  const styles = STYLE_ORDER.filter((s) => styleCounts.get(s)).map((s) => ({
    label: s,
    n: styleCounts.get(s),
  }));

  const makeCounts = new Map();
  for (const c of available) {
    if (!c.make) continue;
    makeCounts.set(c.make, (makeCounts.get(c.make) || 0) + 1);
  }
  const makes = [...makeCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, n]) => ({ label, n }));

  const unit = (n) => `${n} ${n === 1 ? t("browse.vehicle") : t("browse.vehicles")}`;

  return (
    <section className="section container browse reveal" aria-labelledby="browse-title">
      <div className="section-head">
        <h2 className="section-title" id="browse-title">
          <span className="eyebrow">{t("browse.eyebrow")}</span>
          {t("browse.title")}
        </h2>
        <Link className="link-more" to="/inventory">{t("section.viewAll")} →</Link>
      </div>

      <div className="browse-group">
        <h3 className="browse-group__head">{t("browse.byPrice")}</h3>
        <div className="browse-tiles">
          {byBand.map((b) => (
            <Link className="browse-tile" key={b.key} to={`/inventory?price=${b.key}`}>
              <span className="browse-tile__label">{b.label}</span>
              <span className="browse-tile__count">{unit(b.n)}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="browse-group">
        <h3 className="browse-group__head">{t("browse.byStyle")}</h3>
        <div className="browse-tiles">
          {styles.map((s) => (
            <Link
              className="browse-tile browse-tile--style"
              key={s.label}
              to={`/inventory?style=${encodeURIComponent(s.label)}`}
            >
              <span className="browse-tile__label">{s.label}</span>
              <span className="browse-tile__count">{unit(s.n)}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="browse-group">
        <h3 className="browse-group__head">{t("browse.byMake")}</h3>
        <div className="browse-tiles">
          {makes.map((m) => (
            <Link
              className="browse-tile"
              key={m.label}
              to={`/inventory?make=${encodeURIComponent(m.label)}`}
            >
              <span className="browse-tile__label">{m.label}</span>
              <span className="browse-tile__count">{unit(m.n)}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
