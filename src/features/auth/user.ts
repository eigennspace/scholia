import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

interface CreateUserParams {
  email: string;
  passwordHash: string;
  name: string;
}

export async function createUser({ email, passwordHash, name }: CreateUserParams) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("EMAIL_EXISTS");
  }

  const user = await prisma.user.create({
    data: { email, passwordHash, name },
  });

  // Create default Reading List collection
  await prisma.collection.create({
    data: {
      name: "Reading List",
      isDefault: true,
      userId: user.id,
    },
  });

  logger.info({ userId: user.id }, "user created");
  return user;
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function updatePassword(userId: string, passwordHash: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}
