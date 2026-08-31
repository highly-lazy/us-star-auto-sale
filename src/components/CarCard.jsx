import { Link } from "react-router-dom";
import {
  badgeFor, fuelType, isSold, isDeal, savings, toNum, carName,
  bodyStyle, milesShort, monthlyEstimate, topFeatures, onImgError,
} from "../lib/utils.js";
import { useFavorite } from "../lib/favorites.js";

const CARFAX_DEALER = "https://www.carfax.com/Reviews-US-Star-Auto-Sales-Knoxville-TN_RJR0DUB8CK";
const carfaxHref = (car) =>
  car.vin ? `https://www.carfax.com/vehicle/${encodeURIComponent(car.vin)}` : CARFAX_DEALER;

function Icon({ d }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Body-style glyph shown on the image corner.
const STYLE_ICON = {
  SUV:   "M4 17h16M6.5 17v-6.6c0-.4.1-.7.3-1l1.4-2.2c.4-.6 1-1 1.7-1h4.2c.7 0 1.3.4 1.7 1L17.2 9.4c.2.3.3.6.3 1V17M4 12h16",
  Truck: "M3 16h11V7H3v9Zm11-5h3.5l2.5 3v2H14M6 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  Van:   "M3 16V8a2 2 0 0 1 2-2h9l4 4h1a2 2 0 0 1 2 2v4M3 16h2m14 0h2M7.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  Coupe: "M4 16h16M5.5 16v-3.4c0-.4.2-.8.5-1l2.6-2.1c.4-.3.9-.5 1.4-.5h4.3c.6 0 1.1.2 1.5.6l2.2 2M4 12h16",
  Wagon: "M4 16h16M5.5 16v-6c0-.6.4-1 1-1H16l2.5 3.2c.3.4.5.9.5 1.4V16M4 12h16",
  Sedan: "M4 16h16M5.5 16v-3.2c0-.4.1-.8.4-1.1l2.2-2.4c.4-.4.9-.6 1.5-.6h4.9c.5 0 1 .2 1.4.6l2.2 2.4c.3.3.4.7.4 1.1V16M4 13h16",
};

/**
 * Inventory card. Order follows the listing convention: identity and price are
 * readable before the photo loads, then photo, specs, features and actions.
 */
export default function CarCard({ car, index = 0 }) {
  const sold = isSold(car);
  const deal = isDeal(car);
  const wasPrice = deal ? toNum(car.oldPrice) : null;
  const saved$ = savings(car);
  const p = toNum(car.price);
  const m = toNum(car.mileage);
  const badge = badgeFor(car);
  const fuel = fuelType(car);
  const style = bodyStyle(car);
  const name = carName(car);
  const monthly = sold ? null : monthlyEstimate(car);
  const feats = topFeatures(car, 4);
  const detail = `/car/${car.id}`;
  const nameParam = encodeURIComponent(name);
  const { saved, toggle } = useFavorite(car.id);
  const delay = Math.min(index * 55, 480);

  return (
    <article
      className={`cc${sold ? " is-sold" : ""}${deal ? " is-deal" : ""}`}
      role="listitem"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* 1 — identity */}
      <header className="cc-head">
        <h3 className="cc-name" title={name}>
          <Link to={detail}>{[car.make, car.model].filter(Boolean).join(" ")}</Link>
        </h3>
        <p className="cc-sub">
          {car.year}
          {milesShort(car) ? <> · {milesShort(car)}</> : null}
        </p>
      </header>

      {/* 2 — price */}
      <div className="cc-price-row">
        {sold ? (
          <span className="cc-price-sold">{p !== null ? `$${p.toLocaleString()}` : ""}</span>
        ) : (
          <>
            {wasPrice !== null && (
              <span className="cc-price-was" aria-label={`Was $${wasPrice.toLocaleString()}`}>
                ${wasPrice.toLocaleString()}
              </span>
            )}
            <span className={`cc-price${deal ? " is-deal" : ""}`}>
              {p !== null ? `$${p.toLocaleString()}` : car.price ?? ""}
            </span>
            {saved$ !== null && <span className="cc-price-save">Save ${saved$.toLocaleString()}</span>}
          </>
        )}
      </div>
      {monthly && <p className="cc-monthly">est. <strong>${monthly.toLocaleString()}</strong>/mo<span className="cc-monthly-note"> · 72 mo, 10% down, OAC</span></p>}

      {/* 3 — photo */}
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
        <span className="cc-style" title={style}>
          <Icon d={STYLE_ICON[style] || STYLE_ICON.Sedan} />
          {style}
        </span>
        <img src={car.thumb || car.img} alt={name} loading="lazy" decoding="async" width="480" height="300" onError={onImgError} />
      </Link>

      <div className="cc-body">
        {/* 4 — spec line */}
        <ul className="cc-specline">
          <li>{m !== null ? `${m.toLocaleString()} mi` : "—"}</li>
          {car.transmission && <li>{car.transmission}</li>}
          <li>{fuel}</li>
          {car.stock && <li className="cc-stock">Stock #{car.stock}</li>}
        </ul>

        {/* 5 — features */}
        {feats.length > 0 && (
          <ul className="cc-feats">
            {feats.map((x) => <li key={x}>{x}</li>)}
          </ul>
        )}

        {/* 6 — actions */}
        {sold ? (
          <p className="cc-sold-msg">
            No longer available · <Link to="/inventory">See similar</Link>
          </p>
        ) : (
          <>
            <div className="cc-cta">
              <Link className="cc-cta-btn cc-cta-btn--primary" to={`/financing?car=${nameParam}`}>Get Financed</Link>
              <Link className="cc-cta-btn" to={`/testdrive?car=${nameParam}`}>Test Drive</Link>
              <Link className="cc-cta-btn" to={`/contact?offer=${nameParam}`}>Make an Offer</Link>
              <Link className="cc-cta-btn" to={`/tradein?car=${nameParam}`}>Appraise Trade</Link>
            </div>
            <div className="cc-foot">
              <Link to={detail} className="cc-btn-view">View Details</Link>
              <a className="cc-carfax" href={carfaxHref(car)} target="_blank" rel="noopener noreferrer" title="Vehicle history report">
                <Icon d="M12 3 4.5 6v5.4c0 4.3 3.1 8.3 7.5 9.6 4.4-1.3 7.5-5.3 7.5-9.6V6L12 3Z" />
                CARFAX
              </a>
            </div>
          </>
        )}
      </div>
    </article>
  );
}
