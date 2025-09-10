export interface WaveformPlayerProps{
    trackId:string,
    url:string
}

export function WaveformPlayer({trackId,url}:WaveformPlayerProps){
    return (<>{trackId}</>)
}