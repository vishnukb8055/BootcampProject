import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import DocumentVerificationStatusLogs from "../components/DocumentVerificationStatusLogs";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Mock axios
jest.mock("axios");

const mockData = [
  {
    verificationId: "1",
    customerId: "123",
    documentId: "456",
    requestDate: new Date().toISOString(),
    requestStatus: "SUCCESS",
  },
  {
    verificationId: "2",
    customerId: "789",
    documentId: "012",
    requestDate: new Date().toISOString(),
    requestStatus: "FAILED",
  },
];

describe("DocumentVerificationStatusLogs Component", () => {
  beforeEach(() => {
    // Mock the localStorage to return a dummy token
    jest.spyOn(Storage.prototype, "getItem").mockReturnValue("dummyToken");
  });

  test("fetches and displays verification logs data", async () => {
    // Mock the axios GET request
    axios.get.mockResolvedValueOnce({ data: mockData });

    render(<DocumentVerificationStatusLogs />);

    // Ensure axios was called with the correct endpoint
    expect(axios.get).toHaveBeenCalledWith(
      `${baseUrl}/admin/verificationAttempts`,
      expect.any(Object)
    );

    // Wait for the data to be rendered on the screen
    await waitFor(() => {
      expect(screen.getByText("1")).toBeInTheDocument(); // Verification ID 1
      expect(screen.getByText("123")).toBeInTheDocument(); // Customer ID 123
      expect(screen.getByText("SUCCESS")).toBeInTheDocument(); // Status
    });
  });

  test("search input filters the data by customer ID", async () => {
    // Mock the axios GET request
    axios.get.mockResolvedValueOnce({ data: mockData });

    render(<DocumentVerificationStatusLogs />);

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText("123")).toBeInTheDocument();
      expect(screen.getByText("789")).toBeInTheDocument();
    });

    // Type into the search box to filter results
    fireEvent.change(screen.getByPlaceholderText("Search by ID"), {
      target: { value: "123" },
    });

    // Expect only the matching customer ID to show up
    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.queryByText("789")).not.toBeInTheDocument();
  });

  test("status color and text transformation for SUCCESS and FAILED", async () => {
    axios.get.mockResolvedValueOnce({ data: mockData });

    render(<DocumentVerificationStatusLogs />);

    // Wait for the data to be loaded
    await waitFor(() => {
      const successStatus = screen.getByText("SUCCESS");
      const failedStatus = screen.getByText("FAILED");

      expect(successStatus).toBeInTheDocument();
      expect(successStatus).toHaveStyle("color: green");
      expect(failedStatus).toBeInTheDocument();
      expect(failedStatus).toHaveStyle("color: red");
    });
  });

  test("handles error during data fetching", async () => {
    // Mock axios to reject the promise (simulate network error)
    axios.get.mockRejectedValueOnce(new Error("Failed to fetch"));

    render(<DocumentVerificationStatusLogs />);

    // Wait for the component to try and fetch data
    await waitFor(() => {
      expect(
        screen.queryByText("There was an error fetching the data!")
      ).toBeNull(); // Component should handle the error internally
    });
  });
});
