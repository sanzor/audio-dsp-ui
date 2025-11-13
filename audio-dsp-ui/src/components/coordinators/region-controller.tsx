import {  useState } from "react";
import type { RightClickContext } from "../dashboard/dashboard";
import { RegionContextMenu } from "../region-context-menu";
import { DetailsRegionModal } from "../dashboard/modals/region/details-region-modal";
import { RegionRenameModal } from "../dashboard/modals/region/rename-region-modal";
import { CopyGraphModal } from "../dashboard/modals/graph/copy-graph-modal";
import { useUIState } from "@/Providers/UseUIStateProvider";
import { useTrackViewModelMap } from "@/Selectors/trackViewModels";
import type { TrackRegionViewModel } from "@/Domain/Region/TrackRegionViewModel";
import {useDeleteRegion, useEditRegion } from "@/Orchestrators/Regions/useRegionMutations";
import { useCopyGraph } from "@/Orchestrators/Graphs/useGraphMutations";
import { useGraphStore } from "@/Stores/GraphStore";
import { useRegionStore } from "@/Stores/RegionStore";

type RegionControllerProps = {
  rightClickContext: RightClickContext;
  setRightClickContext: (ctx: RightClickContext | null) => void;
};

type RegionSelection = {
  region: TrackRegionViewModel;
  trackId: string;
  regionSetId: string;
};

export function RegionController({
  rightClickContext,
  setRightClickContext,
}: RegionControllerProps) {
  const { clipboard, setClipboard } = useUIState();
  const trackMap = useTrackViewModelMap();
  const deleteRegion = useDeleteRegion();
  const editRegion = useEditRegion();
  const copyGraph = useCopyGraph();
  const updateRegionStore = useRegionStore(state => state.updateRegion);

  const [regionForDetails, setRegionForDetails] = useState<RegionSelection | null>(null);
  const [regionForRename, setRegionForRename] = useState<RegionSelection | null>(null);
  const [graphPasteContext, setGraphPasteContext] = useState<{
    region: TrackRegionViewModel;
    trackId: string;
    regionSetId: string;
    graphId: string;
  } | null>(null);

  const clipboardGraphId = clipboard?.type === "graph" ? clipboard.graphId : null;
  const clipboardGraph = useGraphStore(state =>
    clipboardGraphId ? state.getGraph(clipboardGraphId) ?? null : null
  );

  const findRegion = (trackId: string, regionSetId: string, regionId: string): RegionSelection | null => {
    const track = trackMap.get(trackId);
    if (!track) return null;
    const regionSet = track.regionSets.find(set => set.id === regionSetId);
    if (!regionSet) return null;
    const region = regionSet.regions.find(region => region.region_id === regionId);
    if (!region) return null;
    return { region, trackId, regionSetId: regionSet.id };
  };

  const handleCopyRegion = (trackId: string, regionSetId: string, regionId: string) => {
    setClipboard({ type: "region", trackId, regionSetId, regionId });
  };

  const handleCopyGraph = (trackId: string, regionSetId: string, regionId: string) => {
    const selection = findRegion(trackId, regionSetId, regionId);
    if (!selection?.region.graph?.id) return;
    setClipboard({
      type: "graph",
      trackId,
      regionSetId,
      regionId,
      graphId: selection.region.graph.id,
    });
  };

  const handlePasteGraph = (trackId: string, regionSetId: string, regionId: string) => {
    if (clipboard?.type !== "graph") return;
    const selection = findRegion(trackId, regionSetId, regionId);
    if (!selection) return;
    setGraphPasteContext({
      region: selection.region,
      trackId: selection.trackId,
      regionSetId: selection.regionSetId,
      graphId: clipboard.graphId,
    });
  };

  const handleRenameRegion = (selection: RegionSelection | null, newName: string) => {
    if (!selection) return;
    const { region, trackId, regionSetId } = selection;
    editRegion.mutate({
      id: region.region_id,
      regionId: region.region_id,
      regionSetId: regionSetId,
      trackId,
      name: newName,
    });
  };

  const handleDeleteRegion = (selection: RegionSelection | null) => {
    if (!selection) return;
    const { region, trackId, regionSetId } = selection;
    deleteRegion.mutate({
      regionId: region.region_id,
      regionSetId,
      trackId,
    });
  };

  const handleCopyGraphSubmit = (context: { region: TrackRegionViewModel; graphId: string }, copyName: string) => {
    copyGraph.mutate({
      destinationRegionId: context.region.region_id,
      graphId: context.graphId,
      copyName,
    }, {
      onSuccess: (result) => {
        updateRegionStore(context.region.region_id, { graphId: result.graph.id });
      },
      onSettled: () => setGraphPasteContext(null),
    });
  };

  const selectedRegion =
    rightClickContext?.type === "region"
      ? findRegion(rightClickContext.trackId, rightClickContext.regionSetId, rightClickContext.regionId)
      : null;

  return (
    <>
      {rightClickContext?.type === "region" && selectedRegion && (
        <RegionContextMenu
          x={rightClickContext.x}
          y={rightClickContext.y}
          trackId={rightClickContext.trackId}
          regionSetId={rightClickContext.regionSetId}
          regionId={rightClickContext.regionId}
          onClose={() => setRightClickContext(null)}
          onDetails={(regionId, regionSetId, trackId) => {
            const region = findRegion(trackId, regionSetId, regionId);
            if (region) {
              setRegionForDetails(region);
            }
          }}
          onRename={(regionId, regionSetId, trackId) => {
            const region = findRegion(trackId, regionSetId, regionId);
            if (region) {
              setRegionForRename(region);
            }
          }}
          onCopyRegion={(regionId, regionSetId, trackId) => handleCopyRegion(trackId, regionSetId, regionId)}
          onCopyGraph={(regionId, regionSetId, trackId) => handleCopyGraph(trackId, regionSetId, regionId)}
          onPasteGraph={(regionId, regionSetId, trackId) => handlePasteGraph(trackId, regionSetId, regionId)}
          canCopyGraph={Boolean(selectedRegion.region.graph)}
          canPasteGraph={clipboard?.type === "graph"}
          onRemove={(regionId, regionSetId, trackId) => {
            const region = findRegion(trackId, regionSetId, regionId);
            handleDeleteRegion(region);
          }}
        />
      )}

      {regionForDetails && (
        <DetailsRegionModal
          region={regionForDetails.region}
          open
          onClose={() => setRegionForDetails(null)}
        />
      )}

      {regionForRename && (
        <RegionRenameModal
          regionToRename={regionForRename.region}
          open
          onClose={() => setRegionForRename(null)}
          onSubmit={(_, newName) => {
            handleRenameRegion(regionForRename, newName);
            setRegionForRename(null);
          }}
        />
      )}

      {graphPasteContext && clipboardGraph && (
        <CopyGraphModal
          sourceGraphName={clipboardGraph.name}
          open
          onClose={() => setGraphPasteContext(null)}
          onSubmit={copyName => handleCopyGraphSubmit(graphPasteContext, copyName)}
        />
      )}
    </>
  );
}
