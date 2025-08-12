import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CardGrid from "../components/CardGrid";
import { CustomerContext } from "../context/CustomerContext";
import { BrowserRouter as Router } from "react-router-dom";
import { onPlanClickHandler } from "../utils/authUtils";

// Mock the onPlanClickHandler function
jest.mock("../utils/authUtils", () => ({
  onPlanClickHandler: jest.fn(),
}));

describe("CardGrid Component", () => {
  const mockCustomerData = {
    customerId: "123",
    customerName: "John Doe",
  };

  const mockPlanCard = {
    planId: "PREP-TC-0001",
    price: "299",
    validity: "30",
    data: "10",
    description: "Sample Plan Description",
    plan_name: "Basic Plan",
  };

  const renderCardGrid = (props) => {
    return render(
      <Router>
        <CustomerContext.Provider value={{ customerData: mockCustomerData }}>
          <CardGrid {...props} />
        </CustomerContext.Provider>
      </Router>
    );
  };

  test("renders plan cards correctly", () => {
    renderCardGrid({
      plan_card1: mockPlanCard,
      plan_card2: mockPlanCard,
      plan_card3: mockPlanCard,
    });

    const prices = screen.getAllByText(/₹ 299/i);
    const dataAmounts = screen.getAllByText(/10 GB/i);
    const validity = screen.getAllByText(/30 days/i);
    const viewDetails = screen.getAllByText(/View details/i);
    const selectButtons = screen.getAllByText(/Select/i);

    expect(prices).toHaveLength(3);
    expect(dataAmounts).toHaveLength(3);
    expect(validity).toHaveLength(3);
    expect(viewDetails).toHaveLength(3);
    expect(selectButtons).toHaveLength(3);
  });

  test('opens modal and displays plan details when "View details" is clicked', async () => {
    renderCardGrid({
      plan_card1: mockPlanCard,
      plan_card2: mockPlanCard,
      plan_card3: mockPlanCard,
    });

    fireEvent.click(screen.getAllByText(/View details/i)[0]);

    await waitFor(() => {
      expect(screen.getByText(/Basic Plan/i)).toBeInTheDocument();
      expect(screen.getByText(/Price:/i)).toBeInTheDocument();
      expect(screen.getAllByText(/₹ 299/i)[0]).toBeInTheDocument();
      expect(screen.getByText(/Description:/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Sample Plan Description/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Validity:/i)).toBeInTheDocument();
      expect(screen.getAllByText(/30 days/i)[0]).toBeInTheDocument();
    });
  });

  test('calls onPlanClickHandler when "Select" button is clicked', async () => {
    renderCardGrid({
      plan_card1: mockPlanCard,
      plan_card2: mockPlanCard,
      plan_card3: mockPlanCard,
    });

    const selectButtons = screen.getAllByText(/Select/i);
    fireEvent.click(selectButtons[0]);

    await waitFor(() => {
      // Ensure onPlanClickHandler was called
      expect(onPlanClickHandler).toHaveBeenCalledTimes(1);
      // Ensure onPlanClickHandler was called with the correct arguments
      expect(onPlanClickHandler).toHaveBeenCalledWith(
        expect.any(Function), // navigate function
        mockCustomerData, // customer data
        "PREP-TC-0001",
        expect.any(Function)
      );
    });
  });

  test("should debug the component tree", () => {
    renderCardGrid({
      plan_card1: mockPlanCard,
      plan_card2: mockPlanCard,
      plan_card3: mockPlanCard,
    });
    //console.log(screen.debug());
  });
});
