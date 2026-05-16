import { renderHook, act } from '@testing-library/react'
import useSpeechRecognition from '../useSpeechRecognition'

// ─── Mock ─────────────────────────────────────────────────────────────────────

type ResultHandler = (event: {
    resultIndex: number
    results: {
        length: number
        [index: number]: {
            isFinal: boolean
            length: number
            [index: number]: { transcript: string; confidence: number }
        }
    }
}) => void

type ErrorHandler = (event: { error: string; message: string }) => void

class MockSpeechRecognition {
    lang = ''
    continuous = false
    interimResults = false
    maxAlternatives = 1

    onstart: (() => void) | null = null
    onresult: ResultHandler | null = null
    onerror: ErrorHandler | null = null
    onend: (() => void) | null = null

    start = jest.fn(() => {
        this.onstart?.()
    })
    stop = jest.fn(() => {
        this.onend?.()
    })
    abort = jest.fn(() => {
        this.onend?.()
    })

    /** Helper: fire a recognition result. */
    emitResult(transcript: string, isFinal: boolean) {
        this.onresult?.({
            resultIndex: 0,
            results: {
                length: 1,
                0: {
                    isFinal,
                    length: 1,
                    0: { transcript, confidence: 0.9 },
                },
            },
        })
    }

    /** Helper: fire an error event. */
    emitError(error: string) {
        this.onerror?.({ error, message: error })
    }

    /** Helper: fire the end event without going through stop/abort. */
    emitEnd() {
        this.onend?.()
    }
}

let mockInstance: MockSpeechRecognition

beforeEach(() => {
    Object.defineProperty(globalThis, 'SpeechRecognition', {
        value: jest.fn(() => {
            mockInstance = new MockSpeechRecognition()
            return mockInstance
        }),
        configurable: true,
        writable: true,
    })
})

afterEach(() => {
    Object.defineProperty(globalThis, 'SpeechRecognition', {
        value: undefined,
        configurable: true,
        writable: true,
    })
})

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('useSpeechRecognition', () => {
    it('reports isSupported=true when SpeechRecognition is available', () => {
        const { result } = renderHook(() => useSpeechRecognition())
        expect(result.current.isSupported).toBe(true)
    })

    it('reports isSupported=false when SpeechRecognition is unavailable', () => {
        Object.defineProperty(globalThis, 'SpeechRecognition', {
            value: undefined,
            configurable: true,
            writable: true,
        })
        const { result } = renderHook(() => useSpeechRecognition())
        expect(result.current.isSupported).toBe(false)
    })

    it('initialises with empty transcript and not listening', () => {
        const { result } = renderHook(() => useSpeechRecognition())
        expect(result.current.isListening).toBe(false)
        expect(result.current.transcript).toBe('')
        expect(result.current.interimTranscript).toBe('')
        expect(result.current.finalTranscript).toBe('')
        expect(result.current.error).toBe(null)
    })

    it('start() calls recognition.start and sets isListening', () => {
        const { result } = renderHook(() => useSpeechRecognition())

        act(() => {
            result.current.start()
        })

        expect(mockInstance.start).toHaveBeenCalledTimes(1)
        expect(result.current.isListening).toBe(true)
    })

    it('stop() calls recognition.stop and clears isListening', () => {
        const { result } = renderHook(() => useSpeechRecognition())

        act(() => {
            result.current.start()
        })
        act(() => {
            result.current.stop()
        })

        expect(mockInstance.stop).toHaveBeenCalledTimes(1)
        expect(result.current.isListening).toBe(false)
    })

    it('abort() calls recognition.abort and clears isListening', () => {
        const { result } = renderHook(() => useSpeechRecognition())

        act(() => {
            result.current.start()
        })
        act(() => {
            result.current.abort()
        })

        expect(mockInstance.abort).toHaveBeenCalledTimes(1)
        expect(result.current.isListening).toBe(false)
    })

    it('updates transcript on an interim result', () => {
        const { result } = renderHook(() =>
            useSpeechRecognition({ interimResults: true })
        )

        act(() => {
            result.current.start()
        })
        act(() => {
            mockInstance.emitResult('hello', false)
        })

        expect(result.current.interimTranscript).toBe('hello')
        expect(result.current.transcript).toBe('hello')
        expect(result.current.finalTranscript).toBe('')
    })

    it('accumulates finalTranscript on final results', () => {
        const { result } = renderHook(() => useSpeechRecognition())

        act(() => {
            result.current.start()
        })
        act(() => {
            mockInstance.emitResult('hello ', true)
        })
        act(() => {
            mockInstance.emitResult('world', true)
        })

        expect(result.current.finalTranscript).toBe('hello world')
        expect(result.current.transcript).toBe('world')
        expect(result.current.interimTranscript).toBe('')
    })

    it('calls onResult callback with correct arguments', () => {
        const onResult = jest.fn()
        const { result } = renderHook(() => useSpeechRecognition({ onResult }))

        act(() => {
            result.current.start()
        })
        act(() => {
            mockInstance.emitResult('testing', true)
        })

        expect(onResult).toHaveBeenCalledWith('testing', true)
    })

    it('sets error state and calls onError on recognition error', () => {
        const onError = jest.fn()
        const { result } = renderHook(() => useSpeechRecognition({ onError }))

        act(() => {
            result.current.start()
        })
        act(() => {
            mockInstance.emitError('not-allowed')
        })

        expect(result.current.error).toBe('not-allowed')
        expect(result.current.isListening).toBe(false)
        expect(onError).toHaveBeenCalledWith('not-allowed')
    })

    it('clears error on subsequent start() call', () => {
        const { result } = renderHook(() => useSpeechRecognition())

        act(() => {
            result.current.start()
        })
        act(() => {
            mockInstance.emitError('network')
        })
        expect(result.current.error).toBe('network')

        act(() => {
            result.current.start()
        })
        expect(result.current.error).toBe(null)
    })

    it('resetTranscript clears all transcript state', () => {
        const { result } = renderHook(() => useSpeechRecognition())

        act(() => {
            result.current.start()
        })
        act(() => {
            mockInstance.emitResult('some text', true)
        })
        act(() => {
            result.current.resetTranscript()
        })

        expect(result.current.transcript).toBe('')
        expect(result.current.interimTranscript).toBe('')
        expect(result.current.finalTranscript).toBe('')
    })

    it('applies lang, continuous, interimResults and maxAlternatives options', () => {
        const { result } = renderHook(() =>
            useSpeechRecognition({
                lang: 'de-DE',
                continuous: true,
                interimResults: true,
                maxAlternatives: 3,
            })
        )

        act(() => {
            result.current.start()
        })

        expect(mockInstance.lang).toBe('de-DE')
        expect(mockInstance.continuous).toBe(true)
        expect(mockInstance.interimResults).toBe(true)
        expect(mockInstance.maxAlternatives).toBe(3)
    })

    it('calls onStart and onEnd callbacks', () => {
        const onStart = jest.fn()
        const onEnd = jest.fn()
        const { result } = renderHook(() =>
            useSpeechRecognition({ onStart, onEnd })
        )

        act(() => {
            result.current.start()
        })
        expect(onStart).toHaveBeenCalledTimes(1)

        act(() => {
            result.current.stop()
        })
        expect(onEnd).toHaveBeenCalledTimes(1)
    })

    it('aborts recognition on unmount', () => {
        const { result, unmount } = renderHook(() => useSpeechRecognition())

        act(() => {
            result.current.start()
        })
        unmount()

        expect(mockInstance.abort).toHaveBeenCalled()
    })
})
