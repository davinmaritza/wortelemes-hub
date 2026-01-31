import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getData, getYouTubeId, PortfolioItem } from '@/lib/data';
import { Play } from 'lucide-react';

const PortfolioVideoCard = ({ item }: { item: PortfolioItem }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = getYouTubeId(item.url);
  
  if (!videoId) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const fallbackThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  if (isPlaying) {
    return (
      <div className="aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={item.title || 'Portfolio video'}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div 
      className="aspect-video relative cursor-pointer group"
      onClick={() => setIsPlaying(true)}
    >
      <img 
        src={thumbnailUrl}
        alt={item.title || 'Video thumbnail'}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = fallbackThumbnail;
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play className="w-8 h-8 text-white fill-white ml-1" />
        </div>
      </div>
    </div>
  );
};

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState('');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    const data = getData();
    setPortfolio(data.portfolio);
    setPortfolioItems(data.portfolioItems);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <h1 className="font-display text-4xl md:text-5xl text-center text-foreground mb-8 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
          Portfolio
        </h1>
        
        <div className="max-w-2xl mx-auto mb-12 opacity-0 animate-fade-in-up delay-200" style={{ animationFillMode: 'forwards' }}>
          <p className="text-muted-foreground font-body leading-relaxed text-center whitespace-pre-line">
            {portfolio}
          </p>
        </div>

        {portfolioItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {portfolioItems.map((item, index) => (
              <div 
                key={item.id} 
                className="opacity-0 animate-fade-in-up rounded-lg overflow-hidden bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
                style={{ animationFillMode: 'forwards', animationDelay: `${300 + index * 100}ms` }}
              >
                {item.type === 'image' ? (
                  <div className="aspect-video">
                    <img 
                      src={item.url} 
                      alt={item.title || 'Portfolio image'} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <PortfolioVideoCard item={item} />
                )}
                {(item.title || item.description) && (
                  <div className="p-4">
                    {item.title && (
                      <h3 className="font-display text-lg text-foreground mb-1">{item.title}</h3>
                    )}
                    {item.description && (
                      <p className="text-sm text-muted-foreground font-body">{item.description}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Portfolio;