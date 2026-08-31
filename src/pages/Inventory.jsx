import { useState, useMemo, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import CarCard from "../components/CarCard.jsx";
import FilterPanel from "../components/FilterPanel.jsx";
import { useCars } from "../lib/useCars.js";
import { normalize, toNum, fuelType, isDeal, bodyStyle, priceBand, PRICE_BANDS } from "../lib/utils.js";
import { useLang } from "../lib/i18n.jsx";

const EMPTY = { make: "", model: "", yMin: "", yMax: "", pMin: "", pMax: "", miles: "", color: "" };
const PAGE = 12; // cards revealed per infinite-scroll batch

export default function Inventory() {
  const { cars, loading, error } = useCars();
  const { t } = useLang();
  const [params] = useSearchParams();

  // Seed filters from URL query (set by the hero AdvancedSearch panel).
  const initF = {
    ...EMPTY,
    make: normalize(params.get("make") || ""),
    model: normalize(params.get("model") || ""),
    yMin: params.get("yMin") || "",
    pMax: params.get("pMax") || "",
    miles: params.get("miles") || "",
    color: params.get("color") || "",
  };

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("new");
  const [status, setStatus] = useState(params.get("status") === "deals" ? "deals" : "available");
  const [cond, setCond] = useState(params.get("cond") || "all"); // all | new | used
  const [trans, setTrans] = useState(params.get("trans") || "");
  const [fuel, setFuel] = useState("");
  const [f, setF] = useState(initF);
  const [band, setBand] = useState(params.get("price") || "");
  const [style, setStyle] = useState(params.get("style") || "");
  const [drawer, setDrawer] = useState(false);
  const [shown, setShown] = useState(PAGE);

  // Keep condition + facets in sync when nav links change the query string
  // while the page is already mounted.
  const condParam = params.get("cond") || "all";
  const bandParam = params.get("price") || "";
  const styleParam = params.get("style") || "";
  const statusParam = params.get("status") || "";
  useEffect(() => { if (statusParam) setStatus(statusParam); }, [statusParam]);
  useEffect(() => { setCond(condParam); }, [condParam]);
  useEffect(() => { setBand(bandParam); }, [bandParam]);
  useEffect(() => { setStyle(styleParam); }, [styleParam]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawer]);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const makes = useMemo(
    () => [...new Set(cars.map((c) => c.make).filter(Boolean))].sort(),
    [cars]
  );
  const models = useMemo(() => {
    const mk = f.make;
    return [...new Set(cars.filter((c) => !mk || normalize(c.make) === mk).map((c) => c.model).filter(Boolean))].sort();
  }, [cars, f.make]);

  // Everything that survives the status/condition gate — the pool the rail
  // counts against, so the number beside each option is honest.
  const pool = useMemo(
    () => cars.filter((c) => {
      const st = c.status || "available";
      if (status === "deals" ? !isDeal(c) : status !== "all" && st !== status) return false;
      if (cond !== "all" && (c.condition || "used") !== cond) return false;
      return true;
    }),
    [cars, status, cond]
  );

  const makeCounts = useMemo(() => {
    const o = {};
    for (const c of pool) if (c.make) o[c.make] = (o[c.make] || 0) + 1;
    return o;
  }, [pool]);
  const styleCounts = useMemo(() => {
    const o = {};
    for (const c of pool) { const s = bodyStyle(c); o[s] = (o[s] || 0) + 1; }
    return o;
  }, [pool]);
  const bandCounts = useMemo(() => {
    const o = {};
    for (const c of pool) { const b = priceBand(c); if (b) o[b.key] = (o[b.key] || 0) + 1; }
    return o;
  }, [pool]);

  const results = useMemo(() => {
    const nq = normalize(q);
    const mk = normalize(f.make), mo = normalize(f.model), col = normalize(f.color);
    const ylo = toNum(f.yMin), yhi = toNum(f.yMax);
    const plo = toNum(f.pMin), phi = toNum(f.pMax);
    const mlx = toNum(f.miles);

    const list = pool.filter((c) => {
      if (mk && normalize(c.make) !== mk) return false;
      if (mo && normalize(c.model) !== mo) return false;
      if (col && normalize(c.color) !== col) return false;
      const y = toNum(c.year), p = toNum(c.price), m = toNum(c.mileage);
      if (ylo !== null && (y === null || y < ylo)) return false;
      if (yhi !== null && (y === null || y > yhi)) return false;
      if (plo !== null && (p === null || p < plo)) return false;
      if (phi !== null && (p === null || p > phi)) return false;
      if (mlx !== null && (m === null || m > mlx)) return false;
      if (band && priceBand(c)?.key !== band) return false;
      if (style && bodyStyle(c) !== style) return false;
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
  }, [pool, q, sort, trans, fuel, f, band, style]);

  // Reset the reveal window whenever the result set itself changes.
  useEffect(() => { setShown(PAGE); }, [results.length, sort, status, cond]);

  // Infinite scroll: reveal the next batch as the sentinel enters view.
  const sentinel = useRef(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el || shown >= results.length) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setShown((n) => n + PAGE); },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown, results.length]);

  const resetFilters = () => {
    setF(EMPTY);
    setTrans("");
    setFuel("");
    setBand("");
    setStyle("");
  };

  // Active-filter pills, each removable in one tap.
  const pills = [];
  if (band) pills.push({ k: "band", label: PRICE_BANDS.find((b) => b.key === band)?.label || band, clear: () => setBand("") });
  if (style) pills.push({ k: "style", label: style, clear: () => setStyle("") });
  if (f.make) pills.push({ k: "make", label: makes.find((m) => normalize(m) === f.make) || f.make, clear: () => setF({ ...f, make: "", model: "" }) });
  if (f.model) pills.push({ k: "model", label: models.find((m) => normalize(m) === f.model) || f.model, clear: () => setF({ ...f, model: "" }) });
  if (f.miles) pills.push({ k: "miles", label: `Under ${Math.round(Number(f.miles) / 1000)}k mi`, clear: () => setF({ ...f, miles: "" }) });
  if (f.yMin) pills.push({ k: "yMin", label: `From ${f.yMin}`, clear: () => setF({ ...f, yMin: "" }) });
  if (f.yMax) pills.push({ k: "yMax", label: `To ${f.yMax}`, clear: () => setF({ ...f, yMax: "" }) });
  if (trans) pills.push({ k: "trans", label: trans === "automatic" ? "Automatic" : "Manual", clear: () => setTrans("") });
  if (fuel) pills.push({ k: "fuel", label: fuel[0].toUpperCase() + fuel.slice(1), clear: () => setFuel("") });
  if (q) pills.push({ k: "q", label: `“${q}”`, clear: () => setQ("") });

  const dealCount = useMemo(() => cars.filter(isDeal).length, [cars]);

  const panelProps = {
    f, setF, trans, setTrans, fuel, setFuel, band, setBand, style, setStyle,
    makes, models, makeCounts, styleCounts, bandCounts,
  };

  const visible = results.slice(0, shown);

  return (
    <Layout bodyClass="page-inventory has-hero" title="Vehicle Inventory" description="Browse our full inventory of premium used cars in Knoxville, TN. Filter by make, model, price, mileage and more.">
      {/* Mobile filter drawer — renders the same panel as the desktop rail */}
      <div className={`filter-overlay${drawer ? " open" : ""}`} role="presentation" onClick={() => setDrawer(false)}></div>
      <aside className={`filter-drawer${drawer ? " open" : ""}`} aria-label="Filter vehicles" role="dialog" aria-modal="true">
        <div className="fd-head">
          <div>
            <h2>Filter Vehicles</h2>
            <span>{pills.length ? `${pills.length} filter${pills.length > 1 ? "s" : ""} active` : "All vehicles"}</span>
          </div>
          <button className="fd-close" aria-label="Close filters" onClick={() => setDrawer(false)}>&#10005;</button>
        </div>
        <div className="fd-body">
          <FilterPanel {...panelProps} />
        </div>
        <div className="fd-footer">
          <button className="fd-reset" onClick={resetFilters}>Reset All</button>
          <button className="fd-apply" onClick={() => setDrawer(false)}>Show {results.length} Results</button>
        </div>
      </aside>

      <main className="inv-page">
        <div className="inv-hero">
          <div className="container inv-hero-inner">
            <div>
              <h1>{t("inv.title")}</h1>
              <p>{t("inv.subtitle")}</p>
            </div>
            <Link to="/financing" className="btn btn-primary btn-small" style={{ flexShrink: 0 }}>{t("cta.preApproved")}</Link>
          </div>

          <div className="container inv-cond-tabs">
            {[
              { v: "all", label: t("inv.all") },
              { v: "new", label: t("inv.new") },
              { v: "used", label: t("inv.used") },
            ].map((c) => (
              <button key={c.v} className={`inv-cond${cond === c.v ? " on" : ""}`} onClick={() => setCond(c.v)} aria-pressed={cond === c.v}>
                {c.label}
              </button>
            ))}
          </div>

          <div className="container inv-toolbar">
            <div className="inv-search-wrap">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input className="inv-search" type="search" placeholder="Search make, model, year, VIN&hellip;" aria-label="Search inventory" autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>

            <select className="inv-sort" aria-label="Sort inventory" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="new">Newest First</option>
              <option value="priceAsc">Price: Low &rarr; High</option>
              <option value="priceDesc">Price: High &rarr; Low</option>
              <option value="milesAsc">Mileage: Low &rarr; High</option>
            </select>

            <button className={`inv-filter-btn${pills.length ? " has-filters" : ""}`} aria-label="Open filters" aria-expanded={drawer} onClick={() => setDrawer(true)}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M6 12h12M9 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              <span>Filters</span>
              <div className="filter-dot" aria-hidden="true"></div>
            </button>
          </div>
        </div>

        <div className="container inv-status-row">
          <div className="inv-tabs" role="tablist" aria-label="Vehicle status">
            {["available", "deals", "sold", "all"].map((st) => (
              <button
                key={st}
                className={`inv-tab${status === st ? " on" : ""}${st === "deals" ? " inv-tab--deals" : ""}`}
                role="tab"
                aria-selected={status === st}
                onClick={() => setStatus(st)}
              >
                {st === "available" ? "Available"
                  : st === "deals" ? `Price Drops${dealCount ? ` (${dealCount})` : ""}`
                  : st === "sold" ? "Sold"
                  : "All Vehicles"}
              </button>
            ))}
          </div>
        </div>

        {/* Filter rail + results */}
        <div className="container inv-layout">
          <aside className="inv-rail" aria-label="Refine results">
            <div className="inv-rail-inner">
              <div className="inv-rail-head">
                <h2>Refine</h2>
                {pills.length > 0 && <button className="inv-rail-clear" onClick={resetFilters}>Clear all</button>}
              </div>
              <FilterPanel {...panelProps} />
            </div>
          </aside>

          <section className="inv-results">
            <div className="inv-results-head">
              <p className="inv-matches" aria-live="polite">
                <strong key={results.length}>{results.length}</strong>{" "}
                {results.length === 1 ? "match" : "matches"}
                {status === "deals" && <span className="inv-matches-note"> &middot; price drops</span>}
              </p>
              {pills.length > 0 && (
                <ul className="inv-pills">
                  {pills.map((p) => (
                    <li key={p.k}>
                      <button className="inv-pill" onClick={p.clear} aria-label={`Remove filter ${p.label}`}>
                        {p.label}<span aria-hidden="true">&#10005;</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="inv-grid" role="list">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div className="cc-skel" key={i}>
                    <div className="cc-skel-line w60"></div>
                    <div className="cc-skel-line w40"></div>
                    <div className="cc-skel-img"></div>
                    <div className="cc-skel-body">
                      <div className="cc-skel-line w80"></div>
                      <div className="cc-skel-line w60"></div>
                    </div>
                  </div>
                ))
              ) : error ? (
                <div className="inv-empty">
                  <div className="inv-empty-icon">&#9888;&#65039;</div>
                  <h3>Failed to load inventory</h3>
                  <p>Please refresh the page or try again later.</p>
                </div>
              ) : visible.length ? (
                visible.map((car, i) => <CarCard key={car.id} car={car} index={i % PAGE} />)
              ) : (
                <div className="inv-empty">
                  <div className="inv-empty-icon">&#128269;</div>
                  <h3>No vehicles found</h3>
                  <p>Try adjusting your search or filters</p>
                  <button onClick={() => { resetFilters(); setQ(""); setSort("new"); }}>Reset All Filters</button>
                </div>
              )}
            </div>

            {!loading && shown < results.length && (
              <div className="inv-more" ref={sentinel}>
                <div className="inv-more-dots" aria-hidden="true"><i /><i /><i /></div>
                <button className="inv-more-btn" onClick={() => setShown((n) => n + PAGE)}>
                  Load {Math.min(PAGE, results.length - shown)} more
                </button>
                <p className="inv-more-count">Showing {shown} of {results.length}</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </Layout>
  );
}
