import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PortfolioSubNav from '@/components/PortfolioSubNav';

const categoryTitles: Record<string, string> = {
  'VideoCommish': 'Video Commission',
  'GTACommish': 'GTA Commission',
  'Vehicle': 'GTA Commission - Vehicle',
  'Outfits': 'GTA Commission - Outfits',
};

const categoryDescriptions: Record<string, string> = {
  'VideoCommish': 'Custom video editing and production commissions.',
  'GTACommish': 'GTA V related commission works.',
  'Vehicle': 'Custom vehicle modifications and showcases.',
  'Outfits': 'Custom character outfits and styling.',
};

const PortfolioCategory = () => {
  const { category, subcategory } = useParams();
  
  const currentCategory = subcategory || category || '';
  const title = categoryTitles[currentCategory] || 'Portfolio';
  const description = categoryDescriptions[currentCategory] || '';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="font-display text-4xl md:text-5xl text-center text-foreground mb-4 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
          Portfolio
        </h1>
        
        <PortfolioSubNav />
        
        <div className="mt-8">
          <h2 className="font-display text-2xl md:text-3xl text-center text-foreground mb-4 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards', animationDelay: '100ms' }}>
            {title}
          </h2>
          
          {description && (
            <p className="text-muted-foreground font-body text-center max-w-2xl mx-auto mb-8 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards', animationDelay: '200ms' }}>
              {description}
            </p>
          )}
          
          {/* Portfolio items grid - placeholder for now */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards', animationDelay: '300ms' }}>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground text-sm">No items yet</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PortfolioCategory;
