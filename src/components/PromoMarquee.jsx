import { useLang } from "../lib/i18n.jsx";

// Auto-scrolling promotional strip (pure CSS animation). Items are duplicated
// so the loop is seamless.
export default function PromoMarquee() {
  const { t } = useLang();
  const items = ["promo.1", "promo.2", "promo.3", "promo.4", "promo.5", "promo.6"].map(t);
  const loop = [...items, ...items];

  return (
    <div className="promo-marquee" role="marquee" aria-label="Current offers">
      <div className="promo-track">
        {loop.map((text, i) => (
          <span className="promo-item" key={i}>{text}</span>
        ))}
      </div>
    </div>
  );
}
