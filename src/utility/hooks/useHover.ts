import { RefObject } from 'react'
import useEventListener from './useEventListener'
import useToggle from './useToggle'

/**
 * Custom hook to track hover state of an element.
 *
 * @param {RefObject<HTMLElement>} ref - The ref of the element to track.
 * @returns {boolean} - True if the element is hovered, false otherwise.
 */
export default function useHover(ref: RefObject<HTMLElement>) {
    const [hovered, toggle] = useToggle(false)

    useEventListener(ref, 'mouseover', toggle)
    useEventListener(ref, 'mouseout', toggle)

    return hovered
}
