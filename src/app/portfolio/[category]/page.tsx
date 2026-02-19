"use client";

import { use, useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PortfolioSubNav from "@/components/PortfolioSubNav";
import { PortfolioItemCard } from "@/components/PortfolioItemCard";
import { getPortfolioItems, PortfolioItem } from "@/lib/api-client";

export default function PortfolioCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPortfolioItems()
      .then((all) => setItems(all.filter((item) => item.category === category)))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [category]);

  const title = category.replace(/([A-Z])/g, " $1").trim();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1
          className="font-display text-4xl md:text-5xl text-center text-foreground mb-4 opacity-0 animate-fade-in-up"
          style={{ animationFillMode: "forwards" }}
        >
          Portfolio
        </h1>

        <PortfolioSubNav />

        <div className="mt-8">
          <h2
            className="font-display text-2xl md:text-3xl text-center text-foreground mb-6 opacity-0 animate-fade-in-up"
            style={{ animationFillMode: "forwards", animationDelay: "100ms" }}
          >
            {title}
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-video bg-muted rounded-lg animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {items.map((item, index) => (
                <PortfolioItemCard key={item.id} item={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-24">
              <p className="text-muted-foreground font-body text-sm">
                No items in this category yet.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
