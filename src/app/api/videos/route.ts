import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

/** Extract the 11-char YouTube video ID from any YouTube URL */
function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
  );
  return match ? match[1] : null;
}

/** Fetch title and channel name from YouTube oEmbed (no API key required) */
async function fetchYouTubeMeta(
  videoId: string,
): Promise<{ title: string; author: string } | null> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return { title: data.title ?? "", author: data.author_name ?? "" };
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { youtubeUrl, type } = body;
    let { title, subtitle } = body as { title?: string; subtitle?: string };

    if (!youtubeUrl) {
      return NextResponse.json(
        { error: "YouTube URL is required" },
        { status: 400 },
      );
    }

    // Auto-fetch metadata from YouTube oEmbed when title (or subtitle) is missing
    if (!title || !subtitle) {
      const videoId = extractYouTubeId(youtubeUrl);
      if (videoId) {
        const meta = await fetchYouTubeMeta(videoId);
        if (meta) {
          if (!title) title = meta.title;
          if (!subtitle) subtitle = meta.author;
        }
      }
    }

    const video = await prisma.video.create({
      data: {
        youtubeUrl,
        title,
        subtitle,
        type: type || "video",
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 },
    );
  }
}
