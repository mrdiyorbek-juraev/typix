// ─────────────────────────────────────────────
// Content / serialization
// ─────────────────────────────────────────────

export type SerializedContent = {
    root: SerializedRootNode
}

export type SerializedRootNode = {
    children: SerializedNode[]
    direction: 'ltr' | 'rtl' | null
    format: number
    indent: number
    type: 'root'
    version: number
}

export type SerializedNode = {
    type: string
    version: number
    [key: string]: unknown
}
