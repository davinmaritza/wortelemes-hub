import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, LogOut, Save, Image, Video, FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import EditPortfolioDialog from '@/components/admin/EditPortfolioDialog';
import ChangePasswordDialog from '@/components/admin/ChangePasswordDialog';
import { useToast } from '@/hooks/use-toast';
import { 
  getData, 
  addVideo, 
  deleteVideo, 
  updateAboutMe,
  updatePortfolio,
  updateContact,
  addPortfolioItem,
  deletePortfolioItem,
  isLoggedIn, 
  login, 
  logout,
  getCategories,
  addCategory,
  deleteCategory,
  Video as VideoType,
  ContactInfo,
  PortfolioItem,
  PortfolioCategory
} from '@/lib/data';

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [aboutMe, setAboutMe] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [contact, setContact] = useState<ContactInfo>({ email: '', discord: '' });
  const [newVideo, setNewVideo] = useState<{ youtubeUrl: string; title: string; subtitle: string }>({ youtubeUrl: '', title: '', subtitle: '' });
  const [newPortfolioItem, setNewPortfolioItem] = useState<{ type: 'image' | 'video'; url: string; title: string; description: string; category: PortfolioCategory }>({ type: 'image', url: '', title: '', description: '', category: 'all' });
  const [newCategory, setNewCategory] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      setAuthenticated(true);
      loadData();
    }
  }, []);

  const loadData = () => {
    const data = getData();
    setVideos(data.videos);
    setAboutMe(data.aboutMe);
    setPortfolio(data.portfolio);
    setPortfolioItems(data.portfolioItems);
    setContact(data.contact);
    setCategories(getCategories());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      setAuthenticated(true);
      loadData();
      toast({ title: 'Logged in successfully' });
    } else {
      toast({ title: 'Invalid credentials', variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const handleAddVideo = () => {
    if (!newVideo.youtubeUrl) {
      toast({ title: 'Please fill in YouTube URL', variant: 'destructive' });
      return;
    }
    addVideo({
      youtubeUrl: newVideo.youtubeUrl,
      title: newVideo.title || undefined,
      subtitle: newVideo.subtitle || undefined,
      type: 'video'
    });
    setNewVideo({ youtubeUrl: '', title: '', subtitle: '' });
    loadData();
    toast({ title: 'Video added successfully' });
  };

  const handleDeleteVideo = (id: string) => {
    deleteVideo(id);
    loadData();
    toast({ title: 'Video deleted' });
  };

  const handleSaveAboutMe = () => {
    updateAboutMe(aboutMe);
    toast({ title: 'About Me updated' });
  };

  const handleSavePortfolio = () => {
    updatePortfolio(portfolio);
    toast({ title: 'Portfolio updated' });
  };

  const handleAddPortfolioItem = () => {
    if (!newPortfolioItem.url) {
      toast({ title: 'Please fill in URL', variant: 'destructive' });
      return;
    }
    addPortfolioItem({
      type: newPortfolioItem.type,
      url: newPortfolioItem.url,
      title: newPortfolioItem.title || undefined,
      description: newPortfolioItem.description || undefined,
      category: newPortfolioItem.category
    });
    setNewPortfolioItem({ type: 'image', url: '', title: '', description: '', category: 'all' });
    loadData();
    toast({ title: 'Portfolio item added' });
  };

  const handleDeletePortfolioItem = (id: string) => {
    deletePortfolioItem(id);
    loadData();
    toast({ title: 'Portfolio item deleted' });
  };

  const handleSaveContact = () => {
    updateContact(contact);
    toast({ title: 'Contact info updated' });
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center font-display text-2xl">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username" className="font-body">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="font-body"
                />
              </div>
              <div>
                <Label htmlFor="password" className="font-body">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="font-body"
                />
              </div>
              <Button type="submit" className="w-full font-body">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl text-foreground">Admin Panel</h1>
          <div className="flex gap-2 flex-wrap justify-end">
            <ChangePasswordDialog />
            <Button variant="outline" onClick={() => navigate('/')} className="font-body">View Site</Button>
            <Button variant="destructive" onClick={handleLogout} className="font-body">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        {/* Add Video */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-display">Add New Video</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="youtubeUrl" className="font-body">YouTube URL *</Label>
                <Input
                  id="youtubeUrl"
                  value={newVideo.youtubeUrl}
                  onChange={(e) => setNewVideo(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="font-body"
                />
              </div>
              <div>
                <Label htmlFor="title" className="font-body">Title (optional)</Label>
                <Input
                  id="title"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Video title"
                  className="font-body"
                />
              </div>
              <div>
                <Label htmlFor="subtitle" className="font-body">Subtitle (optional)</Label>
                <Input
                  id="subtitle"
                  value={newVideo.subtitle}
                  onChange={(e) => setNewVideo(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Video subtitle"
                  className="font-body"
                />
              </div>
            </div>
            <Button onClick={handleAddVideo} className="font-body">
              <Plus className="w-4 h-4 mr-2" /> Add Video
            </Button>
          </CardContent>
        </Card>

        {/* Video List */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-display">Manage Videos ({videos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {videos.length === 0 ? (
              <p className="text-muted-foreground text-center py-4 font-body">No videos added yet</p>
            ) : (
              <div className="space-y-3">
                {videos.map((video) => (
                  <div key={video.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-body font-medium text-foreground">{video.title || 'Untitled'}</p>
                      <p className="text-sm text-muted-foreground font-body">{video.subtitle || 'No subtitle'}</p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteVideo(video.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Portfolio Text */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-display">Portfolio Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              placeholder="Write about your portfolio..."
              rows={3}
              className="font-body"
            />
            <Button onClick={handleSavePortfolio} className="font-body">
              <Save className="w-4 h-4 mr-2" /> Save Description
            </Button>
          </CardContent>
        </Card>

        {/* Manage Categories */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-display">Manage Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category name (e.g., Artwork or GTACommish/Mods)"
                className="font-body flex-1"
              />
              <Button 
                onClick={() => {
                  if (newCategory.trim()) {
                    addCategory(newCategory.trim());
                    setNewCategory('');
                    setCategories(getCategories());
                    toast({ title: 'Category added' });
                  }
                }} 
                className="font-body"
              >
                <FolderPlus className="w-4 h-4 mr-2" /> Add Category
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.filter(c => c !== 'all').map((cat) => (
                <div key={cat} className="flex items-center gap-1 bg-muted rounded-md px-3 py-1.5">
                  <span className="text-sm font-body">{cat.replace('/', ' - ')}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => {
                      deleteCategory(cat);
                      setCategories(getCategories());
                      toast({ title: 'Category deleted' });
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add Portfolio Item */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-display">Add Portfolio Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 mb-4">
              <Button
                variant={newPortfolioItem.type === 'image' ? 'default' : 'outline'}
                onClick={() => setNewPortfolioItem(prev => ({ ...prev, type: 'image' }))}
                className="font-body"
              >
                <Image className="w-4 h-4 mr-2" /> Image
              </Button>
              <Button
                variant={newPortfolioItem.type === 'video' ? 'default' : 'outline'}
                onClick={() => setNewPortfolioItem(prev => ({ ...prev, type: 'video' }))}
                className="font-body"
              >
                <Video className="w-4 h-4 mr-2" /> Video
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="portfolioUrl" className="font-body">
                  {newPortfolioItem.type === 'image' ? 'Image URL *' : 'YouTube URL *'}
                </Label>
                <Input
                  id="portfolioUrl"
                  value={newPortfolioItem.url}
                  onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, url: e.target.value }))}
                  placeholder={newPortfolioItem.type === 'image' ? 'https://example.com/image.jpg' : 'https://www.youtube.com/watch?v=...'}
                  className="font-body"
                />
              </div>
              <div>
                <Label htmlFor="portfolioTitle" className="font-body">Title (optional)</Label>
                <Input
                  id="portfolioTitle"
                  value={newPortfolioItem.title}
                  onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Item title"
                  className="font-body"
                />
              </div>
              <div>
                <Label htmlFor="portfolioCategory" className="font-body">Category</Label>
                <Select
                  value={newPortfolioItem.category}
                  onValueChange={(value: PortfolioCategory) => setNewPortfolioItem(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="font-body">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat === 'all' ? 'All' : cat.replace('/', ' - ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="portfolioDesc" className="font-body">Description (optional)</Label>
                <Input
                  id="portfolioDesc"
                  value={newPortfolioItem.description}
                  onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description"
                  className="font-body"
                />
              </div>
            </div>
            <Button onClick={handleAddPortfolioItem} className="font-body">
              <Plus className="w-4 h-4 mr-2" /> Add Item
            </Button>
          </CardContent>
        </Card>

        {/* Portfolio Items List */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-display">Portfolio Items ({portfolioItems.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {portfolioItems.length === 0 ? (
              <p className="text-muted-foreground text-center py-4 font-body">No portfolio items added yet</p>
            ) : (
              <div className="space-y-3">
                {portfolioItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      {item.type === 'image' ? (
                        <Image className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Video className="w-5 h-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-body font-medium text-foreground">{item.title || 'Untitled'}</p>
                        <p className="text-sm text-muted-foreground font-body truncate max-w-[300px]">{item.url}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <EditPortfolioDialog item={item} onUpdate={loadData} />
                      <Button variant="destructive" size="sm" onClick={() => handleDeletePortfolioItem(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* About Me */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-display">About Me</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              placeholder="Write about yourself..."
              rows={5}
              className="font-body"
            />
            <Button onClick={handleSaveAboutMe} className="font-body">
              <Save className="w-4 h-4 mr-2" /> Save About Me
            </Button>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="font-body">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="font-body"
                />
              </div>
              <div>
                <Label htmlFor="discord" className="font-body">Discord Username</Label>
                <Input
                  id="discord"
                  value={contact.discord}
                  onChange={(e) => setContact(prev => ({ ...prev, discord: e.target.value }))}
                  placeholder="username"
                  className="font-body"
                />
              </div>
            </div>
            <Button onClick={handleSaveContact} className="font-body">
              <Save className="w-4 h-4 mr-2" /> Save Contact Info
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
