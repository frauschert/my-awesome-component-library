import { useEffect, useCallback, useRef } from 'react'

export type ModifierKey = 'ctrl' | 'shift' | 'alt' | 'meta'
export type Hotkey = string

export interface UseHotkeysOptions {
    /**
     * Enable or disable the hotkey
     * @default true
     */
    enabled?: boolean

    /**
     * Enable hotkey when input elements are focused
     * @default false
     */
    enableOnFormTags?: boolean

    /**
     * Enable on contentEditable elements
     * @default false
     */
    enableOnContentEditable?: boolean

    /**
     * Prevent default browser behavior
     * @default true
     */
    preventDefault?: boolean

    /**
     * Stop event propagation
     * @default false
     */
    stopPropagation?: boolean

    /**
     * Description for documentation
     */
    description?: string
}

interface ParsedHotkey {
    key: string
    ctrl: boolean
    shift: boolean
    alt: boolean
    meta: boolean
}

/**
 * Parse hotkey string into structured format
 * Examples: "ctrl+s", "shift+alt+k", "meta+enter"
 */
function parseHotkey(hotkey: string): ParsedHotkey {
    const parts = hotkey
        .toLowerCase()
        .split('+')
        .map((p) => p.trim())

    const ctrl = parts.includes('ctrl') || parts.includes('control')
    const shift = parts.includes('shift')
    const alt = parts.includes('alt')
    const meta =
        parts.includes('meta') ||
        parts.includes('cmd') ||
        parts.includes('command')

    // The key is the last non-modifier part
    const key =
        parts.filter(
            (p) =>
                ![
                    'ctrl',
                    'control',
                    'shift',
                    'alt',
                    'meta',
                    'cmd',
                    'command',
                ].includes(p)
        )[0] || ''

    return { key, ctrl, shift, alt, meta }
}

/**
 * Normalize key name for comparison
 */
function normalizeKey(key: string): string {
    const keyMap: Record<string, string> = {
        enter: 'enter',
        return: 'enter',
        esc: 'escape',
        space: ' ',
        spacebar: ' ',
        up: 'arrowup',
        down: 'arrowdown',
        left: 'arrowleft',
        right: 'arrowright',
    }

    const normalized = key.toLowerCase()
    return keyMap[normalized] || normalized
}

/**
 * Check if event matches parsed hotkey
 */
function matchesHotkey(event: KeyboardEvent, parsed: ParsedHotkey): boolean {
    const eventKey = normalizeKey(event.key)
    const parsedKey = normalizeKey(parsed.key)

    if (eventKey !== parsedKey) return false
    if (event.ctrlKey !== parsed.ctrl) return false
    if (event.shiftKey !== parsed.shift) return false
    if (event.altKey !== parsed.alt) return false
    if (event.metaKey !== parsed.meta) return false

    return true
}

/**
 * Check if target is a form element
 */
function isFormElement(element: EventTarget | null): boolean {
    if (!element || !(element instanceof HTMLElement)) return false

    const tagName = element.tagName.toLowerCase()
    return ['input', 'textarea', 'select'].includes(tagName)
}

/**
 * Check if target is contentEditable
 */
function isContentEditable(element: EventTarget | null): boolean {
    if (!element || !(element instanceof HTMLElement)) return false
    return element.isContentEditable
}

/**
 * Hook for managing keyboard shortcuts with support for modifier keys.
 *
 * @param hotkey - Hotkey string (e.g., "ctrl+s", "shift+alt+k")
 * @param callback - Function to call when hotkey is pressed
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * function Editor() {
 *   useHotkeys('ctrl+s', () => {
 *     console.log('Save!')
 *   })
 *
 *   useHotkeys('ctrl+shift+p', () => {
 *     console.log('Open command palette')
 *   })
 *
 *   return <textarea />
 * }
 * ```
 */
export default function useHotkeys(
    hotkey: Hotkey,
    callback: (event: KeyboardEvent) => void,
    options: UseHotkeysOptions = {}
): void {
    const {
        enabled = true,
        enableOnFormTags = false,
        enableOnContentEditable = false,
        preventDefault = true,
        stopPropagation = false,
    } = options

    const callbackRef = useRef(callback)
    const parsedRef = useRef<ParsedHotkey>(parseHotkey(hotkey))

    // Keep callback ref up to date
    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    // Update parsed hotkey when hotkey changes
    useEffect(() => {
        parsedRef.current = parseHotkey(hotkey)
    }, [hotkey])

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            // Check if enabled
            if (!enabled) return

            // Check if we should ignore form elements
            if (!enableOnFormTags && isFormElement(event.target)) return

            // Check if we should ignore contentEditable
            if (!enableOnContentEditable && isContentEditable(event.target))
                return

            // Check if hotkey matches
            if (!matchesHotkey(event, parsedRef.current)) return

            // Prevent default and stop propagation if configured
            if (preventDefault) {
                event.preventDefault()
            }

            if (stopPropagation) {
                event.stopPropagation()
            }

            // Call the callback
            callbackRef.current(event)
        },
        [
            enabled,
            enableOnFormTags,
            enableOnContentEditable,
            preventDefault,
            stopPropagation,
        ]
    )

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleKeyDown])
}

/**
 * Hook for managing multiple hotkeys at once
 *
 * @param hotkeys - Record of hotkey strings to callbacks
 * @param options - Configuration options applied to all hotkeys
 *
 * @example
 * ```tsx
 * function Editor() {
 *   useHotkeysMap({
 *     'ctrl+s': () => console.log('Save'),
 *     'ctrl+o': () => console.log('Open'),
 *     'ctrl+p': () => console.log('Print'),
 *   })
 * }
 * ```
 */
export function useHotkeysMap(
    hotkeys: Record<Hotkey, (event: KeyboardEvent) => void>,
    options: UseHotkeysOptions = {}
): void {
    const {
        enabled = true,
        enableOnFormTags = false,
        enableOnContentEditable = false,
        preventDefault = true,
        stopPropagation = false,
    } = options

    const hotkeysRef = useRef(hotkeys)
    const parsedHotkeysRef = useRef<Map<string, ParsedHotkey>>(new Map())

    // Keep hotkeys ref up to date
    useEffect(() => {
        hotkeysRef.current = hotkeys
    }, [hotkeys])

    // Parse all hotkeys when they change
    useEffect(() => {
        const parsed = new Map<string, ParsedHotkey>()
        Object.keys(hotkeys).forEach((key) => {
            parsed.set(key, parseHotkey(key))
        })
        parsedHotkeysRef.current = parsed
    }, [hotkeys])

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            // Check if enabled
            if (!enabled) return

            // Check if we should ignore form elements
            if (!enableOnFormTags && isFormElement(event.target)) return

            // Check if we should ignore contentEditable
            if (!enableOnContentEditable && isContentEditable(event.target))
                return

            // Find matching hotkey
            for (const [
                hotkeyStr,
                parsed,
            ] of parsedHotkeysRef.current.entries()) {
                if (matchesHotkey(event, parsed)) {
                    // Prevent default and stop propagation if configured
                    if (preventDefault) {
                        event.preventDefault()
                    }

                    if (stopPropagation) {
                        event.stopPropagation()
                    }

                    // Call the callback
                    const callback = hotkeysRef.current[hotkeyStr]
                    if (callback) {
                        callback(event)
                    }

                    // Only trigger first match
                    break
                }
            }
        },
        [
            enabled,
            enableOnFormTags,
            enableOnContentEditable,
            preventDefault,
            stopPropagation,
        ]
    )

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleKeyDown])
}
