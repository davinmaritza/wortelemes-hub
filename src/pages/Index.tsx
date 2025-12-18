import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import { getData, Video } from '@/lib/data';
import logo from '@/assets/logo.png';
import VideoSection from '@/components/VideoSection';
import Footer from '@/components/Footer';

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
  
  const hasVideos = videoList.length > 0;
  const hasPortfolio = portfolioList.length > 0;

  if (!hasEntered) {
    return <LoadingScreen onEnter={() => setHasEntered(true)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Logo and Nav */}
      <div className="flex flex-col items-center pt-16 pb-12">
        <img 
          src={logo} 
          alt="Wortelemes" 
          className="w-48 h-48 md:w-64 md:h-64 object-contain mb-8"
        />
        
        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm">
          <a href="#videos" className={`hover:underline ${!hasVideos ? 'hidden' : ''}`}>Videos</a>
          <a href="#portfolio" className={`hover:underline ${!hasPortfolio ? 'hidden' : ''}`}>Portfolio</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </nav>
      </div>

      {/* Content Sections - only show if has content */}
      {hasVideos && (
        <div className="bg-white py-16">
          <VideoSection videos={videoList} title="Videos" id="videos" />
        </div>
      )}
      
      {hasPortfolio && (
        <div className="bg-white py-16">
          <VideoSection videos={portfolioList} title="Portfolio" id="portfolio" />
        </div>
      )}

      {/* Contact Section */}
      <div id="contact" className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Contact</h2>
          <div className="space-y-2 text-gray-700 text-sm">
            <p>
              <a href="mailto:Feelsbrian@gmail.com" className="hover:underline">
                Feelsbrian@gmail.com
              </a>
            </p>
            <p>Discord: wortelemes</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
