const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch("cars.json")
  .then((res) => res.json())
  .then((cars) => {
    const car = cars.find((c) => c.id == id);
    if (!car) return;

    // Images
    const imagesContainer = document.querySelector(".car-images");
    imagesContainer.innerHTML = car.images
      .map(
        (img) => `
      <img src="${img}" alt="${car.make} ${car.model}">
    `
      )
      .join("");

    // Info
    const info = document.querySelector(".car-info");
    info.innerHTML = `
      <h1>${car.make} ${car.model}</h1>
      <p><strong>Price:</strong> $${car.price.toLocaleString()}</p>
      <p><strong>Year:</strong> ${car.year}</p>
      <p><strong>Mileage:</strong> ${car.mileage.toLocaleString()} miles</p>
      <p><strong>Engine:</strong> ${car.engine}</p>
      <p><strong>Transmission:</strong> ${car.transmission}</p>
      <p><strong>Color:</strong> ${car.color}</p>
      <p><strong>Stock:</strong> ${car.stock}</p>
      <p><strong>VIN:</strong> ${car.vin}</p>
      <p>${car.description}</p>
      <h3>Features:</h3>
      <ul>${car.features.map((f) => `<li>${f}</li>`).join("")}</ul>
      <div class="car-buttons">
        <a href="#test-drive" class="btn btn-test">Test Drive</a>
      </div>
    `;
  });
