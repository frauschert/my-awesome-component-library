import { renderHook, act } from '@testing-library/react'
import { useSpinner } from './useSpinner'

describe('useSpinner', () => {
    test('initializes with false by default', () => {
        const { result } = renderHook(() => useSpinner())

        expect(result.current.loading).toBe(false)
    })

    test('initializes with custom value', () => {
        const { result } = renderHook(() => useSpinner(true))

        expect(result.current.loading).toBe(true)
    })

    test('setLoading updates loading state', () => {
        const { result } = renderHook(() => useSpinner())

        act(() => {
            result.current.setLoading(true)
        })

        expect(result.current.loading).toBe(true)

        act(() => {
            result.current.setLoading(false)
        })

        expect(result.current.loading).toBe(false)
    })

    test('withSpinner manages loading state for successful promise', async () => {
        const { result } = renderHook(() => useSpinner())
        const mockData = { id: 1, name: 'test' }

        expect(result.current.loading).toBe(false)

        let data: typeof mockData | undefined
        await act(async () => {
            data = await result.current.withSpinner(Promise.resolve(mockData))
        })

        expect(data).toEqual(mockData)
        expect(result.current.loading).toBe(false)
    })

    test('withSpinner manages loading state for rejected promise', async () => {
        const { result } = renderHook(() => useSpinner())
        const mockError = new Error('Test error')

        expect(result.current.loading).toBe(false)

        await expect(
            act(() => result.current.withSpinner(Promise.reject(mockError)))
        ).rejects.toThrow('Test error')

        expect(result.current.loading).toBe(false)
    })
})
