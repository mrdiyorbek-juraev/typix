# @typix-editor/extension-table

## 5.0.0

### Major Changes

- **Initial release.** Full table support — insert N×M tables, merge/split cells, resize columns/rows, freeze header row/column, color individual cells/rows/columns, and duplicate/clear/delete via commands.
- Ships ~20 commands: `TYPIX_INSERT_TABLE`, `_INSERT_ROW_ABOVE/BELOW`, `_INSERT_COLUMN_LEFT/RIGHT`, `_DELETE_ROW/COLUMN/TABLE`, `_UNMERGE_CELLS`, `_TOGGLE_HEADER_ROW/COLUMN`, `_DUPLICATE_ROW/COLUMN`, `_SET_CELL/ROW/COLUMN_BACKGROUND_COLOR`, and more.
- The full interactive UI (`TableUI`, `TableCellResizer`) ships separately via `typix ui add table`.
