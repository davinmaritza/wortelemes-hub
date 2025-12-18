import { X } from 'lucide-react';
import { getYouTubeId, Video } from '@/lib/data';

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
}

const VideoPlayer = ({ video, onClose }: VideoPlayerProps) => {
  const videoId = getYouTubeId(video.youtubeUrl);

  if (!videoId) return null;

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 bg-muted hover:bg-muted/80 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
        <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={video.title || 'Video'}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {video.title && (
          <div className="mt-4 text-center">
            <h3 className="text-foreground font-display text-xl">{video.title}</h3>
            {video.subtitle && <p className="text-muted-foreground font-body text-sm mt-1">{video.subtitle}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
