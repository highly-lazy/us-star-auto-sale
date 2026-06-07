// favorites.js — localStorage favorites with a tiny pub/sub so all components
// (heart buttons + nav badge) stay in sync. Ported from js/favorites.js.
import { useEffect, useState, useCallback } from "react";

const KEY = "usstar_favorites_v1";
const listeners = new Set();

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.map(String) : [];
  } catch {
    return [];
  }
}

function write(arr) {
  localStorage.setItem(
    KEY,
    JSON.stringify(Array.from(new Set(arr.map(String)))),
  );
  listeners.forEach((fn) => fn());
}

export function toggleFavorite(id) {
  const cur = read();
  const sid = String(id);
  const i = cur.indexOf(sid);
  if (i >= 0) cur.splice(i, 1);
  else cur.push(sid);
  write(cur);
  return cur.includes(sid);
}

export function getFavorites() {
  return read();
}

function subscribe(fn) {
  listeners.add(fn);
  const onStorage = (e) => {
    if (e.key === KEY) fn();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

// Returns the full list of saved ids and reacts to changes anywhere.
export function useFavorites() {
  const [ids, setIds] = useState(read);
  useEffect(() => subscribe(() => setIds(read())), []);
  const toggle = useCallback((id) => toggleFavorite(id), []);
  return { ids, count: ids.length, toggle, isFav: (id) => ids.includes(String(id)) };
}

// Convenience hook for a single car's saved state.
export function useFavorite(id) {
  const { ids, toggle } = useFavorites();
  return {
    saved: ids.includes(String(id)),
    toggle: () => toggle(id),
  };
}
