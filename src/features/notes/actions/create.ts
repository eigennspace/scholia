"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { redirect } from "next/navigation";

export async function createNote(categorySlug: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) throw new Error("Category not found");

  const note = await prisma.note.create({
    data: {
      title: "Untitled",
      content: { type: "doc", content: [{ type: "paragraph" }] },
      authorId: session.user.id,
      categoryId: category.id,
      status: "DRAFT",
    },
  });

  logger.info({ noteId: note.id }, "note created");
  return note;
}
