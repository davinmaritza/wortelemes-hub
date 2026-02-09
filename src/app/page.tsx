"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import LoadingScreen from "@/components/LoadingScreen";
import { getData, Video } from "@/lib/data";
import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import VideoPlayer from "@/components/VideoPlayer";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [aboutMe, setAboutMe] = useState("");
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useEffect(() => {
    // Hydrate state from sessionStorage and mark as hydrated
    const entered = sessionStorage.getItem("site_entered") === "true";
    setHasEntered(entered);
    setIsHydrated(true);

    // Load data
    const data = getData();
    setVideos(data.videos.filter((v) => v.type === "video"));
    setAboutMe(data.aboutMe);
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem("site_entered", "true");
    setHasEntered(true);
  };

  const activeVideo = videos.find((v) => v.id === activeVideoId);

  // Prevent hydration mismatch by only rendering interactive content after hydration
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        {/* Placeholder during hydration */}
      </div>
    );
  }

  if (!hasEntered) {
    return <LoadingScreen onEnter={handleEnter} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Logo */}
      <div className="flex justify-center pt-16 pb-8">
        <Image
          src="/logo.png"
          alt="Wortelemes"
          width={224}
          height={224}
          className="w-40 h-40 md:w-56 md:h-56 object-contain animate-scale-in animate-float"
          priority
        />
      </div>

      {/* Header Navigation */}
      <Header />

      {/* About Section */}
      <section
        className="py-12 opacity-0 animate-fade-in-up delay-300"
        style={{ animationFillMode: "forwards" }}
      >
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <p className="text-muted-foreground font-body leading-relaxed">
            {aboutMe}
          </p>
        </div>
      </section>

      {/* Videos Section */}
      {videos.length > 0 && (
        <section
          className="py-12 opacity-0 animate-fade-in-up delay-400"
          style={{ animationFillMode: "forwards" }}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  index={index}
                  isActive={activeVideoId === video.id}
                  onVideoClick={(id) => setActiveVideoId(id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

      {activeVideo && (
        <VideoPlayer
          video={activeVideo}
          onClose={() => setActiveVideoId(null)}
        />
      )}
    </div>
  );
}
