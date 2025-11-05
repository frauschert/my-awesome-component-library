import { useState, useEffect, useRef, useCallback } from 'react'

export type ReadyState = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED'

export interface UseWebSocketOptions {
    /**
     * Protocols to use when connecting
     */
    protocols?: string | string[]

    /**
     * Whether to automatically connect on mount
     * @default true
     */
    autoConnect?: boolean

    /**
     * Whether to automatically reconnect on disconnect
     * @default false
     */
    reconnect?: boolean

    /**
     * Number of reconnection attempts (0 = infinite)
     * @default 0
     */
    reconnectAttempts?: number

    /**
     * Delay between reconnection attempts in milliseconds
     * @default 3000
     */
    reconnectInterval?: number

    /**
     * Callback when connection opens
     */
    onOpen?: (event: Event) => void

    /**
     * Callback when connection closes
     */
    onClose?: (event: CloseEvent) => void

    /**
     * Callback when error occurs
     */
    onError?: (event: Event) => void

    /**
     * Callback when message is received
     */
    onMessage?: (event: MessageEvent) => void
}

export interface UseWebSocketReturn {
    /**
     * The latest message received from the WebSocket
     */
    lastMessage: MessageEvent | null

    /**
     * Send a message through the WebSocket
     */
    sendMessage: (message: string | ArrayBuffer | Blob) => void

    /**
     * Send a JSON message through the WebSocket
     */
    sendJsonMessage: (message: any) => void

    /**
     * Current ready state of the WebSocket connection
     */
    readyState: ReadyState

    /**
     * Connect to the WebSocket
     */
    connect: () => void

    /**
     * Disconnect from the WebSocket
     */
    disconnect: () => void

    /**
     * The WebSocket instance (can be null)
     */
    getWebSocket: () => WebSocket | null
}

/**
 * Hook for managing WebSocket connections with automatic reconnection and message handling.
 *
 * @param url - WebSocket URL to connect to
 * @param options - Configuration options
 * @returns WebSocket state and methods
 *
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const { lastMessage, sendJsonMessage, readyState } = useWebSocket(
 *     'ws://localhost:8080',
 *     {
 *       onOpen: () => console.log('Connected'),
 *       onMessage: (msg) => console.log('Received:', msg.data),
 *       reconnect: true,
 *       reconnectAttempts: 5
 *     }
 *   )
 *
 *   return (
 *     <div>
 *       <div>Status: {readyState}</div>
 *       <button onClick={() => sendJsonMessage({ type: 'ping' })}>
 *         Send Ping
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 */
export default function useWebSocket(
    url: string | null,
    options: UseWebSocketOptions = {}
): UseWebSocketReturn {
    const {
        protocols,
        autoConnect = true,
        reconnect = false,
        reconnectAttempts = 0,
        reconnectInterval = 3000,
        onOpen,
        onClose,
        onError,
        onMessage,
    } = options

    const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null)
    const [readyState, setReadyState] = useState<ReadyState>('CLOSED')

    const wsRef = useRef<WebSocket | null>(null)
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
    const reconnectCountRef = useRef(0)
    const shouldReconnectRef = useRef(reconnect)
    const urlRef = useRef(url)

    // Update refs when options change
    useEffect(() => {
        shouldReconnectRef.current = reconnect
        urlRef.current = url
    }, [reconnect, url])

    const getReadyState = useCallback((ws: WebSocket): ReadyState => {
        switch (ws.readyState) {
            case WebSocket.CONNECTING:
                return 'CONNECTING'
            case WebSocket.OPEN:
                return 'OPEN'
            case WebSocket.CLOSING:
                return 'CLOSING'
            case WebSocket.CLOSED:
                return 'CLOSED'
            default:
                return 'CLOSED'
        }
    }, [])

    const connect = useCallback(() => {
        if (!urlRef.current) return
        if (wsRef.current?.readyState === WebSocket.OPEN) return

        try {
            const ws = protocols
                ? new WebSocket(urlRef.current, protocols)
                : new WebSocket(urlRef.current)

            ws.onopen = (event) => {
                setReadyState('OPEN')
                reconnectCountRef.current = 0
                onOpen?.(event)
            }

            ws.onclose = (event) => {
                setReadyState('CLOSED')
                onClose?.(event)

                // Attempt reconnection if enabled
                if (
                    shouldReconnectRef.current &&
                    (reconnectAttempts === 0 ||
                        reconnectCountRef.current < reconnectAttempts)
                ) {
                    reconnectCountRef.current++
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect()
                    }, reconnectInterval)
                }
            }

            ws.onerror = (event) => {
                onError?.(event)
            }

            ws.onmessage = (event) => {
                setLastMessage(event)
                onMessage?.(event)
            }

            wsRef.current = ws
            setReadyState(getReadyState(ws))
        } catch (error) {
            console.error('WebSocket connection error:', error)
            setReadyState('CLOSED')
        }
    }, [
        protocols,
        reconnectAttempts,
        reconnectInterval,
        onOpen,
        onClose,
        onError,
        onMessage,
        getReadyState,
    ])

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
        }
        shouldReconnectRef.current = false
        reconnectCountRef.current = 0

        if (wsRef.current) {
            wsRef.current.close()
            wsRef.current = null
        }
    }, [])

    const sendMessage = useCallback((message: string | ArrayBuffer | Blob) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(message)
        } else {
            console.warn('WebSocket is not connected. Message not sent.')
        }
    }, [])

    const sendJsonMessage = useCallback(
        (message: any) => {
            sendMessage(JSON.stringify(message))
        },
        [sendMessage]
    )

    const getWebSocket = useCallback(() => {
        return wsRef.current
    }, [])

    // Auto-connect on mount if enabled and handle URL changes
    useEffect(() => {
        if (autoConnect && url) {
            connect()
        }

        return () => {
            disconnect()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, autoConnect]) // Reconnect when URL or autoConnect changes

    return {
        lastMessage,
        sendMessage,
        sendJsonMessage,
        readyState,
        connect,
        disconnect,
        getWebSocket,
    }
}
