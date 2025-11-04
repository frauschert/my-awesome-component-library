import { RefObject, useEffect, useRef } from 'react'

type EventType = MouseEvent | TouchEvent | FocusEvent

interface UseClickAwayOptions {
    /**
     * Event types to listen for
     * @default ['mousedown', 'touchstart']
     */
    events?: Array<
        'mousedown' | 'mouseup' | 'touchstart' | 'touchend' | 'focusin'
    >
    /**
     * Whether to capture events
     * @default true
     */
    capture?: boolean
}

/**
 * Hook that detects clicks outside of specified element(s).
 * Supports multiple refs and custom event types.
 *
 * @param refs - Single ref or array of refs to monitor
 * @param handler - Callback when click occurs outside
 * @param options - Configuration options
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null)
 * useClickAway(ref, () => setOpen(false))
 *
 * @example
 * // Multiple elements
 * const menuRef = useRef<HTMLDivElement>(null)
 * const buttonRef = useRef<HTMLButtonElement>(null)
 * useClickAway([menuRef, buttonRef], () => setOpen(false))
 *
 * @example
 * // Custom events
 * useClickAway(ref, handleClose, {
 *   events: ['mousedown', 'touchstart', 'focusin']
 * })
 */
export default function useClickAway<T extends HTMLElement = HTMLElement>(
    refs: RefObject<T | null> | Array<RefObject<T | null>>,
    handler: (event: EventType) => void,
    options: UseClickAwayOptions = {}
): void {
    const { events = ['mousedown', 'touchstart'], capture = true } = options
    const savedHandler = useRef(handler)

    // Update handler ref when it changes
    useEffect(() => {
        savedHandler.current = handler
    }, [handler])

    useEffect(() => {
        const listener = (event: EventType) => {
            const refsArray = Array.isArray(refs) ? refs : [refs]
            const target = event.target as Node

            // Check if click is outside all specified elements
            const isOutside = refsArray.every((ref) => {
                const element = ref.current
                // If ref is null, consider it as "outside"
                return !element || !element.contains(target)
            })

            if (isOutside) {
                savedHandler.current(event)
            }
        }

        // Add listeners for all event types
        events.forEach((eventName) => {
            document.addEventListener(
                eventName,
                listener as EventListener,
                capture
            )
        })

        return () => {
            // Clean up listeners
            events.forEach((eventName) => {
                document.removeEventListener(
                    eventName,
                    listener as EventListener,
                    capture
                )
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [events, capture])
}
