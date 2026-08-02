# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Configuration

- **Language**: TypeScript
- **Framework**: SvelteKit 2 + Svelte 5 (runes mode forced in `vite.config.ts`), Vite 8, Tailwind CSS 4
- **Package Manager**: bun
- **Add-ons**: prettier, eslint, vitest, playwright, tailwindcss, mcp

## Commands

```bash
bun run dev              # dev server
bun run build            # production build (adapter-auto)
bun run preview          # serve the build on :4173
bun run check            # svelte-kit sync + svelte-check (type checking)
bun run lint             # prettier --check . && eslint .
bun run format           # prettier --write .
bun run test             # unit (once) + e2e
bun run test:unit        # vitest in watch mode
bun run test:e2e         # playwright install + playwright test
```

Run a single test:

```bash
bun run test:unit -- --run src/lib/vitest-examples/greet.spec.ts
bun run test:unit -- --run --project=client        # only browser-mode tests
bun run test:unit -- --run -t "returns a greeting" # by test name
bunx playwright test src/routes/demo/playwright/page.svelte.e2e.ts
```

## Test layout

Two Vitest projects are configured in `vite.config.ts`, split by filename:

- **client** — `src/**/*.svelte.{test,spec}.{js,ts}`, runs in real Chromium via `@vitest/browser-playwright`; use `render` from `vitest-browser-svelte` and the async `expect.element(...)` API. `src/lib/server/**` is excluded.
- **server** — every other `src/**/*.{test,spec}.{js,ts}`, runs in Node.

`expect.requireAssertions` is on, so a test with no assertion fails.

Playwright e2e is separate: files matching `**/*.e2e.{ts,js}` (see `playwright.config.ts`), which builds and previews the app first — so e2e runs exercise the production build, not the dev server.

`src/lib/vitest-examples/` and `src/routes/demo/` are scaffolding examples, not product code.

## Architecture

A single password-gated birthday page. Two routes matter:

- `/` (`src/routes/+page.svelte`, `+page.server.ts`) — password form. The default form action validates the password and sets the `birthday_session` cookie, then redirects to `/birthday`. `load` redirects an already-authenticated visitor straight to `/birthday`.
- `/birthday` (`src/routes/birthday/`) — the celebration page. `load` redirects back to `/` without a valid session; the `logout` action clears the cookie.

Auth lives entirely in `src/lib/server/auth.ts` and is intentionally stateless — no session store. The cookie value is `HMAC-SHA256(AUTH_SECRET, "birthday:" + BIRTHDAY_PASSWORD)`, so `isBirthdaySession` just recomputes that signature and compares with `timingSafeEqual`. Consequence: changing either env var invalidates all existing sessions. Both password and secret fall back to hardcoded dev defaults when the env vars are unset, so a deployment without `.env` is publicly guessable — see `.env.example`.

Env vars are read through `$env/dynamic/private` (runtime, not build time).

All styling is plain CSS in `src/routes/layout.css` (~745 lines, imported once by `+layout.svelte`) using hand-written class names, not Tailwind utilities — Tailwind 4 is wired up via `@import 'tailwindcss'` and the Vite plugin but the existing pages don't use its classes. Prettier's Tailwind plugin points at this file via `tailwindStylesheet`.

## Svelte MCP server

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
