import { useState } from "react";
import Layout from "../components/Layout.jsx";
import "../css/credit-app-page.css";

export default function CreditApplication() {
  const [loaded, setLoaded] = useState(false);

  return (
    <Layout bodyClass="page-contact" bodyStyle={{ "--page-bg-image": "url('/assets/images/fon1.png')" }}>
      <main>
        <section className="ca-hero">
          <div className="container">
            <span className="ca-eyebrow"><span className="secure-dot"></span> Secure • SSL Encrypted • DealerCenter</span>
            <h1>Get <span className="accent">Pre‑Approved</span> in Minutes</h1>
            <p className="lead">Apply for auto financing online — fast, secure, and no obligation. Most applicants get a response the same day. Bad credit, no credit, first‑time buyers all welcome.</p>
            <div className="trust-row">
              <span className="trust-pill">
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-12V5l-8-3-8 3v5c0 8 8 12 8 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Soft credit check
              </span>
              <span className="trust-pill">
                <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                Takes ~5 minutes
              </span>
              <span className="trust-pill">
                <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" /></svg>
                256‑bit encryption
              </span>
              <span className="trust-pill">
                <svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                No obligation
              </span>
            </div>
          </div>
        </section>

        <section className="steps-section container">
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-num">01</div>
              <div className="step-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></div>
              <h3 className="step-title">Fill Out the Form</h3>
              <p className="step-desc">Tell us a bit about yourself, income, and the vehicle you want. Takes about 5 minutes.</p>
            </div>
            <div className="step-card">
              <div className="step-num">02</div>
              <div className="step-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 3a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 2 .5 3 .6a2 2 0 0 1 1.7 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg></div>
              <h3 className="step-title">We Review Quickly</h3>
              <p className="step-desc">Our finance team reviews your application — usually within hours, often the same day.</p>
            </div>
            <div className="step-card">
              <div className="step-num">03</div>
              <div className="step-icon"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M3 9h18" stroke="currentColor" strokeWidth="2" /></svg></div>
              <h3 className="step-title">Drive Home Approved</h3>
              <p className="step-desc">Get matched with the best rate and terms. Pick your car and drive home the same day.</p>
            </div>
          </div>
        </section>

        <section className="ca-form-section">
          <div className="container">
            <div className="ca-form-wrap">
              <div className="ca-form-frame">
                <div className="ca-form-bar">
                  <div className="left">
                    <span className="dots"><span></span><span></span><span></span></span>
                    <span>Secure Credit Application</span>
                  </div>
                  <div className="right">
                    <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" /></svg>
                    Powered by DealerCenter • 256‑bit SSL
                  </div>
                </div>

                <div className="ca-iframe-host">
                  {!loaded && (
                    <div className="ca-loader">
                      <div className="spinner"></div>
                      <div className="lbl">Loading secure application…</div>
                    </div>
                  )}
                  <iframe
                    src="https://ssl.hasyourcar.com/credit_application/creditapplication?template=Template4&version=1&theme=8C8C8C&formtype=S&dcid=29012591"
                    title="US Star Auto Sale — Credit Application"
                    scrolling="auto"
                    style={{ height: 1265, width: "100%" }}
                    frameBorder="0"
                    loading="lazy"
                    onLoad={() => setLoaded(true)}
                  ></iframe>
                </div>
              </div>

              <div className="help-row">
                <div className="help-card">
                  <div className="h-ic"><svg viewBox="0 0 24 24" fill="none"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 3a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 2 .5 3 .6a2 2 0 0 1 1.7 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg></div>
                  <div className="h-text">
                    <div className="lbl">Need help applying?</div>
                    <div className="val"><a href="tel:+18659247326">(865) 924‑7326</a></div>
                  </div>
                </div>
                <div className="help-card">
                  <div className="h-ic"><svg viewBox="0 0 24 24" fill="none"><path d="M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" /></svg></div>
                  <div className="h-text">
                    <div className="lbl">Questions by email?</div>
                    <div className="val"><a href="mailto:sales@autoussales.com">sales@autoussales.com</a></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
