import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload } from "lucide-react";

interface AddLaborDialogProps {
  onAdd: (name: string, dailyRate: number, photo?: string, address?: string) => void;
}

export default function AddLaborDialog({ onAdd }: AddLaborDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [dailyRate, setDailyRate] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoFileName, setPhotoFileName] = useState("");
  const [address, setAddress] = useState("");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const rate = dailyRate ? parseFloat(dailyRate) : 0;
      onAdd(
        name.trim(), 
        rate, 
        photo || undefined, 
        address.trim() || undefined
      );
      setName("");
      setDailyRate("");
      setPhoto("");
      setPhotoFileName("");
      setAddress("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-add-labor" className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Labor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Labor</DialogTitle>
          <DialogDescription>
            Enter the labor details to add a new worker.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter daily rate (optional)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo">Photo</Label>
            <div className="flex items-center gap-2">
              <Input
                id="photo"
                data-testid="input-photo-file"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('photo')?.click()}
                className="w-full"
                data-testid="button-upload-photo"
              >
                <Upload className="h-4 w-4 mr-2" />
                {photoFileName || "Upload Photo (Optional)"}
              </Button>
            </div>
            {photo && (
              <div className="mt-2 flex justify-center">
                <img 
                  src={photo} 
                  alt="Preview" 
                  className="h-20 w-20 rounded-full object-cover border-2"
                  data-testid="img-photo-preview"
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              data-testid="input-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address (optional)"
              rows={3}
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
