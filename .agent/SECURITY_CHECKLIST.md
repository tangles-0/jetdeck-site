# Security checklist (all agents)

Apply the following to **all new and changed** code. Security issues found during review
cost more to fix than security issues prevented during development.

---

## Authentication

- Every endpoint (except explicitly exempt health checks) requires authentication.
- Auth middleware applies **before** all route handlers; it cannot be bypassed by path
  manipulation.
- Expired, revoked, or malformed tokens must be rejected — never allowed to pass.
- JWT validation must check: signature algorithm (reject `alg: none`), expiry (`exp`),
  issuer (`iss`), and audience (`aud`).
- API keys must be stored as hashed values (bcrypt / Argon2); never stored plaintext.
- Timing-safe comparison for secret comparison — not naive string equality.

---

## Authorization — RBAC and tenant isolation

- Every endpoint enforces a minimum permission level check on the server.
- Permission checks are **server-side only** — never trust role claims from the client
  without server-side validation.
- Client-side permission checks control **UI visibility only**; the server is the
  authority.

**Multi-tenant isolation (if applicable):**

```ts
// ✅ Every query scoped to tenant when tenant-scoped data exists
const item = await payload.findByID({
  collection: "items",
  id: itemId,
  overrideAccess: false,
  user
})

// ❌ Avoid bypassing Payload access controls in request-facing code
const item = await payload.findByID({
  collection: "items",
  id: itemId,
  overrideAccess: true
})
```

- Tenant context is extracted from the **validated token** — never from a user-supplied
  request parameter.
- Return `404` (not `403`) for resources belonging to another tenant — avoids enumerating
  existence.
- Every item in a batch request must be validated as belonging to the authenticated tenant
  before processing.

---

## OWASP API Top 10 — quick reference

| # | Category | Must-do |
|---|----------|---------|
| 1 | Broken Object Level Auth (BOLA/IDOR) | All resource lookups scoped to tenant; return 404 for other-tenant resources |
| 2 | Broken Authentication | All auth gaps from section above |
| 3 | Broken Object Property Level Auth | Response schemas never return fields the caller is not authorized to see |
| 4 | Unrestricted Resource Consumption | Enforce file size limits, pagination limits, rate limiting |
| 5 | Broken Function Level Auth | Admin-only endpoints not accessible to lower permission levels |
| 6 | Unrestricted Sensitive Business Flows | Bulk delete, export, role change require elevated permission + rate limiting |
| 7 | SSRF | User-supplied URLs validated against allowlist; private IP ranges blocked |
| 8 | Security Misconfiguration | No wildcard CORS; debug off in prod; no stack traces to clients |
| 9 | Improper Inventory Management | No undocumented endpoints; deprecated endpoints return `Deprecation` header |
| 10 | Unsafe Consumption of APIs | Outbound calls have timeouts; SSL verification enabled |

---

## Injection prevention

**SQL injection:**

```ts
// ✅ Payload query API builds safe queries
const result = await payload.find({
  collection: "posts",
  where: {
    slug: {
      equals: slug
    }
  }
})

// ❌ Never build raw SQL with interpolated user input
const result = await db.query(`SELECT * FROM posts WHERE slug = '${slug}'`)
```

- Dynamic `ORDER BY` columns must be validated against an explicit allowlist.
- Dynamic table or column name construction must not exist.

**Command injection:**

- Never use `eval`, `new Function`, shell execution, or dynamic imports with user-supplied
  input.
- If a server-side command is required, pass fixed command names and validated arguments;
  never concatenate user input into a shell string.

**Path traversal:**

- Validate user-supplied filenames against `..`, leading `/`, and null bytes before any
  filesystem operation.
- Archive extraction (ZIP, TAR) must check every inner entry for traversal sequences
  and symlinks before extracting.

**File upload:**

- Validate both extension and MIME type against an explicit allowlist.
- Validate file magic bytes (signature), not just extension.
- Enforce maximum file size **before** reading the body into memory.

---

## Secrets management

| Rule | What it means |
|------|---------------|
| No hardcoded secrets | No API keys, passwords, or tokens committed to source code |
| No secrets in `.env` committed to git | `.env.example` with placeholder values only |
| Secrets from secret store at runtime | AWS Secrets Manager, HashiCorp Vault, etc. |
| Startup validation | App must refuse to start if required secrets are missing or weak |
| Never log secrets | Secret values must never appear in log entries, even at DEBUG |
| No secrets in image layers | No build args with secrets; multi-stage builds only |

- Encryption keys: minimum 32 bytes; use AES-256 or equivalent; no DES, RC4, or MD5
  for security purposes.
- Access tokens: not stored in the database; only refresh tokens persisted (encrypted).

---

## CORS

```ts
// ✅ Explicit allowed origins
const allowedOrigins = ["https://example.com", "https://www.example.com"]

// ❌ Never allow wildcard origins for credentialed requests
const allowedOrigins = ["*"]
```

- `Access-Control-Allow-Origin: *` must never be used when `credentials: true` is set.
- Allowed origins must be an explicit list — not a prefix match or wildcard pattern.
- `expose_headers` should list only headers clients legitimately need to read.

---

## Rate limiting

- Rate limiting must be applied to all public endpoints — not just auth endpoints.
- Rate limiting state must be stored in Redis (or equivalent distributed store) — an
  in-process rate limiter does not work across multiple workers.
- Authentication endpoints must have strict rate limits (brute force protection).
- Rate limit responses must return `429` with a `Retry-After` header.
- `/healthz` and liveness probes must be exempt from rate limiting.
- Rate limit keys must include appropriate scope: per-IP, per-tenant, or per-user
  depending on the endpoint's sensitivity.

---

## Sensitive data in responses and logs

- Passwords, hashed credentials, and encryption keys must never appear in any response
  schema.
- Internal identifiers (AWS ARNs, account IDs, infrastructure paths) must not be
  returned to unprivileged clients.
- Error responses must use a structured envelope (RFC 7807 or equivalent) — never return
  raw exception messages, SQL fragments, or internal file paths.
- Request bodies must not be logged at `INFO` level or above (may contain credentials
  or PII).

---

## Next.js-specific

- `"use server"` functions (Server Actions) must re-validate the session on every call.
- Route Handlers that accept mutations must validate the `Origin` header against the
  expected host (CSRF protection).
- No secrets in `NEXT_PUBLIC_*` environment variables — these are bundled into the
  client.
- `dangerouslySetInnerHTML` is forbidden without explicit sanitization (DOMPurify or
  equivalent).
- Open redirect prevention: `redirect()` and `router.push()` with user-controlled
  destinations must be validated against an allowlist.
- Session cookies must be `HttpOnly`, `Secure`, and `SameSite=Strict` or `Lax`.

---

## Payload-specific

- Prefer Payload access control functions over ad-hoc permission checks in route handlers.
- Avoid `overrideAccess: true` in request-facing code unless the route has already performed
  an equivalent server-side authorization check.
- Keep admin routes and GraphQL endpoints behind the intended Payload auth model.
- Validate upload collections for file type, size, and storage destination before enabling
  public uploads.
- Keep `PAYLOAD_SECRET`, database credentials, and blob storage tokens server-only.

---

## Supply chain and dependencies

- All GitHub Actions pinned to **full commit SHA** — never use `@v3`, `@main`, or other
  mutable references.
- AWS / cloud credentials via **OIDC federation** — never use long-lived IAM access keys
  in CI.
- `pnpm audit` must pass with no Critical or High severity vulnerabilities before merge.
- Dependencies pinned to exact versions; no floating `>=` ranges on
  security-sensitive packages.

---

## Review quick pass

- [ ] Every non-health endpoint requires authentication
- [ ] Auth middleware cannot be bypassed by path manipulation
- [ ] All tenant-scoped data is enforced by Payload access control or equivalent filters
- [ ] Tenant context from validated token — not from user-supplied params
- [ ] Return 404 (not 403) for other-tenant resources
- [ ] No raw SQL or shell string interpolation with user input
- [ ] File uploads: allowlist for extension + MIME + magic bytes; size limit before body read
- [ ] No hardcoded secrets in source code or committed `.env` files
- [ ] App validates required secrets at startup
- [ ] CORS: no wildcard `*` origins when credentials are used
- [ ] Rate limiting on all public endpoints; Redis-backed
- [ ] All 4xx/5xx use structured error envelope (no raw exception messages)
- [ ] No `NEXT_PUBLIC_` variables containing secrets
- [ ] GitHub Actions pinned to full commit SHA; OIDC for cloud credentials
- [ ] `pnpm audit` passes with no Critical/High vulnerabilities