import { create } from 'zustand';

interface AppState {
  workspace: { name: string; businessType: string; isOnboarded: boolean };
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  setOnboarded: (name: string, businessType: string) => void;
  toggleSidebar: () => void;
  setCommandPalette: (open: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  workspace: {
    name: localStorage.getItem('xeno_workspace_name') || '',
    businessType: localStorage.getItem('xeno_business_type') || '',
    isOnboarded: localStorage.getItem('xeno_onboarded') === 'true',
  },
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  setOnboarded: (name, businessType) => {
    localStorage.setItem('xeno_onboarded', 'true');
    localStorage.setItem('xeno_workspace_name', name);
    localStorage.setItem('xeno_business_type', businessType);
    set({ workspace: { name, businessType, isOnboarded: true } });
  },
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setCommandPalette: (open) => set({ commandPaletteOpen: open }),
}));
