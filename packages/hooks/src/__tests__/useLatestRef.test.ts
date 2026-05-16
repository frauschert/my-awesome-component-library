import { renderHook } from '@testing-library/react'
import { useLatestRef } from '../useLatestRef'

describe('useLatestRef', () => {
    test('should return a ref object', () => {
        const { result } = renderHook(() => useLatestRef<number>(0))
        expect(result.current).toHaveProperty('current')
    })

    test('should return the latest value assigned', () => {
        const initialValue = { name: 'test' }
        const updatedValue = { name: 'updated-test' }

        const { result, rerender } = renderHook(
            ({ value }) => useLatestRef(value),
            { initialProps: { value: initialValue } }
        )

        rerender({ value: updatedValue })
        expect(result.current.current).toBe(updatedValue)
    })

    test('should not update if the same value is assigned', () => {
        const input = { data: [1, 2, 3] }

        const { result, rerender } = renderHook(
            ({ input }) => useLatestRef(input),
            { initialProps: { input } }
        )

        rerender({ input }) // same value as the initialProps

        expect(result.current.current).toBe(input)
    })
})
