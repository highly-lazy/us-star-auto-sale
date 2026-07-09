import { useState } from "react";
import { submitFormToTelegram } from "../lib/telegram.js";
import { useLang } from "../lib/i18n.jsx";

// Reference-style lead-capture section: persuasive copy on the left, an inquiry
// form on the right. Submits to the same Telegram pipeline the other forms use.
export default function LeadForm() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    const ok = await submitFormToTelegram(form, "Inventory Inquiry");
    setBusy(false);
    if (ok) {
      setSent(true);
      form.reset();
    } else {
      alert("Sorry, something went wrong. Please call us at 865-924-7326.");
    }
  };

  return (
    <section className="lead-section">
      <div className="lead-wrap">
        <div className="lead-copy">
          <h2>{t("lead.title")}</h2>
          <p>{t("lead.text")}</p>
          <div className="lead-points">
            <div className="lead-point">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {t("lead.point1")}
            </div>
            <div className="lead-point">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {t("lead.point2")}
            </div>
            <div className="lead-point">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {t("lead.point3")}
            </div>
          </div>
        </div>

        <div className="lead-card">
          <h3>{t("lead.cardTitle")}</h3>
          <p className="lead-sub">{t("lead.cardSub")}</p>
          <form className="lead-form" onSubmit={onSubmit}>
            <input type="text" name="First Name" placeholder={t("lead.firstName")} required autoComplete="given-name" />
            <input type="text" name="Last Name" placeholder={t("lead.lastName")} required autoComplete="family-name" />
            <input type="tel" name="Phone" placeholder={t("lead.phone")} required autoComplete="tel" />
            <input type="email" name="Email" placeholder={t("lead.email")} required autoComplete="email" />
            <input className="full" type="text" name="Vehicle of Interest" placeholder={t("lead.vehicle")} />
            <textarea className="full" name="Message" placeholder={t("lead.message")} rows={3}></textarea>
            {sent ? (
              <p className="lead-ok">{t("lead.ok")}</p>
            ) : (
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? t("lead.sending") : t("lead.send")}
              </button>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
