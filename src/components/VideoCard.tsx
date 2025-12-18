import { useState } from 'react';
import { Play, X } from 'lucide-react';
import { getYouTubeId } from '@/lib/data';

interface VideoCardProps {
  youtubeUrl: string;
  title: string;
  subtitle?: string;
  isActive: boolean;
  onToggle: () => void;
}

const VideoCard = ({ youtubeUrl, title, subtitle, isActive, onToggle }: VideoCardProps) => {
  const videoId = getYouTubeId(youtubeUrl);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';

  return (
    <div className="group relative">
      <div 
        className="relative aspect-video bg-card rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-primary"
        onClick={onToggle}
      >
        {isActive && videoId ? (
          <div className="relative w-full h-full">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button 
              onClick={(e) => { e.stopPropagation(); onToggle(); }}
              className="absolute top-2 right-2 bg-background/80 p-1 rounded-full hover:bg-background transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <img 
              src={thumbnailUrl} 
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-background/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <Play className="w-8 h-8 text-primary-foreground ml-1" />
              </div>
            </div>
          </>
        )}
      </div>
      <div className="mt-3">
        <h3 className="text-foreground font-medium">{title}</h3>
        {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
      </div>
    </div>
  );
};

export default VideoCard;
