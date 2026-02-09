"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VideoCard from "@/components/VideoCard";
import VideoPlayer from "@/components/VideoPlayer";
import { getVideos, Video } from "@/lib/api-client";

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useEffect(() => {
    getVideos()
      .then((data) => {
        setVideos(data.filter((v) => v.type === "video"));
      })
      .catch((error) => {
        console.error("Error loading videos:", error);
      });
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
        <h1
          className="font-display text-4xl md:text-5xl text-center text-foreground mb-12 opacity-0 animate-fade-in-up"
          style={{ animationFillMode: "forwards" }}
        >
          Videos
        </h1>

        {videos.length > 0 ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-0 animate-fade-in-up delay-200"
            style={{ animationFillMode: "forwards" }}
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
          <p
            className="text-center text-muted-foreground font-body opacity-0 animate-fade-in"
            style={{ animationFillMode: "forwards" }}
          >
            No videos yet. Check back soon!
          </p>
        )}
      </main>

      <Footer />

      {activeVideo && <VideoPlayer video={activeVideo} onClose={handleClose} />}
    </div>
  );
}
