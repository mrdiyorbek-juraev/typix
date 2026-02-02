---
"@typix-editor/mention": minor
"@typix-editor/react": patch
---

Add flexible mention extension with typeahead support

**@typix-editor/mention (new package)**
- MentionNode with configurable display options (trigger, className, style)
- MentionExtension with customizable search, rendering, and trigger configuration
- Support for async/sync search with built-in debouncing
- Headless UI support via `renderMenu` and `renderMenuItem` props
- Validation to ensure MentionNode is registered in editor config

**@typix-editor/react**
- Add `isEmpty` state to `useEditor` hook for detecting empty editor content
