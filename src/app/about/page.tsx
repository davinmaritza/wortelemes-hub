"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/api-client";

export default function AboutPage() {
  const [aboutMe, setAboutMe] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSettings()
      .then((settings) => {
        setAboutMe(settings.aboutMe);
      })
      .catch((error) => {
        console.error("Error loading settings:", error);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-16">
        <h1
          className="font-display text-4xl md:text-5xl text-center text-foreground mb-12 opacity-0 animate-fade-in-up"
          style={{ animationFillMode: "forwards" }}
        >
          About Me
        </h1>

        <div
          className="max-w-2xl mx-auto text-center opacity-0 animate-fade-in-up delay-200"
          style={{ animationFillMode: "forwards" }}
        >
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded animate-pulse w-3/4 mx-auto" />
              <div className="h-4 bg-muted rounded animate-pulse w-full" />
              <div className="h-4 bg-muted rounded animate-pulse w-5/6 mx-auto" />
              <div className="h-4 bg-muted rounded animate-pulse w-2/3 mx-auto" />
              <div className="h-4 bg-muted rounded animate-pulse w-full" />
              <div className="h-4 bg-muted rounded animate-pulse w-4/5 mx-auto" />
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none font-body text-muted-foreground [&_*]:mx-auto">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {aboutMe}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
