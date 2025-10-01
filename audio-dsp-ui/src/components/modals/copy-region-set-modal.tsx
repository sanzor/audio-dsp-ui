

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import type { TrackRegionSet } from "@/Domain/TrackRegionSet";

export interface CopyRegionSetModalProps {
  regionSetToCopy: TrackRegionSet | null; // 👈 allow null
  open: boolean;
  onClose: () => void;
  onSubmit: (regionSetId:string, copyRegionName: string) => void;
}

export function CopyRegionModal({
  regionSetToCopy,
  open,
  onClose,
  onSubmit,
}: CopyRegionSetModalProps) {
  

  const [copyRegionSetName, setCopyRegionSetName] = useState(regionSetToCopy?.name);

  useEffect(() => {
    setCopyRegionSetName(regionSetToCopy?.name ?? "");
    }, [regionSetToCopy?.name, open]);

  const handleSubmit = () => {
    if (copyRegionSetName?.trim() && regionSetToCopy?.region_set_id) {
    onSubmit(regionSetToCopy?.region_set_id, copyRegionSetName.trim());
    onClose();
    }
};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Region set to copy</DialogTitle>
        </DialogHeader>
        <Input
          value={copyRegionSetName}
          onChange={(e) => setCopyRegionSetName(e.target.value)}
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