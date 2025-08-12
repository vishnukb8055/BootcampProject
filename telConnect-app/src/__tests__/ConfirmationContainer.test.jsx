import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ConfirmationContainer from "../components/ConfirmationContainer";
import axios from "axios";
import { MemoryRouter, Route } from "react-router-dom";

// Mocking axios
jest.mock("axios");

describe("ConfirmationContainer", () => {
  const mockPlanData = {
    planId: "POST-TC-1234",
    planName: "Premium Postpaid Plan",
    planPrice: "₹999",
    planDescription: "Unlimited calls and 100GB data",
    planDuration: "30 days",
  };

  // Mocking the `useLocation` hook
  const mockUseLocationValue = {
    pathname: "/confirmation",
    state: {
      planId: "POST-TC-1234",
    },
  };

  it("renders loading state initially", () => {
    render(
      <MemoryRouter initialEntries={[mockUseLocationValue]}>
        <ConfirmationContainer />
      </MemoryRouter>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("displays error message if planId is not found in location state or localStorage", async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/confirmation" }]}>
        <ConfirmationContainer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/plan id not found/i)).toBeInTheDocument();
    });
  });

  it("displays error message if API call fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("API Call Failed"));

    render(
      <MemoryRouter initialEntries={[mockUseLocationValue]}>
        <ConfirmationContainer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load plan details/i)).toBeInTheDocument();
    });
  });

  it("renders no plan data message when no plan data is returned", async () => {
    axios.get.mockResolvedValueOnce({ data: null });

    render(
      <MemoryRouter initialEntries={[mockUseLocationValue]}>
        <ConfirmationContainer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/no plan data available/i)).toBeInTheDocument();
    });
  });
});
