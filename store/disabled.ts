"use client"

import { create } from 'zustand';

// Define the type for the store's state
interface saveDisabledState {
    state: boolean
    setState: (value: boolean) => void;
}

// Create the Zustand store
const useDisableStateStore = create<saveDisabledState>((set) => ({
    state: true,
    setState: (value: boolean) => set({ state: value }),
}));

export default useDisableStateStore;