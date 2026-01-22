import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getData, getYouTubeId, PortfolioItem } from '@/lib/data';

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
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeId(item.url)}`}
                      title={item.title || 'Portfolio video'}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
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