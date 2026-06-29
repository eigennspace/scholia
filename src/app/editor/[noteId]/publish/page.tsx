"use client";

import { useActionState } from "react";
import { useParams, useRouter } from "next/navigation";
import { publishNote, type PublishState } from "@/features/notes/actions/publish";
import { useState } from "react";

export default function PublishPage() {
  const params = useParams<{ noteId: string }>();
  const router = useRouter();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [scheduleMode, setScheduleMode] = useState(false);

  const [state, action, pending] = useActionState<PublishState, FormData>(publishNote, {});

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  }

  function removeTag(t: string) {
    setTags(tags.filter((x) => x !== t));
  }

  return (
    <div className="flex min-h-screen bg-canvas">
      <div className="max-w-3xl mx-auto px-stack-lg py-stack-xl w-full">
        <button
          onClick={() => router.back()}
          className="text-label text-muted hover:text-ink mb-stack-lg"
        >
          &larr; Back to editor
        </button>

        <div className="grid grid-cols-2 gap-stack-xl">
          {/* Left — Preview */}
          <div>
            <h2 className="text-subheading font-serif font-bold text-ink mb-stack-md">Story Preview</h2>
            <div className="border border-border rounded-btn p-stack-lg bg-paper">
              <div className="w-full h-32 bg-canvas mb-stack-md flex items-center justify-center text-muted text-label">
                Featured image
              </div>
              <div className="font-serif text-body font-bold text-ink mb-1">Title</div>
              <div className="text-body text-muted line-clamp-3">
                Your story description will appear here.
              </div>
              <div className="text-label text-muted mt-stack-sm">
                by {typeof window !== "undefined" ? "You" : "Author"}
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div>
            <h2 className="text-subheading font-serif font-bold text-ink mb-stack-md">Publish Settings</h2>

            <form action={action} className="space-y-stack-md">
              <input type="hidden" name="noteId" value={params.noteId} />
              <input type="hidden" name="tags" value={JSON.stringify(tags)} />

              <div>
                <label htmlFor="description" className="block text-label text-muted mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="w-full border border-border rounded-btn p-2 text-body text-ink bg-transparent focus:outline-none focus:border-ink resize-none"
                  placeholder="A short description of your story..."
                />
              </div>

              <div>
                <label htmlFor="coverImage" className="block text-label text-muted mb-1">Featured image URL</label>
                <input
                  id="coverImage"
                  name="coverImage"
                  type="text"
                  className="w-full border-b border-border py-2 text-body text-ink bg-transparent focus:outline-none focus:border-ink"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-label text-muted mb-1">Tags</label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 bg-canvas border border-border px-2 py-0.5 text-label rounded-tag">
                      {t}
                      <button type="button" onClick={() => removeTag(t)} className="text-muted hover:text-ink">&times;</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    className="flex-1 border-b border-border py-1 text-body text-ink bg-transparent focus:outline-none focus:border-ink"
                    placeholder="Type tag and press Enter"
                  />
                </div>
              </div>

              {state?.errors?.tags && <p className="text-sm text-red-500">{state.errors.tags[0]}</p>}
              {state?.message && <p className="text-sm text-red-500">{state.message}</p>}

              {scheduleMode ? (
                <div>
                  <label htmlFor="scheduledAt" className="block text-label text-muted mb-1">Schedule date & time</label>
                  <input
                    id="scheduledAt"
                    name="scheduledAt"
                    type="datetime-local"
                    className="w-full border border-border rounded-btn p-2 text-body text-ink bg-transparent focus:outline-none focus:border-ink"
                  />
                  <div className="flex gap-stack-sm mt-stack-md">
                    <button
                      type="submit"
                      disabled={pending}
                      className="bg-primary text-white px-4 py-2 rounded-btn text-label font-medium disabled:opacity-50"
                    >
                      {pending ? "Scheduling..." : "Schedule"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setScheduleMode(false)}
                      className="border border-border text-ink px-4 py-2 rounded-btn text-label"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-stack-sm">
                  <button
                    type="submit"
                    disabled={pending}
                    className="w-full bg-primary text-white py-3 rounded-btn text-body font-medium disabled:opacity-50"
                  >
                    {pending ? "Publishing..." : "Publish Now"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleMode(true)}
                    className="w-full border border-border text-ink py-3 rounded-btn text-body font-medium"
                  >
                    Schedule for later
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
