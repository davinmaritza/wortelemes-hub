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
        className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
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
              className="absolute top-2 right-2 bg-white/80 p-1 rounded-full hover:bg-white transition-colors"
            >
              <X className="w-4 h-4 text-gray-800" />
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
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                <Play className="w-6 h-6 text-gray-800 ml-1" />
              </div>
            </div>
          </>
        )}
      </div>
      <div className="mt-3 text-center">
        <h3 className="text-gray-800 font-medium text-sm">{title}</h3>
        {subtitle && <p className="text-gray-500 text-xs">{subtitle}</p>}
      </div>
    </div>
  );
};

export default VideoCard;
