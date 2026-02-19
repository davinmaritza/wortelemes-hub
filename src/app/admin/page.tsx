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
  FileText,
  Phone as PhoneIcon,
  Pencil,
  Mail,
  MessageCircle,
  Twitter,
  Instagram,
  Youtube,
  Github,
  Twitch,
  Linkedin,
  Globe,
  Phone,
  Send,
  Music,
  Link as LinkIcon,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditPortfolioDialog from "@/components/admin/EditPortfolioDialog";
import EditVideoDialog from "@/components/admin/EditVideoDialog";
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
  ContactLink,
} from "@/lib/api-client";

// ---------- Icon registry ----------
const CONTACT_ICONS: Record<string, React.ElementType> = {
  Mail,
  MessageCircle,
  Twitter,
  Instagram,
  Youtube,
  Github,
  Twitch,
  Linkedin,
  Globe,
  Phone,
  Send,
  Music,
  Link: LinkIcon,
};

const CONTACT_ICON_OPTIONS = [
  { value: "Mail", label: "Email" },
  { value: "MessageCircle", label: "Discord / Chat" },
  { value: "Twitter", label: "Twitter / X" },
  { value: "Instagram", label: "Instagram" },
  { value: "Youtube", label: "YouTube" },
  { value: "Github", label: "GitHub" },
  { value: "Twitch", label: "Twitch" },
  { value: "Linkedin", label: "LinkedIn" },
  { value: "Globe", label: "Website" },
  { value: "Phone", label: "Phone" },
  { value: "Send", label: "Telegram" },
  { value: "Music", label: "TikTok / Music" },
  { value: "Link", label: "Other Link" },
];

function ContactIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = CONTACT_ICONS[name] ?? LinkIcon;
  return <Icon className={className} />;
}

// ---------- Main component ----------
export default function AdminPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();

  // Auth form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Data
  const [videos, setVideos] = useState<Video[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [aboutMe, setAboutMe] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [contactLinks, setContactLinks] = useState<ContactLink[]>([]);

  // Add-video form
  const [newVideo, setNewVideo] = useState({
    youtubeUrl: "",
    title: "",
    subtitle: "",
  });

  // Add-portfolio form
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    type: "image" as "image" | "video",
    url: "",
    title: "",
    description: "",
    category: "all",
  });

  // Add-category form
  const [newCategory, setNewCategory] = useState("");

  // Add-contact form
  const [newContact, setNewContact] = useState({
    icon: "Mail",
    label: "",
    value: "",
    href: "",
  });

  // Edit-contact dialog
  const [editingContact, setEditingContact] = useState<ContactLink | null>(
    null,
  );

  // ---------- Loader ----------
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
      setContactLinks(settingsData.contact);
    } catch {
      toast({ title: "Failed to load data", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (session) loadData();
  }, [session]);

  // ---------- Auth ----------
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

  // ---------- Videos ----------
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
      toast({ title: "Video added" });
    } catch {
      toast({ title: "Failed to add video", variant: "destructive" });
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      await deleteVideo(id);
      await loadData();
      toast({ title: "Video deleted" });
    } catch {
      toast({ title: "Failed to delete video", variant: "destructive" });
    }
  };

  // ---------- Portfolio ----------
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
      toast({ title: "Portfolio item added" });
    } catch {
      toast({ title: "Failed to add portfolio item", variant: "destructive" });
    }
  };

  const handleDeletePortfolioItem = async (id: string) => {
    try {
      await deletePortfolioItem(id);
      await loadData();
      toast({ title: "Portfolio item deleted" });
    } catch {
      toast({
        title: "Failed to delete portfolio item",
        variant: "destructive",
      });
    }
  };

  // ---------- Categories ----------
  const handleAddCategory = async () => {
    if (!newCategory) {
      toast({ title: "Category name required", variant: "destructive" });
      return;
    }
    try {
      await createCategory(newCategory);
      setNewCategory("");
      await loadData();
      toast({ title: "Category added" });
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
    } catch {
      toast({ title: "Failed to delete category", variant: "destructive" });
    }
  };

  // ---------- Content ----------
  const handleSaveAboutMe = async () => {
    try {
      await updateSettings("aboutMe", aboutMe);
      toast({ title: "About Me saved" });
    } catch {
      toast({ title: "Failed to save About Me", variant: "destructive" });
    }
  };

  const handleSavePortfolio = async () => {
    try {
      await updateSettings("portfolio", portfolio);
      toast({ title: "Portfolio text saved" });
    } catch {
      toast({ title: "Failed to save portfolio text", variant: "destructive" });
    }
  };

  // ---------- Contact ----------
  const persistContactLinks = async (
    links: ContactLink[],
    successMsg: string,
  ) => {
    await updateSettings("contact", links);
    setContactLinks(links);
    toast({ title: successMsg });
  };

  const handleAddContact = async () => {
    if (!newContact.label || !newContact.value) {
      toast({
        title: "Label and value are required",
        variant: "destructive",
      });
      return;
    }
    try {
      const link: ContactLink = {
        id: Date.now().toString(),
        icon: newContact.icon,
        label: newContact.label,
        value: newContact.value,
        href: newContact.href || undefined,
      };
      await persistContactLinks([...contactLinks, link], "Contact link added");
      setNewContact({ icon: "Mail", label: "", value: "", href: "" });
    } catch {
      toast({ title: "Failed to add contact link", variant: "destructive" });
    }
  };

  const handleSaveEditContact = async () => {
    if (!editingContact) return;
    if (!editingContact.label || !editingContact.value) {
      toast({
        title: "Label and value are required",
        variant: "destructive",
      });
      return;
    }
    try {
      const updated = contactLinks.map((c) =>
        c.id === editingContact.id ? editingContact : c,
      );
      await persistContactLinks(updated, "Contact link updated");
      setEditingContact(null);
    } catch {
      toast({
        title: "Failed to update contact link",
        variant: "destructive",
      });
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await persistContactLinks(
        contactLinks.filter((c) => c.id !== id),
        "Contact link deleted",
      );
    } catch {
      toast({
        title: "Failed to delete contact link",
        variant: "destructive",
      });
    }
  };

  // ---------- Loading ----------
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto" />
          <p className="text-muted-foreground font-body">Loading...</p>
        </div>
      </div>
    );
  }

  // ---------- Login ----------
  if (!session) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="mb-8 animate-fade-in-up">
          <Image
            src="/logo.png"
            alt="Wortelemes"
            width={120}
            height={120}
            className="w-24 h-24 object-contain"
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

  // ---------- Dashboard ----------
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Wortelemes"
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
              />
              <div>
                <h1 className="text-xl font-display font-bold leading-tight">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-muted-foreground font-body">
                  Welcome, {session.user?.username}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <ChangePasswordDialog />
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="font-body"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Tabs defaultValue="videos">
          <div className="overflow-x-auto pb-1 mb-6">
            <TabsList className="inline-flex">
              <TabsTrigger value="videos" className="font-body gap-1.5">
                <VideoIcon className="w-4 h-4" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="font-body gap-1.5">
                <ImageIcon className="w-4 h-4" />
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="categories" className="font-body gap-1.5">
                <FolderPlus className="w-4 h-4" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="content" className="font-body gap-1.5">
                <FileText className="w-4 h-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="contact" className="font-body gap-1.5">
                <PhoneIcon className="w-4 h-4" />
                Contact
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ===== VIDEOS ===== */}
          <TabsContent value="videos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">
                  Add Video
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="font-body">YouTube URL *</Label>
                    <Input
                      value={newVideo.youtubeUrl}
                      onChange={(e) =>
                        setNewVideo({
                          ...newVideo,
                          youtubeUrl: e.target.value,
                        })
                      }
                      placeholder="https://youtube.com/..."
                      className="font-body"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body">
                      Title{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Input
                      value={newVideo.title}
                      onChange={(e) =>
                        setNewVideo({ ...newVideo, title: e.target.value })
                      }
                      className="font-body"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body">
                      Subtitle{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </Label>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">
                  Videos ({videos.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {videos.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 font-body text-sm">
                    No videos yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/40 transition-colors"
                      >
                        <VideoIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-medium text-sm truncate">
                            {video.title || video.youtubeUrl}
                          </p>
                          {video.subtitle && (
                            <p className="text-xs text-muted-foreground font-body truncate">
                              {video.subtitle}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <EditVideoDialog video={video} onUpdate={loadData} />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteVideo(video.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== PORTFOLIO ===== */}
          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">
                  Add Portfolio Item
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label className="font-body">Type</Label>
                    <Select
                      value={newPortfolioItem.type}
                      onValueChange={(v: "image" | "video") =>
                        setNewPortfolioItem({ ...newPortfolioItem, type: v })
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
                    <Label className="font-body">URL *</Label>
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
                    <Label className="font-body">
                      Title{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </Label>
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
                    <Label className="font-body">
                      Description{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </Label>
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
                      onValueChange={(v) =>
                        setNewPortfolioItem({
                          ...newPortfolioItem,
                          category: v,
                        })
                      }
                    >
                      <SelectTrigger className="font-body">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem
                            key={cat}
                            value={cat}
                            className="font-body"
                          >
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAddPortfolioItem} className="font-body">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">
                  Portfolio Items ({portfolioItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {portfolioItems.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 font-body text-sm">
                    No portfolio items yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {portfolioItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/40 transition-colors"
                      >
                        {item.type === "video" ? (
                          <VideoIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-medium text-sm truncate">
                            {item.title || item.url}
                          </p>
                          <div className="flex items-center gap-3 mt-0.5">
                            {item.description && (
                              <p className="text-xs text-muted-foreground font-body truncate">
                                {item.description}
                              </p>
                            )}
                            <span className="text-xs text-muted-foreground font-body shrink-0 border rounded-full px-2 py-0.5">
                              {item.category || "none"}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <EditPortfolioDialog
                            item={item}
                            onUpdate={loadData}
                          />
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
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== CATEGORIES ===== */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">
                  Add Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Category name"
                    className="font-body"
                    onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                  />
                  <Button onClick={handleAddCategory} className="font-body">
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">
                  Categories ({categories.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      className="flex items-center gap-1.5 px-3 py-1.5 border rounded-full bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-body text-sm">{cat}</span>
                      {cat !== "all" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(cat)}
                          className="h-auto w-auto p-0.5 hover:bg-destructive/20 hover:text-destructive rounded-full"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== CONTENT ===== */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">About Me</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                  rows={6}
                  className="font-body resize-none"
                  placeholder="Write about yourself..."
                />
                <Button onClick={handleSaveAboutMe} className="font-body">
                  <Save className="w-4 h-4 mr-2" />
                  Save About Me
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">
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
                <Button onClick={handleSavePortfolio} className="font-body">
                  <Save className="w-4 h-4 mr-2" />
                  Save Portfolio Text
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== CONTACT ===== */}
          <TabsContent value="contact" className="space-y-6">
            {/* Add new contact link */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">
                  Add Contact Link
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-body">Icon</Label>
                    <Select
                      value={newContact.icon}
                      onValueChange={(v) =>
                        setNewContact({ ...newContact, icon: v })
                      }
                    >
                      <SelectTrigger className="font-body">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTACT_ICON_OPTIONS.map((opt) => (
                          <SelectItem
                            key={opt.value}
                            value={opt.value}
                            className="font-body"
                          >
                            <div className="flex items-center gap-2">
                              <ContactIcon
                                name={opt.value}
                                className="w-4 h-4"
                              />
                              {opt.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body">Label *</Label>
                    <Input
                      value={newContact.label}
                      onChange={(e) =>
                        setNewContact({ ...newContact, label: e.target.value })
                      }
                      placeholder="e.g. Email, Discord..."
                      className="font-body"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body">Value *</Label>
                    <Input
                      value={newContact.value}
                      onChange={(e) =>
                        setNewContact({ ...newContact, value: e.target.value })
                      }
                      placeholder="e.g. your@email.com, username..."
                      className="font-body"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body">
                      Link URL{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Input
                      value={newContact.href}
                      onChange={(e) =>
                        setNewContact({ ...newContact, href: e.target.value })
                      }
                      placeholder="e.g. mailto:you@email.com, https://..."
                      className="font-body"
                    />
                  </div>
                </div>
                <Button onClick={handleAddContact} className="font-body">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contact Link
                </Button>
              </CardContent>
            </Card>

            {/* Contact links list */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">
                  Contact Links ({contactLinks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contactLinks.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 font-body text-sm">
                    No contact links yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {contactLinks.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/40 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <ContactIcon
                            name={link.icon}
                            className="w-4 h-4 text-foreground"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-medium text-sm">
                            {link.label}
                          </p>
                          <p className="text-xs text-muted-foreground font-body truncate">
                            {link.value}
                          </p>
                          {link.href && (
                            <p className="text-xs text-muted-foreground/60 font-body truncate">
                              {link.href}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingContact({ ...link })}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteContact(link.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit contact dialog */}
      {editingContact && (
        <Dialog
          open={!!editingContact}
          onOpenChange={(open) => !open && setEditingContact(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">
                Edit Contact Link
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="font-body">Icon</Label>
                <Select
                  value={editingContact.icon}
                  onValueChange={(v) =>
                    setEditingContact({ ...editingContact, icon: v })
                  }
                >
                  <SelectTrigger className="font-body">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTACT_ICON_OPTIONS.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className="font-body"
                      >
                        <div className="flex items-center gap-2">
                          <ContactIcon name={opt.value} className="w-4 h-4" />
                          {opt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-body">Label *</Label>
                <Input
                  value={editingContact.label}
                  onChange={(e) =>
                    setEditingContact({
                      ...editingContact,
                      label: e.target.value,
                    })
                  }
                  className="font-body"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-body">Value *</Label>
                <Input
                  value={editingContact.value}
                  onChange={(e) =>
                    setEditingContact({
                      ...editingContact,
                      value: e.target.value,
                    })
                  }
                  className="font-body"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-body">
                  Link URL{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  value={editingContact.href || ""}
                  onChange={(e) =>
                    setEditingContact({
                      ...editingContact,
                      href: e.target.value || undefined,
                    })
                  }
                  placeholder="mailto:, https://..."
                  className="font-body"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setEditingContact(null)}
                className="font-body"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEditContact} className="font-body">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
