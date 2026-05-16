import { act, renderHook } from '@testing-library/react'
import useMediaRecorder from '../useMediaRecorder'

type MockStream = MediaStream & {
    getTracks: jest.Mock<Array<{ stop: jest.Mock<void, []> }>, []>
}

function createMockStream() {
    return {
        getTracks: jest.fn(() => [{ stop: jest.fn() }]),
    } as unknown as MockStream
}

class MockMediaRecorder {
    static isTypeSupported = jest.fn(
        (mimeType: string) => mimeType !== 'video/mp4'
    )

    stream: MediaStream
    options?: {
        mimeType?: string
        bitsPerSecond?: number
        audioBitsPerSecond?: number
        videoBitsPerSecond?: number
    }
    state: 'inactive' | 'recording' | 'paused' = 'inactive'
    mimeType: string
    onstart: (() => void) | null = null
    onstop: (() => void) | null = null
    onpause: (() => void) | null = null
    onresume: (() => void) | null = null
    ondataavailable: ((event: { data: Blob }) => void) | null = null
    onerror: ((event: { error?: Error | null }) => void) | null = null

    start = jest.fn((timeslice?: number) => {
        this.lastTimeslice = timeslice
        this.state = 'recording'
        this.onstart?.()
    })

    stop = jest.fn(() => {
        this.state = 'inactive'
        this.onstop?.()
    })

    pause = jest.fn(() => {
        this.state = 'paused'
        this.onpause?.()
    })

    resume = jest.fn(() => {
        this.state = 'recording'
        this.onresume?.()
    })

    requestData = jest.fn()
    lastTimeslice?: number

    constructor(
        stream: MediaStream,
        options?: {
            mimeType?: string
            bitsPerSecond?: number
            audioBitsPerSecond?: number
            videoBitsPerSecond?: number
        }
    ) {
        this.stream = stream
        this.options = options
        this.mimeType = options?.mimeType ?? 'audio/webm'
        mockRecorderInstance = this
    }

    emitData(blob: Blob) {
        this.ondataavailable?.({ data: blob })
    }

    emitError(error: Error) {
        this.state = 'inactive'
        this.onerror?.({ error })
    }
}

const originalMediaRecorder = (window as Window & { MediaRecorder?: unknown })
    .MediaRecorder

let mockRecorderInstance: MockMediaRecorder | null

beforeEach(() => {
    mockRecorderInstance = null

    Object.defineProperty(window, 'MediaRecorder', {
        value: MockMediaRecorder,
        configurable: true,
        writable: true,
    })
})

afterEach(() => {
    Object.defineProperty(window, 'MediaRecorder', {
        value: originalMediaRecorder,
        configurable: true,
        writable: true,
    })

    jest.clearAllMocks()
})

describe('useMediaRecorder', () => {
    it('initialises with idle supported state', () => {
        const { result } = renderHook(() =>
            useMediaRecorder(createMockStream())
        )

        expect(result.current.status).toBe('inactive')
        expect(result.current.isSupported).toBe(true)
        expect(result.current.isRecording).toBe(false)
        expect(result.current.isPaused).toBe(false)
        expect(result.current.chunks).toEqual([])
        expect(result.current.blob).toBe(null)
        expect(result.current.error).toBe(null)
    })

    it('starts recording with the provided stream and options', () => {
        const stream = createMockStream()
        const onStart = jest.fn()

        const { result } = renderHook(() =>
            useMediaRecorder(stream, {
                mimeType: 'audio/webm',
                audioBitsPerSecond: 128000,
                onStart,
            })
        )

        act(() => {
            result.current.start(250)
        })

        expect(mockRecorderInstance?.stream).toBe(stream)
        expect(mockRecorderInstance?.options).toEqual({
            mimeType: 'audio/webm',
            audioBitsPerSecond: 128000,
        })
        expect(mockRecorderInstance?.start).toHaveBeenCalledWith(250)
        expect(result.current.status).toBe('recording')
        expect(result.current.isRecording).toBe(true)
        expect(result.current.mimeType).toBe('audio/webm')
        expect(onStart).toHaveBeenCalledTimes(1)
    })

    it('collects chunks and builds a blob when recording stops', () => {
        const stream = createMockStream()
        const onDataAvailable = jest.fn()
        const onStop = jest.fn()
        const { result } = renderHook(() =>
            useMediaRecorder(stream, { onDataAvailable, onStop })
        )

        act(() => {
            result.current.start()
        })

        const chunk = new Blob(['hello'], { type: 'audio/webm' })

        act(() => {
            mockRecorderInstance?.emitData(chunk)
        })

        expect(result.current.chunks).toEqual([chunk])
        expect(onDataAvailable).toHaveBeenCalledWith(chunk)

        act(() => {
            result.current.stop()
        })

        expect(mockRecorderInstance?.stop).toHaveBeenCalledTimes(1)
        expect(result.current.status).toBe('inactive')
        expect(result.current.blob?.size).toBe(chunk.size)
        expect(result.current.blob?.type).toBe('audio/webm')
        expect(onStop).toHaveBeenCalledWith(
            expect.objectContaining({ size: chunk.size, type: 'audio/webm' }),
            [chunk]
        )
    })

    it('pauses, resumes, and requests data from the active recorder', () => {
        const stream = createMockStream()
        const onPause = jest.fn()
        const onResume = jest.fn()
        const { result } = renderHook(() =>
            useMediaRecorder(stream, { onPause, onResume })
        )

        act(() => {
            result.current.start()
        })

        act(() => {
            result.current.pause()
        })

        expect(mockRecorderInstance?.pause).toHaveBeenCalledTimes(1)
        expect(result.current.status).toBe('paused')
        expect(result.current.isPaused).toBe(true)
        expect(onPause).toHaveBeenCalledTimes(1)

        act(() => {
            result.current.resume()
        })

        expect(mockRecorderInstance?.resume).toHaveBeenCalledTimes(1)
        expect(result.current.status).toBe('recording')
        expect(onResume).toHaveBeenCalledTimes(1)

        act(() => {
            result.current.requestData()
        })

        expect(mockRecorderInstance?.requestData).toHaveBeenCalledTimes(1)
    })

    it('reports an error when no stream is available', () => {
        const onError = jest.fn()
        const { result } = renderHook(() => useMediaRecorder(null, { onError }))

        act(() => {
            result.current.start()
        })

        expect(result.current.error?.message).toBe(
            'useMediaRecorder requires an active MediaStream'
        )
        expect(onError).toHaveBeenCalledWith(result.current.error)
    })

    it('reports unsupported browsers', () => {
        Object.defineProperty(window, 'MediaRecorder', {
            value: undefined,
            configurable: true,
            writable: true,
        })

        const { result } = renderHook(() =>
            useMediaRecorder(createMockStream())
        )

        act(() => {
            result.current.start()
        })

        expect(result.current.isSupported).toBe(false)
        expect(result.current.error?.message).toBe(
            'MediaRecorder is not supported by this browser'
        )
    })

    it('validates unsupported MIME types before creating a recorder', () => {
        const { result } = renderHook(() =>
            useMediaRecorder(createMockStream(), { mimeType: 'video/mp4' })
        )

        act(() => {
            result.current.start()
        })

        expect(MockMediaRecorder.isTypeSupported).toHaveBeenCalledWith(
            'video/mp4'
        )
        expect(mockRecorderInstance).toBe(null)
        expect(result.current.error?.message).toBe(
            'MediaRecorder does not support MIME type: video/mp4'
        )
    })

    it('stores recorder errors and clears them with reset', () => {
        const stream = createMockStream()
        const onError = jest.fn()
        const { result } = renderHook(() =>
            useMediaRecorder(stream, { onError })
        )

        act(() => {
            result.current.start()
        })

        const recorderError = new Error('Recorder crashed')

        act(() => {
            mockRecorderInstance?.emitError(recorderError)
        })

        expect(result.current.error).toBe(recorderError)
        expect(result.current.status).toBe('inactive')
        expect(onError).toHaveBeenCalledWith(recorderError)

        act(() => {
            result.current.reset()
        })

        expect(result.current.error).toBe(null)
        expect(result.current.blob).toBe(null)
        expect(result.current.chunks).toEqual([])
    })

    it('stops an active recorder on unmount', () => {
        const stream = createMockStream()
        const { result, unmount } = renderHook(() => useMediaRecorder(stream))

        act(() => {
            result.current.start()
        })

        unmount()

        expect(mockRecorderInstance?.stop).toHaveBeenCalledTimes(1)
    })
})
