import { renderHook, act, waitFor } from '@testing-library/react'
import useBattery from '../useBattery'

// Mock BatteryManager
class MockBatteryManager extends EventTarget {
    charging: boolean = false
    chargingTime: number = 0
    dischargingTime: number = Infinity
    level: number = 1

    constructor(initial?: Partial<MockBatteryManager>) {
        super()
        if (initial) {
            Object.assign(this, initial)
        }
    }

    // Helper to simulate changes
    simulateChargingChange(charging: boolean) {
        this.charging = charging
        this.dispatchEvent(new Event('chargingchange'))
    }

    simulateLevelChange(level: number) {
        this.level = level
        this.dispatchEvent(new Event('levelchange'))
    }

    simulateChargingTimeChange(time: number) {
        this.chargingTime = time
        this.dispatchEvent(new Event('chargingtimechange'))
    }

    simulateDischargingTimeChange(time: number) {
        this.dischargingTime = time
        this.dispatchEvent(new Event('dischargingtimechange'))
    }
}

describe('useBattery', () => {
    let mockBattery: MockBatteryManager
    let originalNavigator: Navigator

    beforeEach(() => {
        originalNavigator = global.navigator
        mockBattery = new MockBatteryManager()

        // Mock navigator.getBattery
        Object.defineProperty(global, 'navigator', {
            writable: true,
            configurable: true,
            value: {
                ...originalNavigator,
                getBattery: jest.fn().mockResolvedValue(mockBattery),
            },
        })
    })

    afterEach(() => {
        Object.defineProperty(global, 'navigator', {
            writable: true,
            configurable: true,
            value: originalNavigator,
        })
    })

    test('returns default state when loading', () => {
        const { result } = renderHook(() => useBattery())

        expect(result.current.loading).toBe(true)
        expect(result.current.isSupported).toBe(true)
        expect(result.current.error).toBe(null)
    })

    test('loads initial battery state', async () => {
        mockBattery.level = 0.75
        mockBattery.charging = true
        mockBattery.chargingTime = 3600

        const { result } = renderHook(() => useBattery())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.level).toBe(0.75)
        expect(result.current.charging).toBe(true)
        expect(result.current.chargingTime).toBe(3600)
        expect(result.current.dischargingTime).toBe(Infinity)
    })

    test('detects when charging state changes', async () => {
        const { result } = renderHook(() => useBattery())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.charging).toBe(false)

        act(() => {
            mockBattery.simulateChargingChange(true)
        })

        expect(result.current.charging).toBe(true)
    })

    test('detects when battery level changes', async () => {
        mockBattery.level = 1

        const { result } = renderHook(() => useBattery())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.level).toBe(1)

        act(() => {
            mockBattery.simulateLevelChange(0.5)
        })

        expect(result.current.level).toBe(0.5)

        act(() => {
            mockBattery.simulateLevelChange(0.2)
        })

        expect(result.current.level).toBe(0.2)
    })

    test('detects when charging time changes', async () => {
        const { result } = renderHook(() => useBattery())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.chargingTime).toBe(0)

        act(() => {
            mockBattery.simulateChargingTimeChange(1800)
        })

        expect(result.current.chargingTime).toBe(1800)
    })

    test('detects when discharging time changes', async () => {
        const { result } = renderHook(() => useBattery())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.dischargingTime).toBe(Infinity)

        act(() => {
            mockBattery.simulateDischargingTimeChange(7200)
        })

        expect(result.current.dischargingTime).toBe(7200)
    })

    test('handles multiple state changes', async () => {
        const { result } = renderHook(() => useBattery())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        act(() => {
            mockBattery.simulateLevelChange(0.8)
            mockBattery.simulateChargingChange(true)
            mockBattery.simulateChargingTimeChange(600)
        })

        expect(result.current.level).toBe(0.8)
        expect(result.current.charging).toBe(true)
        expect(result.current.chargingTime).toBe(600)
    })

    test('cleans up event listeners on unmount', async () => {
        const removeEventListenerSpy = jest.spyOn(
            mockBattery,
            'removeEventListener'
        )

        const { result, unmount } = renderHook(() => useBattery())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        unmount()

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'chargingchange',
            expect.any(Function)
        )
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'chargingtimechange',
            expect.any(Function)
        )
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'dischargingtimechange',
            expect.any(Function)
        )
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'levelchange',
            expect.any(Function)
        )
    })

    test('handles getBattery error', async () => {
        const error = new Error('Battery API not available')
        Object.defineProperty(global, 'navigator', {
            writable: true,
            configurable: true,
            value: {
                ...originalNavigator,
                getBattery: jest.fn().mockRejectedValue(error),
            },
        })

        const { result } = renderHook(() => useBattery())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.error).toBe(error)
    })

    test('returns isSupported false when API not available', () => {
        Object.defineProperty(global, 'navigator', {
            writable: true,
            configurable: true,
            value: {
                ...originalNavigator,
                getBattery: undefined,
            },
        })

        const { result } = renderHook(() => useBattery())

        expect(result.current.isSupported).toBe(false)
        expect(result.current.loading).toBe(false)
    })

    test('handles SSR environment', () => {
        const originalNav = global.navigator
        // @ts-expect-error - Testing SSR
        delete global.navigator

        const { result } = renderHook(() => useBattery())

        expect(result.current.isSupported).toBe(false)
        expect(result.current.loading).toBe(false)
        expect(result.current.level).toBe(1)
        expect(result.current.charging).toBe(false)

        global.navigator = originalNav
    })

    test('maintains state consistency across multiple changes', async () => {
        const { result } = renderHook(() => useBattery())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        // Simulate battery draining scenario
        act(() => {
            mockBattery.simulateChargingChange(false)
            mockBattery.simulateLevelChange(1.0)
        })

        expect(result.current.charging).toBe(false)
        expect(result.current.level).toBe(1.0)

        act(() => {
            mockBattery.simulateLevelChange(0.8)
        })

        expect(result.current.level).toBe(0.8)

        act(() => {
            mockBattery.simulateLevelChange(0.5)
        })

        expect(result.current.level).toBe(0.5)

        // Start charging
        act(() => {
            mockBattery.simulateChargingChange(true)
            mockBattery.simulateChargingTimeChange(3600)
        })

        expect(result.current.charging).toBe(true)
        expect(result.current.chargingTime).toBe(3600)
    })

    test('handles non-Error exceptions', async () => {
        Object.defineProperty(global, 'navigator', {
            writable: true,
            configurable: true,
            value: {
                ...originalNavigator,
                getBattery: jest.fn().mockRejectedValue('string error'),
            },
        })

        const { result } = renderHook(() => useBattery())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.error).toBeInstanceOf(Error)
        expect(result.current.error?.message).toBe('Failed to get battery info')
    })
})
