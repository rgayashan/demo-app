import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { BorrowerPipeline } from '../components/borrower/BorrowerPipeline';
import { BorrowerDetails } from '../components/borrower/BorrowerDetails';
import { BrokerOverview } from '../components/broker/BrokerOverview';
import { AccessControlDemo } from '../components/auth/AccessControlDemo';

/**
 * The main dashboard page.
 *
 * This component renders the main dashboard page, which consists of:
 *
 * 1. BorrowerPipeline: A tabbed interface that displays borrowers in different stages
 * 2. BorrowerDetails: A detailed view of the selected borrower
 * 3. BrokerOverview: A summary of the broker's statistics and contact management
 *
 * @example
 * import { Dashboard } from 'demo-app';
 *
 * <Dashboard />
 *
 * @returns A JSX element representing the main dashboard page.
 */
export const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <BorrowerPipeline />
      <BorrowerDetails />
      <BrokerOverview />
      <AccessControlDemo />
    </DashboardLayout>
  );
};