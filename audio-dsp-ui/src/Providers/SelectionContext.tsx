import { createContext, useState } from "react";

// Your existing type
export type SelectedContext =
  | { type: "track"; trackId: string }
  | { type: "regionSet"; trackId: string; regionSetId: string }
  | { type: "region"; trackId: string; regionSetId: string; regionId: string }
  | null;

type SelectionContextValue = {
  selectedContext: SelectedContext;
  setSelectedContext: React.Dispatch<React.SetStateAction<SelectedContext>>;
};

// Create context
// eslint-disable-next-line react-refresh/only-export-components
export const SelectionContext = createContext<SelectionContextValue | undefined>(undefined);

// Provider
export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedContext, setSelectedContext] = useState<SelectedContext>(null);

  return (
    <SelectionContext.Provider value={{ selectedContext, setSelectedContext }}>
      {children}
    </SelectionContext.Provider>
  );
}