"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VideoCard from "@/components/VideoCard";
import VideoPlayer from "@/components/VideoPlayer";
import { getVideos, Video } from "@/lib/api-client";
import { Play } from "lucide-react";

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getVideos()
      .then((data) => {
        setVideos(data.filter((v) => v.type === "video"));
      })
      .catch((error) => {
        console.error("Error loading videos:", error);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const activeVideo = videos.find((v) => v.id === activeVideoId);

  const handleVideoClick = (videoId: string) => {
    setActiveVideoId(videoId);
  };

  const handleClose = () => {
    setActiveVideoId(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-16">
        {/* Page header */}
        <div
          className="text-center mb-12 opacity-0 animate-fade-in-up"
          style={{ animationFillMode: "forwards" }}
        >
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-3">
            Videos
          </h1>
          {!isLoading && videos.length > 0 && (
            <p className="text-muted-foreground font-body text-sm">
              {videos.length} {videos.length === 1 ? "video" : "videos"}
            </p>
          )}
        </div>

        {isLoading ? (
          /* Skeleton */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-video bg-muted rounded-lg animate-pulse" />
                <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
              </div>
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-0 animate-fade-in-up"
            style={{ animationFillMode: "forwards", animationDelay: "100ms" }}
          >
            {videos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                index={index}
                isActive={activeVideoId === video.id}
                onVideoClick={handleVideoClick}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div
            className="flex flex-col items-center justify-center py-24 gap-4 opacity-0 animate-fade-in"
            style={{ animationFillMode: "forwards" }}
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Play className="w-7 h-7 text-muted-foreground ml-1" />
            </div>
            <p className="text-muted-foreground font-body text-center">
              No videos yet. Check back soon!
            </p>
          </div>
        )}
      </main>

      <Footer />

      {activeVideo && <VideoPlayer video={activeVideo} onClose={handleClose} />}
    </div>
  );
}
