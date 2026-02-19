import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

const BASE_URL = "https://wortelemes.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: "%s | Wortelemes",
    default: "Wortelemes – Video Content Creator & Digital Artist",
  },
  description:
    "Wortelemes – professional video content creator and digital artist. Explore video commissions, GTA V commissions, and a curated creative portfolio.",
  keywords: [
    "Wortelemes",
    "video creator",
    "video commission",
    "GTA V commission",
    "GTA commish",
    "video editing",
    "content creator",
    "portfolio",
    "digital artist",
  ],
  authors: [{ name: "Wortelemes", url: BASE_URL }],
  creator: "Wortelemes",
  openGraph: {
    title: "Wortelemes – Video Content Creator & Digital Artist",
    description:
      "Professional video content creator and digital artist. Video commissions, GTA V commissions, and creative portfolio.",
    url: BASE_URL,
    siteName: "Wortelemes",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Wortelemes",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wortelemes – Video Content Creator & Digital Artist",
    description:
      "Professional video content creator and digital artist. Video commissions, GTA V commissions, and creative portfolio.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: BASE_URL,
        name: "Wortelemes",
        description:
          "Professional video content creator and digital artist. Video commissions, GTA V commissions, and creative portfolio.",
        potentialAction: {
          "@type": "SearchAction",
          target: `${BASE_URL}/videos?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Person",
        "@id": `${BASE_URL}/#person`,
        name: "Wortelemes",
        url: BASE_URL,
        image: `${BASE_URL}/logo.png`,
        jobTitle: "Video Content Creator & Digital Artist",
        sameAs: [],
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Quicksand:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AuthProvider>
          <QueryProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {children}
            </TooltipProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
