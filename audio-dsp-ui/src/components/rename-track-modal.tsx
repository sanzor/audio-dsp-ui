

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export interface RenameTrackModalProps {
  trackToRename: { trackId: string; trackInitialName: string } | null; // 👈 allow null
  open: boolean;
  onClose: () => void;
  onSubmit: (trackId: string, newName: string) => void;
}

export function TrackRenameModal({
  trackToRename: initialName,
  open,
  onClose,
  onSubmit,
}: RenameTrackModalProps) {
  

  const [trackName, setName] = useState(initialName?.trackInitialName);

  useEffect(() => {
    console.log("inside rename modal");
    setName(trackName); // Reset when modal opens
  }, [trackName, open]);

  const handleSubmit = () => {
  if (initialName && trackName?.trim()) {
    onSubmit(initialName.trackId, trackName.trim());
    onClose();
  }
};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Track</DialogTitle>
        </DialogHeader>
        <Input
          value={trackName}
          onChange={(e) => setName(e.target.value)}
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