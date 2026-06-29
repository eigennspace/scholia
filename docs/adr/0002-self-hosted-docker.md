# ADR-0002: Self-hosted Docker over Vercel

We self-host Scholia via Docker rather than deploying on Vercel, the default platform for Next.js apps. Vercel is the path of least resistance for Next.js — zero-config deploys, preview deployments, edge functions, managed Postgres. We chose Docker instead.

**Status**: accepted

## Considered options

- **Vercel** — zero-config deploys, built-in CI previews, edge functions, managed Postgres via Neon integration. Free hobby tier covers MVP. But: lock-in to Vercel's platform, no control over runtime, cannot customize server configuration, costs scale non-linearly, local filesystem requires object storage from day one.
- **Other PaaS (Railway, Fly.io)** — less lock-in than Vercel, but still platform-dependent. Railway offers managed Postgres. Fly.io offers global regions.
- **Self-hosted Docker** — full control, portable across any host (VPS, bare metal, cloud VM), no platform lock-in, predictable flat cost, local filesystem works naturally, fits the "digital sanctuary" ethos of owning your data.

## Why

- Scholia is a personal knowledge hub. Users should own their data and runtime completely. Self-hosting aligns with this value.
- Local filesystem storage works naturally with Docker volumes — no need for object storage abstraction at MVP scale.
- Flat infrastructure cost regardless of usage volume. No surprise bills.
- Docker Compose for dev and production means identical environments — the closest thing to "works on my machine" that actually works.
- Portability: can migrate between hosts with a single `docker compose up`.
- Next.js runs fine in a container for a single-user app. The Vercel-specific features (ISR, edge functions) are optimizations, not requirements.

## Consequences

- More operational overhead: managing the host, TLS certificates, database backups, OS updates.
- No preview deployments per branch — need a separate CI strategy for review.
- Must manage Postgres upgrades, migrations, and backups manually.
- No edge functions — all logic runs in a single Node.js process.
- Must set up and maintain reverse proxy (nginx/Caddy/Traefik) for TLS and domain routing.
- Docker image builds are slower than Vercel's incremental builds for large apps.
