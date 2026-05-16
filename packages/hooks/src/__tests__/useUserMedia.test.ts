import { act, renderHook, waitFor } from '@testing-library/react'
import useUserMedia from '../useUserMedia'

type MockTrack = {
    kind: string
    stop: jest.Mock<void, []>
}

type MockStream = MediaStream & {
    getTracks: jest.Mock<MockTrack[], []>
}

function createMockStream() {
    const tracks: MockTrack[] = [
        { kind: 'audio', stop: jest.fn() },
        { kind: 'video', stop: jest.fn() },
    ]

    const stream = {
        getTracks: jest.fn(() => tracks),
    } as unknown as MockStream

    return { stream, tracks }
}

const originalMediaDevices = navigator.mediaDevices

let mockGetUserMedia: jest.Mock

beforeEach(() => {
    mockGetUserMedia = jest.fn()

    Object.defineProperty(navigator, 'mediaDevices', {
        value: {
            getUserMedia: mockGetUserMedia,
        },
        configurable: true,
        writable: true,
    })
})

afterEach(() => {
    Object.defineProperty(navigator, 'mediaDevices', {
        value: originalMediaDevices,
        configurable: true,
        writable: true,
    })

    jest.clearAllMocks()
})

describe('useUserMedia', () => {
    it('initialises with idle state', () => {
        const { result } = renderHook(() => useUserMedia())

        expect(result.current.stream).toBe(null)
        expect(result.current.error).toBe(null)
        expect(result.current.loading).toBe(false)
        expect(result.current.isSupported).toBe(true)
        expect(result.current.isActive).toBe(false)
    })

    it('requests a stream with the configured constraints', async () => {
        const constraints = { video: true }
        const { stream } = createMockStream()
        const onSuccess = jest.fn()

        mockGetUserMedia.mockResolvedValue(stream)

        const { result } = renderHook(() =>
            useUserMedia({ constraints, onSuccess })
        )

        let returnedStream: MediaStream | null = null

        await act(async () => {
            returnedStream = await result.current.start()
        })

        expect(mockGetUserMedia).toHaveBeenCalledWith(constraints)
        expect(returnedStream).toBe(stream)
        expect(result.current.stream).toBe(stream)
        expect(result.current.isActive).toBe(true)
        expect(result.current.loading).toBe(false)
        expect(onSuccess).toHaveBeenCalledWith(stream)
    })

    it('allows overriding default constraints when starting', async () => {
        const { stream } = createMockStream()
        const overrideConstraints = { audio: true }

        mockGetUserMedia.mockResolvedValue(stream)

        const { result } = renderHook(() =>
            useUserMedia({ constraints: { video: true } })
        )

        await act(async () => {
            await result.current.start(overrideConstraints)
        })

        expect(mockGetUserMedia).toHaveBeenCalledWith(overrideConstraints)
        expect(result.current.stream).toBe(stream)
    })

    it('starts immediately when immediate is true', async () => {
        const constraints = { audio: true, video: true }
        const { stream } = createMockStream()

        mockGetUserMedia.mockResolvedValue(stream)

        const { result } = renderHook(() =>
            useUserMedia({ constraints, immediate: true })
        )

        await waitFor(() => {
            expect(mockGetUserMedia).toHaveBeenCalledWith(constraints)
            expect(result.current.stream).toBe(stream)
        })
    })

    it('stops all tracks and clears the active stream', async () => {
        const { stream, tracks } = createMockStream()

        mockGetUserMedia.mockResolvedValue(stream)

        const { result } = renderHook(() =>
            useUserMedia({ constraints: { video: true } })
        )

        await act(async () => {
            await result.current.start()
        })

        act(() => {
            result.current.stop()
        })

        expect(result.current.stream).toBe(null)
        expect(result.current.isActive).toBe(false)
        tracks.forEach((track) => {
            expect(track.stop).toHaveBeenCalledTimes(1)
        })
    })

    it('surfaces rejected getUserMedia calls as errors', async () => {
        const mediaError = new Error('Permission denied')
        const onError = jest.fn()

        mockGetUserMedia.mockRejectedValue(mediaError)

        const { result } = renderHook(() =>
            useUserMedia({ constraints: { audio: true }, onError })
        )

        await act(async () => {
            await result.current.start()
        })

        expect(result.current.stream).toBe(null)
        expect(result.current.error).toBe(mediaError)
        expect(result.current.loading).toBe(false)
        expect(onError).toHaveBeenCalledWith(mediaError)
    })

    it('reports an error when no usable constraints are provided', async () => {
        const onError = jest.fn()
        const { result } = renderHook(() => useUserMedia({ onError }))

        await act(async () => {
            await result.current.start()
        })

        expect(result.current.error?.message).toBe(
            'useUserMedia requires audio and/or video constraints'
        )
        expect(onError).toHaveBeenCalledWith(result.current.error)
        expect(mockGetUserMedia).not.toHaveBeenCalled()
    })

    it('reports unsupported browsers', async () => {
        Object.defineProperty(navigator, 'mediaDevices', {
            value: undefined,
            configurable: true,
            writable: true,
        })

        const { result } = renderHook(() =>
            useUserMedia({ constraints: { video: true } })
        )

        await act(async () => {
            await result.current.start()
        })

        expect(result.current.isSupported).toBe(false)
        expect(result.current.error?.message).toBe(
            'MediaDevices.getUserMedia is not supported by this browser'
        )
    })

    it('discards late streams after stop is called', async () => {
        let resolveRequest: ((value: MediaStream) => void) | null = null

        mockGetUserMedia.mockImplementation(
            () =>
                new Promise<MediaStream>((resolve) => {
                    resolveRequest = resolve
                })
        )

        const { result } = renderHook(() =>
            useUserMedia({ constraints: { video: true } })
        )

        act(() => {
            void result.current.start()
        })

        act(() => {
            result.current.stop()
        })

        const { stream, tracks } = createMockStream()

        await act(async () => {
            resolveRequest?.(stream)
            await Promise.resolve()
        })

        expect(result.current.stream).toBe(null)
        tracks.forEach((track) => {
            expect(track.stop).toHaveBeenCalledTimes(1)
        })
    })

    it('stops the active stream on unmount', async () => {
        const { stream, tracks } = createMockStream()

        mockGetUserMedia.mockResolvedValue(stream)

        const { result, unmount } = renderHook(() =>
            useUserMedia({ constraints: { audio: true } })
        )

        await act(async () => {
            await result.current.start()
        })

        unmount()

        tracks.forEach((track) => {
            expect(track.stop).toHaveBeenCalledTimes(1)
        })
    })
})
