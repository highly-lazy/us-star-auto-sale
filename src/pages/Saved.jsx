import { useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import CarCardClassic from "../components/CarCardClassic.jsx";
import { useCars } from "../lib/useCars.js";
import { useFavorites } from "../lib/favorites.js";

export default function Saved() {
  const { cars, error } = useCars();
  const { ids } = useFavorites();

  const saved = useMemo(() => {
    const set = new Set(ids.map(String));
    return cars
      .filter((c) => set.has(String(c.id)))
      .sort((a, b) => Number(b.id) - Number(a.id));
  }, [cars, ids]);

  return (
    <Layout bodyClass="page-saved" bodyStyle={{ "--page-bg-image": "url('/assets/images/fon1.png')" }}>
      <section className="section container">
        <div className="section-head">
          <div>
            <h2 className="section-title">Saved Vehicles</h2>
            <p className="section-subtitle">Tap the heart again to remove a vehicle from your saved list.</p>
          </div>
          <Link className="btn btn-ghost btn-small" to="/inventory">Browse Inventory</Link>
        </div>

        <div className="cars-grid">
          {error ? (
            <div className="empty-state">Saved list failed to load.</div>
          ) : saved.length ? (
            saved.map((car) => <CarCardClassic key={car.id} car={car} variant="saved" fallbackBadge="SAVED" />)
          ) : (
            <div className="empty-state">No saved vehicles yet.</div>
          )}
        </div>
      </section>
    </Layout>
  );
}
