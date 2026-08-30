import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../lib/i18n.jsx";

const IDS = ["credit", "bring", "down", "trade", "history", "asis", "inspect", "fees", "ship", "apply"];

// Injects/refreshes the FAQPage structured data Google uses for rich results.
function useFaqSchema(items) {
  useEffect(() => {
    if (!items.length) return;
    const id = "faq-jsonld";
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("script");
      el.id = id;
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: { "@type": "Answer", text: i.a },
      })),
    });
    return () => {
      const node = document.getElementById(id);
      if (node) node.remove();
    };
  }, [items]);
}

export default function FAQ() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(0);

  const items = IDS.map((id) => ({ id, q: t(`faq.${id}.q`), a: t(`faq.${id}.a`) }));
  useFaqSchema(items, lang);

  return (
    <section className="section faq band--paper" id="faq" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <div className="faq__aside">
          <span className="eyebrow">{t("faq.eyebrow")}</span>
          <h2 className="section-title" id="faq-title">{t("faq.title")}</h2>
          <p className="section-subtitle">{t("faq.sub")}</p>
          <div className="faq__cta">
            <a className="btn btn-primary" href="tel:+18659247326">{t("cta.callNow")}</a>
            <Link className="btn btn-ghost" to="/contact">{t("nav.contactUs")}</Link>
          </div>
        </div>

        <div className="faq__list">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div className={`faq__item${isOpen ? " is-open" : ""}`} key={item.id}>
                <h3 className="faq__q">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${item.id}`}
                    id={`faq-q-${item.id}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span>{item.q}</span>
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                  </button>
                </h3>
                <div
                  className="faq__a"
                  id={`faq-a-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-q-${item.id}`}
                  hidden={!isOpen}
                >
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
