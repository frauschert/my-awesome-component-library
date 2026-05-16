import { renderHook, act, waitFor } from '@testing-library/react'
import useClipboard from '../useClipboard'

describe('useClipboard', () => {
    let writeTextMock: jest.Mock
    let readTextMock: jest.Mock
    let execCommandMock: jest.Mock

    beforeEach(() => {
        jest.useFakeTimers()
        writeTextMock = jest.fn().mockResolvedValue(undefined)
        readTextMock = jest.fn().mockResolvedValue('clipboard text')
        execCommandMock = jest.fn().mockReturnValue(true)

        Object.defineProperty(window.navigator, 'clipboard', {
            writable: true,
            configurable: true,
            value: {
                writeText: writeTextMock,
                readText: readTextMock,
            },
        })

        document.execCommand = execCommandMock
    })

    afterEach(() => {
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
        jest.clearAllMocks()
    })

    test('detects API support', () => {
        const { result } = renderHook(() => useClipboard())

        expect(result.current.isSupported).toBe(true)
    })

    test('detects no support when API is unavailable', () => {
        const originalClipboard = window.navigator.clipboard

        // @ts-expect-error - Deleting for test
        delete window.navigator.clipboard

        const { result } = renderHook(() => useClipboard())

        expect(result.current.isSupported).toBe(false)

        // Restore
        Object.defineProperty(window.navigator, 'clipboard', {
            writable: true,
            configurable: true,
            value: originalClipboard,
        })
    })

    test('initial state is correct', () => {
        const { result } = renderHook(() => useClipboard())

        expect(result.current.text).toBeNull()
        expect(result.current.copied).toBe(false)
        expect(result.current.error).toBeNull()
    })

    test('copies text to clipboard', async () => {
        const { result } = renderHook(() => useClipboard())

        await act(async () => {
            await result.current.copy('Hello World')
        })

        expect(writeTextMock).toHaveBeenCalledWith('Hello World')
        expect(result.current.text).toBe('Hello World')
        expect(result.current.copied).toBe(true)
        expect(result.current.error).toBeNull()
    })

    test('resets copied state after duration', async () => {
        const { result } = renderHook(() =>
            useClipboard({ successDuration: 1000 })
        )

        await act(async () => {
            await result.current.copy('Test')
        })

        expect(result.current.copied).toBe(true)

        act(() => {
            jest.advanceTimersByTime(1000)
        })

        expect(result.current.copied).toBe(false)
    })

    test('calls onSuccess callback', async () => {
        const onSuccess = jest.fn()
        const { result } = renderHook(() => useClipboard({ onSuccess }))

        await act(async () => {
            await result.current.copy('Success!')
        })

        expect(onSuccess).toHaveBeenCalledWith('Success!')
    })

    test('handles copy errors', async () => {
        const onError = jest.fn()
        writeTextMock.mockRejectedValue(new Error('Permission denied'))

        // Mock document.execCommand to also fail
        execCommandMock.mockReturnValue(false)

        const { result } = renderHook(() => useClipboard({ onError }))

        await act(async () => {
            await result.current.copy('Fail')
        })

        await waitFor(() => {
            expect(result.current.error).toBeTruthy()
            expect(result.current.copied).toBe(false)
            expect(onError).toHaveBeenCalled()
        })
    })

    test('falls back to execCommand when clipboard API fails', async () => {
        writeTextMock.mockRejectedValue(new Error('API failed'))

        const { result } = renderHook(() => useClipboard())

        await act(async () => {
            await result.current.copy('Fallback text')
        })

        await waitFor(() => {
            expect(execCommandMock).toHaveBeenCalledWith('copy')
            expect(result.current.copied).toBe(true)
            expect(result.current.text).toBe('Fallback text')
        })
    })

    test('reads text from clipboard', async () => {
        const { result } = renderHook(() => useClipboard())

        await act(async () => {
            await result.current.read()
        })

        expect(readTextMock).toHaveBeenCalled()
        expect(result.current.text).toBe('clipboard text')
        expect(result.current.error).toBeNull()
    })

    test('handles read errors', async () => {
        const onError = jest.fn()
        readTextMock.mockRejectedValue(new Error('Permission denied'))

        const { result } = renderHook(() => useClipboard({ onError }))

        await act(async () => {
            await result.current.read()
        })

        await waitFor(() => {
            expect(result.current.error).toBeTruthy()
            expect(result.current.text).toBeNull()
            expect(onError).toHaveBeenCalled()
        })
    })

    test('clears clipboard', async () => {
        const { result } = renderHook(() => useClipboard())

        await act(async () => {
            await result.current.clear()
        })

        expect(writeTextMock).toHaveBeenCalledWith('')
        expect(result.current.text).toBe('')
        expect(result.current.error).toBeNull()
    })

    test('handles clear errors', async () => {
        const onError = jest.fn()
        writeTextMock.mockRejectedValue(new Error('Clear failed'))

        const { result } = renderHook(() => useClipboard({ onError }))

        await act(async () => {
            await result.current.clear()
        })

        await waitFor(() => {
            expect(result.current.error).toBeTruthy()
            expect(onError).toHaveBeenCalled()
        })
    })

    test('handles unsupported API on copy', async () => {
        const originalClipboard = window.navigator.clipboard

        // @ts-expect-error - Deleting for test
        delete window.navigator.clipboard

        const onError = jest.fn()
        const { result } = renderHook(() => useClipboard({ onError }))

        await act(async () => {
            await result.current.copy('Test')
        })

        expect(result.current.error?.message).toBe(
            'Clipboard API not supported'
        )
        expect(onError).toHaveBeenCalled()

        // Restore
        Object.defineProperty(window.navigator, 'clipboard', {
            writable: true,
            configurable: true,
            value: originalClipboard,
        })
    })

    test('handles unsupported API on read', async () => {
        const originalClipboard = window.navigator.clipboard

        // @ts-expect-error - Deleting for test
        delete window.navigator.clipboard

        const onError = jest.fn()
        const { result } = renderHook(() => useClipboard({ onError }))

        await act(async () => {
            await result.current.read()
        })

        expect(result.current.error?.message).toBe(
            'Clipboard API not supported'
        )
        expect(onError).toHaveBeenCalled()

        // Restore
        Object.defineProperty(window.navigator, 'clipboard', {
            writable: true,
            configurable: true,
            value: originalClipboard,
        })
    })

    test('handles unsupported API on clear', async () => {
        const originalClipboard = window.navigator.clipboard

        // @ts-expect-error - Deleting for test
        delete window.navigator.clipboard

        const onError = jest.fn()
        const { result } = renderHook(() => useClipboard({ onError }))

        await act(async () => {
            await result.current.clear()
        })

        expect(result.current.error?.message).toBe(
            'Clipboard API not supported'
        )
        expect(onError).toHaveBeenCalled()

        // Restore
        Object.defineProperty(window.navigator, 'clipboard', {
            writable: true,
            configurable: true,
            value: originalClipboard,
        })
    })

    test('copies multiple times', async () => {
        const { result } = renderHook(() => useClipboard())

        await act(async () => {
            await result.current.copy('First')
        })

        expect(result.current.text).toBe('First')
        expect(result.current.copied).toBe(true)

        act(() => {
            jest.advanceTimersByTime(2000)
        })

        expect(result.current.copied).toBe(false)

        await act(async () => {
            await result.current.copy('Second')
        })

        expect(result.current.text).toBe('Second')
        expect(result.current.copied).toBe(true)
    })

    test('custom success duration', async () => {
        const { result } = renderHook(() =>
            useClipboard({ successDuration: 5000 })
        )

        await act(async () => {
            await result.current.copy('Test')
        })

        expect(result.current.copied).toBe(true)

        act(() => {
            jest.advanceTimersByTime(3000)
        })

        expect(result.current.copied).toBe(true)

        act(() => {
            jest.advanceTimersByTime(2000)
        })

        expect(result.current.copied).toBe(false)
    })
})
