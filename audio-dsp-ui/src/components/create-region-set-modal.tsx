import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"

import type { CreateRegionSetParams } from "@/Dtos/RegionSets/CreateRegionSetParams"
import type { TrackMeta } from "@/Domain/TrackMeta"
import { useState } from "react"

interface CreateRegionSetModalProps {
  trackMeta:TrackMeta,
  open: boolean
  onClose: () => void
  onSubmit: (track: CreateRegionSetParams) => void
}

export function CreateRegionSetModal({
  trackMeta,
  open,
  onClose,
  onSubmit,
}: CreateRegionSetModalProps) {
  const [regionSetName, setRegionSetName] = useState(trackMeta.track_info.name);


  const handleSubmit = () => {



    const createRegionSetParams: CreateRegionSetParams = {
        name:regionSetName,
        track_id:trackMeta.track_id
    };
    console.log("Submitting form");
    console.log(JSON.stringify(createRegionSetParams));
    onSubmit(createRegionSetParams)
  }


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Track</DialogTitle>
          <DialogDescription>
            Provide a name and preview the audio before saving.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Track Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="track-name" className="text-right text-sm font-medium">
              Name
            </label>
            <Input
              id="track-name"
              className="col-span-3"
              value={regionSetName}
              onChange={(e) => setRegionSetName(e.target.value)}
              placeholder="Enter track name"
            />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!regionSetName}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

