

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { useEffect, useState } from "react";
import type { TrackRegionSetViewModel } from "@/Domain/RegionSet/TrackRegionSetViewModel";

export interface RenameRegionSetProps {
  regionSetToRename: TrackRegionSetViewModel | null; // 👈 allow null
  open: boolean;
  onClose: () => void;
  onSubmit: (trackId:string,regionSetId: string, newName: string) => void;
}

export function RegionSetRenameModal({
  regionSetToRename: regionSet,
  open,
  onClose,
  onSubmit,
}: RenameRegionSetProps) {
  const [regionSetName, setRegionSetName] = useState(regionSet?.name ?? "");

  useEffect(() => {
    setRegionSetName(regionSet?.name ?? "");
  }, [regionSet?.name, open]);

  const handleSubmit = () => {
    if (regionSet && regionSetName.trim()) {
      onSubmit(regionSet.track_id, regionSet.id, regionSetName.trim());
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Region Set</DialogTitle>
        </DialogHeader>
        <Input
          value={regionSetName}
          onChange={(e) => setRegionSetName(e.target.value)}
          placeholder="Enter new name"
        />
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
