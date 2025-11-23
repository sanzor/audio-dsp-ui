import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { useEffect, useState } from "react";
import type { GraphViewModel } from "@/Domain/Graph/GraphViewModel";

export interface RenameGraphProps {
  graphToRename: GraphViewModel | null; // 👈 allow null
  open: boolean;
  onClose: () => void;
  onSubmit: (regionId: string, newName: string) => void;
}

export function RenameRegionModal({
  graphToRename,
  open,
  onClose,
  onSubmit,
}: RenameGraphProps) {
  const [graphName, setGraphName] = useState(graphToRename?.name ?? "");

  useEffect(() => {
    setGraphName(graphToRename?.name ?? "");
  }, [graphToRename?.name, open]);

  const handleSubmit = () => {
    if (graphToRename && graphName.trim()) {
      onSubmit(graphToRename.regionId, graphName.trim());
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Graph</DialogTitle>
        </DialogHeader>
        <Input
          value={graphName}
          onChange={(e) => setGraphName(e.target.value)}
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
