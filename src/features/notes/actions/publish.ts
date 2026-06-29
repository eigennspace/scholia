"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { redirect } from "next/navigation";

const publishSchema = z.object({
  noteId: z.string(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  collectionId: z.string().optional(),
  scheduledAt: z.string().optional(),
});

export type PublishState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
  storyUrl?: string;
};

export async function publishNote(
  prev: PublishState,
  formData: FormData,
): Promise<PublishState> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const tagsRaw = formData.get("tags");
  const tags = tagsRaw ? JSON.parse(tagsRaw as string) : [];

  const parsed = publishSchema.safeParse({
    noteId: formData.get("noteId"),
    description: formData.get("description"),
    coverImage: formData.get("coverImage"),
    tags,
    collectionId: formData.get("collectionId"),
    scheduledAt: formData.get("scheduledAt") || undefined,
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { noteId, description, coverImage, tags: tagNames, scheduledAt } = parsed.data;

  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note || note.authorId !== session.user.id) {
    return { message: "Note not found" };
  }

  if (note.status === "PUBLISHED") {
    return { message: "Note is already published" };
  }

  // Parse scheduledAt
  let scheduledDate: Date | null = null;
  if (scheduledAt) {
    scheduledDate = new Date(scheduledAt);
    if (scheduledDate <= new Date()) {
      return { message: "Schedule time must be in the future" };
    }
  }

  const isScheduled = !!scheduledDate;
  const newStatus = isScheduled ? "SCHEDULED" : "PUBLISHED";

  const tagList = tagNames ?? [];
  if (tagList.length > 0) {
    for (const name of tagList) {
      const normalized = name.toLowerCase().trim();
      const existing = await prisma.tag.findUnique({ where: { name: normalized } });
      if (!existing) {
        await prisma.tag.create({ data: { name: normalized, userId: session.user.id } });
      }
    }
  }

  // Update note
  const updated = await prisma.note.update({
    where: { id: noteId },
    data: {
      status: newStatus,
      coverImage: coverImage || note.coverImage,
      excerpt: description || note.excerpt,
      ...(scheduledDate ? { scheduledAt: scheduledDate } : {}),
      // Connect tags
      tags: {
        deleteMany: {},
        create: tagList.map((name: string) => ({
          tag: { connect: { name: name.toLowerCase().trim() } },
        })),
      },
    },
  });

  // Add to collection if specified
  if (parsed.data.collectionId) {
    const existing = await prisma.noteCollection.findUnique({
      where: { noteId_collectionId: { noteId, collectionId: parsed.data.collectionId } },
    });
    if (!existing) {
      await prisma.noteCollection.create({
        data: { noteId, collectionId: parsed.data.collectionId },
      });
    }
  }

  logger.info({ noteId, status: newStatus }, "note published");

  if (isScheduled) {
    redirect(`/library?filter=scheduled`);
  } else {
    redirect(`/story/${noteId}`);
  }
}
