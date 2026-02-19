import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Browse the portfolio of Wortelemes – featuring video commissions, GTA V commissions, vehicle mods, outfits, and more creative works.",
  keywords: [
    "Wortelemes portfolio",
    "video commission",
    "GTA V commission",
    "GTA commish",
    "vehicle mod",
    "character outfits",
  ],
  openGraph: {
    title: "Portfolio | Wortelemes",
    description:
      "Video commissions, GTA V commissions, and creative works by Wortelemes.",
    type: "website",
  },
  twitter: {
    title: "Portfolio | Wortelemes",
    description:
      "Video commissions, GTA V commissions, and creative works by Wortelemes.",
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
