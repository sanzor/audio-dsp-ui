
import type { TrackMetaWithRegions } from "@/Domain/TrackMetaWithRegions";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";


export interface DetailsTrackModalProps {
  open: boolean;
  track: TrackMetaWithRegions;
  onClose: () => void;
}

export function DetailsTrackModal({ track, open, onClose }: DetailsTrackModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="space-y-6">
        <DialogHeader>
          <DialogTitle>Track Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="track-id">Track ID</Label>
          <Input id="track-id" value={track.track_id} readOnly />
        </div>

        <div className="space-y-2">
          <Label htmlFor="track-name">Name</Label>
          <Input id="track-name" value={track.track_info.name} readOnly />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Exit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

