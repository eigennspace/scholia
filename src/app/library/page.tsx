import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import LibraryClient from "./library-client";
import type { Prisma } from "@prisma/client";

interface LibraryPageProps {
  searchParams: Promise<{
    filter?: string;
    tag?: string;
    search?: string;
  }>;
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const sp = await searchParams;
  const { filter, tag, search } = sp;

  const where: Prisma.NoteWhereInput = {
    authorId: session.user.id,
    isTemplate: false,
  };

  if (filter === "archive") {
    where.status = "ARCHIVED";
  } else {
    where.NOT = { status: "ARCHIVED" };
  }

  if (filter === "important") where.isImportant = true;
  if (filter === "knowledge") where.category = { slug: "knowledge" };
  if (filter === "work") where.category = { slug: "work" };

  if (filter === "reading-list") {
    const collection = await prisma.collection.findFirst({
      where: { userId: session.user.id, isDefault: true },
    });
    if (collection) {
      where.collections = { some: { collectionId: collection.id } };
    }
  }

  if (tag) {
    where.tags = { some: { tag: { name: { equals: tag, mode: "insensitive" } } } };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
    ];
  }

  const [notes, noteCount, allTags] = await Promise.all([
    prisma.note.findMany({
      where,
      include: {
        category: true,
        tags: { include: { tag: true } },
        collections: { where: { collection: { isDefault: true } } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.note.count({
      where: { authorId: session.user.id, status: { not: "ARCHIVED" }, isTemplate: false },
    }),
    prisma.tag.findMany({
      where: { OR: [{ userId: session.user.id }, { userId: null }] },
      orderBy: { name: "asc" },
    }),
  ]);

  const notesJson = JSON.parse(JSON.stringify(notes));
  const tagsJson = JSON.parse(JSON.stringify(allTags));

  return (
    <LibraryClient
      notes={notesJson}
      noteCount={noteCount}
      currentFilter={filter || "all"}
      currentTag={tag}
      searchQuery={search}
      allTags={tagsJson}
    />
  );
}
