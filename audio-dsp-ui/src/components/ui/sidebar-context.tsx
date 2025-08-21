'use client'

import { createContext } from 'react'

export type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

// Extracted context
export const SidebarContext = createContext<SidebarContextProps | null>(null)