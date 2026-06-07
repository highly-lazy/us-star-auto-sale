import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { useCars } from "../lib/useCars.js";
import { fuelType, isSold, toNum, carName } from "../lib/utils.js";
import { useFavorite } from "../lib/favorites.js";

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
  useEffect(() => setIdx(0), [id]);

  const sold = car ? isSold(car) : false;
  const { saved, toggle } = useFavorite(car?.id);

  useEffect(() => {
    if (car) document.title = `${carName(car)} – US Star Auto Sale`;
  }, [car]);

  useEffect(() => {
    if (!images.length) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length]);

  if (!loading && !car) {
    return (
      <Layout bodyClass="page-car" bodyStyle={{ "--page-bg-image": "url('/assets/images/fon1.png')" }}>
        <section className="section container" style={{ textAlign: "center", padding: "80px 20px" }}>
          <h1 className="car-title">Vehicle not found</h1>
          <p style={{ color: "rgba(255,255,255,0.6)" }}>
            This listing may have been removed. <Link to="/inventory" style={{ color: "#d4af37" }}>Browse available inventory →</Link>
          </p>
        </section>
      </Layout>
    );
  }

  const price = toNum(car?.price);
  const mileage = toNum(car?.mileage);
  const priceDisplay = price !== null ? `$${price.toLocaleString()}` : car?.price ?? "";
  const name = car ? carName(car) : "";

  return (
    <Layout bodyClass="page-car" bodyStyle={{ "--page-bg-image": "url('/assets/images/fon1.png')" }}>
      <section className="section container car-details">
        <div className="car-images">
          {car && images.length > 0 && (
            <div className="car-gallery" data-gallery style={{ position: "relative" }}>
              {sold && (
                <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.50)", borderRadius: 12, pointerEvents: "none" }}>
                  <span style={{ fontSize: 36, fontWeight: 900, letterSpacing: 5, color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.7)" }}>SOLD</span>
                </div>
              )}
              <div className="car-thumbs">
                {images.map((src, i) => (
                  <button key={i} className={`car-thumb${i === idx ? " is-active" : ""}`} type="button" aria-label={`View image ${i + 1}`} onClick={() => setIdx(i)}>
                    <img src={src} alt={`${name} thumbnail ${i + 1}`} loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
              <div className="car-main">
                <img src={images[idx]} alt={name} decoding="async" />
                <div className="car-nav">
                  <button type="button" aria-label="Previous image" onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}>‹</button>
                  <button type="button" aria-label="Next image" onClick={() => setIdx((i) => (i + 1) % images.length)}>›</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="car-info">
          {!car ? null : (
            <>
              {sold && (
                <div style={{ background: "rgba(193,18,31,0.12)", border: "1px solid rgba(193,18,31,0.4)", borderRadius: 12, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 22 }}>🚫</span>
                  <div>
                    <strong style={{ color: "#fff", fontSize: 15 }}>This vehicle has been sold</strong>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: "4px 0 0" }}>
                      Browse our <Link to="/inventory" style={{ color: "#d4af37" }}>available inventory</Link> to find a similar vehicle.
                    </p>
                  </div>
                </div>
              )}

              <div className="car-title-row">
                <h1 className="car-title">{name}</h1>
                {!sold && (
                  <button className={`fav-btn fav-btn--large${saved ? " is-active" : ""}`} type="button" aria-label="Save vehicle" aria-pressed={saved} onClick={toggle}>
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 21s-7-4.6-9.2-8.7C.9 8.7 3 5.5 6.4 5.1c1.7-.2 3.4.6 4.3 2 1-1.4 2.7-2.2 4.3-2 3.4.4 5.5 3.6 3.6 7.2C19 16.4 12 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                    <span>Save</span>
                  </button>
                )}
              </div>

              <p className="car-price">
                <strong>Price:</strong>{" "}
                {sold ? (
                  <>
                    <span style={{ textDecoration: "line-through", color: "rgba(255,255,255,0.4)" }}>{priceDisplay}</span>{" "}
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>(Sold)</span>
                  </>
                ) : (
                  priceDisplay
                )}
              </p>
              <p className="car-mileage">
                <strong>Mileage:</strong> {mileage !== null ? `${mileage.toLocaleString()} miles` : car.mileage ?? ""}
              </p>

              {car.carfax && (
                <div className="car-trust">
                  <span className="car-trust__badge">📄 Vehicle History Report Available (CARFAX / AutoCheck)</span>
                  <p className="car-trust__note">Ask our team for the vehicle history report for this listing.</p>
                </div>
              )}

              <p><strong>Year:</strong> {car.year}</p>
              <p><strong>Engine:</strong> {car.engine}</p>
              <p><strong>Fuel:</strong> {fuelType(car)}</p>
              <p><strong>Transmission:</strong> {car.transmission}</p>
              <p><strong>Color:</strong> {car.color}</p>
              <p><strong>Stock:</strong> {car.stock}</p>
              <p><strong>VIN:</strong> {car.vin}</p>
              {car.description && <p className="car-description">{car.description}</p>}

              <h3>Features:</h3>
              <ul className="car-features">
                {(car.features || []).map((f, i) => <li key={i}>{f}</li>)}
              </ul>

              {sold ? (
                <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.05)", borderRadius: 12, textAlign: "center", color: "rgba(255,255,255,0.55)", fontSize: 14 }}>
                  This vehicle is no longer available.<br />
                  <Link to="/inventory" style={{ color: "#d4af37", fontWeight: 600 }}>← Browse Available Cars</Link>
                </div>
              ) : (
                <div className="car-buttons">
                  <Link to={`/testdrive?car=${encodeURIComponent(name)}`} className="btn btn-test">Test Drive</Link>
                  <a href="tel:+18653773230" className="btn btn-call">Call Now</a>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
