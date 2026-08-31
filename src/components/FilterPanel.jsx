import { useState } from "react";
import { normalize, PRICE_BANDS } from "../lib/utils.js";

export const BODY_STYLES = ["SUV", "Sedan", "Truck", "Van", "Coupe", "Wagon"];

export const TRANS = [
  { val: "", label: "Any" },
  { val: "automatic", label: "Automatic" },
  { val: "manual", label: "Manual" },
];

export const FUELS = [
  { val: "", label: "Any" },
  { val: "gas", label: "Gas" },
  { val: "hybrid", label: "Hybrid" },
  { val: "electric", label: "Electric" },
  { val: "diesel", label: "Diesel" },
];

export const MILES_BANDS = [
  { val: "", label: "Any" },
  { val: "60000", label: "Under 60k" },
  { val: "100000", label: "Under 100k" },
  { val: "150000", label: "Under 150k" },
];

// One collapsible rail section — the chevron rotates and the body slides open.
function Section({ title, count, children, open: initialOpen = true }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <div className={`fp-sec${open ? " open" : ""}`}>
      <button className="fp-sec-head" type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span>{title}</span>
        {count ? <em className="fp-sec-count">{count}</em> : null}
        <svg className="fp-chev" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="fp-sec-body">
        <div className="fp-sec-inner">{children}</div>
      </div>
    </div>
  );
}

/**
 * Shared filter body. Rendered twice — once as the persistent desktop rail,
 * once inside the mobile drawer — so the two can never drift apart.
 */
export default function FilterPanel({
  f, setF, trans, setTrans, fuel, setFuel, band, setBand, style, setStyle,
  makes, models, makeCounts, styleCounts, bandCounts,
}) {
  const toggle = (cur, val, set) => set(cur === val ? "" : val);

  return (
    <div className="fp">
      <Section title="Price Range" count={band ? 1 : 0}>
        <div className="fp-list">
          {PRICE_BANDS.map((b) => (
            <button
              key={b.key}
              type="button"
              className={`fp-opt${band === b.key ? " on" : ""}`}
              aria-pressed={band === b.key}
              onClick={() => toggle(band, b.key, setBand)}
            >
              <span className="fp-tick" aria-hidden="true" />
              <span className="fp-opt-label">{b.label}</span>
              <span className="fp-opt-n">{bandCounts[b.key] || 0}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Body Style" count={style ? 1 : 0}>
        <div className="fp-list">
          {BODY_STYLES.filter((s) => styleCounts[s]).map((s) => (
            <button
              key={s}
              type="button"
              className={`fp-opt${style === s ? " on" : ""}`}
              aria-pressed={style === s}
              onClick={() => toggle(style, s, setStyle)}
            >
              <span className="fp-tick" aria-hidden="true" />
              <span className="fp-opt-label">{s}</span>
              <span className="fp-opt-n">{styleCounts[s]}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Make" count={f.make ? 1 : 0}>
        <div className="fp-list fp-list--scroll">
          {makes.filter((m) => makeCounts[m] || f.make === normalize(m)).map((m) => {
            const key = normalize(m);
            return (
              <button
                key={m}
                type="button"
                className={`fp-opt${f.make === key ? " on" : ""}`}
                aria-pressed={f.make === key}
                onClick={() => setF({ ...f, make: f.make === key ? "" : key, model: "" })}
              >
                <span className="fp-tick" aria-hidden="true" />
                <span className="fp-opt-label">{m}</span>
                <span className="fp-opt-n">{makeCounts[m] || 0}</span>
              </button>
            );
          })}
        </div>
      </Section>

      {f.make && models.length > 1 && (
        <Section title="Model" count={f.model ? 1 : 0}>
          <div className="fp-list fp-list--scroll">
            {models.map((m) => {
              const key = normalize(m);
              return (
                <button
                  key={m}
                  type="button"
                  className={`fp-opt${f.model === key ? " on" : ""}`}
                  aria-pressed={f.model === key}
                  onClick={() => setF({ ...f, model: f.model === key ? "" : key })}
                >
                  <span className="fp-tick" aria-hidden="true" />
                  <span className="fp-opt-label">{m}</span>
                </button>
              );
            })}
          </div>
        </Section>
      )}

      <Section title="Mileage" count={f.miles ? 1 : 0}>
        <div className="fp-chips">
          {MILES_BANDS.map((b) => (
            <button
              key={b.label}
              type="button"
              className={`fp-chip${f.miles === b.val ? " on" : ""}`}
              onClick={() => setF({ ...f, miles: b.val })}
            >
              {b.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Year Range" count={(f.yMin ? 1 : 0) + (f.yMax ? 1 : 0)} open={false}>
        <div className="fp-row">
          <label className="fp-field">
            <span>From</span>
            <input className="fp-input" type="number" inputMode="numeric" placeholder="2010"
              value={f.yMin} onChange={(e) => setF({ ...f, yMin: e.target.value })} />
          </label>
          <label className="fp-field">
            <span>To</span>
            <input className="fp-input" type="number" inputMode="numeric" placeholder="2024"
              value={f.yMax} onChange={(e) => setF({ ...f, yMax: e.target.value })} />
          </label>
        </div>
      </Section>

      <Section title="Transmission" count={trans ? 1 : 0} open={false}>
        <div className="fp-chips">
          {TRANS.map((t) => (
            <button key={t.label} type="button" className={`fp-chip${trans === t.val ? " on" : ""}`} onClick={() => setTrans(t.val)}>
              {t.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Fuel Type" count={fuel ? 1 : 0} open={false}>
        <div className="fp-chips">
          {FUELS.map((t) => (
            <button key={t.label} type="button" className={`fp-chip${fuel === t.val ? " on" : ""}`} onClick={() => setFuel(t.val)}>
              {t.label}
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}
