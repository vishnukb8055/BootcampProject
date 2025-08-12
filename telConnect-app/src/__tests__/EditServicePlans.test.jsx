import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import EditServicePlans from "../components/EditServicePlans";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Mock axios
jest.mock("axios");

describe("EditServicePlans Component", () => {
  const plans = [
    {
      planId: "PREP001",
      planName: "Prepaid Plan 1",
      planDescription: "Description 1",
      planPrice: "Rs. 100",
      planDuration: "30 Days",
    },
    {
      planId: "POST001",
      planName: "Postpaid Plan 1",
      planDescription: "Description 2",
      planPrice: "Rs. 200",
      planDuration: "30 Days",
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: plans });
  });

  test("renders available services heading", async () => {
    render(<EditServicePlans />);
    expect(await screen.findByText(/available services/i)).toBeInTheDocument();
  });

  test("fetches and displays plans", async () => {
    render(<EditServicePlans />);
    expect(await screen.findByText("Prepaid Plan 1")).toBeInTheDocument();
    expect(screen.queryByText("Postpaid Plan 1")).not.toBeInTheDocument(); // Should not display postpaid by default
  });

  test("filters plans based on service type", async () => {
    render(<EditServicePlans />);
    const selectServiceType = screen.getByLabelText(/select service type/i);

    // Switch to Postpaid
    fireEvent.change(selectServiceType, { target: { value: "postpaid" } });

    expect(await screen.findByText("Postpaid Plan 1")).toBeInTheDocument();
    expect(screen.queryByText("Prepaid Plan 1")).not.toBeInTheDocument(); // Should not display prepaid
  });

  test("opens edit modal on edit button click", async () => {
    render(<EditServicePlans />);
    const editButton = await screen.findByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    expect(screen.getByText(/edit plan/i)).toBeInTheDocument();
  });

  test("updates plan details", async () => {
    axios.patch.mockResolvedValue({});

    render(<EditServicePlans />);
    const editButton = await screen.findByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    // Change input values in modal
    fireEvent.change(screen.getByLabelText(/plan name/i), {
      target: { value: "Updated Prepaid Plan" },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: "Rs. 150" },
    });
    fireEvent.change(screen.getByLabelText(/duration/i), {
      target: { value: "60 Days" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Updated Description" },
    });

    // Save changes
    const saveButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalledWith(
        expect.stringContaining(`${baseUrl}/admin/PREP001/edit`),
        expect.objectContaining({
          planName: "Updated Prepaid Plan",
          planPrice: "Rs. 150",
          planDuration: "60 Days",
          planDescription: "Updated Description",
        }),
        expect.anything()
      );
    });
  });

  test("closes the modal on cancel button click", async () => {
    render(<EditServicePlans />);
    const editButton = await screen.findByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    // Check if the modal title is no longer in the document
    await waitFor(() => {
      expect(screen.queryByText(/edit plan/i)).not.toBeInTheDocument();
    });
  });

  test("handles error on fetching plans", async () => {
    axios.get.mockRejectedValue(new Error("Error fetching plans"));
    render(<EditServicePlans />);

    expect(await screen.findByText(/no plans available/i)).toBeInTheDocument();
  });
});
