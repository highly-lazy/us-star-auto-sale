import { Link } from "react-router-dom";
import { badgeFor, fuelType, isSold, toNum, carName } from "../lib/utils.js";
import { useFavorite } from "../lib/favorites.js";

// Inventory card — matches collection.html `.cc` markup.
export default function CarCard({ car, index = 0 }) {
  const sold = isSold(car);
  const p = toNum(car.price);
  const m = toNum(car.mileage);
  const badge = badgeFor(car);
  const fuel = fuelType(car);
  const name = carName(car);
  const detail = `/car/${car.id}`;
  const td = `/testdrive?car=${encodeURIComponent(name)}`;
  const { saved, toggle } = useFavorite(car.id);
  const delay = Math.min(index * 45, 400);

  return (
    <article className={`cc${sold ? " is-sold" : ""}`} role="listitem" style={{ animationDelay: `${delay}ms` }}>
      <Link className="cc-img" to={detail} aria-label={name}>
        <span className={`cc-badge ${badge.cls}`} aria-label={badge.text}>{badge.text}</span>
        {sold && <div className="cc-sold-stamp" aria-hidden="true">SOLD</div>}
        <button
          className={`cc-fav${saved ? " is-saved" : ""}`}
          type="button"
          aria-label={`Save ${name}`}
          aria-pressed={saved}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle();
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 21s-7-4.6-9.2-8.7C.9 8.7 3 5.5 6.4 5.1c1.7-.2 3.4.6 4.3 2 1-1.4 2.7-2.2 4.3-2 3.4.4 5.5 3.6 3.6 7.2C19 16.4 12 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </button>
        <img src={car.img} alt={name} loading="lazy" decoding="async" width="640" height="400" />
      </Link>
      <div className="cc-body">
        <h3 className="cc-name" title={name}>{name}</h3>
        <div className="cc-price-row">
          {sold ? (
            <span className="cc-price-sold">{p !== null ? `$${p.toLocaleString()}` : ""}</span>
          ) : (
            <span className="cc-price">{p !== null ? `$${p.toLocaleString()}` : car.price ?? ""}</span>
          )}
        </div>
        <div className="cc-meta">
          <span className="cc-pill">{m !== null ? m.toLocaleString() : "—"} mi</span>
          <span className="cc-pill">{fuel}</span>
          {car.transmission && <span className="cc-pill">{car.transmission}</span>}
          {car.carfax && (
            <span className="cc-pill" style={{ color: "#d4af37", borderColor: "rgba(212,175,55,0.3)" }}>CARFAX</span>
          )}
        </div>
        <div className="cc-actions">
          {sold ? (
            <p className="cc-sold-msg">
              No longer available · <Link to="/inventory">See similar</Link>
            </p>
          ) : (
            <>
              <Link to={detail} className="cc-btn-view">View Details</Link>
              <Link to={td} className="cc-btn-td">Test Drive</Link>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
