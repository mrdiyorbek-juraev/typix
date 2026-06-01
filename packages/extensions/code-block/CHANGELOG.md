# @typix-editor/extension-code-block

## 5.0.0

### Major Changes

- **Initial release.** Provides the `CodeBlockNode` plus commands for inserting fenced code blocks with a language attribute.
- Highlighting is intentionally out of scope — pair with `extension-code-highlight-prism` (small) or `extension-code-highlight-shiki` (accurate, VS Code-style) for syntax colors.
- The matching `CodeBlockUI` overlay component (language picker + copy button) is vendorable via `typix ui add code-block`.
