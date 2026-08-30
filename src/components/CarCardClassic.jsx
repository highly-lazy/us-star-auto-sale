import { Link } from "react-router-dom";
import { fuelType, toNum, carName, onImgError, isSold } from "../lib/utils.js";
import { useFavorite } from "../lib/favorites.js";

const CARFAX_DEALER = "https://www.carfax.com/Reviews-US-Star-Auto-Sales-Knoxville-TN_RJR0DUB8CK";
const CARGURUS_DEALER = "https://www.cargurus.com/Cars/m-US-Star-Auto-Group-LLC-sp463559";

// A VIN gives a real per-vehicle CARFAX page; without one we fall back to the
// dealer's CARFAX profile.
const carfaxHref = (car) =>
  car.vin ? `https://www.carfax.com/vehicle/${encodeURIComponent(car.vin)}` : CARFAX_DEALER;

function Icon({ d }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CarCardClassic({ car, variant = "home", fallbackBadge = "FEATURED" }) {
  const p = toNum(car.price);
  const m = toNum(car.mileage);
  const name = carName(car);
  const detail = `/car/${car.id}`;
  const nameParam = encodeURIComponent(name);
  const { saved, toggle } = useFavorite(car.id);
  const sold = isSold(car);

  let badge = { text: fallbackBadge, cls: "deal-badge--good" };
  if (sold) badge = { text: "SOLD", cls: "badge-sold" };
  else if (p !== null && p <= 8000) badge = { text: "SPECIAL", cls: "deal-badge--special" };
  else if (m !== null && m <= 70000) badge = { text: "LOW MILES", cls: "deal-badge--good" };

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
        <img src={car.thumb || car.img} alt={name} loading="lazy" decoding="async" width="480" height="360" onError={onImgError} />
      </Link>

      <div className="car-info">
        <div className="car-top">
          <h3>{name}</h3>
          <div className="car-price">{p !== null ? `$${p.toLocaleString()}` : car.price ?? ""}</div>
        </div>

        <div className="car-meta">
          <span>{m !== null ? m.toLocaleString() : car.mileage ?? ""} mi</span>
          <span>{fuelType(car)}</span>
          {car.transmission ? <span>{car.transmission}</span> : null}
          <span>Stock: {car.stock || "—"}</span>
        </div>

        <div className="car-actions" aria-label="Vehicle actions">
          <a
            className="car-action car-action--carfax"
            href={carfaxHref(car)}
            target="_blank"
            rel="noopener noreferrer"
            title="Vehicle history report"
          >
            <Icon d="M12 3 4.5 6v5.4c0 4.3 3.1 8.3 7.5 9.6 4.4-1.3 7.5-5.3 7.5-9.6V6L12 3Z" />
            CARFAX
          </a>
          <a
            className="car-action car-action--cargurus"
            href={CARGURUS_DEALER}
            target="_blank"
            rel="noopener noreferrer"
            title="See our listings on CarGurus"
          >
            <Icon d="M4 17h16M6.5 17V10a2 2 0 0 1 .3-1l1.4-2.2a2 2 0 0 1 1.7-.9h4.2a2 2 0 0 1 1.7.9L17.2 9c.2.3.3.7.3 1v7M12 6.9V3M9 3h6" />
            CarGurus
          </a>
          <Link className="car-action" to={`/financing?car=${nameParam}`} title="Get pre-approved on this vehicle">
            <Icon d="M3 10h18M6 15h4M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
            Financing
          </Link>
          <Link className="car-action" to={`/testdrive?car=${nameParam}`} title="Schedule a test drive">
            <Icon d="M5 17h14M6.5 17V9.8a2 2 0 0 1 .3-1l1.4-2.2a2 2 0 0 1 1.7-1h4.2a2 2 0 0 1 1.7 1l1.4 2.2c.2.3.3.7.3 1V17M4 12h16M8 20h1M15 20h1" />
            Test Drive
          </Link>
        </div>

        <div className="car-cta">
          <Link to={detail} className="btn btn-view">
            {variant === "saved" ? "View Details" : "View Details"}
          </Link>
        </div>
      </div>
    </div>
  );
}
