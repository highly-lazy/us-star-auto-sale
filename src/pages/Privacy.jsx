import Layout from "../components/Layout.jsx";
import content from "./privacyContent.html?raw";
import "../css/legal-page.css";

export default function Privacy() {
  return (
    <Layout bodyClass="page-contact">
      <main dangerouslySetInnerHTML={{ __html: content }} />
    </Layout>
  );
}
