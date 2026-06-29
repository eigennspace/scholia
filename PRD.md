---
title: Scholia — Product Requirements Document
status: draft
---

# Scholia — Product Requirements Document

## Problem Statement

Knowledge workers, writers, and lifelong learners lack a digital space that combines the calm focus of an editorial publishing platform with the organization of a personal notebook. Existing tools are either too heavy (Notion-style all-in-one dashboards), too transactional (note-taking apps), or too public (Medium, Substack). Scholia fills the gap: a private digital sanctuary for long-form thinking, writing, and personal knowledge management — with the option to publish when ready.

## Solution

Scholia is a Medium-inspired personal knowledge hub. Users write in a distraction-free editor, organize notes into categories (Knowledge, Work, Important), schedule or publish them, and browse their library in editorial rows. The experience emphasizes calm writing, beautiful typography, and minimal UI chrome. Self-hosted, private by default, publish optional.

## User Stories

1. As a writer, I want to sign in with my email and password, so that my notes are private and only I can access them.
2. As a returning user, I want to reset my password if I forget it, so that I never lose access to my library.
3. As a writer, I want to see a dashboard when I sign in, so that I have an overview of my library and can navigate the app.
4. As a writer, I want to see a sidebar with navigation links (Write, Knowledge, Work, Important, Archive, Settings), so that I can move between sections quickly.
5. As a writer, I want a top bar with search, notifications, and a Write button, so that I can take action from anywhere.
6. As a writer, I want to see a hero section showing "The Reading Room" with my preserved idea count, so that I feel a sense of my accumulated knowledge.
7. As a writer, I want to filter my library by category (All Notes, Knowledge, Work, Important, Reading List), so that I can find notes by context.
8. As a writer, I want each note in my library displayed as an editorial row (thumbnail, title, excerpt, category, reading time, bookmark, overflow menu), so that I can browse content like a premium publication.
9. As a writer, I want to bookmark notes, so that I can return to important pieces later.
10. As a writer, I want to start a new note by selecting a category (Knowledge, Work, Important) and a template (Blank Page, Quick Journal, Project Brief, Research Note), so that I can begin writing with the right context.
11. As a writer, I want to write in a distraction-free editor, so that I can focus entirely on my words.
12. As a writer, I want the editor toolbar to appear only when I select text, so that the writing surface stays clean.
13. As a writer, I want to format my text with rich formatting (headings, bold, italic, links, blockquotes, lists), so that my notes have structure and style.
14. As a writer, I want to add images to my notes, so that my writing can include visual content.
15. As a writer, I want to see my estimated reading time as I write, so that I know how long my piece is.
16. As a writer, I want to save my note and see it appear in my library, so that I can track my work over time.
17. As a writer, I want to publish a note as a public story, so that I can share my writing with others.
18. As a writer, I want to schedule a story for later publication, so that I can plan my content release.
19. As a writer, I want to add a featured image, tags, and a description when publishing, so that my published story looks polished.
20. As a writer, I want to choose which collection a published story belongs to, so that I can group related content.
21. As a writer, I want to mark a note as important, so that I can prioritize key pieces.
22. As a writer, I want to archive notes I no longer need active, so that my library stays focused on current work.
23. As a writer, I want to search across my notes by title and excerpt, so that I can find content quickly.
24. As a reader, I want to view a published story in a clean typographic layout, so that reading is comfortable.
25. As a writer, I want to edit or delete my notes, so that I can maintain my library over time.
26. As a writer, I want the interface to be responsive, so that I can use Scholia on desktop, tablet, and mobile.
27. As a writer, I want keyboard navigation and visible focus states, so that I can use Scholia efficiently without a mouse.
28. As a developer, I want to run Scholia via Docker, so that I can self-host it anywhere.
29. As a developer, I want to run E2E tests covering the critical user flows, so that regressions are caught before deploy.
30. As a developer, I want structured logs, so that I can debug production issues.

## Implementation Decisions

### Tech Stack

- **Framework**: Next.js App Router with TypeScript
- **Database**: Postgres with Prisma ORM (connection: `localhost:5432`, database: `scholia`, user: `postgres`, password: `postgres`)
- **Styling**: Tailwind CSS v4 with shadcn/ui (reskinned to Scholia's editorial design tokens)
- **Auth**: NextAuth.js v5 with Prisma adapter. Email/password credentials provider initially. Google/Apple OAuth to be added later.
- **Editor**: TipTap (ProseMirror-based). Content stored as TipTap JSON in Prisma `Json` field. Toolbar hidden until text selection. Reading time computed on save, stored as integer minutes.
- **State Management**: Zustand, added only when component state becomes unwieldy with React built-ins.
- **Form Validation**: Zod, used in Server Actions for server-side validation.
- **Package Manager**: npm
- **Linting/Formatting**: Biome
- **Logging**: Pino (structured JSON logs to stdout for Docker collection)
- **Email**: Resend in production, Mailpit in development Docker Compose
- **HTTP Client**: Built-in `fetch` — no third-party library
- **Date Handling**: date-fns (tree-shakeable, TypeScript-native)
- **Search**: Prisma full-text search on title + excerpt fields

### Architecture

- **Project Structure**: Domain modules under `src/features/` (auth, notes, library, settings). Thin App Router layer under `src/app/`. Shared primitives under `src/components/`. Library utilities under `src/lib/`.
- **API Layer**: Server Actions for all mutations (create/update/delete notes, auth operations, settings). No REST API routes unless external-facing endpoints (RSS, public API) are needed later.
- **Data Model**: Core entities — User, Note (status: DRAFT / SCHEDULED / PUBLISHED / ARCHIVED), Category (Knowledge, Work, Important seeded), Tag, NoteTag, Bookmark, Collection. Templates implemented as seed data with `isTemplate` boolean flag.
- **Scheduling**: `scheduledAt` nullable timestamp on Note. If `scheduledAt > now` on publish, status set to SCHEDULED. Lightweight check flips past-due SCHEDULED → PUBLISHED on app init or via daily cron.
- **Storage**: Local filesystem wrapped behind an interface (e.g. `storage.upload(path, file)`, `storage.getUrl(path)`) so swapping to Uploadthing / S3 / Vercel Blob is a module swap, not a codebase refactor.
- **Deployment**: Self-hosted via Docker. Docker Compose for local dev (app + Postgres + Mailpit). Production Dockerfile for the Next.js app.

### Design Constraints

- Primary green: `#006E05`. Canvas: `#FAFAFA`. Paper: `#FFFFFF`. Primary text: `#242424`. Secondary text: `#6B6B6B`. Borders: `#E6E6E6`.
- Typography: Source Serif 4 (content), Inter (UI), JetBrains Mono (code). Display Large 48px, Reading Text 20px / 32px leading.
- Layout: Sidebar 280px, reading column max 720px. Spacing scale: stack-sm 8px / stack-md 16px / stack-lg 32px / stack-xl 64px.
- No shadows, no glassmorphism, no card grids. Prefer list layouts, tonal separation, subtle borders.
- Square corners for containers, 4px radius for buttons, 2px radius for tags.
- Green reserved exclusively for primary buttons, active navigation, success states, and important actions.

## Testing Decisions

- **Good test**: Tests external behavior (what happens), not implementation details (how it happens). A test should verify the observable outcome from the user's perspective or the system's contract. Avoid snapshot tests, avoid mocking Prisma except at the integration boundary.
- **Primary seam — E2E (Playwright)**: Full-stack tests running against real Postgres and a real Next.js server. Covers three mandatory flows: (1) sign up → create note → publish, (2) sign in → browse library → filter by category, (3) search → open note → edit → save. These run in CI on every push.
- **Secondary seam — Server Action integration tests (Vitest + test Postgres)**: Call Server Actions directly and verify Prisma writes, Zod validation errors, auth guards, and scheduling logic. Covers edge cases too expensive to test through the browser (duplicate email, malformed data, boundary dates).
- **Tertiary seam — Utility unit tests (Vitest)**: Pure logic only — date formatting, reading time calculation, storage interface contract tests.
- **Prior art**: No existing tests in the repository. The Playwright E2E for the write → publish flow is the first test to write, establishing the pattern for all future tests.

## Out of Scope

- Collaborative editing (multi-user on the same document)
- Mobile native apps (responsive web covers MVP)
- Public API / headless CMS endpoints
- Newsletter delivery or email subscriptions
- AI features (writing assistant, auto-tagging, summarization)
- Import from other platforms (Notion, Bear, Readwise)
- Dark mode
- Plugin system or extensions
- Analytics dashboard
- Teams, workspaces, or multi-user collaboration (v1 is single-user knowledge hub)

## Further Notes

- All 30 user stories must be demonstrable and testable before v1 launch.
- Design heuristic at every decision: "Would Medium do it this way?" If not, reconsider.
- The repo starts empty — each user story requires full implementation from scratch, seeded from the Master Specification at `Scholia_Master_Specification.md`.
