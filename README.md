# JetDeck SCOUT Launch Site

One-page promo site for the JetDeck SCOUT, built with **Next.js + Payload CMS**.
All page text and images are editable in the Payload admin panel at `/admin` —
no rebuild or redeploy needed to change content.

## Stack

- **Next.js** (App Router) — frontend
- **Payload CMS 3** — embedded in the same app, admin at `/admin`
- **Postgres** — content database (Neon in production)
- **Vercel Blob** — image storage in production (local `./media` folder in dev)
- **Tailwind CSS v4** + shadcn/ui components

## Local development

```bash
pnpm install
cp .env.example .env   # then fill in the values
```

You need a Postgres database. Easiest local option:

```bash
docker run -d --name jetdeck-pg -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=jetdeck -p 55432:5432 postgres:17-alpine
# DATABASE_URI=postgres://postgres:postgres@localhost:55432/jetdeck
```

Then:

```bash
pnpm payload migrate   # create the database tables
pnpm seed              # load the original site content + images into the CMS
pnpm dev               # http://localhost:3000 (admin at /admin)
```

On first visit to `/admin` you'll be prompted to create your admin user.

## Editing content

Everything lives in **Site Content** (a Payload "global") in the admin panel,
organised into tabs: Hero, Quick Stats, What Is It, Tech Specs, About, CTA & Footer.
Carousel images are uploads in the **Media** collection — drop in a new image,
hit save, and the home page revalidates instantly.

## Deployment (Vercel + Neon + Vercel Blob)

1. **Neon** — create a project, copy the *pooled* connection string.
2. **Vercel** — import this repo. In project settings:
   - Add a **Blob store** (Storage tab) — this auto-creates `BLOB_READ_WRITE_TOKEN`.
   - Set environment variables:
     - `DATABASE_URI` — the Neon connection string
     - `PAYLOAD_SECRET` — generate with `openssl rand -hex 32`
3. Deploy. The `vercel-build` script runs database migrations automatically
   before each build.
4. Visit `https://your-site.vercel.app/admin`, create your admin user, then run
   the seed locally against production to load the initial content:

   ```bash
   DATABASE_URI=<neon-uri> PAYLOAD_SECRET=<secret> BLOB_READ_WRITE_TOKEN=<token> pnpm seed
   ```

### Schema changes

If you change collections/globals in `src/`, create a migration and commit it:

```bash
pnpm payload migrate:create my_change
pnpm payload migrate          # apply locally
pnpm generate:types           # refresh src/payload-types.ts
```

Production migrations run automatically during the Vercel build.

## Useful scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Dev server with hot reload |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm seed` | Seed CMS with the original site content (skips if already seeded; `FORCE_SEED=true` to overwrite) |
| `pnpm payload migrate` | Run pending DB migrations |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` from the Payload config |
