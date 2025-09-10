import { Borrower, BorrowerPipeline, BrokerInfo } from '../types';

const API_BASE = '/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getBorrowerPipeline(): Promise<BorrowerPipeline> {
    return this.request<BorrowerPipeline>('/borrowers/pipeline');
  }

  async getBorrowerDetail(id: string): Promise<Borrower> {
    return this.request<Borrower>(`/borrowers/${id}`);
  }

  async requestDocuments(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/borrowers/${id}/request-documents`, {
      method: 'POST',
    });
  }

  async sendToValuer(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/borrowers/${id}/send-valuer`, {
      method: 'POST',
    });
  }

  async approveLoan(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/borrowers/${id}/approve`, {
      method: 'POST',
    });
  }

  async escalateToCommittee(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/borrowers/${id}/escalate`, {
      method: 'POST',
    });
  }

  async getBrokerInfo(id: string): Promise<BrokerInfo> {
    return this.request<BrokerInfo>(`/broker/${id}`);
  }

  async getWorkflow(): Promise<{ steps: string[] }> {
    return this.request<{ steps: string[] }>('/onboarding/workflow');
  }
}

export const apiService = new ApiService();