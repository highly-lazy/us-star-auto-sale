import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useFavorites } from "../lib/favorites.js";
import { useLang } from "../lib/i18n.jsx";

// Nav model — labels are i18n keys resolved via t().
const NAV = [
  { to: "/", key: "nav.home", end: true },
  {
    key: "nav.inventory",
    to: "/inventory",
    children: [
      { to: "/inventory", key: "nav.allVehicles" },
      { to: "/inventory?cond=new", key: "nav.newCars" },
      { to: "/inventory?cond=used", key: "nav.usedCars" },
      { to: "/saved", key: "nav.saved" },
    ],
  },
  {
    key: "nav.financing",
    to: "/financing",
    children: [
      { to: "/financing", key: "nav.getApproved" },
      { to: "/credit-application", key: "nav.creditApp" },
      { to: "/tradein", key: "nav.tradein" },
    ],
  },
  {
    key: "nav.services",
    to: "/testdrive",
    children: [
      { to: "/testdrive", key: "nav.testdrive" },
      { to: "/contact", key: "nav.contactUs" },
    ],
  },
  { to: "/contact", key: "nav.contact" },
];

function LangToggle({ className = "" }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`lang-toggle ${className}`} role="group" aria-label="Language">
      <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
      <button className={lang === "es" ? "on" : ""} onClick={() => setLang("es")} aria-pressed={lang === "es"}>ES</button>
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const { count } = useFavorites();
  const { t } = useLang();
  const close = () => { setOpen(false); setOpenMenu(null); };

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
                7665 Maynardville Pike, Knoxville, TN
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
              <Link className="top-link" to="/financing">{t("top.financing")}</Link>
              <a className="top-link" href="tel:+18659247326">865-924-7326</a>
              <a className="top-link pulse" href="sms:+18659247326">{t("top.text")}</a>
              <LangToggle />
            </div>
          </div>
        </div>

        <div className="container header-container">
          <Link className="brand" to="/" aria-label="US Star Auto Sale Home">
            <span className="brand-mark">★</span>
            <span className="brand-stack">
              <span className="brand-name">US Star Auto</span>
              <span className="brand-tag">Sale · Knoxville, TN</span>
            </span>
          </Link>

          <nav className="desktop-nav" aria-label="Primary">
            {NAV.map((item) =>
              item.children ? (
                <div className="nav-item has-dropdown" key={item.key}>
                  <NavLink to={item.to} className="nav-top">
                    {t(item.key)}
                    <svg className="caret" width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </NavLink>
                  <div className="dropdown">
                    {item.children.map((c) => (
                      <NavLink key={c.to + c.key} to={c.to} onClick={close}>{t(c.key)}</NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink key={item.to} to={item.to} end={item.end} className="nav-top" onClick={close}>
                  {t(item.key)}
                </NavLink>
              ),
            )}
            <NavLink to="/saved" className="nav-top nav-saved" onClick={close} aria-label={t("nav.saved")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 21s-7-4.6-9.2-8.7C.9 8.7 3 5.5 6.4 5.1c1.7-.2 3.4.6 4.3 2 1-1.4 2.7-2.2 4.3-2 3.4.4 5.5 3.6 3.6 7.2C19 16.4 12 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              {count > 0 && <span className="nav-badge">{count}</span>}
            </NavLink>
          </nav>

          <div className="header-actions">
            <Link to="/financing" className="btn btn-primary btn-small">{t("cta.preApproved")}</Link>
            <button className="menu-btn" aria-label="Open menu" onClick={() => setOpen(true)}>☰</button>
          </div>
        </div>
      </header>

      <aside className={`sidebar${open ? " active" : ""}`} aria-label="Mobile menu">
        <div className="sidebar-top">
          <Link className="brand brand--sidebar" to="/" onClick={close}>
            <span className="brand-mark">★</span>
            <span className="brand-name">US Star Auto Sale</span>
          </Link>
          <button className="close-btn" aria-label="Close menu" onClick={close}>✕</button>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((item) =>
            item.children ? (
              <div className="sb-group" key={item.key}>
                <button
                  className={`sb-group-head${openMenu === item.key ? " open" : ""}`}
                  onClick={() => setOpenMenu(openMenu === item.key ? null : item.key)}
                  aria-expanded={openMenu === item.key}
                >
                  {t(item.key)}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {openMenu === item.key && (
                  <div className="sb-sub">
                    {item.children.map((c) => (
                      <NavLink key={c.to + c.key} to={c.to} onClick={close}>{t(c.key)}</NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink key={item.to} to={item.to} end={item.end} onClick={close}>{t(item.key)}</NavLink>
            ),
          )}
          <NavLink to="/saved" onClick={close} className="nav-saved">
            {t("nav.saved")} {count > 0 && <span className="nav-badge">{count}</span>}
          </NavLink>
        </nav>

        <div className="sidebar-cta">
          <Link className="btn btn-primary" to="/financing" onClick={close}>{t("cta.preApproved")}</Link>
          <a className="btn btn-red" href="tel:+18659247326">{t("cta.callNow")}</a>
        </div>
        <div className="sidebar-foot">
          <LangToggle className="lang-toggle--block" />
          <a className="sb-contact" href="tel:+18659247326">📞 865-924-7326</a>
          <span className="sb-contact muted">Mon–Sat · 9:00–18:00</span>
        </div>
      </aside>

      <div className={`overlay${open ? " active" : ""}`} onClick={close}></div>
    </>
  );
}
