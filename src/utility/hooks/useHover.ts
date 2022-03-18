import { RefObject, useState } from 'react'
import useEventListener from './useEventListener'

export default function useHover(ref: RefObject<HTMLElement>) {
    const [hovered, setHovered] = useState(false)

    useEventListener(ref.current, 'mouseover', () => setHovered(true))
    useEventListener(ref.current, 'mouseout', () => setHovered(false))

    return hovered
}
