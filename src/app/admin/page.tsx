"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import {
  Trash2,
  Plus,
  LogOut,
  Save,
  Image as ImageIcon,
  Video as VideoIcon,
  FolderPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EditPortfolioDialog from "@/components/admin/EditPortfolioDialog";
import ChangePasswordDialog from "@/components/admin/ChangePasswordDialog";
import { useToast } from "@/hooks/use-toast";
import {
  getVideos,
  createVideo,
  deleteVideo,
  getPortfolioItems,
  createPortfolioItem,
  deletePortfolioItem,
  getCategories,
  createCategory,
  deleteCategory,
  getSettings,
  updateSettings,
  Video,
  PortfolioItem,
  ContactInfo,
} from "@/lib/api-client";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [aboutMe, setAboutMe] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [contact, setContact] = useState<ContactInfo>({
    email: "",
    discord: "",
  });

  const [newVideo, setNewVideo] = useState({
    youtubeUrl: "",
    title: "",
    subtitle: "",
  });

  const [newPortfolioItem, setNewPortfolioItem] = useState({
    type: "image" as "image" | "video",
    url: "",
    title: "",
    description: "",
    category: "all",
  });

  const [newCategory, setNewCategory] = useState("");

  const loadData = async () => {
    try {
      const [videosData, portfolioData, categoriesData, settingsData] =
        await Promise.all([
          getVideos(),
          getPortfolioItems(),
          getCategories(),
          getSettings(),
        ]);

      setVideos(videosData);
      setPortfolioItems(portfolioData);
      setCategories(categoriesData);
      setAboutMe(settingsData.aboutMe);
      setPortfolio(settingsData.portfolio);
      setContact(settingsData.contact);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({ title: "Failed to load data", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (session) {
      loadData();
    }
  }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast({ title: "Login failed", variant: "destructive" });
    } else {
      toast({ title: "Logged in successfully" });
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    toast({ title: "Logged out" });
  };

  const handleAddVideo = async () => {
    if (!newVideo.youtubeUrl) {
      toast({ title: "YouTube URL required", variant: "destructive" });
      return;
    }

    try {
      await createVideo({
        youtubeUrl: newVideo.youtubeUrl,
        title: newVideo.title || undefined,
        subtitle: newVideo.subtitle || undefined,
        type: "video",
      });
      setNewVideo({ youtubeUrl: "", title: "", subtitle: "" });
      await loadData();
      toast({ title: "Video added successfully" });
    } catch (error) {
      toast({ title: "Failed to add video", variant: "destructive" });
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      await deleteVideo(id);
      await loadData();
      toast({ title: "Video deleted" });
    } catch (error) {
      toast({ title: "Failed to delete video", variant: "destructive" });
    }
  };

  const handleAddPortfolioItem = async () => {
    if (!newPortfolioItem.url) {
      toast({ title: "URL required", variant: "destructive" });
      return;
    }

    try {
      await createPortfolioItem({
        type: newPortfolioItem.type,
        url: newPortfolioItem.url,
        title: newPortfolioItem.title || undefined,
        description: newPortfolioItem.description || undefined,
        category: newPortfolioItem.category,
      });
      setNewPortfolioItem({
        type: "image",
        url: "",
        title: "",
        description: "",
        category: "all",
      });
      await loadData();
      toast({ title: "Portfolio item added successfully" });
    } catch (error) {
      toast({ title: "Failed to add portfolio item", variant: "destructive" });
    }
  };

  const handleDeletePortfolioItem = async (id: string) => {
    try {
      await deletePortfolioItem(id);
      await loadData();
      toast({ title: "Portfolio item deleted" });
    } catch (error) {
      toast({
        title: "Failed to delete portfolio item",
        variant: "destructive",
      });
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory) {
      toast({ title: "Category name required", variant: "destructive" });
      return;
    }

    try {
      await createCategory(newCategory);
      setNewCategory("");
      await loadData();
      toast({ title: "Category added successfully" });
    } catch (error: any) {
      toast({
        title: error.message || "Failed to add category",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (name: string) => {
    if (name === "all") {
      toast({ title: "Cannot delete 'all' category", variant: "destructive" });
      return;
    }

    try {
      await deleteCategory(name);
      await loadData();
      toast({ title: "Category deleted" });
    } catch (error) {
      toast({ title: "Failed to delete category", variant: "destructive" });
    }
  };

  const handleSaveAboutMe = async () => {
    try {
      await updateSettings("aboutMe", aboutMe);
      toast({ title: "About Me saved" });
    } catch (error) {
      toast({ title: "Failed to save About Me", variant: "destructive" });
    }
  };

  const handleSavePortfolio = async () => {
    try {
      await updateSettings("portfolio", portfolio);
      toast({ title: "Portfolio text saved" });
    } catch (error) {
      toast({ title: "Failed to save portfolio text", variant: "destructive" });
    }
  };

  const handleSaveContact = async () => {
    try {
      await updateSettings("contact", contact);
      toast({ title: "Contact info saved" });
    } catch (error) {
      toast({ title: "Failed to save contact info", variant: "destructive" });
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
          <p className="text-muted-foreground font-body">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        {/* Logo */}
        <div className="mb-8 animate-fade-in-up">
          <Image
            src="/logo.png"
            alt="Wortelemes"
            width={120}
            height={120}
            className="w-24 h-24 md:w-30 md:h-30 object-contain"
            priority
          />
        </div>

        <Card
          className="w-full max-w-md shadow-lg opacity-0 animate-fade-in-up delay-100"
          style={{ animationFillMode: "forwards" }}
        >
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-display text-center">
              Admin Login
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center font-body">
              Enter your credentials to access the dashboard
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="font-body">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="font-body"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-body">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-body"
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" className="w-full font-body">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="Wortelemes"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-2xl font-display font-bold">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground font-body">
                  Welcome back, {session.user?.username}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <ChangePasswordDialog />
              <Button
                onClick={handleLogout}
                variant="outline"
                className="font-body"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Videos Section */}
        <section
          className="opacity-0 animate-fade-in-up"
          style={{ animationFillMode: "forwards" }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <VideoIcon className="w-5 h-5" />
                Videos Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="font-body">YouTube URL</Label>
                  <Input
                    value={newVideo.youtubeUrl}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, youtubeUrl: e.target.value })
                    }
                    placeholder="https://youtube.com/..."
                    className="font-body"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-body">Title (optional)</Label>
                  <Input
                    value={newVideo.title}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, title: e.target.value })
                    }
                    className="font-body"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-body">Subtitle (optional)</Label>
                  <Input
                    value={newVideo.subtitle}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, subtitle: e.target.value })
                    }
                    className="font-body"
                  />
                </div>
              </div>
              <Button onClick={handleAddVideo} className="font-body">
                <Plus className="w-4 h-4 mr-2" />
                Add Video
              </Button>

              <div className="space-y-3">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium font-body">
                        {video.title || video.youtubeUrl}
                      </p>
                      {video.subtitle && (
                        <p className="text-sm text-muted-foreground font-body">
                          {video.subtitle}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteVideo(video.id)}
                      className="font-body"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {videos.length === 0 && (
                  <p className="text-center text-muted-foreground py-8 font-body">
                    No videos yet. Add your first video above.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Portfolio Items Section */}
        <section
          className="opacity-0 animate-fade-in-up delay-100"
          style={{ animationFillMode: "forwards" }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Portfolio Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label className="font-body">Type</Label>
                  <Select
                    value={newPortfolioItem.type}
                    onValueChange={(value: "image" | "video") =>
                      setNewPortfolioItem({ ...newPortfolioItem, type: value })
                    }
                  >
                    <SelectTrigger className="font-body">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image" className="font-body">
                        Image
                      </SelectItem>
                      <SelectItem value="video" className="font-body">
                        Video
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-body">URL</Label>
                  <Input
                    value={newPortfolioItem.url}
                    onChange={(e) =>
                      setNewPortfolioItem({
                        ...newPortfolioItem,
                        url: e.target.value,
                      })
                    }
                    placeholder="https://..."
                    className="font-body"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-body">Title (optional)</Label>
                  <Input
                    value={newPortfolioItem.title}
                    onChange={(e) =>
                      setNewPortfolioItem({
                        ...newPortfolioItem,
                        title: e.target.value,
                      })
                    }
                    className="font-body"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-body">Description (optional)</Label>
                  <Input
                    value={newPortfolioItem.description}
                    onChange={(e) =>
                      setNewPortfolioItem({
                        ...newPortfolioItem,
                        description: e.target.value,
                      })
                    }
                    className="font-body"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-body">Category</Label>
                  <Select
                    value={newPortfolioItem.category}
                    onValueChange={(value) =>
                      setNewPortfolioItem({
                        ...newPortfolioItem,
                        category: value,
                      })
                    }
                  >
                    <SelectTrigger className="font-body">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="font-body">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddPortfolioItem} className="font-body">
                <Plus className="w-4 h-4 mr-2" />
                Add Portfolio Item
              </Button>

              <div className="space-y-3">
                {portfolioItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {item.type === "video" ? (
                          <VideoIcon className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-muted-foreground" />
                        )}
                        <p className="font-medium font-body">
                          {item.title || item.url}
                        </p>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground font-body mt-1">
                          {item.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground font-body mt-1">
                        Category: {item.category || "none"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <EditPortfolioDialog item={item} onUpdate={loadData} />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePortfolioItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {portfolioItems.length === 0 && (
                  <p className="text-center text-muted-foreground py-8 font-body">
                    No portfolio items yet. Add your first item above.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Categories Section */}
        <section
          className="opacity-0 animate-fade-in-up delay-200"
          style={{ animationFillMode: "forwards" }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <FolderPlus className="w-5 h-5" />
                Categories Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  className="font-body"
                />
                <Button onClick={handleAddCategory} className="font-body">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center gap-2 px-4 py-2 border rounded-full bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-body">{category}</span>
                    {category !== "all" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category)}
                        className="h-auto p-1 hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Content Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* About Me Section */}
          <section
            className="opacity-0 animate-fade-in-up delay-300"
            style={{ animationFillMode: "forwards" }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="font-display">About Me</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                  rows={6}
                  className="font-body resize-none"
                  placeholder="Write about yourself..."
                />
                <Button
                  onClick={handleSaveAboutMe}
                  className="w-full font-body"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save About Me
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Portfolio Description Section */}
          <section
            className="opacity-0 animate-fade-in-up delay-300"
            style={{ animationFillMode: "forwards" }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="font-display">
                  Portfolio Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  rows={6}
                  className="font-body resize-none"
                  placeholder="Describe your portfolio..."
                />
                <Button
                  onClick={handleSavePortfolio}
                  className="w-full font-body"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Portfolio Text
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Contact Info Section */}
        <section
          className="opacity-0 animate-fade-in-up delay-400"
          style={{ animationFillMode: "forwards" }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="font-display">
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-body">Email</Label>
                  <Input
                    type="email"
                    value={contact.email}
                    onChange={(e) =>
                      setContact({ ...contact, email: e.target.value })
                    }
                    className="font-body"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-body">Discord</Label>
                  <Input
                    value={contact.discord}
                    onChange={(e) =>
                      setContact({ ...contact, discord: e.target.value })
                    }
                    className="font-body"
                    placeholder="username"
                  />
                </div>
              </div>
              <Button onClick={handleSaveContact} className="font-body">
                <Save className="w-4 h-4 mr-2" />
                Save Contact Info
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
