"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getData, ContactInfo } from "@/lib/data";

export default function ContactPage() {
  const [contact, setContact] = useState<ContactInfo>({
    email: "",
    discord: "",
  });

  useEffect(() => {
    const data = getData();
    setContact(data.contact);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-16">
        <h1
          className="font-display text-4xl md:text-5xl text-center text-foreground mb-12 opacity-0 animate-fade-in-up"
          style={{ animationFillMode: "forwards" }}
        >
          Contact
        </h1>

        <div
          className="max-w-md mx-auto text-center space-y-6 opacity-0 animate-fade-in-up delay-200"
          style={{ animationFillMode: "forwards" }}
        >
          <div>
            <p className="text-muted-foreground font-body mb-2">Email</p>
            <a
              href={`mailto:${contact.email}`}
              className="nav-link text-foreground font-body text-lg hover:text-primary transition-colors"
            >
              {contact.email}
            </a>
          </div>

          <div>
            <p className="text-muted-foreground font-body mb-2">Discord</p>
            <span className="text-foreground font-body text-lg">
              {contact.discord}
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
