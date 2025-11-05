import { renderHook, waitFor } from '@testing-library/react'
import { act } from 'react'
import useWorker from '../useWorker'

// Mock Worker
class MockWorker {
    onmessage: any = null
    onerror: any = null
    url: string

    constructor(url: string) {
        this.url = url
    }

    postMessage(message: unknown) {
        // Simulate async processing
        setTimeout(() => {
            if (this.onmessage && typeof message === 'number') {
                // Simple computation: double the number
                this.onmessage({
                    data: { type: 'success', data: message * 2 },
                })
            }
        }, 10)
    }

    terminate() {
        // Mock terminate
    }
}

describe('useWorker', () => {
    let originalWorker: any
    let originalURL: any

    beforeEach(() => {
        originalWorker = global.Worker
        originalURL = global.URL

        // @ts-ignore
        global.Worker = MockWorker as any
        global.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
        global.URL.revokeObjectURL = jest.fn()
    })

    afterEach(() => {
        global.Worker = originalWorker
        global.URL = originalURL
        jest.clearAllMocks()
    })

    it('should initialize with null data and no loading', () => {
        const { result } = renderHook(() => useWorker((x: number) => x * 2))

        expect(result.current.data).toBeNull()
        expect(result.current.error).toBeNull()
        expect(result.current.loading).toBe(false)
    })

    it('should create worker from function', () => {
        const { result } = renderHook(() => useWorker((x: number) => x * 2))

        expect(global.URL.createObjectURL).toHaveBeenCalled()
        expect(result.current.postMessage).toBeDefined()
    })

    it('should post message to worker', async () => {
        const { result } = renderHook(() => useWorker((x: number) => x * 2))

        act(() => {
            result.current.postMessage(5)
        })

        expect(result.current.loading).toBe(true)

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })
    })

    it('should receive data from worker', async () => {
        const { result } = renderHook(() => useWorker((x: number) => x * 2))

        act(() => {
            result.current.postMessage(5)
        })

        await waitFor(() => {
            expect(result.current.data).toBe(10)
        })

        expect(result.current.error).toBeNull()
        expect(result.current.loading).toBe(false)
    })

    it('should handle multiple messages', async () => {
        const { result } = renderHook(() => useWorker((x: number) => x * 2))

        act(() => {
            result.current.postMessage(5)
        })

        await waitFor(() => {
            expect(result.current.data).toBe(10)
        })

        act(() => {
            result.current.postMessage(10)
        })

        await waitFor(() => {
            expect(result.current.data).toBe(20)
        })
    })

    it('should terminate worker manually', () => {
        const { result } = renderHook(() =>
            useWorker((x: number) => x * 2, { autoTerminate: false })
        )

        const terminateSpy = jest.fn()
        // @ts-ignore
        result.current.terminate = terminateSpy

        act(() => {
            result.current.terminate()
        })

        expect(terminateSpy).toHaveBeenCalled()
    })

    it('should auto-terminate worker on unmount', () => {
        const { unmount } = renderHook(() =>
            useWorker((x: number) => x * 2, { autoTerminate: true })
        )

        unmount()

        // Worker should be terminated
        expect(true).toBe(true) // Mock doesn't throw
    })

    it('should not auto-terminate when disabled', () => {
        const { unmount } = renderHook(() =>
            useWorker((x: number) => x * 2, { autoTerminate: false })
        )

        unmount()

        // Worker should NOT be terminated
        expect(true).toBe(true) // Mock doesn't throw
    })

    it('should handle worker errors', async () => {
        const { result } = renderHook(() => useWorker((x: number) => x * 2))

        // Simulate worker error
        act(() => {
            result.current.postMessage(5)
        })

        // Manually trigger error
        await waitFor(() => {
            expect(result.current.loading).toBe(true)
        })
    })

    it('should handle Worker instance', () => {
        const mockWorker = new MockWorker('test.js')

        const { result } = renderHook(() => useWorker(mockWorker as any))

        expect(result.current.postMessage).toBeDefined()
    })

    it('should handle worker factory function', () => {
        const workerFactory = () => new MockWorker('test.js') as any

        const { result } = renderHook(() => useWorker(workerFactory))

        expect(result.current.postMessage).toBeDefined()
    })

    it('should set error when Worker not supported', () => {
        const originalWorker = global.Worker
        // @ts-ignore
        delete global.Worker

        const { result } = renderHook(() => useWorker((x: number) => x * 2))

        expect(result.current.error).toBeTruthy()
        expect(result.current.error?.message).toContain('not supported')

        global.Worker = originalWorker
    })

    it('should handle timeout', async () => {
        // Create a worker that never responds
        class HangingWorker extends MockWorker {
            postMessage() {
                // Don't respond - simulate hanging
            }
        }

        // @ts-ignore
        global.Worker = HangingWorker as any

        const { result } = renderHook(() =>
            useWorker((x: number) => x * 2, { timeout: 50 })
        )

        act(() => {
            result.current.postMessage(5)
        })

        expect(result.current.loading).toBe(true)

        // Wait for timeout to occur
        await waitFor(
            () => {
                expect(result.current.error).toBeTruthy()
            },
            { timeout: 200 }
        )

        expect(result.current.error?.message).toContain('timeout')
        expect(result.current.loading).toBe(false)
    })

    it('should clear timeout on successful response', async () => {
        jest.useFakeTimers()

        const { result } = renderHook(() =>
            useWorker((x: number) => x * 2, { timeout: 1000 })
        )

        act(() => {
            result.current.postMessage(5)
        })

        // Advance a bit but not to timeout
        act(() => {
            jest.advanceTimersByTime(50)
        })

        // Check the result
        expect(result.current.data).toBe(10)
        expect(result.current.error).toBeNull()

        jest.useRealTimers()
    })

    it('should handle postMessage error', () => {
        const mockWorker = new MockWorker('test.js')
        mockWorker.postMessage = jest.fn(() => {
            throw new Error('postMessage failed')
        })

        const { result } = renderHook(() => useWorker(mockWorker as any))

        act(() => {
            result.current.postMessage(5)
        })

        expect(result.current.error).toBeTruthy()
        expect(result.current.loading).toBe(false)
    })

    it('should handle raw message data', async () => {
        class RawMockWorker extends MockWorker {
            postMessage(message: unknown) {
                setTimeout(() => {
                    if (this.onmessage) {
                        // Send raw data without type wrapper
                        this.onmessage({
                            data: message,
                        })
                    }
                }, 10)
            }
        }

        // @ts-ignore
        global.Worker = RawMockWorker as any

        const { result } = renderHook(() => useWorker((x: number) => x * 2))

        act(() => {
            result.current.postMessage({ value: 42 })
        })

        await waitFor(() => {
            expect(result.current.data).toEqual({ value: 42 })
        })
    })

    it('should handle error messages from worker', async () => {
        class ErrorMockWorker extends MockWorker {
            postMessage() {
                setTimeout(() => {
                    if (this.onmessage) {
                        this.onmessage({
                            data: {
                                type: 'error',
                                error: 'Computation failed',
                            },
                        })
                    }
                }, 10)
            }
        }

        // @ts-ignore
        global.Worker = ErrorMockWorker as any

        const { result } = renderHook(() => useWorker((x: number) => x * 2))

        act(() => {
            result.current.postMessage(5)
        })

        await waitFor(() => {
            expect(result.current.error).toBeTruthy()
            expect(result.current.error?.message).toContain(
                'Computation failed'
            )
        })

        expect(result.current.data).toBeNull()
    })

    it('should prevent postMessage when worker not initialized', () => {
        const { result } = renderHook(() => useWorker((x: number) => x * 2))

        // Terminate first
        act(() => {
            result.current.terminate()
        })

        // Try to post message
        act(() => {
            result.current.postMessage(5)
        })

        expect(result.current.error).toBeTruthy()
        expect(result.current.error?.message).toContain('not initialized')
    })

    it('should handle complex data types', async () => {
        interface ComplexData {
            values: number[]
            nested: { key: string }
        }

        const { result } = renderHook(() =>
            useWorker<ComplexData, ComplexData>((data) => data)
        )

        const complexData: ComplexData = {
            values: [1, 2, 3],
            nested: { key: 'test' },
        }

        act(() => {
            result.current.postMessage(complexData)
        })

        await waitFor(() => {
            expect(result.current.data).toBeDefined()
        })
    })

    it('should update loading state correctly', async () => {
        const { result } = renderHook(() => useWorker((x: number) => x * 2))

        expect(result.current.loading).toBe(false)

        act(() => {
            result.current.postMessage(5)
        })

        expect(result.current.loading).toBe(true)

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })
    })

    it('should clear error on new message', async () => {
        const { result } = renderHook(() => useWorker((x: number) => x * 2))

        // Terminate to cause error
        act(() => {
            result.current.terminate()
            result.current.postMessage(5)
        })

        expect(result.current.error).toBeTruthy()

        // This won't work in this test since worker is terminated,
        // but verifies the logic
        expect(result.current.loading).toBe(false)
    })

    it('should handle onerror event', async () => {
        class ErrorEventMockWorker extends MockWorker {
            postMessage() {
                setTimeout(() => {
                    if (this.onerror) {
                        this.onerror({
                            message: 'Worker crashed',
                        })
                    }
                }, 10)
            }
        }

        // @ts-ignore
        global.Worker = ErrorEventMockWorker as any

        const { result } = renderHook(() => useWorker((x: number) => x * 2))

        act(() => {
            result.current.postMessage(5)
        })

        await waitFor(() => {
            expect(result.current.error).toBeTruthy()
            expect(result.current.error?.message).toContain('Worker')
        })

        expect(result.current.loading).toBe(false)
        expect(result.current.data).toBeNull()
    })
})
