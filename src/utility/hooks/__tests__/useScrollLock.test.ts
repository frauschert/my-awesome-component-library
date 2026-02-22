import { renderHook } from '@testing-library/react'
import useScrollLock from '../useScrollLock'

describe('useScrollLock', () => {
    afterEach(() => {
        document.body.style.overflow = ''
    })

    it('should lock body scroll when enabled', () => {
        renderHook(() => useScrollLock({ enabled: true }))
        expect(document.body.style.overflow).toBe('hidden')
    })

    it('should not lock body scroll when disabled', () => {
        document.body.style.overflow = 'auto'
        renderHook(() => useScrollLock({ enabled: false }))
        expect(document.body.style.overflow).toBe('auto')
    })

    it('should restore previous overflow on unmount', () => {
        document.body.style.overflow = 'scroll'
        const { unmount } = renderHook(() => useScrollLock({ enabled: true }))
        expect(document.body.style.overflow).toBe('hidden')
        unmount()
        expect(document.body.style.overflow).toBe('scroll')
    })

    it('should default to enabled when no options provided', () => {
        renderHook(() => useScrollLock())
        expect(document.body.style.overflow).toBe('hidden')
    })

    it('should react to enabled changing', () => {
        const { rerender } = renderHook(
            ({ enabled }) => useScrollLock({ enabled }),
            { initialProps: { enabled: false } }
        )
        expect(document.body.style.overflow).not.toBe('hidden')

        rerender({ enabled: true })
        expect(document.body.style.overflow).toBe('hidden')
    })
})
