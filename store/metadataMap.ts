"use client"

import { create } from 'zustand';
import {NodeData} from "@/components/playground/playground";

// Define the type for the store's state
interface positionMapInt {
    positionMap: Map<string,NodeData>;
    setPositionMap: (newMap:Map<string,NodeData>)=>void;
}

// Create the Zustand store
const usePositionMap = create<positionMapInt>((set) => ({
    positionMap: new Map(),
    setPositionMap: (newMap: Map<string,NodeData>) => set({ positionMap: newMap }),
}));

export default usePositionMap;