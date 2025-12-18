import { useState } from 'react';
import logo from '@/assets/logo.png';

interface LoadingScreenProps {
  onEnter: () => void;
}

const LoadingScreen = ({ onEnter }: LoadingScreenProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <button
        onClick={onEnter}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="transition-all duration-300 hover:scale-110 focus:outline-none"
      >
        <img 
          src={logo} 
          alt="Wortelemes Logo" 
          className={`w-48 h-48 md:w-64 md:h-64 object-contain transition-all duration-300 ${isHovered ? 'drop-shadow-lg' : ''}`}
        />
      </button>
      <p className="mt-6 text-gray-400 text-sm animate-pulse">Click to enter</p>
    </div>
  );
};

export default LoadingScreen;
