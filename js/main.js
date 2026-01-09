document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menuBtn");
  const closeBtn = document.getElementById("closeBtn");
  const overlay = document.getElementById("overlay");

  function close() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  }

  menuBtn?.addEventListener("click", () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
  });

  closeBtn?.addEventListener("click", close);
  overlay?.addEventListener("click", close);
});

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(contactForm);

  fetch("sendtg.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.text())
    .then((data) => {
      formStatus.textContent = data;
      contactForm.reset();
    })
    .catch((err) => {
      formStatus.textContent = "Error sending message!";
      console.error(err);
    });
});
