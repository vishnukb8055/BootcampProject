import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../components/Register"; // Adjust the import to your file structure
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

// Mock the axios module
jest.mock("axios");

describe("Register Component", () => {
  // Reset the mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Register component", () => {
    render(<Register />, { wrapper: MemoryRouter });

    // Check if Sign Up heading is present
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();

    // Check if the Send OTP button is present
    expect(screen.getByText(/Send OTP/i)).toBeInTheDocument();
  });

  test("handles sending OTP successfully", async () => {
    // Mock the POST request for sending OTP
    axios.post.mockResolvedValueOnce({ data: { message: "OTP sent successfully" } });

    // Render the Register component
    render(<Register />, { wrapper: MemoryRouter });

    // Find the email input using placeholder text
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const sendOtpButton = screen.getByText(/Send OTP/i);

    // Simulate user entering email
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    // Simulate clicking the Send OTP button
    fireEvent.click(sendOtpButton);

    // Wait for the OTP success message to appear
    await waitFor(() => {
      expect(screen.getByText(/OTP has been sent successfully!/i)).toBeInTheDocument();
    });
  });

  test("displays error message when OTP sending fails", async () => {
    // Mock the POST request to fail
    axios.post.mockRejectedValueOnce(new Error("Failed to send OTP"));

    // Render the Register component
    render(<Register />, { wrapper: MemoryRouter });

    // Find the email input using placeholder text
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const sendOtpButton = screen.getByText(/Send OTP/i);

    // Simulate user entering email
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    // Simulate clicking the Send OTP button
    fireEvent.click(sendOtpButton);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to send OTP. Please try again./i)).toBeInTheDocument();
    });
  });

  test("displays error message when OTP verification fails", async () => {
    // Mock the POST request for OTP verification to fail
    axios.post.mockRejectedValueOnce(new Error("OTP verification failed"));

    // Render the Register component
    render(<Register />, { wrapper: MemoryRouter });

    // Simulate entering email and OTP
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const sendOtpButton = screen.getByText(/Send OTP/i);
    fireEvent.click(sendOtpButton);

    // Simulate entering the OTP
    const otpInput = screen.getByPlaceholderText(/Enter OTP/i);
    fireEvent.change(otpInput, { target: { value: "123456" } });

    const verifyOtpButton = screen.getByText(/Verify/i);
    fireEvent.click(verifyOtpButton);

    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText(/OTP verification failed. Please try again./i)).toBeInTheDocument();
    });
  });

});
