import { PrismaClient } from "../../prisma/generated/prisma";

// Ensure DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  console.warn(
    "⚠️  DATABASE_URL is not set. Prisma client will fail at runtime."
  );
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
