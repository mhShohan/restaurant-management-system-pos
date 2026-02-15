'use client';

import type { RestaurantSettings } from '@/lib/types';

import { create } from 'zustand';

interface SettingsState {
  settings: RestaurantSettings | null;
  setSettings: (settings: RestaurantSettings | null) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  setSettings: (settings) => set({ settings }),
}));
