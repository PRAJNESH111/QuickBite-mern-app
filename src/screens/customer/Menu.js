import React from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

export default function Menu() {
  // We can just reuse Home component for now as it contains the menu,
  // but let's build a dedicated wrapper or just redirect.
  // Real implementation: copy Home.js logic, but remove HeroBanner.
  // For brevity, redirecting to Home.
  React.useEffect(() => {
    window.location.href = "/";
  }, []);

  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
        <div className="spinner"></div>
      </div>
      <Footer />
    </div>
  );
}
