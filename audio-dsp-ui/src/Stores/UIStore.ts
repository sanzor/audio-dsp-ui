// stores/uiStore.ts
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import type { PasteGraphParams, PasteRegionParams, PasteRegionSetParams } from './PasteParams';

// Your existing types
export type RightClickContext =
  | { type: "track"; trackId: string; x: number; y: number }
  | { type: "region"; trackId: string; regionSetId: string; regionId: string; x: number; y: number }
  | { type: "regionSet"; trackId: string; regionSetId: string; x: number; y: number }
  | null;

export type SelectedContext =
  | { type: "track"; trackId: string }
  | { type: "regionSet"; trackId: string; regionSetId: string }
  | { type: "region"; trackId: string; regionSetId: string; regionId: string }
  | null;

export type OpenedContext =
  | { type: "track"; trackId: string }
  | { type: "regionSet"; trackId: string; regionSetId: string }
  | { type: "region"; trackId: string; regionSetId: string; regionId: string }
  | null;

export type Clipboard =
  | { type: "track"; trackId: string }
  | { type: "regionSet"; trackId: string; regionSetId: string }
  | { type: "region"; trackId: string; regionSetId: string; regionId: string }
  | { type: "graph"; trackId: string; regionSetId: string; regionId: string; graphId: string }
  | { type: "node"; trackId: string; regionSetId: string; regionId: string; graphId: string; nodeId: string }
  | { type: "edge"; trackId: string; regionSetId: string; regionId: string; graphId: string; edgeId: string }
  | null;

// Modal state for ALL your modals
export type ModalState = 
  // Track modals
  | { type: "createTrack" }
  | { type: "renameTrack"; trackId: string }
  | { type: "detailsTrack"; trackId: string }
  | { type: "deleteTrack"; trackId: string }
  
  // RegionSet modals
  | { type: "createRegionSet"; trackId: string }
  | { type: "renameRegionSet"; trackId: string; regionSetId: string }
  | { type: "detailsRegionSet"; trackId: string; regionSetId: string }
  | { type: "deleteRegionSet"; trackId: string; regionSetId: string }
  | {type:  "pasteRegionSet"; params:PasteRegionSetParams }
  
  // Region modals
  | { type: "createRegion"; trackId: string; regionSetId: string; startTime?: number; endTime?: number }
  | { type: "renameRegion"; trackId: string; regionSetId: string; regionId: string }
  | { type: "detailsRegion"; trackId: string; regionSetId: string; regionId: string }
  | { type: "pasteRegion"; params:PasteRegionParams }
  | { type: "deleteRegion"; trackId: string; regionSetId: string; regionId: string }
  
  // Graph modals
  | { type: "createGraph"; trackId: string; regionSetId: string; regionId: string }
  | { type: "renameGraph"; trackId: string; regionSetId: string; regionId: string; graphId: string }
  | { type: "detailsGraph"; trackId: string; regionSetId: string; regionId: string; graphId: string }
  | { type: "deleteGraph"; trackId:string;  regionSetId:string; regionId:string;  graphId:string  }
  | {type: "pasteGraph"; params:PasteGraphParams}
  
  // ... add more as needed
  | null;


type UIStore = {
  // State
  selectedContext: SelectedContext;
  clipboard: Clipboard;
  openedContext: OpenedContext;
  rightClickContext: RightClickContext;
  modalState: ModalState;
  
  // Actions
  select: (context: SelectedContext) => void;
  clearSelection: () => void;

  copyToClipboard: (clipboard: Clipboard) => void;
  clearClipboard:()=>void;
  
  open: (context: OpenedContext) => void;
  close:()=>void;

  openContextMenu: (context: RightClickContext) => void;
  closeContextMenu: () => void;

  openModal: (modal: ModalState) => void;
  closeModal: () => void;
  
  // Composite actions (helpful utilities)

  
  closeEverything: () => void; // close modal + context menu
};

export const useUIStore = create<UIStore>()(
  subscribeWithSelector(
    devtools(
      (set) => ({
        // Initial state
        selectedContext: null,
        clipboard: null,
        openedContext: null,
        rightClickContext: null,
        modalState: null,
        
        // Actions
        select: (context) => 
          set({ selectedContext: context }, false, 'setSelectedContext'),
        clearSelection: () => 
          set({ selectedContext: null }, false, 'clearSelection'),
        
        copyToClipboard: (clipboard) => 
          set({ clipboard }, false, 'copyToClipboard'),
        clearClipboard:()=>
          set({clipboard:null},false,'clearClipboard'),

        
        open: (context) => 
          set({ openedContext: context }, false, 'open'),
        close:()=>
          set({ openedContext:null},false,'close'),

        
        openContextMenu: (context) => 
          set({ rightClickContext: context }, false, 'openContextMenu'),

        closeContextMenu:()=>
          set({rightClickContext:null},false,'closeContextMenu'),
        
        openModal: (modal) => 
          set({ modalState: modal }, false, 'openModal'),
        
        closeModal: () => 
          set({ modalState: null }, false, 'closeModal'),
        
        // Composite actions
       
        
       
        closeAllUI: () => 
          set({ 
            modalState: null, 
            rightClickContext: null 
          }, false, 'closeAllUI'),
      }),
      { name: 'UIStore' }
    )
  )
);