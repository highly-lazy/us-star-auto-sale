import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

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

// Site is always dark
document.documentElement.dataset.theme = "dark";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
