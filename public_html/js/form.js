// form.js

/* ---------------------------
   Populate car dropdown & preview
--------------------------- */
async function populateCarOptions(selectId, imageId) {
  const carSelect = document.getElementById(selectId);
  const carImage = document.getElementById(imageId);
  if (!carSelect) return;

  try {
    const response = await fetch("cars.json");
    const cars = await response.json();

    cars.forEach((car) => {
      const option = document.createElement("option");
      option.value = car.id;
      option.textContent = `${car.year} ${car.make} ${car.model} ($${car.price})`;
      carSelect.appendChild(option);
    });

    if (carImage) carImage.style.display = "none";

    carSelect.addEventListener("change", () => {
      const selected = cars.find((c) => c.id == carSelect.value);
      if (selected && carImage) {
        carImage.src = selected.img;
        carImage.style.display = "block";
      } else if (carImage) {
        carImage.style.display = "none";
      }
    });
  } catch (err) {
    console.error("Error loading cars:", err);
  }
}

/* ---------------------------
   Handle form submit
--------------------------- */
function handleFormSubmit(formId, statusId, formType) {
  const form = document.getElementById(formId);
  const statusEl = document.getElementById(statusId);
  if (!form || !statusEl) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    formData.append("form_type", formType); // **PHP bilan moslash**

    try {
      const response = await fetch("sendtg.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json(); // PHP JSON qaytarsin

      if (result.status === "ok") {
        statusEl.innerText = "Message sent successfully!";
        form.reset();
        const img = form.querySelector("img");
        if (img) img.style.display = "none";
      } else {
        statusEl.innerText = result.message || "Error sending message.";
      }
    } catch (err) {
      console.error(err);
      statusEl.innerText = "Error sending message.";
    }
  });
}

/* ---------------------------
   Financing step form logic
--------------------------- */
function initFinancingSteps() {
  const steps = document.querySelectorAll(".form-step");
  const nextBtns = document.querySelectorAll(".next");
  const prevBtns = document.querySelectorAll(".prev");
  const progress = document.getElementById("progress");

  if (!steps.length) return;

  let currentStep = 0;

  function updateForm() {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === currentStep);
    });

    if (progress) {
      progress.style.width = ((currentStep + 1) / steps.length) * 100 + "%";
    }
  }

  nextBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        updateForm();
      }
    })
  );

  prevBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        updateForm();
      }
    })
  );

  updateForm();
}

/* ---------------------------
   DOM Ready init
--------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // Populate car selects
  populateCarOptions("carSelect", "selectedCarImage");
  populateCarOptions("tradeCarSelect", "tradeCarImage");

  // Forms
  handleFormSubmit("contactForm", "formStatus", "contact");
  handleFormSubmit("financingForm", "financingStatus", "financing");
  handleFormSubmit("tradeForm", "tradeStatus", "tradein");

  // Financing steps
  initFinancingSteps();
});
