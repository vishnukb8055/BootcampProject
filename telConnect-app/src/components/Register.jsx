import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for making API calls
import "../styles/RegisterPage.css";
//import telconnectimg1 from "../assets/login-img.png";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // Function to send OTP
  const handleSendOtp = async () => {
    const name = "";
    try {
      //API call to invoke OTP service
      const response = await axios.post(
        `${baseUrl}/emails/OTP?recipient=${email}&name=${name}`
      );
      setOtpSent(true); // Update the state to show OTP sent message
      setError(null); // Clear error if OTP is sent successfully
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP. Please try again."); // Show error message
    }
  };

  // Function to verify OTP
  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/emails/otp/verify?recipient=${email}&otp=${otp}`, // Your OTP verification API
        {} // Sending email and otp in the request body
      );

      if (response.status === 200) {
        // OTP verified successfully, proceed to next step
        setOtpVerified(true);
        setStep(2);

        // Store email in sessionStorage after OTP verification
        sessionStorage.setItem("email", email);
      }
    } catch (err) {
      console.error(err);
      // If OTP verification fails, refresh the page
      setOtpVerified(false);
      setError("OTP verification failed. Please try again.");
      window.location.reload(); // Refresh the page to stay on the same step
    }
  };

  // Function to register the user
  const handleRegister = (event) => {
    event.preventDefault();

    // Check if the passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Store password in sessionStorage
    sessionStorage.setItem("password", password);

    navigate("/personalInfo");
  };

  return (
    <div>
      <div className="register-container">
        <div className="image-section">
          <img src="src\assets\login-img.png" alt="Animation" />
        </div>
        <div className="register-section">
          <h2>Sign Up</h2>
          <form onSubmit={handleRegister}>
            {step === 1 && (
              <div className="step-box">
                <h4>Step 1 of 2</h4>
                <div>
                  <label className="bold-label">Enter Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <button
                  type="button"
                  className="send-otp-button"
                  onClick={handleSendOtp}
                >
                  Send OTP
                </button>
                {otpSent && (
                  <p className="msg">OTP has been sent successfully!</p>
                )}
                {error && <p className="msg">{error}</p>}
                <div>
                  <label className="bold-label">Enter OTP:</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    required
                  />
                </div>
                <button
                  type="button"
                  className="verify-button"
                  onClick={handleVerifyOtp}
                >
                  Verify
                </button>
              </div>
            )}
            {step === 2 && (
              <div className="step-box">
                <h3>Step 2 of 2</h3>
                <div>
                  <label className="bold-label">Create Password:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                  />
                </div>
                <div>
                  <label className="bold-label">Confirm Password:</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                {error && <p className="msg">{error}</p>}
                <button type="submit">Register</button>
              </div>
            )}
          </form>
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
