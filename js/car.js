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
      const car = cars.find((c) => String(c.id) === String(id));
      if (!car) return;

      // Images
      const imagesContainer = document.querySelector(".car-images");
      if (imagesContainer) {
        const imgs = Array.isArray(car.images) ? car.images : [];
        imagesContainer.innerHTML = imgs
          .map((img) => `<img src="${img}" alt="${car.make || ""} ${car.model || ""}">`)
          .join("");
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
          <h1 class="car-title">${car.make || ""} ${car.model || ""}</h1>

          <p class="car-price"><strong>Price:</strong> ${
            Number.isFinite(price) ? `$${price.toLocaleString()}` : (car.price ?? "")
          }</p>

          <p class="car-mileage"><strong>Mileage:</strong> ${
            Number.isFinite(mileage) ? `${mileage.toLocaleString()} miles` : (car.mileage ?? "")
          }</p>

          ${carfaxHTML}

          <p><strong>Year:</strong> ${car.year ?? ""}</p>
          <p><strong>Engine:</strong> ${car.engine ?? ""}</p>
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
            <a href="index.html#contact" class="btn btn-test">Test Drive</a>
            <a href="tel:+18653773230" class="btn btn-call">Call Now</a>
          </div>
        `;
      }
    })
    .catch((err) => {
      console.error(err);
    });
});
