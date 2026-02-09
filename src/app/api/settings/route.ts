import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.settings.findMany();

    const data = {
      aboutMe:
        settings.find((s) => s.key === "aboutMe")?.value ||
        "Welcome to my portfolio. I create amazing video content and designs.",
      portfolio:
        settings.find((s) => s.key === "portfolio")?.value ||
        "Here are some of my best works and projects.",
      contact: JSON.parse(
        settings.find((s) => s.key === "contact")?.value ||
          '{"email":"Feelsbrian@gmail.com","discord":"wortelemes"}',
      ),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    const setting = await prisma.settings.upsert({
      where: { key },
      update: {
        value: typeof value === "string" ? value : JSON.stringify(value),
      },
      create: {
        key,
        value: typeof value === "string" ? value : JSON.stringify(value),
      },
    });

    return NextResponse.json(setting);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
