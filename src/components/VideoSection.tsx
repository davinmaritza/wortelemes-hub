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

  if (videos.length === 0) {
    return (
      <section id={id} className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">{title}</h2>
          <p className="text-muted-foreground text-center">No content yet. Check back soon!</p>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-10 text-center">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              youtubeUrl={video.youtubeUrl}
              title={video.title}
              subtitle={video.subtitle}
              isActive={activeVideoId === video.id}
              onToggle={() => handleToggle(video.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
