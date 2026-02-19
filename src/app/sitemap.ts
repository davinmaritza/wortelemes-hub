import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const BASE_URL = "https://wortelemes.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic data from the database
  const [categories, latestVideo, latestPortfolioItem] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.video.findFirst({
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
    prisma.portfolioItem.findFirst({
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
  ]);

  const now = new Date();
  const latestVideoDate = latestVideo?.updatedAt ?? now;
  const latestPortfolioDate = latestPortfolioItem?.updatedAt ?? now;
  const latestContentDate =
    latestVideoDate > latestPortfolioDate
      ? latestVideoDate
      : latestPortfolioDate;

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: latestContentDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/videos`,
      lastModified: latestVideoDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/portfolio`,
      lastModified: latestPortfolioDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic portfolio category routes
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/portfolio/${encodeURIComponent(category.name)}`,
    lastModified: category.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes];
}
