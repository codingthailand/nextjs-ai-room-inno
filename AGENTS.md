<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Commands

```bash
npm run dev        # dev server on :3000
npx prisma generate # REQUIRED after npm install or any schema change
npm run build      # production build
npm run lint       # eslint (flat config)
npx tsc --noEmit   # typecheck (no separate script)
```

No test framework is configured. There is no CI.

# Environment & database

- Copy/create `.env` manually (README mentions `.env.example`, but it doesn't exist): needs `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`.
- Database is MariaDB 11.8 in Docker — container command is in `docs/install_mariadb_with_docker.txt`; sample schema/seed SQL in `docs/*.sql`.
- Prisma 7 does **not** auto-load `.env`; `prisma.config.ts` loads it via `dotenv/config`.

# Prisma 7 specifics (differs from training data)

- Generator is `prisma-client` (not `prisma-client-js`) outputting to `generated/prisma` (gitignored). Import models from that path (`@/lib/prisma.ts` uses `../../generated/prisma/client`), never from `@prisma/client`.
- Uses a driver adapter: `PrismaMariaDb` from `@prisma/adapter-mariadb` passed to `new PrismaClient({ adapter })`. Singleton lives in `src/lib/prisma.ts`.
- `prisma/schema.prisma` currently contains only the four better-auth models (User/Session/Account/Verification). E-commerce tables exist only as raw SQL in `docs/`; code like `src/app/(front)/product/page.tsx` queries `prisma.product`, so `tsc` fails until those models are added to the schema.

# Next.js 16: Cache Components

- `cacheComponents: true` in `next.config.ts`. All current routes opt out via `export const instant = false` (marked TODO for migration).
- Runtime data reads must be cached (`"use cache"`), wrapped in `<Suspense>`, or preceded by `await connection()` from `next/server` in an opted-out route — otherwise prerender validation errors. See guides under `node_modules/next/dist/docs/01-app/02-guides/` (caching, instant-navigation).

# Architecture

- App Router with two route groups: `(auth)` (login/signup) and `(front)` (main site + its own components dir). Only API route is the better-auth catch-all at `src/app/api/auth/[...all]/route.ts`.
- Auth: better-auth — server config `src/lib/auth.ts` (Prisma adapter, email/password), React client `src/lib/auth-client.ts`.
- Cart state: zustand store in `src/lib/cart-store.ts`.
- UI: shadcn/ui (`radix-rhea` style per `components.json`), Tailwind v4 CSS-first config in `src/app/globals.css`, icons from lucide/remixicon. Path alias `@/*` → `src/*`.
- Prisma `Decimal` fields must be converted with `Number()` before passing to Client Components (see product page pattern).

# Gotchas

- `Dockerfile` copies `.next/standalone`, but `next.config.ts` does not set `output: "standalone"` — add it or the Docker build breaks at the runner stage.
