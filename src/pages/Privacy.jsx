import Layout from "../components/Layout.jsx";
import content from "./privacyContent.html?raw";
import "../css/legal-page.css";

export default function Privacy() {
  return (
    <Layout bodyClass="page-contact" title="Privacy Policy" description="Privacy policy for US Star Auto Sale (US Star Auto Group LLC), Knoxville, TN.">
      <main dangerouslySetInnerHTML={{ __html: content }} />
    </Layout>
  );
}
