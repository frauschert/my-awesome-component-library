import { RefObject, useCallback, useEffect, useRef, useState } from 'react'

export interface PictureInPictureWindowData {
    /** Width of the picture-in-picture window, when available. */
    width: number
    /** Height of the picture-in-picture window, when available. */
    height: number
}

export interface UsePictureInPictureOptions {
    /**
     * Called when the target video enters picture-in-picture mode.
     */
    onEnter?: (window: PictureInPictureWindowData | null) => void
    /**
     * Called when the target video leaves picture-in-picture mode.
     */
    onExit?: () => void
    /**
     * Called when entering or leaving picture-in-picture fails.
     */
    onError?: (error: Error) => void
}

export interface UsePictureInPictureReturn {
    /** Whether the target video is currently in picture-in-picture mode. */
    isPictureInPicture: boolean
    /** Latest picture-in-picture window dimensions, when available. */
    pictureInPictureWindow: PictureInPictureWindowData | null
    /** Last picture-in-picture-related error, if any. */
    error: Error | null
    /** Whether the Picture-in-Picture API is supported for the current document. */
    isSupported: boolean
    /** Request picture-in-picture for the target video. */
    enter: () => Promise<void>
    /** Exit picture-in-picture mode if active. */
    exit: () => Promise<void>
    /** Toggle picture-in-picture mode on/off. */
    toggle: () => Promise<void>
}

interface PictureInPictureWindowLike {
    width?: number
    height?: number
}

interface PictureInPictureEventLike extends Event {
    pictureInPictureWindow?: PictureInPictureWindowLike
}

type DocumentWithPictureInPicture = Document & {
    pictureInPictureEnabled?: boolean
    pictureInPictureElement?: Element | null
    exitPictureInPicture?: () => Promise<void>
}

type VideoWithPictureInPicture = HTMLVideoElement & {
    disablePictureInPicture?: boolean
    requestPictureInPicture?: () => Promise<PictureInPictureWindowLike>
}

function getPictureInPictureWindowData(
    pipWindow: PictureInPictureWindowLike | null | undefined
): PictureInPictureWindowData | null {
    if (
        !pipWindow ||
        typeof pipWindow.width !== 'number' ||
        typeof pipWindow.height !== 'number'
    ) {
        return null
    }

    return {
        width: pipWindow.width,
        height: pipWindow.height,
    }
}

/**
 * Hook that manages picture-in-picture mode for a video element.
 *
 * @param videoRef - Ref to the video element to present in picture-in-picture
 * @param options - Optional lifecycle callbacks
 * @returns Picture-in-picture state and control functions
 */
export default function usePictureInPicture(
    videoRef: RefObject<HTMLVideoElement | null>,
    options: UsePictureInPictureOptions = {}
): UsePictureInPictureReturn {
    const { onEnter, onExit, onError } = options

    const isSupported =
        typeof document !== 'undefined' &&
        !!(document as DocumentWithPictureInPicture).pictureInPictureEnabled

    const [isPictureInPicture, setIsPictureInPicture] = useState(false)
    const [pictureInPictureWindow, setPictureInPictureWindow] =
        useState<PictureInPictureWindowData | null>(null)
    const [error, setError] = useState<Error | null>(null)

    const onEnterRef = useRef(onEnter)
    const onExitRef = useRef(onExit)
    const onErrorRef = useRef(onError)

    useEffect(() => {
        onEnterRef.current = onEnter
    }, [onEnter])

    useEffect(() => {
        onExitRef.current = onExit
    }, [onExit])

    useEffect(() => {
        onErrorRef.current = onError
    }, [onError])

    const syncState = useCallback(() => {
        const doc = document as DocumentWithPictureInPicture
        const nextIsPictureInPicture =
            doc.pictureInPictureElement === videoRef.current

        setIsPictureInPicture(nextIsPictureInPicture)

        if (!nextIsPictureInPicture) {
            setPictureInPictureWindow(null)
        }
    }, [videoRef])

    const enter = useCallback(async () => {
        const doc = document as DocumentWithPictureInPicture
        const video = videoRef.current as VideoWithPictureInPicture | null

        if (!isSupported) {
            const unsupportedError = new Error(
                'Picture-in-Picture is not supported by this browser'
            )
            setError(unsupportedError)
            onErrorRef.current?.(unsupportedError)
            return
        }

        if (!video) {
            const elementError = new Error('Video ref is not attached')
            setError(elementError)
            onErrorRef.current?.(elementError)
            return
        }

        if (video.disablePictureInPicture) {
            const disabledError = new Error(
                'Picture-in-Picture is disabled for this video element'
            )
            setError(disabledError)
            onErrorRef.current?.(disabledError)
            return
        }

        if (typeof video.requestPictureInPicture !== 'function') {
            const unsupportedError = new Error(
                'Picture-in-Picture is not supported by this video element'
            )
            setError(unsupportedError)
            onErrorRef.current?.(unsupportedError)
            return
        }

        setError(null)

        try {
            if (
                doc.pictureInPictureElement &&
                doc.pictureInPictureElement !== video &&
                typeof doc.exitPictureInPicture === 'function'
            ) {
                await doc.exitPictureInPicture()
            }

            const pipWindow = await video.requestPictureInPicture()
            const nextWindow = getPictureInPictureWindowData(pipWindow)
            setPictureInPictureWindow(nextWindow)
            setIsPictureInPicture(true)
        } catch (err) {
            const enterError =
                err instanceof Error
                    ? err
                    : new Error('Failed to enter picture-in-picture')
            setError(enterError)
            onErrorRef.current?.(enterError)
        }
    }, [isSupported, videoRef])

    const exit = useCallback(async () => {
        const doc = document as DocumentWithPictureInPicture

        if (!isSupported) {
            const unsupportedError = new Error(
                'Picture-in-Picture is not supported by this browser'
            )
            setError(unsupportedError)
            onErrorRef.current?.(unsupportedError)
            return
        }

        if (typeof doc.exitPictureInPicture !== 'function') {
            const unsupportedError = new Error(
                'Document.exitPictureInPicture is not supported by this browser'
            )
            setError(unsupportedError)
            onErrorRef.current?.(unsupportedError)
            return
        }

        if (!doc.pictureInPictureElement) {
            setIsPictureInPicture(false)
            setPictureInPictureWindow(null)
            return
        }

        setError(null)

        try {
            await doc.exitPictureInPicture()
            setIsPictureInPicture(false)
            setPictureInPictureWindow(null)
        } catch (err) {
            const exitError =
                err instanceof Error
                    ? err
                    : new Error('Failed to exit picture-in-picture')
            setError(exitError)
            onErrorRef.current?.(exitError)
        }
    }, [isSupported])

    const toggle = useCallback(async () => {
        if (isPictureInPicture) {
            await exit()
        } else {
            await enter()
        }
    }, [enter, exit, isPictureInPicture])

    useEffect(() => {
        const video = videoRef.current as VideoWithPictureInPicture | null
        if (!video || typeof video.addEventListener !== 'function') {
            return
        }

        const handleEnter = (event: Event) => {
            const nextWindow = getPictureInPictureWindowData(
                (event as PictureInPictureEventLike).pictureInPictureWindow
            )

            setIsPictureInPicture(true)
            setPictureInPictureWindow(nextWindow)
            onEnterRef.current?.(nextWindow)
        }

        const handleLeave = () => {
            setIsPictureInPicture(false)
            setPictureInPictureWindow(null)
            onExitRef.current?.()
        }

        video.addEventListener('enterpictureinpicture', handleEnter)
        video.addEventListener('leavepictureinpicture', handleLeave)
        syncState()

        return () => {
            video.removeEventListener('enterpictureinpicture', handleEnter)
            video.removeEventListener('leavepictureinpicture', handleLeave)
        }
    }, [syncState, videoRef])

    return {
        isPictureInPicture,
        pictureInPictureWindow,
        error,
        isSupported,
        enter,
        exit,
        toggle,
    }
}
