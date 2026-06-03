// ─────────────────────────────────────────────────────
// LEGACY MODULE LOCATION
// ─────────────────────────────────────────────────────
// ExtensionRegistry lives at `src/extension/`.
// This file re-exports for any internal import paths
// not yet migrated; consumers should import from the
// package root or from `@typix-editor/core/extension`.

export { ExtensionRegistry, configExtension } from '../../extension'
