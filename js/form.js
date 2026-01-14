/* =========================
   Telegram send function
========================= */
async function sendToTelegram(message) {
  const botToken = "8169526689:AAE44HRYOM_tr0u-kTZu5lQ2jujB7HtwdqA"; // <-- BotFather token
  const chatId = "6712355661"; // <-- Sizning Telegram chat ID

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

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    let message = `New Form Submission (${formId}):\n`;

    for (let [key, value] of formData.entries()) {
      message += `${key}: ${value}\n`;
    }

    // Agar car select va rasm bo'lsa
    if (carSelectId) {
      const carSelect = document.getElementById(carSelectId);
      const carImg = document.getElementById(carImgId);
      if (carSelect) {
        const selectedOption = carSelect.options[carSelect.selectedIndex];
        message += `Selected Car: ${selectedOption.text}\n`;
      }
      if (carImg && carImg.src) {
        message += `Car Image: ${carImg.src}\n`;
      }
    }

    sendToTelegram(message); // Telegramga yuborish

    form.reset();
    if (carImgId) {
      const carImg = document.getElementById(carImgId);
      if (carImg) carImg.style.display = "none";
    }

    alert("Message sent We will get back to you !");
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
    if (selectedCar && img) {
      img.src = selectedCar.img;
      img.style.display = "block";
    } else if (img) {
      img.src = "";
      img.style.display = "none";
    }
  });
}
// js/financing-steps.js

function setupMultiStepForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const steps = form.querySelectorAll(".form-step");
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
});
