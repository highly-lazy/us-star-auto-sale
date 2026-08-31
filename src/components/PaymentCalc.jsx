import { useState, useMemo } from "react";

const TERMS = [48, 60, 72, 84];

/**
 * Inline loan estimator on the vehicle detail page. Illustrative only —
 * the real number comes from the lender after the credit application.
 */
export default function PaymentCalc({ price }) {
  const [down, setDown] = useState(Math.round((price || 0) * 0.1));
  const [months, setMonths] = useState(72);
  const [apr, setApr] = useState(9.9);

  const monthly = useMemo(() => {
    const principal = Math.max((price || 0) - down, 0);
    if (!principal) return 0;
    const r = apr / 100 / 12;
    if (r === 0) return Math.round(principal / months);
    return Math.round((principal * r) / (1 - Math.pow(1 + r, -months)));
  }, [price, down, months, apr]);

  const total = monthly * months;

  return (
    <div className="pcalc">
      <div className="pcalc-out">
        <span className="pcalc-amt">${monthly.toLocaleString()}</span>
        <span className="pcalc-per">/ month</span>
      </div>

      <label className="pcalc-field">
        <span>Down payment <strong>${down.toLocaleString()}</strong></span>
        <input
          type="range" min="0" max={price || 0} step="250"
          value={down} onChange={(e) => setDown(Number(e.target.value))}
          aria-label="Down payment"
        />
      </label>

      <label className="pcalc-field">
        <span>Interest rate <strong>{apr.toFixed(1)}%</strong> APR</span>
        <input
          type="range" min="3" max="24" step="0.1"
          value={apr} onChange={(e) => setApr(Number(e.target.value))}
          aria-label="Interest rate"
        />
      </label>

      <div className="pcalc-field">
        <span>Term</span>
        <div className="pcalc-terms">
          {TERMS.map((m) => (
            <button
              key={m}
              type="button"
              className={`pcalc-term${months === m ? " on" : ""}`}
              aria-pressed={months === m}
              onClick={() => setMonths(m)}
            >
              {m} mo
            </button>
          ))}
        </div>
      </div>

      <p className="pcalc-note">
        Total of payments about <strong>${total.toLocaleString()}</strong>. Estimate only —
        excludes tax, title and fees. Your rate depends on credit approval.
      </p>
    </div>
  );
}
