import { Borrower, BorrowerPipeline, BrokerInfo } from '../types';

// Mock data for development
const mockPipeline: BorrowerPipeline = {
  new: [
    {
      id: "1",
      name: "Sarah Dunn",
      loan_type: "Home Loan",
      amount: 300000,
      status: "Renew",
      email: "sarah.dunn@example.com",
      phone: "(355)123-4557",
      loan_amount: 300000,
      employment: "At Tech Company",
      income: 120000,
      existing_loan: 240000,
      credit_score: 720,
      source_of_funds: "Declared",
      risk_signal: "Missing Source of Funds declaration",
      ai_flags: [
        "Income Inconsistent with Bank statements",
        "High Debt-to-Income Ratio detected"
      ]
    },
    {
      id: "3",
      name: "Lisa Carter",
      loan_type: "Home Loan",
      amount: 450000,
      status: "New",
      email: "lisa.carter@example.com",
      phone: "(355)987-6543",
      loan_amount: 450000,
      employment: "Self Employed",
      income: 95000,
      credit_score: 680,
      source_of_funds: "Business Income",
      ai_flags: ["Self Employment Verification Required"]
    }
  ],
  in_review: [
    {
      id: "2",
      name: "Alan Matthews",
      loan_type: "Personal Loan",
      amount: 20000,
      status: "In Review",
      email: "alan.matthews@example.com",
      phone: "(355)456-7890",
      loan_amount: 20000,
      employment: "Full Time Employee",
      income: 75000,
      credit_score: 650,
      source_of_funds: "Salary",
    }
  ],
  approved: []
};

const mockBrokerInfo: BrokerInfo = {
  name: "Robert Turner",
  deals: 16,
  approval_rate: "75%",
  pending: 7660
};

const mockWorkflow = {
  steps: [
    "Deal Intake",
    "IDV & Credit Check",
    "Document Upload",
    "AI Validation",
    "Credit Committee",
    "Approval & Docs",
    "Funder Syndication"
  ]
};

// Development API service that returns mock data
export class MockApiService {
  private delay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getBorrowerPipeline(): Promise<BorrowerPipeline> {
    await this.delay();
    return mockPipeline;
  }

  async getBorrowerDetail(id: string): Promise<Borrower> {
    await this.delay();
    const allBorrowers = [...mockPipeline.new, ...mockPipeline.in_review, ...mockPipeline.approved];
    const borrower = allBorrowers.find(b => b.id === id);
    if (!borrower) {
      throw new Error('Borrower not found');
    }
    return borrower;
  }

  async requestDocuments(id: string): Promise<{ success: boolean; message: string }> {
    await this.delay();
    return { success: true, message: "Documents requested successfully." };
  }

  async sendToValuer(id: string): Promise<{ success: boolean; message: string }> {
    await this.delay();
    return { success: true, message: "Valuer has been notified." };
  }

  async approveLoan(id: string): Promise<{ success: boolean; message: string }> {
    await this.delay();
    return { success: true, message: "Loan has been approved." };
  }

  async escalateToCommittee(id: string): Promise<{ success: boolean; message: string }> {
    await this.delay();
    return { success: true, message: "Case escalated to Credit Committee." };
  }

  async getBrokerInfo(id: string): Promise<BrokerInfo> {
    await this.delay();
    return mockBrokerInfo;
  }

  async getWorkflow(): Promise<{ steps: string[] }> {
    await this.delay();
    return mockWorkflow;
  }
}

// Use mock API in development, real API in production
export const apiService = process.env.NODE_ENV === 'development' 
  ? new MockApiService() 
  : new MockApiService() // Replace with real ApiService() in production`;