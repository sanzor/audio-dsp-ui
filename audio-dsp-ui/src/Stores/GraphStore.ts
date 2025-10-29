// /src/Stores/useRegionSetStore.ts

import type { NormalizedGraph } from '@/Domain/Graph/NormalizedGraph';
import { create } from 'zustand';




// ----------------------------------------------------
// 1. Normalized State & Action Definitions
// ----------------------------------------------------

type GraphCache = Map<string, NormalizedGraph>;

interface GraphState {
    graphs: GraphCache;
    loading: boolean;
}

interface GraphActions {
    // CRUD Operations for the Set itself
    getGraph: (graphId: string) => NormalizedGraph | undefined;
    setAllGraphs: (graphs: NormalizedGraph[]) => void;
    addGraph: (graph: NormalizedGraph) => void;
    removeGraph: (graphId: string) => void;
    updateGraph: (graphId: string, updates: Partial<NormalizedGraph>) => void;
}

type GraphStore = GraphState & GraphActions;

// ----------------------------------------------------
// 2. Zustand Store Implementation
// ----------------------------------------------------

export const useGraphStore = create<GraphStore>((set, get) => ({
    graphs: new Map(),
    loading: true,

    // --- CRUD ---

    setAllGraphs: (newGraphs) => {
        const setMap = new Map<string, NormalizedGraph>(); 
        newGraphs.forEach(s => setMap.set(s.id, s));
        set({ graphs: setMap, loading: false });
    },

    getGraph: (setId) => {
        return get().graphs.get(setId);
    },

    addGraph: (graphToAdd) => set((state) => {
        const newMap = new Map(state.graphs); 
        newMap.set(graphToAdd.id, graphToAdd); 
        return { graphs: newMap };
    }),

    removeGraph: (setId) => set((state) => {
        const newMap = new Map(state.graphs); 
        newMap.delete(setId); 
        return { graphs: newMap };
    }),

    updateGraph: (graphId, updates) => set((state) => {
        const setEntity = state.graphs.get(graphId);
        if (!setEntity) return state;

        const newMap = new Map(state.graphs);
        newMap.set(graphId, { ...setEntity, ...updates });
        return { graphs: newMap };
    })
}));