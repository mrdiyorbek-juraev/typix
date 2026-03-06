# @typix-editor/extension-table

Full-featured table support with cell merging, background colors, tab navigation, and horizontal scroll.

## Installation

```bash
npm install @typix-editor/extension-table
# or
pnpm add @typix-editor/extension-table
```

## Usage

```ts
import { TableExtension } from "@typix-editor/extension-table"
import { createTypix } from "@typix-editor/core"

const editor = createTypix({
  extensions: [
    TableExtension({
      hasCellMerge: true,
      hasCellBackgroundColor: true,
      defaultRows: 3,
      defaultColumns: 3,
    }),
  ],
})

// Insert a 4×5 table with headers
editor.chain().insertTable({ rows: 4, columns: 5, includeHeaders: true }).run()

// Row operations
editor.chain().insertRowAbove().run()
editor.chain().insertRowBelow().run()
editor.chain().deleteRow().run()

// Column operations
editor.chain().insertColumnLeft().run()
editor.chain().insertColumnRight().run()
editor.chain().deleteColumn().run()

// Cell styling
editor.chain().setCellBackgroundColor({ color: "#f0f0f0" }).run()
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Temporarily disable all table behaviors |
| `hasCellMerge` | `boolean` | `true` | Enable cell merging (colspan/rowspan) |
| `hasCellBackgroundColor` | `boolean` | `true` | Enable per-cell background colors |
| `hasTabHandler` | `boolean` | `true` | Enable Tab key navigation between cells |
| `hasHorizontalScroll` | `boolean` | `true` | Wrap tables in a scrollable container |
| `hasNestedTables` | `boolean` | `false` | Allow nested tables (experimental) |
| `scrollShadow` | `boolean` | `true` | Add CSS modifier classes for scroll shadow indicators |
| `scrollableWrapperClass` | `string` | `"typix-table-scrollable-wrapper"` | CSS class for the scrollable wrapper |
| `defaultRows` | `number` | `3` | Default row count when inserting a table |
| `defaultColumns` | `number` | `3` | Default column count when inserting a table |

## Commands

| Command | Payload | Description |
|---------|---------|-------------|
| `insertTable` | `{ rows?, columns?, includeHeaders? }` | Insert a new table at the current selection |
| `insertRowAbove` | — | Insert a row above the focused cell |
| `insertRowBelow` | — | Insert a row below the focused cell |
| `insertColumnLeft` | — | Insert a column to the left of the focused cell |
| `insertColumnRight` | — | Insert a column to the right of the focused cell |
| `deleteRow` | — | Delete the row of the focused cell |
| `deleteColumn` | — | Delete the column of the focused cell |
| `deleteTable` | — | Delete the entire table |
| `unmergeCells` | — | Unmerge a merged cell back into individual cells |
| `toggleHeaderRow` | — | Toggle header state for the first row |
| `toggleHeaderColumn` | — | Toggle header state for the first column |
| `clearCellContents` | — | Clear content of the focused cell |
| `clearRowContents` | — | Clear all cells in the focused row |
| `clearColumnContents` | — | Clear all cells in the focused column |
| `duplicateRow` | — | Duplicate the focused row below |
| `duplicateColumn` | — | Duplicate the focused column to the right |
| `setCellBackgroundColor` | `{ color: string \| null }` | Set background color of the focused cell |
| `setRowBackgroundColor` | `{ color: string \| null }` | Set background color of all cells in the row |
| `setColumnBackgroundColor` | `{ color: string \| null }` | Set background color of all cells in the column |

## Nodes

| Node | Description |
|------|-------------|
| `TableNode` | Table container element |
| `TableRowNode` | A row in the table |
| `TableCellNode` | An individual table cell |

## API

### Exported Types

- **`TableConfig`** — Extension configuration interface.
- **`SerializedTableNode`** / **`SerializedTableRowNode`** / **`SerializedTableCellNode`** — JSON serialization shapes.
- **`TableCellHeaderStates`** — Header state enum.
- **`TableMapType`** / **`TableMapValueType`** / **`TableDOMCell`** — Table utility types.
- **`InsertTableCommandPayload`** / **`InsertTableCommandPayloadHeaders`** — Command payload types.

### Functions

- **`$createTableNode()`** — Create a new table node.
- **`$createTableRowNode()`** — Create a new table row node.
- **`$createTableCellNode()`** — Create a new table cell node.
- **`$createTableNodeWithDimensions(rows, columns, includeHeaders)`** — Create a pre-sized table.
- **`$isTableNode(node)`** — Type guard for `TableNode`.
- **`$isTableRowNode(node)`** — Type guard for `TableRowNode`.
- **`$isTableCellNode(node)`** — Type guard for `TableCellNode`.
- **`$isTableSelection(selection)`** — Type guard for table selection.
- **`$insertTableRowAtSelection()`** / **`$deleteTableRowAtSelection()`** — Row mutation helpers.
- **`$insertTableColumnAtSelection()`** / **`$deleteTableColumnAtSelection()`** — Column mutation helpers.
- **`$mergeCells()`** / **`$unmergeCell()`** — Cell merge utilities.
- **`$getTableCellNodeFromLexicalNode(node)`** — Find the table cell containing a node.
- **`$computeTableMap(table)`** — Compute the full table grid map.

### Commands

- **`INSERT_TABLE_COMMAND`** — Lexical command for direct dispatch.
