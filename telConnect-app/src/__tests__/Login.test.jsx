import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "../components/Login";
import { CustomerContext } from "../context/CustomerContext";
import axios from "axios";

// Mock axios to simulate API calls
jest.mock("axios");

const mockSetCustomerData = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: { fromRegistration: true } }),
}));

const renderLogin = () => {
  render(
    <CustomerContext.Provider value={{ setCustomerData: mockSetCustomerData }}>
      <Router>
        <Login />
      </Router>
    </CustomerContext.Provider>
  );
};

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login component correctly", () => {
    renderLogin();
    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account?/i)).toBeInTheDocument();
  });

  test("displays success message when coming from registration", async () => {
    renderLogin();

    // Ensure the success message is displayed after mounting
    await waitFor(() => {
      expect(screen.getByText(/Login with your new credentials!/i)).toBeInTheDocument();
    });
  });

  test("handles successful login", async () => {
    // Mock axios POST request for login and GET request for customer data
    axios.post.mockResolvedValueOnce({ data: { token: "mockToken" } });
    axios.get.mockResolvedValueOnce({ data: { customerId: 2 } });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    // Check for loading state
    expect(screen.getByRole("button", { name: /Please wait....*/ })).toBeInTheDocument();

    await waitFor(() => {
      expect(mockSetCustomerData).toHaveBeenCalledWith({ customerId: 2 });
    });

    expect(mockNavigate).toHaveBeenCalledWith("/home");

    // Ensure the loading state is gone
    expect(screen.queryByRole("button", { name: /Please wait....*/ })).not.toBeInTheDocument();
  });

  test("redirects to admin page if customerId is 1", async () => {
    // Mock axios POST and GET requests
    axios.post.mockResolvedValueOnce({ data: { token: "mockToken" } });
    axios.get.mockResolvedValueOnce({ data: { customerId: 1 } });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
      target: { value: "adminpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(mockSetCustomerData).toHaveBeenCalledWith({ customerId: 1 });
    });

    expect(mockNavigate).toHaveBeenCalledWith("/adminPage");
  });

  test("handles login failure with error message", async () => {
    // Mock axios POST to simulate failed login with an error message
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });

    // Ensure the loading state is gone
    expect(screen.queryByRole("button", { name: /Please wait....*/ })).not.toBeInTheDocument();
  });

  test("handles login failure with no error message", async () => {
    // Mock axios POST to simulate failed login without an error message
    axios.post.mockRejectedValueOnce({
      response: {},
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/An error occurred during login./i)).toBeInTheDocument();
    });

    // Ensure the loading state is gone
    expect(screen.queryByRole("button", { name: /Please wait....*/ })).not.toBeInTheDocument();
  });

  test("disables login button during API call", async () => {
    axios.post.mockImplementationOnce(() => new Promise(() => {})); // Simulate pending request

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    // Ensure the login button is disabled during loading
    expect(screen.getByRole("button", { name: /Please wait....*/ })).toBeDisabled();
  });
});
