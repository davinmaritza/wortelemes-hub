import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  "all",
  "VideoCommish",
  "GTACommish",
  "GTACommish/Vehicle",
  "GTACommish/Outfits",
];

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const hashedPassword = await hash("Pebrihome.,", 10);

  const user = await prisma.user.upsert({
    where: { username: "bukanfebrian" },
    update: {},
    create: {
      username: "bukanfebrian",
      password: hashedPassword,
      email: "Feelsbrian@gmail.com",
    },
  });
  console.log("✅ Created admin user:", user.username);

  // Create default categories
  for (const categoryName of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });
  }
  console.log("✅ Created default categories");

  // Create default settings
  await prisma.settings.upsert({
    where: { key: "aboutMe" },
    update: {},
    create: {
      key: "aboutMe",
      value:
        "Welcome to my portfolio. I create amazing video content and designs.",
    },
  });

  await prisma.settings.upsert({
    where: { key: "portfolio" },
    update: {},
    create: {
      key: "portfolio",
      value: "Here are some of my best works and projects.",
    },
  });

  await prisma.settings.upsert({
    where: { key: "contact" },
    update: {},
    create: {
      key: "contact",
      value: JSON.stringify({
        email: "Feelsbrian@gmail.com",
        discord: "wortelemes",
      }),
    },
  });
  console.log("✅ Created default settings");

  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
