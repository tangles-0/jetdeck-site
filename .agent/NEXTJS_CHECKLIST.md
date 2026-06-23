# Next.js style checklist (all agents)

Apply the following to **all new and changed** Next.js / React code.

Full narrative and examples: [`STYLE_GUIDE.md`](./STYLE_GUIDE.md) and
[`FRONTEND_CHECKLIST.md`](./FRONTEND_CHECKLIST.md).

---

## Architecture — Server-first, App Router

```
app/
  (auth)/          Route group — layout shared without URL segment
  api/             Route Handlers — auth + validation only, no business logic
  components/      Shared UI and existing UI primitives
  lib/             Data access, utilities, server actions
  hooks/           Client-side hooks (always add "use client" to files that import)
  types/           Shared TypeScript interfaces
```

- **Server Components first.** Use `"use client"` only when the component needs
  interactivity, browser APIs (`window`, `localStorage`), or event handlers.
- **Keep `"use client"` at the leaf.** Never mark a top-level layout or root page as
  a Client Component — it forces the entire subtree to hydrate on the client.
- **No business logic in Route Handlers.** Validate input, check auth, delegate to
  `lib/` functions, return a structured response.

---

## Server vs Client boundary

| Need | Server Component | Client Component |
|------|-----------------|-----------------|
| Fetch data from DB / API | ✅ | avoid |
| Access cookies / headers | ✅ | avoid |
| Render static / read-only UI | ✅ | avoid |
| `onClick`, `onChange`, event handlers | — | ✅ |
| `useState`, `useEffect`, hooks | — | ✅ |
| Browser APIs (`window`, `navigator`) | — | ✅ |
| Sensitive env vars | ✅ | ❌ never |

**Non-serializable props cannot cross the RSC boundary.** Only plain objects, arrays,
strings, numbers, booleans, and `null` may be passed from Server to Client Components
as props. Never pass class instances, Dates, Maps, Sets, or functions.

---

## Data fetching

```tsx
// ✅ Server Component — fetch directly, no useEffect
export default async function ItemsPage() {
  const items = await getItems()
  return <ItemList items={items} />
}

// ✅ Server Action — validate + auth + return structured data
"use server"
export async function createItem(input: unknown) {
  const session = await getSession()
  if (!session) throw new Error("Unauthorized")
  const data = ItemCreateSchema.parse(input)
  return await db.items.create({ data })
}

// ❌ Never use useEffect to load data that Server Components can fetch
useEffect(() => { fetch("/api/items").then(...) }, [])
```

- **Server Actions** must validate all input with Zod (or equivalent), check
  authentication, handle errors, and return only serializable data.
- **Route Handlers** must check auth, validate input, use correct HTTP methods, and
  return structured error responses.
- **TanStack Query** (if used): use stable, descriptive query keys; set `staleTime`
  explicitly; call `queryClient.invalidateQueries()` after mutations; handle `error`
  and `isPending` states in every consumer.
- After any mutation, call `revalidatePath()` or `revalidateTag()` for the affected
  data — never let stale cached data serve a user who just modified the data.

---

## Forms and validation

```tsx
// ✅ Zod schema + React Hook Form + zodResolver
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const ItemSchema = z.object({
  name: z.string().min(1).max(255),
  count: z.number().int().min(0),
})
type ItemFormData = z.infer<typeof ItemSchema>

export const ItemForm = () => {
  const form = useForm<ItemFormData>({ resolver: zodResolver(ItemSchema) })
  ...
}
```

- **Client-side validation is UX only.** Server Actions and Route Handlers must
  independently validate all inputs — never trust the client's Zod check.
- Surface all field-level validation errors to the user.
- On optimistic update failure, roll back state and show an error.

---

## Auth and session

- **Middleware + per-route guard.** Never rely on client-side redirects as the
  security mechanism — a user can disable JS.
- **Every Server Action re-validates the session.** The calling component having
  already checked auth is not sufficient.
- **M2M / service-to-service tokens** must be cached until expiry — not fetched on
  every request.
- **CSRF:** Server Actions use Next.js built-in CSRF protections. Route Handlers that
  accept mutations must validate the `Origin` header against the expected host.
- **Cookies:** session cookies must be `HttpOnly`, `Secure`, `SameSite=Strict` (or
  `Lax`).
- **RBAC is server-side.** Client-side permission checks control UI visibility only.

---

## Performance

```tsx
// ✅ next/image with sizes + priority
import Image from "next/image"
<Image src={src} alt={alt} sizes="(max-width: 768px) 100vw, 50vw" priority />

// ✅ next/font
import { Inter } from "next/font/google"
const inter = Inter({ subsets: ["latin"], display: "swap" })

// ✅ Dynamic import for heavy libraries
import dynamic from "next/dynamic"
const HeavyChart = dynamic(() => import("./HeavyChart"), { ssr: false })

// ✅ Suspense for slow data segments
<Suspense fallback={<Skeleton />}>
  <SlowDataComponent />
</Suspense>
```

- Use `next/image` for all images. Set `sizes` prop; set `priority` on above-the-fold
  images.
- Use `next/font` with `display: "swap"` and only the required subsets.
- Heavy third-party libraries (charts, map SDKs, rich-text editors, PDF renderers)
  must be dynamically imported — never in the critical path.
- Avoid waterfall requests. Use `Promise.all` for independent parallel fetches.

---

## Accessibility (quick reference)

- All interactive elements reachable and operable via keyboard.
- Every form input has an associated `<label>` or `aria-label`.
- All `<Image>` / `<img>` have descriptive `alt` text; decorative images use `alt=""`.
- Modals trap focus while open; focus returns to the trigger element on close.
- Colour contrast: minimum WCAG 2.1 AA (4.5:1 for normal text).

---

## Security (quick reference)

- No `dangerouslySetInnerHTML` without sanitization (DOMPurify or equivalent).
- Route Handlers that mutate state must validate the `Origin` header.
- No `redirect()` or `router.push()` with unvalidated user-controlled destination.
- No secrets in `NEXT_PUBLIC_*` environment variables.
- `pnpm audit` must pass with no Critical or High severity vulnerabilities.

---

## Production readiness

- `error.tsx` defined at the appropriate route segment level; errors caught, not swallowed.
- `not-found.tsx` and `global-error.tsx` defined.
- Unhandled errors reported to Sentry (or equivalent) — not console-only.
- `generateMetadata()` defined per page; `title` and `description` set dynamically.
- `robots.txt` blocks crawling of auth, admin, and staging routes.
- `next.config` security headers configured (CSP, X-Frame-Options, HSTS).
- All `NEXT_PUBLIC_*` variables reviewed; no secrets in the client bundle.
- GitHub Actions: action versions pinned to full commit SHA; OIDC for cloud credentials.

---

## Dev commands quick reference

```bash
pnpm install       # install dependencies
pnpm dev           # start dev server
pnpm build         # production build (type-check + lint)
pnpm start         # start production server
pnpm generate:types
pnpm generate:importmap
pnpm seed          # seed Payload content
```

---

## Review quick pass

- [ ] Every `"use client"` is justified — needs interactivity or browser API
- [ ] No data fetched with `useEffect` when a Server Component could fetch it
- [ ] All Server Actions validate input (Zod) and re-check auth
- [ ] Zod schema validated server-side independently of client validation
- [ ] `next/image` used for all images with `sizes` + `priority` on above-fold
- [ ] Heavy libraries dynamically imported
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] `revalidatePath()` or `revalidateTag()` called after mutations
- [ ] Error boundaries (`error.tsx`) at appropriate route segment level
- [ ] `pnpm audit` passes with no Critical/High vulnerabilities