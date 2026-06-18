import Layout from "../components/Layout.jsx";
import content from "./termsContent.html?raw";
import "../css/legal-page.css";

export default function Terms() {
  return (
    <Layout bodyClass="page-contact" title="Terms of Use" description="Terms of use for US Star Auto Sale (US Star Auto Group LLC), Knoxville, TN.">
      <main dangerouslySetInnerHTML={{ __html: content }} />
    </Layout>
  );
}
