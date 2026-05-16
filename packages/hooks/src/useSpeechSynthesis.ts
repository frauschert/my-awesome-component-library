import { useCallback, useEffect, useRef, useState } from 'react'

export interface SpeechSynthesisVoiceData {
    name: string
    lang: string
    default: boolean
    localService: boolean
    voiceURI: string
}

export interface SpeakOptions {
    /**
     * BCP 47 language tag for the utterance.
     */
    lang?: string
    /**
     * Voice name or `voiceURI` to use when speaking.
     */
    voice?: string
    /**
     * Speaking pitch between 0 and 2.
     * @default 1
     */
    pitch?: number
    /**
     * Speaking rate between 0.1 and 10.
     * @default 1
     */
    rate?: number
    /**
     * Output volume between 0 and 1.
     * @default 1
     */
    volume?: number
}

export interface UseSpeechSynthesisOptions extends SpeakOptions {
    /**
     * Called when speech starts.
     */
    onStart?: () => void
    /**
     * Called when speech ends normally.
     */
    onEnd?: () => void
    /**
     * Called when speech is paused.
     */
    onPause?: () => void
    /**
     * Called when speech resumes.
     */
    onResume?: () => void
    /**
     * Called when speech synthesis fails.
     */
    onError?: (error: Error) => void
}

export interface UseSpeechSynthesisReturn {
    /** Available speech synthesis voices. */
    voices: SpeechSynthesisVoiceData[]
    /** Whether the Speech Synthesis API is available. */
    isSupported: boolean
    /** Whether speech is actively being spoken. */
    isSpeaking: boolean
    /** Whether speech is currently paused. */
    isPaused: boolean
    /** Whether there are queued utterances waiting to be spoken. */
    pending: boolean
    /** The last synthesis error, if any. */
    error: Error | null
    /** Speak the provided text, optionally overriding default utterance settings. */
    speak: (text: string, options?: SpeakOptions) => void
    /** Pause the current utterance. */
    pause: () => void
    /** Resume a paused utterance. */
    resume: () => void
    /** Cancel all active and queued utterances. */
    cancel: () => void
}

interface SpeechSynthesisVoiceInternal {
    name: string
    lang: string
    default: boolean
    localService: boolean
    voiceURI: string
}

interface SpeechSynthesisErrorData {
    error?: string
}

interface SpeechSynthesisUtteranceData {
    text: string
    lang: string
    pitch: number
    rate: number
    volume: number
    voice: SpeechSynthesisVoiceInternal | null
    onstart: (() => void) | null
    onend: (() => void) | null
    onpause: (() => void) | null
    onresume: (() => void) | null
    onerror: ((event: SpeechSynthesisErrorData) => void) | null
}

interface SpeechSynthesisEngine {
    speaking: boolean
    paused: boolean
    pending: boolean
    speak(utterance: SpeechSynthesisUtteranceData): void
    cancel(): void
    pause(): void
    resume(): void
    getVoices(): SpeechSynthesisVoiceInternal[]
    addEventListener?: (event: 'voiceschanged', listener: () => void) => void
    removeEventListener?: (event: 'voiceschanged', listener: () => void) => void
    onvoiceschanged?: (() => void) | null
}

type SpeechSynthesisUtteranceCtor = new (
    text: string
) => SpeechSynthesisUtteranceData

function getSpeechSynthesisEngine(): SpeechSynthesisEngine | null {
    if (typeof window === 'undefined') return null

    const w = window as Window & {
        speechSynthesis?: SpeechSynthesisEngine
    }

    return w.speechSynthesis ?? null
}

function getSpeechSynthesisUtteranceCtor(): SpeechSynthesisUtteranceCtor | null {
    if (typeof window === 'undefined') return null

    const w = window as Window & {
        SpeechSynthesisUtterance?: SpeechSynthesisUtteranceCtor
    }

    return w.SpeechSynthesisUtterance ?? null
}

function clampVolume(value: number) {
    return Math.min(1, Math.max(0, value))
}

function clampPitch(value: number) {
    return Math.min(2, Math.max(0, value))
}

function clampRate(value: number) {
    return Math.min(10, Math.max(0.1, value))
}

function mapVoices(
    voices: SpeechSynthesisVoiceInternal[]
): SpeechSynthesisVoiceData[] {
    return voices.map((voice) => ({
        name: voice.name,
        lang: voice.lang,
        default: voice.default,
        localService: voice.localService,
        voiceURI: voice.voiceURI,
    }))
}

function resolveVoice(
    requestedVoice: string | undefined,
    voices: SpeechSynthesisVoiceInternal[]
) {
    if (!requestedVoice) return null

    return (
        voices.find(
            (voice) =>
                voice.name === requestedVoice ||
                voice.voiceURI === requestedVoice
        ) ?? null
    )
}

/**
 * Hook wrapping the Web Speech Synthesis API for text-to-speech playback.
 *
 * @param options - Default utterance settings and lifecycle callbacks
 * @returns Speech synthesis controls and state
 *
 * @example
 * ```tsx
 * function SpeakButton() {
 *   const { speak, cancel, isSpeaking, voices } = useSpeechSynthesis({
 *     lang: 'en-US',
 *     voice: voices[0]?.name,
 *   })
 *
 *   return (
 *     <div>
 *       <button onClick={() => speak('Hello from the browser')}>
 *         {isSpeaking ? 'Speaking…' : 'Speak'}
 *       </button>
 *       <button onClick={cancel}>Cancel</button>
 *     </div>
 *   )
 * }
 * ```
 */
export default function useSpeechSynthesis(
    options: UseSpeechSynthesisOptions = {}
): UseSpeechSynthesisReturn {
    const {
        lang,
        voice,
        pitch = 1,
        rate = 1,
        volume = 1,
        onStart,
        onEnd,
        onPause,
        onResume,
        onError,
    } = options

    const speechSynthesis = getSpeechSynthesisEngine()
    const SpeechSynthesisUtteranceCtor = getSpeechSynthesisUtteranceCtor()
    const isSupported =
        speechSynthesis !== null && SpeechSynthesisUtteranceCtor !== null

    const [voices, setVoices] = useState<SpeechSynthesisVoiceData[]>([])
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [pending, setPending] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const utteranceRef = useRef<SpeechSynthesisUtteranceData | null>(null)
    const onStartRef = useRef(onStart)
    const onEndRef = useRef(onEnd)
    const onPauseRef = useRef(onPause)
    const onResumeRef = useRef(onResume)
    const onErrorRef = useRef(onError)

    useEffect(() => {
        onStartRef.current = onStart
    }, [onStart])

    useEffect(() => {
        onEndRef.current = onEnd
    }, [onEnd])

    useEffect(() => {
        onPauseRef.current = onPause
    }, [onPause])

    useEffect(() => {
        onResumeRef.current = onResume
    }, [onResume])

    useEffect(() => {
        onErrorRef.current = onError
    }, [onError])

    const syncStatus = useCallback(() => {
        const engine = getSpeechSynthesisEngine()

        setIsSpeaking(engine?.speaking ?? false)
        setIsPaused(engine?.paused ?? false)
        setPending(engine?.pending ?? false)
    }, [])

    useEffect(() => {
        if (!isSupported || !speechSynthesis) return

        const updateVoices = () => {
            setVoices(mapVoices(speechSynthesis.getVoices()))
            syncStatus()
        }

        updateVoices()

        if (speechSynthesis.addEventListener) {
            speechSynthesis.addEventListener('voiceschanged', updateVoices)

            return () => {
                speechSynthesis.removeEventListener?.(
                    'voiceschanged',
                    updateVoices
                )
            }
        }

        const previousHandler = speechSynthesis.onvoiceschanged
        speechSynthesis.onvoiceschanged = updateVoices

        return () => {
            speechSynthesis.onvoiceschanged = previousHandler ?? null
        }
    }, [isSupported, speechSynthesis, syncStatus])

    const cancel = useCallback(() => {
        const engine = getSpeechSynthesisEngine()
        if (!engine) return

        utteranceRef.current = null
        engine.cancel()
        syncStatus()
    }, [syncStatus])

    const pause = useCallback(() => {
        const engine = getSpeechSynthesisEngine()
        if (!engine) return

        engine.pause()
        syncStatus()
    }, [syncStatus])

    const resume = useCallback(() => {
        const engine = getSpeechSynthesisEngine()
        if (!engine) return

        engine.resume()
        syncStatus()
    }, [syncStatus])

    const speak = useCallback(
        (text: string, overrideOptions: SpeakOptions = {}) => {
            const engine = getSpeechSynthesisEngine()
            const UtteranceCtor = getSpeechSynthesisUtteranceCtor()

            if (!engine || !UtteranceCtor) {
                const unsupportedError = new Error(
                    'Speech synthesis is not supported by this browser'
                )

                setError(unsupportedError)
                onErrorRef.current?.(unsupportedError)
                return
            }

            if (!text.trim()) return

            const utterance = new UtteranceCtor(text)
            const availableVoices = engine.getVoices()
            const selectedVoice = resolveVoice(
                overrideOptions.voice ?? voice,
                availableVoices
            )

            setError(null)
            engine.cancel()

            utterance.lang = overrideOptions.lang ?? lang ?? ''
            utterance.pitch = clampPitch(overrideOptions.pitch ?? pitch)
            utterance.rate = clampRate(overrideOptions.rate ?? rate)
            utterance.volume = clampVolume(overrideOptions.volume ?? volume)
            utterance.voice = selectedVoice

            utterance.onstart = () => {
                syncStatus()
                onStartRef.current?.()
            }

            utterance.onend = () => {
                utteranceRef.current = null
                syncStatus()
                onEndRef.current?.()
            }

            utterance.onpause = () => {
                syncStatus()
                onPauseRef.current?.()
            }

            utterance.onresume = () => {
                syncStatus()
                onResumeRef.current?.()
            }

            utterance.onerror = (event: SpeechSynthesisErrorData) => {
                const synthesisError = new Error(
                    event.error
                        ? `Speech synthesis failed: ${event.error}`
                        : 'Speech synthesis failed'
                )

                utteranceRef.current = null
                setError(synthesisError)
                syncStatus()
                onErrorRef.current?.(synthesisError)
            }

            utteranceRef.current = utterance
            engine.speak(utterance)
            syncStatus()
        },
        [lang, pitch, rate, syncStatus, voice, volume]
    )

    useEffect(() => {
        return () => {
            if (!utteranceRef.current) return
            getSpeechSynthesisEngine()?.cancel()
            utteranceRef.current = null
        }
    }, [])

    return {
        voices,
        isSupported,
        isSpeaking,
        isPaused,
        pending,
        error,
        speak,
        pause,
        resume,
        cancel,
    }
}
