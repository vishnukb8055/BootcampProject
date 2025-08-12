import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import Profile from "../components/Profile";
import { CustomerContext } from "../context/CustomerContext";
import { MemoryRouter } from "react-router-dom";
import axiosMock from "axios-mock-adapter";
import EditProfileModal from "../components/EditProfileModal";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Set up the Axios mock adapter
const mockAxios = new axiosMock(axios);

const mockCustomerData = {
  customerId: 1,
  customerName: "John Doe",
  customerEmail: "john@example.com",
  customerPhno: "1234567890",
  role: "User",
  customerAddress: "123 Main St",
  customerDOB: "1990-01-01",
};

const mockActivePlan = {
  planName: "Basic Plan",
  status: "Active",
};

// Mocking CustomerContext provider for the test
const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <CustomerContext.Provider {...providerProps}>
      <MemoryRouter>{ui}</MemoryRouter>
    </CustomerContext.Provider>,
    renderOptions
  );
};

describe("Profile Page", () => {
  beforeEach(() => {
    // Reset the mock before each test
    mockAxios.reset();
  });

  test("should display loading message while fetching data", () => {
    const providerProps = {
      value: {
        customerData: mockCustomerData,
        logout: jest.fn(),
      },
    };

    // Render the Profile component with context and mock data
    renderWithContext(<Profile />, { providerProps });

    // Expect loading text to appear
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test("should display customer data when data is fetched", async () => {
    const providerProps = {
      value: {
        customerData: mockCustomerData,
        logout: jest.fn(),
      },
    };

    // Mock the API responses for customer and document verification
    mockAxios
      .onGet(`${baseUrl}/customers/${mockCustomerData.customerEmail}`)
      .reply(200, mockCustomerData);
    mockAxios
      .onGet(
        `${baseUrl}/customers/plans/${mockCustomerData.customerId}/plans/status`
      )
      .reply(200, mockActivePlan);

    renderWithContext(<Profile />, { providerProps });

    await waitFor(() => {
      expect(
        screen.getByText(mockCustomerData.customerName)
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockCustomerData.customerEmail)
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockCustomerData.customerPhno)
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockCustomerData.customerAddress)
      ).toBeInTheDocument();
    });
  });

  test("should show document not verified message", async () => {
    const providerProps = {
      value: {
        customerData: mockCustomerData,
        logout: jest.fn(),
      },
    };

    // Mock customer data and document not verified
    mockAxios
      .onGet(`${baseUrl}/customers/${mockCustomerData.customerEmail}`)
      .reply(200, mockCustomerData);
    mockAxios
      .onGet(
        `${baseUrl}/customers/plans/${mockCustomerData.customerId}/plans/status`
      )
      .reply(200, mockActivePlan);

    renderWithContext(<Profile />, { providerProps });

    await waitFor(() => {
      expect(
        screen.getByText("Your documents are not verified.")
      ).toBeInTheDocument();
    });
  });
});
