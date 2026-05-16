import { renderHook } from '@testing-library/react'
import useEffectOnce from '../useEffectOnce'

describe('useEffectOnce', () => {
    it('calls the callback once when component is mounted', () => {
        const mockCallback = jest.fn()

        renderHook(() => useEffectOnce(mockCallback))

        expect(mockCallback).toHaveBeenCalledTimes(1)
    })

    it('does not call the callback again on subsequent re-renders', () => {
        const mockCallback = jest.fn()

        const { rerender } = renderHook(() => useEffectOnce(mockCallback))

        rerender()

        expect(mockCallback).toHaveBeenCalledTimes(1)
    })
})
