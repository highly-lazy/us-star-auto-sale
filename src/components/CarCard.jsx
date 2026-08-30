import { Link } from "react-router-dom";
import { badgeFor, fuelType, isSold, toNum, carName, onImgError } from "../lib/utils.js";
import { useFavorite } from "../lib/favorites.js";

const CARFAX_DEALER = "https://www.carfax.com/Reviews-US-Star-Auto-Sales-Knoxville-TN_RJR0DUB8CK";
const CARGURUS_DEALER = "https://www.cargurus.com/Cars/m-US-Star-Auto-Group-LLC-sp463559";
const carfaxHref = (car) =>
  car.vin ? `https://www.carfax.com/vehicle/${encodeURIComponent(car.vin)}` : CARFAX_DEALER;

function Icon({ d }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Inventory card — matches collection.html `.cc` markup.
export default function CarCard({ car, index = 0 }) {
  const sold = isSold(car);
  const p = toNum(car.price);
  const m = toNum(car.mileage);
  const badge = badgeFor(car);
  const fuel = fuelType(car);
  const name = carName(car);
  const detail = `/car/${car.id}`;
  const nameParam = encodeURIComponent(name);
  const td = `/testdrive?car=${nameParam}`;
  const { saved, toggle } = useFavorite(car.id);
  const delay = Math.min(index * 45, 400);

  return (
    <article className={`cc${sold ? " is-sold" : ""}`} role="listitem" style={{ animationDelay: `${delay}ms` }}>
      <Link className="cc-img" to={detail} aria-label={name}>
        {car.condition === "new" && <span className="cc-new-badge">NEW ARRIVAL</span>}
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
        <img src={car.thumb || car.img} alt={name} loading="lazy" decoding="async" width="480" height="300" onError={onImgError} />
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
        </div>

        {!sold && (
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
            <Link className="car-action" to={td} title="Schedule a test drive">
              <Icon d="M5 17h14M6.5 17V9.8a2 2 0 0 1 .3-1l1.4-2.2a2 2 0 0 1 1.7-1h4.2a2 2 0 0 1 1.7 1l1.4 2.2c.2.3.3.7.3 1V17M4 12h16M8 20h1M15 20h1" />
              Test Drive
            </Link>
          </div>
        )}
        <div className="cc-actions">
          {sold ? (
            <p className="cc-sold-msg">
              No longer available · <Link to="/inventory">See similar</Link>
            </p>
          ) : (
            <>
              <Link to={detail} className="cc-btn-view">View Details</Link>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
