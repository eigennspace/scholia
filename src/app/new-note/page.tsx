"use client";

import { createNote } from "@/features/notes/actions/create";
import { useRouter } from "next/navigation";
import Link from "next/link";

const categories = [
  { id: "knowledge", name: "Knowledge", icon: "📚", description: "Research, ideas, learning" },
  { id: "work", name: "Work", icon: "💼", description: "Projects, meetings, tasks" },
];

const templates = [
  { id: "blank", name: "Blank Page", icon: "📄", comingSoon: false },
  { id: "project-brief", name: "Project Brief", icon: "📋", comingSoon: false },
  { id: "research-note", name: "Research Note", icon: "🔬", comingSoon: false },
];

export default function NewNotePage() {
  const router = useRouter();

  async function handleCategorySelect(categorySlug: string) {
    const note = await createNote(categorySlug);
    router.push(`/editor/${note.id}`);
  }

  function handleTemplateSelect(templateId: string) {
    if (templateId === "project-brief" || templateId === "research-note") {
      router.push(`/editor/new?template=${templateId}`);
    } else {
      handleCategorySelect("knowledge");
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-stack-lg py-stack-xl">
      <h1 className="font-serif text-headline font-bold text-ink mb-2">Start a new piece</h1>
      <p className="text-body text-muted mb-stack-xl">Where does this idea belong?</p>

      <h2 className="text-subheading font-serif font-bold text-ink mb-stack-md">Category</h2>
      <div className="grid grid-cols-2 gap-stack-md mb-stack-xl">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.id)}
            className="border border-border rounded-btn p-stack-lg text-left hover:border-ink transition-colors"
          >
            <div className="text-2xl mb-stack-sm">{cat.icon}</div>
            <div className="text-body font-medium text-ink">{cat.name}</div>
            <div className="text-label text-muted">{cat.description}</div>
          </button>
        ))}
      </div>

      <h2 className="text-subheading font-serif font-bold text-ink mb-stack-md">Templates</h2>
      <div className="grid grid-cols-3 gap-stack-md mb-stack-xl">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => handleTemplateSelect(tpl.id)}
            disabled={tpl.comingSoon}
            className="border border-border rounded-btn p-stack-lg text-left hover:border-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-2xl mb-stack-sm">{tpl.icon}</div>
            <div className="text-body font-medium text-ink">{tpl.name}</div>
            {tpl.comingSoon && <div className="text-caps text-muted">Coming soon</div>}
          </button>
        ))}
      </div>

      <div className="text-center mt-stack-xl">
        <Link href="/library" className="text-primary text-body hover:underline">
          Browse Library &rarr;
        </Link>
      </div>

      <p className="text-center text-muted italic font-serif mt-stack-xl text-body">
        "The secret of getting ahead is getting started."
      </p>
    </div>
  );
}
