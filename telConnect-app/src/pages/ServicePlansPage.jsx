import React from "react";
import ServicePlans from "../components/ServicePlans";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function ServicePlanePage() {
  return (
    <div>
      <NavBar />
      <ServicePlans />
      <Footer />
    </div>
  );
}
