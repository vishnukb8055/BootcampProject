import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import TermsOfService from '../components/TermsOfService';

test('renders contact email link', () => {
    render(<TermsOfService />);
    const linkElement = screen.getByText(/support@telconnect.com/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'mailto:support@telconnect.com');
});

test('renders all sections', () => {
    render(<TermsOfService />);
    const sections = [
        'Introduction',
        'Services Provided',
        'Account Responsibility',
        'Prohibited Conduct',
        'Service Interruptions',
        'Limitation of Liability',
        'Changes to Terms',
        'Governing Law',
        'Contact Us'
    ];

    sections.forEach(section => {
        const sectionElement = screen.getByText(section);
        expect(sectionElement).toBeInTheDocument();
    });
});
