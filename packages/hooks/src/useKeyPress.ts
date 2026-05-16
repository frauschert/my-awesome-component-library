import { useEffect, useState } from 'react'

/**
 * Custom hook to detect when a specific key is pressed.
 *
 * @param {string | string[]} targetKey - The key(s) to listen for (e.g., 'Enter', 'Escape', ['a', 'A']).
 * @param {EventTarget} [eventTarget=window] - The target to attach the event listener to.
 * @returns {boolean} - True if the key is currently pressed, false otherwise.
 *
 * @example
 * const enterPressed = useKeyPress('Enter')
 * const escapePressed = useKeyPress('Escape')
 * const shiftPressed = useKeyPress('Shift')
 * const aPressed = useKeyPress(['a', 'A']) // case-insensitive
 */
export default function useKeyPress(
    targetKey: string | string[],
    eventTarget: EventTarget = typeof window !== 'undefined'
        ? window
        : ({} as EventTarget)
): boolean {
    const [keyPressed, setKeyPressed] = useState(false)

    useEffect(() => {
        // Normalize targetKey to array for consistent handling
        const keys = Array.isArray(targetKey) ? targetKey : [targetKey]

        const downHandler = (event: Event) => {
            const keyboardEvent = event as KeyboardEvent
            if (keys.includes(keyboardEvent.key)) {
                setKeyPressed(true)
            }
        }

        const upHandler = (event: Event) => {
            const keyboardEvent = event as KeyboardEvent
            if (keys.includes(keyboardEvent.key)) {
                setKeyPressed(false)
            }
        }

        // Add event listeners
        eventTarget.addEventListener('keydown', downHandler)
        eventTarget.addEventListener('keyup', upHandler)

        // Cleanup
        return () => {
            eventTarget.removeEventListener('keydown', downHandler)
            eventTarget.removeEventListener('keyup', upHandler)
        }
    }, [targetKey, eventTarget])

    return keyPressed
}
