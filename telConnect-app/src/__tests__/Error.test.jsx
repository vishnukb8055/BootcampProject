import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // Provides custom matchers for Jest
import Error from "../components/Error"; // Ensure this path is correct

describe("ErrorPage Component", () => {
  test("renders the error page with correct content", () => {
    // Render the component
    render(<Error />);

    // Check if the 404 heading is rendered
    const headingElement = screen.getByText(/404 Page Not Found/i);
    expect(headingElement).toBeInTheDocument();

    // Check if the main message is rendered
    const messageElement = screen.getByText(/We looked everywhere/i);
    expect(messageElement).toBeInTheDocument();

    // Check if the description is rendered
    const descriptionElement = screen.getByText(
      /Looks like the page you are trying to find does not exist/i
    );
    expect(descriptionElement).toBeInTheDocument();

    // Check if homepage link is rendered
    const homepageLink = screen.getByRole("link", { name: /homepage/i });
    expect(homepageLink).toHaveAttribute("href", "/");

    // Check if support link is rendered
    const supportLink = screen.getByRole("link", { name: /support/i });
    expect(supportLink).toHaveAttribute("href", "/support");

    // Check if the error image is rendered
    const imageElement = screen.getByAltText("Error");
    expect(imageElement).toBeInTheDocument();
  });
});
