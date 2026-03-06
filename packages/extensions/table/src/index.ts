export { TableExtension, type TableConfig } from "./extension";

// Re-export the most useful @lexical/table utilities so consumers don't need
// to depend on @lexical/table directly.
export {
  // Commands
  INSERT_TABLE_COMMAND,
  type InsertTableCommandPayload,
  type InsertTableCommandPayloadHeaders,
  // Node factories / guards
  $createTableNode,
  $createTableRowNode,
  $createTableCellNode,
  $createTableNodeWithDimensions,
  $isTableNode,
  $isTableRowNode,
  $isTableCellNode,
  $isTableSelection,
  // Node classes
  TableNode,
  TableRowNode,
  TableCellNode,
  TableCellHeaderStates,
  type SerializedTableNode,
  type SerializedTableRowNode,
  type SerializedTableCellNode,
  // Table observer
  TableObserver,
  getTableObserverFromTableElement,
  // Row / column mutation utilities
  $insertTableRowAtSelection,
  $insertTableColumnAtSelection,
  $deleteTableRowAtSelection,
  $deleteTableColumnAtSelection,
  // Cell merge utilities
  $mergeCells,
  $unmergeCell,
  // Node triplet helper
  $getNodeTriplet,
  // Read-only utilities
  $getTableCellNodeFromLexicalNode,
  $getTableNodeFromLexicalNodeOrThrow,
  $getTableRowNodeFromTableCellNodeOrThrow,
  $getTableRowIndexFromTableCellNode,
  $getTableColumnIndexFromTableCellNode,
  $getTableCellNodeRect,
  $computeTableMap,
  $computeTableMapSkipCellCheck,
  // DOM utilities
  getDOMCellFromTarget,
  getTableElement,
  // Types
  type TableMapType,
  type TableMapValueType,
  type TableDOMCell,
} from "@typix-editor/core/lexical/table";
