import { useCallback, useEffect, useRef, useState } from 'react'

export interface BroadcastChannelMessageData<T = unknown> {
    /** Structured-clone payload received from the channel. */
    data: T
    /** Event origin when provided by the browser implementation. */
    origin?: string
    /** Event ID when provided by the browser implementation. */
    lastEventId?: string
}

export interface UseBroadcastChannelOptions<T = unknown> {
    /**
     * Whether to connect automatically on mount.
     * @default true
     */
    autoConnect?: boolean
    /**
     * Called whenever a broadcast message is received.
     */
    onMessage?: (message: BroadcastChannelMessageData<T>) => void
    /**
     * Called when posting, connecting, or receiving a message fails.
     */
    onError?: (error: Error, event?: Event) => void
}

export interface UseBroadcastChannelReturn<T = unknown> {
    /** Most recent broadcast message payload. */
    lastMessage: BroadcastChannelMessageData<T> | null
    /** Last BroadcastChannel-related error. */
    error: Error | null
    /** Whether the BroadcastChannel API is supported. */
    isSupported: boolean
    /** Whether the hook currently has an open channel instance. */
    isConnected: boolean
    /** Post a structured-clone message to the channel. */
    postMessage: (message: T) => void
    /** Open the channel manually. */
    connect: () => void
    /** Close the current channel instance. */
    disconnect: () => void
    /** Access the current channel instance. */
    getBroadcastChannel: () => BroadcastChannelInstance<T> | null
}

interface BroadcastChannelMessageEvent<T = unknown> {
    data: T
    origin?: string
    lastEventId?: string
}

interface BroadcastChannelInstance<T = unknown> {
    name: string
    onmessage: ((event: BroadcastChannelMessageEvent<T>) => void) | null
    onmessageerror: ((event: Event) => void) | null
    postMessage: (message: T) => void
    close: () => void
}

interface BroadcastChannelCtor {
    new (name: string): BroadcastChannelInstance<unknown>
}

function getBroadcastChannelCtor(): BroadcastChannelCtor | null {
    if (typeof window === 'undefined') return null

    const w = window as Window & {
        BroadcastChannel?: BroadcastChannelCtor
    }

    return w.BroadcastChannel ?? null
}

/**
 * Hook for communicating across tabs, windows, and workers via the BroadcastChannel API.
 *
 * @param name - Broadcast channel name, or null to disable connection attempts
 * @param options - Connection and event callbacks
 * @returns Broadcast state and imperative channel controls
 *
 * @example
 * ```tsx
 * function ThemeSync() {
 *   const { lastMessage, postMessage } = useBroadcastChannel<'light' | 'dark'>(
 *     'theme'
 *   )
 *
 *   return (
 *     <button onClick={() => postMessage('dark')}>
 *       Current: {lastMessage?.data ?? 'light'}
 *     </button>
 *   )
 * }
 * ```
 */
export default function useBroadcastChannel<T = unknown>(
    name: string | null,
    options: UseBroadcastChannelOptions<T> = {}
): UseBroadcastChannelReturn<T> {
    const { autoConnect = true, onMessage, onError } = options

    const BroadcastChannelCtor = getBroadcastChannelCtor()
    const isSupported = BroadcastChannelCtor !== null

    const [lastMessage, setLastMessage] =
        useState<BroadcastChannelMessageData<T> | null>(null)
    const [error, setError] = useState<Error | null>(null)
    const [isConnected, setIsConnected] = useState(false)

    const channelRef = useRef<BroadcastChannelInstance<T> | null>(null)
    const onMessageRef = useRef(onMessage)
    const onErrorRef = useRef(onError)

    useEffect(() => {
        onMessageRef.current = onMessage
    }, [onMessage])

    useEffect(() => {
        onErrorRef.current = onError
    }, [onError])

    const disconnect = useCallback(() => {
        const channel = channelRef.current
        channelRef.current = null

        if (channel) {
            channel.onmessage = null
            channel.onmessageerror = null
            channel.close()
        }

        setIsConnected(false)
    }, [])

    const connect = useCallback(() => {
        if (!BroadcastChannelCtor) {
            const unsupportedError = new Error(
                'BroadcastChannel is not supported by this browser'
            )

            setError(unsupportedError)
            onErrorRef.current?.(unsupportedError)
            return
        }

        if (!name || channelRef.current) {
            return
        }

        const channel = new BroadcastChannelCtor(
            name
        ) as BroadcastChannelInstance<T>
        channelRef.current = channel

        channel.onmessage = (event) => {
            const nextMessage: BroadcastChannelMessageData<T> = {
                data: event.data,
                origin: event.origin,
                lastEventId: event.lastEventId,
            }

            setLastMessage(nextMessage)
            onMessageRef.current?.(nextMessage)
        }

        channel.onmessageerror = (event) => {
            const nextError = new Error('BroadcastChannel message error')
            setError(nextError)
            onErrorRef.current?.(nextError, event)
        }

        setError(null)
        setIsConnected(true)
    }, [BroadcastChannelCtor, name])

    const postMessage = useCallback((message: T) => {
        const channel = channelRef.current

        if (!channel) {
            const disconnectedError = new Error(
                'BroadcastChannel is not connected'
            )

            setError(disconnectedError)
            onErrorRef.current?.(disconnectedError)
            return
        }

        try {
            setError(null)
            channel.postMessage(message)
        } catch (err) {
            const postError =
                err instanceof Error
                    ? err
                    : new Error('Failed to post BroadcastChannel message')

            setError(postError)
            onErrorRef.current?.(postError)
        }
    }, [])

    const getBroadcastChannel = useCallback(() => {
        return channelRef.current
    }, [])

    useEffect(() => {
        if (autoConnect && name) {
            connect()
        }

        return () => {
            disconnect()
        }
    }, [autoConnect, name, connect, disconnect])

    return {
        lastMessage,
        error,
        isSupported,
        isConnected,
        postMessage,
        connect,
        disconnect,
        getBroadcastChannel,
    }
}
