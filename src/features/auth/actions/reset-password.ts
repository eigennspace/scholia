"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/features/auth/password";
import { logger } from "@/lib/logger";
import crypto from "crypto";

const schema = z.object({
  token: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export type ResetPasswordState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

export async function resetPassword(
  prev: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const parsed = schema.safeParse({
    token: formData.get("token"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const { token, email, password } = parsed.data;
  const hash = crypto.createHash("sha256").update(token).digest("hex");

  const stored = await prisma.verificationToken.findUnique({
    where: { token: hash },
  });

  if (!stored || stored.identifier !== email || stored.expires < new Date()) {
    return { message: "Invalid or expired reset token" };
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.update({
    where: { email },
    data: { passwordHash },
  });

  await prisma.verificationToken.delete({ where: { token: hash } });

  logger.info({ email }, "password reset completed");
  return { success: true };
}
