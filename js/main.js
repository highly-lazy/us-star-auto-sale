// main.js
document.addEventListener("DOMContentLoaded", () => {
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
});
