import { create } from 'zustand';
import { Borrower, TabType, User } from '../types';

interface AppStore {
  activeBorrower: Borrower | null;
  activeTab: TabType;
  isAiAssistantEnabled: boolean;
  user: User | null;
  setActiveBorrower: (borrower: Borrower | null) => void;
  setActiveTab: (tab: TabType) => void;
  toggleAiAssistant: () => void;
  setUser: (user: User | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  activeBorrower: null,
  activeTab: 'new',
  isAiAssistantEnabled: true,
  user: null,
  setActiveBorrower: (borrower) => set({ activeBorrower: borrower }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleAiAssistant: () => set((state) => ({ 
    isAiAssistantEnabled: !state.isAiAssistantEnabled 
  })),
  setUser: (user) => set({ user }),
}));