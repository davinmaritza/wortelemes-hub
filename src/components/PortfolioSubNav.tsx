"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { getCategories } from "@/lib/data";

interface SubNavItem {
  label: string;
  path: string;
  children?: SubNavItem[];
}

const PortfolioSubNav = () => {
  const pathname = usePathname();

  // Re-fetch categories on every render to ensure they're always up-to-date
  const portfolioCategories = useMemo(() => {
    const categories = getCategories();
    const navItems: SubNavItem[] = [{ label: "All", path: "/portfolio" }];

    // Group categories by parent
    const parentMap = new Map<string, SubNavItem>();

    categories.forEach((cat) => {
      if (cat === "all") return;

      if (cat.includes("/")) {
        // This is a subcategory
        const [parent, child] = cat.split("/");
        if (!parentMap.has(parent)) {
          parentMap.set(parent, {
            label: parent.replace(/([A-Z])/g, " $1").trim(),
            path: `/portfolio/${parent}`,
            children: [],
          });
        }
        parentMap.get(parent)!.children!.push({
          label: child.replace(/([A-Z])/g, " $1").trim(),
          path: `/portfolio/${cat}`,
        });
      } else {
        // This is a parent category
        if (!parentMap.has(cat)) {
          parentMap.set(cat, {
            label: cat.replace(/([A-Z])/g, " $1").trim(),
            path: `/portfolio/${cat}`,
            children: [],
          });
        }
      }
    });

    // Convert map to array and clean up empty children
    parentMap.forEach((item) => {
      if (item.children && item.children.length === 0) {
        delete item.children;
      }
      navItems.push(item);
    });

    return navItems;
  }, [pathname]); // Re-compute when pathname changes to pick up new categories

  const isExactActive = (path: string) => pathname === path;

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 md:gap-4 py-4 border-b border-border">
      {portfolioCategories.map((category) => (
        <div key={category.path} className="relative group">
          <Link
            href={category.path}
            className={`px-3 py-1.5 text-sm font-body rounded-md transition-colors ${
              isExactActive(category.path)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {category.label}
          </Link>

          {category.children && (
            <div className="absolute left-0 top-full mt-1 hidden group-hover:flex flex-col bg-popover border border-border rounded-md shadow-lg z-20 min-w-[120px]">
              {category.children.map((child) => (
                <Link
                  key={child.path}
                  href={child.path}
                  className={`px-3 py-2 text-sm font-body transition-colors whitespace-nowrap ${
                    isExactActive(child.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default PortfolioSubNav;
