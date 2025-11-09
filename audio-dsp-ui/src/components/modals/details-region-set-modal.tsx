
import type { TrackRegionViewModel } from "@/Domain/Region/TrackRegionViewModel";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import type { TrackRegionSetViewModel } from "@/Domain/RegionSet/TrackRegionSetViewModel";

export interface DetailsRegionSetModalProps {
  open: boolean;
  regionSet: TrackRegionSetViewModel;
  onClose: () => void;
}

export function DetailsRegionSetModal({ regionSet, open, onClose }: DetailsRegionSetModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="space-y-6">
        <DialogHeader>
          <DialogTitle>Region Set Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="track-id">Track ID</Label>
          <Input id="track-id" value={regionSet.track_id} readOnly />
        </div>

         <div className="space-y-2">
          <Label htmlFor="track-id">Region Set ID</Label>
          <Input id="track-id" value={regionSet.id} readOnly />
        </div>

        <div className="space-y-2">
          <Label htmlFor="track-name">Name</Label>
          <Input id="track-name" value={regionSet.name} readOnly />
        </div>

        

        <RegionTable regions={regionSet.regions} />

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
function RegionTable({ regions }: { regions: TrackRegionViewModel[] }) {
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
