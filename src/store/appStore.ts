import { create } from 'zustand';
import { Borrower, TabType } from '../types';

interface AppStore {
  activeBorrower: Borrower | null;
  activeTab: TabType;
  isAiAssistantEnabled: boolean;
  setActiveBorrower: (borrower: Borrower | null) => void;
  setActiveTab: (tab: TabType) => void;
  toggleAiAssistant: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  activeBorrower: null,
  activeTab: 'new',
  isAiAssistantEnabled: true,
  setActiveBorrower: (borrower) => set({ activeBorrower: borrower }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleAiAssistant: () => set((state) => ({ 
    isAiAssistantEnabled: !state.isAiAssistantEnabled 
  })),
}));