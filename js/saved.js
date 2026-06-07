// saved.js - render favorites
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("savedGrid");
  if (!grid) return;

  const toNum = (v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const fuelType = (c) => {
    const explicit = c.fuel || c.fuelType || c.fuel_type;
    if (explicit) return String(explicit);
    const m = `${c.make ?? ""} ${c.model ?? ""} ${c.engine ?? ""}`;
    if (/hybrid/i.test(m)) return "Hybrid";
    if (/electric|\bev\b|tesla/i.test(m)) return "Electric";
    if (/diesel/i.test(m)) return "Diesel";
    return "Gas";
  };

  function badgeFor(car) {
    const price = toNum(car.price);
    const mileage = toNum(car.mileage);
    if (price !== null && price <= 8000) return { text: "SPECIAL", cls: "deal-badge--special" };
    if (mileage !== null && mileage <= 70000) return { text: "GOOD DEAL", cls: "deal-badge--good" };
    return { text: "SAVED", cls: "deal-badge--good" };
  }

  function render(cars){
    if(!cars.length){
      grid.innerHTML = `<div class="empty-state">No saved vehicles yet.</div>`;
      return;
    }
    grid.innerHTML = cars.map((car)=>{
      const price = toNum(car.price);
      const mileage = toNum(car.mileage);
      const badge = badgeFor(car);
      return `
        <div class="car-card">
          <a class="car-media" href="car.html?id=${car.id}">
            <span class="deal-badge ${badge.cls}">${badge.text}</span>
            <button class="fav-btn" type="button" data-fav-btn="${car.id}" aria-label="Remove from saved" aria-pressed="true">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s-7-4.6-9.2-8.7C.9 8.7 3 5.5 6.4 5.1c1.7-.2 3.4.6 4.3 2 1-1.4 2.7-2.2 4.3-2 3.4.4 5.5 3.6 3.6 7.2C19 16.4 12 21 12 21Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
            </button>
            <img src="${car.img}" alt="${car.make ?? ""} ${car.model ?? ""}">
          </a>
          <div class="car-info">
            <div class="car-top">
              <h3>${car.year ?? ""} ${car.make ?? ""} ${car.model ?? ""}</h3>
              <div class="car-price">$${price !== null ? price.toLocaleString() : (car.price ?? "")}</div>
            </div>
            <div class="car-meta">
              <span>${mileage !== null ? mileage.toLocaleString() : (car.mileage ?? "")} mi</span>
              <span>${fuelType(car)}</span>
              <span>Stock: ${car.stock ?? "—"}</span>
            </div>
            <div class="car-buttons">
              <a href="car.html?id=${car.id}" class="btn btn-view">View Details</a>
              <a href="testdrive.html?car=${encodeURIComponent(`${car.year ?? ""} ${car.make ?? ""} ${car.model ?? ""}`.trim())}" class="btn btn-test">Test Drive</a>
            </div>
          </div>
        </div>
      `;
    }).join("");
    window.USStarFavs?.syncButtons?.(grid);
  }

  fetch("cars.json", { cache: "no-store" })
    .then((r)=>r.json())
    .then((cars)=>{
      const ids = window.USStarFavs?.read?.() ?? [];
      const set = new Set(ids.map(String));
      const list = (Array.isArray(cars)?cars:[]).map((c,i)=>window.USStarUtils?.normalizeCar?window.USStarUtils.normalizeCar(c,i):c).filter((c)=> set.has(String(c.id)));
      // newest first
      list.sort((a,b)=>(toNum(b.id)??0)-(toNum(a.id)??0));
      render(list);
    })
    .catch(()=>{ grid.innerHTML = `<div class="empty-state">Saved list failed to load.</div>`; });

  // Re-render on storage changes (other tab)
  window.addEventListener("storage", (e)=>{ if(e.key === "usstar_favorites_v1") location.reload(); });
});
