import { Link } from "react-router-dom";
import { fuelType, toNum, carName } from "../lib/utils.js";
import { useFavorite } from "../lib/favorites.js";

// Classic `.car-card` used on Home (featured) and Saved pages.
// `fallbackBadge` is the label when the car isn't a SPECIAL / GOOD DEAL.
export default function CarCardClassic({ car, variant = "home", fallbackBadge = "FEATURED" }) {
  const p = toNum(car.price);
  const m = toNum(car.mileage);
  const name = carName(car);
  const detail = `/car/${car.id}`;
  const td = `/testdrive?car=${encodeURIComponent(name)}`;
  const { saved, toggle } = useFavorite(car.id);

  let badge = { text: fallbackBadge, cls: "deal-badge--good" };
  if (p !== null && p <= 8000) badge = { text: "SPECIAL", cls: "deal-badge--special" };
  else if (m !== null && m <= 70000) badge = { text: "GOOD DEAL", cls: "deal-badge--good" };

  return (
    <div className="car-card">
      <Link className="car-media" to={detail} aria-label={`View ${name}`}>
        <span className={`deal-badge ${badge.cls}`}>{badge.text}</span>
        <button
          className={`fav-btn${saved ? " is-active" : ""}`}
          type="button"
          aria-label="Save vehicle"
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
      <div className="car-info">
        <div className="car-top">
          <h3>{name}</h3>
          <div className="car-price">{p !== null ? `$${p.toLocaleString()}` : car.price ?? ""}</div>
        </div>
        <div className="car-meta">
          <span>{m !== null ? m.toLocaleString() : car.mileage ?? ""} mi</span>
          <span>{fuelType(car)}</span>
          <span>Stock: {car.stock || "—"}</span>
        </div>

        {variant === "saved" ? (
          <div className="car-buttons">
            <Link to={detail} className="btn btn-view">View Details</Link>
            <Link to={td} className="btn btn-test">Test Drive</Link>
          </div>
        ) : (
          <div className="car-platform" aria-label="Vehicle listings and reports">
            <a href="https://www.cargurus.com/Cars/m-US-Star-Auto-Group-LLC-sp463559" target="_blank" rel="noopener noreferrer">
              <img src="/assets/icons/cargurus.svg" alt="CarGurus" />
              <span>CarGurus</span>
            </a>
            <a href="https://www.carfax.com/Reviews-US-Star-Auto-Sales-Knoxville-TN_RJR0DUB8CK" target="_blank" rel="noopener noreferrer">
              <img src="/assets/icons/carfax.svg" alt="CARFAX" />
              <span>CARFAX</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
