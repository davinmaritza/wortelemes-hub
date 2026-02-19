"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { PortfolioItem, getYouTubeId } from "@/lib/api-client";

function VideoItem({ item }: { item: PortfolioItem }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = getYouTubeId(item.url);

  if (!videoId) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  if (isPlaying) {
    return (
      <div className="aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={item.title || "Portfolio video"}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div
      className="aspect-video relative cursor-pointer group"
      onClick={() => setIsPlaying(true)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnailUrl}
        alt={item.title || "Video thumbnail"}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/0.jpg`;
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play className="w-8 h-8 text-white fill-white ml-1" />
        </div>
      </div>
    </div>
  );
}

interface PortfolioItemCardProps {
  item: PortfolioItem;
  index?: number;
}

export function PortfolioItemCard({ item, index = 0 }: PortfolioItemCardProps) {
  return (
    <div
      className="opacity-0 animate-fade-in-up rounded-lg overflow-hidden bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
      style={{
        animationFillMode: "forwards",
        animationDelay: `${300 + index * 100}ms`,
      }}
    >
      {item.type === "image" ? (
        <div className="aspect-video">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.url}
            alt={item.title || "Portfolio image"}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <VideoItem item={item} />
      )}

      {(item.title || item.description) && (
        <div className="p-4">
          {item.title && (
            <h3 className="font-display text-lg text-foreground mb-1">
              {item.title}
            </h3>
          )}
          {item.description && (
            <p className="text-sm text-muted-foreground font-body">
              {item.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
