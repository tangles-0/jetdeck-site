# Agent guide — how to use these docs

This folder (`.agent/`) is the canonical source for project standards. Any AI assistant
(Claude, Codex, Cursor, etc.) should read and follow these files before making
changes to the codebase.

## Doc map

| File | When to read |
|------|-------------|
| [`FRONTEND_CHECKLIST.md`](./FRONTEND_CHECKLIST.md) | Any change to TS, TSX, JS, or JSX — quick reference |
| [`STYLE_GUIDE.md`](./STYLE_GUIDE.md) | Need the rationale, full examples, or ESLint config |
| [`ENGINEERING_STANDARDS.md`](./ENGINEERING_STANDARDS.md) | Commits, branches, CI, supply-chain security, testing |

## Workflow

1. **Before any code change:** confirm the relevant doc has been read this session.
2. **Formatting:** keep code aligned with the project's existing style. If a formatter
   script is added later, run it via `pnpm`.
3. **Checks:** run the relevant available project checks and resolve all new violations
   introduced by your changes.
4. **Missing docs:** if any file in the table above is absent, flag the gap before
   proceeding with feature work.
5. **Outdated docs:** if the docs feel inconsistent with actual code patterns, flag it to
   the user and suggest `git submodule update --remote .agent/standards` if applicable.

## What goes here vs. root AGENTS.md

- **`.agent/`** — detailed, stable reference docs (style guide, standards, component
  inventory). Agents read these; humans edit them here.
- **Root `AGENTS.md`** — the entry point: package manager, framework docs index,
  project-specific overrides, and links to this folder. Keep it thin.

## What NOT to put here

- Ephemeral task notes or in-progress plans — those belong in PRs or commit messages.
- Secrets, credentials, or environment values.
- Auto-generated files — generate them in a `scripts/` or `dist/` folder instead.