import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import CarCardClassic from "../components/CarCardClassic.jsx";
import { useCars } from "../lib/useCars.js";
import { normalize } from "../lib/utils.js";

const carText = (c) =>
  [c.make, c.model, c.year, c.price, c.mileage, c.stock, c.vin, c.color, c.engine, c.transmission]
    .map(normalize)
    .join(" ");

export default function Home() {
  const { cars, error } = useCars();
  const [q, setQ] = useState("");
  const [legalOpen, setLegalOpen] = useState(false);

  const featured = useMemo(() => {
    const sorted = [...cars].sort((a, b) => Number(b.id) - Number(a.id));
    const nq = normalize(q);
    const filtered = !nq ? sorted : sorted.filter((c) => carText(c).includes(nq));
    return filtered.slice(0, 8);
  }, [cars, q]);

  return (
    <Layout bodyClass="page-home has-hero">
      <section className="hero hero--home" style={{ "--hero-image": "url('/assets/images/elantra12.webp')" }}>
        <div className="wrapper">
          <div>
            <div className="hero-kicker floaty">★ Premium Used Cars • Knoxville, TN</div>
            <h1 className="hero-title">A better way to buy your next car.</h1>
            <p className="hero-subtext">
              Shop our curated inventory, schedule a test drive, and get pre‑approved — fast.
              <span className="muted" style={{ display: "block", marginTop: 8 }}>
                Prefer a dedicated credit application? Use our secure portal:{" "}
                <a href="https://startyourcreditapproval.com/credit-application/DCR13" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
                  StartYourCreditApproval.com
                </a>
              </span>
            </p>
            <div className="trust-row">
              <span className="trust-badge">✅ Quality‑Inspected Vehicles</span>
              <a className="trust-badge" href="tel:+18659247326" aria-label="Call for a shipping quote">🚚 Get quote to ship your vehicle</a>
              <span className="trust-badge">🧾 CARFAX Available</span>
              <span className="trust-badge">⭐ CarGurus Dealer</span>
            </div>
          </div>

          <div className="hero-panel">
            <div className="hero-search">
              <input
                type="search"
                placeholder="Search make, model, year, stock, VIN…"
                aria-label="Search inventory"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <Link className="btn btn-primary" to="/inventory" aria-label="Go to inventory">Search</Link>
            </div>
            <div className="hero-cta-row">
              <a className="icon-btn pulse" href="tel:+18653773230" aria-label="Call us">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 3a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 2 .5 3 .6a2 2 0 0 1 1.7 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
                Call
              </a>
              <a className="icon-btn" href="sms:+18653773230" aria-label="Text us">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
                Text
              </a>
              <Link className="icon-btn" to="/testdrive" aria-label="Schedule test drive">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7V3m8 4V3M4 11h16M6 21h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                Test Drive
              </Link>
              <Link className="icon-btn" to="/financing" aria-label="Apply for financing">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7h18M5 11h14M7 15h10M9 19h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                Financing
              </Link>
              <a className="icon-btn" href="https://startyourcreditapproval.com/credit-application/DCR13" target="_blank" rel="noopener noreferrer" aria-label="Open online credit application">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M6 11h12M6 15h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M20 7v10a2 2 0 0 1-2 2H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                Credit App
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section container featured">
        <div className="section-head">
          <h2 className="section-title">Featured Inventory</h2>
          <Link className="link-more" to="/inventory">View All →</Link>
        </div>

        <div className="inventory-toolbar">
          <input
            className="inventory-search"
            type="search"
            placeholder="Search by make, model, year, stock, VIN…"
            aria-label="Search inventory"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
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
      </section>

      <section className="about-home">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>About US Star Auto Sale</h2>
              <p className="subtitle">Your trusted partner for quality vehicles and flexible financing across the United States.</p>
              <p>US Star Auto Sale is a customer-focused auto dealership dedicated to helping people find reliable, high-quality vehicles at competitive prices. We believe buying a car should be simple, transparent, and stress-free.</p>
              <p>With access to multiple lenders nationwide, we offer flexible financing options for all credit types — good, bad, or no credit.</p>
              <Link to="/financing" className="btn-primary">Apply for Financing</Link>
            </div>
            <div className="about-stats">
              <div className="stat"><h3>50+</h3><span>Cars Sold</span></div>
              <div className="stat"><h3>Fast</h3><span>Approval Process</span></div>
              <div className="stat"><h3>Nationwide</h3><span>Lender Network</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section services" id="services">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <img src="/assets/icons/delivery.png" alt="Nationwide Delivery" loading="lazy" decoding="async" />
              <h3>Get Quote to Ship Your Vehicle</h3>
              <p>Tap to call and get a fast shipping quote anywhere in the USA.</p>
              <a className="btn btn-ghost btn-small" href="tel:+18652692676" aria-label="Call for shipping quote">Call for Quote</a>
            </div>
            <div className="service-card">
              <img src="/assets/icons/financee.png" alt="Financing Options" loading="lazy" decoding="async" />
              <h3>Financing Options</h3>
              <p>Flexible financing tailored to your needs with easy approval.</p>
            </div>
            <div className="service-card">
              <img src="/assets/icons/drive.png" alt="Test Drive" loading="lazy" decoding="async" />
              <h3>Test Drive</h3>
              <p>Book a test drive and experience your car before buying.</p>
            </div>
          </div>
        </div>
      </section>

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
