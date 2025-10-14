import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList } from "lucide-react";

interface Labor {
  id: string;
  name: string;
  dailyRate: number;
}

interface AddDutyDialogProps {
  laborers: Labor[];
  onAdd: (laborId: string, multiplier: number, date: string) => void;
}

export default function AddDutyDialog({ laborers, onAdd }: AddDutyDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedLabor, setSelectedLabor] = useState("");
  const [multiplier, setMultiplier] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLabor && multiplier && date) {
      onAdd(selectedLabor, parseFloat(multiplier), date);
      setSelectedLabor("");
      setMultiplier("");
      setDate(new Date().toISOString().split('T')[0]);
      setOpen(false);
    }
  };

  const selectedLaborData = laborers.find(l => l.id === selectedLabor);
  const calculatedAmount = selectedLaborData && multiplier 
    ? selectedLaborData.dailyRate * parseFloat(multiplier)
    : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" data-testid="button-add-duty" className="w-full sm:w-auto">
          <ClipboardList className="h-4 w-4 mr-2" />
          Add Duty
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Duty Entry</DialogTitle>
          <DialogDescription>
            Record a duty entry for a laborer with rate multiplier.
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
              data-testid="input-duty-date"
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
                    {labor.name} (₹{labor.dailyRate}/day)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="multiplier">Rate Multiplier</Label>
            <Select value={multiplier} onValueChange={setMultiplier}>
              <SelectTrigger id="multiplier" data-testid="select-multiplier">
                <SelectValue placeholder="Choose rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1x - Regular</SelectItem>
                <SelectItem value="1.5">1.5x - Overtime</SelectItem>
                <SelectItem value="2">2x - Holiday</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {calculatedAmount > 0 && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Calculated Amount</p>
              <p className="text-2xl font-semibold tabular-nums" data-testid="text-calculated-amount">
                ₹{calculatedAmount.toLocaleString()}
              </p>
            </div>
          )}
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
              Add Duty
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
