import { createContext, useState } from "react";

export type Clipboard =
  | { type: "track"; trackId: string }
  | { type: "regionSet"; trackId: string; regionSetId: string }
  | { type: "region"; trackId: string; regionSetId: string; regionId: string }
  | null;

type ClipboardCtx = {
  clipboard: Clipboard;
  setClipboard: React.Dispatch<React.SetStateAction<Clipboard>>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const ClipboardContext = createContext<ClipboardCtx | undefined>(undefined);

export function ClipboardProvider({ children }: { children: React.ReactNode }) {
  const [clipboard, setClipboard] = useState<Clipboard>(null);
  return (
    <ClipboardContext.Provider value={{ clipboard, setClipboard }}>
      {children}
    </ClipboardContext.Provider>
  );
}

