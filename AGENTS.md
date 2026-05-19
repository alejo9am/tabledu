# Tabledu — Project Rules

## Project

Tabledu is a React SPA for teachers to create and manage educational board games.
Stack: React 19, Vite 8, Tailwind CSS v4, shadcn/ui (radix-ui), Supabase (PostgreSQL + Auth + RLS), pnpm, Vercel.

## Commands

```bash
pnpm dev        # development server
pnpm build      # production build
pnpm lint       # eslint
pnpm preview    # preview production build
```

## Permissions

- Always ask before running any bash command, EXCEPT `pnpm build` and read-only commands.
- Never run `pnpm install` or modify `pnpm-lock.yaml` without explicit approval.

## Active Task

At the start of every session:
1. Check if any `.opencode/tasks/ISSUE_<N>.md` file exists.
2. If it does, read it and keep it as active context for the entire session.
3. During the session, if you detect drift between the brief and the current code state (steps completed but unchecked, plan changed, new decisions needed), proactively flag it.
4. When proposing changes to the brief, always show the diff first. Never edit silently.
5. If the brief needs updating, ask for confirmation before running:
   ```bash
   gh issue edit <N> --body-file .opencode/tasks/ISSUE_<N>.md
   ```

## Source Priority

1. SQL schema in `docs/database/*.sql`
2. Implemented frontend behavior in `src/**`
3. `README.md`, `ARCHITECTURE.md`, `DESIGN.md`

If a contradiction is detected between (1) and (2), stop and ask before coding.

## UI & Design

When creating or modifying any UI component, read `DESIGN.md` first.
It defines the brand identity, typography strategy, color palette, icon style, and surface conventions that must be followed.

## Architecture

- Feature-based structure under `src/features/<feature>/routes/<RouteName>/`.
- Route entry files: `*.route.jsx`. Internal screens: `*.page.jsx`. Hooks: `*.hook.js`.
- If code is used by one route only → keep inside that route folder.
- If used across features → move to `src/components`, `src/lib`, or `src/services`.
- Prefer small, focused components with explicit prop contracts.
- Full conventions in `ARCHITECTURE.md`.

## Conventions

- `@` alias for all imports. Never use long relative paths.
- Tailwind utilities only. No hardcoded hex values.
- `categories.icon` is a relative object path. Resolve public URL only via `getCategoryIconPublicUrl()` in `@/services/api.js`. On image error, show first letter of `category.name`.
- Board positions: 1..30. Start = 0, goal = 30. Movement clamps at 30.
- Do not modify `pnpm-lock.yaml`, `components.json`, or `vercel.json` unless explicitly requested.