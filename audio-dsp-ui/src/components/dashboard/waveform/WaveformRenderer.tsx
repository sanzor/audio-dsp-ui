
import {  useEffect, useRef, useState } from "react"
import WaveSurfer from "wavesurfer.js"
import RegionsPlugin, { type Region } from 'wavesurfer.js/dist/plugins/regions.esm.js'
import Minimap from 'wavesurfer.js/dist/plugins/minimap.esm.js'
import type { TrackRegionViewModel } from "@/Domain/Region/TrackRegionViewModel";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import type { TrackRegionSetViewModel } from "@/Domain/RegionSet/TrackRegionSetViewModel";


export interface WaveformRendererProps{
    regionSet:TrackRegionSetViewModel 
    url:string|null
    onRegionDetails:(regionId:string)=>void,
    onDeleteRegion:(regionId:string)=>void,
    onEditRegion:(regionId:string)=>void,
    onCreateRegionClick:(time:number)=>void,
    onCreateRegionDrag:(start:number,end:number)=>void,
    onCopyRegion:(regionId:string)=>void
}

type ContextMenuContext =
  | { type: 'region'; regionId: string; }
  | { type: 'waveform'; time: number }
  | null;

export function WaveformRenderer({
    regionSet,
    url,
    onRegionDetails: onDetails,
    onEditRegion,
    onDeleteRegion,
    onCreateRegionClick,
    onCreateRegionDrag,
    onCopyRegion
  }:WaveformRendererProps
  ){
    const waveRef = useRef<WaveSurfer | null>(null);
    const waveformRef = useRef<HTMLDivElement | null>(null);
    const [regionsPlugin, setRegionsPlugin] = useState<RegionsPlugin | null>(null);
    const renderedRegionIds = useRef<Set<string>>(new Set());

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const [contextMenu, setContextMenu] = useState<ContextMenuContext>(null);
    const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);


    useEffect(() => {
        const waveformElement = waveformRef.current; // ✅ Local copy of ref

        if (!waveformElement || !waveRef) return;

        const onContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            const bounding = waveformElement.getBoundingClientRect();
            const x = e.clientX - bounding.left;
            const width = waveformElement.offsetWidth;
            const time = waveRef.current!.getDuration() * (x / width);

            setContextMenu({ type: 'waveform', time });
            setContextMenuPosition({ x: e.clientX, y: e.clientY });
        };

        waveformElement.addEventListener('contextmenu', onContextMenu);

        console.log("inside effect", { waveformElement, url, regionSet });
        
        if (!regionSet || !url) {
            setError("Missing region set or URL");
         return;
        }

        setIsLoading(true);
        setError(null);

        const { wave: waveform, regions } = createWaveFormPlayer(
            url,
             regionSet.regions,
            waveformElement,
            setContextMenu,
            setContextMenuPosition
        );

        waveRef.current = waveform;
        setRegionsPlugin(regions);

        waveform.once('ready', () => {
            console.log("Waveform ready");
            setIsLoading(false);
        });

        waveform.on('error', (err) => {
            console.error("Waveform error:", err);
            setError(`Failed to load audio: ${err}`);
            setIsLoading(false);
        });

        return () => {
            waveformElement.removeEventListener('contextmenu', onContextMenu);
            console.log("Destroying waveform");
            waveform.destroy();
            waveRef.current = null;
        };
    }, [url, regionSet]);

    useEffect(()=>{
        if(!regionsPlugin||!regionSet)return;
        const currentIds=new Set(regionSet.regions.map(r=>r.region_id.toString()));
        const existingIds=renderedRegionIds.current;

         // Remove regions that no longer exist
        for(const id of existingIds){
            if(currentIds.has(id))
                continue;
            regionsPlugin.getRegions().find(x=>x.id===id)?.remove();
            existingIds.delete(id);
            
        }
        //add new regions
        for(const region of regionSet.regions){
            const id=region.region_id.toString();
            const existing=regionsPlugin.getRegions().find(x=>x.id===id);
            if(existing){
                existing.start=region.start;
                existing.end=region.end;
                existing.setContent(region.name)
            }else{
                  addRegion(regionsPlugin,region);   
            }
           
           
        }
        renderedRegionIds.current=currentIds;
    },[regionSet,regionSet.regions,regionsPlugin]);


    if (error) {
        return (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p className="font-semibold">Error: {error}</p>
                <div className="mt-2 text-sm">
                    <p>Debug info:</p>
                    <p>• URL: {url ? 'Present' : 'Missing'}</p>
                    <p>• Region Set: {regionSet.name || 'Unknown'}</p>
                </div>
            </div>
        );
    }
    return (
  <div className="w-full h-full min-h-[200px] bg-white border rounded-lg shadow-lg">
    {isLoading && (
      <div className="flex items-center justify-center h-32">
        <div className="text-gray-500">Loading waveform...</div>
      </div>
    )}

    <ContextMenu>
  <ContextMenuTrigger asChild>
    <div
      ref={waveformRef}
      className="w-full h-full"
      style={{ minHeight: '150px' }}
    />
  </ContextMenuTrigger>

    {contextMenu && contextMenuPosition && (
    <ContextMenuContent
      className="w-48"
      style={{
        position: 'fixed',
        left: contextMenuPosition.x,
        top: contextMenuPosition.y,
      }}
    >
      {contextMenu.type === 'region' ? (
        <>
          <ContextMenuItem onClick={() => onEditRegion(contextMenu.regionId)}>Edit</ContextMenuItem>
          <ContextMenuItem onClick={() => onDetails(contextMenu.regionId)}>Details</ContextMenuItem>
          <ContextMenuItem onClick={() => onDeleteRegion(contextMenu.regionId)}>Delete</ContextMenuItem>
          <ContextMenuItem onClick={()=>  onCopyRegion(contextMenu.regionId)}>Copy</ContextMenuItem>
        </>
      ) : (
        <>
          <ContextMenuItem onClick={() => onCreateRegionClick(contextMenu.time)}>Create Region</ContextMenuItem>
          <ContextMenuItem
            onClick={() =>
              onCreateRegionDrag(Math.max(0, contextMenu.time - 1), contextMenu.time + 1)
            }
          >
            Create Region (±1s)
          </ContextMenuItem>
        </>
      )}
    </ContextMenuContent>
    )}
    </ContextMenu>
  </div>
);
}


// eslint-disable-next-line react-refresh/only-export-components
export function createWaveFormPlayer(
    url:string,
    trackRegions:TrackRegionViewModel[],
    container:HTMLElement,
    setContextMenu:React.Dispatch<React.SetStateAction<ContextMenuContext>>,
    setContextMenuPosition: React.Dispatch<React.SetStateAction<{
    x: number;
    y: number;
} | null>>,
    ):{wave:WaveSurfer,regions:RegionsPlugin}{
    let activeRegion:Region|null=null;
    const regions = RegionsPlugin.create();
    regions.on('region-in',(region)=>{
        activeRegion=region;
    });
    regions.on('region-out',(region)=>{
        if(activeRegion===region){
            console.log("some");
        }
        activeRegion=null;
    });
    regions.on('region-clicked',(region,e)=>{
        e.preventDefault();
        e.stopImmediatePropagation();
        activeRegion=region;
        setContextMenu({ type: 'region', regionId: region.id!.toString() });
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
        region.play(true);
        region.setOptions({color:randomColor()});
    })
    regions.enableDragSelection({
        color:'rgba(255,0,0,1)'
    });
    const wave=WaveSurfer.create({
        container:container,
        waveColor:'rgb(100, 152, 200)',
        progressColor:'rgb(100,100,100)',
        url:url,
        plugins:[
              regions,
              Minimap.create({
                    height: 20,
                    waveColor: '#ddd',
                    progressColor: '#999',
      // the Minimap takes all the same options as the WaveSurfer itself
              }),
        ],
        mediaControls:true
    });
    wave.on('interaction',()=>{
        activeRegion=null;
    });
    wave.once('ready',()=>{
        addRegions(trackRegions,regions);
    });

    return {wave:wave,regions:regions}
}
const random = (min:number, max:number) => Math.random() * (max - min) + min
const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`


function addRegions(regions:TrackRegionViewModel[],regionsObj:RegionsPlugin):RegionsPlugin{
    for(const elem of regions){
        addRegion(regionsObj,elem);
    }
    return regionsObj;
}

function addRegion(regionsObj:RegionsPlugin,elem:TrackRegionViewModel):RegionsPlugin{
    regionsObj.addRegion({
            id:elem.region_id,
            start:elem.start,
            end:elem.end,
            drag: true,
            resize: true,
            content:elem.name,
            color:randomColor()
        });
    return regionsObj;
}
