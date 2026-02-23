// cars.js - inventory page search/sort + rendering
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".cars-grid");
  if (!grid) return;

  const searchInput = document.getElementById("inventorySearch");
  const sortSelect = document.getElementById("inventorySort");

  // Filters
  const filterWrap = document.getElementById("invFilters");
  const filtersOpen = document.getElementById("filtersOpen");
  const filtersClose = document.getElementById("filtersClose");
  const filterApply = document.getElementById("filterApply");
  const filterReset = document.getElementById("filterReset");
  const filterMake = document.getElementById("filterMake");
  const filterModel = document.getElementById("filterModel");
  const makeSuggest = document.getElementById("makeSuggest");
  const modelSuggest = document.getElementById("modelSuggest");
  const yearMin = document.getElementById("yearMin");
  const yearMax = document.getElementById("yearMax");
  const priceMin = document.getElementById("priceMin");
  const priceMax = document.getElementById("priceMax");
  const mileageMax = document.getElementById("mileageMax");

  let allCars = [];
  let allMakes = [];
  let allModels = [];

  const normalize = (v) => String(v ?? "").toLowerCase().trim();
  const toNum = (v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

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

  function badgeFor(car) {
    const price = toNum(car.price);
    const mileage = toNum(car.mileage);
    if (price !== null && price <= 8000) return { text: "SPECIAL", cls: "deal-badge--special" };
    if (mileage !== null && mileage <= 70000) return { text: "GOOD DEAL", cls: "deal-badge--good" };
    return { text: "FEATURED", cls: "deal-badge--good" };
  }

  function render(cars) {
    if (!cars.length) {
      grid.innerHTML = `<div class="empty-state">No vehicles found.</div>`;
      return;
    }

    grid.innerHTML = cars
      .map((car) => {
        const price = toNum(car.price);
        const mileage = toNum(car.mileage);
        const badge = badgeFor(car);
        return `
          <div class="car-card">
            <a class="car-media" href="car.html?id=${car.id}">
              <span class="deal-badge ${badge.cls}">${badge.text}</span>
              <button class="fav-btn" type="button" data-fav-btn="${car.id}" aria-label="Save vehicle" aria-pressed="false">
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
              <div class="car-platform">
                <a href="https://www.cargurus.com/Cars/m-US-Star-Auto-Group-LLC-sp463559" target="_blank" rel="noopener">
                  <img src="assets/icons/cargurus.svg" alt="CarGurus" />
                  <span>CarGurus</span>
                </a>
                <span class="pill">Also on CarGurus</span>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
    window.USStarFavs?.syncButtons?.(grid);
  }

  function uniq(list) {
    return Array.from(new Set(list.filter(Boolean))).sort((a, b) => String(a).localeCompare(String(b)));
  }

  function renderSuggest(panel, items, onPick) {
    if (!panel) return;
    if (!items.length) {
      panel.innerHTML = `<div class="suggest-empty">No matches</div>`;
      return;
    }
    panel.innerHTML = items
      .slice(0, 24)
      .map((v) => `<button class="suggest-item" type="button" role="option">${v}</button>`)
      .join("");
    panel.querySelectorAll(".suggest-item").forEach((btn) => {
      btn.addEventListener("click", () => onPick(btn.textContent || ""));
    });
  }

  function openSuggest(input, panel) {
    if (!input || !panel) return;
    panel.classList.add("is-open");
    input.setAttribute("aria-expanded", "true");
  }

  function closeSuggest(input, panel) {
    if (!input || !panel) return;
    panel.classList.remove("is-open");
    input.setAttribute("aria-expanded", "false");
  }

  function filterSuggest(list, query) {
    const q = normalize(query);
    if (!q) return list;
    return list.filter((v) => normalize(v).includes(q));
  }

  function populateFilters() {
    if (!filterMake || !filterModel) return;
    allMakes = uniq(allCars.map((c) => c.make));
    filterMake.value = "";
    allModels = [];
    filterModel.value = "";

    // seed suggestion panels
    renderSuggest(makeSuggest, allMakes, (picked) => {
      filterMake.value = picked;
      updateModelOptions();
      applyFilterAndSort();
      closeSuggest(filterMake, makeSuggest);
    });
  }

  function updateModelOptions() {
    if (!filterMake || !filterModel) return;
    const make = normalize(filterMake.value);
    allModels = uniq(
      allCars
        .filter((c) => !make || normalize(c.make) === make)
        .map((c) => c.model),
    );
    const current = filterModel.value;
    if (!allModels.includes(current)) filterModel.value = "";
    renderSuggest(modelSuggest, allModels, (picked) => {
      filterModel.value = picked;
      applyFilterAndSort();
      closeSuggest(filterModel, modelSuggest);
    });
  }

  function applyFilterAndSort() {
    const q = normalize(searchInput?.value);

    // structured filters
    const make = normalize(filterMake?.value);
    const model = normalize(filterModel?.value);
    const yMin = toNum(yearMin?.value);
    const yMax = toNum(yearMax?.value);
    const pMin = toNum(priceMin?.value);
    const pMax = toNum(priceMax?.value);
    const mMax = toNum(mileageMax?.value);

    let filtered = [...allCars]
      .filter((c) => (!make ? true : normalize(c.make) === make))
      .filter((c) => (!model ? true : normalize(c.model) === model))
      .filter((c) => {
        const y = toNum(c.year);
        if (yMin !== null && (y === null || y < yMin)) return false;
        if (yMax !== null && (y === null || y > yMax)) return false;
        return true;
      })
      .filter((c) => {
        const p = toNum(c.price);
        if (pMin !== null && (p === null || p < pMin)) return false;
        if (pMax !== null && (p === null || p > pMax)) return false;
        return true;
      })
      .filter((c) => {
        const m = toNum(c.mileage);
        if (mMax !== null && (m === null || m > mMax)) return false;
        return true;
      });

    // text search
    filtered = !q ? filtered : filtered.filter((c) => carText(c).includes(q));

    const sort = sortSelect?.value || "new";
    if (sort === "priceAsc") {
      filtered.sort((a, b) => (toNum(a.price) ?? 1e18) - (toNum(b.price) ?? 1e18));
    } else if (sort === "priceDesc") {
      filtered.sort((a, b) => (toNum(b.price) ?? -1) - (toNum(a.price) ?? -1));
    } else if (sort === "mileageAsc") {
      filtered.sort((a, b) => (toNum(a.mileage) ?? 1e18) - (toNum(b.mileage) ?? 1e18));
    } else {
      // newest first (id as fallback)
      filtered.sort((a, b) => (toNum(b.id) ?? 0) - (toNum(a.id) ?? 0));
    }

    render(filtered);
  }

  fetch("cars.json", { cache: "no-store" })
    .then((res) => res.json())
    .then((cars) => {
      allCars = (Array.isArray(cars) ? cars : []).map((c,i)=>window.USStarUtils?.normalizeCar?window.USStarUtils.normalizeCar(c,i):c);
      populateFilters();
      updateModelOptions();
      applyFilterAndSort();
    })
    .catch(() => {
      grid.innerHTML = `<div class="empty-state">Inventory failed to load.</div>`;
    });

  let t;
  searchInput?.addEventListener("input", () => {
    window.clearTimeout(t);
    t = window.setTimeout(applyFilterAndSort, 120);
  });
  sortSelect?.addEventListener("change", applyFilterAndSort);

  // filter events
  function wireSuggest(input, panel, getList, onCommit) {
    if (!input || !panel) return;
    input.addEventListener("focus", () => {
      renderSuggest(panel, filterSuggest(getList(), input.value), (picked) => {
        input.value = picked;
        onCommit();
        closeSuggest(input, panel);
      });
      openSuggest(input, panel);
    });
    input.addEventListener("input", () => {
      renderSuggest(panel, filterSuggest(getList(), input.value), (picked) => {
        input.value = picked;
        onCommit();
        closeSuggest(input, panel);
      });
      openSuggest(input, panel);
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeSuggest(input, panel);
      if (e.key === "Enter") {
        e.preventDefault();
        closeSuggest(input, panel);
        onCommit();
      }
    });
  }

  wireSuggest(filterMake, makeSuggest, () => allMakes, () => {
    updateModelOptions();
    applyFilterAndSort();
  });

  wireSuggest(filterModel, modelSuggest, () => allModels, () => {
    applyFilterAndSort();
  });

  // click outside closes suggestions
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (!t.closest("#filterMake") && !t.closest("#makeSuggest")) closeSuggest(filterMake, makeSuggest);
    if (!t.closest("#filterModel") && !t.closest("#modelSuggest")) closeSuggest(filterModel, modelSuggest);
  });
  [yearMin, yearMax, priceMin, priceMax, mileageMax].forEach((el) => el?.addEventListener("input", () => {
    window.clearTimeout(t);
    t = window.setTimeout(applyFilterAndSort, 180);
  }));
  filterApply?.addEventListener("click", () => {
    applyFilterAndSort();
    filterWrap?.classList.remove("is-open");
  });
  filterReset?.addEventListener("click", () => {
    if (filterMake) filterMake.value = "";
    if (filterModel) filterModel.value = "";
    [yearMin, yearMax, priceMin, priceMax, mileageMax].forEach((el) => { if (el) el.value = ""; });
    updateModelOptions();
    applyFilterAndSort();
  });

  // mobile drawer
  filtersOpen?.addEventListener("click", () => filterWrap?.classList.add("is-open"));
  filtersClose?.addEventListener("click", () => filterWrap?.classList.remove("is-open"));
  // Mobile UX: keep filters always visible (premium)
  function ensureMobileFilters(){
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!filterWrap) return;
    if (isMobile){
      filterWrap.classList.add("is-open");
      document.getElementById("filtersOpen")?.setAttribute("style","display:none");
      document.getElementById("filtersClose")?.setAttribute("style","display:none");
    } else {
      document.getElementById("filtersOpen")?.removeAttribute("style");
      document.getElementById("filtersClose")?.removeAttribute("style");
      // keep desktop behavior unchanged
    }
  }
  ensureMobileFilters();
  window.addEventListener("resize", () => {
    window.clearTimeout(window.__invResizeT);
    window.__invResizeT = window.setTimeout(ensureMobileFilters, 120);
  });

});
