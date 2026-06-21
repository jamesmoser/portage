# Workspace Rules

- Do NOT commit or push changes to Git under any circumstances unless the user explicitly asks you to commit or push in their prompt. This rule takes absolute precedence over all other workflows, including the version bump workflow.
- **Capture Improvement Ideas**: When the user shares an idea, improvement, or note to capture for later (e.g., "Idea: ...", "Improvement: ...", "Note for later: ...", "Add to todo: ..."):
  1. Immediately append the idea to [IMPROVEMENTS.md](./IMPROVEMENTS.md) under the `## Inbox` section.
  2. Format the entry as: `- [YYYY-MM-DD] <Idea description>`.
  3. Respond with a very brief, single-sentence acknowledgment (e.g., "Added '<Idea description>' to IMPROVEMENTS.md.") and immediately resume the current task. Do not analyze, discuss, or ask clarifying questions about the idea unless explicitly asked.
- **Version Bump Release Rule**: Any time the user asks to "bump the version", you must build the production bundle (`npm run build`), but you must NOT automatically commit, tag, push, or create a release unless the user explicitly instructs you to do so in their prompt. Stop and present the modified files to the user for explicit commit/push approval.
