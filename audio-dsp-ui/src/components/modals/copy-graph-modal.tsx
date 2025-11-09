import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

interface CopyGraphModalProps {
  sourceGraphName: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (copyName: string) => void;
}

export function CopyGraphModal({
  sourceGraphName,
  open,
  onClose,
  onSubmit,
}: CopyGraphModalProps) {
  const [graphName, setGraphName] = useState(sourceGraphName);

  useEffect(() => {
    setGraphName(sourceGraphName);
  }, [sourceGraphName, open]);

  const handleSubmit = () => {
    if (graphName.trim()) {
      onSubmit(graphName.trim());
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Paste Graph</DialogTitle>
        </DialogHeader>
        <Input
          value={graphName}
          onChange={(e) => setGraphName(e.target.value)}
          placeholder="Enter graph name"
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
