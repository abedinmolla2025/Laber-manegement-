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
  onAdd: (laborId: string, amount: number, date: string) => void;
}

export default function AddAdvanceDialog({ laborers, onAdd }: AddAdvanceDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedLabor, setSelectedLabor] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLabor && amount && date) {
      onAdd(selectedLabor, parseFloat(amount), date);
      setSelectedLabor("");
      setAmount("");
      setDate(new Date().toISOString().split('T')[0]);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" data-testid="button-add-advance" className="w-full sm:w-auto">
          <Banknote className="h-4 w-4 mr-2" />
          Add Advance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Advance Payment</DialogTitle>
          <DialogDescription>
            Record an advance payment given to a laborer.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              data-testid="input-advance-date"
              required
            />
          </div>
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
            <Label htmlFor="amount">Amount (₹)</Label>
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
