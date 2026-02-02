# ✦ Typix

**A modern, extensible rich-text editor framework built on Lexical.**

<div>
  <img src="https://img.shields.io/npm/v/typix-editor/react" alt="" />
  <img src="https://img.shields.io/npm/dm/typix-editor/react" alt="" />
  <img src="https://img.shields.io/github/license/mrdiyorbek-juraev/typix" alt="" />
</div>

---

## Overview

**Typix** is a developer-first rich-text editor framework built on top of Meta’s
[Lexical](https://lexical.dev). It is designed to be a flexible alternative to
editors like Tiptap and ProseMirror, focusing on **clean architecture, composable
extensions, and long-term scalability**.

Typix provides a strong core with opinionated abstractions while staying
headless and framework-agnostic, allowing you to build anything from a simple
text editor to complex document systems like Notion-style editors.

---

## Philosophy

Typix is built around a few core principles:

- **Extensible** — Everything is an extension: nodes, commands, UI, behaviors
- **Headless First** — No forced UI, full control over rendering
- **Predictable** — Opinionated architecture with clear boundaries
- **Performant** — Powered by Lexical’s modern editor engine
- **Scalable** — Designed for large documents, teams, and ecosystems

---

## Features

### Core

- Built on **Lexical**
- Modular **extension & plugin architecture**
- Centralized **command system**
- Context-aware editor state
- Strong TypeScript support

### Editing Experience

- Rich-text editing
- Inline and block formatting
- Input rules (Markdown-like shortcuts)
- Paste rules (smart links, media handling)
- Undo / redo out of the box

### UI & Integration

- Headless by default
- Contextual toolbars
- Custom menus (slash menu, bubble menu, block menu)
- Easy React integration
- Framework-agnostic core (future support for other frameworks)

### Advanced (Roadmap)

- Collaborative editing
- Custom schema & serialization
- Markdown / HTML export
- AI-assisted extensions
- Drag-and-drop blocks

---

## Why Typix?

| Typix |
|------|
| Built directly on Lexical |
| Opinionated extension system |
| Headless-first design |
| Command-centric architecture |
| Designed for future collaboration | Collaboration as add-on |

Typix aims to **reduce complexity without reducing power**.

---

## Installation

> ⚠️ Typix is under active development.

```sh
npm install typix
# or
pnpm add typix
# or
yarn add typix
