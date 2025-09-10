import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Dashboard } from '../pages/Dashboard';

// Mock the API service
jest.mock('../services/mockApi', () => ({
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

describe('Dashboard', () => {
  test('renders dashboard with header', async () => {
    render(<Dashboard />);
    
    expect(screen.getByText('DemoApp')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Borrower Pipeline')).toBeInTheDocument();
    });
  });

  test('displays borrower list', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Sarah Dunn')).toBeInTheDocument();
      expect(screen.getByText('Home Loan')).toBeInTheDocument();
    });
  });

  test('allows tab switching', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      const inReviewTab = screen.getByRole('tab', { name: /in review/i });
      fireEvent.click(inReviewTab);
      expect(inReviewTab).toHaveAttribute('data-state', 'active');
    });
  });
});