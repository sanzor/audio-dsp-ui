import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { CreateRegionParams } from "@/Dtos/Regions/CreateRegionParams";

interface CreateRegionModalProps {
  trackId: string;
  regionSetId: string;
  open: boolean;
  startTime: number | null;
  endTime: number | null;
  onClose: () => void;
  onSubmit: (params: CreateRegionParams) => void;
  duration?: number; // total length of track in seconds (optional)
}

export function CreateRegionModal({
  trackId,
  regionSetId,
  open,
  startTime,
  endTime,
  onClose,
  onSubmit,
  duration = 100, // fallback if duration unavailable
}: CreateRegionModalProps) {
  const [name, setName] = useState("");
  const [range, setRange] = useState<[number, number]>([
    startTime ?? 0,
    endTime ?? 5,
  ]);

  useEffect(() => {
    setRange([startTime ?? 0, endTime ?? 5]);
  }, [startTime, endTime, open]);

  const handleSubmit = () => {
    const [start, end] = range;
    if (!name || start >= end) return;
    onSubmit({
      name,
      trackId,
      region_set_id: regionSetId,
      start_time: start,
      end_time: end,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Region</DialogTitle>
          <DialogDescription>Select region boundaries</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Region Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Name</label>
            <Input
              className="col-span-3"
              placeholder="Enter region name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Slider for start/end selection */}
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Time Selection</span>
            <Slider
              min={0}
              max={duration}
              step={0.01}
              value={range}
              onValueChange={(val) => setRange(val as [number, number])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{range[0].toFixed(2)}s</span>
              <span>{range[1].toFixed(2)}s</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button disabled={!name || range[0] >= range[1]} onClick={handleSubmit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
