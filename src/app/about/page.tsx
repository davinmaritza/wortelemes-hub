"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/api-client";

export default function AboutPage() {
  const [aboutMe, setAboutMe] = useState("");

  useEffect(() => {
    getSettings()
      .then((settings) => {
        setAboutMe(settings.aboutMe);
      })
      .catch((error) => {
        console.error("Error loading settings:", error);
      });
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
          <p className="text-muted-foreground font-body leading-relaxed text-lg">
            {aboutMe}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
