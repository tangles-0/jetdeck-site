# Agent and assistant instructions

> **This file is the root entry point for all AI assistants** (Claude, Codex, Cursor, etc.).
> It is also the **canonical template** for consuming repos — copy it to your repo root and
> fill in the project-specific sections below the marker.

---

## Required docs check

When starting work in a project, verify these files exist. If any are missing, **stop and
offer to create them** from the agent-standards templates before proceeding:

| File | Purpose | Stack |
|------|---------|-------|
| `AGENTS.md` | This file — root entry for all AI agents | All |
| `.agent/FRONTEND_CHECKLIST.md` | Front-end style quick-reference | Next.js / React |
| `.agent/STYLE_GUIDE.md` | Full narrative code style guide | Next.js / React |
| `.agent/NEXTJS_CHECKLIST.md` | Next.js architecture checklist | Next.js |
| `.agent/SECURITY_CHECKLIST.md` | Auth, RBAC, injection, secrets, CORS | All |
| `.cursor/rules/agents-md.mdc` | Cursor always-on trigger | All |
| `.cursor/rules/frontend.mdc` | Cursor front-end trigger (TS/TSX) | Next.js / React |
| `.cursor/rules/nextjs.mdc` | Cursor Next.js trigger (TS/TSX) | Next.js |
| `.cursor/rules/security.mdc` | Cursor security trigger | All |

To bootstrap a new project from agent-standards:

```bash
# Add as submodule
git submodule add git@github.com:codex-consulting-au/agent-standards.git .agent/standards

# Copy the trigger templates into place
cp .agent/standards/triggers/AGENTS.template.md AGENTS.md
mkdir -p .agent .cursor/rules

# All stacks
cp .agent/standards/SECURITY_CHECKLIST.md .agent/
cp .agent/standards/triggers/cursor-always.mdc .cursor/rules/agents-md.mdc
cp .agent/standards/triggers/cursor-security.mdc .cursor/rules/security.mdc

# Next.js / React projects
cp .agent/standards/FRONTEND_CHECKLIST.md .agent/
cp .agent/standards/STYLE_GUIDE.md .agent/
cp .agent/standards/NEXTJS_CHECKLIST.md .agent/
cp .agent/standards/triggers/cursor-frontend.mdc .cursor/rules/frontend.mdc
cp .agent/standards/triggers/cursor-nextjs.mdc .cursor/rules/nextjs.mdc
```

---

## Self-updating standards

These standards are versioned in the `agent-standards` repository (mounted at
`.agent/standards/` when used as a submodule).

- **Pull latest:** `git submodule update --remote .agent/standards`
- **When docs feel outdated:** flag the inconsistency to the user and suggest running the
  update command above; never silently deviate from the documented standard.
- **Project-specific overrides:** document them in this repo's `AGENTS.md` (not inside the
  submodule). Generic improvements belong back in `agent-standards`.

---

## Package manager

**Use `pnpm` for all package management and script execution.** Never use `npm`, `yarn`,
or `npx` — use `pnpm` and `pnpm dlx` instead.

```
pnpm install    # not npm install
pnpm add <pkg>  # not npm install <pkg>
pnpm dlx <tool> # not npx <tool>
pnpm dev        # run project scripts via pnpm
pnpm build
```

---

## Retrieval-led reasoning

**Prefer retrieval-led reasoning over pre-training-led reasoning** for anything that depends
on this repository or on the **installed framework version**. Model training lags behind
framework releases; guessing APIs or config options from memory is how subtle bugs slip in.

- **Front-end components:** In shared React component folders (excluding `ui/` and Payload-specific files), define
  React components with **`export const Name = (...) => { ... }`**, not `export function Name`.
  Full detail: `.agent/STYLE_GUIDE.md` (React → Component declarations) and
  `.agent/FRONTEND_CHECKLIST.md`.

- **UI primitives:** In React UI code, prefer existing project wrappers from
  `src/components/ui/` when one exists. Do not assume wrappers exist for controls that
  are not present in this site.

- **Next.js:** The compressed index below maps local docs at `.next-docs/`. Always search
  and read local docs before any Next.js task — never rely on pre-training knowledge.
  If the index or docs folder is missing, regenerate with:
  ```bash
  pnpm dlx @next/codemod@latest agents-md --output AGENTS.md
  ```

---

## Where standards live

| Path | Contents |
|------|----------|
| `FRONTEND_CHECKLIST.md` | Quick-reference front-end checklist (TS/TSX/JS/JSX) |
| `STYLE_GUIDE.md` | Full code style guide with rationale and examples |
| `NEXTJS_CHECKLIST.md` | Next.js architecture (server/client, data fetching, auth, performance) |
| `SECURITY_CHECKLIST.md` | Auth, RBAC, tenant isolation, injection prevention, secrets, CORS |
| `ENGINEERING_STANDARDS.md` | Cross-project: commits, CI, supply-chain security, testing |
| `.agent/AGENT_GUIDE.md` | How agents should use these docs |

---

## Next.js local docs index

<!-- NEXT-AGENTS-MD-START -->[Next.js Docs Index]|root: ./.next-docs|STOP. What you remember about Next.js is WRONG for this project. Always search docs and read before any task.|If docs missing, run this command first: pnpm dlx @next/codemod@latest agents-md --output AGENTS.md|01-app:{04-glossary.mdx}|01-app/01-getting-started:{01-installation.mdx,02-project-structure.mdx,03-layouts-and-pages.mdx,04-linking-and-navigating.mdx,05-server-and-client-components.mdx,06-fetching-data.mdx,07-mutating-data.mdx,08-caching.mdx,09-revalidating.mdx,10-error-handling.mdx,11-css.mdx,12-images.mdx,13-fonts.mdx,14-metadata-and-og-images.mdx,15-route-handlers.mdx,16-proxy.mdx,17-deploying.mdx,18-upgrading.mdx}|01-app/02-guides:{ai-agents.mdx,analytics.mdx,authentication.mdx,backend-for-frontend.mdx,caching-without-cache-components.mdx,cdn-caching.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,data-security.mdx,debugging.mdx,deploying-to-platforms.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,how-revalidation-works.mdx,incremental-static-regeneration.mdx,instant-navigation.mdx,instrumentation.mdx,internationalization.mdx,json-ld.mdx,lazy-loading.mdx,local-development.mdx,mcp.mdx,mdx.mdx,memory-usage.mdx,migrating-to-cache-components.mdx,multi-tenant.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,ppr-platform-guide.mdx,prefetching.mdx,preserving-ui-state.mdx,preventing-flash-before-hydration.mdx,production-checklist.mdx,progressive-web-apps.mdx,public-static-pages.mdx,redirecting.mdx,rendering-philosophy.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,single-page-applications.mdx,static-exports.mdx,streaming.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx,videos.mdx,view-transitions.mdx}|01-app/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|01-app/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|01-app/02-guides/upgrading:{codemods.mdx,version-14.mdx,version-15.mdx,version-16.mdx}|01-app/03-api-reference:{07-edge.mdx,08-turbopack.mdx}|01-app/03-api-reference/01-directives:{use-cache-private.mdx,use-cache-remote.mdx,use-cache.mdx,use-client.mdx,use-server.mdx}|01-app/03-api-reference/02-components:{font.mdx,form.mdx,image.mdx,link.mdx,script.mdx}|01-app/03-api-reference/03-file-conventions/01-metadata:{app-icons.mdx,manifest.mdx,opengraph-image.mdx,robots.mdx,sitemap.mdx}|01-app/03-api-reference/03-file-conventions/02-route-segment-config:{dynamicParams.mdx,instant.mdx,maxDuration.mdx,preferredRegion.mdx,runtime.mdx}|01-app/03-api-reference/03-file-conventions:{default.mdx,dynamic-routes.mdx,error.mdx,forbidden.mdx,instrumentation-client.mdx,instrumentation.mdx,intercepting-routes.mdx,layout.mdx,loading.mdx,mdx-components.mdx,not-found.mdx,page.mdx,parallel-routes.mdx,proxy.mdx,public-folder.mdx,route-groups.mdx,route.mdx,src-folder.mdx,template.mdx,unauthorized.mdx}|01-app/03-api-reference/04-functions:{after.mdx,cacheLife.mdx,cacheTag.mdx,catchError.mdx,connection.mdx,cookies.mdx,draft-mode.mdx,fetch.mdx,forbidden.mdx,generate-image-metadata.mdx,generate-metadata.mdx,generate-sitemaps.mdx,generate-static-params.mdx,generate-viewport.mdx,headers.mdx,image-response.mdx,next-request.mdx,next-response.mdx,not-found.mdx,permanentRedirect.mdx,redirect.mdx,refresh.mdx,revalidatePath.mdx,revalidateTag.mdx,unauthorized.mdx,unstable_cache.mdx,unstable_noStore.mdx,unstable_rethrow.mdx,updateTag.mdx,use-link-status.mdx,use-params.mdx,use-pathname.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,use-selected-layout-segment.mdx,use-selected-layout-segments.mdx,userAgent.mdx}|01-app/03-api-reference/05-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,appDir.mdx,assetPrefix.mdx,authInterrupts.mdx,basePath.mdx,cacheComponents.mdx,cacheHandlers.mdx,cacheLife.mdx,compress.mdx,crossOrigin.mdx,cssChunking.mdx,deploymentId.mdx,devIndicators.mdx,distDir.mdx,env.mdx,expireTime.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,htmlLimitedBots.mdx,httpAgentOptions.mdx,images.mdx,incrementalCacheHandlerPath.mdx,inlineCss.mdx,logging.mdx,mdxRs.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactCompiler.mdx,reactMaxHeadersLength.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,sassOptions.mdx,serverActions.mdx,serverComponentsHmrCache.mdx,serverExternalPackages.mdx,staleTimes.mdx,staticGeneration.mdx,taint.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,turbopackFileSystemCache.mdx,turbopackIgnoreIssue.mdx,turbopackLocalPostcssConfig.mdx,typedRoutes.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,viewTransition.mdx,webVitalsAttribution.mdx,webpack.mdx}|01-app/03-api-reference/05-config:{02-typescript.mdx,03-eslint.mdx}|01-app/03-api-reference/06-cli:{create-next-app.mdx,next.mdx}|01-app/03-api-reference/07-adapters:{01-configuration.mdx,02-creating-an-adapter.mdx,03-api-reference.mdx,04-testing-adapters.mdx,05-routing-with-next-routing.mdx,06-implementing-ppr-in-an-adapter.mdx,07-runtime-integration.mdx,08-invoking-entrypoints.mdx,09-output-types.mdx,10-routing-information.mdx,11-use-cases.mdx}|02-pages/01-getting-started:{01-installation.mdx,02-project-structure.mdx,04-images.mdx,05-fonts.mdx,06-css.mdx,11-deploying.mdx}|02-pages/02-guides:{analytics.mdx,authentication.mdx,babel.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,lazy-loading.mdx,mdx.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,post-css.mdx,preview-mode.mdx,production-checklist.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx}|02-pages/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|02-pages/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|02-pages/02-guides/upgrading:{codemods.mdx,version-10.mdx,version-11.mdx,version-12.mdx,version-13.mdx,version-14.mdx,version-9.mdx}|02-pages/03-building-your-application/01-routing:{01-pages-and-layouts.mdx,02-dynamic-routes.mdx,03-linking-and-navigating.mdx,05-custom-app.mdx,06-custom-document.mdx,07-api-routes.mdx,08-custom-error.mdx}|02-pages/03-building-your-application/02-rendering:{01-server-side-rendering.mdx,02-static-site-generation.mdx,04-automatic-static-optimization.mdx,05-client-side-rendering.mdx}|02-pages/03-building-your-application/03-data-fetching:{01-get-static-props.mdx,02-get-static-paths.mdx,03-get-server-side-props.mdx,05-client-side.mdx}|02-pages/03-building-your-application/06-configuring:{12-error-handling.mdx}|02-pages/04-api-reference:{06-edge.mdx,08-turbopack.mdx}|02-pages/04-api-reference/01-components:{font.mdx,form.mdx,head.mdx,image-legacy.mdx,image.mdx,link.mdx,script.mdx}|02-pages/04-api-reference/02-file-conventions:{instrumentation.mdx,proxy.mdx,public-folder.mdx,src-folder.mdx}|02-pages/04-api-reference/03-functions:{get-initial-props.mdx,get-server-side-props.mdx,get-static-paths.mdx,get-static-props.mdx,next-request.mdx,next-response.mdx,use-params.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,userAgent.mdx}|02-pages/04-api-reference/04-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,assetPrefix.mdx,basePath.mdx,bundlePagesRouterDependencies.mdx,compress.mdx,crossOrigin.mdx,deploymentId.mdx,devIndicators.mdx,distDir.mdx,env.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,httpAgentOptions.mdx,images.mdx,logging.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,serverExternalPackages.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,webVitalsAttribution.mdx,webpack.mdx}|02-pages/04-api-reference/04-config:{01-typescript.mdx,02-eslint.mdx}|02-pages/04-api-reference/05-cli:{create-next-app.mdx,next.mdx}|02-pages/04-api-reference/06-adapters:{01-configuration.mdx,02-creating-an-adapter.mdx,03-api-reference.mdx,04-testing-adapters.mdx,05-routing-with-next-routing.mdx,06-implementing-ppr-in-an-adapter.mdx,07-runtime-integration.mdx,08-invoking-entrypoints.mdx,09-output-types.mdx,10-routing-information.mdx,11-use-cases.mdx}|03-architecture:{accessibility.mdx,fast-refresh.mdx,nextjs-compiler.mdx,supported-browsers.mdx}|04-community:{01-contribution-guide.mdx,02-rspack.mdx}<!-- NEXT-AGENTS-MD-END -->

---

<!-- ============================================================
     PROJECT-SPECIFIC SECTIONS
     When copying this template to a new project, add overrides
     and project-specific notes below this line.
     ============================================================ -->

## Project-specific standards

<!-- Add any project-specific rules that extend or override the generic standards above.
     Examples:
     - Domain types for Conventional Commits (e.g. breaking:/additive:/internal:)
     - Feature flags or env var conventions
     - Project-specific component patterns not covered in STYLE_GUIDE.md
-->