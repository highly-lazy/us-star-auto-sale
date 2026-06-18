import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCars } from "../lib/useCars.js";
import { normalize } from "../lib/utils.js";
import { useLang } from "../lib/i18n.jsx";

const YEARS = (() => {
  const out = [];
  for (let y = 2024; y >= 2005; y--) out.push(y);
  return out;
})();

const PRICES = [5000, 8000, 10000, 12000, 15000, 20000, 25000, 30000, 40000];
const MILES = [30000, 50000, 75000, 100000, 125000, 150000, 200000];

// Reference-style advanced search panel. Builds a query string and routes to
// the inventory page, which reads these params on mount.
export default function AdvancedSearch({ variant = "hero" }) {
  const { cars } = useCars();
  const { t } = useLang();
  const navigate = useNavigate();
  const [f, setF] = useState({ make: "", model: "", yMin: "", pMax: "", miles: "", color: "", trans: "" });

  const makes = useMemo(
    () => [...new Set(cars.map((c) => c.make).filter(Boolean))].sort(),
    [cars],
  );
  const models = useMemo(() => {
    const mk = normalize(f.make);
    return [...new Set(cars.filter((c) => !mk || normalize(c.make) === mk).map((c) => c.model).filter(Boolean))].sort();
  }, [cars, f.make]);
  const colors = useMemo(
    () => [...new Set(cars.map((c) => c.color).filter(Boolean))].sort(),
    [cars],
  );

  const set = (k) => (e) => setF((prev) => ({ ...prev, [k]: e.target.value, ...(k === "make" ? { model: "" } : {}) }));

  const submit = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (f.make) p.set("make", f.make);
    if (f.model) p.set("model", f.model);
    if (f.yMin) p.set("yMin", f.yMin);
    if (f.pMax) p.set("pMax", f.pMax);
    if (f.miles) p.set("miles", f.miles);
    if (f.color) p.set("color", f.color);
    if (f.trans) p.set("trans", f.trans);
    navigate(`/inventory${p.toString() ? `?${p}` : ""}`);
  };

  return (
    <form className={`adv-search adv-search--${variant}`} onSubmit={submit} aria-label="Search vehicles">
      <div className="adv-search-head">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>{t("search.title")}</span>
      </div>

      <div className="adv-grid">
        <label className="adv-field">
          <span>{t("search.make")}</span>
          <select value={f.make} onChange={set("make")}>
            <option value="">{t("search.anyMake")}</option>
            {makes.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>

        <label className="adv-field">
          <span>{t("search.model")}</span>
          <select value={f.model} onChange={set("model")}>
            <option value="">{t("search.anyModel")}</option>
            {models.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>

        <label className="adv-field">
          <span>{t("search.year")}</span>
          <select value={f.yMin} onChange={set("yMin")}>
            <option value="">{t("search.anyYear")}</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </label>

        <label className="adv-field">
          <span>{t("search.maxPrice")}</span>
          <select value={f.pMax} onChange={set("pMax")}>
            <option value="">{t("search.noMax")}</option>
            {PRICES.map((p) => <option key={p} value={p}>${p.toLocaleString()}</option>)}
          </select>
        </label>

        <label className="adv-field">
          <span>{t("search.maxMiles")}</span>
          <select value={f.miles} onChange={set("miles")}>
            <option value="">{t("search.noMax")}</option>
            {MILES.map((m) => <option key={m} value={m}>{m.toLocaleString()} mi</option>)}
          </select>
        </label>

        <label className="adv-field">
          <span>{t("search.color")}</span>
          <select value={f.color} onChange={set("color")}>
            <option value="">{t("search.anyColor")}</option>
            {colors.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label className="adv-field">
          <span>{t("search.transmission")}</span>
          <select value={f.trans} onChange={set("trans")}>
            <option value="">{t("search.any")}</option>
            <option value="automatic">{t("search.automatic")}</option>
            <option value="manual">{t("search.manual")}</option>
          </select>
        </label>

        <button type="submit" className="btn btn-primary adv-submit">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {t("search.submit")}
        </button>
      </div>
    </form>
  );
}
