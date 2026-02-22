import { useEffect } from 'react'

export interface UseScrollLockOptions {
    /** Whether scroll lock is active */
    enabled?: boolean
}

/**
 * Locks body scroll when enabled. Saves and restores the previous
 * overflow value on cleanup.
 */
export default function useScrollLock({
    enabled = true,
}: UseScrollLockOptions = {}): void {
    useEffect(() => {
        if (!enabled) return

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = previousOverflow
        }
    }, [enabled])
}
