"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className="w-full py-4 md:py-6 opacity-0 animate-fade-in"
      style={{ animationFillMode: "forwards", animationDelay: "200ms" }}
    >
      {/* Mobile: Logo on top, nav below */}
      <div className="md:hidden flex flex-col items-center gap-3 px-4">
        <Link
          href="/"
          className="nav-link font-display text-xl font-medium tracking-wider"
        >
          Wortelemes
        </Link>
        <nav className="flex items-center justify-center gap-4 text-sm font-body tracking-wide">
          <Link
            href="/about"
            className={`nav-link ${isActive("/about") ? "active" : ""}`}
          >
            About
          </Link>
          <Link
            href="/videos"
            className={`nav-link ${isActive("/videos") ? "active" : ""}`}
          >
            Videos
          </Link>
          <Link
            href="/portfolio"
            className={`nav-link ${isActive("/portfolio") ? "active" : ""}`}
          >
            Portfolio
          </Link>
          <Link
            href="/contact"
            className={`nav-link ${isActive("/contact") ? "active" : ""}`}
          >
            Contact
          </Link>
        </nav>
      </div>

      {/* Desktop: All in one row */}
      <nav className="hidden md:flex container mx-auto px-4 items-center justify-center gap-8 text-sm font-body tracking-wide">
        <Link
          href="/about"
          className={`nav-link ${isActive("/about") ? "active" : ""}`}
        >
          About
        </Link>
        <Link
          href="/videos"
          className={`nav-link ${isActive("/videos") ? "active" : ""}`}
        >
          Videos
        </Link>
        <Link
          href="/"
          className="nav-link font-display text-xl font-medium tracking-wider"
        >
          Wortelemes
        </Link>
        <Link
          href="/portfolio"
          className={`nav-link ${isActive("/portfolio") ? "active" : ""}`}
        >
          Portfolio
        </Link>
        <Link
          href="/contact"
          className={`nav-link ${isActive("/contact") ? "active" : ""}`}
        >
          Contact
        </Link>
      </nav>
    </header>
  );
};

export default Header;
