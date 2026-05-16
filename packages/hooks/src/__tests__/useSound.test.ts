import { renderHook, act } from '@testing-library/react'
import useSound from '../useSound'

// Minimal HTMLAudioElement mock
class MockAudio {
    src: string
    volume: number
    playbackRate: number
    loop: boolean
    currentTime: number
    duration: number
    private listeners: Record<string, Array<() => void>> = {}

    constructor(src: string) {
        this.src = src
        this.volume = 1
        this.playbackRate = 1
        this.loop = false
        this.currentTime = 0
        this.duration = 30
    }

    play = jest.fn(() => {
        this.emit('canplaythrough')
        return Promise.resolve()
    })

    pause = jest.fn()

    addEventListener(event: string, cb: () => void) {
        if (!this.listeners[event]) this.listeners[event] = []
        this.listeners[event].push(cb)
    }

    removeEventListener(event: string, cb: () => void) {
        this.listeners[event] = (this.listeners[event] ?? []).filter(
            (l) => l !== cb
        )
    }

    emit(event: string) {
        ;(this.listeners[event] ?? []).forEach((cb) => cb())
    }
}

let mockAudioInstance: MockAudio

beforeEach(() => {
    Object.defineProperty(globalThis, 'Audio', {
        value: jest.fn((src: string) => {
            mockAudioInstance = new MockAudio(src)
            return mockAudioInstance
        }),
        configurable: true,
        writable: true,
    })
})

afterEach(() => {
    Object.defineProperty(globalThis, 'Audio', {
        value: undefined,
        configurable: true,
        writable: true,
    })
})

describe('useSound', () => {
    it('initialises with default state', () => {
        const { result } = renderHook(() => useSound('/test.mp3'))

        expect(result.current.isPlaying).toBe(false)
        expect(result.current.isReady).toBe(false)
        expect(result.current.volume).toBe(1)
        expect(result.current.playbackRate).toBe(1)
        expect(result.current.error).toBe(null)
    })

    it('becomes ready after canplaythrough fires', () => {
        const { result } = renderHook(() => useSound('/test.mp3'))

        act(() => {
            mockAudioInstance.emit('canplaythrough')
        })

        expect(result.current.isReady).toBe(true)
        expect(result.current.duration).toBe(30)
    })

    it('play() starts playback and sets isPlaying', async () => {
        const onPlay = jest.fn()
        const { result } = renderHook(() => useSound('/test.mp3', { onPlay }))

        await act(async () => {
            result.current.play()
        })

        expect(mockAudioInstance.play).toHaveBeenCalled()
        expect(result.current.isPlaying).toBe(true)
        expect(onPlay).toHaveBeenCalled()
    })

    it('pause() stops playback without resetting position', async () => {
        const { result } = renderHook(() => useSound('/test.mp3'))

        await act(async () => {
            result.current.play()
        })
        act(() => {
            result.current.pause()
        })

        expect(mockAudioInstance.pause).toHaveBeenCalled()
        expect(result.current.isPlaying).toBe(false)
    })

    it('stop() pauses and resets currentTime', async () => {
        const { result } = renderHook(() => useSound('/test.mp3'))

        await act(async () => {
            result.current.play()
        })
        act(() => {
            result.current.stop()
        })

        expect(mockAudioInstance.pause).toHaveBeenCalled()
        expect(mockAudioInstance.currentTime).toBe(0)
        expect(result.current.isPlaying).toBe(false)
    })

    it('ended event calls onEnd and clears isPlaying', async () => {
        const onEnd = jest.fn()
        const { result } = renderHook(() => useSound('/test.mp3', { onEnd }))

        await act(async () => {
            result.current.play()
        })
        act(() => {
            mockAudioInstance.emit('ended')
        })

        expect(result.current.isPlaying).toBe(false)
        expect(onEnd).toHaveBeenCalled()
    })

    it('setVolume clamps between 0 and 1', () => {
        const { result } = renderHook(() => useSound('/test.mp3'))

        act(() => {
            result.current.setVolume(1.5)
        })
        expect(result.current.volume).toBe(1)
        expect(mockAudioInstance.volume).toBe(1)

        act(() => {
            result.current.setVolume(-0.5)
        })
        expect(result.current.volume).toBe(0)
    })

    it('setPlaybackRate updates audio element', () => {
        const { result } = renderHook(() => useSound('/test.mp3'))

        act(() => {
            result.current.setPlaybackRate(2)
        })

        expect(result.current.playbackRate).toBe(2)
        expect(mockAudioInstance.playbackRate).toBe(2)
    })

    it('respects initial volume and playbackRate options', () => {
        renderHook(() =>
            useSound('/test.mp3', { volume: 0.3, playbackRate: 0.75 })
        )

        expect(mockAudioInstance.volume).toBe(0.3)
        expect(mockAudioInstance.playbackRate).toBe(0.75)
    })

    it('cleans up audio element on unmount', async () => {
        const { unmount } = renderHook(() => useSound('/test.mp3'))
        unmount()
        expect(mockAudioInstance.pause).toHaveBeenCalled()
    })
})
