import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, LogOut, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  getData, 
  addVideo, 
  deleteVideo, 
  updateAboutMe, 
  isLoggedIn, 
  login, 
  logout,
  Video 
} from '@/lib/data';

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [aboutMe, setAboutMe] = useState('');
  const [newVideo, setNewVideo] = useState<{ youtubeUrl: string; title: string; subtitle: string; type: 'video' | 'portfolio' }>({ youtubeUrl: '', title: '', subtitle: '', type: 'video' });
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
    if (!newVideo.youtubeUrl || !newVideo.title) {
      toast({ title: 'Please fill in YouTube URL and Title', variant: 'destructive' });
      return;
    }
    addVideo({
      youtubeUrl: newVideo.youtubeUrl,
      title: newVideo.title,
      subtitle: newVideo.subtitle || undefined,
      type: newVideo.type
    });
    setNewVideo({ youtubeUrl: '', title: '', subtitle: '', type: 'video' });
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

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
              <Button type="submit" className="w-full">Login</Button>
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
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/')}>View Site</Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        {/* Add Video */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Video</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="youtubeUrl">YouTube URL *</Label>
                <Input
                  id="youtubeUrl"
                  value={newVideo.youtubeUrl}
                  onChange={(e) => setNewVideo(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Video title"
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Subtitle (optional)</Label>
                <Input
                  id="subtitle"
                  value={newVideo.subtitle}
                  onChange={(e) => setNewVideo(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Video subtitle"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={newVideo.type} onValueChange={(value: 'video' | 'portfolio') => setNewVideo(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="portfolio">Portfolio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAddVideo}>
              <Plus className="w-4 h-4 mr-2" /> Add Video
            </Button>
          </CardContent>
        </Card>

        {/* Video List */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Manage Videos ({videos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {videos.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No videos added yet</p>
            ) : (
              <div className="space-y-3">
                {videos.map((video) => (
                  <div key={video.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{video.title}</p>
                      <p className="text-sm text-muted-foreground">{video.subtitle || 'No subtitle'} • {video.type}</p>
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

        {/* About Me */}
        <Card>
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              placeholder="Write about yourself..."
              rows={5}
            />
            <Button onClick={handleSaveAboutMe}>
              <Save className="w-4 h-4 mr-2" /> Save About Me
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
