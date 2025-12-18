import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VideoCard from '@/components/VideoCard';
import { getData, Video } from '@/lib/data';

const Portfolio = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const data = getData();
    setVideos(data.videos.filter(v => v.type === 'portfolio'));
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <h1 className="font-display text-4xl md:text-5xl text-center text-foreground mb-12 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
          Portfolio
        </h1>
        
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-0 animate-fade-in-up delay-200" style={{ animationFillMode: 'forwards' }}>
            {videos.map((video, index) => (
              <VideoCard key={video.id} video={video} index={index} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground font-body opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
            No portfolio items yet. Check back soon!
          </p>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Portfolio;
