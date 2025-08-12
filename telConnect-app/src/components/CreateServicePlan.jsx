// src/pages/PlanForm.jsx
import React, { useState } from "react";
import axios from "axios";
import "../styles/CreateServicePlan.css";

const CreateServicePlan = () => {
  const [formData, setFormData] = useState({
    planType: "", // Added missing planType field
    planId: "",
    planName: "",
    planPrice: "",
    planDescription: "",
    planDuration: "",
  });
  const token = localStorage.getItem("bearerToken");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [submittedData, setSubmittedData] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setFormData({
      planId: "",
      planName: "",
      planPrice: "",
      planDescription: "",
      planDuration: "",
    });
    setSubmittedData(null);
    setError(null);
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post(`${baseUrl}/admin/newPlan`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Use the form data for submittedData
      setSubmittedData(formData);
    } catch (err) {
      setError("Error submitting form data.");
      console.error(err);
    }
  };

  return (
    <div className="create-container">
      <div className="plan-form-container">
        <h2>Fill the Details:</h2>
        <form>
          <div className="plan-form-group">
            <label>Plan type :</label>
            <select
              id="planType"
              name="planType"
              value={formData.planType}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Prepaid">Prepaid</option>
              <option value="Postpaid">Postpaid</option>
            </select>
          </div>
          <div className="plan-form-group">
            <label htmlFor="planId">Plan ID</label>
            <input
              id="planId"
              type="text"
              name="planId"
              value={formData.planId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="plan-form-group">
            <label htmlFor="planName">Plan name :</label>
            <input
              id="planName"
              type="text"
              name="planName"
              value={formData.planName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="plan-form-group">
            <label htmlFor="planPrice">Plan price :</label>
            <input
              id="planPrice"
              type="text"
              name="planPrice"
              value={formData.planPrice}
              onChange={handleChange}
              required
            />
          </div>
          <div className="plan-form-group">
            <label htmlFor="planDuration">Plan duration :</label>
            <input
              id="planDuration"
              type="text"
              name="planDuration"
              value={formData.planDuration}
              onChange={handleChange}
              required
            />
          </div>
          <div className="plan-form-group">
            <label htmlFor="planDescription">Plan description :</label>
            <textarea
              id="planDescription"
              name="planDescription"
              value={formData.planDescription}
              onChange={handleChange}
              required
            />
          </div>
          <div className="button-group">
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" onClick={handleAdd}>
              Add
            </button>
          </div>
        </form>

        {error && <div className="error-message">{error}</div>}

        {submittedData && (
          <div className="submitted-info">
            <h3>Submitted Information:</h3>
            <div className="submitted-info-row">
              <div className="submitted-info-label">Plan ID :</div>
              <div className="submitted-info-value">{submittedData.planId}</div>
            </div>
            <div className="submitted-info-row">
              <div className="submitted-info-label">Plan name :</div>
              <div className="submitted-info-value">
                {submittedData.planName}
              </div>
            </div>
            <div className="submitted-info-row">
              <div className="submitted-info-label">Plan price :</div>
              <div className="submitted-info-value">
                {submittedData.planPrice}
              </div>
            </div>
            <div className="submitted-info-row">
              <div className="submitted-info-label">Plan duration :</div>
              <div className="submitted-info-value">
                {submittedData.planDuration}
              </div>
            </div>
            <div className="submitted-info-row">
              <div className="submitted-info-label">Plan description :</div>
              <div className="submitted-info-value">
                {submittedData.planDescription}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateServicePlan;
