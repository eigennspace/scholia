"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function toggleBookmark(noteId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const collection = await prisma.collection.findFirst({
    where: { userId: session.user.id, isDefault: true },
  });

  if (!collection) throw new Error("No Reading List found");

  const existing = await prisma.noteCollection.findUnique({
    where: { noteId_collectionId: { noteId, collectionId: collection.id } },
  });

  if (existing) {
    await prisma.noteCollection.delete({
      where: { noteId_collectionId: { noteId, collectionId: collection.id } },
    });
    return { bookmarked: false };
  } else {
    await prisma.noteCollection.create({
      data: { noteId, collectionId: collection.id },
    });
    return { bookmarked: true };
  }
}

export async function getBookmarkStatus(noteId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  const collection = await prisma.collection.findFirst({
    where: { userId: session.user.id, isDefault: true },
  });
  if (!collection) return false;

  const bm = await prisma.noteCollection.findUnique({
    where: { noteId_collectionId: { noteId, collectionId: collection.id } },
  });
  return !!bm;
}
