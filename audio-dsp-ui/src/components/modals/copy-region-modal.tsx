

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import type { TrackRegion } from "@/Domain/TrackRegion";

export interface CopyRegionModalProps {
  regionToCopy: TrackRegion | null; // 👈 allow null
  open: boolean;
  onClose: () => void;
  onSubmit: (regionSetId:string, copyRegionName: string) => void;
}

export function CopyRegionModal({
  regionToCopy,
  open,
  onClose,
  onSubmit,
}: CopyRegionModalProps) {
  

  const [copyRegionName, setCopyRegionName] = useState(regionToCopy?.name);

  useEffect(() => {
    setCopyRegionName(regionToCopy?.name ?? "");
    }, [regionToCopy?.name, open]);

  const handleSubmit = () => {
    if (copyRegionName?.trim() && regionToCopy?.region_set_id) {
    onSubmit(regionToCopy?.region_set_id, copyRegionName.trim());
    onClose();
    }
};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Region to copy</DialogTitle>
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