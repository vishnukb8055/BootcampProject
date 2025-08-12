import axios from 'axios';
import { isLoggedIn, getCustomerId, isDocumentVerified, handleAuthRedirect, onPlanClickHandler } from '../utils/authutils'; // Adjust path as needed

jest.mock('axios');

describe('Utility Functions', () => {
  describe('isLoggedIn', () => {
    test('returns true if customerData is not null', () => {
      const customerData = { customerId: 1 };
      expect(isLoggedIn(customerData)).toBe(true);
    });

    test('returns false if customerData is null', () => {
      expect(isLoggedIn(null)).toBe(false);
    });
  });

  describe('getCustomerId', () => {
    test('returns customerId if customerData is present', () => {
      const customerData = { customerId: 1 };
      expect(getCustomerId(customerData)).toBe(1);
    });

    test('returns null if customerData is null', () => {
      expect(getCustomerId(null)).toBe(null);
    });
  });

  describe('isDocumentVerified', () => {
    test('returns true if the document verification status is success', async () => {
      axios.get.mockResolvedValue({ data: 'success' });

      const result = await isDocumentVerified(1);
      expect(result).toBe(true);
    });

    test('returns false if the document verification status is not success', async () => {
      axios.get.mockResolvedValue({ data: 'failure' });

      const result = await isDocumentVerified(1);
      expect(result).toBe(false);
    });

    test('returns false and handles 404 error gracefully', async () => {
      axios.get.mockRejectedValue({ response: { status: 404 } });

      const result = await isDocumentVerified(1);
      expect(result).toBe(false);
    });

    test('throws an error for other types of failures', async () => {
      axios.get.mockRejectedValue(new Error('Network error'));

      await expect(isDocumentVerified(1)).rejects.toThrow('Network error');
    });
  });

  describe('handleAuthRedirect', () => {
    const navigate = jest.fn();
    const setAlertMessage = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('redirects to login if not logged in', async () => {
      await handleAuthRedirect(navigate, null, '/login', '/documentVerification', '/planConfirmation', setAlertMessage);

      expect(setAlertMessage).toHaveBeenCalledWith('Please log in to proceed.');
    });

    test('redirects to document verification if the document is not verified', async () => {
      axios.get.mockResolvedValue({ data: 'failure' });

      const customerData = { customerId: 1 };
      await handleAuthRedirect(navigate, customerData, '/login', '/documentVerification', '/planConfirmation', setAlertMessage);

      expect(setAlertMessage).toHaveBeenCalledWith('Redirecting to the Document Verification Page...');
    });

    test('redirects to plan confirmation if the document is verified', async () => {
      axios.get.mockResolvedValue({ data: 'success' });

      const customerData = { customerId: 1 };
      await handleAuthRedirect(navigate, customerData, '/login', '/documentVerification', '/planConfirmation', setAlertMessage);

      expect(setAlertMessage).toHaveBeenCalledWith('Redirecting to the Plan Confirmation Page...');
    });

    test('handles errors during document verification', async () => {
      axios.get.mockRejectedValue(new Error('Network error'));

      const customerData = { customerId: 1 };
      await handleAuthRedirect(navigate, customerData, '/login', '/documentVerification', '/planConfirmation', setAlertMessage);

      expect(setAlertMessage).toHaveBeenCalledWith('Error occurred during the process. Please try again.');
    });
  });

  describe('onPlanClickHandler', () => {
    const navigate = jest.fn();
    const setAlertMessage = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      localStorage.clear(); // Clear localStorage before each test
    });

    test('saves planId to localStorage and handles redirection', async () => {
      const customerData = { customerId: 1 };
      axios.get.mockResolvedValue({ data: 'success' });

      await onPlanClickHandler(navigate, customerData, 'PLAN123', setAlertMessage);

      expect(localStorage.getItem('planId')).toBe('PLAN123');
      expect(setAlertMessage).toHaveBeenCalledWith('Redirecting to the Plan Confirmation Page...');
    });

    test('redirects to login if not logged in', async () => {
      const customerData = null;

      await onPlanClickHandler(navigate, customerData, 'PLAN123', setAlertMessage);

      expect(setAlertMessage).toHaveBeenCalledWith('Please log in to proceed.');
    });

    test('redirects to document verification if document is not verified', async () => {
      const customerData = { customerId: 1 };
      axios.get.mockResolvedValue({ data: 'failure' });

      await onPlanClickHandler(navigate, customerData, 'PLAN123', setAlertMessage);

      expect(setAlertMessage).toHaveBeenCalledWith('Redirecting to the Document Verification Page...');
    });
  });
});
