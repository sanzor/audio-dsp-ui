import type { TrackMeta } from '@/Domain/Track/TrackMeta'
import {create} from 'zustand'

type TrackCache=Map<string,TrackMeta>;
interface TrackState{
    tracks:TrackCache,
    loading:boolean
}
interface TrackActions{
    getTrack:(trackId:string)=>TrackMeta|undefined;
    addTrack:(track:TrackMeta)=>void;
    removeTrack:(trackId:string)=>void;
    updateTrack:(trackId:string,trackMeta:Partial<TrackMeta>)=>void
    setAllTracks:(tracks:[TrackMeta])=>void

}

type TrackStore=TrackState & TrackActions;

export const useTrackStore = create<TrackStore>((set, get) => ({
    tracks: new Map(),
    loading: true,

    // --- Already implemented ---
    setAllTracks: (newTracks) => {
        const trackMap = new Map<string, TrackMeta>(); 
        newTracks.forEach(t => trackMap.set(t.track_id, t));
        set({ 
            tracks: trackMap, 
            loading: false 
        });
    },

    // ----------------------------------------------------
    // ✅ getTrack: Use the 'get' function to read state.
    // ----------------------------------------------------
    getTrack: (trackId: string): TrackMeta | undefined => {
        // Use the 'get()' function to synchronously retrieve the current state
        return get().tracks.get(trackId);
    },

    // ----------------------------------------------------
    // ✅ addTrack: Update the state immutably using 'set'.
    // ----------------------------------------------------
    addTrack: (track: TrackMeta): void => {
        set((state) => {
            // 1. Create a new Map based on the current tracks
            const newMap = new Map(state.tracks); 
            // 2. Add the new track
            newMap.set(track.track_id, track); 
            // 3. Return the new state object with the updated map
            return { tracks: newMap };
        });
    },

    // ----------------------------------------------------
    // ✅ removeTrack: Update the state immutably using 'set'.
    // ----------------------------------------------------
    removeTrack: (trackId: string): void => {
        set((state) => {
            // 1. Create a new Map based on the current tracks
            const newMap = new Map(state.tracks); 
            // 2. Delete the track by ID
            newMap.delete(trackId); 
            // 3. Return the new state object
            return { tracks: newMap };
        });
    },

    // ----------------------------------------------------
    // ✅ updateTrack: Update a property on a single track.
    // ----------------------------------------------------
    // Assuming updateTrack takes the ID and the new partial data/properties to merge
    // This example assumes TrackActions interface was: updateTrack(trackId: string, updates: Partial<TrackMeta>): void
    updateTrack: (trackId: string, updates: Partial<TrackMeta>): void => {
        set((state) => {
            const trackToUpdate = state.tracks.get(trackId);
            if (!trackToUpdate) return state; // Guard against missing track

            // 1. Create a new Map
            const newMap = new Map(state.tracks);
            
            // 2. Create a new, updated track object and set it in the new Map
            newMap.set(trackId, { 
                ...trackToUpdate, 
                ...updates 
            });

            // 3. Return the new state object
            return { tracks: newMap };
        });
    },
}));