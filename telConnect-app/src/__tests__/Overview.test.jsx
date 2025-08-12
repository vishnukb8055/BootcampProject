import React from "react"; // Add this import
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import Overview from "../components/Overview";
import MockAdapter from "axios-mock-adapter";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const mockAxios = new MockAdapter(axios);

describe("Overview Component", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  test("renders the component layout correctly", async () => {
    const mockResponse = [
      { planId: "PREP-001", status: "Active" },
      { planId: "POST-002", status: "Expired" },
    ];

    mockAxios
      .onGet(`${baseUrl}/customers/plans?adminId=1`)
      .reply(200, mockResponse);

    render(<Overview />);

    expect(screen.getByText(/Number of Active Users/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Ratio of Prepaid and Postpaid Users/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Admin Tasks/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Active Users/i })
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/Calendar/i)).toBeInTheDocument();
  });

  test("renders with default data", () => {
    render(<Overview />);
    expect(screen.getByLabelText("Admin Tasks").value).toBe("Daily Tasks");
  });

  test("handles API errors gracefully", async () => {
    const mockErrorHandler = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockAxios.onGet(`${baseUrl}/customers/plans?adminId=1`).reply(500);

    render(<Overview />);

    // Ensure console.error is called
    await waitFor(() => {
      expect(mockErrorHandler).toHaveBeenCalled();
    });

    // Clean up the spy after the test
    mockErrorHandler.mockRestore();
  });
});
