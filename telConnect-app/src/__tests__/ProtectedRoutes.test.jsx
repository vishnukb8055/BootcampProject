import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../utils/ProtectedRoute"; // Adjust path as necessary
import { Navigate } from "react-router-dom";

// Mock for Navigate component
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Navigate: jest.fn(),
}));

describe("ProtectedRoute Component", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("redirects to /notFound if token is not present in localStorage", () => {
    // Arrange
    localStorage.removeItem("bearerToken");

    // Act
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute>AdminPage</ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    );

    // Assert
    expect(Navigate).toHaveBeenCalledWith({ to: "/notFound", replace: true }, {});
  });

  test("renders children (AdminPage) if token exists in localStorage", () => {
    // Arrange
    localStorage.setItem("bearerToken", "test_token");

    // Act
    const { getByText } = render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute>AdminPage</ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    );

    // Assert
    expect(getByText("AdminPage")).toBeInTheDocument();
    expect(Navigate).not.toHaveBeenCalled();
  });
});
