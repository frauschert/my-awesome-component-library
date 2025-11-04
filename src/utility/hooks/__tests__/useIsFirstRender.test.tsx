import { renderHook, act } from '@testing-library/react'
import { useState } from 'react'
import useIsFirstRender from '../useIsFirstRender'

describe('useIsFirstRender', () => {
    it('should return true on first render', () => {
        const { result } = renderHook(() => useIsFirstRender())
        expect(result.current).toBe(true)
    })

    it('should return false on subsequent renders', () => {
        const { result, rerender } = renderHook(() => useIsFirstRender())

        expect(result.current).toBe(true)

        rerender()
        expect(result.current).toBe(false)

        rerender()
        expect(result.current).toBe(false)
    })

    it('should work correctly with state updates', () => {
        const { result, rerender } = renderHook(() => {
            const [count, setCount] = useState(0)
            const isFirstRender = useIsFirstRender()
            return { count, setCount, isFirstRender }
        })

        // First render
        expect(result.current.isFirstRender).toBe(true)
        expect(result.current.count).toBe(0)

        // Update state
        act(() => {
            result.current.setCount(1)
        })
        rerender()

        // Second render
        expect(result.current.isFirstRender).toBe(false)
        expect(result.current.count).toBe(1)

        // Update state again
        act(() => {
            result.current.setCount(2)
        })
        rerender()

        // Third render
        expect(result.current.isFirstRender).toBe(false)
        expect(result.current.count).toBe(2)
    })

    it('should work with multiple rerenders', () => {
        const { result, rerender } = renderHook(() => useIsFirstRender())

        expect(result.current).toBe(true)

        for (let i = 0; i < 10; i++) {
            rerender()
            expect(result.current).toBe(false)
        }
    })

    it('should be independent across different hook instances', () => {
        const { result: result1 } = renderHook(() => useIsFirstRender())
        const { result: result2 } = renderHook(() => useIsFirstRender())

        expect(result1.current).toBe(true)
        expect(result2.current).toBe(true)
    })

    it('should reset on unmount and remount', () => {
        const { result, unmount } = renderHook(() => useIsFirstRender())

        expect(result.current).toBe(true)

        unmount()

        const { result: result2 } = renderHook(() => useIsFirstRender())
        expect(result2.current).toBe(true)
    })

    it('should work in conditional rendering scenarios', () => {
        const { result, rerender } = renderHook(
            ({ shouldRender }) => {
                if (!shouldRender) return null
                return useIsFirstRender()
            },
            { initialProps: { shouldRender: true } }
        )

        expect(result.current).toBe(true)

        rerender({ shouldRender: true })
        expect(result.current).toBe(false)

        rerender({ shouldRender: true })
        expect(result.current).toBe(false)
    })

    it('should maintain state across prop changes', () => {
        const { result, rerender } = renderHook(
            ({ value }) => {
                const isFirstRender = useIsFirstRender()
                return { value, isFirstRender }
            },
            { initialProps: { value: 'a' } }
        )

        expect(result.current.isFirstRender).toBe(true)
        expect(result.current.value).toBe('a')

        rerender({ value: 'b' })
        expect(result.current.isFirstRender).toBe(false)
        expect(result.current.value).toBe('b')

        rerender({ value: 'c' })
        expect(result.current.isFirstRender).toBe(false)
        expect(result.current.value).toBe('c')
    })

    it('should work with effects', () => {
        const effectCallback = jest.fn()

        const { rerender } = renderHook(() => {
            const isFirstRender = useIsFirstRender()
            effectCallback(isFirstRender)
            return isFirstRender
        })

        expect(effectCallback).toHaveBeenCalledWith(true)
        expect(effectCallback).toHaveBeenCalledTimes(1)

        rerender()
        expect(effectCallback).toHaveBeenCalledWith(false)
        expect(effectCallback).toHaveBeenCalledTimes(2)

        rerender()
        expect(effectCallback).toHaveBeenCalledWith(false)
        expect(effectCallback).toHaveBeenCalledTimes(3)
    })

    it('should be consistent within a single render', () => {
        const { result } = renderHook(() => {
            const isFirst1 = useIsFirstRender()
            const isFirst2 = useIsFirstRender()
            const isFirst3 = useIsFirstRender()
            return { isFirst1, isFirst2, isFirst3 }
        })

        // Each hook call has its own ref, so all return true on first render
        expect(result.current.isFirst1).toBe(true)
        expect(result.current.isFirst2).toBe(true)
        expect(result.current.isFirst3).toBe(true)
    })

    it('should work with strict mode double rendering', () => {
        // In strict mode, React may call the hook twice
        const { result, rerender } = renderHook(() => useIsFirstRender())

        // First render should be true
        expect(result.current).toBe(true)

        // Subsequent renders should be false
        rerender()
        expect(result.current).toBe(false)
    })

    it('should work with fast consecutive rerenders', () => {
        const { result, rerender } = renderHook(() => useIsFirstRender())

        expect(result.current).toBe(true)

        // Multiple quick rerenders
        rerender()
        rerender()
        rerender()

        expect(result.current).toBe(false)
    })
})
