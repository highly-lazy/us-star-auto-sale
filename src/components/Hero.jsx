import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import HeroRatings from "./HeroRatings.jsx";
import { useLang } from "../lib/i18n.jsx";

// Background plates. Both are near-black studio frames (97% of each is under
// 6% luminance), so they are composited with `screen` onto the navy base —
// only their highlights come through and the type stays readable without a
// heavy dark veil sitting on top of a daylight snapshot.
const SLIDES = [
  "/assets/images/hero-1.webp",
  "/assets/images/hero-2.webp",
];

const INTERVAL = 6500;

export default function Hero({ count }) {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const reduced = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    if (mq.matches || SLIDES.length < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(id);
  }, []);

  const stats = [
    { v: count ? String(count) : "—", k: t("hero.stat.inStock") },
    { v: t("hero.stat.allCreditV"), k: t("hero.stat.allCredit") },
    { v: t("hero.stat.historyV"), k: t("hero.stat.history") },
  ];

  return (
    <section className="hero hero--v2">
      <div className="hero__media" aria-hidden="true">
        {SLIDES.map((src, i) => (
          <div
            key={src}
            className={`hero__slide${i === active ? " is-on" : ""}`}
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
      </div>
      <div className="hero__veil" aria-hidden="true" />
      <div className="hero__glow hero__glow--a" aria-hidden="true" />
      <div className="hero__glow hero__glow--b" aria-hidden="true" />
      <div className="hero__sweep" aria-hidden="true" />
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__grain" aria-hidden="true" />

      <div className="container hero__inner">
        <span className="hero-kicker">
          <span className="hero-kicker__dot" aria-hidden="true" />
          {t("hero.kicker")}
        </span>

        <h1 className="hero-title">
          {t("hero.titleA")} <em>{t("hero.titleB")}</em>
        </h1>

        <p className="hero-subtext">
          {count ? t("hero.subtext").replace("{n}", count) : t("hero.subtextPlain")}
        </p>

        <div className="hero-actions">
          <Link className="btn btn-primary" to="/inventory">{t("cta.viewInventory")}</Link>
          <Link className="btn btn-ghost" to="/financing">{t("cta.preApproved")}</Link>
        </div>

        <HeroRatings />
      </div>

      <div className="hero__stats" aria-hidden="false">
        <div className="container hero__stats-inner">
          {stats.map((s) => (
            <div className="hero__stat" key={s.k}>
              <b>{s.v}</b>
              <span>{s.k}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
