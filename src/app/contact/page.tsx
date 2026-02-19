"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSettings, ContactLink } from "@/lib/api-client";
import {
  Mail,
  MessageCircle,
  Twitter,
  Instagram,
  Youtube,
  Github,
  Twitch,
  Linkedin,
  Globe,
  Phone,
  Send,
  Music,
  Link as LinkIcon,
} from "lucide-react";

const ICONS: Record<string, React.ElementType> = {
  Mail,
  MessageCircle,
  Twitter,
  Instagram,
  Youtube,
  Github,
  Twitch,
  Linkedin,
  Globe,
  Phone,
  Send,
  Music,
  Link: LinkIcon,
};

function ContactIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? LinkIcon;
  return <Icon className={className} />;
}

export default function ContactPage() {
  const [contacts, setContacts] = useState<ContactLink[]>([]);

  useEffect(() => {
    getSettings()
      .then((settings) => setContacts(settings.contact))
      .catch(console.error);
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
          className="max-w-sm mx-auto space-y-3 opacity-0 animate-fade-in-up delay-200"
          style={{ animationFillMode: "forwards" }}
        >
          {contacts.map((link) =>
            link.href ? (
              <a
                key={link.id}
                href={link.href}
                target={
                  link.href.startsWith("mailto:") ||
                  link.href.startsWith("tel:")
                    ? undefined
                    : "_blank"
                }
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 group-hover:bg-muted/80 transition-colors">
                  <ContactIcon
                    name={link.icon}
                    className="w-5 h-5 text-foreground"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-body">
                    {link.label}
                  </p>
                  <p className="text-foreground font-body nav-link truncate">
                    {link.value}
                  </p>
                </div>
              </a>
            ) : (
              <div
                key={link.id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <ContactIcon
                    name={link.icon}
                    className="w-5 h-5 text-foreground"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-body">
                    {link.label}
                  </p>
                  <p className="text-foreground font-body truncate">
                    {link.value}
                  </p>
                </div>
              </div>
            ),
          )}

          {contacts.length === 0 && (
            <p className="text-center text-muted-foreground font-body py-12">
              No contact information available.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
