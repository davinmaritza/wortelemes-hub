import { useState, useEffect } from 'react';
import { Pencil, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PortfolioItem, updatePortfolioItem } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

interface EditPortfolioDialogProps {
  item: PortfolioItem;
  onUpdate: () => void;
}

const EditPortfolioDialog = ({ item, onUpdate }: EditPortfolioDialogProps) => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState({
    type: item.type,
    url: item.url,
    title: item.title || '',
    description: item.description || '',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setEditData({
        type: item.type,
        url: item.url,
        title: item.title || '',
        description: item.description || '',
      });
    }
  }, [open, item]);

  const handleSave = () => {
    if (!editData.url) {
      toast({ title: 'URL is required', variant: 'destructive' });
      return;
    }
    updatePortfolioItem(item.id, {
      type: editData.type,
      url: editData.url,
      title: editData.title || undefined,
      description: editData.description || undefined,
    });
    toast({ title: 'Portfolio item updated' });
    setOpen(false);
    onUpdate();
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
          <DialogTitle className="font-display">Edit Portfolio Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex gap-4">
            <Button
              variant={editData.type === 'image' ? 'default' : 'outline'}
              onClick={() => setEditData(prev => ({ ...prev, type: 'image' }))}
              className="font-body"
            >
              <Image className="w-4 h-4 mr-2" /> Image
            </Button>
            <Button
              variant={editData.type === 'video' ? 'default' : 'outline'}
              onClick={() => setEditData(prev => ({ ...prev, type: 'video' }))}
              className="font-body"
            >
              <Video className="w-4 h-4 mr-2" /> Video
            </Button>
          </div>
          <div>
            <Label htmlFor="editUrl" className="font-body">
              {editData.type === 'image' ? 'Image URL *' : 'YouTube URL *'}
            </Label>
            <Input
              id="editUrl"
              value={editData.url}
              onChange={(e) => setEditData(prev => ({ ...prev, url: e.target.value }))}
              placeholder={editData.type === 'image' ? 'https://example.com/image.jpg' : 'https://www.youtube.com/watch?v=...'}
              className="font-body"
            />
          </div>
          <div>
            <Label htmlFor="editTitle" className="font-body">Title (optional)</Label>
            <Input
              id="editTitle"
              value={editData.title}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Item title"
              className="font-body"
            />
          </div>
          <div>
            <Label htmlFor="editDesc" className="font-body">Description (optional)</Label>
            <Input
              id="editDesc"
              value={editData.description}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description"
              className="font-body"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="font-body">
              Cancel
            </Button>
            <Button onClick={handleSave} className="font-body">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPortfolioDialog;
