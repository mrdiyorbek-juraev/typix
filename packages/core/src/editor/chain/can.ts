const KNOWN_BUILTIN_COMMANDS = new Set([
    'focus',
    'blur',
    'setContent',
    'clearContent',
    'undo',
    'redo',
])

const KNOWN_MARKS = new Set([
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'code',
    'subscript',
    'superscript',
    'highlight',
])

/**
 * Check if a command name corresponds to a known built-in command.
 * For `toggleMark`, validates the mark name exists.
 *
 * `toggleBlock` is not a built-in — extensions own block toggles.
 */
export function isKnownBuiltinCommand(name: string, args: unknown[]): boolean {
    if (KNOWN_BUILTIN_COMMANDS.has(name)) return true

    if (name === 'toggleMark') {
        const markName = args[0] as string | undefined
        return markName != null && KNOWN_MARKS.has(markName)
    }

    return false
}
