import { createContext, useState } from "react";

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

/** This is the NEW type for double-click / open actions */
export type OpenedContext =
  | { type: "track"; trackId: string }
  | { type: "regionSet"; trackId: string; regionSetId: string }
  | { type: "region"; trackId: string; regionSetId: string; regionId: string }
  |null;

export type Clipboard =
  | { type: "track"; trackId: string }
  | { type: "regionSet"; trackId: string; regionSetId: string }
  | { type: "region"; trackId: string; regionSetId: string; regionId: string }
  | { type: "graph"; trackId: string; regionSetId: string; regionId: string; graphId: string }
  | { type: "node"; trackId: string; regionSetId: string; regionId: string; graphId: string; nodeId: string }
  | { type: "edge"; trackId: string; regionSetId: string; regionId: string; graphId: string; edgeId: string }
  | null;

type UIStateContextValue = {
  selectedContext: SelectedContext;
  setSelectedContext: React.Dispatch<React.SetStateAction<SelectedContext>>;

  clipboard: Clipboard;
  setClipboard: React.Dispatch<React.SetStateAction<Clipboard>>;

  openedContext:OpenedContext;
  setOpenedContext:React.Dispatch<React.SetStateAction<OpenedContext>>

  rightClickContext:RightClickContext;
  setRightClickContext:React.Dispatch<React.SetStateAction<RightClickContext>>
};

// eslint-disable-next-line react-refresh/only-export-components
export const UIStateContext = createContext<UIStateContextValue | undefined>(undefined);

export function UIStateProvider({ children }: { children: React.ReactNode }) {
  const [selectedContext, setSelectedContext] = useState<SelectedContext>(null);
  const [clipboard, setClipboard] = useState<Clipboard>(null);
  const [openedContext, setOpenedContext] = useState<OpenedContext>(null);
  const [rightClickContext,setRightClickContext]=useState<RightClickContext>(null);

  return (
    <UIStateContext.Provider
      value={{
        selectedContext,
        setSelectedContext,
        clipboard,
        setClipboard,
        openedContext,
        setOpenedContext,
        rightClickContext,
        setRightClickContext
      }}
    >
      {children}
    </UIStateContext.Provider>
  );
}
