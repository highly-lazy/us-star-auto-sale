// main.js - navigation (site is always dark)

(function () {
  // Force dark mode always
  document.documentElement.dataset.theme = "dark";

  document.addEventListener("DOMContentLoaded", () => {
    // mark hero pages
    if (document.querySelector(".hero")) document.body.classList.add("has-hero");

    // mobile menu
    const sidebar = document.getElementById("sidebar");
    const menuBtn = document.getElementById("menuBtn");
    const closeBtn = document.getElementById("closeBtn");
    const overlay = document.getElementById("overlay");

    function closeSidebar() {
      sidebar?.classList.remove("active");
      overlay?.classList.remove("active");
    }

    menuBtn?.addEventListener("click", () => {
      sidebar?.classList.add("active");
      overlay?.classList.add("active");
    });

    closeBtn?.addEventListener("click", closeSidebar);
    overlay?.addEventListener("click", closeSidebar);

    // Floating "Text Us" button (Prime Motors style)
    if (!document.querySelector(".floating-textus")) {
      const a = document.createElement("a");
      a.className = "floating-textus";
      a.href = "sms:+18653773230";
      a.setAttribute("aria-label", "Text US Star Auto Sale");
      a.innerHTML = "TEXT US";
      document.body.appendChild(a);
    }

    
    // Legal disclaimer collapse/expand (Home)
    const legalToggle = document.querySelector(".legal-toggle");
    const legalCard = document.querySelector(".legal-card");
    if (legalToggle && legalCard) {
      legalToggle.addEventListener("click", () => {
        const open = legalCard.classList.toggle("is-open");
        legalToggle.setAttribute("aria-expanded", open ? "true" : "false");
        legalToggle.textContent = open ? "Hide terms" : "Read full terms";
      });
    }

// theme toggle removed
  });
})();
