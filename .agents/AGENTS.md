# Workspace Rules

- Do NOT automatically commit and push changes to Git unless explicitly requested by the user or when performing a version bump workflow ("bump the version").
- **Capture Improvement Ideas**: When the user shares an idea, improvement, or note to capture for later (e.g., "Idea: ...", "Improvement: ...", "Note for later: ...", "Add to todo: ..."):
  1. Immediately append the idea to [IMPROVEMENTS.md](file:///Users/jamesmoser/Projects/portage/IMPROVEMENTS.md) under the `## Inbox` section.
  2. Format the entry as: `- [YYYY-MM-DD] <Idea description>`.
  3. Respond with a very brief, single-sentence acknowledgment (e.g., "Added '<Idea description>' to IMPROVEMENTS.md.") and immediately resume the current task. Do not analyze, discuss, or ask clarifying questions about the idea unless explicitly asked.
- **Version Bump Release Rule**: Any time the user asks to "bump the version", you must build the production bundle (`npm run build`), tag the version, push the tags, and create the GitHub release via the `gh` CLI with the notes `"See CHANGELOG.md for details."` as specified in the **Version Bump Workflow** section of [PROJECT_INSTRUCTIONS.md](file:///Users/jamesmoser/Projects/portage/PROJECT_INSTRUCTIONS.md#L252).
