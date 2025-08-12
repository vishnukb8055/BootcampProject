import React, { useState, useContext } from "react";
import { Card, Row, Col, Button, Modal } from "react-bootstrap";
import "../styles/CardGrid.css";
import { useNavigate } from "react-router-dom";
import { CustomerContext } from "../context/CustomerContext";
import { onPlanClickHandler } from "../utils/authutils";
import Alert from "@mui/material/Alert"; // Import Alert component from Material-UI

const CardGrid = ({ plan_card1, plan_card2, plan_card3 }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); // State to handle alert messages
  const { customerData } = useContext(CustomerContext);
  const navigate = useNavigate();

  // Call the plan click handler on button click, passing planId and setAlertMessage
  const handleClick = async (plan) => {
    setSelectedPlan(plan);
    if (plan?.planId) {
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

  const handleViewDetails = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const renderPlanCard = (plan) => (
    <Card className="plan-card" key={plan.planId}>
      <Card.Body>
        <Card.Title className="plan-price">₹ {plan.price}</Card.Title>
        <Card.Subtitle className="mb-2">
          <Button
            variant="link"
            className="custom-link-button"
            onClick={() => handleViewDetails(plan)}
          >
            View details
          </Button>
        </Card.Subtitle>
        <div className="plan-details">
          <div className="detail-section">
            <div>VALIDITY</div>
            <div>
              <strong>{plan.validity} days</strong>
            </div>
          </div>
          <div className="detail-section">
            <div>DATA</div>
            <div>
              <strong>{plan.data} GB</strong>
            </div>
          </div>
        </div>
        <Button className="recharge-button" onClick={() => handleClick(plan)}>
          Select
        </Button>
      </Card.Body>
    </Card>
  );

  return (
    <>
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
      <Row xs={1} md={2} lg={3} className="g-4">
        <Col>{renderPlanCard(plan_card1)}</Col>
        <Col>{renderPlanCard(plan_card2)}</Col>
        <Col>{renderPlanCard(plan_card3)}</Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedPlan?.plan_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-detail">
            <h5>Price:</h5>
            <p>₹ {selectedPlan?.price}</p>
          </div>
          <div className="modal-detail">
            <h5>Description:</h5>
            <p>{selectedPlan?.description}</p>
          </div>
          <div className="modal-detail">
            <h5>Validity:</h5>
            <p>{selectedPlan?.validity} days</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="recharge-button"
            onClick={() => handleClick(selectedPlan)}
          >
            Select
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CardGrid;
