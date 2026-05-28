import { act, renderHook } from '@testing-library/react'
import useEyeDropper from '../useEyeDropper'

type PendingOpenRequest = {
    resolve: (result: { sRGBHex: string }) => void
    reject: (error: Error) => void
}

const originalEyeDropper = Object.getOwnPropertyDescriptor(window, 'EyeDropper')

let pendingOpenRequest: PendingOpenRequest | null
let mockOpenImplementation: jest.Mock<
    Promise<{ sRGBHex: string }>,
    [{ signal?: AbortSignal }?]
>

class MockEyeDropper {
    open = jest.fn((options?: { signal?: AbortSignal }) =>
        mockOpenImplementation(options)
    )
}

beforeEach(() => {
    pendingOpenRequest = null

    mockOpenImplementation = jest.fn(async () => ({
        sRGBHex: '#112233',
    }))

    Object.defineProperty(window, 'EyeDropper', {
        value: MockEyeDropper,
        configurable: true,
        writable: true,
    })
})

afterEach(() => {
    if (originalEyeDropper) {
        Object.defineProperty(window, 'EyeDropper', originalEyeDropper)
    } else {
        delete (window as Window & { EyeDropper?: unknown }).EyeDropper
    }

    jest.clearAllMocks()
})

describe('useEyeDropper', () => {
    it('initialises with idle state', () => {
        const { result } = renderHook(() => useEyeDropper())

        expect(result.current.result).toBe(null)
        expect(result.current.sRGBHex).toBe(null)
        expect(result.current.error).toBe(null)
        expect(result.current.isSupported).toBe(true)
        expect(result.current.isOpen).toBe(false)
    })

    it('opens the eyedropper and stores the picked color', async () => {
        const onOpen = jest.fn()
        const onPick = jest.fn()
        const onClose = jest.fn()
        const { result } = renderHook(() =>
            useEyeDropper({ onOpen, onPick, onClose })
        )

        let pickedResult: { sRGBHex: string } | null = null

        await act(async () => {
            pickedResult = await result.current.open()
        })

        expect(result.current.result).toEqual({ sRGBHex: '#112233' })
        expect(result.current.sRGBHex).toBe('#112233')
        expect(result.current.isOpen).toBe(false)
        expect(pickedResult).toEqual({ sRGBHex: '#112233' })
        expect(onOpen).toHaveBeenCalledTimes(1)
        expect(onPick).toHaveBeenCalledWith({ sRGBHex: '#112233' })
        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('reports unsupported browsers', async () => {
        Object.defineProperty(window, 'EyeDropper', {
            value: undefined,
            configurable: true,
            writable: true,
        })

        const onError = jest.fn()
        const { result } = renderHook(() => useEyeDropper({ onError }))

        await act(async () => {
            await result.current.open()
        })

        expect(result.current.isSupported).toBe(false)
        expect(result.current.error?.message).toBe(
            'EyeDropper is not supported by this browser'
        )
        expect(onError).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'EyeDropper is not supported by this browser',
            })
        )
    })

    it('surfaces open failures as errors', async () => {
        const onError = jest.fn()
        mockOpenImplementation.mockRejectedValue(new Error('pick failed'))

        const { result } = renderHook(() => useEyeDropper({ onError }))

        await act(async () => {
            await result.current.open()
        })

        expect(result.current.error?.message).toBe('pick failed')
        expect(result.current.isOpen).toBe(false)
        expect(onError).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'pick failed' })
        )
    })

    it('aborts an active eyedropper session without surfacing an error', async () => {
        const onClose = jest.fn()
        const onError = jest.fn()

        mockOpenImplementation.mockImplementation(
            (options?: { signal?: AbortSignal }) =>
                new Promise<{ sRGBHex: string }>((resolve, reject) => {
                    pendingOpenRequest = { resolve, reject }

                    options?.signal?.addEventListener(
                        'abort',
                        () => {
                            const abortError = new Error('aborted')
                            abortError.name = 'AbortError'
                            reject(abortError)
                        },
                        { once: true }
                    )
                })
        )

        const { result } = renderHook(() => useEyeDropper({ onClose, onError }))

        let openPromise: Promise<{ sRGBHex: string } | null>

        act(() => {
            openPromise = result.current.open()
        })

        expect(result.current.isOpen).toBe(true)
        expect(pendingOpenRequest).not.toBe(null)

        act(() => {
            result.current.abort()
        })

        await act(async () => {
            await openPromise
        })

        expect(result.current.isOpen).toBe(false)
        expect(result.current.error).toBe(null)
        expect(onClose).toHaveBeenCalledTimes(1)
        expect(onError).not.toHaveBeenCalled()
    })
})
