"use server";

import { z } from "zod";
import { createUser, getUserByEmail } from "@/features/auth/user";
import { hashPassword } from "@/features/auth/password";
import { signIn } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { redirect } from "next/navigation";

const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
});

export type RegisterState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function register(
  prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password, name } = parsed.data;

  try {
    const passwordHash = await hashPassword(password);
    await createUser({ email, passwordHash, name });

    await signIn("credentials", { email, password, redirect: false });

    logger.info({ email }, "user registered");
  } catch (e) {
    if (e instanceof Error && e.message === "EMAIL_EXISTS") {
      return { message: "Email already in use" };
    }
    logger.error(e, "registration failed");
    return { message: "Something went wrong" };
  }

  redirect("/dashboard");
}
