"use client";

import Image from "next/image";
import { useState } from "react";

interface LoadingScreenProps {
  onEnter: () => void;
}

const LoadingScreen = ({ onEnter }: LoadingScreenProps) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      onEnter();
    }, 500);
  };

  return (
    <div
      className={`fixed inset-0 bg-background flex flex-col items-center justify-center z-50 transition-opacity duration-500 ${
        isClicked ? "opacity-0" : "opacity-100"
      }`}
    >
      <button
        onClick={handleClick}
        className="transition-all duration-300 hover:scale-110 focus:outline-none group"
      >
        <Image
          src="/logo.png"
          alt="Wortelemes Logo"
          width={256}
          height={256}
          className="w-48 h-48 md:w-64 md:h-64 object-contain transition-all duration-500 group-hover:drop-shadow-lg animate-float"
          priority
        />
      </button>
      <p className="mt-8 text-muted-foreground text-sm animate-pulse">
        Click to enter
      </p>
    </div>
  );
};

export default LoadingScreen;
