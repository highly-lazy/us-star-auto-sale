import Layout from "../components/Layout.jsx";
import content from "./termsContent.html?raw";
import "../css/legal-page.css";

export default function Terms() {
  return (
    <Layout bodyClass="page-contact">
      <main dangerouslySetInnerHTML={{ __html: content }} />
    </Layout>
  );
}
