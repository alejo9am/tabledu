---
description: "Full project audit. Scans the codebase for inconsistencies with documentation and updates all out-of-date context files including AGENTS.md."
mode: subagent
---

Run a full audit of the project and fix all inconsistencies found.

## Environment Requirement

This agent requires full workspace file access and bash tool.
If either is unavailable, stop and ask the user to check permissions.

## Audit Sources

Read all of the following before doing anything else:

- `AGENTS.md`
- `ARCHITECTURE.md`
- `DESIGN.md`
- `README.md`
- `src/**` (focus on `src/index.css`, `src/router/`, `src/features/`, `src/services/`, `src/lib/`)
- `docs/database/*.sql`
- `vite.config.js`
- `package.json`

## Process

1. **Audit** — scan all sources above and identify every inconsistency or stale reference.
2. **Ask** — if anything is ambiguous or requires a product decision, ask concise blocking questions before editing. Do not resolve contradictions silently.
3. **Plan** — present a list of proposed changes with rationale. Wait for explicit user approval.
4. **Apply** — make all approved changes.
5. **Verify** — run `pnpm build` to confirm nothing is broken after edits.
6. **Report** — provide a short summary: files changed, what was updated, and any residual risks or follow-ups.

## Scope to Keep Synchronized

- `AGENTS.md` — commands, conventions, file paths, stack version, gameplay rules.
- `ARCHITECTURE.md` — folder structure and naming conventions vs actual `src/` tree.
- `DESIGN.md` — design tokens vs actual `src/index.css` `@theme inline` block.
- `README.md` — stack versions, setup instructions, project structure section.

## What to Look For

- File paths or folder names in docs that no longer exist in `src/`.
- Stack versions in docs that differ from `package.json`.
- Naming conventions in `AGENTS.md` that contradict patterns found in actual code.
- Design tokens documented in `DESIGN.md` that differ from `src/index.css`.
- SQL table or column names referenced in frontend code that differ from `docs/database/*.sql`.
- Any reference to removed concepts: `client/`, `server/`, Flask, `.copilot/`, `package-lock.json`.

## Rules

- Prefer minimal diffs. Do not rewrite docs that are still accurate.
- Never update `AGENTS.md` permissions or safety rules without explicit user confirmation.
- Surface all assumptions explicitly before applying changes.