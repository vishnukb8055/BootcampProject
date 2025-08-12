import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import ThankYou from "../components/ThankYou";

// Test to check if the "Return to Homepage" button renders and has the correct href attribute
test("displays return to homepage button", () => {
  render(<ThankYou />);
  const buttonElement = screen.getByRole("link", { name: /Return to Homepage/i });
  expect(buttonElement).toBeInTheDocument();
  expect(buttonElement).toHaveAttribute("href", "/");
});

// Test to check if the tick icon is displayed
test("displays tick icon", () => {
  render(<ThankYou />);
  const tickElement = screen.getByText("✔");
  expect(tickElement).toBeInTheDocument();
});

// Test to check if the thank you message for confirmation is displayed
test("displays the first thank you message", () => {
  render(<ThankYou />);
  const firstMessage = screen.getByText(/Thank You for choosing Us: You will receive a confirmation email shortly/i);
  expect(firstMessage).toBeInTheDocument();
});

// Test to check if the second thank you message is displayed
test("displays the second thank you message", () => {
  render(<ThankYou />);
  const secondMessage = screen.getByText(/We are Thankful for Your Choice – TelConnect: Crafting the Future of Communication/i);
  expect(secondMessage).toBeInTheDocument();
});
