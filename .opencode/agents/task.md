---
description: "Creates the brief for a GitHub issue. Fetches issue data from GitHub, generates a structured brief, saves it locally, and syncs it back to GitHub."
mode: subagent
---

## Input

Ask for the issue number if not provided. Nothing else is needed upfront.

## Process

1. Fetch the issue data from GitHub (no permission needed):
   ```bash
   gh issue view <N> --json title,body
   ```
2. Read `AGENTS.md`, `ARCHITECTURE.md`, and the relevant `src/` files for the task scope.
3. If anything is ambiguous or missing, ask concise blocking questions. Wait for answers before continuing.
4. Generate the brief using the structure below and show it inline. Wait for explicit user approval.
5. On approval, save to `.opencode/tasks/ISSUE_<N>.md` and immediately run:
   ```bash
   gh issue edit <N> --body-file .opencode/tasks/ISSUE_<N>.md
   ```
6. Stop. Wait for explicit user approval to implement.

## Brief Structure

```markdown
> <Issue objective.>

## Steps
- [ ] <step 1>
- [ ] <step 2>
- [ ] <step 3>
...

## Scope
**In:** <comma-separated list of files or areas>
**Out:** <what this task does NOT touch>

## Decisions
| Question | Decision |
|---|---|
| <assumption or decision> | <answer or rationale> |
```

## Rules

- Steps must be small and independently verifiable. Each touches one file or concern.
- Insert a `pnpm build` check after every 2-3 steps: `- [ ] Run \`pnpm build\` — no errors`.
- No implementation code in the brief.
- Use `@/` alias in all file references.