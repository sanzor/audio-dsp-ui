import type { TrackMetaWithRegions } from "@/Domain/TrackMetaWithRegions";
import { useEffect, useState } from "react"
import WaveSurfer from "wavesurfer.js"
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import Minimap from 'wavesurfer.js/dist/plugins/minimap.esm.js'
export interface WaveformPlayerProps{
    track:TrackMetaWithRegions,
    url:string
}

export function WaveformPlayer({track,url}:WaveformPlayerProps){
    const [waveObject,setWaveObject]=useState<WaveSurfer|null>(null);
    useEffect(()=>{ 
       const waveform=createWaveFormPlayer(url,track);
       setWaveObject(waveform);
    },[url,track]);
    return (waveObject &&
     <>
        <div id="waveform">

        </div>
    </>)
}


export function createWaveFormPlayer(url:string,track:TrackMetaWithRegions):WaveSurfer{
    const regions = RegionsPlugin.create()
    const obj=WaveSurfer.create({
        container:'#waveform',
        waveColor:'rgb(100, 152, 200)',
        progressColor:'rgb(100,100,100',
        url:url,
        plugins:[
              regions,
              Minimap.create({
                    height: 20,
                    waveColor: '#ddd',
                    progressColor: '#999',
      // the Minimap takes all the same options as the WaveSurfer itself
              }),
        ]
    });
    return obj
}