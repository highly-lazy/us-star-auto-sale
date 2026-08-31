import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { LanguageProvider } from "./lib/i18n.jsx";

// Global stylesheets (order matters — mirrors the original cascade)
import "./css/variables.css";
import "./css/normalize.css";
import "./css/base.css";
import "./css/layout.css";
import "./css/components.css";
import "./css/pages.css";
import "./css/final.css";
import "./css/perf.css";
import "./css/financing.css";
import "./css/tradein.css";
import "./css/app.css";
import "./css/redesign.css";

/* Page stylesheets last: they refine the shared redesign layer, and loading
   them from here keeps dev (module order) and build (bundle order) identical. */
import "./css/inventory-page.css";
import "./css/inventory-v2.css";
import "./css/cardetail.css";
import "./css/cardetail-v2.css";
import "./css/nav-sale.css";

// Site is always dark
document.documentElement.dataset.theme = "dark";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>,
);
