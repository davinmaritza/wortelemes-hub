import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import { getData, Video } from '@/lib/data';
import logo from '@/assets/logo.png';
import Header from '@/components/Header';
import VideoCard from '@/components/VideoCard';
import Footer from '@/components/Footer';

const Index = () => {
  const [hasEntered, setHasEntered] = useState(() => {
    // Skip loading if user already visited the site in this session
    return sessionStorage.getItem('site_entered') === 'true';
  });
  const [videos, setVideos] = useState<Video[]>([]);
  const [aboutMe, setAboutMe] = useState('');

  useEffect(() => {
    const data = getData();
    setVideos(data.videos.filter(v => v.type === 'video'));
    setAboutMe(data.aboutMe);
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem('site_entered', 'true');
    setHasEntered(true);
  };

  if (!hasEntered) {
    return <LoadingScreen onEnter={handleEnter} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Logo */}
      <div className="flex justify-center pt-16 pb-8">
        <img 
          src={logo} 
          alt="Wortelemes" 
          className="w-40 h-40 md:w-56 md:h-56 object-contain animate-scale-in animate-float"
        />
      </div>
      
      {/* Header Navigation */}
      <Header />

      {/* About Section */}
      <section className="py-12 opacity-0 animate-fade-in-up delay-300" style={{ animationFillMode: 'forwards' }}>
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <p className="text-muted-foreground font-body leading-relaxed">{aboutMe}</p>
        </div>
      </section>

      {/* Videos Section */}
      {videos.length > 0 && (
        <section className="py-12 opacity-0 animate-fade-in-up delay-400" style={{ animationFillMode: 'forwards' }}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <VideoCard key={video.id} video={video} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Index;
