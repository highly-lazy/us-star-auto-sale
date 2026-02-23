/* =========================
   Telegram send function
========================= */
async function sendToTelegram(message) {
  const botToken = "8169526689:AAE44HRYOM_tr0u-kTZu5lQ2jujB7HtwdqA"; // <-- BotFather token
  const chatId = "-1003451982775"; // <-- Sizning Telegram chat ID

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });
    const data = await res.json();
    if (!data.ok) console.error("Telegram API error:", data);
  } catch (err) {
    console.error("Telegram network error:", err);
  }
}

/* =========================
   Form submit handler
========================= */
function handleFormSubmit(formId, carSelectId = null, carImgId = null) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect ALL named fields (including empty)
    const values = {};
    const radios = {};

    Array.from(form.elements).forEach((el) => {
      if (!el || !el.name || el.disabled) return;

      const name = el.name;
      const type = (el.type || "").toLowerCase();

      if (type === "radio") {
        radios[name] = radios[name] || null;
        if (el.checked) radios[name] = el.value;
        return;
      }

      if (type === "checkbox") {
        values[name] = el.checked ? (el.value || "Yes") : "No";
        return;
      }

      // normal inputs/select/textarea
      values[name] = (el.value ?? "").toString().trim();
    });

    // Merge radio groups (even if not selected)
    Object.keys(radios).forEach((name) => {
      values[name] = radios[name] ?? "";
    });

    let message = `New Form Submission (${formId}):
`;

    // stable sort for easy reading
    Object.keys(values)
      .sort((a, b) => a.localeCompare(b))
      .forEach((key) => {
        const v = values[key];
        message += `${key}: ${v === "" ? "-" : v}
`;
      });

    // Optional car select + image
    if (carSelectId) {
      const carSelect = document.getElementById(carSelectId);
      const carImg = document.getElementById(carImgId);
      if (carSelect) {
        const selectedOption = carSelect.options[carSelect.selectedIndex];
        if (selectedOption && selectedOption.value) {
          message += `Selected Car: ${selectedOption.text}
`;
        }
      }
      if (carImg && carImg.src) {
        message += `Car Image: ${carImg.src}
`;
      }
    }

    await sendToTelegram(message);

    form.reset();
    if (carImgId) {
      const carImg = document.getElementById(carImgId);
      if (carImg) carImg.style.display = "none";
    }

    alert("Message sent. We will get back to you!");
  });
}

/* =========================
   Cars dropdown & preview
========================= */
async function fetchCars() {
  const res = await fetch("cars.json");
  return await res.json();
}

async function setupCarSelect(selectId, imgId) {
  const cars = await fetchCars();
  const select = document.getElementById(selectId);
  const img = document.getElementById(imgId);
  if (!select) return;
  if (img) img.style.display = "none";

  cars.forEach((car) => {
    const option = document.createElement("option");
    option.value = car.id;
    option.textContent = `${car.year} ${car.make} ${car.model}`;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    const selectedCar = cars.find((c) => c.id == select.value);
    const vText = document.getElementById("finVehicleText");
    const vMeta = document.getElementById("finVehicleMeta");

    if (selectedCar) {
      if (img) {
        img.src = selectedCar.img;
        img.style.display = "block";
      }
      if (vText) vText.textContent = `${selectedCar.year} ${selectedCar.make} ${selectedCar.model}`;
      if (vMeta) {
        const miles = selectedCar.mileage ? `${Number(selectedCar.mileage).toLocaleString()} mi` : "";
        const trans = selectedCar.transmission || "";
        const price = selectedCar.price ? `$${Number(selectedCar.price).toLocaleString()}` : "";
        vMeta.textContent = [miles, trans, price].filter(Boolean).join(" • ") || "";
      }
    } else {
      if (img) {
        img.src = "";
        img.style.display = "none";
      }
      if (vText) vText.textContent = "Choose a vehicle (optional)";
      if (vMeta) vMeta.textContent = "We’ll match your application to inventory.";
    }
  });
}
// js/financing-steps.js

function setupMultiStepForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const steps = form.querySelectorAll(".form-step");
  if (!steps.length) return;
  let currentStep = 0;

  function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle("active", i === index);
    });
  }

  form.addEventListener("click", (e) => {
    if (e.target.classList.contains("next")) {
      if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
      }
    } else if (e.target.classList.contains("prev")) {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    }
  });

  showStep(currentStep); // start with first step visible
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  setupMultiStepForm("financingForm");
});

/* =========================
   Init
========================= */
document.addEventListener("DOMContentLoaded", () => {
  setupCarSelect("carSelect", "selectedCarImage"); // financing.html
  setupCarSelect("tradeCarSelect", "tradeCarImage"); // tradein.html

  handleFormSubmit("contactForm");
  handleFormSubmit("financingForm", "carSelect", "selectedCarImage");
  handleFormSubmit("tradeForm", "tradeCarSelect", "tradeCarImage");
  handleFormSubmit("testDriveForm");

  // Prefill test drive car (if coming from inventory)
  const carField = document.querySelector("#testDriveForm [name='car']");
  if (carField) {
    const params = new URLSearchParams(window.location.search);
    const carName = params.get("car");
    if (carName) carField.value = carName;
  }
});
