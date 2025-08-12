import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/ConfirmationPage.css";
import NavBar from "../components/NavBar";
import axios from "axios";
import { useContext } from "react";
import { CustomerContext } from "../context/CustomerContext";
import Footer from "../components/Footer";

export default function ConfirmationPage({
  planId,
  planName,
  planPrice,
  planDuration,
  onCancel,
  onConfirm,
}) {
  const navigate = useNavigate();
  const { customerData } = useContext(CustomerContext);

  // Get today's date
  const today = new Date();
  const localizedDate = today.toLocaleDateString();
  const durationInDays = parseInt(planDuration, 10) || 0;

  const calculateEndDate = (startDate, durationInDays) => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationInDays);
    const utcIsoDate = new Date(endDate.toUTCString()).toISOString();
    const isoDate = utcIsoDate.split("T")[0];
    return isoDate;
  };

  const endDate = calculateEndDate(today, durationInDays);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const formatPrice = (price) => {
    if (typeof price !== "string") {
      return "Price not available"; // Handle undefined/null price
    }
    const numericPrice = parseFloat(price.replace(/[^\d.-]/g, "")) || 0;
    return `₹${numericPrice.toFixed(2)}`;
  };

  const formattedPrice = formatPrice(planPrice);

  const handleConfirm = async () => {
    // Access customerData from context
    const email = customerData.customerEmail;
    //console.log(email);
    const name = " ";

    const utcStartDate = new Date(today.toUTCString());
    const isoStartDate = utcStartDate.toISOString().split("T")[0];

    try {
      //Thank you mail after confirmation
      await axios.post(
        `${baseUrl}/emails/thank-you?recipient=${email}&name=${name}`
      );

      // Create mapping of customer and chosen plan and mark status as pending,this is to be approved by admin

      const res = await axios.post(`${baseUrl}/customers/plans`, {
        customerId: customerData.customerId,
        planId: planId,
        startDate: isoStartDate,
        endDate: endDate,
        status: "Pending",
      });
      //console.log(res);

      // After successful requests, navigate to the thank-you page
      navigate("/thank-you");
    } catch (error) {
      console.error("Error sending emails:", error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="confirmation-container">
        <h1 className="confirmation-heading">
          <p>Please review your selected plan details below:</p>
        </h1>
        <div className="confirmation-content">
          <div className="text-box">
            <p>
              <strong>Plan ID:</strong> {planId}
            </p>
            <p>
              <strong>Plan Name:</strong> {planName}
            </p>
            <p>
              <strong>Plan Price:</strong> {formattedPrice}
            </p>
            <p>
              <strong>Plan Duration:</strong> {planDuration}
            </p>
            <p>
              <strong>Start Date:</strong> {today.toISOString().split("T")[0]}
            </p>
            <p>
              <strong>End Date:</strong> {endDate}
            </p>
          </div>
          <div className="button-container">
            <Link to="/servicePlans">
              <button className="cancelConfirm-button" onClick={onCancel}>
                Cancel
              </button>
            </Link>
            <Link to="/thank-you">
              <button className="confirm-button" onClick={handleConfirm}>
                Confirm
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
