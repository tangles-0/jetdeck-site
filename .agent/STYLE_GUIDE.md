# Front-End Code Style Guide

This guide documents how engineers developing for Next.js / React should format and write
code in this project. It is centred around our Prettier configuration and a handful of
best practices enforced by convention and linting.

> **Canonical location in this project:** `.agent/STYLE_GUIDE.md`
> This root copy is the source of truth in the `agent-standards` submodule. Consuming repos
> reference it via `.agent/standards/STYLE_GUIDE.md` (submodule) or maintain their own
> copy in `.agent/STYLE_GUIDE.md`.

---

## Basic rule

**Use existing project UI primitives** from `src/components/ui/` when available, rather than
duplicating low-level element styling. Fall back to native elements when this site does not
provide a wrapper for that control.

---

## Formatting (Prettier)

Our Prettier settings are the source of truth for code layout:

```js
const prettierConfig = {
  trailingComma: "none",
  singleQuote: false,
  semi: false,
  printWidth: 120,
  singleAttributePerLine: true,
  arrowParens: "avoid",
  bracketSpacing: true,
  useTabs: false,
  tabWidth: 2,
  endOfLine: "lf",
  quoteProps: "as-needed"
}
```

### Rules & examples

- **Quotes:** double quotes

  ```js
  const title = "Hello"
  ```

- **Semicolons:** none

  ```js
  const x = 1
  ```

- **Line length:** wrap at 120 chars. Let Prettier break lines.

- **Arrow params:** no parens for a single parameter

  ```js
  const ids = users.map(u => u.id)
  ```

- **Object spacing:** spaces inside braces

  ```js
  const opts = { retry: 2, cache: true }
  ```

- **Props & commas:** no trailing commas; when JSX breaks across lines, **one attribute per line**

  ```tsx
  <Button
    type="button"
    disabled={isBusy}
    onClick={handleClick}
  />
  ```

- **Tabs/indent:** 2 spaces, LF line endings.

> Keep formatting consistent with nearby code. If a formatter script is added later, run it via `pnpm`.

---

## JavaScript & TypeScript Conventions

### Truthiness & booleans

- Prefer **`Boolean(value)`** over `!!value` for readability.

  ```ts
  // ✅
  const hasItems = Boolean(items?.length)

  // ❌
  const hasItems = !!(items && items.length)
  ```

- Prefer **nullish coalescing** over `||` for defaulting:

  ```ts
  const pageSize = incomingPageSize ?? 20 // preserves 0 as a valid value
  ```

- Use optional chaining instead of guarded property access:
  ```ts
  const name = user?.profile?.name
  ```

### Naming & declarations

- **Components:** PascalCase (`UserMenu`)
- **Hooks:** `useSomething`
- **Booleans:** prefix with `is*`, `has*`, or `can*` — applies to local variables, state,
  **and** component props. When a data source uses a bare name (e.g. `entry.expired`),
  rename at the prop boundary (e.g. `isExpired={entry.expired}`).

  ```tsx
  // ✅ Props
  type BannerProps = { isExpired: boolean; hasActions: boolean }

  // ✅ State / derived
  const isAdmin = user.role === "admin"
  const hasItems = Boolean(items?.length)

  // ❌ Bare boolean name on a prop or variable
  type BannerProps = { expired: boolean }
  const admin = user.role === "admin"
  ```

- **Constants:** use `const` by default
- **Enums/union types (TS):** prefer string literal unions over enums unless there's a clear need.

### Immutability

- Never mutate React state directly. Use spread/functional updates:
  ```ts
  setItems(prev => [...prev, next])
  ```

### Imports

- Group and order: built-ins → external → internal (absolute) → relative.
- Side-effect imports are placed at the very top, separated by a blank line.

---

## React & JSX

### Conditional rendering

- Prefer **ternaries** (or explicit `? … : null`), not bare `&&`, to avoid rendering `0`
  or empty strings:

  ```tsx
  // ✅
  {
    isLoading ? <Spinner /> : null
  }

  // ✅ readable for simple text
  {
    count > 0 ? <Badge>{count}</Badge> : null
  }

  // ❌ may render 0 if count is 0
  {
    count && <Badge>{count}</Badge>
  }
  ```

### Boolean props

- Pass booleans as booleans, not strings:

  ```tsx
  // ✅ Good: boolean value
  <Button disabled={isBusy} />

  // ❌ Bad: string value (will always disable the button) - Boolean("false") evaluates true
  <Button disabled="false" />
  ```

### Keys

- Keys must be **stable** and **unique**. Never use array index as a key when list order or
  contents can change.

  ```tsx
  // ✅ Good: key is a unique, stable identifier
  items.map(item => (
    <Row
      key={item.id}
      item={item}
    />
  ))

  // ❌ Bad: using array index, can break when items are reordered/removed/added
  items.map((item, idx) => (
    <Row
      key={idx}
      item={item}
    />
  ))

  // ❌ Bad: using a non-unique or unstable key (e.g., name can repeat or change)
  items.map(item => (
    <Row
      key={item.name}
      item={item}
    />
  ))
  ```

### Fragments & wrappers

- Prefer `<>...</>` for fragments. Avoid unnecessary wrappers such as a plain `<div>`.

### Props layout

- Keep props ordered: required → optional → event handlers → `className`/styling → `data-*`
  → test ids.

### Component declarations (shared app components)

- In shared component folders (outside `ui/` and Payload-specific files), define React components as
  **`export const ComponentName = (props) => { ... }`** (arrow functions assigned to
  `const`). Avoid `export function ComponentName(...) { ... }` so style matches App Router
  route modules and named exports stay uniform.
- **One `export const` component per file:** each file should contain exactly one exported
  React component. Additional `export type` (props, small shared shapes) in the same file
  is fine. For a set of related components use a **subfolder** with an optional `index.ts`
  re-exporting public names.
- **Not covered by this rule:** pure utilities returning non-JSX, custom hooks (`use*`),
  and anything under `ui/` or Payload-specific files.

  ```tsx
  // ✅
  export const KpiRow = ({ label, value }: KpiRowProps) => {
    return <div>{label}</div>
  }

  // ❌ in app components (outside ui/ + figma/)
  export function KpiRow({ label, value }: KpiRowProps) {
    return <div>{label}</div>
  }
  ```

### Class names

- Use a helper like `clsx` for conditional classes rather than string concatenation.

  ```tsx
  // ✅ Good: clear and avoids errors
  import clsx from "clsx"
  <div className={clsx("base", isActive && "active", isError && "error")} />

  // ❌ Bad: manual string concatenation is error-prone and hard to read
  <div className={"base" + (isActive ? " active" : "") + (isError ? " error" : "")} />
  ```

---

## Next.js App Router (`src/app`)

- **Route modules** (`page.tsx`, `layout.tsx`, and similar files inside route segments):
  use a **`const` arrow component** and a **separate default export**. Avoid
  `export default function RouteName() { ... }` and anonymous default exports.

  ```tsx
  const HomePage = () => {
    return <main>Home</main>
  }

  export default HomePage
  ```

  For layouts with props:

  ```tsx
  import type { ReactNode } from "react"
  import { Layout } from "../components/Layout"

  const DashboardShellLayout = ({ children }: { children: ReactNode }) => {
    return <Layout>{children}</Layout>
  }

  export default DashboardShellLayout
  ```

- **Thin routes:** prefer importing existing UI from your components folder so route files
  stay small and navigable.

---

## React Hooks: Best Practices

### The Rules of Hooks

- Only call hooks **at the top level** of React function components or **inside custom hooks**.
- Do not call hooks conditionally or in loops.
- **Extract reusable or non-visual logic into custom hooks:**

  ```tsx
  // ✅ Good: logic extracted to a hook
  function useCurrentUser() {
    const [user, setUser] = useState<User | null>(null)
    useEffect(() => {
      fetch("/api/me")
        .then(r => r.json())
        .then(setUser)
    }, [])
    return user
  }

  function UserProfile() {
    const user = useCurrentUser()
    if (!user) return <div>Loading...</div>
    return <div>{user.name}</div>
  }

  // ❌ Bad: logic and UI mixed together, harder to test and reuse
  function UserProfile() {
    const [user, setUser] = useState<User | null>(null)
    useEffect(() => {
      fetch("/api/me")
        .then(r => r.json())
        .then(setUser)
    }, [])
    if (!user) return <div>Loading...</div>
    return <div>{user.name}</div>
  }
  ```

- Don't extract trivial logic that is used only once.

### `useEffect` discipline

- Effects are for **synchronizing with the outside world** (DOM, subscriptions, timers,
  network) — not for deriving render-time data.

  ```tsx
  // ❌ Don't use effect to compute derived UI state
  useEffect(() => {
    setFullName(`${first} ${last}`)
  }, [first, last])

  // ✅ Derive at render
  const fullName = `${first} ${last}`
  ```

- Keep effects **minimal** and **specific**. Split large effects.
- Always **declare all dependencies**. Fix the code rather than disabling exhaustive-deps.
- **Cleanup** side effects:

  ```tsx
  useEffect(() => {
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [tick])
  ```

- **Avoid stale closures.** Use functional state updates or include reactive values in deps.
  ```tsx
  const onIncrement = useCallback(() => {
    setCount(c => c + 1)
  }, [])
  ```

### `useMemo` / `useCallback`

- Use sparingly for **expensive** computations or to maintain **referential stability** for
  memoized children. Don't memoize everything by default.

### `useRef`

- Use for mutable values that don't trigger re-renders (imperative handles, timeouts) and
  DOM element refs. Don't store derived values that belong in state.

### Data fetching

- Prefer a data-fetching abstraction (e.g., a custom `useQuery` hook or React Query) over
  ad-hoc `useEffect` + `fetch` scattered in components.
- Handle **loading**, **error**, and **empty** states explicitly.
- Abort/cancel on unmount to prevent setting state on unmounted components.

---

## Accessibility (a11y)

- Every interactive element must be keyboard accessible.
- Provide `aria-*` attributes where applicable and label controls correctly.
- All images need meaningful `alt` text; decorative images use `alt=""`.
- Don't use `div`/`span` for buttons or links.

---

## Internationalization (i18n)

- **Choose a library**: Use a well-supported i18n library compatible with your framework.
- **Avoid hardcoded text**: Never hardcode user-facing strings. Use message keys and
  translation files.
- **Static keys**: Prefer static message keys; avoid dynamic key generation.
- **Pluralization & formatting**: Always use i18n features for plurals, numbers, dates,
  currencies, etc. (do not hand-roll logic).
- **Default language**: English (`en`) unless the project specifies otherwise.

  ```tsx
  import { useTranslation } from "next-i18next"

  function Greeting({ userName }: { userName: string }) {
    const { t } = useTranslation("common")
    return <h1>{t("greeting.welcome", { userName })}</h1>
  }
  ```

## Testing

- Favor **behavioral tests** over implementation details.
- Test user-visible outcomes (text, ARIA roles, attributes).
- Mock network boundaries, not internal hooks.
- Pure functions should always have tests.

---

## Dialogs and modals

- **Reusable modal wrappers:** If your project defines a shared dialog shell for the common
  header + body + footer layout, prefer it over duplicating the raw dialog primitive tree.
- **Alert/confirm dialogs:** Use a dedicated confirmation component (`AlertDialog`,
  `ConfirmationModal`) for destructive or irreversible actions — these have distinct
  focus-trap and a11y behaviour.
- **Raw primitives:** Use the base dialog primitive (Radix `Dialog`, headlessui `Dialog`,
  etc.) only when the layout genuinely diverges from the project wrapper.
- **Scope:** Modal open/close state, validation, and toast side-effects stay in the page or
  hooks; the dialog component is presentation-only.

---

## File & Component Structure

- **One `export const` React component per `.tsx` file** in app components. Co-locate
  tests, `types.ts`, and helpers in the same folder:
  `SomeComponent/SomeComponent.tsx`, `SomeComponent.spec.ts`, `someComponentFunc.ts`.
- Prefer **named exports** unless a default export is required.
- Keep components focused. Split when a component exceeds ~200 lines or handles multiple
  responsibilities.

---

## Error Handling & Logging

- Fail fast with clear user messaging.
- Centralize error boundaries at layout/page level where possible.
- Use a logger for unexpected conditions; avoid `console.log` in committed code.
- Fail gracefully and include retry-ability where it improves the user experience.

---

## Example: putting it together

```tsx
// src/components/UserBadge.tsx
import { useMemo } from "react"
import clsx from "clsx"

type Props = {
  user: { id: string; name?: string | null; role?: "admin" | "member" }
  count?: number
  onClick?: () => void
  className?: string
}

export const UserBadge = ({ user, count = 0, onClick, className }: Props) => {
  const isAdmin = user.role === "admin"
  const initials = useMemo(
    () => (user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U"),
    [user.name]
  )

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "inline-flex items-center rounded px-2 py-1",
        isAdmin ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-800",
        className
      )}
      aria-label={`Open ${user.name ?? "user"} menu`}
    >
      <span className="mr-2">{initials}</span>
      {count > 0 ? <span className="ml-1 rounded bg-black/10 px-1 text-xs">{count}</span> : null}
    </button>
  )
}
```

---

## Linting to Pair with This Guide

Use ESLint with these plugins/rules to enforce the guidelines:

- `eslint:recommended`, `plugin:@typescript-eslint/recommended`
- `plugin:react/recommended`, `plugin:react-hooks/recommended`, `plugin:jsx-a11y/recommended`
- `eslint-plugin-import` (ordering), `eslint-plugin-unused-imports`
- Key rules:
  - Disallow bare `&&` in JSX conditional rendering.
  - Enforce `Boolean()` over `!!`.
  - Enforce import order groups.
  - No `any` without justification; consistent type imports.

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "plugins": ["import", "unused-imports"],
  "rules": {
    "react/jsx-key": "warn",
    "react/self-closing-comp": "warn",
    "react/jsx-boolean-value": ["warn", "never"],
    "react-hooks/exhaustive-deps": "warn",
    "import/order": [
      "warn",
      {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"]
      }
    ],
    "unused-imports/no-unused-imports": "warn"
  }
}
```

---

## Commit & PR Hygiene

- Small, focused commits with descriptive messages.
- Branch names: `feat/`, `fix/`, or `chore/` prefix.
- PRs include **what/why** and screenshots for UI changes.
- Run format and lint before pushing.