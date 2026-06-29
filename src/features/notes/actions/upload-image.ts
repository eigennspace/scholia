"use server";

import { auth } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { redirect } from "next/navigation";

export async function uploadImage(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const url = await storage.upload("uploads", file);
  return { url };
}
