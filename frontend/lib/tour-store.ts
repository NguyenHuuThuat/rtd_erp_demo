'use client';

import { create } from 'zustand';

interface TourState {
  running: boolean;
  start: () => void;
  stop: () => void;
}

export const useTourStore = create<TourState>((set) => ({
  running: false,
  start: () => set({ running: true }),
  stop: () => set({ running: false }),
}));
