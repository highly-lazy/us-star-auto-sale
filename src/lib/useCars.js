import { useEffect, useState } from "react";
import { normalizeCar } from "./utils.js";

// Cache so we fetch cars.json only once across page navigations.
let _cache = null;
let _inflight = null;

function loadCars() {
  if (_cache) return Promise.resolve(_cache);
  if (_inflight) return _inflight;
  _inflight = fetch("/cars.json", { cache: "no-store" })
    .then((r) => {
      if (!r.ok) throw new Error("cars.json not found");
      return r.json();
    })
    .then((data) => {
      const list = (Array.isArray(data) ? data : []).map((c, i) =>
        normalizeCar(c, i),
      );
      _cache = list;
      return list;
    })
    .finally(() => {
      _inflight = null;
    });
  return _inflight;
}

export function useCars() {
  const [cars, setCars] = useState(_cache || []);
  const [loading, setLoading] = useState(!_cache);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    if (_cache) {
      setCars(_cache);
      setLoading(false);
      return;
    }
    loadCars()
      .then((list) => {
        if (alive) {
          setCars(list);
          setLoading(false);
        }
      })
      .catch(() => {
        if (alive) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  return { cars, loading, error };
}
