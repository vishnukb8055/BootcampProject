import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer'; // Adjust the import path if necessary

describe('Footer Component', () => {
  test('renders footer links correctly', () => {
    render(<Footer />);
    
    const homeLink = screen.getByText(/home/i);
    const servicesLink = screen.getByText(/services/i);
    const contactLink = screen.getByText(/contact/i);
    const privacyPolicyLink = screen.getByText(/privacy policy/i);
    const termsOfServiceLink = screen.getByText(/terms of service/i);

    expect(homeLink).toBeInTheDocument();
    expect(servicesLink).toBeInTheDocument();
    expect(contactLink).toBeInTheDocument();
    expect(privacyPolicyLink).toBeInTheDocument();
    expect(termsOfServiceLink).toBeInTheDocument();
  });

  test('renders copyright text', () => {
    render(<Footer />);
    
    const copyrightText = screen.getByText(/© 2024 telconnect/i);
    expect(copyrightText).toBeInTheDocument();
  });

  test('renders correct number of links', () => {
    render(<Footer />);
    
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(5); // There should be 5 links
  });
});
