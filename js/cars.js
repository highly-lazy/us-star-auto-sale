// cars.js
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".cars-grid");
  if (!grid) return;

  fetch("cars.json")
    .then((res) => res.json())
    .then((cars) => {
      grid.innerHTML = cars
        .map(
          (car) => `
        <div class="car-card">
          <img src="${car.img}" alt="${car.make} ${car.model}">
          <div class="car-info">
            <h3>${car.make} ${car.model}</h3>
            <p>Year: ${
              car.year
            } | Mileage: ${car.mileage.toLocaleString()} miles</p>
            <p>Price: $${car.price.toLocaleString()}</p>
            <div class="car-buttons">
              <a href="car.html?id=${
                car.id
              }" class="btn btn-view">View Details</a>
              <a href="#test-drive" class="btn btn-test">Test Drive</a>
            </div>
          </div>
        </div>
      `
        )
        .join("");
    });
});
