import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Wortelemes – a professional video content creator and digital artist passionate about storytelling through video.",
  openGraph: {
    title: "About | Wortelemes",
    description:
      "Learn about Wortelemes – a professional video content creator and digital artist.",
    type: "profile",
  },
  twitter: {
    title: "About | Wortelemes",
    description:
      "Learn about Wortelemes – a professional video content creator and digital artist.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
