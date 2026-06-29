import { describe, it, expect } from "vitest";

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

describe("reading time computation", () => {
  it("returns null for empty content", () => {
    expect(computeReadingTime(null)).toBeNull();
  });

  it("returns null for empty object", () => {
    expect(computeReadingTime({})).toBeNull();
  });

  it("returns 1 for content under 225 words", () => {
    const content = {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "hello world" }] },
      ],
    };
    expect(computeReadingTime(content)).toBe(1);
  });

  it("returns 2 for content with 450 words", () => {
    const words = Array.from({ length: 450 }, (_, i) => `word${i}`).join(" ");
    const content = {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: words }] },
      ],
    };
    expect(computeReadingTime(content)).toBe(2);
  });

  it("strips TipTap JSON markup before counting", () => {
    const content = {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Heading" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "bold text" }] },
      ],
    };
    // Words: "Heading" + "bold" + "text" = 3 words
    const expected = Math.ceil(3 / 225);
    expect(computeReadingTime(content)).toBe(expected);
  });
});
