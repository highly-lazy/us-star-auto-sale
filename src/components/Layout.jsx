import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

const SITE = "US Star Auto Sale";
const DEFAULT_DESC =
  "Premium used cars in Knoxville, TN. Browse inventory, schedule a test drive, trade-in, and apply for financing online at US Star Auto Sale.";

// Set/replace a <meta> tag by name or property.
function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

// Wraps every page: header, footer, the floating "Text Us" button, sets the
// per-page <body> class (so the original `body.page-x` CSS still applies),
// page SEO/meta tags, and resets scroll on navigation.
export default function Layout({ bodyClass = "", bodyStyle, title, description, image, children }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const full = title ? `${title} | ${SITE}` : SITE;
    const desc = description || DEFAULT_DESC;
    const img = image || "/assets/icons/logo.png";
    document.title = full;
    setMeta("name", "description", desc);
    setMeta("property", "og:title", full);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:image", img);
    setMeta("property", "og:site_name", SITE);
    setMeta("name", "twitter:card", "summary_large_image");
  }, [title, description, image]);

  useEffect(() => {
    document.body.className = bodyClass;
    if (bodyStyle) {
      Object.entries(bodyStyle).forEach(([k, v]) =>
        document.body.style.setProperty(k, v),
      );
    }
    return () => {
      if (bodyStyle) {
        Object.keys(bodyStyle).forEach((k) =>
          document.body.style.removeProperty(k),
        );
      }
    };
  }, [bodyClass, bodyStyle]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      {children}
      <Footer />
      <a className="floating-textus" href="sms:+18659247326" aria-label="Text US Star Auto Sale">
        TEXT US
      </a>
    </>
  );
}
