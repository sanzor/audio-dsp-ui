import type { TrackMetaWithRegions } from "@/Domain/TrackMetaWithRegions";
import {  useEffect, useRef, useState } from "react"
import WaveSurfer from "wavesurfer.js"
import RegionsPlugin, { type Region } from 'wavesurfer.js/dist/plugins/regions.esm.js'
import Minimap from 'wavesurfer.js/dist/plugins/minimap.esm.js'
import type { TrackRegion } from "@/Domain/TrackRegion";
export interface WaveformPlayerProps{
    onDetails:(regionId:string)=>void,
    onDeleteRegion:(regionId:string)=>void,
    onEditRegion:(regionId:string)=>void,


    onCreateRegionClick:(time:number)=>void,
    onCreateRegionDrag:(start:number,end:number)=>void,

    
    track:TrackMetaWithRegions|null,
    url:string|null
}

type ContextMenuContext =
  | { type: 'region'; regionId: string }
  | { type: 'waveform'; time: number }
  | null;

export function WaveformPlayer({track,url,onDetails,onEditRegion,onDeleteRegion}:WaveformPlayerProps){
    const waveRef = useRef<WaveSurfer | null>(null);
    const waveformRef = useRef<HTMLDivElement | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const [waveObject,setWaveObject]=useState<WaveSurfer|null>(null);
    const [regionsPlugin, setRegionsPlugin] = useState<RegionsPlugin | null>(null);
    const renderedRegionIds = useRef<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const [contextMenu, setContextMenu] = useState<ContextMenuContext>(null);
    const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);

    const onContextMenu=(e:MouseEvent)=>{
            e.preventDefault();
            const bounding=waveformRef.current!.getBoundingClientRect();
            const x=e.clientX-bounding.left;
            const width=waveformRef.current!.offsetWidth;
            const time=waveRef.current!.getDuration()*(x/width);
            // const time=waveObject?.getDuration()*(x/width);
            setContextMenu({ type: 'waveform', time });
            setContextMenuPosition({ x: e.clientX, y: e.clientY });
    };
    useEffect(()=>{ 
        if (!waveformRef.current || !waveRef) return;
       
        waveformRef.current.addEventListener('contextmenu',onContextMenu);

        console.log("inside effect", {waveformRef: waveformRef.current, url, track});
        if(!track){
            console.log("no track");
            return;
        }
        if(!waveformRef.current){
          console.log("No waveform ref");
          return;
        }
        if(!url) {
            console.log("No URL provided");
            setError("No audio URL provided");
            return;
        }
        setIsLoading(true);
        setError(null);
        const { wave:waveform, regions } = createWaveFormPlayer(url, track, waveformRef.current,setContextMenu,setContextMenuPosition);
        waveRef.current=waveform;
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

       return ()=>{
            waveformRef.current?.removeEventListener('contextmenu', onContextMenu);
            console.log("Destroying waveform");
            waveform.destroy();
            waveRef.current=null;
       };
    },[url,track]);

    useEffect(()=>{
        if(!regionsPlugin||!track)return;
        const currentIds=new Set(track.regions.map(r=>r.region_id.toString()));
        const existingIds=renderedRegionIds.current;

         // Remove regions that no longer exist
        for(const id of existingIds){
            if(currentIds.has(id))
                continue;
            regionsPlugin.getRegions().find(x=>x.id===id)?.remove();
            existingIds.delete(id);
            
        }
        //add new regions
        for(const region of track.regions){
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
    },[track,track?.regions,regionsPlugin]);


    if (error) {
        return (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p className="font-semibold">Error: {error}</p>
                <div className="mt-2 text-sm">
                    <p>Debug info:</p>
                    <p>• URL: {url ? 'Present' : 'Missing'}</p>
                    <p>• Track: {track?.track_info?.name || 'Unknown'}</p>
                </div>
            </div>
        );
    }
    return ( <div className="w-full h-full min-h-[200px] bg-white border rounded-lg shadow-lg">
            {isLoading && (
                <div className="flex items-center justify-center h-32">
                    <div className="text-gray-500">Loading waveform...</div>
                </div>
            )}
            <div 
                ref={waveformRef} 
                className="w-full h-full"
                style={{ minHeight: '150px' }}
            />
        </div>)
}


// eslint-disable-next-line react-refresh/only-export-components
export function createWaveFormPlayer(
    url:string,
    track:TrackMetaWithRegions,
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
        addRegions(track.regions,regions);
    });

    return {wave:wave,regions:regions}
}
const random = (min:number, max:number) => Math.random() * (max - min) + min
const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`


function addRegions(regions:TrackRegion[],regionsObj:RegionsPlugin):RegionsPlugin{
    for(const elem of regions){
        addRegion(regionsObj,elem);
    }
    return regionsObj;
}

function addRegion(regionsObj:RegionsPlugin,elem:TrackRegion):RegionsPlugin{
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


