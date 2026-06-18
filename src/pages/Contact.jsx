import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { submitFormToTelegram } from "../lib/telegram.js";
import "../css/contact-page.css";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await submitFormToTelegram(e.target, "contactForm");
    e.target.reset();
    setSending(false);
    setSent(true);
  };

  return (
    <Layout bodyClass="page-contact" bodyStyle={{ "--page-bg-image": "url('/assets/images/fon1.png')" }} title="Contact Us" description="Contact US Star Auto Sale in Knoxville, TN. Call, text, email, or send us a message — we usually reply in under an hour.">
      <main className="contact-page">
        <section className="contact-hero">
          <div className="container">
            <span className="eyebrow"><span className="dot"></span> We usually reply in under 1 hour</span>
            <h1>Let's Talk About <span className="accent">Your Next Car</span></h1>
            <p className="lead">Send us a message, give us a call, or stop by the lot. Our team in Knoxville is ready to answer questions, schedule a test drive, or help you get pre‑approved.</p>
            <div className="channel-row">
              <a className="channel-chip" href="tel:+18653773230">
                <svg viewBox="0 0 24 24" fill="none"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 3a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 2 .5 3 .6a2 2 0 0 1 1.7 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
                (865) 924‑7326
              </a>
              <a className="channel-chip" href="sms:+18653773230">
                <svg viewBox="0 0 24 24" fill="none"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
                Text Us
              </a>
              <a className="channel-chip" href="mailto:sales@autoussales.com">
                <svg viewBox="0 0 24 24" fill="none"><path d="M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
                sales@autoussales.com
              </a>
            </div>
          </div>
        </section>

        <section className="section container" style={{ paddingTop: 0 }}>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="form-head">
                <div className="badge">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
                </div>
                <div>
                  <h2>Send Us a Message</h2>
                  <p>Tell us what you're looking for — a vehicle, financing, trade‑in value, or anything else.</p>
                </div>
              </div>

              {!sent && (
                <form id="contactForm" className="contact-form" noValidate onSubmit={onSubmit}>
                  <div className="field-row">
                    <div className="field">
                      <input type="text" name="first" id="f-first" placeholder=" " autoComplete="given-name" required />
                      <label className="float" htmlFor="f-first">First Name *</label>
                    </div>
                    <div className="field">
                      <input type="text" name="last" id="f-last" placeholder=" " autoComplete="family-name" required />
                      <label className="float" htmlFor="f-last">Last Name *</label>
                    </div>
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <input type="tel" name="phone" id="f-phone" placeholder=" " autoComplete="tel" required />
                      <label className="float" htmlFor="f-phone">Phone Number *</label>
                    </div>
                    <div className="field">
                      <input type="email" name="email" id="f-email" placeholder=" " autoComplete="email" required />
                      <label className="float" htmlFor="f-email">Email Address *</label>
                    </div>
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <textarea name="message" id="f-message" placeholder=" " rows="4" required></textarea>
                    <label className="float" htmlFor="f-message">Your Message *</label>
                  </div>

                  <div className="consent-block">
                    <label className="check">
                      <input type="checkbox" name="consent_marketing" />
                      <span>I want to receive marketing text messages on the phone number provided.</span>
                    </label>
                    <label className="check">
                      <input type="checkbox" name="consent_nonmarketing" />
                      <span>I want to receive non‑marketing messages, including updates and news, on the phone number provided.</span>
                    </label>
                    <p className="consent-fine">
                      By checking the boxes above, I consent to receive marketing and/or non‑marketing text messages from US Star Auto Sales at the phone number provided.
                      <strong> Message frequency may vary. Message and data rates may apply.</strong> Reply HELP for help or STOP to opt‑out.
                    </p>
                    <p className="consent-fine">
                      By submitting this request, I accept the <Link to="/terms-of-use">Terms of Use</Link> and <Link to="/privacy-policy">Privacy Policy</Link>.
                    </p>
                  </div>

                  <div className="submit-row">
                    <button type="submit" className="btn-submit" disabled={sending}>
                      <span>{sending ? "Sending…" : "Send Message"}</span>
                      <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <p className="submit-note">Consent checkboxes are optional. You can submit without checking them.</p>
                  </div>
                </form>
              )}

              <div className="form-success" id="formSuccess" style={{ display: sent ? "block" : "none" }}>
                <div className="ok-mark">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out — we'll get back to you shortly.</p>
              </div>
            </div>

            <div className="side-stack">
              <div className="info-card">
                <h3>
                  <span className="ico-square">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M12 22s7-4.5 7-12a7 7 0 1 0-14 0c0 7.5 7 12 7 12Z" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" /></svg>
                  </span>
                  Visit Our Showroom
                </h3>
                <div className="info-row">
                  <div className="ic"><svg viewBox="0 0 24 24" fill="none"><path d="M12 22s7-4.5 7-12a7 7 0 1 0-14 0c0 7.5 7 12 7 12Z" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" /></svg></div>
                  <div className="meta">
                    <div className="lbl">Address</div>
                    <div className="val"><a href="https://maps.google.com/?q=7665+Maynardville+Pike+Knoxville+TN+37938" target="_blank" rel="noopener noreferrer">7665 Maynardville Pike<br />Knoxville, TN 37938</a></div>
                  </div>
                </div>
                <div className="info-row">
                  <div className="ic"><svg viewBox="0 0 24 24" fill="none"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 3a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 2 .5 3 .6a2 2 0 0 1 1.7 2Z" stroke="currentColor" strokeWidth="2" /></svg></div>
                  <div className="meta">
                    <div className="lbl">Phone</div>
                    <div className="val"><a href="tel:+18659247326">(865) 924‑7326</a></div>
                  </div>
                </div>
                <div className="info-row">
                  <div className="ic"><svg viewBox="0 0 24 24" fill="none"><path d="M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" /></svg></div>
                  <div className="meta">
                    <div className="lbl">Email</div>
                    <div className="val"><a href="mailto:sales@autoussales.com">sales@autoussales.com</a></div>
                  </div>
                </div>
                <div className="info-row">
                  <div className="ic"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></div>
                  <div className="meta">
                    <div className="lbl">Hours</div>
                    <div className="val">Monday – Saturday<br />9:00 AM – 6:00 PM</div>
                  </div>
                </div>
              </div>

              <div className="map-card">
                <iframe
                  src="https://www.google.com/maps?q=7665%20Maynardville%20Pike%2C%20Knoxville%2C%20TN%2037938&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="US Star Auto Sale Location"
                ></iframe>
                <a className="map-cta" href="https://maps.google.com/?q=7665+Maynardville+Pike+Knoxville+TN+37938" target="_blank" rel="noopener noreferrer">
                  Open in Google Maps
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
