import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import type { JSX } from "react";

interface StoryPageProps {
  params: Promise<{ noteId: string }>;
}

export default async function StoryPage({ params }: StoryPageProps) {
  const session = await auth();
  const { noteId } = await params;

  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!note || note.status !== "PUBLISHED") {
    notFound();
  }

  const safeNote = note;
  const authorName = session?.user?.name || "Anonymous";

  function renderContent() {
    if (!safeNote.content) return null;
    return <TipTapRenderer content={safeNote.content as Record<string, unknown>} />;
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Back link */}
      <div className="max-w-[720px] mx-auto px-stack-lg pt-stack-lg">
        <Link href="/library" className="text-label text-muted hover:text-ink">&larr; Library</Link>
      </div>

      <article className="max-w-[720px] mx-auto px-stack-lg py-stack-lg">
        {/* Header */}
        <header className="mb-stack-xl">
          <h1 className="font-serif text-headline font-bold text-ink mb-stack-md leading-tight">
            {note.title}
          </h1>
          <div className="flex items-center gap-stack-sm text-body text-muted">
            <span>{authorName}</span>
            <span>&middot;</span>
            <time>{format(new Date(note.createdAt), "MMM d, yyyy")}</time>
            {note.readingTime && (
              <>
                <span>&middot;</span>
                <span>{note.readingTime} min read</span>
              </>
            )}
          </div>
        </header>

        {/* Featured image */}
        {note.coverImage && (
          <div className="mb-stack-xl">
            <img
              src={note.coverImage}
              alt="Featured"
              className="w-full object-cover max-h-[400px]"
            />
          </div>
        )}

        {/* Content */}
        <div className="font-serif text-reading leading-reading text-ink">
          {renderContent()}
        </div>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-stack-sm mt-stack-xl pt-stack-lg border-t border-border">
            {note.tags.map((nt) => (
              <span key={nt.tag.id} className="bg-canvas border border-border px-2 py-1 text-label rounded-tag">
                {nt.tag.name}
              </span>
            ))}
          </div>
        )}
      </article>

      <footer className="text-center py-stack-xl text-caps text-muted border-t border-border mt-stack-xl">
        Established 2024
      </footer>
    </div>
  );
}

// Simple TipTap JSON renderer
function TipTapRenderer({ content }: { content: Record<string, unknown> }) {
  if (!content || content.type !== "doc") return null;
  const children = (content.content || []) as Record<string, unknown>[];

  return (
    <div className="space-y-stack-md">
      {children.map((node, i) => renderNode(node, i))}
    </div>
  );
}

function renderNode(node: Record<string, unknown>, key: number): React.ReactNode {
  const type = node.type as string;
  const attrs = (node.attrs || {}) as Record<string, unknown>;
  const children = (node.content || []) as Record<string, unknown>[];

  switch (type) {
    case "paragraph":
      return <p key={key} className="mb-stack-md">{renderInline(children)}</p>;
    case "heading": {
      const level = (attrs.level as number) || 2;
      const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
      const sizes: Record<number, string> = { 2: "text-subheading", 3: "text-body font-bold" };
      return (
        <HeadingTag key={key} className={`font-serif font-bold text-ink mt-stack-lg mb-stack-sm ${sizes[level] || sizes[2]}`}>
          {renderInline(children)}
        </HeadingTag>
      );
    }
    case "bulletList":
      return (
        <ul key={key} className="list-disc pl-6 mb-stack-md space-y-1">
          {children.map((item, i) => (
            <li key={i}>{renderChildren(item)}</li>
          ))}
        </ul>
      );
    case "orderedList":
      return (
        <ol key={key} className="list-decimal pl-6 mb-stack-md space-y-1">
          {children.map((item, i) => (
            <li key={i}>{renderChildren(item)}</li>
          ))}
        </ol>
      );
    case "listItem":
      return renderChildren(children);
    case "blockquote":
      return (
        <blockquote key={key} className="border-l-4 border-primary pl-4 italic text-muted mb-stack-md">
          {renderInline(children)}
        </blockquote>
      );
    case "codeBlock":
      return (
        <pre key={key} className="bg-canvas border border-border p-stack-md font-mono text-body overflow-x-auto mb-stack-md">
          <code>{renderInline(children)}</code>
        </pre>
      );
    case "horizontalRule":
      return <hr key={key} className="border-t border-border my-stack-lg" />;
    case "image": {
      const src = attrs.src as string;
      const alt = (attrs.alt as string) || "";
      return <img key={key} src={src} alt={alt} className="max-w-full h-auto my-stack-md" />;
    }
    default:
      if (children) return <div key={key}>{renderInline(children)}</div>;
      return null;
  }
}

function renderInline(nodes: Record<string, unknown>[]): React.ReactNode {
  if (!nodes?.length) return null;
  return nodes.map((node, i) => {
    const type = node.type as string;
    const text = node.text as string;
    const marks = (node.marks || []) as Record<string, unknown>[];

    let content: React.ReactNode = text || "";

    if (marks) {
      for (const mark of marks) {
        const markType = mark.type as string;
        if (markType === "bold") content = <strong key={i}>{content}</strong>;
        else if (markType === "italic") content = <em key={i}>{content}</em>;
        else if (markType === "code") content = <code key={i} className="font-mono bg-canvas px-1 rounded-tag">{content}</code>;
        else if (markType === "link") {
          const href = (mark.attrs as Record<string, string>)?.href || "#";
          content = <a key={i} href={href} className="text-primary hover:underline">{content}</a>;
        }
      }
    } else {
      content = text || "";
    }

    if (type === "hardBreak") return <br key={i} />;
    return content;
  });
}

function renderChildren(children: Record<string, unknown> | Record<string, unknown>[]): React.ReactNode {
  if (Array.isArray(children)) {
    return children.map((child, i) => renderNode(child, i));
  }
  if (children && typeof children === "object") {
    const content = children.content as Record<string, unknown>[] | undefined;
    if (content) return renderInline(content);
  }
  return null;
}
