import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "../lib/i18n.jsx";

const CARFAX_REVIEWS = "https://www.carfax.com/Reviews-US-Star-Auto-Sales-Knoxville-TN_RJR0DUB8CK";
const CARGURUS_DEALER = "https://www.cargurus.com/Cars/m-US-Star-Auto-Group-LLC-sp463559";
const GOOGLE_REVIEWS = "https://maps.google.com/?q=US+Star+Auto+Sale+7665+Maynardville+Pike+Knoxville+TN";

const SOURCE_HREF = { Google: GOOGLE_REVIEWS, CARFAX: CARFAX_REVIEWS, CarGurus: CARGURUS_DEALER };

// Real lifetime customer count for the headline ("Over N satisfied customers…").
// Leave null until we have a verified figure — the neutral heading is used then.
const SATISFIED_COUNT = null;

function GoogleMark() {
  return (
    <span className="gmark" aria-label="Google">
      <i className="g1">G</i><i className="g2">o</i><i className="g3">o</i>
      <i className="g4">g</i><i className="g5">l</i><i className="g6">e</i>
    </span>
  );
}

// Reviews live in /public/reviews.json so they can be refreshed without a
// deploy of the app code. Shape:
//   [{ "name": "Jane D.", "rating": 5, "date": "10.12.2025",
//      "source": "Google", "text": "…" }]
export default function Reviews() {
  const { t } = useLang();
  const [reviews, setReviews] = useState([]);
  const railRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/reviews.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => alive && setReviews(Array.isArray(d) ? d : []))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const sync = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    sync();
    const el = railRef.current;
    if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync, reviews.length]);

  const nudge = (dir) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector(".review-card");
    const step = card ? card.getBoundingClientRect().width + 18 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const total = reviews.length;

  return (
    <section className="section reviews" id="reviews" aria-labelledby="reviews-title">
      <div className="container">
        <div className="reviews__head">
          <span className="eyebrow">{t("reviews.eyebrow")}</span>
          <h2 id="reviews-title">
            {SATISFIED_COUNT
              ? t("reviews.titleCount").replace("{n}", `+${SATISFIED_COUNT.toLocaleString()}`)
              : t("reviews.title")}
          </h2>
          <p>{t("reviews.sub")}</p>
        </div>

        {total > 0 ? (
          <>
            <div className="reviews__rail">
              <button
                className="reviews__nav"
                type="button"
                aria-label={t("reviews.prev")}
                onClick={() => nudge(-1)}
                disabled={atStart}
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="reviews__track" ref={railRef}>
                {reviews.map((r, i) => (
                  <article className="review-card" key={`${r.name}-${i}`}>
                    <div className="review-card__top">
                      <span className="review-card__name">{r.name}</span>
                      <span className="review-card__stars" aria-label={`${r.rating || 5} out of 5`}>
                        {"★".repeat(Math.round(r.rating || 5))}
                      </span>
                    </div>
                    <p className="review-card__text">{r.text}</p>
                    <div className="review-card__foot">
                      {r.date ? <span className="review-card__date">{r.date}</span> : <span />}
                      {r.source === "Google" || !r.source ? (
                        <GoogleMark />
                      ) : (
                        <span className="review-card__date">{r.source}</span>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              <button
                className="reviews__nav"
                type="button"
                aria-label={t("reviews.next")}
                onClick={() => nudge(1)}
                disabled={atEnd}
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="reviews__cta">
              <a className="btn btn-primary" href={GOOGLE_REVIEWS} target="_blank" rel="noopener noreferrer">
                {t("reviews.readAll")}
              </a>
            </div>
          </>
        ) : (
          <div className="reviews__cta">
            <a className="btn btn-primary" href={GOOGLE_REVIEWS} target="_blank" rel="noopener noreferrer">Google</a>
            <a className="btn btn-ghost" href={CARFAX_REVIEWS} target="_blank" rel="noopener noreferrer">CARFAX</a>
            <a className="btn btn-ghost" href={CARGURUS_DEALER} target="_blank" rel="noopener noreferrer">CarGurus</a>
          </div>
        )}
      </div>
    </section>
  );
}

export { SOURCE_HREF };
