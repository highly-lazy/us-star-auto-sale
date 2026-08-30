import { Link } from "react-router-dom";
import { useLang } from "../lib/i18n.jsx";

const CREDIT_PORTAL = "https://startyourcreditapproval.com/credit-application/DCR13";

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function FinancingBand() {
  const { t } = useLang();
  const steps = ["1", "2", "3"].map((n) => ({
    n,
    title: t(`fin.step${n}.title`),
    text: t(`fin.step${n}.text`),
  }));

  return (
    <section className="section finband band--dark" id="financing-band">
      <div className="container finband__grid">
        <div>
          <span className="eyebrow">{t("fin.eyebrow")}</span>
          <h2>{t("fin.title")}</h2>
          <p>{t("fin.text")}</p>

          <ul className="finband__points">
            <li><Check /> {t("fin.point1")}</li>
            <li><Check /> {t("fin.point2")}</li>
            <li><Check /> {t("fin.point3")}</li>
            <li><Check /> {t("fin.point4")}</li>
          </ul>

          <div className="hero-actions" style={{ marginBottom: 0 }}>
            <Link className="btn btn-primary" to="/financing">{t("cta.preApproved")}</Link>
            <a className="btn btn-ghost" href={CREDIT_PORTAL} target="_blank" rel="noopener noreferrer">
              {t("fin.portalBtn")}
            </a>
          </div>
        </div>

        <div className="finsteps">
          {steps.map((s) => (
            <div className="finstep" key={s.n}>
              <span className="finstep__n">0{s.n}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
