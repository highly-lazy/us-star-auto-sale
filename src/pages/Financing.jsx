import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { useCars } from "../lib/useCars.js";
import { carName, toNum, normalize } from "../lib/utils.js";
import { submitFormToTelegram } from "../lib/telegram.js";

const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
const DOB_YEARS = Array.from({ length: 2008 - 1940 + 1 }, (_, i) => 2008 - i);
const DOB_DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
const RES_YEARS = Array.from({ length: 31 }, (_, i) => `${i} Years`);
const RES_MONTHS = Array.from({ length: 12 }, (_, i) => `${i} Months`);

export default function Financing() {
  const { cars } = useCars();
  const [params] = useSearchParams();
  const [selected, setSelected] = useState("");
  const [sending, setSending] = useState(false);
  const car = cars.find((c) => String(c.id) === String(selected));

  // Preselect a vehicle when arriving from a car page (?car=Year Make Model)
  useEffect(() => {
    const wanted = normalize(params.get("car"));
    if (!wanted || selected || !cars.length) return;
    const match = cars.find((c) => normalize(carName(c)) === wanted);
    if (match) setSelected(String(match.id));
  }, [params, cars, selected]);

  const vehMeta = car
    ? [
        toNum(car.mileage) !== null ? `${toNum(car.mileage).toLocaleString()} mi` : "",
        car.transmission,
        toNum(car.price) !== null ? `$${toNum(car.price).toLocaleString()}` : "",
      ].filter(Boolean).join(" • ")
    : "We’ll match your application to inventory.";

  const onSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    const extras = car ? { "Selected Car": carName(car) } : {};
    await submitFormToTelegram(e.target, "financingForm", extras);
    e.target.reset();
    setSelected("");
    setSending(false);
    alert("Message sent. We will get back to you!");
  };

  return (
    <Layout bodyClass="page-financing">
      <section className="hero hero--compact">
        <div className="wrapper">
          <div>
            <div className="hero-kicker">Financing</div>
            <h1 className="hero-title">Get Pre‑Approved Online</h1>
            <p className="hero-subtext">
              Fill out the application below and we’ll confirm quickly. Prefer to use our secure credit portal?{" "}
              <a href="https://startyourcreditapproval.com/credit-application/DCR13" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>Start your credit application</a>.
              Prefer to call? <a href="tel:+18653773230" style={{ textDecoration: "underline" }}>(865) 377‑3230</a>
            </p>
          </div>
          <div className="hero-panel">
            <div className="trust-row">
              <span className="trust-badge">✅ Secure</span>
              <span className="trust-badge">⚡ Fast Response</span>
              <span className="trust-badge">🏁 All Credit Welcome</span>
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a className="btn btn-primary" href="https://startyourcreditapproval.com/credit-application/DCR13" target="_blank" rel="noopener noreferrer">Open Credit Application</a>
              <a className="btn btn-ghost" href="tel:+18659247326">Call for Help</a>
            </div>
          </div>
        </div>
      </section>

      <main className="section container page-pad">
        <form id="financingForm" className="form-card" autoComplete="on" style={{ padding: 22, borderRadius: 22 }} onSubmit={onSubmit}>
          <div className="page-lead">
            <h2 className="section-title" style={{ fontSize: 28 }}>Online Credit Application</h2>
            <p className="section-subtitle">Please enter all information you can. If something doesn’t apply, leave it blank.</p>
          </div>

          <div className="fin-grid">
            <div className="fin-left">
              <h3 className="fin-h">Vehicle</h3>
              <div className="fin-row">
                <label className="fin-label" htmlFor="carSelect">Select Vehicle</label>
                <select id="carSelect" name="vehicle" className="fin-input" value={selected} onChange={(e) => setSelected(e.target.value)}>
                  <option value="">Choose vehicle (optional)</option>
                  {cars.map((c) => <option key={c.id} value={c.id}>{carName(c)}</option>)}
                </select>
              </div>

              <h3 className="fin-h">Applicant Information</h3>
              <div className="fin-row fin-3">
                <input className="fin-input" name="first_name" placeholder="First" required />
                <input className="fin-input" name="middle_name" placeholder="Middle" />
                <input className="fin-input" name="last_name" placeholder="Last" required />
              </div>
              <div className="fin-row fin-2">
                <input className="fin-input" name="cell_phone" placeholder="Cell Phone" required />
                <input className="fin-input" name="email" type="email" placeholder="Email" required />
              </div>
              <div className="fin-row fin-4">
                <select className="fin-input" name="dob_month" defaultValue="">
                  <option value="">DOB Month</option>
                  {DOB_DAYS.slice(0, 12).map((m) => <option key={m}>{m}</option>)}
                </select>
                <select className="fin-input" name="dob_day" defaultValue="">
                  <option value="">Day</option>
                  {DOB_DAYS.map((d) => <option key={d}>{d}</option>)}
                </select>
                <select className="fin-input" name="dob_year" defaultValue="">
                  <option value="">Year</option>
                  {DOB_YEARS.map((y) => <option key={y}>{y}</option>)}
                </select>
                <select className="fin-input" name="marital_status" defaultValue="">
                  <option value="">Marital Status</option>
                  <option>Single</option><option>Married</option><option>Separated</option><option>Divorced</option><option>Widowed</option>
                </select>
              </div>
              <div className="fin-row fin-4">
                <select className="fin-input" name="dl_state" defaultValue="">
                  <option value="">DL State</option>
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <input className="fin-input" name="dl_number" placeholder="Driver License #" />
                <input className="fin-input" name="ssn" placeholder="SSN" />
                <select className="fin-input" name="timezone" defaultValue="">
                  <option value="">Choose Time Zone</option>
                  <option>Eastern</option><option>Central</option><option>Mountain</option><option>Pacific</option>
                </select>
              </div>

              <h3 className="fin-h">Residence Information</h3>
              <div className="fin-row fin-2">
                <input className="fin-input" name="address" placeholder="Street Address" required />
                <input className="fin-input" name="apt" placeholder="Apt / Unit #" />
              </div>
              <div className="fin-row fin-3">
                <input className="fin-input" name="city" placeholder="City" required />
                <select className="fin-input" name="state" required defaultValue="">
                  <option value="">State</option>
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <input className="fin-input" name="zip" placeholder="Zip" required />
              </div>
              <div className="fin-row">
                <input className="fin-input" name="country" placeholder="Country" defaultValue="USA" />
              </div>
              <div className="fin-row fin-2">
                <select className="fin-input" name="time_at_residence_years" defaultValue="">
                  <option value="">Time at Residence (Years)</option>
                  {RES_YEARS.map((y) => <option key={y}>{y}</option>)}
                </select>
                <select className="fin-input" name="time_at_residence_months" defaultValue="">
                  <option value="">Months</option>
                  {RES_MONTHS.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="fin-row fin-2">
                <input className="fin-input" name="monthly_payment" placeholder="Monthly Payment" />
                <select className="fin-input" name="residence_type" defaultValue="">
                  <option value="">Residence Type</option>
                  <option>Rent</option><option>Own</option><option>Living with family</option><option>Other</option>
                </select>
              </div>
              <div className="fin-row fin-2">
                <input className="fin-input" name="mortgage_company" placeholder="Mortgage / Leasing Company" />
                <select className="fin-input" name="existing_loans" defaultValue="">
                  <option value="">Any Existing Loans?</option>
                  <option>No</option><option>Yes</option>
                </select>
              </div>

              <h3 className="fin-h">Employment Information</h3>
              <div className="fin-row">
                <input className="fin-input" name="employer" placeholder="Employer" />
              </div>
              <div className="fin-row fin-2">
                <input className="fin-input" name="employer_address" placeholder="Employer Address" />
                <input className="fin-input" name="employer_apt" placeholder="Apt / Unit #" />
              </div>
              <div className="fin-row fin-3">
                <input className="fin-input" name="employer_city" placeholder="City" />
                <input className="fin-input" name="employer_state" placeholder="State" />
                <input className="fin-input" name="employer_zip" placeholder="Zip" />
              </div>
              <div className="fin-row fin-3">
                <input className="fin-input" name="title" placeholder="Title" />
                <select className="fin-input" name="employment_type" defaultValue="">
                  <option value="">Type of Employment</option>
                  <option>Full‑time</option><option>Part‑time</option><option>Self‑employed</option><option>Retired</option><option>Student</option><option>Unemployed</option>
                </select>
                <input className="fin-input" name="work_phone" placeholder="Work Phone" />
              </div>
              <div className="fin-row fin-2">
                <select className="fin-input" name="time_at_company_years" defaultValue="">
                  <option value="">Time at Company (Years)</option>
                  {RES_YEARS.map((y) => <option key={y}>{y}</option>)}
                </select>
                <select className="fin-input" name="time_at_company_months" defaultValue="">
                  <option value="">Months</option>
                  {RES_MONTHS.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="fin-row fin-2">
                <input className="fin-input" name="gross_monthly_income" placeholder="Gross Monthly Income" />
                <input className="fin-input" name="additional_income" placeholder="Additional Income" />
              </div>
              <div className="fin-row">
                <input className="fin-input" name="additional_income_source" placeholder="Source of Additional Income" />
              </div>

              <h3 className="fin-h">Down Payment &amp; Term</h3>
              <div className="fin-row fin-2">
                <input className="fin-input" name="down_payment" placeholder="Down Payment Amount" />
                <select className="fin-input" name="term" defaultValue="">
                  <option value="">Desired Term</option>
                  <option>36 months</option><option>48 months</option><option>60 months</option><option>72 months</option><option>84 months</option>
                </select>
              </div>
              <div className="fin-row fin-2">
                <div className="fin-radio">
                  <span>Joint Application</span>
                  <label><input type="radio" name="joint_application" value="Yes" /> Yes</label>
                  <label><input type="radio" name="joint_application" value="No" defaultChecked /> No</label>
                </div>
                <div className="fin-radio">
                  <span>Trade‑In</span>
                  <label><input type="radio" name="trade_in" value="Yes" /> Yes</label>
                  <label><input type="radio" name="trade_in" value="No" defaultChecked /> No</label>
                </div>
              </div>

              <h3 className="fin-h">Appointment</h3>
              <div className="fin-row fin-2">
                <input className="fin-input" type="date" name="appointment_date" />
                <select className="fin-input" name="appointment_time" defaultValue="">
                  <option value="">Choose Time</option>
                  <option>09:00 AM</option><option>10:00 AM</option><option>11:00 AM</option><option>12:00 PM</option>
                  <option>01:00 PM</option><option>02:00 PM</option><option>03:00 PM</option><option>04:00 PM</option><option>05:00 PM</option>
                </select>
              </div>

              <div className="fin-row">
                <textarea className="fin-input fin-text" name="additional_message" placeholder="Additional message (trade‑in, financing questions...)" rows="5"></textarea>
              </div>

              <div className="fin-row">
                <label className="fin-check">
                  <input type="checkbox" name="agree_terms" value="Yes" required />
                  <span>I certify the information is complete and accurate and agree to be contacted about my request.</span>
                </label>
              </div>

              <div className="fin-actions">
                <button className="btn btn-primary" type="submit" disabled={sending}>{sending ? "Submitting…" : "Submit"}</button>
                <a className="btn btn-ghost" href="tel:+18653773230">Call Instead</a>
              </div>
            </div>

            <aside className="fin-right">
              <div className="fin-preview">
                <div className="fin-preview__top">
                  <div>
                    <div className="fin-preview__label">Selected vehicle</div>
                    <div className="fin-preview__title">{car ? carName(car) : "Choose a vehicle (optional)"}</div>
                    <div className="fin-preview__meta">{vehMeta}</div>
                  </div>
                  <Link className="btn btn-ghost btn-small" to="/inventory">Browse</Link>
                </div>
                {car && <img src={car.img} alt="Selected vehicle" loading="lazy" decoding="async" />}
                <div className="fin-preview__note">
                  Need help? Text us anytime: <a href="sms:+18659247326">865-924-7326</a>
                </div>
              </div>
            </aside>
          </div>
        </form>
      </main>
    </Layout>
  );
}
