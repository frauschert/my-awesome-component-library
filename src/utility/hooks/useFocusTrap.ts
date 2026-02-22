import { useCallback, useEffect, useRef } from 'react'

const FOCUSABLE_SELECTORS = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([type="hidden"]):not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',')

function getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    ).filter(
        (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
    )
}

export interface UseFocusTrapOptions {
    /** Whether the trap is active */
    enabled?: boolean
    /** Ref to the element that should receive initial focus */
    initialFocusRef?: React.RefObject<HTMLElement>
    /** Whether to restore focus to the previously focused element on deactivation */
    restoreFocus?: boolean
}

export interface UseFocusTrapReturn {
    /** Ref to attach to the container element */
    containerRef: React.RefObject<HTMLElement | null>
    /** onKeyDown handler to attach to the container */
    onKeyDown: (e: React.KeyboardEvent) => void
}

/**
 * Traps focus within a container element. Handles Tab/Shift+Tab cycling,
 * initial focus placement, and focus restoration on deactivation.
 */
export default function useFocusTrap({
    enabled = true,
    initialFocusRef,
    restoreFocus = true,
}: UseFocusTrapOptions = {}): UseFocusTrapReturn {
    const containerRef = useRef<HTMLElement>(null)
    const previouslyFocusedRef = useRef<HTMLElement | null>(null)

    // Save previously focused element and move focus into the trap
    useEffect(() => {
        if (!enabled) return

        previouslyFocusedRef.current =
            (document.activeElement as HTMLElement) || null

        const timer = window.setTimeout(() => {
            const container = containerRef.current
            if (!container) return

            const target =
                initialFocusRef?.current ?? getFocusableElements(container)[0]

            if (target) target.focus()
            else container.focus()
        }, 0)

        return () => {
            window.clearTimeout(timer)
            if (restoreFocus && previouslyFocusedRef.current) {
                previouslyFocusedRef.current.focus?.()
                previouslyFocusedRef.current = null
            }
        }
    }, [enabled, initialFocusRef, restoreFocus])

    const onKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (!enabled || e.key !== 'Tab') return
            const container = containerRef.current
            if (!container) return

            const focusables = getFocusableElements(container)
            if (focusables.length === 0) {
                e.preventDefault()
                container.focus()
                return
            }

            const first = focusables[0]
            const last = focusables[focusables.length - 1]
            const active = document.activeElement as HTMLElement
            const idx = focusables.indexOf(active)

            let target: HTMLElement
            if (e.shiftKey) {
                target = idx <= 0 ? last : focusables[idx - 1]
            } else {
                target =
                    idx === -1 || idx >= focusables.length - 1
                        ? first
                        : focusables[idx + 1]
            }

            e.preventDefault()
            target.focus()
        },
        [enabled]
    )

    return { containerRef, onKeyDown }
}
