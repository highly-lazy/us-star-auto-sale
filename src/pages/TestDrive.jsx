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
    <Layout bodyClass="page-testdrive">
      <section className="hero hero--compact" style={{ "--hero-image": "url('/assets/images/blue.jpg')" }}>
        <div className="wrapper">
          <div>
            <div className="hero-kicker">★ Test Drive • Knoxville, TN</div>
            <h1 className="hero-title">Schedule a Test Drive</h1>
            <p className="hero-sub">
              Pick a date/time and we’ll confirm quickly. Prefer to call?{" "}
              <a href="tel:+18653773230" style={{ textDecoration: "underline" }}>(865) 377‑3230</a>.
            </p>
          </div>
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
