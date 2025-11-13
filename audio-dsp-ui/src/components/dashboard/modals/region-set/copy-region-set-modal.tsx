

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { useEffect, useState } from "react";
import type { TrackRegionSetViewModel } from "@/Domain/RegionSet/TrackRegionSetViewModel";
import { Label } from "../../../ui/label";

export interface CopyRegionSetModalProps {
  targetTrackId:string,
  regionSetToCopy: TrackRegionSetViewModel | null; // 👈 allow null
  open: boolean;
  onClose: () => void;
  onPaste: (trackId:string,regionSetId:string, copyRegionName: string) => void;
}

export function CopyRegionSetModal({
  regionSetToCopy,
  targetTrackId,
  open,
  onClose,
  onPaste: onPaste,
}: CopyRegionSetModalProps) {
  const [copyRegionSetName, setCopyRegionSetName] = useState(regionSetToCopy?.name ?? "");

  useEffect(() => {
    setCopyRegionSetName(regionSetToCopy?.name ?? "");
    }, [regionSetToCopy?.name, open]);

  const handleSubmit = () => {
    if (regionSetToCopy && copyRegionSetName.trim()) {
      onPaste(targetTrackId, regionSetToCopy.id, copyRegionSetName.trim());
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Region set to paste</DialogTitle>
        </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="track-id">Track ID</Label>
            <Input id="track-id" value={targetTrackId} readOnly />
          </div>
          <Input
           value={copyRegionSetName}
           onChange={(e) => setCopyRegionSetName(e.target.value)}
            placeholder="Enter new name"
          />
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
