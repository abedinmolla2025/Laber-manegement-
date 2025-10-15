import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Upload, Crop, RotateCcw } from "lucide-react";

interface Labor {
  id: string;
  name: string;
  dailyRate: number;
  photo?: string;
  address?: string;
}

interface EditLaborDialogProps {
  labor: Labor;
  onEdit: (id: string, name: string, dailyRate: number, photo?: string, address?: string) => void;
}

export default function EditLaborDialog({ labor, onEdit }: EditLaborDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(labor.name);
  const [dailyRate, setDailyRate] = useState(labor.dailyRate.toString());
  const [photo, setPhoto] = useState(labor.photo || "");
  const [originalPhoto, setOriginalPhoto] = useState("");
  const [photoFileName, setPhotoFileName] = useState("");
  const [address, setAddress] = useState(labor.address || "");
  const [showCropper, setShowCropper] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, size: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const resetForm = () => {
    setName(labor.name);
    setDailyRate(labor.dailyRate.toString());
    setPhoto(labor.photo || "");
    setOriginalPhoto("");
    setPhotoFileName("");
    setAddress(labor.address || "");
    setShowCropper(false);
    imageRef.current = null;
    const fileInput = document.getElementById(`photo-edit-${labor.id}`) as HTMLInputElement;
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
        const maxSize = 400;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        const cropSize = Math.min(canvas.width, canvas.height) * 0.85;
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
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
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
    
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.strokeRect(crop.x, crop.y, crop.size, crop.size);
    
    const handleSize = 12;
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(crop.x - handleSize/2, crop.y - handleSize/2, handleSize, handleSize);
    ctx.fillRect(crop.x + crop.size - handleSize/2, crop.y - handleSize/2, handleSize, handleSize);
    ctx.fillRect(crop.x - handleSize/2, crop.y + crop.size - handleSize/2, handleSize, handleSize);
    ctx.fillRect(crop.x + crop.size - handleSize/2, crop.y + crop.size - handleSize/2, handleSize, handleSize);
    
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    const centerX = crop.x + crop.size / 2;
    const centerY = crop.y + crop.size / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, crop.y);
    ctx.lineTo(centerX, crop.y + crop.size);
    ctx.moveTo(crop.x, centerY);
    ctx.lineTo(crop.x + crop.size, centerY);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const getEventPosition = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pos = getEventPosition(e);
    if (!pos) return;
    
    if (pos.x >= crop.x && pos.x <= crop.x + crop.size && 
        pos.y >= crop.y && pos.y <= crop.y + crop.size) {
      setIsDragging(true);
      setDragStart({ x: pos.x - crop.x, y: pos.y - crop.y });
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pos = getEventPosition(e);
    if (!pos) return;
    
    if (pos.x >= crop.x && pos.x <= crop.x + crop.size && 
        pos.y >= crop.y && pos.y <= crop.y + crop.size) {
      setIsDragging(true);
      setDragStart({ x: pos.x - crop.x, y: pos.y - crop.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDragging || !canvasRef.current) return;
    
    const pos = getEventPosition(e);
    if (!pos) return;
    
    const canvas = canvasRef.current;
    const newX = Math.max(0, Math.min(pos.x - dragStart.x, canvas.width - crop.size));
    const newY = Math.max(0, Math.min(pos.y - dragStart.y, canvas.height - crop.size));
    
    setCrop({ ...crop, x: newX, y: newY });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDragging || !canvasRef.current) return;
    
    const pos = getEventPosition(e);
    if (!pos) return;
    
    const canvas = canvasRef.current;
    const newX = Math.max(0, Math.min(pos.x - dragStart.x, canvas.width - crop.size));
    const newY = Math.max(0, Math.min(pos.y - dragStart.y, canvas.height - crop.size));
    
    setCrop({ ...crop, x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const resetCropToCenter = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const cropSize = Math.min(canvas.width, canvas.height) * 0.85;
    setCrop({
      x: (canvas.width - cropSize) / 2,
      y: (canvas.height - cropSize) / 2,
      size: cropSize
    });
  };

  const handleCrop = () => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = 200;
    cropCanvas.height = 200;
    const cropCtx = cropCanvas.getContext('2d');
    if (!cropCtx) return;
    
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
      resetForm();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const rate = dailyRate ? parseFloat(dailyRate) : 0;
      onEdit(
        labor.id,
        name.trim(), 
        rate, 
        photo || undefined, 
        address.trim() || undefined
      );
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          data-testid={`button-edit-${labor.id}`}
          title="Edit Labor Details"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Labor Details</DialogTitle>
          <DialogDescription>
            Update the labor details including daily rate.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`name-edit-${labor.id}`}>Labor Name</Label>
            <Input
              id={`name-edit-${labor.id}`}
              data-testid="input-edit-labor-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter labor name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`dailyRate-edit-${labor.id}`}>Daily Rate (₹)</Label>
            <Input
              id={`dailyRate-edit-${labor.id}`}
              data-testid="input-edit-daily-rate"
              type="number"
              step="0.01"
              value={dailyRate}
              onChange={(e) => setDailyRate(e.target.value)}
              placeholder="Enter daily rate"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`photo-edit-${labor.id}`}>Photo</Label>
            <div className="flex items-center gap-2">
              <Input
                id={`photo-edit-${labor.id}`}
                data-testid="input-edit-photo-file"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById(`photo-edit-${labor.id}`)?.click()}
                className="w-full"
                data-testid="button-edit-upload-photo"
              >
                <Upload className="h-4 w-4 mr-2" />
                {photoFileName || "Change Photo"}
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
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className="border-2 border-border rounded cursor-move touch-none"
                    data-testid="canvas-edit-crop"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground flex-1">
                    নীল বক্সটি উপর-নিচে/ডান-বামে টেনে সরান
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={resetCropToCenter}
                    data-testid="button-edit-reset-crop"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCropper(false)}
                    className="flex-1"
                    data-testid="button-edit-cancel-crop"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCrop}
                    className="flex-1"
                    data-testid="button-edit-apply-crop"
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
                  data-testid="img-edit-photo-preview"
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor={`address-edit-${labor.id}`}>Address</Label>
            <Textarea
              id={`address-edit-${labor.id}`}
              data-testid="input-edit-address"
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
              data-testid="button-edit-cancel"
            >
              Cancel
            </Button>
            <Button type="submit" data-testid="button-edit-submit">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
