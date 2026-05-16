import { renderHook, act } from '@testing-library/react'
import useNetwork from '../useNetwork'

// Mock navigator.onLine
const mockNavigatorOnline = (value: boolean) => {
    Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value,
    })
}

// Mock connection API
const mockConnection = (
    connection: Partial<{
        downlink: number
        effectiveType: 'slow-2g' | '2g' | '3g' | '4g'
        rtt: number
        saveData: boolean
        type: string
        addEventListener: jest.Mock
        removeEventListener: jest.Mock
    }> | null
) => {
    Object.defineProperty(navigator, 'connection', {
        writable: true,
        configurable: true,
        value: connection,
    })
}

describe('useNetwork', () => {
    let originalConnection: unknown

    beforeEach(() => {
        // Save original connection
        originalConnection = (navigator as any).connection
        mockNavigatorOnline(true)
    })

    afterEach(() => {
        // Restore original connection
        Object.defineProperty(navigator, 'connection', {
            writable: true,
            configurable: true,
            value: originalConnection,
        })
    })

    it('should return online status', () => {
        mockNavigatorOnline(true)
        const { result } = renderHook(() => useNetwork())

        expect(result.current.online).toBe(true)
    })

    it('should return offline status', () => {
        mockNavigatorOnline(false)
        const { result } = renderHook(() => useNetwork())

        expect(result.current.online).toBe(false)
    })

    it('should return connection information when available', () => {
        const mockConnectionObj = {
            downlink: 10,
            effectiveType: '4g' as const,
            rtt: 50,
            saveData: false,
            type: 'wifi' as const,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        }

        mockConnection(mockConnectionObj)

        const { result } = renderHook(() => useNetwork())

        expect(result.current.downlink).toBe(10)
        expect(result.current.effectiveType).toBe('4g')
        expect(result.current.rtt).toBe(50)
        expect(result.current.saveData).toBe(false)
        expect(result.current.type).toBe('wifi')
    })

    it('should handle missing connection API', () => {
        mockConnection(null)

        const { result } = renderHook(() => useNetwork())

        expect(result.current.online).toBe(true)
        expect(result.current.downlink).toBeUndefined()
        expect(result.current.effectiveType).toBeUndefined()
    })

    it('should update on online event', () => {
        mockNavigatorOnline(false)
        const { result } = renderHook(() => useNetwork())

        expect(result.current.online).toBe(false)

        act(() => {
            mockNavigatorOnline(true)
            window.dispatchEvent(new Event('online'))
        })

        expect(result.current.online).toBe(true)
    })

    it('should update on offline event', () => {
        mockNavigatorOnline(true)
        const { result } = renderHook(() => useNetwork())

        expect(result.current.online).toBe(true)

        act(() => {
            mockNavigatorOnline(false)
            window.dispatchEvent(new Event('offline'))
        })

        expect(result.current.online).toBe(false)
    })

    it('should include timestamp', () => {
        const { result } = renderHook(() => useNetwork())

        expect(result.current.since).toBeInstanceOf(Date)
    })

    it('should update timestamp on state changes', () => {
        mockNavigatorOnline(true)
        const { result } = renderHook(() => useNetwork())

        const firstTimestamp = result.current.since

        act(() => {
            mockNavigatorOnline(false)
            window.dispatchEvent(new Event('offline'))
        })

        expect(result.current.since).not.toBe(firstTimestamp)
    })

    it('should listen to connection change events', () => {
        const addEventListener = jest.fn()
        const removeEventListener = jest.fn()

        mockConnection({
            downlink: 5,
            effectiveType: '3g',
            addEventListener,
            removeEventListener,
        })

        const { unmount } = renderHook(() => useNetwork())

        expect(addEventListener).toHaveBeenCalledWith(
            'change',
            expect.any(Function)
        )

        unmount()

        expect(removeEventListener).toHaveBeenCalledWith(
            'change',
            expect.any(Function)
        )
    })

    it('should cleanup event listeners on unmount', () => {
        const addEventListener = jest.fn()
        const removeEventListener = jest.fn()

        window.addEventListener = addEventListener
        window.removeEventListener = removeEventListener

        const { unmount } = renderHook(() => useNetwork())

        unmount()

        expect(removeEventListener).toHaveBeenCalledWith(
            'online',
            expect.any(Function)
        )
        expect(removeEventListener).toHaveBeenCalledWith(
            'offline',
            expect.any(Function)
        )
    })

    it('should handle slow connection types', () => {
        mockConnection({
            effectiveType: 'slow-2g',
            downlink: 0.4,
            rtt: 2000,
            saveData: true,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        })

        const { result } = renderHook(() => useNetwork())

        expect(result.current.effectiveType).toBe('slow-2g')
        expect(result.current.downlink).toBe(0.4)
        expect(result.current.rtt).toBe(2000)
        expect(result.current.saveData).toBe(true)
    })

    it('should handle cellular connection type', () => {
        mockConnection({
            type: 'cellular',
            effectiveType: '3g',
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        })

        const { result } = renderHook(() => useNetwork())

        expect(result.current.type).toBe('cellular')
        expect(result.current.effectiveType).toBe('3g')
    })
})
