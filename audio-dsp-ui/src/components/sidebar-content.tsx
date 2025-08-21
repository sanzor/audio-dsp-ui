import type { TrackMetaWithRegions } from "@/Domain/TrackMetaWithRegions";
export interface SidebarContentProps {
  tracks: TrackMetaWithRegions[];
}

export function SidebarContent({ tracks }: SidebarContentProps) {
  return (
    <nav className="p-4">
      <ul className="space-y-2">
        {tracks.map((track) => (
          <li key={track.id}>
            <div className="font-semibold text-white">{track.name}</div>
            <ul className="pl-4 text-sm text-gray-300">
              {track.regions.map((region) => (
                <li
                  key={region.region_id}
                  className="py-1 hover:underline cursor-pointer"
                >
                  {region.name}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}