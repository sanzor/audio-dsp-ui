import { createContext, useState } from "react";

export type SelectedContext =
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

type UIStateContextValue = {
  selectedContext: SelectedContext;
  setSelectedContext: React.Dispatch<React.SetStateAction<SelectedContext>>;
  clipboard: Clipboard;
  setClipboard: React.Dispatch<React.SetStateAction<Clipboard>>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const UIStateContext = createContext<UIStateContextValue | undefined>(undefined);

export function UIStateProvider({ children }: { children: React.ReactNode }) {
  const [selectedContext, setSelectedContext] = useState<SelectedContext>(null);
  const [clipboard, setClipboard] = useState<Clipboard>(null);

  return (
    <UIStateContext.Provider value={{ selectedContext, setSelectedContext, clipboard, setClipboard }}>
      {children}
    </UIStateContext.Provider>
  );
}
