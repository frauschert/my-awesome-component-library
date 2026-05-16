import { renderHook, act } from '@testing-library/react'
import usePrevious from '../usePrevious'

describe('usePrevious', () => {
    it('returns undefined on initial render', () => {
        const { result } = renderHook(() => usePrevious(42))
        expect(result.current).toBeUndefined()
    })

    it('returns previous value after update', () => {
        const { result, rerender } = renderHook((props) => usePrevious(props), {
            initialProps: 42,
        })
        expect(result.current).toBeUndefined()

        act(() => {
            rerender(43)
        })

        expect(result.current).toBe(42)
    })
})
