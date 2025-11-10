import { useQuery } from "react-query";
import { useTrackStore } from "@/Stores/TrackStore";
import { normalizeTrackWithCascade } from "./utils";
import type { TrackMeta } from "@/Domain/Track/TrackMeta";
import type { NormalizedTrackMeta } from "@/Domain/Track/NormalizedTrackMeta";
import { apiGetTracks, apiGetTrackInfo } from "@/Services/TracksService";

export const useListTracks = () => {
  const setAllTracks = useTrackStore(state => state.setAllTracks);

  return useQuery<TrackMeta[], Error, NormalizedTrackMeta[]>({
    queryKey: ['tracks'],
    queryFn: apiGetTracks,
    select: (tracks) => tracks.map(normalizeTrackWithCascade),
    onSuccess: (normalized) => {
      setAllTracks(normalized); // receives already normalized data
    },
  });
};

export const useGetTrack = (trackId: string) => {
  const addTrack = useTrackStore(state => state.addTrack);

  return useQuery<TrackMeta, Error, NormalizedTrackMeta>({
    queryKey: ['track', trackId],
    queryFn: async () => {
      const result = await apiGetTrackInfo({ track_id: trackId });
      return result.track; // <-- extract TrackMeta from GetTrackResult
    },
    enabled: !!trackId,
    select: normalizeTrackWithCascade,
    onSuccess: (normalized) => addTrack(normalized),
  });
};
