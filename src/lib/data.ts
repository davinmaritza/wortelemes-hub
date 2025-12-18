export interface Video {
  id: string;
  youtubeUrl: string;
  title: string;
  subtitle?: string;
  type: 'video' | 'portfolio';
}

export interface SiteData {
  videos: Video[];
  aboutMe: string;
}

const DEFAULT_DATA: SiteData = {
  videos: [],
  aboutMe: "Welcome to my portfolio. I create amazing video content and designs."
};

export const AUTH_CREDENTIALS = {
  username: "Wortelemes",
  password: "%0|F?H@f!berhO3e"
};

export const getData = (): SiteData => {
  const stored = localStorage.getItem('wortelemes_data');
  if (stored) {
    return JSON.parse(stored);
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
