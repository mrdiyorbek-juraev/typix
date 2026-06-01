// ─────────────────────────────────────────────────────
// Extension-owned chain command types.
//
// Most chain command declarations now live in their owning
// extension packages (each extension augments TypixCommands<R>
// in its own source). This file is kept only for commands
// not yet declared upstream — currently none.
//
// If you find a command that doesn't type-check at a call
// site, prefer adding the `declare module "@typix-editor/core"`
// block to the extension that registers it rather than here.
// ─────────────────────────────────────────────────────

export {};
