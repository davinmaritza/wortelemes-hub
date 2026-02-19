import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Wortelemes for commissions, collaborations, or any inquiries. Available via email and Discord.",
  openGraph: {
    title: "Contact | Wortelemes",
    description:
      "Get in touch with Wortelemes for commissions, collaborations, or any inquiries.",
    type: "website",
  },
  twitter: {
    title: "Contact | Wortelemes",
    description:
      "Get in touch with Wortelemes for commissions, collaborations, or any inquiries.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
