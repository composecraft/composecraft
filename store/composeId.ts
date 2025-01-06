"use client"

import { create } from 'zustand';

// Define the type for the store's state
interface ComposeIdStoreState {
    id?: string|undefined;
    setId: (value: string|undefined) => void;
}

// Create the Zustand store
const useComposeIdStore = create<ComposeIdStoreState>((set) => ({
    id: undefined,
    setId: (value: string|undefined) => set({ id: value }),
}));

export default useComposeIdStore;