import { Link } from "react-router-dom";

export default function Footer() {
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

      <div className="container footer-container">
        <div className="footer-col footer-logo">
          <Link className="logo" to="/">
            US <span className="red-star">★</span> Auto Sale
          </Link>
        </div>

        <div className="footer-col footer-info">
          <p><strong>Working Hours:</strong><br />9:00 – 18:00, Mon – Sat</p>
          <p><strong>Address:</strong><br />7665 Maynardville Pike<br />Knoxville, TN 37938</p>
          <p><strong>Email:</strong><br /><a href="mailto:Usstar@autoussales.com">Usstar@autoussales.com</a></p>
        </div>

        <div className="footer-col footer-social">
          <a href="https://www.facebook.com/usstarautosale/" target="_blank" rel="noopener noreferrer">
            <img src="/assets/icons/facebook-svgrepo-com.svg" alt="Facebook" loading="lazy" decoding="async" /> Facebook
          </a>
          <a href="https://www.facebook.com/marketplace/you/selling" target="_blank" rel="noopener noreferrer">
            <img src="/assets/icons/facebook-svgrepo-com.svg" alt="Facebook Marketplace" loading="lazy" decoding="async" /> Marketplace
          </a>
          <a href="https://www.cargurus.com/Cars/m-US-Star-Auto-Group-LLC-sp463559" target="_blank" rel="noopener noreferrer">
            <img src="/assets/icons/cargurus.svg" alt="CarGurus" loading="lazy" decoding="async" /> CarGurus
          </a>
        </div>
      </div>

      <p className="footer-copy">
        © US Star Auto Sale 2025 · All rights reserved ·{" "}
        <Link to="/terms-of-use" style={{ color: "inherit" }}>Terms of Use</Link> ·{" "}
        <Link to="/privacy-policy" style={{ color: "inherit" }}>Privacy Policy</Link>
      </p>
    </footer>
  );
}
