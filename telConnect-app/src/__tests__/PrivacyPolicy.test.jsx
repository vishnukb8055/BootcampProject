import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import PrivacyPolicy from '../components/PrivacyPolicy';

describe('PrivacyPolicy Component', () => {
  test('renders all section headers', () => {
    render(<PrivacyPolicy />);
    
    // List of headers as they appear in the Privacy Policy component
    const headers = [
      'Introduction',
      'Information We Collect',
      'How We Use Your Information',
      'Data Security',
      'Cookies and Tracking Technologies',
      'Third-Party Services',
      'Your Rights',
      'Changes to This Privacy Policy',
      'Contact Us'
    ];
    
    // Loop through each header and check if it's rendered
    headers.forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument();  // Match text directly
    });
  });

  test('renders PrivacyPolicy component', () => {
    render(<PrivacyPolicy />);
    expect(screen.getAllByText(/Privacy Policy/i)[0]).toBeInTheDocument();  // Verify the main title renders
  });

  test('renders contact email link with correct href', () => {
    render(<PrivacyPolicy />);
    
    // Find the email link with the specific href
    const emailLink = screen.getByRole('link', { name: /telconnecta@gmail.com/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:telconnecta@gmail.com');  // Validate href attribute
  });
});
