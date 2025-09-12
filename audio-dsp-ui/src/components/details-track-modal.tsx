import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import type { TrackMetaWithRegions } from "@/Domain/TrackMetaWithRegions";
import type { TrackRegion } from "@/Domain/TrackRegion";

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

        <div className="space-y-2">
          <Label htmlFor="track-ext">Extension</Label>
          <Input id="track-ext" value={track.track_info.extension} readOnly />
        </div>

        <RegionTable regions={track.regions} />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Exit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 🔹 Extracted for cleanliness
function RegionTable({ regions }: { regions: TrackRegion[] }) {
  if (regions.length === 0) return <p className="text-muted-foreground">No regions available.</p>;

  return (
    <div className="space-y-2">
      <Label>Regions</Label>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {regions.map((region) => (
            <TableRow key={region.region_id}>
              <TableCell>{region.region_id}</TableCell>
              <TableCell>{region.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
