import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import CarCardClassic from "../components/CarCardClassic.jsx";
import AdvancedSearch from "../components/AdvancedSearch.jsx";
import LeadForm from "../components/LeadForm.jsx";
import Hero from "../components/Hero.jsx";
import FAQ from "../components/FAQ.jsx";
import BrandStrip from "../components/BrandStrip.jsx";
import FinancingBand from "../components/FinancingBand.jsx";
import BrowseTiles from "../components/BrowseTiles.jsx";
import Reviews from "../components/Reviews.jsx";
import CountUp from "../components/CountUp.jsx";
import { useCars } from "../lib/useCars.js";
import { isSold } from "../lib/utils.js";
import { useLang } from "../lib/i18n.jsx";
import { useReveal } from "../lib/useReveal.js";

const CREDIT_PORTAL = "https://startyourcreditapproval.com/credit-application/DCR13";

export default function Home() {
  const { cars, error } = useCars();
  const { t, lang } = useLang();
  const [legalOpen, setLegalOpen] = useState(false);
  useReveal([cars.length, lang]);

  const available = useMemo(() => cars.filter((c) => !isSold(c)), [cars]);

  const featured = useMemo(
    () => [...available].sort((a, b) => Number(b.id) - Number(a.id)).slice(0, 8),
    [available],
  );

  const newArrivals = useMemo(
    () =>
      available
        .filter((c) => c.condition === "new")
        .sort((a, b) => Number(b.id) - Number(a.id))
        .slice(0, 8),
    [available],
  );

  return (
    <Layout bodyClass="page-home has-hero" title="Used Cars for Sale in Knoxville, TN">
      <Hero count={available.length} />

      <section className="searchbar" aria-label="Search inventory">
        <div className="container">
          <div className="searchbar__card">
            <AdvancedSearch variant="bar" />
          </div>
        </div>
      </section>

      <BrandStrip cars={cars} />

      <BrowseTiles cars={cars} />

      {/* ---------- New arrivals ---------- */}
      {newArrivals.length >= 3 && (
        <section className="section container featured reveal">
          <div className="section-head">
            <h2 className="section-title">
              <span className="eyebrow">{t("section.justIn")}</span>
              {t("section.newArrivals")}
            </h2>
            <Link className="link-more" to="/inventory?cond=new">{t("section.viewAll")} →</Link>
          </div>
          <div className="cards-row">
            {newArrivals.map((car) => (
              <CarCardClassic key={car.id} car={car} variant="home" />
            ))}
          </div>
        </section>
      )}

      {/* ---------- Featured inventory ---------- */}
      <section className="section container featured reveal">
        <div className="section-head">
          <h2 className="section-title">
            <span className="eyebrow">{t("section.inStock")}</span>
            {t("section.featured")}
          </h2>
          <Link className="link-more" to="/inventory">
            {t("section.viewAll")} ({available.length}) →
          </Link>
        </div>

        <div className="cards-row">
          {error ? (
            <div className="empty-state">Inventory failed to load.</div>
          ) : featured.length ? (
            featured.map((car) => <CarCardClassic key={car.id} car={car} variant="home" />)
          ) : (
            <div className="empty-state">No vehicles found.</div>
          )}
        </div>

        <p className="price-disclaimer">{t("legal.priceDisclaimer")}</p>
      </section>

      <FinancingBand />

      <Reviews />

      {/* ---------- About ---------- */}
      <section className="about-home reveal">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <span className="eyebrow">{t("about.eyebrow")}</span>
              <h2>{t("about.title")}</h2>
              <p className="subtitle">{t("about.subtitle")}</p>
              <p>{t("about.p1")}</p>
              <p>{t("about.p2")}</p>
              <div className="about-actions">
                <Link to="/financing" className="btn btn-primary">{t("about.applyBtn")}</Link>
                <Link to="/inventory" className="btn btn-ghost">{t("about.browseBtn")}</Link>
              </div>
            </div>
            <div className="about-stats">
              <div className="stat">
                <h3><CountUp end={available.length} /></h3>
                <span>{t("about.stat.inStock")}</span>
              </div>
              <div className="stat">
                <h3><CountUp end={cars.length - available.length} suffix="+" /></h3>
                <span>{t("about.stat.sold")}</span>
              </div>
              <div className="stat">
                <h3>{t("about.stat.fast")}</h3>
                <span>{t("about.stat.approval")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section className="section services reveal" id="services">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title services-title">
              <span className="eyebrow">{t("section.howWeHelp")}</span>
              {t("section.services")}
            </h2>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <span className="svc-icon">
                <img src="/assets/icons/financee.png" alt="" loading="lazy" decoding="async" />
              </span>
              <h3>{t("svc.finance.title")}</h3>
              <p>{t("svc.finance.text")}</p>
              <Link className="svc-link" to="/financing">{t("svc.finance.btn")} →</Link>
            </div>

            <div className="service-card">
              <span className="svc-icon svc-icon--trade">⇄</span>
              <h3>{t("svc.trade.title")}</h3>
              <p>{t("svc.trade.text")}</p>
              <Link className="svc-link" to="/tradein">{t("svc.trade.btn")} →</Link>
            </div>

            <div className="service-card">
              <span className="svc-icon">
                <img src="/assets/icons/drive.png" alt="" loading="lazy" decoding="async" />
              </span>
              <h3>{t("svc.test.title")}</h3>
              <p>{t("svc.test.text")}</p>
              <Link className="svc-link" to="/testdrive">{t("svc.test.btn")} →</Link>
            </div>

            <div className="service-card">
              <span className="svc-icon">
                <img src="/assets/icons/delivery.png" alt="" loading="lazy" decoding="async" />
              </span>
              <h3>{t("svc.ship.title")}</h3>
              <p>{t("svc.ship.text")}</p>
              <a className="svc-link" href="tel:+18659247326">{t("svc.ship.btn")} →</a>
            </div>

            <div className="service-card">
              <span className="svc-icon">$</span>
              <h3>{t("svc.credit.title")}</h3>
              <p>{t("svc.credit.text")}</p>
              <a className="svc-link" href={CREDIT_PORTAL} target="_blank" rel="noopener noreferrer">
                {t("svc.credit.btn")} →
              </a>
            </div>

            <div className="service-card">
              <span className="svc-icon">★</span>
              <h3>{t("svc.history.title")}</h3>
              <p>{t("svc.history.text")}</p>
              <Link className="svc-link" to="/contact">{t("svc.history.btn")} →</Link>
            </div>
          </div>
        </div>
      </section>

      <FAQ />

      <LeadForm />

      {/* ---------- Legal ---------- */}
      <section className="legal-disclaimer" id="legal">
        <div className="container">
          <div className={`legal-card${legalOpen ? " is-open" : ""}`}>
            <div className="legal-head">
              <h2>Legal Disclaimer &amp; Terms of Sale</h2>
              <button
                className="btn btn-view legal-toggle"
                type="button"
                aria-expanded={legalOpen}
                aria-controls="legalBody"
                onClick={() => setLegalOpen((v) => !v)}
              >
                {legalOpen ? "Hide terms" : "Read full terms"}
              </button>
            </div>
            <div className="legal-body" id="legalBody">
              <h3>As-Is Vehicle Sales</h3>
              <p>All vehicles sold by <strong>US Star Auto Sale</strong> are sold on an <strong>"as-is"</strong> basis, with no expressed or implied warranties, including but not limited to the implied warranties of merchantability and fitness for a particular purpose. The entire risk as to the quality and performance of the vehicle is with the buyer.</p>
              <h3>Vehicle Condition and Inspection</h3>
              <p>The buyer acknowledges that they have had the opportunity to inspect the vehicle thoroughly, or to have it inspected by a third-party mechanic of their choice, prior to purchase. The buyer assumes all responsibility for any defects, faults, or maintenance requirements of the vehicle, whether apparent or not.</p>
              <h3>No Guarantees</h3>
              <p>US Star Auto Sale makes no guarantees, representations, or warranties regarding the vehicle’s history, condition, past use, or performance. This includes, but is not limited to, mileage, accident history, and manufacturer recalls. Buyers are encouraged to obtain a vehicle history report (such as Carfax or AutoCheck) and to perform their own due diligence.</p>
              <h3>Limitation of Liability</h3>
              <p>In no event shall US Star Auto Sale be liable for any direct, indirect, incidental, special, or consequential damages arising out of or connected with the use or misuse of the purchased vehicle. This limitation applies regardless of the cause of action, including negligence, breach of contract, or tort.</p>
              <h3>Buyer’s Responsibility</h3>
              <p>The buyer is solely responsible for all post-sale maintenance, repairs, and legal requirements related to the vehicle, including but not limited to registration and insurance. By completing the purchase, the buyer agrees to all terms and conditions set forth in this disclaimer and understands that the vehicle is being sold “as-is” and “with all faults.”</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
