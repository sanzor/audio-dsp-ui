import type { TrackMetaWithRegions } from "./Domain/TrackMetaWithRegions";

export const dummyData: TrackMetaWithRegions[] = [
  {
    id: 1,
    name: "Track 1",
    regions: [
      { region_id: 101, track_id: 1, name: "Region 1" },
      { region_id: 102, track_id: 1, name: "Region 2" },
    ],
  },
  {
    id: 2,
    name: "Track 2",
    regions: [
      { region_id: 201, track_id: 2, name: "Region 1" },
    ],
  },
  {
    id: 3,
    name: "Track 3",
    regions: [],
  },
];