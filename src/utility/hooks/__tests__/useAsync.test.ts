import { renderHook, act, waitFor } from '@testing-library/react'
import useAsync from '../useAsync'

const mockSuccess = () =>
    Promise.resolve({
        data: 'Mock data',
    })

const mockError = () => Promise.reject(new Error('An error occurred'))

describe('useAsync', () => {
    it('should start with loading state', () => {
        const { result } = renderHook(() => useAsync(mockSuccess))
        expect(result.current.isLoading).toBe(true)
        expect(result.current.data).toBe(undefined)
        expect(result.current.error).toBe(undefined)
    })

    it('should return value after successful async call', async () => {
        const { result } = renderHook(() => useAsync(mockSuccess))

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
            expect(result.current.data).toEqual({ data: 'Mock data' })
            expect(result.current.error).toBe(undefined)
        })
    })

    it('should return error object after failed async call', async () => {
        const { result } = renderHook(() => useAsync(mockError))

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
            expect(result.current.data).toBe(undefined)
            expect(result.current.error).toEqual(new Error('An error occurred'))
        })
    })

    it('should execute async function when execute method is called', async () => {
        const { result } = renderHook(() => useAsync(mockSuccess, false))

        expect(result.current.isLoading).toBe(false)

        act(() => {
            result.current.execute()
        })

        expect(result.current.isLoading).toBe(true)

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
            expect(result.current.data).toEqual({ data: 'Mock data' })
            expect(result.current.error).toBe(undefined)
        })
    })
})
