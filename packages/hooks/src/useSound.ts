import { useState, useCallback, useRef, useEffect } from 'react'

export interface UseSoundOptions {
    /**
     * Playback volume between 0 and 1.
     * @default 1
     */
    volume?: number
    /**
     * Playback rate multiplier (0.5 = half speed, 2 = double speed).
     * @default 1
     */
    playbackRate?: number
    /**
     * Whether to loop the sound indefinitely.
     * @default false
     */
    loop?: boolean
    /**
     * Whether to start playback as soon as the hook mounts.
     * @default false
     */
    autoplay?: boolean
    /**
     * Called when playback starts.
     */
    onPlay?: () => void
    /**
     * Called when playback ends naturally (not when stopped manually).
     */
    onEnd?: () => void
    /**
     * Called when an error occurs loading or playing the sound.
     */
    onError?: (error: Error) => void
}

export interface UseSoundReturn {
    /** Start or resume playback. */
    play: () => void
    /** Pause playback without resetting position. */
    pause: () => void
    /** Stop playback and reset position to the beginning. */
    stop: () => void
    /** Whether audio is currently playing. */
    isPlaying: boolean
    /** Current playback volume (0–1). */
    volume: number
    /** Set playback volume (0–1). */
    setVolume: (volume: number) => void
    /** Current playback rate. */
    playbackRate: number
    /** Set playback rate. */
    setPlaybackRate: (rate: number) => void
    /** Duration of the audio in seconds, or null if not yet loaded. */
    duration: number | null
    /** Whether the audio has finished loading and is ready to play. */
    isReady: boolean
    /** Error loading or playing the sound, if any. */
    error: Error | null
}

/**
 * Hook for playing audio with full playback controls.
 * Uses the Web Audio API via an HTMLAudioElement internally.
 *
 * @param src - URL or path to the audio file
 * @param options - Playback configuration
 * @returns Playback controls and state
 *
 * @example
 * ```tsx
 * function NotificationButton() {
 *   const { play, isPlaying } = useSound('/sounds/notify.mp3', { volume: 0.5 })
 *
 *   return <button onClick={play}>{isPlaying ? 'Playing…' : 'Play'}</button>
 * }
 * ```
 */
export default function useSound(
    src: string,
    options: UseSoundOptions = {}
): UseSoundReturn {
    const {
        volume: initialVolume = 1,
        playbackRate: initialPlaybackRate = 1,
        loop = false,
        autoplay = false,
        onPlay,
        onEnd,
        onError,
    } = options

    const audioRef = useRef<HTMLAudioElement | null>(null)
    const onPlayRef = useRef(onPlay)
    const onEndRef = useRef(onEnd)
    const onErrorRef = useRef(onError)

    useEffect(() => {
        onPlayRef.current = onPlay
    }, [onPlay])
    useEffect(() => {
        onEndRef.current = onEnd
    }, [onEnd])
    useEffect(() => {
        onErrorRef.current = onError
    }, [onError])

    const [isPlaying, setIsPlaying] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const [duration, setDuration] = useState<number | null>(null)
    const [volume, setVolumeState] = useState(initialVolume)
    const [playbackRate, setPlaybackRateState] = useState(initialPlaybackRate)
    const [error, setError] = useState<Error | null>(null)

    // Create/recreate audio element when src changes
    useEffect(() => {
        const audio = new Audio(src)
        audio.volume = initialVolume
        audio.playbackRate = initialPlaybackRate
        audio.loop = loop
        audioRef.current = audio

        setIsReady(false)
        setDuration(null)
        setError(null)
        setIsPlaying(false)

        const handleCanPlayThrough = () => {
            setIsReady(true)
            setDuration(audio.duration)
        }
        const handleEnded = () => {
            setIsPlaying(false)
            onEndRef.current?.()
        }
        const handleError = () => {
            const err = new Error(`Failed to load audio: ${src}`)
            setError(err)
            setIsPlaying(false)
            onErrorRef.current?.(err)
        }

        audio.addEventListener('canplaythrough', handleCanPlayThrough)
        audio.addEventListener('ended', handleEnded)
        audio.addEventListener('error', handleError)

        if (autoplay) {
            audio.play().catch((err: Error) => {
                setError(err)
                onErrorRef.current?.(err)
            })
        }

        return () => {
            audio.pause()
            audio.removeEventListener('canplaythrough', handleCanPlayThrough)
            audio.removeEventListener('ended', handleEnded)
            audio.removeEventListener('error', handleError)
            audioRef.current = null
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src])

    const play = useCallback(() => {
        const audio = audioRef.current
        if (!audio) return
        audio
            .play()
            .then(() => {
                setIsPlaying(true)
                onPlayRef.current?.()
            })
            .catch((err: Error) => {
                setError(err)
                onErrorRef.current?.(err)
            })
    }, [])

    const pause = useCallback(() => {
        audioRef.current?.pause()
        setIsPlaying(false)
    }, [])

    const stop = useCallback(() => {
        const audio = audioRef.current
        if (!audio) return
        audio.pause()
        audio.currentTime = 0
        setIsPlaying(false)
    }, [])

    const setVolume = useCallback((v: number) => {
        const clamped = Math.min(1, Math.max(0, v))
        if (audioRef.current) audioRef.current.volume = clamped
        setVolumeState(clamped)
    }, [])

    const setPlaybackRate = useCallback((rate: number) => {
        if (audioRef.current) audioRef.current.playbackRate = rate
        setPlaybackRateState(rate)
    }, [])

    return {
        play,
        pause,
        stop,
        isPlaying,
        volume,
        setVolume,
        playbackRate,
        setPlaybackRate,
        duration,
        isReady,
        error,
    }
}
