"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { redirect } from "next/navigation";

export async function toggleImportant(noteId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note || note.authorId !== session.user.id) throw new Error("Not found");

  const updated = await prisma.note.update({
    where: { id: noteId },
    data: { isImportant: !note.isImportant },
  });

  logger.info({ noteId, isImportant: updated.isImportant }, "importance toggled");
  return { isImportant: updated.isImportant };
}
