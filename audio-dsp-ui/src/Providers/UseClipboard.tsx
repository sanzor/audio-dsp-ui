import { useContext } from "react";
import { ClipboardContext } from "./ClipboardProvider";

export function useClipboard() {
  const ctx = useContext(ClipboardContext);
  if (!ctx) throw new Error("useClipboard must be used inside ClipboardProvider");
  return ctx;
}