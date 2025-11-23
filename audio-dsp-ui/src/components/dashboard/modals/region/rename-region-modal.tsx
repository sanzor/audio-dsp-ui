import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { useEffect, useState } from "react";
import type { TrackRegionViewModel } from "@/Domain/Region/TrackRegionViewModel";

export interface RenameRegionProps {
  regionToRename: TrackRegionViewModel | null; // 👈 allow null
  open: boolean;
  onClose: () => void;
  onSubmit: (regionId: string, newName: string) => void;
}

export function RegionRenameModal({
  regionToRename,
  open,
  onClose,
  onSubmit,
}: RenameRegionProps) {
  const [regionName, setRegionName] = useState(regionToRename?.name ?? "");

  useEffect(() => {
    setRegionName(regionToRename?.name ?? "");
  }, [regionToRename?.name, open]);

  const handleSubmit = () => {
    if (regionToRename && regionName.trim()) {
      onSubmit(regionToRename.regionId, regionName.trim());
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Region</DialogTitle>
        </DialogHeader>
        <Input
          value={regionName}
          onChange={(e) => setRegionName(e.target.value)}
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
