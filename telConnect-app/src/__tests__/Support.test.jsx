import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Support from '../components/Support';

describe('Support Component', () => {
  // Test to check if the support section renders correctly
  test('renders the support section', () => {
    render(<Support />);
    expect(screen.getByText('How Can We Help You?')).toBeInTheDocument();  // Verifies the main heading
    expect(screen.getByText('At TelConnect, we’re here to assist you with any issues or questions you may have. Let us know how we can help!')).toBeInTheDocument();
  });

  // Test to check if the form fields are rendered properly
  test('renders the form fields', () => {
    render(<Support />);
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Describe your issue...')).toBeInTheDocument();
  });

  // Test to check if the form can be filled out correctly
  test('allows user to fill out the form', () => {
    render(<Support />);
    
    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Describe your issue...'), { target: { value: 'I need help with my account.' } });
  
    // Verify that the input values are correctly updated
    expect(screen.getByPlaceholderText('Enter your name').value).toBe('John Doe');
    expect(screen.getByPlaceholderText('Enter your email').value).toBe('john@example.com');
    expect(screen.getByPlaceholderText('Describe your issue...').value).toBe('I need help with my account.');
  });

  // Test to check if the contact information is rendered
  test('renders contact information', () => {
    render(<Support />);
    
    // Verify that all contact information is displayed
    expect(screen.getByText('Call Us')).toBeInTheDocument();
    expect(screen.getByText('1-800-123-4567')).toBeInTheDocument();
    expect(screen.getByText('Email Us')).toBeInTheDocument();
    expect(screen.getByText('telconnecta@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('Visit Us')).toBeInTheDocument();
    expect(screen.getByText('123 Telecom Street, Tech City')).toBeInTheDocument();
  });
});
