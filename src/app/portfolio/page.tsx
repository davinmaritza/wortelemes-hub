"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PortfolioSubNav from "@/components/PortfolioSubNav";
import { PortfolioItemCard } from "@/components/PortfolioItemCard";
import {
  getPortfolioItems,
  getSettings,
  PortfolioItem,
} from "@/lib/api-client";
import { ImageIcon } from "lucide-react";

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState("");
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSettings(), getPortfolioItems()])
      .then(([settings, items]) => {
        setPortfolio(settings.portfolio);
        setPortfolioItems(items);
      })
      .catch((error) => {
        console.error("Error loading portfolio:", error);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Title */}
        <div
          className="text-center mb-4 opacity-0 animate-fade-in-up"
          style={{ animationFillMode: "forwards" }}
        >
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-3">
            Portfolio
          </h1>
          {!isLoading && portfolioItems.length > 0 && (
            <p className="text-muted-foreground font-body text-sm">
              {portfolioItems.length}{" "}
              {portfolioItems.length === 1 ? "item" : "items"}
            </p>
          )}
        </div>

        {/* Description skeleton / content */}
        <div
          className="max-w-2xl mx-auto mb-6 opacity-0 animate-fade-in-up"
          style={{ animationFillMode: "forwards", animationDelay: "100ms" }}
        >
          {isLoading ? (
            <div className="space-y-2.5">
              <div className="h-3.5 bg-muted rounded animate-pulse w-4/5 mx-auto" />
              <div className="h-3.5 bg-muted rounded animate-pulse w-full mx-auto" />
              <div className="h-3.5 bg-muted rounded animate-pulse w-2/3 mx-auto" />
            </div>
          ) : portfolio ? (
            <div className="text-center prose prose-sm dark:prose-invert max-w-none font-body text-muted-foreground [&_*]:mx-auto">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {portfolio}
              </ReactMarkdown>
            </div>
          ) : null}
        </div>

        <PortfolioSubNav />

        {/* Items grid */}
        <div className="mt-8 max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg overflow-hidden bg-card border border-border"
                >
                  <div className="aspect-video bg-muted animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-muted rounded animate-pulse w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : portfolioItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioItems.map((item, index) => (
                <PortfolioItemCard key={item.id} item={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <ImageIcon className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-body text-center text-sm">
                No portfolio items yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
