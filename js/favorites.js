// favorites.js - localStorage favorites (Prime Motors heart)
(function(){
  const KEY = "usstar_favorites_v1";

  function read(){
    try{
      const raw = localStorage.getItem(KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.map(String) : [];
    }catch(e){ return []; }
  }

  function write(arr){
    localStorage.setItem(KEY, JSON.stringify(Array.from(new Set(arr.map(String)))));
  }

  function isFav(id){
    return read().includes(String(id));
  }

  function toggle(id){
    const cur = read();
    const sid = String(id);
    const idx = cur.indexOf(sid);
    if (idx >= 0) cur.splice(idx, 1);
    else cur.push(sid);
    write(cur);
    return cur.includes(sid);
  }

  function count(){
    return read().length;
  }

  // Expose globally
  function syncButtons(root){
    const scope = root || document;
    scope.querySelectorAll('[data-fav-btn]').forEach((btn)=>{
      const id = btn.getAttribute('data-fav-btn');
      const on = isFav(id);
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  window.USStarFavs = { read, write, isFav, toggle, count, syncButtons };

  function updateBadge(){
    document.querySelectorAll("[data-fav-count]").forEach((el)=>{ el.textContent = String(count()); });
  }

  // Event delegation for heart buttons
  document.addEventListener("click", (e)=>{
    const btn = e.target.closest("[data-fav-btn]");
    if(!btn) return;
    e.preventDefault();
    e.stopPropagation();

    const id = btn.getAttribute("data-fav-btn");
    const on = toggle(id);
    btn.classList.toggle("is-active", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    updateBadge();
  });

  document.addEventListener("DOMContentLoaded", updateBadge);
})(); 
