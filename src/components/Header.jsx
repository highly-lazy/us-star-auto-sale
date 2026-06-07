import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useFavorites } from "../lib/favorites.js";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/inventory", label: "Inventory" },
  { to: "/saved", label: "Saved", saved: true },
  { to: "/financing", label: "Financing" },
  { to: "/tradein", label: "Trade‑In" },
  { to: "/testdrive", label: "Test Drive" },
  { to: "/contact", label: "Contact" },
  { to: "/credit-application", label: "Credit App" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useFavorites();
  const close = () => setOpen(false);

  const navLink = (item) => (
    <NavLink
      key={item.to}
      to={item.to}
      end={item.end}
      className={item.saved ? "nav-saved" : undefined}
      onClick={close}
    >
      {item.label}
      {item.saved && <span className="nav-badge">{count}</span>}
    </NavLink>
  );

  return (
    <>
      <header className="site-header">
        <div className="topbar">
          <div className="container topbar-inner">
            <div className="topbar-left">
              <span className="top-item">
                <svg className="ico" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 22s7-4.5 7-12a7 7 0 1 0-14 0c0 7.5 7 12 7 12Z" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 13.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="2" />
                </svg>
                Knoxville, TN
              </span>
              <span className="top-item">
                <svg className="ico" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Mon–Sat 9:00–6:00
              </span>
            </div>

            <div className="topbar-right">
              <Link className="top-link" to="/financing">
                <svg className="ico" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Apply Financing
              </Link>
              <a className="top-link" href="tel:+18653773230">
                <svg className="ico" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 3a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 2 .5 3 .6a2 2 0 0 1 1.7 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
                865-924-7326
              </a>
              <a className="top-link pulse" href="sms:+18653773230">
                <svg className="ico" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
                Text Us
              </a>
            </div>
          </div>
        </div>

        <div className="container header-container">
          <Link className="brand" to="/" aria-label="US Star Auto Sale Home">
            <span className="brand-mark">★</span>
            <span className="brand-stack">
              <span className="brand-name">US Star Auto</span>
              <span className="brand-tag">Sale</span>
            </span>
          </Link>

          <nav className="desktop-nav" aria-label="Primary">
            {NAV.map(navLink)}
          </nav>

          <div className="header-actions">
            <Link to="/inventory" className="btn btn-ghost btn-small">Browse</Link>
            <Link to="/financing" className="btn btn-primary btn-small">Get Pre‑Approved</Link>
            <button className="menu-btn" aria-label="Open menu" onClick={() => setOpen(true)}>
              ☰
            </button>
          </div>
        </div>
      </header>

      <aside className={`sidebar${open ? " active" : ""}`} aria-label="Mobile menu">
        <button className="close-btn" aria-label="Close menu" onClick={close}>
          ✕
        </button>
        {NAV.map(navLink)}
        <div className="sidebar-cta">
          <Link className="btn btn-primary" to="/financing" onClick={close}>Get Pre‑Approved</Link>
          <a className="btn btn-ghost" href="tel:+18653773230">Call Now</a>
        </div>
      </aside>

      <div className={`overlay${open ? " active" : ""}`} onClick={close}></div>
    </>
  );
}
