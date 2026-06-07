import { Routes, Route, Navigate, useSearchParams } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Inventory from "./pages/Inventory.jsx";
import CarDetail from "./pages/CarDetail.jsx";
import Saved from "./pages/Saved.jsx";
import Financing from "./pages/Financing.jsx";
import TradeIn from "./pages/TradeIn.jsx";
import TestDrive from "./pages/TestDrive.jsx";
import Contact from "./pages/Contact.jsx";
import CreditApplication from "./pages/CreditApplication.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import NotFound from "./pages/NotFound.jsx";

// Old car.html?id=5 → /car/5 (keeps shared bookmarks working)
function LegacyCarRedirect() {
  const [params] = useSearchParams();
  const id = params.get("id");
  return <Navigate to={id ? `/car/${id}` : "/inventory"} replace />;
}

// Old testdrive.html?car=... → /testdrive?car=... (preserve query)
function LegacyTestDriveRedirect() {
  const [params] = useSearchParams();
  const qs = params.toString();
  return <Navigate to={`/testdrive${qs ? `?${qs}` : ""}`} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/car/:id" element={<CarDetail />} />
      <Route path="/saved" element={<Saved />} />
      <Route path="/financing" element={<Financing />} />
      <Route path="/tradein" element={<TradeIn />} />
      <Route path="/testdrive" element={<TestDrive />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/credit-application" element={<CreditApplication />} />
      <Route path="/privacy-policy" element={<Privacy />} />
      <Route path="/terms-of-use" element={<Terms />} />

      {/* Legacy .html compatibility */}
      <Route path="/index.html" element={<Navigate to="/" replace />} />
      <Route path="/collection.html" element={<Navigate to="/inventory" replace />} />
      <Route path="/car.html" element={<LegacyCarRedirect />} />
      <Route path="/saved.html" element={<Navigate to="/saved" replace />} />
      <Route path="/financing.html" element={<Navigate to="/financing" replace />} />
      <Route path="/tradein.html" element={<Navigate to="/tradein" replace />} />
      <Route path="/testdrive.html" element={<LegacyTestDriveRedirect />} />
      <Route path="/contact.html" element={<Navigate to="/contact" replace />} />
      <Route path="/credit-application.html" element={<Navigate to="/credit-application" replace />} />
      <Route path="/privacy-policy.html" element={<Navigate to="/privacy-policy" replace />} />
      <Route path="/terms-of-use.html" element={<Navigate to="/terms-of-use" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
