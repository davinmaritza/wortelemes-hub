"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { getYouTubeId, Video } from "@/lib/api-client";

export interface VideoCardProps {
  video: Video;
  index?: number;
  isActive?: boolean;
  onVideoClick?: (videoId: string) => void;
}

const VideoCard = ({
  video,
  index = 0,
  isActive = false,
  onVideoClick,
}: VideoCardProps) => {
  const { youtubeUrl, title, subtitle } = video;
  const videoId = getYouTubeId(youtubeUrl);

  // hqdefault.jpg is guaranteed to exist for all valid YouTube videos.
  // maxresdefault.jpg returns a gray 120x90 placeholder (not a 404) when
  // the video isn't HD, so the onError handler never fires.
  const [thumbnailSrc, setThumbnailSrc] = useState(
    videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "",
  );

  const handleClick = () => {
    onVideoClick?.(video.id);
  };

  return (
    <div
      className="group relative opacity-0 animate-fade-in-up"
      style={{
        animationFillMode: "forwards",
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div
        className="relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
        onClick={handleClick}
      >
        {thumbnailSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={thumbnailSrc}
            alt={title || "Video thumbnail"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => {
              // Ultimate fallback: frame 0, always available
              if (videoId) {
                setThumbnailSrc(`https://img.youtube.com/vi/${videoId}/0.jpg`);
              }
            }}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Play className="w-10 h-10 text-muted-foreground" />
          </div>
        )}

        {/* Dark gradient overlay (always visible at bottom for text legibility) */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        {/* Hover / active play overlay */}
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 ${
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform transition-transform duration-200 group-hover:scale-110">
            <Play className="w-7 h-7 text-black ml-1" fill="black" />
          </div>
        </div>

        {/* Active indicator */}
        {isActive && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/90 text-black text-xs font-body font-medium">
            Playing
          </div>
        )}
      </div>

      {(title || subtitle) && (
        <div className="mt-3 space-y-0.5">
          {title && (
            <h3 className="text-foreground font-body font-medium text-sm leading-snug line-clamp-2">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-muted-foreground font-body text-xs line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoCard;
