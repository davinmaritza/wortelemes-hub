import { useState } from 'react';
import VideoCard from './VideoCard';
import { Video } from '@/lib/data';

interface VideoSectionProps {
  videos: Video[];
  title: string;
  id: string;
}

const VideoSection = ({ videos, title, id }: VideoSectionProps) => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const handleToggle = (videoId: string) => {
    setActiveVideoId(prev => prev === videoId ? null : videoId);
  };

  if (videos.length === 0) return null;

  return (
    <section id={id}>
      <div className="container mx-auto px-4">
        <h2 className="text-lg font-semibold text-foreground mb-10 text-center uppercase tracking-wider">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <div 
              key={video.id} 
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <VideoCard
                youtubeUrl={video.youtubeUrl}
                title={video.title}
                subtitle={video.subtitle}
                isActive={activeVideoId === video.id}
                onToggle={() => handleToggle(video.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
