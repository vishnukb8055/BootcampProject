import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import "../styles/EditServicePlans.css"; // Import the CSS for styling

const EditServicePlans = () => {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [serviceType, setServiceType] = useState("prepaid");
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editedPlan, setEditedPlan] = useState({
    planId: "",
    planName: "",
    planDescription: "",
    planPrice: "",
    planDuration: "",
  });
  const token = localStorage.getItem("bearerToken");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${baseUrl}/plans`);
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching plans:", error);
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

  const handleServiceChange = (event) => {
    setServiceType(event.target.value);
  };

  const handleEdit = (planId) => {
    const planToEdit = plans.find((plan) => plan.planId === planId);
    setEditedPlan(
      planToEdit || {
        planId: "",
        planName: "",
        planDescription: "",
        planPrice: "",
        planDuration: "",
      }
    );
    setSelectedPlanId(planId);
    setShowEditDialog(true);
  };

  const handleDialogClose = () => {
    setShowEditDialog(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedPlan((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.patch(`${baseUrl}/admin/${selectedPlanId}/edit`, editedPlan, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlans((prevPlans) =>
        prevPlans.map((plan) =>
          plan.planId === selectedPlanId ? editedPlan : plan
        )
      );
      setShowEditDialog(false);
    } catch (error) {
      console.error("Error updating plan:", error);
    }
  };

  return (
    <div className="available-services-container">
      <h1>Available Services</h1>

      <div className="service-select">
        <label htmlFor="service-type">Select Service Type:</label>
        <select
          id="service-type"
          value={serviceType}
          onChange={handleServiceChange}
        >
          <option value="prepaid">Prepaid</option>
          <option value="postpaid">Postpaid</option>
        </select>
      </div>

      <div className="plans-table-container">
        <table className="service-plans-table">
          <thead>
            <tr>
              <th>Plan ID</th>
              <th>Plan Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlans.length > 0 ? (
              filteredPlans.map((plan) => (
                <tr key={plan.planId}>
                  <td>{plan.planId}</td>
                  <td>{plan.planName}</td>
                  <td>{plan.planDescription}</td>
                  <td>₹{plan.planPrice.replace("?", "")}</td>
                  <td>{plan.planDuration}</td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(plan.planId)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No plans available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <Modal show={showEditDialog} onHide={handleDialogClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="planName">
              <Form.Label>Plan Name</Form.Label>
              <Form.Control
                type="text"
                name="planName"
                value={editedPlan.planName}
                onChange={handleInputChange}
                placeholder="Enter plan name"
              />
            </Form.Group>

            <Form.Group controlId="planPrice" className="mt-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                name="planPrice"
                value={editedPlan.planPrice}
                onChange={handleInputChange}
                placeholder="Enter plan price"
              />
            </Form.Group>

            <Form.Group controlId="planDuration" className="mt-3">
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="text"
                name="planDuration"
                value={editedPlan.planDuration}
                onChange={handleInputChange}
                placeholder="Enter plan duration"
              />
            </Form.Group>

            <Form.Group controlId="planDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="textarea"
                name="planDescription"
                value={editedPlan.planDescription}
                onChange={handleInputChange}
                placeholder="Enter plan description"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="custom-cancel-button"
            onClick={handleDialogClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="custom-save-button"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditServicePlans;
