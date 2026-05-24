import { act, renderHook, waitFor } from '@testing-library/react'
import useDisplayMedia from '../useDisplayMedia'

type MockTrack = {
    kind: string
    stop: jest.Mock<void, []>
}

type MockStream = MediaStream & {
    getTracks: jest.Mock<MockTrack[], []>
}

function createMockStream() {
    const tracks: MockTrack[] = [{ kind: 'video', stop: jest.fn() }]

    const stream = {
        getTracks: jest.fn(() => tracks),
    } as unknown as MockStream

    return { stream, tracks }
}

const originalMediaDevices = navigator.mediaDevices

let mockGetDisplayMedia: jest.Mock

beforeEach(() => {
    mockGetDisplayMedia = jest.fn()

    Object.defineProperty(navigator, 'mediaDevices', {
        value: {
            getDisplayMedia: mockGetDisplayMedia,
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

describe('useDisplayMedia', () => {
    it('initialises with idle state', () => {
        const { result } = renderHook(() => useDisplayMedia())

        expect(result.current.stream).toBe(null)
        expect(result.current.error).toBe(null)
        expect(result.current.loading).toBe(false)
        expect(result.current.isSupported).toBe(true)
        expect(result.current.isActive).toBe(false)
    })

    it('requests a display stream with default screen-video constraints', async () => {
        const { stream } = createMockStream()
        const onSuccess = jest.fn()

        mockGetDisplayMedia.mockResolvedValue(stream)

        const { result } = renderHook(() => useDisplayMedia({ onSuccess }))

        let returnedStream: MediaStream | null = null

        await act(async () => {
            returnedStream = await result.current.start()
        })

        expect(mockGetDisplayMedia).toHaveBeenCalledWith({ video: true })
        expect(returnedStream).toBe(stream)
        expect(result.current.stream).toBe(stream)
        expect(result.current.isActive).toBe(true)
        expect(result.current.loading).toBe(false)
        expect(onSuccess).toHaveBeenCalledWith(stream)
    })

    it('allows overriding default constraints when starting', async () => {
        const { stream } = createMockStream()
        const overrideConstraints = { audio: true, video: true }

        mockGetDisplayMedia.mockResolvedValue(stream)

        const { result } = renderHook(() =>
            useDisplayMedia({ constraints: { video: true } })
        )

        await act(async () => {
            await result.current.start(overrideConstraints)
        })

        expect(mockGetDisplayMedia).toHaveBeenCalledWith(overrideConstraints)
        expect(result.current.stream).toBe(stream)
    })

    it('starts immediately when immediate is true', async () => {
        const constraints = { audio: true, video: true }
        const { stream } = createMockStream()

        mockGetDisplayMedia.mockResolvedValue(stream)

        const { result } = renderHook(() =>
            useDisplayMedia({ constraints, immediate: true })
        )

        await waitFor(() => {
            expect(mockGetDisplayMedia).toHaveBeenCalledWith(constraints)
            expect(result.current.stream).toBe(stream)
        })
    })

    it('stops all tracks and clears the active stream', async () => {
        const { stream, tracks } = createMockStream()

        mockGetDisplayMedia.mockResolvedValue(stream)

        const { result } = renderHook(() => useDisplayMedia())

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

    it('surfaces rejected getDisplayMedia calls as errors', async () => {
        const mediaError = new Error('Permission denied')
        const onError = jest.fn()

        mockGetDisplayMedia.mockRejectedValue(mediaError)

        const { result } = renderHook(() =>
            useDisplayMedia({ constraints: { video: true }, onError })
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
        const { result } = renderHook(() =>
            useDisplayMedia({
                constraints: { audio: false, video: false },
                onError,
            })
        )

        await act(async () => {
            await result.current.start({ audio: false, video: false })
        })

        expect(result.current.error?.message).toBe(
            'useDisplayMedia requires audio and/or video constraints'
        )
        expect(onError).toHaveBeenCalledWith(result.current.error)
        expect(mockGetDisplayMedia).not.toHaveBeenCalled()
    })

    it('reports unsupported browsers', async () => {
        Object.defineProperty(navigator, 'mediaDevices', {
            value: undefined,
            configurable: true,
            writable: true,
        })

        const { result } = renderHook(() => useDisplayMedia())

        await act(async () => {
            await result.current.start()
        })

        expect(result.current.isSupported).toBe(false)
        expect(result.current.error?.message).toBe(
            'MediaDevices.getDisplayMedia is not supported by this browser'
        )
    })

    it('discards late streams after stop is called', async () => {
        let resolveRequest: ((value: MediaStream) => void) | null = null

        mockGetDisplayMedia.mockImplementation(
            () =>
                new Promise<MediaStream>((resolve) => {
                    resolveRequest = resolve
                })
        )

        const { result } = renderHook(() => useDisplayMedia())

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

        mockGetDisplayMedia.mockResolvedValue(stream)

        const { result, unmount } = renderHook(() => useDisplayMedia())

        await act(async () => {
            await result.current.start()
        })

        unmount()

        tracks.forEach((track) => {
            expect(track.stop).toHaveBeenCalledTimes(1)
        })
    })
})
