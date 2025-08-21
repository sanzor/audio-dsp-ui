"use client"
import React from "react"
import { SidebarContext } from "./sidebar-context"





function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}
export {
    useSidebar
}
