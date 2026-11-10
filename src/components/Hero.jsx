import { Link } from "react-router-dom";
import HeroRatings from "./HeroRatings.jsx";
import { useLang } from "../lib/i18n.jsx";

// Seasonal skin for the hero. Set to false after Thanksgiving weekend to
// restore the regular copy, colours and CTA.
const THANKSGIVING = true;

export default function Hero({ count }) {
  const { t } = useLang();

  const stats = [
    { v: count ? String(count) : "—", k: t("hero.stat.inStock") },
    { v: t("hero.stat.allCreditV"), k: t("hero.stat.allCredit") },
    { v: t("hero.stat.historyV"), k: t("hero.stat.history") },
  ];

  return (
    <section className={`hero hero--v2${THANKSGIVING ? " hero--thanksgiving" : ""}`}>
      {/* One plate: a near-black wide frame whose left third is empty, so the
          headline sits on clean darkness. The image is set in CSS so the
          smaller file can be swapped in on phones. */}
      <div className="hero__media" aria-hidden="true">
        <div className="hero__slide is-on" />
      </div>
      <div className="hero__veil" aria-hidden="true" />
      <div className="hero__glow hero__glow--a" aria-hidden="true" />
      <div className="hero__glow hero__glow--b" aria-hidden="true" />
      <div className="hero__sweep" aria-hidden="true" />
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__grain" aria-hidden="true" />
      {THANKSGIVING && (
        <div className="hero__leaves" aria-hidden="true">
          {Array.from({ length: 7 }, (_, i) => <span key={i} />)}
        </div>
      )}

      <div className="container hero__inner">
        <span className="hero-kicker">
          <span className="hero-kicker__dot" aria-hidden="true" />
          {t(THANKSGIVING ? "hero.tg.kicker" : "hero.kicker")}
        </span>

        <h1 className="hero-title">
          {THANKSGIVING
            ? <>{t("hero.tg.titleA")} <em>{t("hero.tg.titleB")}</em></>
            : <>{t("hero.titleA")} <em>{t("hero.titleB")}</em></>}
        </h1>

        <p className="hero-subtext">
          {THANKSGIVING
            ? t("hero.tg.subtext")
            : count ? t("hero.subtext").replace("{n}", count) : t("hero.subtextPlain")}
        </p>

        <div className="hero-actions">
          {THANKSGIVING
            ? <Link className="btn btn-primary" to="/inventory?status=deals">{t("hero.tg.cta")}</Link>
            : <Link className="btn btn-primary" to="/inventory">{t("cta.viewInventory")}</Link>}
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
