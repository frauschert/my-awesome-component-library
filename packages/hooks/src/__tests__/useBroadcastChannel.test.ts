import { act, renderHook } from '@testing-library/react'
import useBroadcastChannel from '../useBroadcastChannel'

class MockBroadcastChannel {
    name: string
    onmessage:
        | ((event: {
              data: unknown
              origin?: string
              lastEventId?: string
          }) => void)
        | null = null
    onmessageerror: ((event: Event) => void) | null = null
    postMessage = jest.fn((message: unknown) => {
        if (this.throwOnPost) {
            throw new Error('post failed')
        }

        return message
    })
    close = jest.fn()
    throwOnPost = false

    constructor(name: string) {
        this.name = name
        mockChannels.push(this)
    }

    emitMessage(
        data: unknown,
        origin = 'https://example.com',
        lastEventId = ''
    ) {
        this.onmessage?.({ data, origin, lastEventId })
    }

    emitMessageError() {
        this.onmessageerror?.(new Event('messageerror'))
    }
}

const originalBroadcastChannel = Object.getOwnPropertyDescriptor(
    window,
    'BroadcastChannel'
)

let mockChannels: MockBroadcastChannel[]

beforeEach(() => {
    mockChannels = []

    Object.defineProperty(window, 'BroadcastChannel', {
        value: MockBroadcastChannel,
        configurable: true,
        writable: true,
    })
})

afterEach(() => {
    if (originalBroadcastChannel) {
        Object.defineProperty(
            window,
            'BroadcastChannel',
            originalBroadcastChannel
        )
    } else {
        delete (window as Window & { BroadcastChannel?: unknown })
            .BroadcastChannel
    }

    jest.clearAllMocks()
})

describe('useBroadcastChannel', () => {
    it('connects automatically by default', () => {
        const { result } = renderHook(() => useBroadcastChannel('theme'))

        expect(result.current.isSupported).toBe(true)
        expect(result.current.isConnected).toBe(true)
        expect(result.current.error).toBe(null)
        expect(mockChannels).toHaveLength(1)
        expect(mockChannels[0].name).toBe('theme')
    })

    it('receives messages and calls onMessage', () => {
        const onMessage = jest.fn()
        const { result } = renderHook(() =>
            useBroadcastChannel<{ mode: string }>('theme', { onMessage })
        )

        act(() => {
            mockChannels[0].emitMessage(
                { mode: 'dark' },
                'https://example.com/app'
            )
        })

        expect(result.current.lastMessage).toEqual({
            data: { mode: 'dark' },
            origin: 'https://example.com/app',
            lastEventId: '',
        })
        expect(onMessage).toHaveBeenCalledWith({
            data: { mode: 'dark' },
            origin: 'https://example.com/app',
            lastEventId: '',
        })
    })

    it('supports manual connect and disconnect when autoConnect is false', () => {
        const { result } = renderHook(() =>
            useBroadcastChannel('theme', { autoConnect: false })
        )

        expect(result.current.isConnected).toBe(false)
        expect(mockChannels).toHaveLength(0)

        act(() => {
            result.current.connect()
        })

        expect(result.current.isConnected).toBe(true)
        expect(mockChannels).toHaveLength(1)

        act(() => {
            result.current.disconnect()
        })

        expect(result.current.isConnected).toBe(false)
        expect(mockChannels[0].close).toHaveBeenCalledTimes(1)
    })

    it('posts messages through the active channel', () => {
        const payload = { type: 'ping' }
        const { result } = renderHook(() =>
            useBroadcastChannel<{ type: string }>('theme')
        )

        act(() => {
            result.current.postMessage(payload)
        })

        expect(mockChannels[0].postMessage).toHaveBeenCalledWith(payload)
        expect(result.current.getBroadcastChannel()).toBe(mockChannels[0])
    })

    it('surfaces message and post errors', () => {
        const onError = jest.fn()
        const { result } = renderHook(() =>
            useBroadcastChannel('theme', { onError })
        )

        act(() => {
            mockChannels[0].emitMessageError()
        })

        expect(result.current.error?.message).toBe(
            'BroadcastChannel message error'
        )

        act(() => {
            mockChannels[0].throwOnPost = true
            result.current.postMessage('hello')
        })

        expect(result.current.error?.message).toBe('post failed')
        expect(onError).toHaveBeenCalledWith(
            expect.any(Error),
            expect.any(Event)
        )
        expect(onError).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'post failed' })
        )
    })

    it('reports unsupported browsers', () => {
        Object.defineProperty(window, 'BroadcastChannel', {
            value: undefined,
            configurable: true,
            writable: true,
        })

        const onError = jest.fn()
        const { result } = renderHook(() =>
            useBroadcastChannel('theme', { onError })
        )

        expect(result.current.isSupported).toBe(false)
        expect(result.current.isConnected).toBe(false)
        expect(result.current.error?.message).toBe(
            'BroadcastChannel is not supported by this browser'
        )
        expect(onError).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'BroadcastChannel is not supported by this browser',
            })
        )
    })
})
