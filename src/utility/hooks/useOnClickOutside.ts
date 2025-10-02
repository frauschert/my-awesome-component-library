import { RefObject, useEffect } from 'react'

function useOnClickOutside(
    refs: RefObject<HTMLElement | null>[] | RefObject<HTMLElement | null>,
    handler: (event: MouseEvent | TouchEvent) => void
) {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const refsArray = Array.isArray(refs) ? refs : [refs]
            const target = event.target as Node

            // Do nothing if any ref contains the target
            if (refsArray.some((ref) => ref.current?.contains(target))) {
                return
            }

            handler(event)
        }

        document.addEventListener('mousedown', listener)
        document.addEventListener('touchstart', listener)

        return () => {
            document.removeEventListener('mousedown', listener)
            document.removeEventListener('touchstart', listener)
        }
    }, [refs, handler])
}

export default useOnClickOutside

export function useMenuPosition(
    triggerRef: React.RefObject<HTMLElement | null>,
    placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom',
    offset = 4
) {
    return () => {
        const rect = triggerRef.current?.getBoundingClientRect()
        if (!rect) return {}

        switch (placement) {
            case 'top':
                return {
                    bottom: window.innerHeight - rect.top + offset,
                    left: rect.left,
                }
            case 'bottom':
                return {
                    top: rect.bottom + offset,
                    left: rect.left,
                }
            case 'left':
                return {
                    top: rect.top,
                    right: window.innerWidth - rect.left + offset,
                }
            case 'right':
                return {
                    top: rect.top,
                    left: rect.right + offset,
                }
        }
    }
}
