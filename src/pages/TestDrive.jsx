import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { submitFormToTelegram } from "../lib/telegram.js";

export default function TestDrive() {
  const [params] = useSearchParams();
  const [car, setCar] = useState(params.get("car") || "");
  const [sending, setSending] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await submitFormToTelegram(e.target, "testDriveForm");
    e.target.reset();
    setCar("");
    setSending(false);
    alert("Message sent. We will get back to you!");
  };

  return (
    <Layout bodyClass="page-testdrive has-hero" title="Schedule a Test Drive" description="Book a test drive at US Star Auto Sale in Knoxville, TN. Pick a date and time and we'll confirm quickly.">
      <section className="hero-banner hero-banner--compact">
        <div className="wrapper hero-banner__inner">
          <span className="hero-eyebrow">★ Test Drive · Knoxville, TN</span>
          <h1 className="hero-title">Feel it before you buy it.</h1>
          <p className="hero-subtext">
            Pick a date and time — we’ll confirm fast. Prefer to call?{" "}
            <a href="tel:+18659247326" style={{ textDecoration: "underline" }}>(865) 924‑7326</a>.
          </p>
        </div>
      </section>

      <section className="section container page-pad">
        <form id="testDriveForm" className="financing-form form-max" onSubmit={onSubmit}>
          <div className="form-step active form-card">
            <h3>Your Info</h3>
            <div className="form-grid">
              <input type="text" name="name" placeholder="Full Name" required />
              <input type="tel" name="phone" placeholder="Phone Number" required />
              <input type="email" name="email" placeholder="Email Address" />
              <input type="text" name="car" placeholder="Car (optional)" value={car} onChange={(e) => setCar(e.target.value)} />
              <input type="date" name="preferredDate" required />
              <input type="time" name="preferredTime" required />
            </div>
            <textarea className="field-textarea" name="message" placeholder="Anything you want us to know? (trade-in, financing, questions…)"></textarea>
            <button type="submit" className="btn next" disabled={sending}>{sending ? "Sending…" : "Send Request"}</button>
          </div>
        </form>
      </section>
    </Layout>
  );
}
