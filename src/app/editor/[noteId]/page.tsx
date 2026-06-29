import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import TipTapEditor from "@/components/editor/tiptap-editor";
import Link from "next/link";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const session = await auth();
  if (!session?.user) return notFound();

  const { noteId } = await params;

  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: { category: true },
  });

  if (!note || note.authorId !== session.user.id) return notFound();

  return (
    <div className="max-w-[720px] mx-auto px-stack-lg py-stack-lg">
      <div className="mb-stack-md flex items-center justify-between">
        <Link href="/library" className="text-label text-muted hover:text-ink">&larr; Library</Link>
        <div className="flex items-center gap-stack-sm">
          {note.status !== "ARCHIVED" && (
            <Link
              href={`/editor/${note.id}/publish`}
              className="bg-primary text-white px-4 py-2 rounded-btn text-label font-medium"
            >
              Publish
            </Link>
          )}
        </div>
      </div>

      <TipTapEditor
        noteId={note.id}
        initialTitle={note.title}
        initialContent={note.content as Record<string, unknown>}
        categoryName={note.category?.name}
        readingTime={note.readingTime}
      />
    </div>
  );
}
