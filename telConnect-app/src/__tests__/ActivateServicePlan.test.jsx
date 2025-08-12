// src/__tests__/ActivateServicePlan.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import ActivateServicePlan from '../components/ActivateServicePlan';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('ActivateServicePlan Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render the component and display loading message initially', () => {
    mockedAxios.get.mockResolvedValue({ data: [] });

    render(<ActivateServicePlan />);

    expect(screen.getByText(/loading plans.../i)).toBeInTheDocument();
  });

  test('should fetch and display plans when data is loaded', async () => {
    const mockData = [
      {
        customerPlanId: 1,
        customerId: 'C123',
        planId: 'P123',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'Pending',
      },
    ];
    mockedAxios.get.mockResolvedValue({ data: mockData });

    render(<ActivateServicePlan />);

    await waitFor(() => expect(screen.queryByText(/loading plans.../i)).not.toBeInTheDocument());

    expect(screen.getByText(/C123/i)).toBeInTheDocument();
    expect(screen.getByText(/P123/i)).toBeInTheDocument();
  });

  test('should handle API errors and show error message', async () => {
    const mockData = [
      {
        customerPlanId: 1,
        customerId: 'C123',
        planId: 'P123',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'Pending',
      },
    ];
    mockedAxios.get.mockResolvedValue({ data: mockData });
    mockedAxios.patch.mockRejectedValue(new Error('Activation failed'));

    render(<ActivateServicePlan />);

    await waitFor(() => expect(screen.queryByText(/loading plans.../i)).not.toBeInTheDocument());

    // Open dialog
    fireEvent.click(screen.getAllByRole('button', { name: /activate/i })[0]);

    // Confirm activation
    fireEvent.click(screen.getByRole('button', { name: /activate/i }));

    // Check for error snackbar
    await waitFor(() => {
      expect(screen.getByText(/failed to activate plan or send email/i)).toBeInTheDocument();
    });
  });
});
