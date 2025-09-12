import { ContextMenuContent, ContextMenuTrigger } from "@radix-ui/react-context-menu"
import { ContextMenu, ContextMenuItem } from "./ui/context-menu"

export interface WaveRegionContextMenuProps{
    children:React.ReactNode,
    regionId:string,
    onEdit:(id:string)=>void,
    onDelete:(id:string)=>void
    onDetails:(id:string)=>void
}

export function WaveRegionContextMenu({onDelete,onDetails,onEdit,regionId,children}:WaveRegionContextMenuProps){
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={()=>onEdit(regionId)}>Edit</ContextMenuItem>
                <ContextMenuItem onClick={() => onDetails(regionId)}>Details</ContextMenuItem>
                <ContextMenuItem onClick={() => onDelete(regionId)}>Delete</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}