import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import VideoSection from '@/components/VideoSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { getData, Video } from '@/lib/data';

const Index = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [aboutMe, setAboutMe] = useState('');

  useEffect(() => {
    const data = getData();
    setVideos(data.videos);
    setAboutMe(data.aboutMe);
  }, []);

  const videoList = videos.filter(v => v.type === 'video');
  const portfolioList = videos.filter(v => v.type === 'portfolio');

  if (!hasEntered) {
    return <LoadingScreen onEnter={() => setHasEntered(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <VideoSection videos={videoList} title="Videos" id="videos" />
      <VideoSection videos={portfolioList} title="Portfolio" id="portfolio" />
      <ContactSection aboutMe={aboutMe} />
      <Footer />
    </div>
  );
};

export default Index;
