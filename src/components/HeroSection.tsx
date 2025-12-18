import logo from '@/assets/logo.png';

const HeroSection = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center pt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />
      <div className="relative z-10 text-center">
        <img 
          src={logo} 
          alt="Wortelemes" 
          className="w-32 h-32 md:w-48 md:h-48 mx-auto mb-8 animate-pulse"
        />
        <p className="text-muted-foreground text-lg mb-2">Portfolio of</p>
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">Wortelemes</h1>
      </div>
    </section>
  );
};

export default HeroSection;
