export interface Video {
  id: string;
  youtubeUrl: string;
  title?: string;
  subtitle?: string;
  type: 'video' | 'portfolio';
}

export interface PortfolioItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title?: string;
  description?: string;
}

export interface ContactInfo {
  email: string;
  discord: string;
}

export interface SiteData {
  videos: Video[];
  aboutMe: string;
  portfolio: string;
  portfolioItems: PortfolioItem[];
  contact: ContactInfo;
}

const DEFAULT_DATA: SiteData = {
  videos: [],
  aboutMe: "Welcome to my portfolio. I create amazing video content and designs.",
  portfolio: "Here are some of my best works and projects.",
  portfolioItems: [],
  contact: {
    email: "Feelsbrian@gmail.com",
    discord: "wortelemes"
  }
};

export const AUTH_CREDENTIALS = {
  username: "bukanfebrian",
  password: "Pebrihome.,"
};

export const getData = (): SiteData => {
  const stored = localStorage.getItem('wortelemes_data');
  if (stored) {
    const data = JSON.parse(stored);
    // Ensure contact and portfolio exists for backwards compatibility
    if (!data.contact) {
      data.contact = DEFAULT_DATA.contact;
    }
    if (!data.portfolio) {
      data.portfolio = DEFAULT_DATA.portfolio;
    }
    if (!data.portfolioItems) {
      data.portfolioItems = DEFAULT_DATA.portfolioItems;
    }
    return data;
  }
  return DEFAULT_DATA;
};

export const saveData = (data: SiteData): void => {
  localStorage.setItem('wortelemes_data', JSON.stringify(data));
};

export const addVideo = (video: Omit<Video, 'id'>): void => {
  const data = getData();
  const newVideo: Video = {
    ...video,
    id: Date.now().toString()
  };
  data.videos.push(newVideo);
  saveData(data);
};

export const deleteVideo = (id: string): void => {
  const data = getData();
  data.videos = data.videos.filter(v => v.id !== id);
  saveData(data);
};

export const updateAboutMe = (text: string): void => {
  const data = getData();
  data.aboutMe = text;
  saveData(data);
};

export const updatePortfolio = (text: string): void => {
  const data = getData();
  data.portfolio = text;
  saveData(data);
};

export const addPortfolioItem = (item: Omit<PortfolioItem, 'id'>): void => {
  const data = getData();
  const newItem: PortfolioItem = {
    ...item,
    id: Date.now().toString()
  };
  data.portfolioItems.push(newItem);
  saveData(data);
};

export const deletePortfolioItem = (id: string): void => {
  const data = getData();
  data.portfolioItems = data.portfolioItems.filter(p => p.id !== id);
  saveData(data);
};

export const updatePortfolioItem = (id: string, updates: Partial<Omit<PortfolioItem, 'id'>>): void => {
  const data = getData();
  data.portfolioItems = data.portfolioItems.map(item => 
    item.id === id ? { ...item, ...updates } : item
  );
  saveData(data);
};

export const updateContact = (contact: ContactInfo): void => {
  const data = getData();
  data.contact = contact;
  saveData(data);
};

export const getYouTubeId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const isLoggedIn = (): boolean => {
  return sessionStorage.getItem('admin_logged_in') === 'true';
};

export const login = (username: string, password: string): boolean => {
  if (username === AUTH_CREDENTIALS.username && password === AUTH_CREDENTIALS.password) {
    sessionStorage.setItem('admin_logged_in', 'true');
    return true;
  }
  return false;
};

export const logout = (): void => {
  sessionStorage.removeItem('admin_logged_in');
};
