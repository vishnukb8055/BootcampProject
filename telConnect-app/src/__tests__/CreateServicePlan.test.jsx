// src/__tests__/CreateServicePlan.test.jsx
import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import CreateServicePlan from "../components/CreateServicePlan";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

jest.mock("axios");

describe("CreateServicePlan Component", () => {
  const setup = () => {
    const utils = render(<CreateServicePlan />);
    const planId = utils.getByLabelText(/plan id/i); // Plan ID field
    const planName = utils.getByLabelText(/plan name/i);
    const planPrice = utils.getByLabelText(/plan price/i);
    const planDuration = utils.getByLabelText(/plan duration/i);
    const planDescription = utils.getByLabelText(/plan description/i);
    const addButton = utils.getByRole("button", { name: /add/i });
    const cancelButton = utils.getByRole("button", { name: /cancel/i });
    return {
      ...utils,
      planId,
      planName,
      planPrice,
      planDuration,
      planDescription,
      addButton,
      cancelButton,
    };
  };

  beforeEach(() => {
    axios.post.mockClear();
  });

  test("renders form elements correctly", () => {
    const { planId, planName, planPrice, planDuration, planDescription } =
      setup();

    expect(planId).toBeInTheDocument();
    expect(planName).toBeInTheDocument();
    expect(planPrice).toBeInTheDocument();
    expect(planDuration).toBeInTheDocument();
    expect(planDescription).toBeInTheDocument();
  });

  test("updates form fields on user input", () => {
    const { planId, planName, planPrice, planDuration, planDescription } =
      setup();

    fireEvent.change(planId, { target: { value: "PREP-TC-0001" } });
    fireEvent.change(planName, { target: { value: "Basic Plan" } });
    fireEvent.change(planPrice, { target: { value: "10" } });
    fireEvent.change(planDuration, { target: { value: "30 days" } });
    fireEvent.change(planDescription, {
      target: { value: "A basic prepaid plan" },
    });

    expect(planId.value).toBe("PREP-TC-0001");
    expect(planName.value).toBe("Basic Plan");
    expect(planPrice.value).toBe("10");
    expect(planDuration.value).toBe("30 days");
    expect(planDescription.value).toBe("A basic prepaid plan");
  });

  test("submits the form and makes API requests successfully", async () => {
    const {
      planId,
      planName,
      planPrice,
      planDuration,
      planDescription,
      addButton,
    } = setup();

    fireEvent.change(planId, { target: { value: "PREP-TC-0001" } });
    fireEvent.change(planName, { target: { value: "Basic Plan" } });
    fireEvent.change(planPrice, { target: { value: "10" } });
    fireEvent.change(planDuration, { target: { value: "30 days" } });
    fireEvent.change(planDescription, {
      target: { value: "A basic prepaid plan" },
    });

    axios.post.mockResolvedValueOnce({ data: {} });

    fireEvent.click(addButton);

    await waitFor(() => {
      const token = localStorage.getItem("bearerToken"); // Retrieve token from localStorage
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        `${baseUrl}/admin/newPlan`,
        {
          planId: "PREP-TC-0001",
          planName: "Basic Plan",
          planPrice: "10",
          planDescription: "A basic prepaid plan",
          planDuration: "30 days",
          planType: "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    });
  });

  test("handles form submission errors", async () => {
    const {
      planId,
      planName,
      planPrice,
      planDuration,
      planDescription,
      addButton,
    } = setup();

    fireEvent.change(planId, { target: { value: "PREP-TC-0001" } });
    fireEvent.change(planName, { target: { value: "Basic Plan" } });
    fireEvent.change(planPrice, { target: { value: "10" } });
    fireEvent.change(planDuration, { target: { value: "30 days" } });
    fireEvent.change(planDescription, {
      target: { value: "A basic prepaid plan" },
    });

    axios.post.mockRejectedValueOnce(new Error("Error submitting form data"));

    fireEvent.click(addButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(
        screen.getByText(/Error submitting form data/i)
      ).toBeInTheDocument();
    });
  });

  test("clears the form on cancel", () => {
    const {
      planId,
      planName,
      planPrice,
      planDuration,
      planDescription,
      cancelButton,
    } = setup();

    fireEvent.change(planId, { target: { value: "PREP-TC-0001" } });
    fireEvent.change(planName, { target: { value: "Basic Plan" } });
    fireEvent.change(planPrice, { target: { value: "10" } });
    fireEvent.change(planDuration, { target: { value: "30 days" } });
    fireEvent.change(planDescription, {
      target: { value: "A basic prepaid plan" },
    });

    fireEvent.click(cancelButton);

    expect(planId.value).toBe("");
    expect(planName.value).toBe("");
    expect(planPrice.value).toBe("");
    expect(planDuration.value).toBe("");
    expect(planDescription.value).toBe("");
  });

  test("displays submitted data after submission", async () => {
    const {
      planId,
      planName,
      planPrice,
      planDuration,
      planDescription,
      addButton,
    } = setup();

    fireEvent.change(planId, { target: { value: "PREP-TC-0001" } });
    fireEvent.change(planName, { target: { value: "Basic Plan" } });
    fireEvent.change(planPrice, { target: { value: "10" } });
    fireEvent.change(planDuration, { target: { value: "30 days" } });
    fireEvent.change(planDescription, {
      target: { value: "A basic prepaid plan" },
    });

    axios.post.mockResolvedValueOnce({ data: {} });

    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/Submitted Information/i)).toBeInTheDocument();
      expect(screen.getByText("PREP-TC-0001")).toBeInTheDocument();
      expect(screen.getByText("Basic Plan")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("30 days")).toBeInTheDocument();
      const descriptions = screen.getAllByText("A basic prepaid plan");
      expect(descriptions[0]).toBeInTheDocument();
    });
  });
});
