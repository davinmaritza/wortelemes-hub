import { useState } from 'react';
import { Play, X } from 'lucide-react';
import { getYouTubeId, Video } from '@/lib/data';

export interface VideoCardProps {
  video: Video;
  index?: number;
}

const VideoCard = ({ video, index = 0 }: VideoCardProps) => {
  const [isActive, setIsActive] = useState(false);
  const { youtubeUrl, title, subtitle } = video;
  const videoId = getYouTubeId(youtubeUrl);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';

  return (
    <div 
      className="group relative opacity-0 animate-fade-in-up"
      style={{ animationFillMode: 'forwards', animationDelay: `${index * 100}ms` }}
    >
      <div 
        className="relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
        onClick={() => setIsActive(!isActive)}
      >
        {isActive && videoId ? (
          <div className="relative w-full h-full">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={title || 'Video'}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button 
              onClick={(e) => { e.stopPropagation(); setIsActive(false); }}
              className="absolute top-2 right-2 bg-background/80 p-1 rounded-full hover:bg-background transition-colors"
            >
              <X className="w-4 h-4 text-foreground" />
            </button>
          </div>
        ) : (
          <>
            <img 
              src={thumbnailUrl} 
              alt={title || 'Video thumbnail'}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center">
                <Play className="w-6 h-6 text-foreground ml-1" />
              </div>
            </div>
          </>
        )}
      </div>
      {(title || subtitle) && (
        <div className="mt-3 text-center">
          {title && <h3 className="text-foreground font-body font-medium text-sm">{title}</h3>}
          {subtitle && <p className="text-muted-foreground font-body text-xs">{subtitle}</p>}
        </div>
      )}
    </div>
  );
};

export default VideoCard;
