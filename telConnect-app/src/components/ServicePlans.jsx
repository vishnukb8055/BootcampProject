import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../styles/ServicePlans.css";
import { useNavigate } from "react-router-dom";
import { CustomerContext } from "../context/CustomerContext";
import { onPlanClickHandler } from "../utils/authutils";
import Alert from "@mui/material/Alert";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Import duration icon
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const ServicePlans = () => {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [serviceType, setServiceType] = useState("prepaid");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const { customerData } = useContext(CustomerContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${baseUrl}/plans`);
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching plans:", error);
        setAlertMessage("Failed to load plans. Please try again later.");
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    const filtered = plans.filter((plan) =>
      serviceType === "prepaid"
        ? plan.planId.startsWith("PREP")
        : plan.planId.startsWith("POST")
    );
    setFilteredPlans(filtered);
  }, [serviceType, plans]);

  const handleServiceChange = (type) => {
    setServiceType(type);
  };

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    setAlertMessage(""); // Clear previous alert message
  };

  const handleClick = async () => {
    if (selectedPlan) {
      try {
        await onPlanClickHandler(
          navigate,
          customerData,
          selectedPlan,
          setAlertMessage
        );
      } catch (error) {
        setAlertMessage("Error activating plan. Please try again.");
      }
    } else {
      setAlertMessage("Please select a plan.");
    }
  };

  return (
    <div className="service-plans-container">
      {alertMessage && (
        <div
          style={{
            position: "fixed",
            top: "10%",
            left: "50%",
            transform: "translate(-50%, 0)",
            width: "80%",
            maxWidth: "500px",
            zIndex: 9999,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >
          <Alert
            severity="info"
            style={{
              fontSize: "1rem",
              margin: 0,
              boxShadow: "none",
            }}
          >
            {alertMessage}
          </Alert>
        </div>
      )}

      <h2 className="headline">
        Experience the Power of Unlimited Connections with Our Services!
      </h2>

      <div className="service-select-page">
        <button
          className={`service-button ${
            serviceType === "prepaid" ? "active" : ""
          }`}
          onClick={() => handleServiceChange("prepaid")}
        >
          Prepaid
        </button>
        <button
          className={`service-button ${
            serviceType === "postpaid" ? "active" : ""
          }`}
          onClick={() => handleServiceChange("postpaid")}
        >
          Postpaid
        </button>
      </div>

      <div className="plans-box">
        <div className="plans-grid">
          {filteredPlans.length > 0 ? (
            filteredPlans.map((plan) => (
              <div
                key={plan.planId}
                className={`plan-box ${
                  selectedPlan === plan.planId ? "selected" : ""
                }`}
                onClick={() => handlePlanSelect(plan.planId)}
              >
                <h3>{plan.planName.replace("?", "")}</h3>
                <p>{plan.planDescription}</p>
                <div className="divider"></div>{" "}
                {/* Divider between description and price/duration */}
                <div className="price-section">
                  <CurrencyRupeeIcon />
                  <span>{plan.planPrice.replace("?", "")}</span>
                </div>
                <div className="duration-section">
                  <AccessTimeIcon />
                  <span>{plan.planDuration}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No plans available</p>
          )}
        </div>
      </div>

      <button className="activate-button" onClick={handleClick}>
        Activate
      </button>
    </div>
  );
};

export default ServicePlans;
