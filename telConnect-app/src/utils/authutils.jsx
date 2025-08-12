import axios from "axios";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Check if the user is logged in (i.e., customerData is present)
export const isLoggedIn = (customerData) => {
  return customerData !== null;
};

// Get the customerId from customerData
export const getCustomerId = (customerData) => {
  if (customerData) {
    return customerData.customerId; // Ensure this matches your customerData structure
  }
  return null;
};

// API call to check if the document is verified
export const isDocumentVerified = async (customerId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/verification/${customerId}/status`,
      { withCredentials: true }
    );

    // Check if the status contains 'success'
    return response.data.includes("success");
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return false; // If 404, assume document not verified
    } else {
      console.error("Error checking document verification status:", error);
      throw error; // Throw error for higher-level handling
    }
  }
};

// Handle authentication and redirection
export const handleAuthRedirect = async (
  navigate,
  customerData,
  loginRedirect,
  verificationRedirect,
  planConfirmationRedirect,
  setAlertMessage // Function to set alert messages
) => {
  if (!isLoggedIn(customerData)) {
    setAlertMessage("Please log in to proceed.");
    setTimeout(() => {
      setAlertMessage(""); // Clear alert after delay
      navigate(loginRedirect); // Redirect to login
    }, 2000);
    return;
  }

  const customerId = getCustomerId(customerData);

  if (!customerId) {
    console.error("Customer ID not found.");
    setAlertMessage("Customer ID not found. Please log in again.");
    setTimeout(() => setAlertMessage(""), 2000);
    return;
  }

  try {
    const verified = await isDocumentVerified(customerId);
    if (verified) {
      setAlertMessage("Redirecting to the Plan Confirmation Page...");
      setTimeout(() => {
        setAlertMessage("");
        navigate(planConfirmationRedirect); // Redirect to plan confirmation
      }, 2000);
    } else {
      setAlertMessage("Redirecting to the Document Verification Page...");
      setTimeout(() => {
        setAlertMessage("");
        navigate(verificationRedirect); // Redirect to document verification
      }, 2000);
    }
  } catch (error) {
    console.error("Error during document verification:", error);
    setAlertMessage("Error occurred during the process. Please try again.");
    setTimeout(() => setAlertMessage(""), 2000); // Clear alert after error
  }
};

// Reusable handler for plan clicks
export const onPlanClickHandler = async (
  navigate,
  customerData,
  planId,
  setAlertMessage
) => {
  //console.log("Selected plan: ", planId);
  localStorage.setItem("planId", planId); // Save the selected plan to localStorage

  await handleAuthRedirect(
    navigate,
    customerData,
    "/login", // Redirect to login if not logged in
    "/documentVerification", // Redirect to document verification if documents not verified
    {
      pathname: "/planConfirmation", // Redirect to plan confirmation with the selected plan
      state: { planId }, // Pass the planId as part of the state
    },
    setAlertMessage // Set alert messages using the passed state handler
  );
};
