// home.js - featured inventory on homepage (Prime Motors style)
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("featuredGrid");
  if (!grid) return;

  const searchInput = document.getElementById("homeSearch");
  const heroSearch = document.getElementById("heroSearch");
  let allCars = [];

  const normalize = (v) => String(v ?? "").toLowerCase().trim();
  const carText = (c) =>
    [
      c.make,
      c.model,
      c.year,
      c.price,
      c.mileage,
      c.stock,
      c.vin,
      c.color,
      c.engine,
      c.transmission,
    ]
      .map(normalize)
      .join(" ");

  const fuelType = (c) => {
    const explicit = c.fuel || c.fuelType || c.fuel_type;
    if (explicit) return String(explicit);
    const m = `${c.make ?? ""} ${c.model ?? ""} ${c.engine ?? ""}`;
    if (/hybrid/i.test(m)) return "Hybrid";
    if (/electric|\bev\b|tesla/i.test(m)) return "Electric";
    if (/diesel/i.test(m)) return "Diesel";
    return "Gas";
  };

  function badgeFor(car){
    const price = Number(car.price);
    const mileage = Number(car.mileage);
    if (Number.isFinite(price) && price <= 8000) return { text: "SPECIAL", cls: "deal-badge--special" };
    if (Number.isFinite(mileage) && mileage <= 70000) return { text: "GOOD DEAL", cls: "deal-badge--good" };
    return { text: "FEATURED", cls: "deal-badge--good" };
  }

  function render(cars) {
    if (!cars.length) {
      grid.innerHTML = `<div class="empty-state">No vehicles found.</div>`;
      return;
    }

    grid.innerHTML = cars
      .map((car) => {
        const price = Number(car.price);
        const mileage = Number(car.mileage);
        const badge = badgeFor(car);
        return `
        <div class="car-card">
          <a class="car-media" href="car.html?id=${car.id}" aria-label="View ${car.year ?? ""} ${car.make ?? ""} ${car.model ?? ""}">
            <span class="deal-badge ${badge.cls}">${badge.text}</span>
            <button class="fav-btn" type="button" data-fav-btn="${car.id}" aria-label="Save vehicle" aria-pressed="false">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s-7-4.6-9.2-8.7C.9 8.7 3 5.5 6.4 5.1c1.7-.2 3.4.6 4.3 2 1-1.4 2.7-2.2 4.3-2 3.4.4 5.5 3.6 3.6 7.2C19 16.4 12 21 12 21Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
            </button>
            <img src="${car.img}" alt="${car.year ?? ""} ${car.make ?? ""} ${car.model ?? ""}">
          </a>
          <div class="car-info">
            <div class="car-top">
              <h3>${car.year ?? ""} ${car.make ?? ""} ${car.model ?? ""}</h3>
              <div class="car-price">$${Number.isFinite(price) ? price.toLocaleString() : (car.price ?? "")}</div>
            </div>
            <div class="car-meta">
              <span>${Number.isFinite(mileage) ? mileage.toLocaleString() : (car.mileage ?? "")} mi</span>
              <span>${fuelType(car)}</span>
              <span>Stock: ${car.stock ?? "—"}</span>
            </div>
            <div class="car-platform" aria-label="Vehicle listings and reports">
              <a href="https://www.cargurus.com/Cars/m-US-Star-Auto-Group-LLC-sp463559" target="_blank" rel="noopener" aria-label="View us on CarGurus">
                <img src="assets/icons/cargurus.svg" alt="CarGurus" />
                <span>CarGurus</span>
              </a>
              <a href="https://www.carfax.com/Reviews-US-Star-Auto-Sales-Knoxville-TN_RJR0DUB8CK" target="_blank" rel="noopener" aria-label="Read our CARFAX reviews">
                <img src="assets/icons/carfax.svg" alt="CARFAX" />
                <span>CARFAX</span>
              </a>
            </div>
          </div>
        </div>
      `;
      })
      .join("");
    window.USStarFavs?.syncButtons?.(grid);
  }

  function getQuery(){
    return normalize((heroSearch?.value || searchInput?.value) ?? "");
  }

  function applySearch() {
    const q = getQuery();
    const filtered = !q ? allCars : allCars.filter((c) => carText(c).includes(q));
    // Show first 8 on homepage like "Featured" section
    render(filtered.slice(0, 8));
  }

  fetch("cars.json", { cache: "no-store" })
    .then((r) => r.json())
    .then((cars) => {
      allCars = Array.isArray(cars) ? cars : [];
      // Newest first (by id as fallback)
      allCars.sort((a, b) => Number(b.id) - Number(a.id));
      applySearch();
    })
    .catch(() => {
      grid.innerHTML = `<div class="empty-state">Inventory failed to load.</div>`;
    });

  let t;
  function onType(){
    window.clearTimeout(t);
    t = window.setTimeout(applySearch, 120);
  }
  searchInput?.addEventListener("input", onType);
  heroSearch?.addEventListener("input", onType);
});
