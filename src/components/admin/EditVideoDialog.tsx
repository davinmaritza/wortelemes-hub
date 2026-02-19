"use client";

import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Video, updateVideo } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

interface EditVideoDialogProps {
  video: Video;
  onUpdate: () => void;
}

const EditVideoDialog = ({ video, onUpdate }: EditVideoDialogProps) => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState({
    youtubeUrl: video.youtubeUrl,
    title: video.title || "",
    subtitle: video.subtitle || "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setEditData({
        youtubeUrl: video.youtubeUrl,
        title: video.title || "",
        subtitle: video.subtitle || "",
      });
    }
  }, [open, video]);

  const handleSave = async () => {
    if (!editData.youtubeUrl) {
      toast({ title: "YouTube URL is required", variant: "destructive" });
      return;
    }
    try {
      await updateVideo(video.id, {
        youtubeUrl: editData.youtubeUrl,
        title: editData.title || null,
        subtitle: editData.subtitle || null,
      });
      toast({ title: "Video updated" });
      setOpen(false);
      onUpdate();
    } catch {
      toast({ title: "Failed to update video", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Edit Video</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="font-body">YouTube URL *</Label>
            <Input
              value={editData.youtubeUrl}
              onChange={(e) =>
                setEditData({ ...editData, youtubeUrl: e.target.value })
              }
              placeholder="https://youtube.com/..."
              className="font-body"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-body">
              Title <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              className="font-body"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-body">
              Subtitle <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              value={editData.subtitle}
              onChange={(e) =>
                setEditData({ ...editData, subtitle: e.target.value })
              }
              className="font-body"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="font-body"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} className="font-body">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditVideoDialog;
