import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CustomerContext } from "../context/CustomerContext";
import EditProfileModal from "../components/EditProfileModal";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Mock axios for API requests
const mockAxios = new MockAdapter(axios);

const mockUpdateCustomerData = jest.fn();

const mockCustomerData = {
  customerName: "John Doe",
  customerEmail: "john.doe@example.com",
  customerDOB: "1990-01-01",
  customerAddress: "123 Main St",
};

const renderComponent = (show) => {
  render(
    <CustomerContext.Provider value={{ customerData: mockCustomerData }}>
      <EditProfileModal
        show={show}
        handleClose={() => {}}
        updateCustomerData={mockUpdateCustomerData}
      />
    </CustomerContext.Provider>
  );
};

afterEach(() => {
  // Reset the mock after each test
  mockAxios.reset();
});

test("renders EditProfileModal and opens Change Password modal", () => {
  renderComponent(true);

  // Check if Edit Profile modal is visible
  expect(screen.getAllByText("Edit Profile")[0]).toBeInTheDocument();

  // Open Change Password modal
  fireEvent.click(screen.getAllByText("Change Password")[0]);
  expect(screen.getAllByText("Change Password")[0]).toBeInTheDocument();
});

test("handles input changes correctly", () => {
  renderComponent(true);

  // Simulate input change
  fireEvent.change(screen.getByLabelText(/Date of Birth/i), {
    target: { value: "1995-05-05" },
  });
  expect(screen.getByLabelText(/Date of Birth/i).value).toBe("1995-05-05");
});

test("shows success alert after saving profile changes", async () => {
  renderComponent(true);

  // Simulate input change and save
  fireEvent.change(screen.getByLabelText(/Address/i), {
    target: { value: "456 Elm St" },
  });
  fireEvent.click(screen.getByText("Save Changes"));

  await waitFor(() => {
    expect(
      screen.getByText("Profile updated successfully!")
    ).toBeInTheDocument();
  });
});

test("handles password visibility toggle correctly", () => {
  renderComponent(true);

  // Open Change Password modal
  fireEvent.click(screen.getByText("Change Password"));

  // Toggle password visibility for the current password
  const toggleButton = screen.getAllByText("Show")[0];
  fireEvent.click(toggleButton);
  expect(toggleButton.textContent).toBe("Hide");

  // Toggle it back to hidden
  fireEvent.click(toggleButton);
  expect(toggleButton.textContent).toBe("Show");
});

test("shows error alert when passwords do not match", async () => {
  renderComponent(true);

  // Mock API response for correct password change
  mockAxios.onPost(`${baseUrl}/login`).reply(200);

  // Open Change Password modal
  fireEvent.click(screen.getByText("Change Password"));

  // Simulate matching password inputs
  fireEvent.change(screen.getAllByLabelText(/New Password/i)[0], {
    target: { value: "newpassword123" },
  });
  fireEvent.change(screen.getByLabelText(/Confirm New Password/i), {
    target: { value: "newpassword" },
  });

  // Try to save the new password
  fireEvent.click(screen.getByText("Save New Password"));

  await waitFor(() => {
    expect(screen.getByText("New passwords do not match!")).toBeInTheDocument();
  });
});

test("shows error alert when current password is incorrect", async () => {
  renderComponent(true);

  // Mock API response for incorrect current password
  mockAxios.onPost(`${baseUrl}/login`).reply(400);

  // Open Change Password modal
  fireEvent.click(screen.getByText("Change Password"));

  // Simulate current password input
  fireEvent.change(screen.getByLabelText(/Current Password/i), {
    target: { value: "wrongpassword" },
  });

  // Try to save the new password
  fireEvent.click(screen.getByText("Save New Password"));

  await waitFor(() => {
    expect(
      screen.getByText("Current password is incorrect!")
    ).toBeInTheDocument();
  });
});

test("shows success alert when password is changed successfully", async () => {
  renderComponent(true);

  // Mock API response for correct password change
  mockAxios.onPost(`${baseUrl}/login`).reply(200);

  // Open Change Password modal
  fireEvent.click(screen.getByText("Change Password"));

  // Simulate matching password inputs
  fireEvent.change(screen.getAllByLabelText(/New Password/i)[0], {
    target: { value: "newpassword123" },
  });
  fireEvent.change(screen.getByLabelText(/Confirm New Password/i), {
    target: { value: "newpassword123" },
  });

  // Try to save the new password
  fireEvent.click(screen.getByText("Save New Password"));

  await waitFor(() => {
    expect(
      screen.getByText("Password changed successfully!")
    ).toBeInTheDocument();
  });
});
