# Deploying Scholia

## Prerequisites

- Docker and Docker Compose
- A domain name pointing to your server
- DNS A record for your domain

## Quick Start

1. Clone the repository:
```bash
git clone git@github.com:eigennspace/scholia.git
cd scholia
```

2. Create environment file:
```bash
cp .env.example .env.prod
```

3. Edit `.env.prod` with your values:
   - `DATABASE_URL` — Postgres connection string
   - `AUTH_SECRET` — Run `openssl rand -base64 32`
   - `AUTH_URL` — `https://your-domain.com`
   - `NEXT_PUBLIC_APP_URL` — `https://your-domain.com`
   - `RESEND_API_KEY` — Your Resend API key (for email)

4. Update `Caddyfile` — replace `your-domain.com` with your actual domain.

5. Start the stack:
```bash
docker compose -f docker-compose.prod.yml up -d
```

6. Run database migrations:
```bash
docker compose -f docker-compose.prod.yml exec app npx prisma db push
```

7. Seed the database:
```bash
docker compose -f docker-compose.prod.yml exec app npx prisma db seed
```

Your site should now be live at `https://your-domain.com`.

## Updating

```bash
git pull
docker compose -f docker-compose.prod.yml build app
docker compose -f docker-compose.prod.yml up -d
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | Postgres connection string | `postgresql://postgres:postgres@postgres:5432/scholia` |
| `AUTH_SECRET` | NextAuth secret (generate with `openssl rand -base64 32`) | — |
| `AUTH_URL` | Public URL of the app | — |
| `NEXT_PUBLIC_APP_URL` | Public URL of the app | — |
| `RESEND_API_KEY` | Resend API key for transactional emails | — |
| `EMAIL_SERVER_HOST` | SMTP host | `mailpit` |
| `EMAIL_SERVER_PORT` | SMTP port | `1025` |
| `EMAIL_FROM` | From address for emails | `noreply@scholia.local` |

## Database Backups

Backup the Postgres volume:
```bash
docker compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres scholia > backup.sql
```

Restore:
```bash
cat backup.sql | docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres scholia
```
