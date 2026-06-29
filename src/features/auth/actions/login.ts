"use server";

import { z } from "zod";
import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logger } from "@/lib/logger";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function login(
  prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
    logger.info({ email: parsed.data.email }, "user logged in");
  } catch (e) {
    logger.error(e, "login failed");
    return { message: "Invalid email or password" };
  }

  redirect("/dashboard");
}
