"use client"

import { create } from 'zustand';

// Define the type for the store's state
interface SelectionStoreState {
    selectedId: string;
    setSelectedString: (value: string) => void;
}

// Create the Zustand store
const useSelectionStore = create<SelectionStoreState>((set) => ({
    selectedId: '',
    setSelectedString: (value: string) => set({ selectedId: value }),
}));

export default useSelectionStore;