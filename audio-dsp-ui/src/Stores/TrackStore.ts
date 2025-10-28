import type { TrackMeta } from '@/Domain/TrackMeta'
import {create} from 'zustand'

type TrackCache=Map<string,TrackMeta>;
interface TrackState{
    tracks:TrackCache,
    loading:boolean
}
interface TrackActions{
    getTrack:(trackId:string)=>TrackMeta|null;
    addTrack:(track:TrackMeta)=>void;
    removeTrack:(trackId:string)=>void;
    updateTrack:(trackId:string,trackName:string)=>void
    setAllTracks:(tracks:[TrackMeta])=>void

}

type TrackStore=TrackState & TrackActions;

export const useTrackStore = create<TrackStore>((set) => ({
    tracks: new Map(),
    loading: true,

    // Use a clearer arrow function style for the setter
    setAllTracks: (newTracks) => {
        // 1. Create the new map without explicitly casting/typing a local variable 
        //    if it's not strictly necessary, or ensure the types are identical.
        const trackMap = new Map<TrackId, Track>(); 
        
        newTracks.forEach(t => trackMap.set(t.track_id, t));
        
        // 2. Call set() to update the state with the new, immutable map
        set({ 
            tracks: trackMap, 
            loading: false 
        });
    },
    // ... other actions
}));
