// API client functions for data operations
export interface Video {
  id: string;
  youtubeUrl: string;
  title?: string | null;
  subtitle?: string | null;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioItem {
  id: string;
  type: string;
  url: string;
  title?: string | null;
  description?: string | null;
  category?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactLink {
  id: string;
  icon: string;
  label: string;
  value: string;
  href?: string;
}

/** @deprecated Use ContactLink[] */
export type ContactInfo = ContactLink[];

/** Normalize old { email, discord } format → ContactLink[] */
export function normalizeContact(raw: any): ContactLink[] {
  if (Array.isArray(raw)) return raw as ContactLink[];
  const links: ContactLink[] = [];
  if (raw?.email) {
    links.push({
      id: "email",
      icon: "Mail",
      label: "Email",
      value: raw.email,
      href: `mailto:${raw.email}`,
    });
  }
  if (raw?.discord) {
    links.push({
      id: "discord",
      icon: "MessageCircle",
      label: "Discord",
      value: raw.discord,
    });
  }
  return links;
}

export interface SettingsData {
  aboutMe: string;
  portfolio: string;
  contact: ContactLink[];
}

// Videos
export async function getVideos(): Promise<Video[]> {
  const res = await fetch("/api/videos", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch videos");
  return res.json();
}

export async function createVideo(data: {
  youtubeUrl: string;
  title?: string;
  subtitle?: string;
  type?: string;
}): Promise<Video> {
  const res = await fetch("/api/videos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create video");
  return res.json();
}

export async function deleteVideo(id: string): Promise<void> {
  const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete video");
}

export async function updateVideo(
  id: string,
  data: {
    youtubeUrl?: string;
    title?: string | null;
    subtitle?: string | null;
  },
): Promise<Video> {
  const res = await fetch(`/api/videos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update video");
  return res.json();
}

// Portfolio Items
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const res = await fetch("/api/portfolio", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch portfolio items");
  return res.json();
}

export async function createPortfolioItem(data: {
  type: string;
  url: string;
  title?: string;
  description?: string;
  category?: string;
}): Promise<PortfolioItem> {
  const res = await fetch("/api/portfolio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create portfolio item");
  return res.json();
}

export async function updatePortfolioItem(
  id: string,
  data: Partial<Omit<PortfolioItem, "id" | "createdAt" | "updatedAt">>,
): Promise<PortfolioItem> {
  const res = await fetch(`/api/portfolio/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update portfolio item");
  return res.json();
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete portfolio item");
}

// Categories
export async function getCategories(): Promise<string[]> {
  const res = await fetch("/api/categories", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function createCategory(name: string): Promise<void> {
  const res = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create category");
  }
}

export async function deleteCategory(name: string): Promise<void> {
  const res = await fetch(`/api/categories/${encodeURIComponent(name)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete category");
}

// Settings
export async function getSettings(): Promise<SettingsData> {
  const res = await fetch("/api/settings", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch settings");
  const data = await res.json();
  return { ...data, contact: normalizeContact(data.contact) };
}

export async function updateSettings(key: string, value: any): Promise<void> {
  const res = await fetch("/api/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
  if (!res.ok) throw new Error("Failed to update settings");
}

// Helper for YouTube ID extraction
export function getYouTubeId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Upload an image to Cloudinary via the server route
export async function uploadPortfolioImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Failed to upload image");
  const data = await res.json();
  return data.url as string;
}
