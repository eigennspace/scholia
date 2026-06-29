"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { redirect } from "next/navigation";

export async function archiveNote(noteId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note || note.authorId !== session.user.id) throw new Error("Not found");

  await prisma.note.update({
    where: { id: noteId },
    data: { status: "ARCHIVED", scheduledAt: null },
  });

  logger.info({ noteId }, "note archived");
}

export async function unarchiveNote(noteId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note || note.authorId !== session.user.id) throw new Error("Not found");

  await prisma.note.update({
    where: { id: noteId },
    data: { status: "DRAFT" },
  });

  logger.info({ noteId }, "note unarchived");
}

export async function deleteNotePermanently(noteId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note || note.authorId !== session.user.id) throw new Error("Not found");

  await prisma.note.delete({ where: { id: noteId } });
  logger.info({ noteId }, "note permanently deleted");
}
