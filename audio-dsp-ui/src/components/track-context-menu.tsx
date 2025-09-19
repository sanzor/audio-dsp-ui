import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu"

interface TrackContextMenuProps{
  children: React.ReactNode
  trackId: string
  onCreateRegionSet:(id:string)=>void
  onRemove: (id: string) => void
  onRename: (id: string) => void
  onCopy: (id: string) => void
  onDetails:(id:string)=>void
}

export function TrackContextMenu({
  trackId,
  onCreateRegionSet,
  onDetails,
  onRemove,
  onRename,
  onCopy,
  children,
}: TrackContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => onCreateRegionSet(trackId)}>Create Region Set</ContextMenuItem>
        <ContextMenuItem onClick={() => onDetails(trackId)}>Details</ContextMenuItem>
        <ContextMenuItem onClick={() => onRename(trackId)}>Rename</ContextMenuItem>
        <ContextMenuItem onClick={() => onCopy(trackId)}>Copy</ContextMenuItem>
        <ContextMenuItem onClick={() => onRemove(trackId)}>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}