import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CustomerContext } from '../context/CustomerContext';
import NavBar from '../components/NavBar';

const mockCustomerData = { name: 'srta' }; 

const renderNavBarWithContext = (contextValue = { customerData: mockCustomerData }) => {
  return render(
    <CustomerContext.Provider value={contextValue}>
      <Router>
        <NavBar />
      </Router>
    </CustomerContext.Provider>
  );
};

describe('NavBar Component', () => {
  test('renders NavBar and logo', () => {
    renderNavBarWithContext();
    const logo = screen.getByAltText(/logo/i);
    expect(logo).toBeInTheDocument();
  });

  test('renders search box', () => {
    renderNavBarWithContext();
    const searchBox = screen.getByPlaceholderText(/search/i);
    expect(searchBox).toBeInTheDocument();
  });

  test('renders with login icon when not logged in', () => {
    renderNavBarWithContext({ customerData: null });
    const loginIcon = screen.getByTestId('PersonIcon');
    expect(loginIcon).toBeInTheDocument();
  });

  test('renders with profile icon when logged in', () => {
    renderNavBarWithContext(); // Render with mock customer data
    
    // Get the profile icon directly using its test ID
    const profileIcon = screen.getByTestId('PersonIcon');
    
    // Find the parent link of the icon
    const profileLink = profileIcon.closest('a');
    
    // Ensure the link is present and has the correct href
    expect(profileLink).toHaveAttribute('href', '/profile');
  });
  

  test('shows active button based on current route', () => {
    renderNavBarWithContext();
    const homeButton = screen.getByRole('button', { name: /home/i });
    expect(homeButton).toHaveStyle('background-color: #1E2A5A');
  });

  test('changes navbar styles on scroll', () => {
    const { container } = renderNavBarWithContext();
    const navbarUpper = container.querySelector('.navbar-upper');

    // Simulate scroll
    fireEvent.scroll(window, { target: { scrollY: 100 } });
    expect(navbarUpper).toHaveClass('navbar-upper-hidden');

    // Reset scroll
    fireEvent.scroll(window, { target: { scrollY: 0 } });
    expect(navbarUpper).not.toHaveClass('navbar-upper-hidden');
  });
});
