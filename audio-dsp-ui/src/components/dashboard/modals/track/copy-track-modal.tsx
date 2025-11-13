

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { useEffect, useState } from "react";

export interface CopyTrackModalProps {
  trackToCopy: { trackId: string; sourceTrackNname: string } | null; // 👈 allow null
  open: boolean;
  onClose: () => void;
  onSubmit: (trackId: string, copyTrackName: string) => void;
}

export function CopyTrackModal({
  trackToCopy,
  open,
  onClose,
  onSubmit,
}: CopyTrackModalProps) {
  const [copyTrackName, setCopyTrackName] = useState(trackToCopy?.sourceTrackNname ?? "");

  useEffect(() => {
    setCopyTrackName(trackToCopy?.sourceTrackNname ?? "");
    }, [trackToCopy?.sourceTrackNname, open]);

  const handleSubmit = () => {
    if (copyTrackName?.trim() && trackToCopy?.trackId) {
    onSubmit(trackToCopy.trackId, copyTrackName.trim());
    onClose();
    }
};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Track to copy</DialogTitle>
        </DialogHeader>
        <Input
          value={copyTrackName}
          onChange={(e) => setCopyTrackName(e.target.value)}
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
