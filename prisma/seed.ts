import { PrismaClient, NoteStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed Categories
  const knowledge = await prisma.category.upsert({
    where: { slug: "knowledge" },
    update: {},
    create: { name: "Knowledge", slug: "knowledge" },
  });

  const work = await prisma.category.upsert({
    where: { slug: "work" },
    update: {},
    create: { name: "Work", slug: "work" },
  });

  console.log(`Seeded categories: ${knowledge.name}, ${work.name}`);

  // Seed Templates (no author — they're system-owned)
  const blankPage = await prisma.note.upsert({
    where: { id: "template-blank" },
    update: {},
    create: {
      id: "template-blank",
      title: "Blank Page",
      content: { type: "doc", content: [{ type: "paragraph" }] },
      status: NoteStatus.DRAFT,
      isTemplate: true,
    },
  });

  const projectBrief = await prisma.note.upsert({
    where: { id: "template-project-brief" },
    update: {},
    create: {
      id: "template-project-brief",
      title: "Project Brief",
      content: {
        type: "doc",
        content: [
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Context" }] },
          { type: "paragraph", content: [{ type: "text", text: "What problem are we solving?" }] },
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Goals" }] },
          { type: "paragraph", content: [{ type: "text", text: "What does success look like?" }] },
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Requirements" }] },
          { type: "bulletList", content: [
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Requirement 1" }] }] },
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Requirement 2" }] }] },
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Requirement 3" }] }] },
          ]},
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Timeline" }] },
          { type: "paragraph", content: [{ type: "text", text: "Key milestones and deadlines." }] },
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Success Criteria" }] },
          { type: "paragraph", content: [{ type: "text", text: "How will we measure success?" }] },
        ],
      },
      status: NoteStatus.DRAFT,
      isTemplate: true,
      categoryId: knowledge.id,
    },
  });

  const researchNote = await prisma.note.upsert({
    where: { id: "template-research-note" },
    update: {},
    create: {
      id: "template-research-note",
      title: "Research Note",
      content: {
        type: "doc",
        content: [
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Core Idea" }] },
          { type: "paragraph", content: [{ type: "text", text: "What is the central thesis?" }] },
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Key Questions" }] },
          { type: "orderedList", content: [
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Question 1" }] }] },
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Question 2" }] }] },
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Question 3" }] }] },
          ]},
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Findings" }] },
          { type: "paragraph", content: [{ type: "text", text: "What have you discovered?" }] },
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "References" }] },
          { type: "paragraph", content: [{ type: "text", text: "Sources and citations." }] },
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Open Questions" }] },
          { type: "paragraph", content: [{ type: "text", text: "What remains unanswered?" }] },
        ],
      },
      status: NoteStatus.DRAFT,
      isTemplate: true,
      categoryId: knowledge.id,
    },
  });

  console.log(`Seeded templates: ${blankPage.title}, ${projectBrief.title}, ${researchNote.title}`);
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
