import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { useCars } from "../lib/useCars.js";
import { carName } from "../lib/utils.js";
import { submitFormToTelegram } from "../lib/telegram.js";
import "../css/tradein.css";

export default function TradeIn() {
  const { cars } = useCars();
  const [selected, setSelected] = useState("");
  const [sending, setSending] = useState(false);

  const selectedCar = cars.find((c) => String(c.id) === String(selected));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    const extras = selectedCar ? { "Selected Car": carName(selectedCar) } : {};
    await submitFormToTelegram(e.target, "tradeForm", extras);
    e.target.reset();
    setSelected("");
    setSending(false);
    alert("Message sent. We will get back to you!");
  };

  return (
    <Layout bodyClass="page-tradein">
      <section className="hero hero--tradein" style={{ "--hero-image": "url('/assets/images/blue.jpg')" }}>
        <div className="overlay"></div>
        <div className="wrapper">
          <h1 className="hero-title">Trade Your Car Easily</h1>
          <p className="hero-subtext">Trade your car with us !</p>
          <div className="hero-buttons">
            <Link to="/testdrive" className="btn btn-primary">Test Drive</Link>
            <Link to="/inventory" className="btn btn-ghost">View Inventory</Link>
          </div>
        </div>
      </section>

      <section className="tradein-section">
        <div className="container tradein-container">
          <h2 className="section-title">Get Trade-In Estimate</h2>

          <form id="tradeForm" className="tradein-form" onSubmit={onSubmit}>
            <div className="form-group">
              <input type="text" name="name" placeholder="Full Name" required />
              <input type="email" name="email" placeholder="Email Address" required />
              <input type="tel" name="phone" placeholder="Phone Number" required />
            </div>

            <label htmlFor="tradeCarSelect">Select Vehicle You Want</label>
            <select name="car" id="tradeCarSelect" required value={selected} onChange={(e) => setSelected(e.target.value)}>
              <option value="">Select Vehicle</option>
              {cars.map((c) => (
                <option key={c.id} value={c.id}>{carName(c)}</option>
              ))}
            </select>
            <div className="selected-car-preview">
              {selectedCar && <img id="tradeCarImage" src={selectedCar.img} alt="Selected Vehicle" loading="lazy" decoding="async" />}
            </div>

            <h3 className="form-subtitle">Your Trade-In Vehicle</h3>
            <div className="form-group">
              <input type="text" name="make" placeholder="Make" />
              <input type="text" name="model" placeholder="Model" />
            </div>
            <div className="form-group">
              <input type="text" name="year" placeholder="Year" />
              <input type="text" name="mileage" placeholder="Mileage" />
            </div>
            <textarea name="message" placeholder="Additional Information (Optional)"></textarea>

            <button type="submit" className="btn btn-primary" disabled={sending}>
              {sending ? "Sending…" : "Get Trade-In Estimate"}
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
