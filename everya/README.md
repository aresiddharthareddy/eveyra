# EVERYA

Structured knowledge for modern technical teams. Enterprise-grade technical documentation and publishing platform.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost](http://localhost) (port 80).

On first run, the app automatically:

- Creates `./db` and `./storage/uploads`
- Pushes the Prisma schema to SQLite (`./db/everya.db`)
- Seeds demo content

## Demo accounts

| Username | Email | Password |
|----------|-------|----------|
| @alex | alex@everya.dev | demo12345 |
| @infraops | ops@everya.dev | demo12345 |
| @kernel | kernel@everya.dev | demo12345 |

## Tech stack

- **Frontend:** Next.js 15+, React, TypeScript, Tailwind CSS, shadcn-style UI
- **Backend:** Next.js API routes
- **Database:** SQLite via Prisma (`./db/everya.db`)
- **Auth:** Better Auth (email/password, sessions)
- **State:** Zustand
- **Editor:** @uiw/react-md-editor with live preview
- **Search:** Local SQLite full-text style search

## Project structure

```
app/           # Next.js App Router pages & API routes
components/    # UI, layout, docs, comments, search
features/      # Feature modules (extensible)
lib/           # Auth, Prisma, utilities
services/      # Business logic
hooks/         # React hooks & Zustand stores
types/         # Shared TypeScript types
prisma/        # Schema & seed
db/            # SQLite database (gitignored)
storage/       # Local file uploads (gitignored)
scripts/       # DB initialization
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (auto DB setup) |
| `npm run build` | Production build |
| `npm run db:seed` | Re-seed demo data |
| `npm run db:reset` | Reset DB and re-seed |

## Environment

Copy `.env.example` to `.env`:

```
DATABASE_URL="file:./db/everya.db"
BETTER_AUTH_SECRET="change-me"
BETTER_AUTH_URL="http://localhost"
NEXT_PUBLIC_APP_URL="http://localhost"
```

## Features

- Authentication (signup, login, sessions, profiles)
- Public / Private / Enterprise repositories
- Nested folders & markdown documents
- Live markdown editor with image upload
- Threaded comments with likes
- Document ratings, likes, bookmarks
- Reader analytics & reading time
- CMD+K instant search
- Dark / light mode
- Responsive layout with collapsible sidebars

## License

Private — initial development version.
