import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import CustomerAccounts from "../components/CustomerAccounts";
import MockAdapter from "axios-mock-adapter";
import userEvent from "@testing-library/user-event";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Mock axios instance
const mock = new MockAdapter(axios);

describe("CustomerAccounts Component", () => {
  const mockData = [
    {
      customerId: "C001",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhno: "1234567890",
      customerAddress: "123 Street, City",
      accountCreationDate: "2023-01-01",
      customerDOB: "1990-01-01",
    },
    {
      customerId: "C002",
      customerName: "Jane Doe",
      customerEmail: "jane@example.com",
      customerPhno: "0987654321",
      customerAddress: "456 Avenue, City",
      accountCreationDate: "2023-02-01",
      customerDOB: "1992-02-01",
    },
  ];

  beforeEach(() => {
    mock.onGet(`${baseUrl}/admin/customers`).reply(200, mockData);
  });

  afterEach(() => {
    mock.reset();
  });

  // Test: Component renders correctly with the title and table structure
  test("renders the component with the table and title", async () => {
    render(<CustomerAccounts />);

    expect(screen.getByText(/Customer Accounts/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search by ID/i)).toBeInTheDocument();

    // Wait for table rows to appear
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });
  });

  // Test: Fetch and display customer data correctly
  test("fetches and displays customer data", async () => {
    render(<CustomerAccounts />);

    // Ensure the fetched data is rendered
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    });
  });

  // Test: Search functionality filters customers
  test("filters customer data based on search input", async () => {
    render(<CustomerAccounts />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    // Search for "C001" to filter the first customer
    fireEvent.change(screen.getByPlaceholderText(/Search by ID/i), {
      target: { value: "C001" },
    });

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Doe")).not.toBeInTheDocument(); // Jane Doe should not appear
  });

  // Test: Deletion opens the confirmation dialog
  test("opens delete confirmation dialog when delete button is clicked", async () => {
    render(<CustomerAccounts />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Click on the delete button for "john@example.com"
    fireEvent.click(screen.getAllByText(/Delete/i)[0]);

    expect(screen.getByText(/Confirm Deletion/i)).toBeInTheDocument();
  });
});
