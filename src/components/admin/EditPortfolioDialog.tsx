"use client";

import { useState, useEffect } from "react";
import { Pencil, Link2, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PortfolioItem,
  updatePortfolioItem,
  getCategories,
} from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

interface EditPortfolioDialogProps {
  item: PortfolioItem;
  onUpdate: () => void;
}

const EditPortfolioDialog = ({ item, onUpdate }: EditPortfolioDialogProps) => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [editData, setEditData] = useState({
    type: item.type,
    url: item.url,
    title: item.title || "",
    description: item.description || "",
    category: item.category || "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      getCategories().then(setCategories).catch(console.error);
      setEditData({
        type: item.type,
        url: item.url,
        title: item.title || "",
        description: item.description || "",
        category: item.category || "",
      });
      setImageMode("url");
      setImagePreview(null);
      setUploadComplete(false);
    }
  }, [open, item]);

  const handleImageSelect = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setUploadComplete(false);
    handleImageUpload(file);
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setEditData((prev) => ({ ...prev, url: data.url }));
      setUploadComplete(true);
      toast({ title: "Image uploaded successfully" });
    } catch {
      setImagePreview(null);
      toast({ title: "Failed to upload image", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const clearImagePreview = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    setUploadComplete(false);
  };

  const handleSave = async () => {
    if (!editData.url) {
      toast({ title: "URL is required", variant: "destructive" });
      return;
    }
    if (!editData.title) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    if (!editData.description) {
      toast({ title: "Description is required", variant: "destructive" });
      return;
    }
    try {
      await updatePortfolioItem(item.id, {
        type: editData.type,
        url: editData.url,
        title: editData.title,
        description: editData.description,
        category: editData.category || null,
      });
      toast({ title: "Portfolio item updated" });
      setOpen(false);
      onUpdate();
    } catch (error) {
      toast({ title: "Failed to update item", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">
            Edit Portfolio Item
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Type */}
          <div className="space-y-2">
            <Label className="font-body">Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={editData.type === "image" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setEditData((prev) => ({ ...prev, type: "image", url: "" }))
                }
                className="font-body"
              >
                Image
              </Button>
              <Button
                type="button"
                variant={editData.type === "video" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setEditData((prev) => ({ ...prev, type: "video", url: "" }))
                }
                className="font-body"
              >
                Video
              </Button>
            </div>
          </div>

          {/* URL / Upload */}
          {editData.type === "image" ? (
            <div className="space-y-2">
              <Label className="font-body">Image *</Label>
              <div className="flex items-center gap-1 rounded-md border border-input bg-muted/30 p-1 w-fit mb-2">
                <Button
                  type="button"
                  variant={imageMode === "url" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setImageMode("url")}
                  className="h-7 px-3 font-body text-xs gap-1.5"
                >
                  <Link2 className="w-3 h-3" />
                  URL
                </Button>
                <Button
                  type="button"
                  variant={imageMode === "upload" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setImageMode("upload")}
                  className="h-7 px-3 font-body text-xs gap-1.5"
                >
                  <Upload className="w-3 h-3" />
                  Upload
                </Button>
              </div>
              {imageMode === "url" ? (
                <Input
                  value={editData.url}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, url: e.target.value }))
                  }
                  placeholder="https://example.com/image.jpg"
                  className="font-body"
                />
              ) : (
                <div className="space-y-3">
                  <Input
                    type="file"
                    accept="image/*"
                    className="font-body cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageSelect(file);
                    }}
                    disabled={isUploading}
                  />
                  {/* Image preview with grayscale → color animation */}
                  {imagePreview && (
                    <div className="relative w-full max-w-xs">
                      <div
                        className={`relative overflow-hidden rounded-lg border transition-all duration-700 ${
                          isUploading
                            ? "grayscale"
                            : uploadComplete
                              ? "grayscale-0"
                              : "grayscale"
                        }`}
                      >
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-auto max-h-48 object-cover"
                        />
                        {isUploading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="flex flex-col items-center gap-2">
                              <Loader2 className="w-6 h-6 text-white animate-spin" />
                              <span className="text-xs text-white font-body">
                                Uploading...
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      {uploadComplete && (
                        <p className="text-xs text-green-600 dark:text-green-400 font-body mt-2 flex items-center gap-1">
                          ✓ Image uploaded successfully
                        </p>
                      )}
                    </div>
                  )}
                  {/* Show existing image URL if no preview but has URL */}
                  {!imagePreview && editData.url && (
                    <p className="text-xs text-green-600 dark:text-green-400 font-body flex items-center gap-1">
                      ✓ Image already uploaded
                    </p>
                  )}
                  {/* Hidden input to store the actual URL */}
                  <input type="hidden" value={editData.url} />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="font-body">YouTube URL *</Label>
              <Input
                value={editData.url}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, url: e.target.value }))
                }
                placeholder="https://www.youtube.com/watch?v=..."
                className="font-body"
              />
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label className="font-body">Title *</Label>
            <Input
              value={editData.title}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Item title"
              className="font-body"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="font-body">Description *</Label>
            <Input
              value={editData.description}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Brief description"
              className="font-body"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="font-body">Category</Label>
            <Select
              value={editData.category || "__none__"}
              onValueChange={(value) =>
                setEditData((prev) => ({
                  ...prev,
                  category: value === "__none__" ? "" : value,
                }))
              }
            >
              <SelectTrigger className="font-body">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__" className="font-body">
                  None
                </SelectItem>
                {categories
                  .filter((c) => c !== "all")
                  .map((cat) => (
                    <SelectItem key={cat} value={cat} className="font-body">
                      {cat}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="font-body"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUploading}
              className="font-body"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPortfolioDialog;
