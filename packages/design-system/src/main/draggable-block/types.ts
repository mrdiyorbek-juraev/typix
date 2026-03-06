import type { ReactNode } from "react"

export interface DraggableBlockClassNames {
  menu?: string
  targetLine?: string
  icon?: string
}

export interface DraggableBlockProps {
  /** Custom class names for component parts */
  classNames?: DraggableBlockClassNames
  /** Custom drag handle icon. Defaults to lucide GripVertical. */
  dragHandleIcon?: ReactNode
}
