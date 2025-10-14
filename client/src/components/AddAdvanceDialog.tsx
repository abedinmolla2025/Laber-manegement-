import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Banknote } from "lucide-react";

interface Labor {
  id: string;
  name: string;
}

interface AddAdvanceDialogProps {
  laborers: Labor[];
  onAdd: (laborId: string, amount: number) => void;
}

export default function AddAdvanceDialog({ laborers, onAdd }: AddAdvanceDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedLabor, setSelectedLabor] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLabor && amount) {
      onAdd(selectedLabor, parseFloat(amount));
      setSelectedLabor("");
      setAmount("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" data-testid="button-add-advance">
          <Banknote className="h-4 w-4 mr-2" />
          Add Advance
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Advance Payment</DialogTitle>
          <DialogDescription>
            Record an advance payment given to a laborer.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="labor">Select Labor</Label>
            <Select value={selectedLabor} onValueChange={setSelectedLabor}>
              <SelectTrigger id="labor" data-testid="select-labor">
                <SelectValue placeholder="Choose a laborer" />
              </SelectTrigger>
              <SelectContent>
                {laborers.map((labor) => (
                  <SelectItem key={labor.id} value={labor.id}>
                    {labor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (৳)</Label>
            <Input
              id="amount"
              data-testid="input-amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter advance amount"
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
              Add Advance
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
