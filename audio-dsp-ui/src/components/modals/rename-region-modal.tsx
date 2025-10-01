

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import type { TrackRegion } from "@/Domain/TrackRegion";

export interface RenameRegionProps {
  regionToRename: TrackRegion | null; // 👈 allow null
  open: boolean;
  onClose: () => void;
  onSubmit: (trackId: string, newName: string) => void;
}

export function RegionRenameModal({
  regionToRename: regionToRename,
  open,
  onClose,
  onSubmit,
}: RenameRegionProps) {
  

  const [regionSetName, setRegionSetName] = useState(regionToRename?.name);

  useEffect(() => {
    console.log("inside rename modal");
    setRegionSetName(regionSetName); // Reset when modal opens
  }, [regionSetName, open]);

  const handleSubmit = () => {
  if (regionToRename && regionSetName?.trim()) {
    onSubmit(regionToRename.name, regionSetName.trim());
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