import React, { createContext, useState, useEffect } from "react";

// Create the context
export const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customerData, setCustomerData] = useState(null);
  const [planId, setPlanId] = useState(null); // New state for storing planId

  // Load customer data and planId from localStorage on mount
  useEffect(() => {
    const storedCustomerData = localStorage.getItem("customerData");
    const storedPlanId = localStorage.getItem("planId");

    if (storedCustomerData) {
      setCustomerData(JSON.parse(storedCustomerData));
    }

    if (storedPlanId) {
      setPlanId(storedPlanId); // Load the planId from localStorage
    }
  }, []);

  // Store customer data and planId in localStorage whenever they change
  useEffect(() => {
    if (customerData) {
      localStorage.setItem("customerData", JSON.stringify(customerData));
    }
  }, [customerData]);

  useEffect(() => {
    if (planId) {
      localStorage.setItem("planId", planId); // Save the selected planId
    }
  }, [planId]);

  // Logout function: Clears customer data and planId from state and localStorage
  const logout = () => {
    setCustomerData(null);
    setPlanId(null);
    localStorage.removeItem("customerData");
    localStorage.removeItem("planId");
  };

  return (
    <CustomerContext.Provider
      value={{ customerData, setCustomerData, planId, setPlanId, logout }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
