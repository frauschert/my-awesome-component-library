import { useCallback, useEffect, useRef, useState } from 'react'
import type { VisibilityState } from './usePageVisibility'

export type PageLifecycleState = 'active' | 'passive' | 'hidden' | 'frozen'

export type PageLifecycleEvent =
    | 'focus'
    | 'blur'
    | 'visibilitychange'
    | 'pageshow'
    | 'pagehide'
    | 'freeze'
    | 'resume'

export interface PageLifecycleSnapshot {
    /** Normalized page lifecycle state. */
    state: PageLifecycleState
    /** Current document visibility state. */
    visibilityState: VisibilityState
    /** Whether the page is currently visible. */
    isVisible: boolean
    /** Whether the document currently has focus. */
    isFocused: boolean
    /** Whether the page is currently frozen. */
    isFrozen: boolean
    /** Whether the current lifecycle state is `active`. */
    isActive: boolean
    /** Whether the current lifecycle state is `passive`. */
    isPassive: boolean
    /** `persisted` flag from the most recent `pageshow` / `pagehide` event. */
    persisted: boolean | null
    /** Whether the page was previously discarded by the browser. */
    wasDiscarded: boolean
    /** Most recent lifecycle event handled by the hook. */
    lastEvent: PageLifecycleEvent | null
}

export interface UsePageLifecycleOptions {
    /**
     * Called whenever the lifecycle snapshot changes.
     */
    onChange?: (snapshot: PageLifecycleSnapshot) => void
    /**
     * Called when the page becomes visible, including `pageshow`.
     */
    onShow?: (persisted: boolean) => void
    /**
     * Called when the page becomes hidden, including `pagehide`.
     */
    onHide?: (persisted: boolean) => void
    /**
     * Called when the window receives focus.
     */
    onFocus?: () => void
    /**
     * Called when the window loses focus.
     */
    onBlur?: () => void
    /**
     * Called when the page is frozen.
     */
    onFreeze?: () => void
    /**
     * Called when the page resumes from a frozen state.
     */
    onResume?: () => void
}

export interface UsePageLifecycleReturn extends PageLifecycleSnapshot {
    /** Whether lifecycle observation is available in the current environment. */
    isSupported: boolean
}

type DocumentWithPageLifecycle = Document & {
    wasDiscarded?: boolean
}

type PageTransitionEventLike = Event & {
    persisted?: boolean
}

function getVisibilityState(): VisibilityState {
    if (typeof document === 'undefined') return 'visible'
    return document.visibilityState === 'hidden' ? 'hidden' : 'visible'
}

function getIsFocused() {
    if (typeof document === 'undefined') return true
    return typeof document.hasFocus === 'function' ? document.hasFocus() : true
}

function getWasDiscarded() {
    if (typeof document === 'undefined') return false
    return Boolean((document as DocumentWithPageLifecycle).wasDiscarded)
}

function deriveLifecycleState(values: {
    isVisible: boolean
    isFocused: boolean
    isFrozen: boolean
}): PageLifecycleState {
    if (values.isFrozen) return 'frozen'
    if (!values.isVisible) return 'hidden'
    return values.isFocused ? 'active' : 'passive'
}

function createSnapshot(
    previous: Partial<PageLifecycleSnapshot> = {},
    overrides: Partial<PageLifecycleSnapshot> = {}
): PageLifecycleSnapshot {
    const visibilityState =
        overrides.visibilityState ??
        previous.visibilityState ??
        getVisibilityState()

    const isVisible =
        overrides.isVisible ??
        previous.isVisible ??
        visibilityState === 'visible'

    const isFocused =
        overrides.isFocused ?? previous.isFocused ?? getIsFocused()

    const isFrozen = overrides.isFrozen ?? previous.isFrozen ?? false
    const persisted = overrides.persisted ?? previous.persisted ?? null
    const wasDiscarded = overrides.wasDiscarded ?? getWasDiscarded()
    const lastEvent = overrides.lastEvent ?? previous.lastEvent ?? null
    const state = deriveLifecycleState({ isVisible, isFocused, isFrozen })

    return {
        state,
        visibilityState,
        isVisible,
        isFocused,
        isFrozen,
        isActive: state === 'active',
        isPassive: state === 'passive',
        persisted,
        wasDiscarded,
        lastEvent,
    }
}

/**
 * Hook that normalizes page visibility, focus, freeze, and page-transition
 * events into a single lifecycle snapshot.
 *
 * @param options - Lifecycle callbacks
 * @returns Current page lifecycle state
 *
 * @example
 * ```tsx
 * function LifecycleStatus() {
 *   const { state, isVisible, isFocused } = usePageLifecycle()
 *
 *   return (
 *     <div>
 *       <p>{state}</p>
 *       <p>{String(isVisible)} / {String(isFocused)}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export default function usePageLifecycle(
    options: UsePageLifecycleOptions = {}
): UsePageLifecycleReturn {
    const { onChange, onShow, onHide, onFocus, onBlur, onFreeze, onResume } =
        options

    const isSupported =
        typeof window !== 'undefined' && typeof document !== 'undefined'

    const [snapshot, setSnapshot] = useState<PageLifecycleSnapshot>(() =>
        createSnapshot()
    )

    const snapshotRef = useRef(snapshot)
    const callbacksRef = useRef({
        onChange,
        onShow,
        onHide,
        onFocus,
        onBlur,
        onFreeze,
        onResume,
    })

    useEffect(() => {
        callbacksRef.current = {
            onChange,
            onShow,
            onHide,
            onFocus,
            onBlur,
            onFreeze,
            onResume,
        }
    }, [onChange, onShow, onHide, onFocus, onBlur, onFreeze, onResume])

    const updateSnapshot = useCallback(
        (
            eventType: PageLifecycleEvent,
            overrides: Partial<PageLifecycleSnapshot> = {}
        ) => {
            const previous = snapshotRef.current
            const next = createSnapshot(previous, {
                ...overrides,
                lastEvent: eventType,
            })

            snapshotRef.current = next
            setSnapshot(next)
            callbacksRef.current.onChange?.(next)

            if (eventType === 'focus') {
                callbacksRef.current.onFocus?.()
            } else if (eventType === 'blur') {
                callbacksRef.current.onBlur?.()
            } else if (eventType === 'freeze') {
                callbacksRef.current.onFreeze?.()
            } else if (eventType === 'resume') {
                callbacksRef.current.onResume?.()
            } else if (eventType === 'pageshow') {
                callbacksRef.current.onShow?.(next.persisted ?? false)
            } else if (eventType === 'pagehide') {
                callbacksRef.current.onHide?.(next.persisted ?? false)
            } else if (
                eventType === 'visibilitychange' &&
                previous.isVisible !== next.isVisible
            ) {
                if (next.isVisible) {
                    callbacksRef.current.onShow?.(next.persisted ?? false)
                } else {
                    callbacksRef.current.onHide?.(next.persisted ?? false)
                }
            }
        },
        []
    )

    useEffect(() => {
        if (!isSupported) {
            return
        }

        const handleVisibilityChange = () => {
            updateSnapshot('visibilitychange', {
                visibilityState: getVisibilityState(),
                isVisible: getVisibilityState() === 'visible',
            })
        }

        const handleFocus = () => {
            updateSnapshot('focus', { isFocused: true })
        }

        const handleBlur = () => {
            updateSnapshot('blur', { isFocused: false })
        }

        const handleFreeze = () => {
            updateSnapshot('freeze', { isFrozen: true })
        }

        const handleResume = () => {
            updateSnapshot('resume', {
                isFrozen: false,
                visibilityState: getVisibilityState(),
                isVisible: getVisibilityState() === 'visible',
                isFocused: getIsFocused(),
            })
        }

        const handlePageShow = (event: Event) => {
            updateSnapshot('pageshow', {
                persisted: Boolean(
                    (event as PageTransitionEventLike).persisted
                ),
                visibilityState: 'visible',
                isVisible: true,
                isFocused: getIsFocused(),
                isFrozen: false,
            })
        }

        const handlePageHide = (event: Event) => {
            updateSnapshot('pagehide', {
                persisted: Boolean(
                    (event as PageTransitionEventLike).persisted
                ),
                visibilityState: 'hidden',
                isVisible: false,
            })
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        document.addEventListener('freeze', handleFreeze)
        document.addEventListener('resume', handleResume)
        window.addEventListener('focus', handleFocus)
        window.addEventListener('blur', handleBlur)
        window.addEventListener('pageshow', handlePageShow)
        window.addEventListener('pagehide', handlePageHide)

        return () => {
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            )
            document.removeEventListener('freeze', handleFreeze)
            document.removeEventListener('resume', handleResume)
            window.removeEventListener('focus', handleFocus)
            window.removeEventListener('blur', handleBlur)
            window.removeEventListener('pageshow', handlePageShow)
            window.removeEventListener('pagehide', handlePageHide)
        }
    }, [isSupported, updateSnapshot])

    return {
        ...snapshot,
        isSupported,
    }
}
