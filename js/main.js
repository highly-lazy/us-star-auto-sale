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


document.addEventListener("DOMContentLoaded", () => {
  const accordionGroup = document.querySelector("[data-accordion-v3]");
  const items = accordionGroup.querySelectorAll(".fin-acc-item");

  items.forEach((item) => {
    const trigger = item.querySelector(".fin-acc-trigger");
    const panel = item.querySelector(".fin-acc-panel");

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      // Avval hammasini yopish (optional - agar bittasi ochiq tursin desangiz)
      items.forEach((i) => {
        i.classList.remove("is-open");
        i.querySelector(".fin-acc-panel").style.maxHeight = null;
      });

      // Bosilganini ochish
      if (!isOpen) {
        item.classList.add("is-open");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  // Birinchisini standart ochib qo'yish
  if (items[0]) items[0].querySelector(".fin-acc-trigger").click();
});