import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";

export default function NotFound() {
  return (
    <Layout bodyClass="page-contact" title="Page Not Found">
      <section className="section container" style={{ textAlign: "center", padding: "100px 20px" }}>
        <h1 style={{ fontSize: 64, margin: 0, color: "#c1121f" }}>404</h1>
        <h2 style={{ color: "#fff" }}>Page not found</h2>
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 24 }}>
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <Link to="/" className="btn btn-primary">← Back to Home</Link>
      </section>
    </Layout>
  );
}
