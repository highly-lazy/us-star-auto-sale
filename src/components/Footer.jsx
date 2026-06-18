import { Link } from "react-router-dom";
import { useLang } from "../lib/i18n.jsx";

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-map">
        <iframe
          src="https://www.google.com/maps?q=7665%20Maynardville%20Pike%2C%20Knoxville%2C%20TN%2037938&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="US Star Auto Sale location"
        ></iframe>
        <div className="map-overlay">
          <h4>US Star Auto Sale</h4>
          <p>7665 Maynardville Pike<br />Knoxville, TN 37938</p>
          <a href="https://maps.google.com/?q=7665+Maynardville+Pike+Knoxville+TN+37938" target="_blank" rel="noopener noreferrer">
            Get Directions →
          </a>
        </div>
      </div>

      <div className="container footer-grid">
        <div className="footer-col footer-brand">
          <Link className="logo" to="/">US <span className="red-star">★</span> Auto Sale</Link>
          <p>Premium used cars and flexible financing for all credit types — Knoxville, TN &amp; nationwide.</p>
          <div className="footer-social">
            <a href="https://www.facebook.com/usstarautosale/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <img src="/assets/icons/facebook-svgrepo-com.svg" alt="Facebook" loading="lazy" decoding="async" />
            </a>
            <a href="https://www.cargurus.com/Cars/m-US-Star-Auto-Group-LLC-sp463559" target="_blank" rel="noopener noreferrer" aria-label="CarGurus">
              <img src="/assets/icons/cargurus.svg" alt="CarGurus" loading="lazy" decoding="async" />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h5>{t("nav.inventory")}</h5>
          <Link to="/inventory">{t("nav.allVehicles")}</Link>
          <Link to="/inventory?cond=new">{t("nav.newCars")}</Link>
          <Link to="/inventory?cond=used">{t("nav.usedCars")}</Link>
          <Link to="/saved">{t("nav.saved")}</Link>
        </div>

        <div className="footer-col">
          <h5>{t("footer.quickLinks")}</h5>
          <Link to="/financing">{t("nav.getApproved")}</Link>
          <Link to="/credit-application">{t("nav.creditApp")}</Link>
          <Link to="/tradein">{t("nav.tradein")}</Link>
          <Link to="/testdrive">{t("nav.testdrive")}</Link>
          <Link to="/contact">{t("nav.contactUs")}</Link>
        </div>

        <div className="footer-col footer-contact">
          <h5>{t("nav.contact")}</h5>
          <p><strong>{t("footer.hours")}:</strong><br />Mon–Sat · 9:00–18:00</p>
          <p><strong>{t("footer.address")}:</strong><br />7665 Maynardville Pike<br />Knoxville, TN 37938</p>
          <p><a href="tel:+18653773230">📞 865-377-3230</a></p>
          <p><a href="mailto:Usstar@autoussales.com">✉ Usstar@autoussales.com</a></p>
        </div>
      </div>

      <p className="footer-copy">
        © US Star Auto Sale {year} · {t("footer.rights")} ·{" "}
        <Link to="/terms-of-use">Terms of Use</Link> ·{" "}
        <Link to="/privacy-policy">Privacy Policy</Link>
      </p>
    </footer>
  );
}
