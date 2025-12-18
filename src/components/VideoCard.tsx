import { Play } from 'lucide-react';
import { getYouTubeId, Video } from '@/lib/data';

export interface VideoCardProps {
  video: Video;
  index?: number;
  isActive?: boolean;
  onVideoClick?: (videoId: string) => void;
}

const VideoCard = ({ video, index = 0, isActive = false, onVideoClick }: VideoCardProps) => {
  const { youtubeUrl, title, subtitle } = video;
  const videoId = getYouTubeId(youtubeUrl);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';

  const handleClick = () => {
    onVideoClick?.(video.id);
  };

  return (
    <div 
      className="group relative opacity-0 animate-fade-in-up"
      style={{ animationFillMode: 'forwards', animationDelay: `${index * 100}ms` }}
    >
      <div 
        className="relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
        onClick={handleClick}
      >
        <img 
          src={thumbnailUrl} 
          alt={title || 'Video thumbnail'}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }}
        />
        <div className={`absolute inset-0 bg-foreground/30 flex items-center justify-center transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center">
            <Play className="w-6 h-6 text-foreground ml-1" />
          </div>
        </div>
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
