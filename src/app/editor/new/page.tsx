import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";

export default async function NewEditorPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const sp = await searchParams;
  const templateId = sp.template;

  let title = "Untitled";
  let content: Record<string, unknown> = { type: "doc", content: [{ type: "paragraph" }] };
  let categoryId: string | null = null;

  if (templateId && templateId !== "blank") {
    const template = await prisma.note.findUnique({
      where: { id: `template-${templateId}` },
    });
    if (template) {
      title = template.title;
      content = (template.content as Record<string, unknown>) || content;
      categoryId = template.categoryId;
    }
  }

  // Apply category from search param or template
  let finalCategoryId = categoryId;
  if (!finalCategoryId) {
    const knowledge = await prisma.category.findUnique({ where: { slug: "knowledge" } });
    finalCategoryId = knowledge?.id || null;
  }

  const note = await prisma.note.create({
    data: {
      title,
      content: content as Prisma.JsonObject,
      authorId: session.user.id,
      categoryId: finalCategoryId,
      status: "DRAFT",
    },
  });

  redirect(`/editor/${note.id}`);
}
