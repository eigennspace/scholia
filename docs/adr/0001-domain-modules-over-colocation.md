# ADR-0001: Domain modules over App Router colocation

We structure the Next.js project by domain (`src/features/`) rather than the default Next.js colocation pattern where everything lives inside `src/app/`. Next.js encourages colocating pages, components, and lib inside the App Router directory. We chose the opposite: the App Router is a thin routing layer; domain logic lives in `src/features/auth/`, `src/features/notes/`, etc.

**Status**: accepted

## Considered options

- **Next.js default** — `src/app/` contains routes, server actions, components, and data access mixed together. What the docs show.
- **Domain modules** — App Router holds only `page.tsx` and `layout.tsx`. All domain logic (components, server actions, validation, types) lives in `src/features/<domain>/`.
- **Monorepo packages** — separate packages per domain in a monorepo. Overkill for a single-user app.

## Why

- Domain modules make it easy to find all code related to a feature. Colocation scatters it across routing directories.
- When a file is deleted from App Router in a refactor, its colocated logic goes with it — easy to accidentally lose domain code.
- Server Actions co-located with their domain module are testable without routing through a route handler.
- The App Router structure changes more frequently than domain boundaries. Separating them reduces churn.

## Consequences

- Developers must decide which domain a piece of code belongs to. Incorrect placement creates confusion.
- Shared code (UI primitives, lib utilities) must live outside any domain module to prevent circular dependencies.
- New contributors familiar with Next.js conventions will find this unfamiliar and need to adjust.
