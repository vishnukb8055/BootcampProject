import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DocumentVerification from "../components/DocumentVerification";
import { CustomerContext } from "../context/CustomerContext";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { BrowserRouter as Router } from "react-router-dom";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const mockAxios = new MockAdapter(axios);

const mockCustomerData = {
  customerId: "12345",
};

const renderComponent = () => {
  return render(
    <CustomerContext.Provider value={{ customerData: mockCustomerData }}>
      <Router>
        <DocumentVerification />
      </Router>
    </CustomerContext.Provider>
  );
};

describe("DocumentVerification Component", () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  test("renders correctly", () => {
    renderComponent();
    expect(
      screen.getByText(/Please upload documents to complete KYC/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Document Type:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Upload File:/i)).toBeInTheDocument();
  });

  test("shows an error message for unsupported file type", () => {
    renderComponent();

    const fileInput = screen.getByLabelText(/Upload File:/i);
    fireEvent.change(fileInput, {
      target: { files: [new File([""], "test.txt", { type: "text/plain" })] },
    });

    expect(screen.getByText(/Please upload a PDF file/i)).toBeInTheDocument();
  });

  test("shows an error message for file size exceeding limit", () => {
    renderComponent();

    const fileInput = screen.getByLabelText(/Upload File:/i);
    fireEvent.change(fileInput, {
      target: {
        files: [
          new File(["a".repeat(501 * 1024)], "large.pdf", {
            type: "application/pdf",
          }),
        ],
      },
    });

    expect(screen.getByText(/File size exceeds 500KB/i)).toBeInTheDocument();
  });

  test("uploads a valid document and shows success message", async () => {
    mockAxios.onPost(`${baseUrl}/ocr/recognize`).reply(200);
    mockAxios
      .onPatch(`${baseUrl}/verification/12345/status?status=success`)
      .reply(200);

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Document Type:/i), {
      target: { value: "Aadhar" },
    });

    const fileInput = screen.getByLabelText(/Upload File:/i);
    fireEvent.change(fileInput, {
      target: {
        files: [
          new File(["valid content"], "document.pdf", {
            type: "application/pdf",
          }),
        ],
      },
    });

    const uploadButton = screen.getByRole("button", { name: /Upload/i });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Document verified successfully/i)
      ).toBeInTheDocument();
    });
  });

  test("shows an error message when document verification fails", async () => {
    mockAxios.onPost(`${baseUrl}/ocr/recognize`).reply(500);

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Document Type:/i), {
      target: { value: "Aadhar" },
    });

    const fileInput = screen.getByLabelText(/Upload File:/i);
    fireEvent.change(fileInput, {
      target: {
        files: [
          new File(["valid content"], "document.pdf", {
            type: "application/pdf",
          }),
        ],
      },
    });

    const uploadButton = screen.getByRole("button", { name: /Upload/i });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Document submission failed. Please try again/i)
      ).toBeInTheDocument();
    });
  });
});
