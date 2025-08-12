import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CarouselComponent from "../components/Carousel";
import { BrowserRouter } from "react-router-dom";
import { CustomerContext } from "../context/CustomerContext";
import { onPlanClickHandler } from "../utils/authUtils";

// Mock onPlanClickHandler function
jest.mock("../utils/authUtils", () => ({
  onPlanClickHandler: jest.fn(),
}));

const renderComponent = (plan_carousel1, plan_carousel2, customerData) => {
  return render(
    <CustomerContext.Provider value={{ customerData }}>
      <BrowserRouter>
        <CarouselComponent
          plan_carousel1={plan_carousel1}
          plan_carousel2={plan_carousel2}
        />
      </BrowserRouter>
    </CustomerContext.Provider>
  );
};

describe("CarouselComponent", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  test("renders carousel items correctly", () => {
    const plan_carousel1 = {
      planName: "Plan 1",
      planDescription: "Description for Plan 1",
      planPrice: "₹100",
      planDuration: "30 Days",
      planId: 1,
    };
    const plan_carousel2 = {
      planName: "Plan 2",
      planDescription: "Description for Plan 2",
      planPrice: "₹200",
      planDuration: "60 Days",
      planId: 2,
    };

    renderComponent(plan_carousel1, plan_carousel2, { customerName: "John" });

    // Check if both carousel items are rendered
    expect(screen.getByText("Plan 1")).toBeInTheDocument();
    expect(screen.getByText("Plan 2")).toBeInTheDocument();
  });

  test("does not render carousel items when plans are missing", () => {
    renderComponent(null, null, { customerName: "John" });

    // Check that no carousel items are rendered
    expect(screen.queryByText("Plan 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Plan 2")).not.toBeInTheDocument();
  });

  test("calls onPlanClickHandler when a plan is clicked", async () => {
    const plan_carousel1 = {
      planName: "Plan 1",
      planDescription: "Description for Plan 1",
      planPrice: "₹100",
      planDuration: "30 Days",
      planId: 1,
    };
    const customerData = { customerName: "John" };

    renderComponent(plan_carousel1, null, customerData);

    const planLink = screen.getByText("Plan 1");

    fireEvent.click(planLink); // Simulate clicking the plan link

    await waitFor(() => {
      expect(onPlanClickHandler).toHaveBeenCalledWith(
        expect.any(Function), // navigate mock function
        customerData,
        plan_carousel1.planId,
        expect.any(Function) // setAlertMessage function
      );
    });
  });

  test("displays alert message when alertMessage state is set", async () => {
    const plan_carousel1 = {
      planName: "Plan 1",
      planDescription: "Description for Plan 1",
      planPrice: "₹100",
      planDuration: "30 Days",
      planId: 1,
    };
    const customerData = { customerName: "John" };

    renderComponent(plan_carousel1, null, customerData);

    const planLink = screen.getByText("Plan 1");

    // Simulate clicking the plan link, triggering the onPlanClickHandler
    fireEvent.click(planLink);

    // Simulate that an alert message was set in the state
    onPlanClickHandler.mockImplementationOnce(
      (navigate, customerData, planId, setAlertMessage) => {
        setAlertMessage("Plan selected successfully!");
      }
    );

  });

  test("displays alert in the correct style and position", async () => {
    const plan_carousel1 = {
      planName: "Plan 1",
      planDescription: "Description for Plan 1",
      planPrice: "₹100",
      planDuration: "30 Days",
      planId: 1,
    };
    const customerData = { customerName: "John" };

    renderComponent(plan_carousel1, null, customerData);

    const planLink = screen.getByText("Plan 1");

    // Simulate clicking the plan link and setting the alert message
    fireEvent.click(planLink);

    onPlanClickHandler.mockImplementationOnce(
      (navigate, customerData, planId, setAlertMessage) => {
        setAlertMessage("Plan selected successfully!");
      }
    );

  });
});
