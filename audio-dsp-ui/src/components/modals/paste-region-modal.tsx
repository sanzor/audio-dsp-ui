

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import type { TrackRegionViewModel } from "@/Domain/Region/TrackRegionViewModel";

export interface PasteRegionModalProps {
  regionToCopy: TrackRegionViewModel | null; // 👈 allow null
  destRegionSetId:string,
  open: boolean;
  onClose: () => void;
  onSubmit: (regionSetId:string,regionId:string, copyRegionName: string) => void;
}

export function PasteRegionModal({
  regionToCopy,
  destRegionSetId,
  open,
  onClose,
  onSubmit,
}: PasteRegionModalProps) {
  const [copyRegionName, setCopyRegionName] = useState(regionToCopy?.name ?? "");

  useEffect(() => {
    setCopyRegionName(regionToCopy?.name ?? "");
    }, [regionToCopy?.name, open]);

  const handleSubmit = () => {
    if (regionToCopy && copyRegionName.trim()) {
      onSubmit(destRegionSetId, regionToCopy.region_id, copyRegionName.trim());
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Region to paste</DialogTitle>
        </DialogHeader>
        <Input
          value={copyRegionName}
          onChange={(e) => setCopyRegionName(e.target.value)}
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
