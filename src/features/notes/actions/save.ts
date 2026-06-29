"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { redirect } from "next/navigation";

const schema = z.object({
  noteId: z.string(),
  title: z.string().optional(),
  content: z.any().optional(),
  categoryId: z.string().optional(),
});

export type SaveState = {
  message?: string;
  success?: boolean;
  readingTime?: number | null;
};

function extractText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as Record<string, unknown>;
  if (typeof n.text === "string") return ` ${n.text}`;
  if (Array.isArray(n.content)) return n.content.map(extractText).join("");
  return "";
}

function computeReadingTime(content: unknown): number | null {
  if (!content) return null;
  const text = extractText(content);
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words === 0) return null;
  return Math.ceil(words / 225);
}

export async function saveNote(
  prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const parsed = schema.safeParse({
    noteId: formData.get("noteId"),
    title: formData.get("title"),
    content: formData.get("content") ? JSON.parse(formData.get("content") as string) : undefined,
    categoryId: formData.get("categoryId"),
  });

  if (!parsed.success) return { message: "Invalid data", success: false };

  const { noteId, title, content, categoryId } = parsed.data;

  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note || note.authorId !== session.user.id) return { message: "Not found", success: false };

  const readingTime = computeReadingTime(content ?? note.content);

  // Compute excerpt from content
  let excerpt = note.excerpt;
  if (content) {
    const text = JSON.stringify(content)
      .replace(/\[{[^}]*}\]/g, " ")
      .replace(/[{}[\]"\\]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    excerpt = text.slice(0, 150) + (text.length > 150 ? "..." : "");
  }

  await prisma.note.update({
    where: { id: noteId },
    data: {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(categoryId !== undefined && { categoryId }),
      ...(readingTime !== undefined && { readingTime }),
      ...(excerpt !== undefined && { excerpt }),
    },
  });

  logger.info({ noteId }, "note saved");
  return { success: true, readingTime };
}
