import { useState } from 'react';
import logo from '@/assets/logo.png';

interface LoadingScreenProps {
  onEnter: () => void;
}

const LoadingScreen = ({ onEnter }: LoadingScreenProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <button
        onClick={onEnter}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="transition-all duration-300 hover:scale-110 focus:outline-none"
      >
        <img 
          src={logo} 
          alt="Wortelemes Logo" 
          className={`w-40 h-40 md:w-56 md:h-56 object-contain transition-all duration-300 ${isHovered ? 'drop-shadow-[0_0_30px_hsl(var(--primary))]' : ''}`}
        />
      </button>
      <p className="mt-6 text-muted-foreground text-sm animate-pulse">Click to enter</p>
    </div>
  );
};

export default LoadingScreen;
