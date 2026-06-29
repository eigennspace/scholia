"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import FloatingToolbar from "./floating-toolbar";

interface TipTapEditorProps {
  noteId: string;
  initialTitle: string;
  initialContent: Record<string, unknown>;
  categoryName?: string;
  readingTime?: number | null;
}

export default function TipTapEditor({
  noteId,
  initialTitle,
  initialContent,
  categoryName,
  readingTime: initialReadingTime,
}: TipTapEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [readingTime, setReadingTime] = useState<number | null>(initialReadingTime ?? null);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({ placeholder: "Start writing..." }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "prose prose-lg font-serif text-reading leading-reading focus:outline-none max-w-none",
      },
    },
  });

  const doSave = useCallback(async () => {
    if (!editor) return;
    setSaving(true);

    const content = editor.getJSON();
    const formData = new FormData();
    formData.append("noteId", noteId);
    formData.append("title", title);
    formData.append("content", JSON.stringify(content));

    try {
      const { saveNote } = await import("@/features/notes/actions/save");
      const result = await saveNote({}, formData);
      if (result.success) {
        setLastSaved(new Date());
        if (result.readingTime !== undefined) setReadingTime(result.readingTime);
      }
    } catch (e) {
      console.error("Save failed", e);
    } finally {
      setSaving(false);
    }
  }, [editor, noteId, title]);

  const handleSave = useCallback(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(doSave, 1000);
  }, [doSave]);

  useEffect(() => {
    if (!editor) return;
    editor.on("update", handleSave);
    return () => { editor.off("update", handleSave); };
  }, [editor, handleSave]);

  return (
    <div>
      {/* Metadata bar */}
      <div className="flex items-center gap-stack-md text-label text-muted mb-stack-md">
        {categoryName && <span className="text-caps uppercase">{categoryName}</span>}
        {readingTime ? <span>{readingTime} min read</span> : <span>&mdash;</span>}
        <span className="ml-auto">
          {saving ? "Saving..." : lastSaved ? "Saved" : ""}
        </span>
      </div>

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => { setTitle(e.target.value); handleSave(); }}
        placeholder="Title"
        className="w-full font-serif text-headline font-bold text-ink bg-transparent border-none focus:outline-none mb-stack-md placeholder:text-muted/50"
      />

      {/* Toolbar */}
      <FloatingToolbar editor={editor} />

      {/* Editor */}
      <div className="min-h-[60vh]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
