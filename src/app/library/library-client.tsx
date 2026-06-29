"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface Note {
  id: string;
  title: string;
  excerpt: string | null;
  readingTime: number | null;
  isImportant: boolean;
  status: string;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
  category: { name: string; slug: string } | null;
  tags: { tag: { id: string; name: string } }[];
  collections: { collectionId: string }[];
}

interface LibraryClientProps {
  notes: Note[];
  noteCount: number;
  currentFilter: string;
  currentTag?: string;
  searchQuery?: string;
  allTags: { id: string; name: string }[];
}

const filters = [
  { key: "all", label: "All Notes" },
  { key: "knowledge", label: "Knowledge" },
  { key: "work", label: "Work" },
  { key: "important", label: "Important" },
  { key: "reading-list", label: "Reading List" },
];

export default function LibraryClient({
  notes,
  noteCount,
  currentFilter,
  currentTag,
  searchQuery,
  allTags,
}: LibraryClientProps) {
  const router = useRouter();
  const sp = useSearchParams();
  const [search, setSearch] = useState(searchQuery || "");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  function navigateFilter(key: string) {
    const params = new URLSearchParams();
    if (key !== "all") params.set("filter", key);
    router.push(`/library?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(sp.toString());
    if (search) params.set("search", search);
    else params.delete("search");
    router.push(`/library?${params.toString()}`);
  }

  async function handleToggleBookmark(noteId: string) {
    const { toggleBookmark } = await import("@/features/notes/actions/bookmark");
    await toggleBookmark(noteId);
    router.refresh();
  }

  async function handleToggleImportant(noteId: string) {
    const { toggleImportant } = await import("@/features/notes/actions/toggle-important");
    await toggleImportant(noteId);
    router.refresh();
  }

  async function handleArchive(noteId: string) {
    if (!confirm("Move to archive? You can unarchive later.")) return;
    const { archiveNote } = await import("@/features/notes/actions/archive");
    await archiveNote(noteId);
    router.refresh();
  }

  async function handleUnarchive(noteId: string) {
    const { unarchiveNote } = await import("@/features/notes/actions/archive");
    await unarchiveNote(noteId);
    router.refresh();
  }

  async function handleDelete(noteId: string) {
    if (!confirm("Delete this note? This action cannot be undone.")) return;
    const { archiveNote } = await import("@/features/notes/actions/archive");
    await archiveNote(noteId);
    router.refresh();
  }

  async function handlePermanentDelete(noteId: string) {
    if (!confirm("Delete forever?")) return;
    const { deleteNotePermanently } = await import("@/features/notes/actions/archive");
    await deleteNotePermanently(noteId);
    router.refresh();
  }

  return (
    <div className="max-w-[720px] mx-auto px-stack-lg py-stack-xl">
      {/* Hero */}
      <div className="mb-stack-xl">
        <h1 className="font-serif text-headline font-bold text-ink">
          {currentFilter === "archive" ? "Archive" : "The Reading Room"}
        </h1>
        <p className="text-body text-muted mt-stack-sm">
          {currentFilter === "archive"
            ? `${notes.length} archived notes`
            : `${noteCount} preserved ideas waiting for synthesis.`}
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-stack-lg">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or excerpt..."
          className="w-full border-b border-border py-2 text-body text-ink bg-transparent focus:outline-none focus:border-ink"
        />
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-stack-sm mb-stack-lg border-b border-border pb-stack-sm">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => navigateFilter(f.key)}
            className={`text-label pb-2 border-b-2 transition-colors ${
              currentFilter === f.key
                ? "border-primary text-primary font-medium"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {currentTag && (
        <div className="mb-stack-md">
          <span className="text-label text-muted">Tagged: </span>
          <span className="inline-block bg-canvas border border-border px-2 py-0.5 text-label rounded-tag">{currentTag}</span>
          <button
            onClick={() => router.push("/library")}
            className="text-label text-muted ml-2 hover:text-ink"
          >
            &times;
          </button>
        </div>
      )}

      {/* Notes list */}
      {notes.length === 0 ? (
        <div className="text-center py-stack-xl">
          <p className="text-body text-muted mb-stack-md">
            {currentFilter === "important"
              ? "No important notes yet. Mark a note as important from the library."
              : currentFilter === "reading-list"
              ? "No bookmarked notes yet."
              : currentFilter === "archive"
              ? "No archived notes."
              : searchQuery
              ? "No notes match your search."
              : "No notes yet. Write your first piece."}
          </p>
          {currentFilter === "all" && (
            <Link href="/new-note" className="text-primary hover:underline">
              Write your first note &rarr;
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-0 divide-y divide-border">
          {notes.map((note) => (
            <div key={note.id} className="py-stack-md flex gap-stack-md relative">
              {/* Thumbnail */}
              <div className="w-16 h-16 flex-shrink-0 bg-canvas border border-border flex items-center justify-center text-2xl">
                {note.coverImage ? (
                  <img src={note.coverImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-label text-muted">{note.title[0]?.toUpperCase() || "N"}</span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-stack-sm mb-1">
                  {note.isImportant && (
                    <span className="text-primary text-label" title="Important">&#9733;</span>
                  )}
                  <Link
                    href={`/editor/${note.id}`}
                    className="font-serif text-body font-semibold text-ink hover:text-primary truncate block"
                  >
                    {note.title}
                  </Link>
                </div>
                <p className="text-body text-muted line-clamp-2 mb-1">
                  {note.excerpt || "No content yet"}
                </p>
                <div className="flex items-center gap-stack-sm text-caps text-muted">
                  {note.category && <span className="text-caps">{note.category.name}</span>}
                  {note.readingTime && <span>{note.readingTime} min read</span>}
                  {note.status === "PUBLISHED" && <span className="text-primary">Published</span>}
                  {note.status === "SCHEDULED" && <span className="text-muted">Scheduled</span>}
                  {/* Tags */}
                  {note.tags.length > 0 && (
                    <span className="flex gap-1">
                      {note.tags.slice(0, 3).map((nt) => (
                        <Link
                          key={nt.tag.id}
                          href={`/library?tag=${nt.tag.name}`}
                          className="bg-canvas border border-border px-1.5 py-0.5 text-caps rounded-tag hover:border-ink"
                        >
                          {nt.tag.name}
                        </Link>
                      ))}
                      {note.tags.length > 3 && <span className="text-caps">+{note.tags.length - 3} more</span>}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-stack-sm">
                <button
                  onClick={() => handleToggleBookmark(note.id)}
                  className={`text-body ${note.collections.length > 0 ? "text-primary" : "text-muted hover:text-ink"}`}
                  title={note.collections.length > 0 ? "Remove bookmark" : "Bookmark"}
                >
                  {note.collections.length > 0 ? "★" : "☆"}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(menuOpen === note.id ? null : note.id)}
                    className="text-muted hover:text-ink text-body px-1"
                    title="More actions"
                  >
                    &#8942;
                  </button>
                  {menuOpen === note.id && (
                    <div className="absolute right-0 top-6 bg-paper border border-border rounded-btn shadow-sm z-10 w-40">
                      {currentFilter !== "archive" ? (
                        <>
                          <Link
                            href={`/editor/${note.id}`}
                            className="block px-3 py-2 text-body text-ink hover:bg-canvas"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => { handleToggleImportant(note.id); setMenuOpen(null); }}
                            className="block w-full text-left px-3 py-2 text-body text-ink hover:bg-canvas"
                          >
                            {note.isImportant ? "Remove Important" : "Mark Important"}
                          </button>
                          {note.status === "DRAFT" && (
                            <Link
                              href={`/editor/${note.id}/publish`}
                              className="block px-3 py-2 text-body text-ink hover:bg-canvas"
                            >
                              Publish
                            </Link>
                          )}
                          <button
                            onClick={() => { handleArchive(note.id); setMenuOpen(null); }}
                            className="block w-full text-left px-3 py-2 text-body text-ink hover:bg-canvas"
                          >
                            Archive
                          </button>
                          <button
                            onClick={() => { handleDelete(note.id); setMenuOpen(null); }}
                            className="block w-full text-left px-3 py-2 text-body text-red-500 hover:bg-canvas"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => { handleUnarchive(note.id); setMenuOpen(null); }}
                            className="block w-full text-left px-3 py-2 text-body text-ink hover:bg-canvas"
                          >
                            Unarchive
                          </button>
                          <button
                            onClick={() => { handlePermanentDelete(note.id); setMenuOpen(null); }}
                            className="block w-full text-left px-3 py-2 text-body text-red-500 hover:bg-canvas"
                          >
                            Delete forever
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Close menu on outside click */}
      {menuOpen && (
        <div className="fixed inset-0 z-0" onClick={() => setMenuOpen(null)} />
      )}
    </div>
  );
}
