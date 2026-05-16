import { RefObject, useEffect, useState } from 'react'

/**
 * Hook to detect when focus is within an element (like CSS :focus-within).
 * Returns true when the element or any of its descendants has focus.
 *
 * @template T - The type of HTML element
 * @param {RefObject<T>} ref - React ref to the element to monitor
 * @returns {boolean} True if element or any descendant has focus
 *
 * @example
 * const ref = useRef(null)
 * const isFocusWithin = useFocusWithin(ref)
 *
 * return (
 *   <div ref={ref}>
 *     {isFocusWithin && <p>Form has focus</p>}
 *     <input />
 *   </div>
 * )
 */
export default function useFocusWithin<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T>
): boolean {
    const [isFocusWithin, setIsFocusWithin] = useState(false)

    useEffect(() => {
        const element = ref.current

        if (!element) {
            return
        }

        const handleFocusIn = () => {
            setIsFocusWithin(true)
        }

        const handleFocusOut = (event: FocusEvent) => {
            // Check if focus is moving outside the element
            const relatedTarget = event.relatedTarget as Node | null

            if (!relatedTarget || !element.contains(relatedTarget)) {
                setIsFocusWithin(false)
            }
        }

        // Use focusin/focusout which bubble (unlike focus/blur)
        element.addEventListener('focusin', handleFocusIn)
        element.addEventListener('focusout', handleFocusOut)

        // Check initial focus state
        if (element.contains(document.activeElement)) {
            setIsFocusWithin(true)
        }

        return () => {
            element.removeEventListener('focusin', handleFocusIn)
            element.removeEventListener('focusout', handleFocusOut)
        }
    }, [ref])

    return isFocusWithin
}
