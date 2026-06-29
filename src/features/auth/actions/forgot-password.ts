"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import crypto from "crypto";

const schema = z.object({ email: z.string().email() });

export type ForgotPasswordState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

export async function forgotPassword(
  prev: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const parsed = schema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Don't reveal whether email exists
    return { success: true };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(token).digest("hex");

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: hash,
      expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  // In dev, log to console (Mailpit will catch if SMTP configured)
  logger.info({ resetUrl, email }, "password reset requested");

  // TODO: send email via Resend/Mailpit when SMTP configured

  return { success: true };
}
