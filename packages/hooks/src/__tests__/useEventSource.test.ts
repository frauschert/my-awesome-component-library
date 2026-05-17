import { act, renderHook } from '@testing-library/react'
import useEventSource from '../useEventSource'

type MockEvent = {
    data: string
    type: string
    lastEventId?: string
    origin?: string
}

type EventListener = (event: MockEvent) => void

class MockEventSource {
    url: string
    withCredentials: boolean
    readyState = 0
    onopen: ((event: Event) => void) | null = null
    onmessage: ((event: MockEvent) => void) | null = null
    onerror: ((event: Event) => void) | null = null
    close = jest.fn(() => {
        this.readyState = 2
    })
    addEventListener = jest.fn((type: string, listener: EventListener) => {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set())
        }

        this.listeners.get(type)?.add(listener)
    })
    removeEventListener = jest.fn((type: string, listener: EventListener) => {
        this.listeners.get(type)?.delete(listener)
    })

    private listeners = new Map<string, Set<EventListener>>()

    constructor(url: string, init?: { withCredentials?: boolean }) {
        this.url = url
        this.withCredentials = init?.withCredentials ?? false
        mockEventSourceInstance = this
    }

    emitOpen() {
        this.readyState = 1
        this.onopen?.({ type: 'open' } as Event)
    }

    emitMessage(data: string, type = 'message') {
        const event: MockEvent = {
            data,
            type,
            lastEventId: 'evt-1',
            origin: 'http://localhost',
        }

        if (type === 'message') {
            this.onmessage?.(event)
            return
        }

        this.listeners.get(type)?.forEach((listener) => listener(event))
    }

    emitError(readyState = 0) {
        this.readyState = readyState
        this.onerror?.({ type: 'error' } as Event)
    }
}

const originalEventSource = (window as Window & { EventSource?: unknown })
    .EventSource

let mockEventSourceInstance: MockEventSource | null

beforeEach(() => {
    mockEventSourceInstance = null

    Object.defineProperty(window, 'EventSource', {
        value: MockEventSource,
        configurable: true,
        writable: true,
    })
})

afterEach(() => {
    Object.defineProperty(window, 'EventSource', {
        value: originalEventSource,
        configurable: true,
        writable: true,
    })

    jest.clearAllMocks()
})

describe('useEventSource', () => {
    it('initialises idle when autoConnect is false', () => {
        const { result } = renderHook(() =>
            useEventSource('/stream', { autoConnect: false })
        )

        expect(result.current.isSupported).toBe(true)
        expect(result.current.readyState).toBe('CLOSED')
        expect(result.current.lastEvent).toBe(null)
        expect(result.current.getEventSource()).toBe(null)
    })

    it('connects automatically by default and reports open state', () => {
        const onOpen = jest.fn()
        const { result } = renderHook(() =>
            useEventSource('/stream', { onOpen, withCredentials: true })
        )

        expect(mockEventSourceInstance?.url).toBe('/stream')
        expect(mockEventSourceInstance?.withCredentials).toBe(true)
        expect(result.current.readyState).toBe('CONNECTING')

        act(() => {
            mockEventSourceInstance?.emitOpen()
        })

        expect(result.current.readyState).toBe('OPEN')
        expect(onOpen).toHaveBeenCalledTimes(1)
    })

    it('captures incoming messages and parses JSON payloads', () => {
        const onMessage = jest.fn()
        const { result } = renderHook(() =>
            useEventSource('/stream', { parseJson: true, onMessage })
        )

        act(() => {
            mockEventSourceInstance?.emitMessage('{"kind":"ping"}')
        })

        expect(result.current.lastEvent?.data).toBe('{"kind":"ping"}')
        expect(result.current.lastEventName).toBe('message')
        expect(result.current.lastParsedData).toEqual({ kind: 'ping' })
        expect(onMessage).toHaveBeenCalledWith(
            expect.objectContaining({ data: '{"kind":"ping"}' }),
            { kind: 'ping' }
        )
    })

    it('subscribes to named SSE events', () => {
        const onEvent = jest.fn()
        const { result } = renderHook(() =>
            useEventSource('/stream', {
                events: ['notification'],
                onEvent,
            })
        )

        act(() => {
            mockEventSourceInstance?.emitMessage('hello', 'notification')
        })

        expect(result.current.lastEventName).toBe('notification')
        expect(onEvent).toHaveBeenCalledWith(
            'notification',
            expect.objectContaining({ data: 'hello', type: 'notification' }),
            null
        )
    })

    it('disconnects manually and closes the current EventSource', () => {
        const { result } = renderHook(() => useEventSource('/stream'))

        act(() => {
            result.current.disconnect()
        })

        expect(mockEventSourceInstance?.close).toHaveBeenCalledTimes(1)
        expect(result.current.readyState).toBe('CLOSED')
        expect(result.current.getEventSource()).toBe(null)
    })

    it('reports unsupported browsers', () => {
        Object.defineProperty(window, 'EventSource', {
            value: undefined,
            configurable: true,
            writable: true,
        })

        const onError = jest.fn()
        const { result } = renderHook(() =>
            useEventSource('/stream', { autoConnect: false, onError })
        )

        act(() => {
            result.current.connect()
        })

        expect(result.current.isSupported).toBe(false)
        expect(result.current.error?.message).toBe(
            'EventSource is not supported by this browser'
        )
        expect(onError).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'EventSource is not supported by this browser',
            })
        )
    })

    it('stores connection errors and parsing errors', () => {
        const onError = jest.fn()
        const { result } = renderHook(() =>
            useEventSource('/stream', { parseJson: true, onError })
        )

        act(() => {
            mockEventSourceInstance?.emitError(0)
        })

        expect(result.current.readyState).toBe('CONNECTING')
        expect(result.current.error?.message).toBe(
            'EventSource connection error'
        )

        act(() => {
            mockEventSourceInstance?.emitMessage('not json')
        })

        expect(result.current.error?.message).toContain('not valid JSON')
        expect(onError).toHaveBeenCalled()
    })

    it('closes the EventSource on unmount', () => {
        const { unmount } = renderHook(() => useEventSource('/stream'))

        unmount()

        expect(mockEventSourceInstance?.close).toHaveBeenCalledTimes(1)
    })
})
