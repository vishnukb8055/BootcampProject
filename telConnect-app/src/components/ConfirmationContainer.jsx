import React from "react";
import { useState, useEffect } from "react";
import "../styles/ConfirmationPage.css";
import axios from "axios";
import ConfirmationPage from "../pages/ConfirmationPage";
import { useLocation } from "react-router-dom";

export default function ConfirmationContainer() {
  const location = useLocation();
  const planId = location.state?.planId || localStorage.getItem("planId");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        // Use the dynamic planId in the API call
        const response = await axios.get(`${baseUrl}/plans/${planId}`);
        setPlan(response.data);
        setLoading(false);
      } catch (error) {
        console.error("API Call Failed: ", error);
        setError("Failed to load plan details");
        setLoading(false);
      }
    };

    if (planId) {
      fetchPlan(); // Only call the API if planId is available
    } else {
      setError("Plan ID not found");
      setLoading(false);
    }
  }, [planId]);

  const handleCancel = () => {};

  const handleConfirm = () => {};

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return plan ? (
    <ConfirmationPage
      planId={plan.planId}
      planName={plan.planName}
      planPrice={plan.planPrice}
      planDescription={plan.planDescription}
      planDuration={plan.planDuration}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
    />
  ) : (
    <p>No plan data available</p>
  );
}
