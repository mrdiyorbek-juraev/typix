# @typix-editor/extension-slash-command

## 5.0.0

### Major Changes

- **Initial release.** Detects the `/` trigger and exposes the query + selection state the `SlashDropdownMenu` UI reads from.
- Ships with eight built-in item types (text, headings 1–3, bullet/ordered lists, quote, code block); the matching UI lets you extend with custom items + groups.
- Headless: extension handles trigger logic only. Render the menu with `SlashDropdownMenu` (vendor via `typix ui add slash-command`) or your own UI.
