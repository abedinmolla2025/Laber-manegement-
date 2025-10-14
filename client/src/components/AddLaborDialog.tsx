import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface AddLaborDialogProps {
  onAdd: (name: string, dailyRate: number) => void;
}

export default function AddLaborDialog({ onAdd }: AddLaborDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [dailyRate, setDailyRate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && dailyRate) {
      onAdd(name.trim(), parseFloat(dailyRate));
      setName("");
      setDailyRate("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-add-labor">
          <Plus className="h-4 w-4 mr-2" />
          Add Labor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Labor</DialogTitle>
          <DialogDescription>
            Enter the labor name and daily rate to add a new worker.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Labor Name</Label>
            <Input
              id="name"
              data-testid="input-labor-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter labor name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dailyRate">Daily Rate (₹)</Label>
            <Input
              id="dailyRate"
              data-testid="input-daily-rate"
              type="number"
              step="0.01"
              value={dailyRate}
              onChange={(e) => setDailyRate(e.target.value)}
              placeholder="Enter daily rate"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button type="submit" data-testid="button-submit">
              Add Labor
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
