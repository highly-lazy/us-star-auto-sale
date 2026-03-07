// car.js
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  fetch("cars.json", { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error("cars.json not found");
      return res.json();
    })
    .then((cars) => {
      const list = (Array.isArray(cars)?cars:[]).map((c,i)=>window.USStarUtils?.normalizeCar?window.USStarUtils.normalizeCar(c,i):c);

      const car = list.find((c) => String(c.id) === String(id));
      if (!car) return;

      const fuelType = (c) => {
        const explicit = c.fuel || c.fuelType || c.fuel_type;
        if (explicit) return String(explicit);
        const m = `${c.make ?? ""} ${c.model ?? ""} ${c.engine ?? ""}`;
        if (/hybrid/i.test(m)) return "Hybrid";
        if (/electric|\bev\b|tesla/i.test(m)) return "Electric";
        if (/diesel/i.test(m)) return "Diesel";
        return "Gas";
      };

      // Images
      const imagesContainer = document.querySelector(".car-images");
      if (imagesContainer) {
        const imgs = Array.isArray(car.images) && car.images.length ? car.images : [car.img].filter(Boolean);
        const safeImgs = imgs.filter(Boolean);

        imagesContainer.innerHTML = `
          <div class="car-gallery" data-gallery>
            <div class="car-thumbs" data-thumbs>
              ${safeImgs
                .map(
                  (src, i) => `
                    <button class="car-thumb ${i === 0 ? "is-active" : ""}" type="button" data-thumb="${i}" aria-label="View image ${i + 1}">
                      <img src="${src}" alt="${car.make || ""} ${car.model || ""} thumbnail ${i + 1}">
                    </button>
                  `,
                )
                .join("")}
            </div>

            <div class="car-main">
              <img data-main src="${safeImgs[0]}" alt="${car.make || ""} ${car.model || ""}">
              <div class="car-nav" aria-hidden="false">
                <button type="button" data-prev aria-label="Previous image">‹</button>
                <button type="button" data-next aria-label="Next image">›</button>
              </div>
            </div>
          </div>
        `;

        // Slider logic
        const mainImg = imagesContainer.querySelector("[data-main]");
        const thumbs = Array.from(imagesContainer.querySelectorAll("[data-thumb]"));
        const prevBtn = imagesContainer.querySelector("[data-prev]");
        const nextBtn = imagesContainer.querySelector("[data-next]");

        let idx = 0;
        const setIdx = (next) => {
          if (!mainImg) return;
          idx = (next + safeImgs.length) % safeImgs.length;
          mainImg.src = safeImgs[idx];
          thumbs.forEach((t) => t.classList.remove("is-active"));
          thumbs[idx]?.classList.add("is-active");
          thumbs[idx]?.scrollIntoView({ block: "nearest", inline: "nearest" });
        };

        thumbs.forEach((t) =>
          t.addEventListener("click", () => {
            const n = Number(t.getAttribute("data-thumb"));
            if (Number.isFinite(n)) setIdx(n);
          }),
        );
        prevBtn?.addEventListener("click", () => setIdx(idx - 1));
        nextBtn?.addEventListener("click", () => setIdx(idx + 1));

        // Keyboard
        window.addEventListener("keydown", (e) => {
          if (e.key === "ArrowLeft") setIdx(idx - 1);
          if (e.key === "ArrowRight") setIdx(idx + 1);
        });
      }

      // CARFAX block (only if car.carfax === true)
      const carfaxHTML = car.carfax
        ? `
          <div class="car-trust">
            <span class="car-trust__badge">
              📄 Vehicle History Report Available (CARFAX / AutoCheck)
            </span>
            <p class="car-trust__note">
              Ask our team for the vehicle history report for this listing.
            </p>
          </div>
        `
        : "";

      // Info
      const info = document.querySelector(".car-info");
      if (info) {
        const price = Number(car.price);
        const mileage = Number(car.mileage);

        info.innerHTML = `
          <div class="car-title-row"><h1 class="car-title">${car.make || ""} ${car.model || ""}</h1>
          <button class="fav-btn fav-btn--large" type="button" data-fav-btn="${car.id}" aria-label="Save vehicle" aria-pressed="false">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s-7-4.6-9.2-8.7C.9 8.7 3 5.5 6.4 5.1c1.7-.2 3.4.6 4.3 2 1-1.4 2.7-2.2 4.3-2 3.4.4 5.5 3.6 3.6 7.2C19 16.4 12 21 12 21Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
            <span>Save</span>
          </button></div>

          <p class="car-price"><strong>Price:</strong> ${
            Number.isFinite(price) ? `$${price.toLocaleString()}` : (car.price ?? "")
          }</p>

          <p class="car-mileage"><strong>Mileage:</strong> ${
            Number.isFinite(mileage) ? `${mileage.toLocaleString()} miles` : (car.mileage ?? "")
          }</p>

          ${carfaxHTML}

          <p><strong>Year:</strong> ${car.year ?? ""}</p>
          <p><strong>Engine:</strong> ${car.engine ?? ""}</p>
          <p><strong>Fuel:</strong> ${fuelType(car)}</p>
          <p><strong>Transmission:</strong> ${car.transmission ?? ""}</p>
          <p><strong>Color:</strong> ${car.color ?? ""}</p>
          <p><strong>Stock:</strong> ${car.stock ?? ""}</p>
          <p><strong>VIN:</strong> ${car.vin ?? ""}</p>

          <p class="car-description">${car.description ?? ""}</p>

          <h3>Features:</h3>
          <ul class="car-features">
            ${(Array.isArray(car.features) ? car.features : [])
              .map((f) => `<li>${f}</li>`)
              .join("")}
          </ul>

          <div class="car-buttons">
            <a href="testdrive.html?car=${encodeURIComponent(`${car.year ?? ""} ${car.make ?? ""} ${car.model ?? ""}`.trim())}" class="btn btn-test">Test Drive</a>
            <a href="tel:+18653773230" class="btn btn-call">Call Now</a>
          </div>
        `;
        window.USStarFavs?.syncButtons?.(info);
      }
    })
    .catch((err) => {
      console.error(err);
    });
});
