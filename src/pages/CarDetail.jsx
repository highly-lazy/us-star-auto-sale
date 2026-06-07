import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { useCars } from "../lib/useCars.js";
import { fuelType, isSold, toNum, carName } from "../lib/utils.js";
import { useFavorite } from "../lib/favorites.js";
import "../css/cardetail.css";

// tiny inline icons for the spec grid
const I = {
  miles: <path d="M3 13a9 9 0 0 1 18 0M12 13l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />,
  cal: <><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>,
  engine: <path d="M5 9h2V7h6v2h2l2 2v2h2v4h-2v2H7v-3H5v-2H3v-4h2z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round" />,
  gear: <><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M12 4v3M12 17v3M4 12h3M17 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>,
  fuel: <path d="M6 21V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v16M5 21h11M14 9h2l2 2v6a2 2 0 0 1-2 2" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  color: <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />,
  tag: <path d="M3 7v5l9 9 7-7-9-9H5a2 2 0 0 0-2 2z" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round" />,
  vin: <><rect x="3" y="6" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="none" /><path d="M7 9v6M10 9v6M13 9v6M17 9v6" stroke="currentColor" strokeWidth="1.5" /></>,
};
const SpecIcon = ({ d }) => <svg viewBox="0 0 24 24" aria-hidden="true">{d}</svg>;

export default function CarDetail() {
  const { id } = useParams();
  const { cars, loading } = useCars();
  const car = useMemo(() => cars.find((c) => String(c.id) === String(id)), [cars, id]);

  const images = useMemo(() => {
    if (!car) return [];
    const imgs = Array.isArray(car.images) && car.images.length ? car.images : [car.img];
    return imgs.filter(Boolean);
  }, [car]);

  const [idx, setIdx] = useState(0);
  const touchX = useRef(null);
  useEffect(() => setIdx(0), [id]);

  const sold = car ? isSold(car) : false;
  const { saved, toggle } = useFavorite(car?.id);
  const name = car ? carName(car) : "";

  const go = (n) => setIdx((i) => (n + images.length) % images.length);
  const next = () => go(idx + 1);
  const prev = () => go(idx - 1);

  useEffect(() => {
    if (car) document.title = `${name} – US Star Auto Sale`;
  }, [car, name]);

  useEffect(() => {
    if (!images.length) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, idx]);

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    touchX.current = null;
  };

  if (!loading && !car) {
    return (
      <Layout bodyClass="page-car">
        <main className="vdp container">
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <h1 className="vdp-title">Vehicle not found</h1>
            <p style={{ color: "var(--muted)", marginTop: 8 }}>
              This listing may have been removed.{" "}
              <Link to="/inventory" style={{ color: "var(--gold)" }}>Browse available inventory →</Link>
            </p>
          </div>
        </main>
      </Layout>
    );
  }

  if (!car) {
    return (
      <Layout bodyClass="page-car">
        <main className="vdp container"><div style={{ padding: 80 }} /></main>
      </Layout>
    );
  }

  const price = toNum(car.price);
  const mileage = toNum(car.mileage);
  const priceDisplay = price !== null ? `$${price.toLocaleString()}` : car.price ?? "";

  const specs = [
    { k: "Mileage", v: mileage !== null ? `${mileage.toLocaleString()} mi` : car.mileage, icon: I.miles },
    { k: "Year", v: car.year, icon: I.cal },
    { k: "Engine", v: car.engine, icon: I.engine },
    { k: "Transmission", v: car.transmission, icon: I.gear },
    { k: "Fuel", v: fuelType(car), icon: I.fuel },
    { k: "Color", v: car.color, icon: I.color },
    { k: "Stock", v: car.stock, icon: I.tag },
    { k: "VIN", v: car.vin, icon: I.vin },
  ].filter((s) => s.v);

  return (
    <Layout bodyClass="page-car">
      <main className="vdp container">
        <nav className="vdp-crumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep">›</span>
          <Link to="/inventory">Inventory</Link>
          <span className="sep">›</span>
          <span className="cur">{name}</span>
        </nav>

        <div className="vdp-grid">
          {/* Gallery */}
          <div className="vdp-gallery">
            <div className={`vdp-main${sold ? " is-sold" : ""}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              <img src={images[idx]} alt={`${name} — photo ${idx + 1}`} decoding="async" />
              {sold && <div className="vdp-sold-stamp"><span>SOLD</span></div>}
              {!sold && (
                <button className={`vdp-fav${saved ? " is-saved" : ""}`} type="button" aria-label="Save vehicle" aria-pressed={saved} onClick={toggle}>
                  <svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.6-9.2-8.7C.9 8.7 3 5.5 6.4 5.1c1.7-.2 3.4.6 4.3 2 1-1.4 2.7-2.2 4.3-2 3.4.4 5.5 3.6 3.6 7.2C19 16.4 12 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
                </button>
              )}
              {images.length > 1 && (
                <>
                  <button className="vdp-nav prev" aria-label="Previous image" onClick={prev}>‹</button>
                  <button className="vdp-nav next" aria-label="Next image" onClick={next}>›</button>
                  <div className="vdp-count">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" /><circle cx="9" cy="10" r="2" stroke="currentColor" strokeWidth="2" /><path d="M5 17l4-3 3 2 4-4 3 3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
                    {idx + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="vdp-thumbs">
                {images.map((src, i) => (
                  <button key={i} className={`vdp-thumb${i === idx ? " is-active" : ""}`} type="button" aria-label={`View image ${i + 1}`} onClick={() => setIdx(i)}>
                    <img src={src} alt={`${name} thumbnail ${i + 1}`} loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info panel */}
          <aside className="vdp-info">
            <div className="vdp-card">
              <div className="vdp-titlerow">
                <h1 className="vdp-title">{name}</h1>
                {!sold && (
                  <button className={`vdp-save${saved ? " is-saved" : ""}`} type="button" aria-pressed={saved} onClick={toggle}>
                    <svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.6-9.2-8.7C.9 8.7 3 5.5 6.4 5.1c1.7-.2 3.4.6 4.3 2 1-1.4 2.7-2.2 4.3-2 3.4.4 5.5 3.6 3.6 7.2C19 16.4 12 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
                    {saved ? "Saved" : "Save"}
                  </button>
                )}
              </div>

              <div className="vdp-pricerow">
                <span className={`vdp-price${sold ? " sold" : ""}`}>{priceDisplay}</span>
                {sold && <span className="vdp-price-note">No longer available</span>}
              </div>
              {mileage !== null && <p className="vdp-miles"><strong>{mileage.toLocaleString()}</strong> miles</p>}

              <div className="vdp-specs">
                {specs.map((s) => (
                  <div className="vdp-spec" key={s.k}>
                    <div className="k"><SpecIcon d={s.icon} />{s.k}</div>
                    <div className="v" title={String(s.v)}>{s.v}</div>
                  </div>
                ))}
              </div>

              {car.carfax && (
                <div className="vdp-carfax">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-12V5l-8-3-8 3v5c0 8 8 12 8 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span><strong>Vehicle History Report Available</strong> (CARFAX / AutoCheck). Ask our team for this listing’s report.</span>
                </div>
              )}

              {sold ? (
                <div className="vdp-sold-box">
                  This vehicle is no longer available.<br />
                  <Link to="/inventory">← Browse available cars</Link>
                </div>
              ) : (
                <div className="vdp-cta">
                  <div className="btn-row">
                    <Link to={`/testdrive?car=${encodeURIComponent(name)}`} className="vdp-btn vdp-btn--primary">
                      <svg viewBox="0 0 24 24" fill="none"><path d="M8 7V3m8 4V3M4 11h16M6 21h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                      Test Drive
                    </Link>
                    <a href="tel:+18653773230" className="vdp-btn vdp-btn--ghost">
                      <svg viewBox="0 0 24 24" fill="none"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 3a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 2 .5 3 .6a2 2 0 0 1 1.7 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
                      Call Now
                    </a>
                  </div>
                  <Link to={`/financing?car=${encodeURIComponent(name)}`} className="vdp-btn vdp-btn--gold">Get Pre‑Approved for this Vehicle</Link>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Lower sections */}
        <div className="vdp-sections">
          {car.description && (
            <section className="vdp-block">
              <h2>Overview</h2>
              <p className="vdp-desc">{car.description}</p>
            </section>
          )}
          {car.features?.length > 0 && (
            <section className="vdp-block">
              <h2>Features &amp; Options</h2>
              <div className="vdp-features">
                {car.features.map((f, i) => (
                  <span className="vdp-feature" key={i}>
                    <svg viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    {f}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </Layout>
  );
}
