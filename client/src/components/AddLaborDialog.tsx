import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, Crop } from "lucide-react";

interface AddLaborDialogProps {
  onAdd: (name: string, dailyRate: number, photo?: string, address?: string) => void;
}

export default function AddLaborDialog({ onAdd }: AddLaborDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [dailyRate, setDailyRate] = useState("");
  const [photo, setPhoto] = useState("");
  const [originalPhoto, setOriginalPhoto] = useState("");
  const [photoFileName, setPhotoFileName] = useState("");
  const [address, setAddress] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, size: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const resetForm = () => {
    setName("");
    setDailyRate("");
    setPhoto("");
    setOriginalPhoto("");
    setPhotoFileName("");
    setAddress("");
    setShowCropper(false);
    imageRef.current = null;
    // Clear file input
    const fileInput = document.getElementById('photo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setOriginalPhoto(result);
        setPhoto(result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
      // Clear the input so the same file can be selected again
      e.target.value = "";
    }
  };

  useEffect(() => {
    if (showCropper && originalPhoto && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        imageRef.current = img;
        const maxSize = 300;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        // Initialize crop to center
        const cropSize = Math.min(canvas.width, canvas.height) * 0.7;
        setCrop({
          x: (canvas.width - cropSize) / 2,
          y: (canvas.height - cropSize) / 2,
          size: cropSize
        });
        
        drawCanvas();
      };
      
      img.src = originalPhoto;
    }
  }, [showCropper, originalPhoto]);

  useEffect(() => {
    if (showCropper && imageRef.current) {
      drawCanvas();
    }
  }, [crop]);

  const drawCanvas = () => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
    
    // Draw overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Clear crop area
    ctx.clearRect(crop.x, crop.y, crop.size, crop.size);
    ctx.drawImage(
      imageRef.current,
      crop.x / canvas.width * imageRef.current.width,
      crop.y / canvas.height * imageRef.current.height,
      crop.size / canvas.width * imageRef.current.width,
      crop.size / canvas.height * imageRef.current.height,
      crop.x,
      crop.y,
      crop.size,
      crop.size
    );
    
    // Draw crop border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(crop.x, crop.y, crop.size, crop.size);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (x >= crop.x && x <= crop.x + crop.size && y >= crop.y && y <= crop.y + crop.size) {
      setIsDragging(true);
      setDragStart({ x: x - crop.x, y: y - crop.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newX = Math.max(0, Math.min(x - dragStart.x, canvas.width - crop.size));
    const newY = Math.max(0, Math.min(y - dragStart.y, canvas.height - crop.size));
    
    setCrop({ ...crop, x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = () => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    // Create a new canvas for the cropped image
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = 200;
    cropCanvas.height = 200;
    const cropCtx = cropCanvas.getContext('2d');
    if (!cropCtx) return;
    
    // Calculate the crop area in original image coordinates
    const scaleX = img.width / canvas.width;
    const scaleY = img.height / canvas.height;
    const sourceX = crop.x * scaleX;
    const sourceY = crop.y * scaleY;
    const sourceWidth = crop.size * scaleX;
    const sourceHeight = crop.size * scaleY;
    
    cropCtx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      200,
      200
    );
    
    setPhoto(cropCanvas.toDataURL('image/jpeg', 0.9));
    setShowCropper(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when dialog closes
      resetForm();
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
      resetForm();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            {showCropper && (
              <div className="mt-3 space-y-3">
                <div className="flex justify-center">
                  <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="border-2 border-border rounded cursor-move"
                    data-testid="canvas-crop"
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Drag the blue square to adjust crop area
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCropper(false)}
                    className="flex-1"
                    data-testid="button-cancel-crop"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCrop}
                    className="flex-1"
                    data-testid="button-apply-crop"
                  >
                    <Crop className="h-4 w-4 mr-2" />
                    Apply Crop
                  </Button>
                </div>
              </div>
            )}
            {!showCropper && photo && (
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
