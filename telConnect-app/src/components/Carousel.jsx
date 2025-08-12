import React, { useState, useContext } from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import "../styles/Carousel.css"; // Your custom CSS
// import plan_image1 from "../assets/plan_image1.png";
// import plan_image2 from "../assets/plan_image2.png";
import { useNavigate } from "react-router-dom";
import { CustomerContext } from "../context/CustomerContext";
import { onPlanClickHandler } from "../utils/authutils";
import Alert from "@mui/material/Alert"; // Import Alert component from Material-UI

const CarouselComponent = ({ plan_carousel1, plan_carousel2 }) => {
  const [selectedPlan, setSelectedPlan] = useState(null); // Track selected plan
  const [alertMessage, setAlertMessage] = useState(""); // State to handle alert messages
  const { customerData } = useContext(CustomerContext); // Access customer data from context
  const navigate = useNavigate(); // Hook to handle navigation

  // Call the plan click handler on button click, passing planId and setAlertMessage
  const handleClick = async (plan) => {
    setSelectedPlan(plan);
    if (plan?.planId) {
      // Ensure selectedPlan is set and pass planId
      await onPlanClickHandler(
        navigate,
        customerData,
        plan.planId,
        setAlertMessage
      );
    }
    // else {
    //   console.log("No plan selected");
    // }
  };

  return (
    <div>
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
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)", // Optional: Keep boxShadow for subtle elevation
            textAlign: "center",
            boxSizing: "border-box", // Ensure padding is included in the width calculation
          }}
        >
          <Alert
            severity="info"
            style={{
              fontSize: "1rem",
              margin: 0, // Remove default margin
              boxShadow: "none", // Remove internal shadow
            }}
          >
            {alertMessage}
          </Alert>
        </div>
      )}
      <Carousel interval={3000} controls={true} indicators={true}>
        {plan_carousel1 && (
          <Carousel.Item>
            <div className="d-flex align-items-center">
              <img
                src="src\assets\plan_image1.png"
                alt={plan_carousel1.planName}
                className="carousel-image"
              />
              <Carousel.Caption className="carousel-caption">
                <a
                  href="#"
                  onClick={() => {
                    handleClick(plan_carousel1);
                  }}
                  className="carousel-link"
                >
                  <h5>{plan_carousel1.planName}</h5>
                  <p>{plan_carousel1.planDescription}</p>
                  <p>Price: ₹{plan_carousel1.planPrice.replace(/[\?]/g, "")}</p>
                  <p>Duration: {plan_carousel1.planDuration}</p>
                </a>
              </Carousel.Caption>
            </div>
          </Carousel.Item>
        )}
        {plan_carousel2 && (
          <Carousel.Item>
            <div className="d-flex align-items-center">
              <img
                src="src\assets\plan_image2.png"
                alt={plan_carousel2.planName}
                className="carousel-image"
              />
              <Carousel.Caption className="carousel-caption">
                <a
                  href="#"
                  onClick={() => {
                    handleClick(plan_carousel2);
                  }}
                  className="carousel-link"
                >
                  <h5>{plan_carousel2.planName}</h5>
                  <p>{plan_carousel2.planDescription}</p>
                  <p>Price: ₹{plan_carousel2.planPrice.replace(/[\?]/g, "")}</p>
                  <p>Duration: {plan_carousel2.planDuration}</p>
                </a>
              </Carousel.Caption>
            </div>
          </Carousel.Item>
        )}
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
