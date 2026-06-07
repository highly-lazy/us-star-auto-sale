import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import CarCard from "../components/CarCard.jsx";
import { useCars } from "../lib/useCars.js";
import { normalize, toNum, fuelType, isSold } from "../lib/utils.js";
import "../css/inventory-page.css";

const TRANS = [
  { val: "", label: "Any" },
  { val: "automatic", label: "Automatic" },
  { val: "manual", label: "Manual" },
];
const FUELS = [
  { val: "", label: "Any" },
  { val: "gas", label: "Gas" },
  { val: "hybrid", label: "Hybrid" },
  { val: "electric", label: "Electric" },
  { val: "diesel", label: "Diesel" },
];

const EMPTY = { make: "", model: "", yMin: "", yMax: "", pMin: "", pMax: "", miles: "" };

export default function Inventory() {
  const { cars, loading, error } = useCars();

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("new");
  const [status, setStatus] = useState("available");
  const [trans, setTrans] = useState("");
  const [fuel, setFuel] = useState("");
  const [f, setF] = useState(EMPTY);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawer]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setDrawer(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const makes = useMemo(
    () => [...new Set(cars.map((c) => c.make).filter(Boolean))].sort(),
    [cars],
  );
  const models = useMemo(() => {
    const mk = normalize(f.make);
    return [...new Set(cars.filter((c) => !mk || normalize(c.make) === mk).map((c) => c.model).filter(Boolean))].sort();
  }, [cars, f.make]);

  const activeFilterCount = [f.make, f.model, f.yMin, f.yMax, f.pMin, f.pMax, f.miles, trans, fuel].filter(Boolean).length;

  const results = useMemo(() => {
    const nq = normalize(q);
    const mk = normalize(f.make), mo = normalize(f.model);
    const ylo = toNum(f.yMin), yhi = toNum(f.yMax);
    const plo = toNum(f.pMin), phi = toNum(f.pMax);
    const mlx = toNum(f.miles);

    let list = cars.filter((c) => {
      const st = c.status || "available";
      if (status !== "all" && st !== status) return false;
      if (mk && normalize(c.make) !== mk) return false;
      if (mo && normalize(c.model) !== mo) return false;
      const y = toNum(c.year), p = toNum(c.price), m = toNum(c.mileage);
      if (ylo !== null && (y === null || y < ylo)) return false;
      if (yhi !== null && (y === null || y > yhi)) return false;
      if (plo !== null && (p === null || p < plo)) return false;
      if (phi !== null && (p === null || p > phi)) return false;
      if (mlx !== null && (m === null || m > mlx)) return false;
      if (trans && !normalize(c.transmission).includes(trans)) return false;
      if (fuel && !normalize(fuelType(c)).includes(fuel)) return false;
      if (nq) {
        const hay = [c.make, c.model, c.year, c.color, c.stock, c.vin, c.engine, c.transmission, c.fuel].map(normalize).join(" ");
        if (!hay.includes(nq)) return false;
      }
      return true;
    });

    if (sort === "priceAsc") list.sort((a, b) => (toNum(a.price) ?? 1e9) - (toNum(b.price) ?? 1e9));
    else if (sort === "priceDesc") list.sort((a, b) => (toNum(b.price) ?? -1) - (toNum(a.price) ?? -1));
    else if (sort === "milesAsc") list.sort((a, b) => (toNum(a.mileage) ?? 1e9) - (toNum(b.mileage) ?? 1e9));
    else list.sort((a, b) => Number(b.id) - Number(a.id));

    return list;
  }, [cars, q, sort, status, trans, fuel, f]);

  const resetFilters = () => {
    setF(EMPTY);
    setTrans("");
    setFuel("");
  };

  const countLabel = status === "sold" ? "sold vehicles" : status === "all" ? "total vehicles" : "available";

  return (
    <Layout bodyClass="page-inventory">
      {/* Filter overlay + drawer */}
      <div className={`filter-overlay${drawer ? " open" : ""}`} role="presentation" onClick={() => setDrawer(false)}></div>
      <aside className={`filter-drawer${drawer ? " open" : ""}`} aria-label="Filter vehicles" role="dialog" aria-modal="true">
        <div className="fd-head">
          <div>
            <h2>Filter Vehicles</h2>
            <span>{activeFilterCount ? `${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} active` : ""}</span>
          </div>
          <button className="fd-close" aria-label="Close filters" onClick={() => setDrawer(false)}>✕</button>
        </div>

        <div className="fd-body">
          <div className="fd-section">
            <h3>Make &amp; Model</h3>
            <div className="fd-field" style={{ gap: 10 }}>
              <select className="fd-select" aria-label="Filter by make" value={f.make} onChange={(e) => setF({ ...f, make: e.target.value, model: "" })}>
                <option value="">All Makes</option>
                {makes.map((m) => <option key={m} value={normalize(m)}>{m}</option>)}
              </select>
              <select className="fd-select" aria-label="Filter by model" value={f.model} onChange={(e) => setF({ ...f, model: e.target.value })}>
                <option value="">All Models</option>
                {models.map((m) => <option key={m} value={normalize(m)}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="fd-section">
            <h3>Year Range</h3>
            <div className="fd-row">
              <div className="fd-field"><label>From year</label><input className="fd-input" type="number" placeholder="e.g. 2015" inputMode="numeric" value={f.yMin} onChange={(e) => setF({ ...f, yMin: e.target.value })} /></div>
              <div className="fd-field"><label>To year</label><input className="fd-input" type="number" placeholder="e.g. 2023" inputMode="numeric" value={f.yMax} onChange={(e) => setF({ ...f, yMax: e.target.value })} /></div>
            </div>
          </div>

          <div className="fd-section">
            <h3>Price Range</h3>
            <div className="fd-row">
              <div className="fd-field"><label>Min price $</label><input className="fd-input" type="number" placeholder="0" inputMode="numeric" value={f.pMin} onChange={(e) => setF({ ...f, pMin: e.target.value })} /></div>
              <div className="fd-field"><label>Max price $</label><input className="fd-input" type="number" placeholder="Any" inputMode="numeric" value={f.pMax} onChange={(e) => setF({ ...f, pMax: e.target.value })} /></div>
            </div>
          </div>

          <div className="fd-section">
            <h3>Max Mileage</h3>
            <div className="fd-field"><label>Maximum miles</label><input className="fd-input" type="number" placeholder="e.g. 100,000" inputMode="numeric" value={f.miles} onChange={(e) => setF({ ...f, miles: e.target.value })} /></div>
          </div>

          <div className="fd-section">
            <h3>Transmission</h3>
            <div className="fd-chips">
              {TRANS.map((t) => (
                <button key={t.label} className={`fd-chip${trans === t.val ? " on" : ""}`} onClick={() => setTrans(t.val)}>{t.label}</button>
              ))}
            </div>
          </div>

          <div className="fd-section">
            <h3>Fuel Type</h3>
            <div className="fd-chips">
              {FUELS.map((t) => (
                <button key={t.label} className={`fd-chip${fuel === t.val ? " on" : ""}`} onClick={() => setFuel(t.val)}>{t.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="fd-footer">
          <button className="fd-reset" onClick={resetFilters}>Reset All</button>
          <button className="fd-apply" onClick={() => setDrawer(false)}>Show Results</button>
        </div>
      </aside>

      <main className="inv-page">
        <div className="inv-hero">
          <div className="container inv-hero-inner">
            <div>
              <h1>Vehicle Inventory</h1>
              <p>Knoxville, TN · Premium Pre-Owned Vehicles</p>
            </div>
            <Link to="/financing" className="btn btn-primary btn-small" style={{ flexShrink: 0 }}>Get Pre‑Approved</Link>
          </div>

          <div className="container inv-toolbar">
            <div className="inv-search-wrap">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input className="inv-search" type="search" placeholder="Search make, model, year, VIN…" aria-label="Search inventory" autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>

            <select className="inv-sort" aria-label="Sort inventory" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="new">Newest First</option>
              <option value="priceAsc">Price: Low → High</option>
              <option value="priceDesc">Price: High → Low</option>
              <option value="milesAsc">Mileage: Low → High</option>
            </select>

            <button className={`inv-filter-btn${activeFilterCount ? " has-filters" : ""}`} aria-label="Open filters" aria-expanded={drawer} onClick={() => setDrawer(true)}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M6 12h12M9 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              <span>Filters</span>
              <div className="filter-dot" aria-hidden="true"></div>
            </button>
          </div>
        </div>

        <div className="container" style={{ paddingTop: 20 }}>
          <div className="inv-status-row">
            <div className="inv-tabs" role="tablist" aria-label="Vehicle status">
              {["available", "sold", "all"].map((st) => (
                <button key={st} className={`inv-tab${status === st ? " on" : ""}`} role="tab" aria-selected={status === st} onClick={() => setStatus(st)}>
                  {st === "available" ? "Available" : st === "sold" ? "Sold" : "All Vehicles"}
                </button>
              ))}
            </div>
            <div className="inv-count-label" aria-live="polite">
              <strong>{results.length}</strong> {countLabel}
            </div>
          </div>

          <div className="inv-grid" role="list">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div className="cc-skel" key={i}>
                  <div className="cc-skel-img"></div>
                  <div className="cc-skel-body">
                    <div className="cc-skel-line w80"></div>
                    <div className="cc-skel-line w40"></div>
                    <div className="cc-skel-line w60"></div>
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="inv-empty">
                <div className="inv-empty-icon">⚠️</div>
                <h3>Failed to load inventory</h3>
                <p>Please refresh the page or try again later.</p>
              </div>
            ) : results.length ? (
              results.map((car, i) => <CarCard key={car.id} car={car} index={i} />)
            ) : (
              <div className="inv-empty">
                <div className="inv-empty-icon">🔍</div>
                <h3>No vehicles found</h3>
                <p>Try adjusting your search or filters</p>
                <button onClick={() => { resetFilters(); setQ(""); setSort("new"); }}>Reset All Filters</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}
