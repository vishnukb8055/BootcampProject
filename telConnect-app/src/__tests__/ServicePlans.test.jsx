import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { CustomerContext } from '../context/CustomerContext';
import ServicePlans from '../components/ServicePlans';
import '@testing-library/jest-dom';

// Mock axios
jest.mock('axios');

// Mock navigate function from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const customerData = { id: 1, name: 'John Doe', email: 'john@example.com' };

const mockPlans = [
  {
    planId: 'PREP-TC-0011',
    planName: 'Prepaid Plan 1',
    planDescription: 'Description of Prepaid Plan 1',
    planPrice: '199',
    planDuration: '30 days',
  },
  {
    planId: 'POST-TC-0012',
    planName: 'Postpaid Plan 1',
    planDescription: 'Description of Postpaid Plan 1',
    planPrice: '499',
    planDuration: '30 days',
  },
];

// Mock the `onPlanClickHandler` utility function
jest.mock('../utils/authUtils', () => ({
  onPlanClickHandler: jest.fn(),
}));

describe('ServicePlans Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockPlans });
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <CustomerContext.Provider value={{ customerData }}>
        <BrowserRouter>
          <ServicePlans />
        </BrowserRouter>
      </CustomerContext.Provider>
    );
  };

  it('renders the service plan selection page correctly', async () => {
    renderComponent();
    expect(screen.getByText('Experience the Power of Unlimited Connections with Our Services!')).toBeInTheDocument();
    expect(screen.getByText('Prepaid')).toBeInTheDocument();
    expect(screen.getByText('Postpaid')).toBeInTheDocument();
  });

  it('displays the correct prepaid plans when "Prepaid" is selected', async () => {
    renderComponent();
    await waitFor(() => screen.getByText('Prepaid Plan 1'));

    const prepaidButton = screen.getByText('Prepaid');
    fireEvent.click(prepaidButton);

    expect(screen.getByText('Prepaid Plan 1')).toBeInTheDocument();
    expect(screen.queryByText('Postpaid Plan 1')).not.toBeInTheDocument();
  });

  it('displays the correct postpaid plans when "Postpaid" is selected', async () => {
    renderComponent();
    await waitFor(() => screen.getByText('Prepaid Plan 1'));

    const postpaidButton = screen.getByText('Postpaid');
    fireEvent.click(postpaidButton);

    await waitFor(() => screen.getByText('Postpaid Plan 1'));
    expect(screen.getByText('Postpaid Plan 1')).toBeInTheDocument();
    expect(screen.queryByText('Prepaid Plan 1')).not.toBeInTheDocument();
  });

  it('displays an alert when no plan is selected and the "Activate" button is clicked', async () => {
    renderComponent();
    const activateButton = screen.getByText('Activate');
    fireEvent.click(activateButton);

    expect(await screen.findByText('Please select a plan.')).toBeInTheDocument();
  });

  it('activates a selected plan when the "Activate" button is clicked', async () => {
    const { onPlanClickHandler } = require('../utils/authUtils');
    renderComponent();
    await waitFor(() => screen.getByText('Prepaid Plan 1'));

    const plan = screen.getByText('Prepaid Plan 1');
    fireEvent.click(plan);

    const activateButton = screen.getByText('Activate');
    fireEvent.click(activateButton);

    await waitFor(() => {
      expect(onPlanClickHandler).toHaveBeenCalledWith(
        mockNavigate,
        customerData,
        'PREP-TC-0011',
        expect.any(Function)
      );
    });
  });

  it('displays error message if plan activation fails', async () => {
    const { onPlanClickHandler } = require('../utils/authUtils');
    onPlanClickHandler.mockRejectedValue(new Error('Activation failed'));
    renderComponent();
    await waitFor(() => screen.getByText('Prepaid Plan 1'));

    fireEvent.click(screen.getByText('Prepaid Plan 1'));

    const activateButton = screen.getByText('Activate');
    fireEvent.click(activateButton);

    await waitFor(() => {
      expect(screen.getByText('Error activating plan. Please try again.')).toBeInTheDocument();
    });
  });

  it('shows alert message if plans fail to load', async () => {
    axios.get.mockRejectedValue(new Error('Failed to fetch plans'));
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText('Failed to load plans. Please try again later.')).toBeInTheDocument()
    );
  });

  it('highlights selected plan correctly', async () => {
    renderComponent();
    await waitFor(() => screen.getByText('Prepaid Plan 1'));

    const plan = screen.getByText('Prepaid Plan 1');
    fireEvent.click(plan);

    expect(plan.closest('.plan-box')).toHaveClass('selected');
  });
});
