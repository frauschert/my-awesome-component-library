import { act, renderHook } from '@testing-library/react'
import useSpeechSynthesis from '../useSpeechSynthesis'

type MockVoice = {
    name: string
    lang: string
    default: boolean
    localService: boolean
    voiceURI: string
}

type VoiceChangedListener = () => void

class MockSpeechSynthesisUtterance {
    text: string
    lang = ''
    pitch = 1
    rate = 1
    volume = 1
    voice: MockVoice | null = null
    onstart: (() => void) | null = null
    onend: (() => void) | null = null
    onpause: (() => void) | null = null
    onresume: (() => void) | null = null
    onerror: ((event: { error?: string }) => void) | null = null

    constructor(text: string) {
        this.text = text
    }
}

class MockSpeechSynthesis {
    speaking = false
    paused = false
    pending = false
    voices: MockVoice[] = []
    currentUtterance: MockSpeechSynthesisUtterance | null = null
    private listeners = new Set<VoiceChangedListener>()

    speak = jest.fn((utterance: MockSpeechSynthesisUtterance) => {
        this.currentUtterance = utterance
        this.speaking = true
        this.paused = false
        this.pending = false
        utterance.onstart?.()
    })

    cancel = jest.fn(() => {
        this.speaking = false
        this.paused = false
        this.pending = false
        this.currentUtterance = null
    })

    pause = jest.fn(() => {
        this.paused = true
        this.currentUtterance?.onpause?.()
    })

    resume = jest.fn(() => {
        this.paused = false
        this.currentUtterance?.onresume?.()
    })

    getVoices = jest.fn(() => this.voices)

    addEventListener = jest.fn(
        (_event: 'voiceschanged', listener: VoiceChangedListener) => {
            this.listeners.add(listener)
        }
    )

    removeEventListener = jest.fn(
        (_event: 'voiceschanged', listener: VoiceChangedListener) => {
            this.listeners.delete(listener)
        }
    )

    emitVoicesChanged() {
        this.listeners.forEach((listener) => listener())
    }

    emitEnd() {
        this.speaking = false
        this.paused = false
        this.pending = false
        const utterance = this.currentUtterance
        this.currentUtterance = null
        utterance?.onend?.()
    }

    emitError(error = 'interrupted') {
        this.speaking = false
        this.paused = false
        this.pending = false
        const utterance = this.currentUtterance
        this.currentUtterance = null
        utterance?.onerror?.({ error })
    }
}

const originalSpeechSynthesis = (
    window as Window & { speechSynthesis?: unknown }
).speechSynthesis
const originalUtteranceCtor = (
    window as Window & { SpeechSynthesisUtterance?: unknown }
).SpeechSynthesisUtterance

let mockSynthesis: MockSpeechSynthesis

beforeEach(() => {
    mockSynthesis = new MockSpeechSynthesis()

    Object.defineProperty(window, 'speechSynthesis', {
        value: mockSynthesis,
        configurable: true,
        writable: true,
    })

    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
        value: MockSpeechSynthesisUtterance,
        configurable: true,
        writable: true,
    })
})

afterEach(() => {
    Object.defineProperty(window, 'speechSynthesis', {
        value: originalSpeechSynthesis,
        configurable: true,
        writable: true,
    })

    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
        value: originalUtteranceCtor,
        configurable: true,
        writable: true,
    })

    jest.clearAllMocks()
})

describe('useSpeechSynthesis', () => {
    it('reports supported browsers and initial idle state', () => {
        const { result } = renderHook(() => useSpeechSynthesis())

        expect(result.current.isSupported).toBe(true)
        expect(result.current.isSpeaking).toBe(false)
        expect(result.current.isPaused).toBe(false)
        expect(result.current.pending).toBe(false)
        expect(result.current.error).toBe(null)
        expect(result.current.voices).toEqual([])
    })

    it('reports unsupported browsers when the API is missing', () => {
        Object.defineProperty(window, 'speechSynthesis', {
            value: undefined,
            configurable: true,
            writable: true,
        })

        const { result } = renderHook(() => useSpeechSynthesis())

        expect(result.current.isSupported).toBe(false)
    })

    it('loads and refreshes available voices', () => {
        const { result } = renderHook(() => useSpeechSynthesis())

        act(() => {
            mockSynthesis.voices = [
                {
                    name: 'Alice',
                    lang: 'en-US',
                    default: true,
                    localService: true,
                    voiceURI: 'alice',
                },
            ]
            mockSynthesis.emitVoicesChanged()
        })

        expect(result.current.voices).toEqual([
            {
                name: 'Alice',
                lang: 'en-US',
                default: true,
                localService: true,
                voiceURI: 'alice',
            },
        ])
    })

    it('speaks text using default utterance options', () => {
        mockSynthesis.voices = [
            {
                name: 'Alice',
                lang: 'en-US',
                default: true,
                localService: true,
                voiceURI: 'alice',
            },
        ]

        const { result } = renderHook(() =>
            useSpeechSynthesis({
                lang: 'en-US',
                voice: 'Alice',
                pitch: 1.5,
                rate: 1.2,
                volume: 0.75,
            })
        )

        act(() => {
            result.current.speak('Hello world')
        })

        const utterance = mockSynthesis.currentUtterance

        expect(mockSynthesis.cancel).toHaveBeenCalledTimes(1)
        expect(mockSynthesis.speak).toHaveBeenCalledTimes(1)
        expect(utterance?.text).toBe('Hello world')
        expect(utterance?.lang).toBe('en-US')
        expect(utterance?.pitch).toBe(1.5)
        expect(utterance?.rate).toBe(1.2)
        expect(utterance?.volume).toBe(0.75)
        expect(utterance?.voice?.name).toBe('Alice')
        expect(result.current.isSpeaking).toBe(true)
    })

    it('allows per-call option overrides', () => {
        mockSynthesis.voices = [
            {
                name: 'Alice',
                lang: 'en-US',
                default: true,
                localService: true,
                voiceURI: 'alice',
            },
            {
                name: 'Bob',
                lang: 'de-DE',
                default: false,
                localService: true,
                voiceURI: 'bob',
            },
        ]

        const { result } = renderHook(() =>
            useSpeechSynthesis({ voice: 'Alice', lang: 'en-US' })
        )

        act(() => {
            result.current.speak('Hallo', {
                voice: 'bob',
                lang: 'de-DE',
                pitch: 3,
                rate: 0,
                volume: 2,
            })
        })

        const utterance = mockSynthesis.currentUtterance

        expect(utterance?.voice?.name).toBe('Bob')
        expect(utterance?.lang).toBe('de-DE')
        expect(utterance?.pitch).toBe(2)
        expect(utterance?.rate).toBe(0.1)
        expect(utterance?.volume).toBe(1)
    })

    it('pauses, resumes, and cancels the current utterance', () => {
        const { result } = renderHook(() => useSpeechSynthesis())

        act(() => {
            result.current.speak('Testing controls')
        })

        act(() => {
            result.current.pause()
        })

        expect(mockSynthesis.pause).toHaveBeenCalledTimes(1)
        expect(result.current.isPaused).toBe(true)

        act(() => {
            result.current.resume()
        })

        expect(mockSynthesis.resume).toHaveBeenCalledTimes(1)
        expect(result.current.isPaused).toBe(false)

        act(() => {
            result.current.cancel()
        })

        expect(mockSynthesis.cancel).toHaveBeenCalledTimes(2)
        expect(result.current.isSpeaking).toBe(false)
    })

    it('fires lifecycle callbacks for start, end, pause, and resume', () => {
        const onStart = jest.fn()
        const onEnd = jest.fn()
        const onPause = jest.fn()
        const onResume = jest.fn()
        const { result } = renderHook(() =>
            useSpeechSynthesis({ onStart, onEnd, onPause, onResume })
        )

        act(() => {
            result.current.speak('Testing callbacks')
        })
        act(() => {
            result.current.pause()
        })
        act(() => {
            result.current.resume()
        })
        act(() => {
            mockSynthesis.emitEnd()
        })

        expect(onStart).toHaveBeenCalledTimes(1)
        expect(onPause).toHaveBeenCalledTimes(1)
        expect(onResume).toHaveBeenCalledTimes(1)
        expect(onEnd).toHaveBeenCalledTimes(1)
    })

    it('stores synthesis errors and notifies onError', () => {
        const onError = jest.fn()
        const { result } = renderHook(() => useSpeechSynthesis({ onError }))

        act(() => {
            result.current.speak('Testing errors')
        })
        act(() => {
            mockSynthesis.emitError('canceled')
        })

        expect(result.current.error?.message).toBe(
            'Speech synthesis failed: canceled'
        )
        expect(onError).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Speech synthesis failed: canceled',
            })
        )
    })

    it('reports unsupported calls through error state', () => {
        Object.defineProperty(window, 'speechSynthesis', {
            value: undefined,
            configurable: true,
            writable: true,
        })

        const onError = jest.fn()
        const { result } = renderHook(() => useSpeechSynthesis({ onError }))

        act(() => {
            result.current.speak('Hello')
        })

        expect(result.current.error?.message).toBe(
            'Speech synthesis is not supported by this browser'
        )
        expect(onError).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Speech synthesis is not supported by this browser',
            })
        )
    })

    it('cancels active speech on unmount', () => {
        const { result, unmount } = renderHook(() => useSpeechSynthesis())

        act(() => {
            result.current.speak('Unmount test')
        })
        unmount()

        expect(mockSynthesis.cancel).toHaveBeenCalledTimes(2)
    })
})
