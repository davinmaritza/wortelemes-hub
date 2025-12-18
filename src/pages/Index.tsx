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
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const data = getData();
    setVideos(data.videos);
    setAboutMe(data.aboutMe);
  }, []);

  const videoList = videos.filter(v => v.type === 'video');
  const portfolioList = videos.filter(v => v.type === 'portfolio');
  
  const hasVideos = videoList.length > 0;
  const hasPortfolio = portfolioList.length > 0;

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!hasEntered) {
    return <LoadingScreen onEnter={() => setHasEntered(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Logo and Nav */}
      <div className="flex flex-col items-center pt-16 pb-12">
        <img 
          src={logo} 
          alt="Wortelemes" 
          className="w-48 h-48 md:w-64 md:h-64 object-contain mb-10 animate-scale-in animate-float"
        />
        
        {/* Navigation */}
        <nav className="flex items-center gap-8 text-sm opacity-0 animate-fade-in-up delay-300" style={{ animationFillMode: 'forwards' }}>
          <button 
            onClick={() => scrollToSection('about')}
            className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection('videos')}
            className={`nav-link ${activeSection === 'videos' ? 'active' : ''}`}
          >
            Videos
          </button>
          <button 
            onClick={() => scrollToSection('portfolio')}
            className={`nav-link ${activeSection === 'portfolio' ? 'active' : ''}`}
          >
            Portfolio
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
          >
            Contact
          </button>
        </nav>
      </div>

      {/* About Section */}
      <div id="about" className="py-16 opacity-0 animate-fade-in-up delay-400" style={{ animationFillMode: 'forwards' }}>
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-lg font-semibold text-foreground mb-6 uppercase tracking-wider">Welcome</h2>
          <p className="text-muted-foreground leading-relaxed">{aboutMe}</p>
        </div>
      </div>

      {/* Videos Section */}
      <div id="videos" className="py-16">
        {hasVideos ? (
          <VideoSection videos={videoList} title="Videos" id="videos-content" />
        ) : (
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-lg font-semibold text-foreground mb-6 uppercase tracking-wider">Videos</h2>
            <p className="text-muted-foreground text-sm">Coming soon...</p>
          </div>
        )}
      </div>
      
      {/* Portfolio Section */}
      <div id="portfolio" className="py-16">
        {hasPortfolio ? (
          <VideoSection videos={portfolioList} title="Portfolio" id="portfolio-content" />
        ) : (
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-lg font-semibold text-foreground mb-6 uppercase tracking-wider">Portfolio</h2>
            <p className="text-muted-foreground text-sm">Coming soon...</p>
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-lg font-semibold text-foreground mb-8 uppercase tracking-wider">Contact</h2>
          <div className="space-y-3 text-sm">
            <p>
              <a 
                href="mailto:Feelsbrian@gmail.com" 
                className="nav-link text-muted-foreground hover:text-foreground transition-colors"
              >
                Feelsbrian@gmail.com
              </a>
            </p>
            <p className="text-muted-foreground">
              Discord: <span className="text-foreground">wortelemes</span>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
