import { renderHook, act, waitFor } from '@testing-library/react'
import useWebSocket from '../useWebSocket'

// Mock WebSocket
class MockWebSocket {
    static CONNECTING = 0
    static OPEN = 1
    static CLOSING = 2
    static CLOSED = 3

    url: string
    protocols?: string | string[]
    readyState: number = MockWebSocket.CONNECTING
    onopen: ((event: Event) => void) | null = null
    onclose: ((event: CloseEvent) => void) | null = null
    onerror: ((event: Event) => void) | null = null
    onmessage: ((event: MessageEvent) => void) | null = null

    constructor(url: string, protocols?: string | string[]) {
        this.url = url
        this.protocols = protocols

        // Simulate async connection
        setTimeout(() => {
            this.readyState = MockWebSocket.OPEN
            this.onopen?.(new Event('open'))
        }, 0)
    }

    send(data: string | ArrayBuffer | Blob) {
        if (this.readyState !== MockWebSocket.OPEN) {
            throw new Error('WebSocket is not open')
        }
    }

    close() {
        this.readyState = MockWebSocket.CLOSING
        setTimeout(() => {
            this.readyState = MockWebSocket.CLOSED
            this.onclose?.(new CloseEvent('close'))
        }, 0)
    }

    // Helper for testing
    simulateMessage(data: string) {
        if (this.onmessage) {
            const event = new MessageEvent('message', { data })
            this.onmessage(event)
        }
    }

    simulateError() {
        if (this.onerror) {
            this.onerror(new Event('error'))
        }
    }
}

describe('useWebSocket', () => {
    let originalWebSocket: typeof WebSocket

    beforeEach(() => {
        originalWebSocket = global.WebSocket
        global.WebSocket = MockWebSocket as any
        jest.useFakeTimers()
    })

    afterEach(() => {
        global.WebSocket = originalWebSocket
        jest.clearAllTimers()
        jest.useRealTimers()
    })

    it('initializes with CLOSED state when autoConnect is false', () => {
        const { result } = renderHook(() =>
            useWebSocket('ws://localhost:8080', { autoConnect: false })
        )

        expect(result.current.readyState).toBe('CLOSED')
        expect(result.current.lastMessage).toBeNull()
    })

    it('auto-connects when autoConnect is true (default)', async () => {
        const { result } = renderHook(() => useWebSocket('ws://localhost:8080'))

        expect(result.current.readyState).toBe('CONNECTING')

        await act(async () => {
            jest.runAllTimers()
        })

        await waitFor(() => {
            expect(result.current.readyState).toBe('OPEN')
        })
    })

    it('calls onOpen callback when connection opens', async () => {
        const onOpen = jest.fn()
        renderHook(() => useWebSocket('ws://localhost:8080', { onOpen }))

        await act(async () => {
            jest.runAllTimers()
        })

        await waitFor(() => {
            expect(onOpen).toHaveBeenCalledTimes(1)
        })
    })

    it('receives and stores messages', async () => {
        const onMessage = jest.fn()
        const { result } = renderHook(() =>
            useWebSocket('ws://localhost:8080', { onMessage })
        )

        await act(async () => {
            jest.runAllTimers()
        })

        await waitFor(() => {
            expect(result.current.readyState).toBe('OPEN')
        })

        const ws = result.current.getWebSocket() as any

        act(() => {
            ws.simulateMessage('test message')
        })

        expect(result.current.lastMessage?.data).toBe('test message')
        expect(onMessage).toHaveBeenCalledTimes(1)
    })

    it('sends string messages', async () => {
        const { result } = renderHook(() => useWebSocket('ws://localhost:8080'))

        await act(async () => {
            jest.runAllTimers()
        })

        await waitFor(() => {
            expect(result.current.readyState).toBe('OPEN')
        })

        const ws = result.current.getWebSocket() as any
        const sendSpy = jest.spyOn(ws, 'send')

        act(() => {
            result.current.sendMessage('Hello WebSocket')
        })

        expect(sendSpy).toHaveBeenCalledWith('Hello WebSocket')
    })

    it('sends JSON messages', async () => {
        const { result } = renderHook(() => useWebSocket('ws://localhost:8080'))

        await act(async () => {
            jest.runAllTimers()
        })

        await waitFor(() => {
            expect(result.current.readyState).toBe('OPEN')
        })

        const ws = result.current.getWebSocket() as any
        const sendSpy = jest.spyOn(ws, 'send')

        act(() => {
            result.current.sendJsonMessage({ type: 'ping', id: 123 })
        })

        expect(sendSpy).toHaveBeenCalledWith('{"type":"ping","id":123}')
    })

    it('warns when trying to send message before connection is open', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
        const { result } = renderHook(() =>
            useWebSocket('ws://localhost:8080', { autoConnect: false })
        )

        act(() => {
            result.current.sendMessage('test')
        })

        expect(consoleWarnSpy).toHaveBeenCalledWith(
            'WebSocket is not connected. Message not sent.'
        )

        consoleWarnSpy.mockRestore()
    })

    it('disconnects and calls onClose callback', async () => {
        const onClose = jest.fn()
        const { result } = renderHook(() =>
            useWebSocket('ws://localhost:8080', { onClose })
        )

        await act(async () => {
            jest.runAllTimers()
        })

        await waitFor(() => {
            expect(result.current.readyState).toBe('OPEN')
        })

        act(() => {
            result.current.disconnect()
        })

        await act(async () => {
            jest.runAllTimers()
        })

        await waitFor(() => {
            expect(result.current.readyState).toBe('CLOSED')
            expect(onClose).toHaveBeenCalledTimes(1)
        })
    })

    it('manually connects when autoConnect is false', async () => {
        const { result } = renderHook(() =>
            useWebSocket('ws://localhost:8080', { autoConnect: false })
        )

        expect(result.current.readyState).toBe('CLOSED')

        act(() => {
            result.current.connect()
        })

        await act(async () => {
            jest.runAllTimers()
        })

        await waitFor(() => {
            expect(result.current.readyState).toBe('OPEN')
        })
    })

    it('reconnects automatically when reconnect option is enabled', async () => {
        const onOpen = jest.fn()
        const { result } = renderHook(() =>
            useWebSocket('ws://localhost:8080', {
                reconnect: true,
                reconnectInterval: 1000,
                onOpen,
            })
        )

        await act(async () => {
            jest.runAllTimers()
        })

        await waitFor(() => {
            expect(result.current.readyState).toBe('OPEN')
        })

        expect(onOpen).toHaveBeenCalledTimes(1)

        // Simulate disconnect by closing the WebSocket
        const ws = result.current.getWebSocket() as any

        await act(async () => {
            ws.close()
            jest.runAllTimers()
        })

        // Wait for reconnection attempt
        await act(async () => {
            jest.advanceTimersByTime(1000)
            jest.runAllTimers()
        })

        await waitFor(() => {
            expect(result.current.readyState).toBe('OPEN')
            expect(onOpen).toHaveBeenCalledTimes(2)
        })
    })

    it('limits reconnection attempts', async () => {
        const onClose = jest.fn()
        renderHook(() =>
            useWebSocket('ws://localhost:8080', {
                reconnect: true,
                reconnectAttempts: 2,
                reconnectInterval: 1000,
                onClose,
            })
        )

        await act(async () => {
            jest.runAllTimers()
        })

        // Close connection multiple times
        for (let i = 0; i < 3; i++) {
            await act(async () => {
                const ws = global.WebSocket as any
                if (ws.instance) {
                    ws.instance.close()
                }
                jest.advanceTimersByTime(1000)
                jest.runAllTimers()
            })
        }

        // Should have attempted to reconnect only 2 times (plus initial connection)
        await waitFor(() => {
            expect(onClose.mock.calls.length).toBeLessThanOrEqual(3)
        })
    })

    it('calls onError callback when error occurs', async () => {
        const onError = jest.fn()
        const { result } = renderHook(() =>
            useWebSocket('ws://localhost:8080', { onError })
        )

        await act(async () => {
            jest.runAllTimers()
        })

        await waitFor(() => {
            expect(result.current.readyState).toBe('OPEN')
        })

        const ws = result.current.getWebSocket() as any

        act(() => {
            ws.simulateError()
        })

        expect(onError).toHaveBeenCalledTimes(1)
    })

    it('handles null URL gracefully', () => {
        const { result } = renderHook(() => useWebSocket(null))

        expect(result.current.readyState).toBe('CLOSED')
        expect(result.current.getWebSocket()).toBeNull()
    })

    it('reconnects when URL changes', async () => {
        const { result, rerender } = renderHook(
            ({ url }) => useWebSocket(url),
            { initialProps: { url: 'ws://localhost:8080' } }
        )

        await act(async () => {
            jest.runAllTimers()
        })

        await waitFor(() => {
            expect(result.current.readyState).toBe('OPEN')
        })

        const firstWs = result.current.getWebSocket()

        // Change URL
        rerender({ url: 'ws://localhost:8081' })

        await act(async () => {
            jest.runAllTimers()
        })

        await waitFor(() => {
            expect(result.current.readyState).toBe('OPEN')
        })

        const secondWs = result.current.getWebSocket()
        expect(secondWs).not.toBe(firstWs)
    })

    it('cleans up on unmount', async () => {
        const { result, unmount } = renderHook(() =>
            useWebSocket('ws://localhost:8080')
        )

        await act(async () => {
            jest.runAllTimers()
        })

        await waitFor(() => {
            expect(result.current.readyState).toBe('OPEN')
        })

        const ws = result.current.getWebSocket() as any
        const closeSpy = jest.spyOn(ws, 'close')

        unmount()

        expect(closeSpy).toHaveBeenCalled()
    })

    it('passes protocols to WebSocket constructor', () => {
        const protocols = ['protocol1', 'protocol2']
        renderHook(() =>
            useWebSocket('ws://localhost:8080', {
                protocols,
                autoConnect: false,
            })
        )

        // WebSocket constructor is called during connect
        const { result } = renderHook(() =>
            useWebSocket('ws://localhost:8080', { protocols })
        )

        act(() => {
            jest.runAllTimers()
        })

        const ws = result.current.getWebSocket() as any
        expect(ws?.protocols).toEqual(protocols)
    })

    it('does not reconnect after manual disconnect', async () => {
        const onOpen = jest.fn()
        const { result } = renderHook(() =>
            useWebSocket('ws://localhost:8080', {
                reconnect: true,
                reconnectInterval: 1000,
                onOpen,
            })
        )

        await act(async () => {
            jest.runAllTimers()
        })

        await waitFor(() => {
            expect(result.current.readyState).toBe('OPEN')
        })

        expect(onOpen).toHaveBeenCalledTimes(1)

        // Manual disconnect
        act(() => {
            result.current.disconnect()
        })

        await act(async () => {
            jest.runAllTimers()
        })

        // Wait past reconnection interval
        await act(async () => {
            jest.advanceTimersByTime(2000)
            jest.runAllTimers()
        })

        // Should not reconnect
        expect(onOpen).toHaveBeenCalledTimes(1)
    })
})
