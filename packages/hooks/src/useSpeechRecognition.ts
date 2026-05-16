import { useState, useCallback, useRef, useEffect } from 'react'

/** Error codes from the Web Speech API SpeechRecognitionError event. */
export type SpeechRecognitionError =
    | 'aborted'
    | 'audio-capture'
    | 'bad-grammar'
    | 'language-not-supported'
    | 'network'
    | 'no-speech'
    | 'not-allowed'
    | 'service-not-allowed'

export interface UseSpeechRecognitionOptions {
    /**
     * BCP 47 language tag for recognition (e.g. `'en-US'`).
     * Defaults to the browser's UI language.
     */
    lang?: string
    /**
     * Keep recognizing across multiple utterances until `stop()` is called.
     * @default false
     */
    continuous?: boolean
    /**
     * Return interim (non-final) results in addition to final results.
     * @default false
     */
    interimResults?: boolean
    /**
     * Maximum number of alternative transcripts per result.
     * @default 1
     */
    maxAlternatives?: number
    /** Called each time a result (interim or final) arrives. */
    onResult?: (transcript: string, isFinal: boolean) => void
    /** Called when a recognition error occurs. */
    onError?: (error: SpeechRecognitionError) => void
    /** Called when recognition starts. */
    onStart?: () => void
    /** Called when recognition ends (after `stop()`, `abort()`, or naturally). */
    onEnd?: () => void
}

export interface UseSpeechRecognitionReturn {
    /** The most recently received transcript segment (interim or final). */
    transcript: string
    /** The current non-final portion of the in-progress utterance. */
    interimTranscript: string
    /** Accumulated final transcript text across all results in this session. */
    finalTranscript: string
    /** Whether recognition is currently active. */
    isListening: boolean
    /** Whether the Web Speech API is available in this browser. */
    isSupported: boolean
    /** The last recognition error, if any. Cleared on each `start()`. */
    error: SpeechRecognitionError | null
    /** Start listening. Clears previous error state. */
    start: () => void
    /** Stop listening gracefully — waits for a final result before ending. */
    stop: () => void
    /** Immediately abort recognition without waiting for a final result. */
    abort: () => void
    /** Clear `transcript`, `interimTranscript`, and `finalTranscript`. */
    resetTranscript: () => void
}

// Minimal internal typings — SpeechRecognition is not in all TS DOM lib versions
interface SpeechRecognitionAlternativeData {
    readonly transcript: string
    readonly confidence: number
}
interface SpeechRecognitionResultData {
    readonly isFinal: boolean
    readonly length: number
    item(index: number): SpeechRecognitionAlternativeData
    readonly [index: number]: SpeechRecognitionAlternativeData
}
interface SpeechRecognitionResultListData {
    readonly length: number
    item(index: number): SpeechRecognitionResultData
    readonly [index: number]: SpeechRecognitionResultData
}
interface SpeechRecognitionResultEvent {
    readonly resultIndex: number
    readonly results: SpeechRecognitionResultListData
}
interface SpeechRecognitionErrorData {
    readonly error: string
    readonly message: string
}
interface SpeechRecognitionInstance {
    lang: string
    continuous: boolean
    interimResults: boolean
    maxAlternatives: number
    onstart: (() => void) | null
    onresult: ((event: SpeechRecognitionResultEvent) => void) | null
    onerror: ((event: SpeechRecognitionErrorData) => void) | null
    onend: (() => void) | null
    start(): void
    stop(): void
    abort(): void
}

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
    if (typeof window === 'undefined') return null
    const w = window as Window & {
        SpeechRecognition?: SpeechRecognitionCtor
        webkitSpeechRecognition?: SpeechRecognitionCtor
    }
    return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

/**
 * Hook wrapping the Web Speech Recognition API for real-time speech-to-text.
 *
 * @param options - Recognition configuration
 * @returns Recognition state and controls
 *
 * @example
 * ```tsx
 * function VoiceInput() {
 *   const { transcript, isListening, start, stop, isSupported } =
 *     useSpeechRecognition({ lang: 'en-US', interimResults: true })
 *
 *   if (!isSupported) return <p>Speech recognition not supported.</p>
 *
 *   return (
 *     <div>
 *       <button onClick={isListening ? stop : start}>
 *         {isListening ? 'Stop' : 'Start'}
 *       </button>
 *       <p>{transcript}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export default function useSpeechRecognition(
    options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
    const {
        lang,
        continuous = false,
        interimResults = false,
        maxAlternatives = 1,
        onResult,
        onError,
        onStart,
        onEnd,
    } = options

    const SpeechRecognitionCtor = getSpeechRecognitionCtor()
    const isSupported = SpeechRecognitionCtor !== null

    const [transcript, setTranscript] = useState('')
    const [interimTranscript, setInterimTranscript] = useState('')
    const [finalTranscript, setFinalTranscript] = useState('')
    const [isListening, setIsListening] = useState(false)
    const [error, setError] = useState<SpeechRecognitionError | null>(null)

    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

    // Keep callback refs stable so event handlers always call the latest versions
    const onResultRef = useRef(onResult)
    const onErrorRef = useRef(onError)
    const onStartRef = useRef(onStart)
    const onEndRef = useRef(onEnd)
    useEffect(() => {
        onResultRef.current = onResult
    }, [onResult])
    useEffect(() => {
        onErrorRef.current = onError
    }, [onError])
    useEffect(() => {
        onStartRef.current = onStart
    }, [onStart])
    useEffect(() => {
        onEndRef.current = onEnd
    }, [onEnd])

    const abort = useCallback(() => {
        recognitionRef.current?.abort()
    }, [])

    const stop = useCallback(() => {
        recognitionRef.current?.stop()
    }, [])

    const start = useCallback(() => {
        if (!SpeechRecognitionCtor) return

        // Abort any in-progress recognition before starting fresh
        recognitionRef.current?.abort()

        setError(null)
        setInterimTranscript('')

        const recognition = new SpeechRecognitionCtor()
        if (lang !== undefined) recognition.lang = lang
        recognition.continuous = continuous
        recognition.interimResults = interimResults
        recognition.maxAlternatives = maxAlternatives

        recognition.onstart = () => {
            setIsListening(true)
            onStartRef.current?.()
        }

        recognition.onresult = (event: SpeechRecognitionResultEvent) => {
            let interim = ''
            let latestTranscript = ''

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i]
                const text = result[0].transcript

                if (result.isFinal) {
                    setFinalTranscript((prev) => prev + text)
                    latestTranscript = text
                    onResultRef.current?.(text, true)
                } else {
                    interim += text
                    latestTranscript = text
                    onResultRef.current?.(text, false)
                }
            }

            setInterimTranscript(interim)
            setTranscript(latestTranscript)
        }

        recognition.onerror = (event: SpeechRecognitionErrorData) => {
            const code = event.error as SpeechRecognitionError
            setError(code)
            setIsListening(false)
            onErrorRef.current?.(code)
        }

        recognition.onend = () => {
            setIsListening(false)
            setInterimTranscript('')
            onEndRef.current?.()
        }

        recognitionRef.current = recognition
        recognition.start()
    }, [
        SpeechRecognitionCtor,
        lang,
        continuous,
        interimResults,
        maxAlternatives,
    ])

    const resetTranscript = useCallback(() => {
        setTranscript('')
        setInterimTranscript('')
        setFinalTranscript('')
    }, [])

    // Abort on unmount
    useEffect(() => {
        return () => {
            recognitionRef.current?.abort()
        }
    }, [])

    return {
        transcript,
        interimTranscript,
        finalTranscript,
        isListening,
        isSupported,
        error,
        start,
        stop,
        abort,
        resetTranscript,
    }
}
