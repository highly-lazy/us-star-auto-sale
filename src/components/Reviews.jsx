import { useEffect, useRef, useState } from "react";
import { useLang } from "../lib/i18n.jsx";

const GOOGLE_REVIEWS = "https://maps.google.com/?q=US+Star+Auto+Sale+7665+Maynardville+Pike+Knoxville+TN";
const CARFAX_REVIEWS = "https://www.carfax.com/Reviews-US-Star-Auto-Sales-Knoxville-TN_RJR0DUB8CK";
const CARGURUS_DEALER = "https://www.cargurus.com/Cars/m-US-Star-Auto-Group-LLC-sp463559";

function GoogleMark({ size = 22 }) {
  return (
    <span className="gmark" style={{ fontSize: size }} aria-label="Google">
      <i className="g1">G</i><i className="g2">o</i><i className="g3">o</i>
      <i className="g4">g</i><i className="g5">l</i><i className="g6">e</i>
    </span>
  );
}

function Stars({ n = 5 }) {
  return (
    <span className="stars" aria-label={`${n} out of 5 stars`}>
      {"★".repeat(Math.round(n))}
    </span>
  );
}

function Card({ r }) {
  return (
    <article className="rv-card">
      <div className="rv-card__top">
        <span className="rv-card__name">{r.name}</span>
        <Stars n={r.rating || 5} />
      </div>
      <p className="rv-card__text">{r.text}</p>
      <div className="rv-card__foot">
        <span className="rv-card__date">{r.date || ""}</span>
        {!r.source || r.source === "Google" ? <GoogleMark /> : <span className="rv-card__src">{r.source}</span>}
      </div>
    </article>
  );
}

/**
 * Reviews live in /public/reviews.json so they can be refreshed without a code
 * deploy:  [{ name, rating, date, source, text }]
 * The strip scrolls itself; hovering or focusing it stops the motion, and the
 * whole row is still a normal horizontal scroller for touch and keyboard.
 * With no reviews on file it falls back to the "leave us one" panel rather
 * than inventing testimonials.
 */
export default function Reviews() {
  const { t } = useLang();
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const trackRef = useRef(null);

  useEffect(() => {
    let alive = true;
    fetch("/reviews.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => {
        if (!alive) return;
        // Accept either a bare array or { rating, count, reviews: [...] }
        if (Array.isArray(d)) setReviews(d);
        else if (d && Array.isArray(d.reviews)) {
          setReviews(d.reviews);
          if (d.rating) setSummary({ rating: d.rating, count: d.count });
        }
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const has = reviews.length > 0;
  // Duplicate the list so the marquee can loop without a visible seam.
  const loop = has ? [...reviews, ...reviews] : [];

  return (
    <section className="section reviews" id="reviews" aria-labelledby="reviews-title">
      <div className="container reviews__head">
        <span className="eyebrow">{t("reviews.eyebrow")}</span>
        <h2 id="reviews-title">{t("reviews.title")}</h2>

        {summary ? (
          <a className="reviews__summary" href={GOOGLE_REVIEWS} target="_blank" rel="noopener noreferrer">
            <GoogleMark size={26} />
            <span className="reviews__score">{summary.rating.toFixed(1)}</span>
            <Stars n={summary.rating} />
            {summary.count ? <span className="reviews__count">{t("reviews.basedOn").replace("{n}", summary.count)}</span> : null}
          </a>
        ) : (
          <p>{t("reviews.sub")}</p>
        )}
      </div>

      {has ? (
        <div className="rv-strip" ref={trackRef}>
          <div className="rv-track" style={{ "--rv-count": loop.length }}>
            {loop.map((r, i) => (
              <Card key={`${r.name}-${i}`} r={r} />
            ))}
          </div>
          <div className="rv-fade rv-fade--l" aria-hidden="true" />
          <div className="rv-fade rv-fade--r" aria-hidden="true" />
        </div>
      ) : (
        <div className="container">
          <div className="rv-empty">
            <GoogleMark size={30} />
            <p>{t("reviews.fallback")}</p>
            <div className="rv-empty__cta">
              <a className="btn btn-primary" href={GOOGLE_REVIEWS} target="_blank" rel="noopener noreferrer">
                {t("reviews.readAll")}
              </a>
              <a className="btn btn-ghost" href={CARFAX_REVIEWS} target="_blank" rel="noopener noreferrer">CARFAX</a>
              <a className="btn btn-ghost" href={CARGURUS_DEALER} target="_blank" rel="noopener noreferrer">CarGurus</a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
