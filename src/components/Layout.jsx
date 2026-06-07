import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

// Wraps every page: header, footer, the floating "Text Us" button, sets the
// per-page <body> class (so the original `body.page-x` CSS still applies) and
// resets scroll on navigation.
export default function Layout({ bodyClass = "", bodyStyle, children }) {
  const { pathname } = useLocation();

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
      <a className="floating-textus" href="sms:+18653773230" aria-label="Text US Star Auto Sale">
        TEXT US
      </a>
    </>
  );
}
