import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Dashboard } from '../pages/Dashboard';
import { AuthProvider } from '../contexts/AuthContext';

jest.mock('../services/api', () => ({
  apiService: {
    getBorrowerPipeline: jest.fn().mockResolvedValue({
      new: [
        {
          id: '1',
          name: 'Sarah Dunn',
          loan_type: 'Home Loan',
          amount: 300000,
          status: 'New'
        }
      ],
      in_review: [],
      approved: []
    }),
    getBrokerInfo: jest.fn().mockResolvedValue({
      name: 'Robert Turner',
      deals: 16,
      approval_rate: '75%',
      pending: 7660
    }),
    getWorkflow: jest.fn().mockResolvedValue({
      steps: ['Deal Intake', 'IDV & Credit Check']
    })
  }
}));

let consoleErrorSpy: jest.SpyInstance;
let consoleWarnSpy: jest.SpyInstance;

beforeAll(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
});

const renderWithAuth = (ui: React.ReactElement) => {
  // Set an authenticated user for components that read from localStorage
  localStorage.setItem('user', JSON.stringify({
    id: 'test-user',
    name: 'Test User',
    email: 'viewer@demo.com',
    role: 'viewer',
    permissions: ['view_borrowers', 'view_broker_stats']
  }));

  return render(<AuthProvider>{ui}</AuthProvider>);
};

afterEach(() => {
  localStorage.clear();
});

afterAll(() => {
  consoleErrorSpy.mockRestore();
  consoleWarnSpy.mockRestore();
});

describe('Dashboard', () => {
  test('renders dashboard with header', async () => {
    renderWithAuth(<Dashboard />);
    
    expect(screen.getByText('DemoApp')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Borrower Pipeline')).toBeInTheDocument();
    });
  });

  test('displays borrower list', async () => {
    renderWithAuth(<Dashboard />);
    
    const names = await screen.findAllByText('Sarah Dunn');
    expect(names.length).toBeGreaterThanOrEqual(1);
    const loanTypes = await screen.findAllByText(/Home Loan/i);
    expect(loanTypes.length).toBeGreaterThanOrEqual(1);
  });

  test('allows tab switching', async () => {
    renderWithAuth(<Dashboard />);

    const inReviewTab = await screen.findByRole('tab', { name: /in review/i });
    await userEvent.click(inReviewTab);

    await waitFor(() => {
      // Radix Tabs set aria-selected="true" on the active tab
      expect(inReviewTab).toHaveAttribute('aria-selected', 'true');
    });
  });
});