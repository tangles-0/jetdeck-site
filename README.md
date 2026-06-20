# JetDeck SCOUT Site

Marketing site for JetDeck SCOUT, built with **Next.js + Payload CMS**.
Payload runs inside the same app, with the admin panel at `/admin`.

## Stack

- **Next.js** App Router for the frontend
- **Payload CMS 3** for pages, media, and admin editing
- **Neon Postgres** for the CMS database
- **Vercel Blob** for production media uploads
- **Tailwind CSS v4** and the existing shadcn/ui components

## Content Model

Pages live in the **Pages** collection. Each page has:

- `title` for organising pages in the CMS
- `path` for the public route, e.g. `/`, `/about`, `/specs`
- `showNavigation` to control whether that page renders the navbar
- `showInNav`, `navLabel`, and `navOrder` to manage navbar entries
- `layout`, a sortable list of content sections

Available page sections:

- Hero Section
- Single Image
- Photo Carousel
- CTA
- Text Block
- Quick Stats
- Detail Stat
- Specs Table
- CTA Container
- Footer, including optional sitemap-style link columns

Global navigation settings live in **Site Settings**. CMS-managed page links come
from pages with `showInNav` enabled, and extra external links can be added there.
The homepage can keep `showNavigation` disabled so it stays navbar-free.

Site Settings also has **Disable frontend page cache**. Turn it on while editing
from multiple environments (local + Vercel) so the frontend reads fresh CMS data
on each request. Turn it off when the site is stable and you want cached page data.

## Environment

```bash
pnpm install
cp .env.example .env
```

Set:

- `DATABASE_URI` to your Neon connection string
- `PAYLOAD_SECRET` to a generated secret, e.g. `openssl rand -hex 32`
- `BLOB_READ_WRITE_TOKEN` to your Vercel Blob token before seeding or uploading production media

The seed script refuses to seed a remote database without `BLOB_READ_WRITE_TOKEN`,
because that would store media files locally while writing media records to Neon.

## Development

```bash
pnpm payload migrate
pnpm dev
```

Visit `/admin` to create the first admin user, then create pages and arrange
sections in the page builder.

To load the original homepage content and images after Blob is configured:

```bash
pnpm seed
```

Use `FORCE_SEED=true pnpm seed` to replace an existing seeded homepage.

## Deployment

Vercel is the intended host:

1. Import the repo into Vercel.
2. Add a Vercel Blob store so `BLOB_READ_WRITE_TOKEN` is available.
3. Add `DATABASE_URI` and `PAYLOAD_SECRET`.
4. Deploy.

The `vercel-build` script runs `next build`. Run Payload migrations deliberately
before deploying schema changes.

## Schema Changes

When changing Payload collections, globals, or blocks:

```bash
pnpm payload migrate:create my_change
pnpm payload migrate
pnpm generate:types
pnpm generate:importmap
```

Commit the generated migration and `src/payload-types.ts`.

## Useful Scripts

- `pnpm dev` starts the Next.js dev server
- `pnpm build` builds the site
- `pnpm start` serves the production build
- `pnpm seed` seeds the original homepage content
- `pnpm payload migrate` runs pending DB migrations
- `pnpm generate:types` regenerates Payload TypeScript types
- `pnpm generate:importmap` regenerates the Payload admin import map
