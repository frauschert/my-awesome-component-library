import { useState, useEffect, useRef, RefObject } from 'react'

/**
 * Mouse position and state information
 */
export interface MouseState {
    /** X coordinate relative to the viewport */
    x: number
    /** Y coordinate relative to the viewport */
    y: number
    /** X coordinate relative to the target element (if provided) */
    elementX: number
    /** Y coordinate relative to the target element (if provided) */
    elementY: number
    /** X position as percentage of element width (0-100) */
    elementPositionX: number
    /** Y position as percentage of element height (0-100) */
    elementPositionY: number
    /** Mouse button state */
    buttons: number
    /** Ctrl key pressed */
    ctrlKey: boolean
    /** Shift key pressed */
    shiftKey: boolean
    /** Alt key pressed */
    altKey: boolean
    /** Meta key pressed (Command on Mac, Windows key on Windows) */
    metaKey: boolean
}

/**
 * Options for useMouse hook
 */
export interface UseMouseOptions {
    /** Track mouse even when outside the element */
    trackOutside?: boolean
    /** Reset position when mouse leaves the element */
    resetOnExit?: boolean
    /** Throttle mouse move updates (ms) */
    throttleMs?: number
}

/**
 * Hook to track mouse position and state
 * 
 * @param ref - Optional ref to track mouse relative to element
 * @param options - Configuration options
 * @returns Mouse state
 * 
 * @example
 * ```tsx
 * const mouse = useMouse()
 * console.log(mouse.x, mouse.y)
 * 
 * // With element ref
 * const ref = useRef<HTMLDivElement>(null)
 * const mouse = useMouse(ref)
 * console.log(mouse.elementX, mouse.elementY)
 * ```
 */
export function useMouse<T extends HTMLElement = HTMLElement>(
    ref?: RefObject<T>,
    options: UseMouseOptions = {}
): MouseState {
    const { trackOutside = true, resetOnExit = false, throttleMs = 0 } = options

    const [state, setState] = useState<MouseState>({
        x: 0,
        y: 0,
        elementX: 0,
        elementY: 0,
        elementPositionX: 0,
        elementPositionY: 0,
        buttons: 0,
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
    })

    const lastUpdateRef = useRef<number>(0)

    useEffect(() => {
        const element = ref?.current
        const target = trackOutside ? window : element

        if (!target) return

        const updateMouseState = (event: MouseEvent) => {
            // Throttle updates
            if (throttleMs > 0) {
                const now = Date.now()
                if (now - lastUpdateRef.current < throttleMs) {
                    return
                }
                lastUpdateRef.current = now
            }

            const newState: MouseState = {
                x: event.clientX,
                y: event.clientY,
                elementX: 0,
                elementY: 0,
                elementPositionX: 0,
                elementPositionY: 0,
                buttons: event.buttons,
                ctrlKey: event.ctrlKey,
                shiftKey: event.shiftKey,
                altKey: event.altKey,
                metaKey: event.metaKey,
            }

            // Calculate element-relative coordinates
            if (element) {
                const rect = element.getBoundingClientRect()
                newState.elementX = event.clientX - rect.left
                newState.elementY = event.clientY - rect.top

                // Calculate percentage position
                if (rect.width > 0) {
                    newState.elementPositionX = (newState.elementX / rect.width) * 100
                }
                if (rect.height > 0) {
                    newState.elementPositionY = (newState.elementY / rect.height) * 100
                }

                // Clamp percentage to 0-100
                newState.elementPositionX = Math.max(
                    0,
                    Math.min(100, newState.elementPositionX)
                )
                newState.elementPositionY = Math.max(
                    0,
                    Math.min(100, newState.elementPositionY)
                )
            }

            setState(newState)
        }

        const handleMouseLeave = () => {
            if (resetOnExit) {
                setState({
                    x: 0,
                    y: 0,
                    elementX: 0,
                    elementY: 0,
                    elementPositionX: 0,
                    elementPositionY: 0,
                    buttons: 0,
                    ctrlKey: false,
                    shiftKey: false,
                    altKey: false,
                    metaKey: false,
                })
            }
        }

        target.addEventListener('mousemove', updateMouseState as EventListener)

        if (element && resetOnExit) {
            element.addEventListener('mouseleave', handleMouseLeave)
        }

        return () => {
            target.removeEventListener('mousemove', updateMouseState as EventListener)
            if (element && resetOnExit) {
                element.removeEventListener('mouseleave', handleMouseLeave)
            }
        }
    }, [ref, trackOutside, resetOnExit, throttleMs])

    return state
}

export default useMouse
