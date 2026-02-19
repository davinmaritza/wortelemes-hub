import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Videos",
  description:
    "Watch videos by Wortelemes – video commissions, creative edits, and more. Click any thumbnail to play.",
  openGraph: {
    title: "Videos | Wortelemes",
    description:
      "Watch videos by Wortelemes – video commissions, creative edits, and more.",
    type: "website",
  },
  twitter: {
    title: "Videos | Wortelemes",
    description:
      "Watch videos by Wortelemes – video commissions, creative edits, and more.",
  },
};

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
