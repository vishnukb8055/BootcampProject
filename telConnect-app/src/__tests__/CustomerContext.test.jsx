import React from 'react';
import { render, screen } from '@testing-library/react';
import { CustomerProvider, CustomerContext } from '../context/CustomerContext'; // Adjust path as needed

describe('CustomerProvider', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('loads customer data and planId from localStorage on mount', () => {
    // Set up localStorage with mock data
    localStorage.setItem('customerData', JSON.stringify({
      customerId: 1,
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerPhno: '1234567890',
      customerAddress: '123 Main St',
      customerDOB: '1990-01-01',
      accountCreationDate: '2024-09-18',
      role: 'user'
    }));
    localStorage.setItem('planId', 'PLAN123');

    // Render the provider
    render(
      <CustomerProvider>
        <CustomerContext.Consumer>
          {value => {
            expect(localStorage.getItem('customerData')).toBe(JSON.stringify({
                customerId: 1,
                customerName: 'John Doe',
                customerEmail: 'john.doe@example.com',
                customerPhno: '1234567890',
                customerAddress: '123 Main St',
                customerDOB: '1990-01-01',
                accountCreationDate: '2024-09-18',
                role: 'user'
              }));
              expect(localStorage.getItem('planId')).toBe('PLAN123');
            return null;
          }}
        </CustomerContext.Consumer>
      </CustomerProvider>
    );
  });

  test('stores customer data in localStorage when it changes', () => {
    const TestComponent = () => {
      const { setCustomerData } = React.useContext(CustomerContext);

      React.useEffect(() => {
        setCustomerData({
          customerId: 2,
          customerName: 'Jane Doe',
          customerEmail: 'jane.doe@example.com',
          customerPhno: '0987654321',
          customerAddress: '456 Elm St',
          customerDOB: '1995-05-15',
          accountCreationDate: '2024-09-18',
          role: 'admin'
        });
      }, [setCustomerData]);

      return null;
    };

    // Render the provider and test component
    render(
      <CustomerProvider>
        <TestComponent />
      </CustomerProvider>
    );

    // Check if localStorage was updated
    expect(localStorage.getItem('customerData')).toBe(JSON.stringify({
      customerId: 2,
      customerName: 'Jane Doe',
      customerEmail: 'jane.doe@example.com',
      customerPhno: '0987654321',
      customerAddress: '456 Elm St',
      customerDOB: '1995-05-15',
      accountCreationDate: '2024-09-18',
      role: 'admin'
    }));
  });

  test('stores planId in localStorage when it changes', () => {
    const TestComponent = () => {
      const { setPlanId } = React.useContext(CustomerContext);

      React.useEffect(() => {
        setPlanId('PLAN456');
      }, [setPlanId]);

      return null;
    };

    // Render the provider and test component
    render(
      <CustomerProvider>
        <TestComponent />
      </CustomerProvider>
    );

    // Check if localStorage was updated
    expect(localStorage.getItem('planId')).toBe('PLAN456');
  });

  test('logout function clears state and localStorage', () => {
    const TestComponent = () => {
      const { logout, customerData, planId } = React.useContext(CustomerContext);

      React.useEffect(() => {
        logout();
      }, [logout]);

      return (
        <>
          <div>{customerData ? 'Has Data' : 'No Data'}</div>
          <div>{planId ? 'Has Plan' : 'No Plan'}</div>
        </>
      );
    };

    // Set initial state and localStorage
    localStorage.setItem('customerData', JSON.stringify({
      customerId: 1,
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerPhno: '1234567890',
      customerAddress: '123 Main St',
      customerDOB: '1990-01-01',
      accountCreationDate: '2024-09-18',
      role: 'user'
    }));
    localStorage.setItem('planId', 'PLAN123');

    // Render the provider and test component
    render(
      <CustomerProvider>
        <TestComponent />
      </CustomerProvider>
    );

    // Check if state and localStorage were cleared
    expect(screen.getByText('No Data')).toBeInTheDocument();
    expect(screen.getByText('No Plan')).toBeInTheDocument();
    expect(localStorage.getItem('customerData')).toBeNull();
    expect(localStorage.getItem('planId')).toBeNull();
  });
});
