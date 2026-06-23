# Engineering standards (all projects, all languages)

Language- and framework-agnostic conventions that apply to **every** repository,
regardless of stack (TypeScript, schema, infrastructure). Front-end-specific
rules live in [`FRONTEND_CHECKLIST.md`](./FRONTEND_CHECKLIST.md) and
[`STYLE_GUIDE.md`](./STYLE_GUIDE.md); this file is the shared baseline beneath them.

## Commits — Conventional Commits

- Format: `<type>(<scope>): <short description>`, with an optional body.
- Standard types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `ci`.
- A repo MAY add domain types where they aid review (e.g. a schema repo using
  `breaking:` / `additive:` / `internal:` for migration impact) — document them in that
  repo's `CLAUDE.md`. The base types above are always valid.
- Reference the tracking issue in the commit body where the project uses an issue tracker
  (e.g. `PROJ-123:`). Keep the subject line imperative and under ~72 characters.

## Branches and review

- `main` and `develop` are protected — no direct commits; changes land via PR.
- `release/**` and `hotfix/**` for releases and urgent fixes.
- Feature branches prefixed `feat/`, `fix/`, `chore/`, etc.
- Every PR needs at least one peer review approval before merge.
- PR description states what changed and why; include screenshots for UI changes.
- Run format + lint (and type-check where applicable) before pushing.

## Supply-chain security

- **Pin all external GitHub Actions to a full 40-character commit SHA** — never a tag or
  branch (`@v4`, `@main`). Enforced by [`scripts/check-pinned-actions.sh`](./scripts/check-pinned-actions.sh).
- **Pin all pre-commit hook repos by full commit SHA.** Update via `pre-commit autoupdate`.
- **Never hardcode secrets** in workflow YAML or committed config — use the platform secret
  store (GitHub Actions Secrets, cloud secret manager). The `detect-private-key` hook and a
  ≤500 KB added-file limit guard against accidental commits.
- Prefer CI federation (OIDC, short-lived credentials) over long-lived static keys.
- Keep a dependency-scanning path (SCA) and resolve critical advisories promptly.

## Git hooks (pre-commit)

Adopt the shared baseline in [`templates/pre-commit-baseline.yaml`](./templates/pre-commit-baseline.yaml),
then append the language-specific hooks your project needs. Install once per clone:

```bash
pre-commit install
pre-commit install --hook-type pre-push
```

The baseline runs cross-language file hygiene, Markdown formatting, GitHub Actions
SHA-pinning, and workflow-schema validation. Heavier checks (lint, type-check, schema
validation) typically run at `stages: [pre-push]`.

## CI expectations

- Pipeline-as-code; the same commands developers run locally run in CI.
- Validate workflow files themselves: `actionlint` + a workflow-security linter
  (e.g. `zizmor`), plus the SHA-pinning check above.
- Run the project's format-check, lint, type-check/validate, and tests on every PR and on
  pushes to protected branches.
- Security scanning appropriate to the stack: SAST, SCA (dependencies), and container image
  scanning where images are built.
- Production deploys go through staging and require a manual approval gate.

## Testing

- Tests ship in the same PR as the code they cover — not a follow-up.
- Cover the happy path per unit/endpoint plus the failure modes that matter; assert on
  user-visible or contract-level outcomes, not implementation details.
- Mock only true external boundaries (network, third-party services); prefer real
  in-process dependencies (e.g. a test database) where practical.