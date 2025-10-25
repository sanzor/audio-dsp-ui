// useUIState.ts
import { useContext } from "react";
import { UIStateContext } from "./UIStateProvider";

export function useUIState() {
  const context = useContext(UIStateContext);
  if (!context) {
    throw new Error("useUIState must be used inside UIStateProvider");
  }
  return context;
}