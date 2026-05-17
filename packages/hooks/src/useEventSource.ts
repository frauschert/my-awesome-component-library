import { useCallback, useEffect, useRef, useState } from 'react'

export type EventSourceReadyState = 'CONNECTING' | 'OPEN' | 'CLOSED'

export interface EventSourceMessageData {
    data: string
    type: string
    lastEventId?: string
    origin?: string
}

export interface UseEventSourceOptions {
    /**
     * Whether to connect automatically on mount.
     * @default true
     */
    autoConnect?: boolean
    /**
     * Whether cross-site Access-Control requests should be made using credentials.
     * @default false
     */
    withCredentials?: boolean
    /**
     * Additional named SSE events to subscribe to.
     */
    events?: string[]
    /**
     * Parse incoming event data as JSON and expose the parsed value.
     * @default false
     */
    parseJson?: boolean
    /**
     * Called when the EventSource connection opens.
     */
    onOpen?: (event: Event) => void
    /**
     * Called when a message event is received.
     */
    onMessage?: (event: EventSourceMessageData, parsedData?: unknown) => void
    /**
     * Called for named SSE events listed in `events`.
     */
    onEvent?: (
        eventName: string,
        event: EventSourceMessageData,
        parsedData?: unknown
    ) => void
    /**
     * Called when the EventSource connection or message parsing fails.
     */
    onError?: (error: Error, event?: Event) => void
}

export interface UseEventSourceReturn {
    /** Most recent SSE payload. */
    lastEvent: EventSourceMessageData | null
    /** Name of the most recent SSE event. */
    lastEventName: string | null
    /** Parsed payload from the most recent event when `parseJson` is enabled. */
    lastParsedData: unknown
    /** Current EventSource ready state. */
    readyState: EventSourceReadyState
    /** Last EventSource or parsing error. */
    error: Error | null
    /** Whether the EventSource API is supported. */
    isSupported: boolean
    /** Open the SSE connection manually. */
    connect: () => void
    /** Close the SSE connection manually. */
    disconnect: () => void
    /** Access the current EventSource instance. */
    getEventSource: () => EventSourceInstance | null
}

const EMPTY_EVENTS: string[] = []

interface EventSourceInitLike {
    withCredentials?: boolean
}

interface EventSourceInstance {
    readyState: number
    onopen: ((event: Event) => void) | null
    onmessage: ((event: EventSourceMessageData) => void) | null
    onerror: ((event: Event) => void) | null
    close(): void
    addEventListener?: (
        type: string,
        listener: (event: EventSourceMessageData) => void
    ) => void
    removeEventListener?: (
        type: string,
        listener: (event: EventSourceMessageData) => void
    ) => void
}

interface EventSourceCtor {
    new (url: string, init?: EventSourceInitLike): EventSourceInstance
}

function getEventSourceCtor(): EventSourceCtor | null {
    if (typeof window === 'undefined') return null

    const w = window as Window & {
        EventSource?: EventSourceCtor
    }

    return w.EventSource ?? null
}

function mapReadyState(readyState: number): EventSourceReadyState {
    switch (readyState) {
        case 0:
            return 'CONNECTING'
        case 1:
            return 'OPEN'
        case 2:
            return 'CLOSED'
        default:
            return 'CLOSED'
    }
}

function toError(error: unknown, fallbackMessage: string) {
    return error instanceof Error ? error : new Error(fallbackMessage)
}

/**
 * Hook for consuming Server-Sent Events via the EventSource API.
 *
 * @param url - SSE endpoint URL, or null to disable connection attempts
 * @param options - EventSource configuration and lifecycle callbacks
 * @returns SSE connection state and controls
 *
 * @example
 * ```tsx
 * function Notifications() {
 *   const { lastEvent, readyState } = useEventSource('/api/stream', {
 *     parseJson: true,
 *   })
 *
 *   return (
 *     <div>
 *       <p>Status: {readyState}</p>
 *       <p>{lastEvent?.data ?? 'No events yet'}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export default function useEventSource(
    url: string | null,
    options: UseEventSourceOptions = {}
): UseEventSourceReturn {
    const {
        autoConnect = true,
        withCredentials = false,
        events: providedEvents,
        parseJson = false,
        onOpen,
        onMessage,
        onEvent,
        onError,
    } = options

    const events = providedEvents ?? EMPTY_EVENTS
    const eventsKey = events.join('\n')

    const EventSourceCtor = getEventSourceCtor()
    const isSupported = EventSourceCtor !== null

    const [lastEvent, setLastEvent] = useState<EventSourceMessageData | null>(
        null
    )
    const [lastEventName, setLastEventName] = useState<string | null>(null)
    const [lastParsedData, setLastParsedData] = useState<unknown>(null)
    const [readyState, setReadyState] =
        useState<EventSourceReadyState>('CLOSED')
    const [error, setError] = useState<Error | null>(null)

    const eventSourceRef = useRef<EventSourceInstance | null>(null)
    const cleanupListenersRef = useRef<(() => void) | null>(null)
    const eventsRef = useRef(events)
    const onOpenRef = useRef(onOpen)
    const onMessageRef = useRef(onMessage)
    const onEventRef = useRef(onEvent)
    const onErrorRef = useRef(onError)
    const parseJsonRef = useRef(parseJson)

    useEffect(() => {
        eventsRef.current = events
    }, [eventsKey])

    useEffect(() => {
        onOpenRef.current = onOpen
    }, [onOpen])

    useEffect(() => {
        onMessageRef.current = onMessage
    }, [onMessage])

    useEffect(() => {
        onEventRef.current = onEvent
    }, [onEvent])

    useEffect(() => {
        onErrorRef.current = onError
    }, [onError])

    useEffect(() => {
        parseJsonRef.current = parseJson
    }, [parseJson])

    const disconnect = useCallback(() => {
        cleanupListenersRef.current?.()
        cleanupListenersRef.current = null

        const eventSource = eventSourceRef.current
        eventSourceRef.current = null

        if (eventSource) {
            eventSource.onopen = null
            eventSource.onmessage = null
            eventSource.onerror = null
            eventSource.close()
        }

        setReadyState('CLOSED')
    }, [])

    const connect = useCallback(() => {
        if (!EventSourceCtor) {
            const unsupportedError = new Error(
                'EventSource is not supported by this browser'
            )

            setError(unsupportedError)
            onErrorRef.current?.(unsupportedError)
            return
        }

        if (!url) {
            return
        }

        if (eventSourceRef.current && eventSourceRef.current.readyState !== 2) {
            return
        }

        disconnect()

        const eventSource = new EventSourceCtor(url, { withCredentials })
        eventSourceRef.current = eventSource
        setReadyState(mapReadyState(eventSource.readyState))
        setError(null)

        const handleIncomingEvent = (
            event: EventSourceMessageData,
            explicitType?: string
        ) => {
            const eventName = explicitType ?? event.type ?? 'message'
            let parsedData: unknown = null

            if (parseJsonRef.current) {
                try {
                    parsedData = JSON.parse(event.data)
                } catch (err) {
                    const parseError = toError(
                        err,
                        'Failed to parse EventSource message'
                    )

                    setError(parseError)
                    onErrorRef.current?.(parseError)
                }
            }

            setLastEvent(event)
            setLastEventName(eventName)
            setLastParsedData(parseJsonRef.current ? parsedData : null)

            onMessageRef.current?.(event, parsedData)

            if (eventName !== 'message') {
                onEventRef.current?.(eventName, event, parsedData)
            }
        }

        eventSource.onopen = (event) => {
            setReadyState(mapReadyState(eventSource.readyState))
            onOpenRef.current?.(event)
        }

        eventSource.onmessage = (event) => {
            handleIncomingEvent(event, 'message')
        }

        eventSource.onerror = (event) => {
            const nextReadyState = mapReadyState(eventSource.readyState)
            const connectionError = new Error(
                nextReadyState === 'CLOSED'
                    ? 'EventSource connection closed'
                    : 'EventSource connection error'
            )

            setReadyState(nextReadyState)
            setError(connectionError)
            onErrorRef.current?.(connectionError, event)
        }

        if (eventsRef.current.length > 0 && eventSource.addEventListener) {
            const listeners = eventsRef.current.map((eventName) => {
                const listener = (event: EventSourceMessageData) => {
                    handleIncomingEvent(event, eventName)
                }

                eventSource.addEventListener?.(eventName, listener)
                return { eventName, listener }
            })

            cleanupListenersRef.current = () => {
                listeners.forEach(({ eventName, listener }) => {
                    eventSource.removeEventListener?.(eventName, listener)
                })
            }
        }
    }, [EventSourceCtor, disconnect, eventsKey, url, withCredentials])

    const getEventSource = useCallback(() => {
        return eventSourceRef.current
    }, [])

    useEffect(() => {
        if (autoConnect) {
            connect()
        }

        return () => {
            disconnect()
        }
    }, [autoConnect, connect, disconnect])

    return {
        lastEvent,
        lastEventName,
        lastParsedData,
        readyState,
        error,
        isSupported,
        connect,
        disconnect,
        getEventSource,
    }
}
