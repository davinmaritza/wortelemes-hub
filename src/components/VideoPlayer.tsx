"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { getYouTubeId, Video } from "@/lib/api-client";

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
}

const VideoPlayer = ({ video, onClose }: VideoPlayerProps) => {
  const videoId = getYouTubeId(video.youtubeUrl);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!videoId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop with smooth fade */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-md transition-all duration-500 ease-out" />

      {/* Content with spring animation */}
      <div
        className="relative w-full max-w-3xl transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] animate-[slideUp_0.5s_ease-out]"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute -top-14 right-0 bg-muted/50 hover:bg-muted p-3 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-90"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
        <div className="aspect-video rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-foreground/10">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={video.title || "Video"}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {video.title && (
          <div className="mt-6 text-center opacity-0 animate-[fadeInUp_0.6s_ease-out_0.3s_forwards]">
            <h3 className="text-foreground font-display text-2xl">
              {video.title}
            </h3>
            {video.subtitle && (
              <p className="text-muted-foreground font-body text-sm mt-2">
                {video.subtitle}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
