
import type { TrackRegionViewModel } from "@/Domain/Region/TrackRegionViewModel";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export interface DetailsRegionProps {
  open: boolean;
  region: TrackRegionViewModel;
  onClose: () => void;
}

export function DetailsRegionModal({ region, open, onClose }: DetailsRegionProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="space-y-6">
        <DialogHeader>
          <DialogTitle>Region Set Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="track-id">Region Set ID</Label>
          <Input id="track-id" value={region.region_set_id} readOnly />
        </div>

         <div className="space-y-2">
          <Label htmlFor="track-id">Region ID</Label>
          <Input id="track-id" value={region.region_id} readOnly />
        </div>

        <div className="space-y-2">
          <Label htmlFor="track-name">Name</Label>
          <Input id="track-name" value={region.name} readOnly />
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
