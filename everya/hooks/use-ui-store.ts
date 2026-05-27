"use client";

import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  rightSidebarOpen: boolean;
  searchOpen: boolean;
  mobileNavOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setRightSidebarOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  toggleSearch: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  rightSidebarOpen: true,
  searchOpen: false,
  mobileNavOpen: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setRightSidebarOpen: (rightSidebarOpen) => set({ rightSidebarOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  toggleSearch: () => set((s) => ({ searchOpen: !s.searchOpen })),
}));
