import VideoCard from './VideoCard';
import { Video } from '@/lib/data';

interface VideoSectionProps {
  videos: Video[];
  title: string;
  id: string;
}

const VideoSection = ({ videos, title, id }: VideoSectionProps) => {
  if (videos.length === 0) return null;

  return (
    <section id={id}>
      <div className="container mx-auto px-4">
        <h2 className="font-display text-2xl text-foreground mb-10 text-center tracking-wider">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <VideoCard key={video.id} video={video} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
