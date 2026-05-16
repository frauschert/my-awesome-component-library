import { useState, useEffect } from 'react'

export interface BatteryState {
    /**
     * Whether the device is currently charging
     */
    charging: boolean
    /**
     * Time in seconds until the battery is fully charged (0 if not charging or unknown)
     */
    chargingTime: number
    /**
     * Time in seconds until the battery is fully discharged (Infinity if charging or unknown)
     */
    dischargingTime: number
    /**
     * Battery level between 0 and 1 (0% to 100%)
     */
    level: number
}

export interface UseBatteryReturn extends BatteryState {
    /**
     * Whether the Battery Status API is supported
     */
    isSupported: boolean
    /**
     * Whether battery information is currently being fetched
     */
    loading: boolean
    /**
     * Error that occurred while fetching battery information
     */
    error: Error | null
}

// Extend Navigator interface for Battery API
interface BatteryManager extends EventTarget {
    charging: boolean
    chargingTime: number
    dischargingTime: number
    level: number
    addEventListener(
        type:
            | 'chargingchange'
            | 'chargingtimechange'
            | 'dischargingtimechange'
            | 'levelchange',
        listener: () => void
    ): void
    removeEventListener(
        type:
            | 'chargingchange'
            | 'chargingtimechange'
            | 'dischargingtimechange'
            | 'levelchange',
        listener: () => void
    ): void
}

interface NavigatorWithBattery extends Navigator {
    getBattery?: () => Promise<BatteryManager>
}

/**
 * Hook for tracking device battery status using the Battery Status API
 *
 * Provides real-time information about battery level, charging state, and time estimates.
 * Useful for power-aware applications that want to adjust behavior based on battery status.
 *
 * @returns Battery state and metadata
 *
 * @example
 * ```tsx
 * const { level, charging, isSupported } = useBattery()
 *
 * if (!isSupported) {
 *   return <div>Battery API not supported</div>
 * }
 *
 * return (
 *   <div>
 *     <div>Battery Level: {Math.round(level * 100)}%</div>
 *     <div>Status: {charging ? 'Charging' : 'Discharging'}</div>
 *   </div>
 * )
 * ```
 *
 * @example
 * ```tsx
 * // Power-saving mode
 * const { level, charging } = useBattery()
 * const lowBattery = level < 0.2 && !charging
 *
 * return (
 *   <div>
 *     {lowBattery && (
 *       <Banner>Low battery mode - reduced animations</Banner>
 *     )}
 *     <VideoPlayer reducedQuality={lowBattery} />
 *   </div>
 * )
 * ```
 */
const useBattery = (): UseBatteryReturn => {
    const [state, setState] = useState<BatteryState>({
        charging: false,
        chargingTime: 0,
        dischargingTime: Infinity,
        level: 1,
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const isSupported =
        typeof window !== 'undefined' &&
        typeof window.navigator !== 'undefined' &&
        'getBattery' in window.navigator &&
        typeof (window.navigator as NavigatorWithBattery).getBattery ===
            'function'

    useEffect(() => {
        if (!isSupported) {
            setLoading(false)
            return
        }

        let battery: BatteryManager | null = null

        const updateBatteryState = (batteryManager: BatteryManager) => {
            setState({
                charging: batteryManager.charging,
                chargingTime: batteryManager.chargingTime,
                dischargingTime: batteryManager.dischargingTime,
                level: batteryManager.level,
            })
        }

        const handleChargingChange = () => {
            if (battery) {
                updateBatteryState(battery)
            }
        }

        const handleChargingTimeChange = () => {
            if (battery) {
                updateBatteryState(battery)
            }
        }

        const handleDischargingTimeChange = () => {
            if (battery) {
                updateBatteryState(battery)
            }
        }

        const handleLevelChange = () => {
            if (battery) {
                updateBatteryState(battery)
            }
        }

        const initBattery = async () => {
            try {
                const nav = window.navigator as NavigatorWithBattery
                const getBattery = nav.getBattery
                if (getBattery) {
                    battery = await getBattery.call(nav)

                    // Set initial state
                    updateBatteryState(battery)
                    setLoading(false)

                    // Add event listeners
                    battery.addEventListener(
                        'chargingchange',
                        handleChargingChange
                    )
                    battery.addEventListener(
                        'chargingtimechange',
                        handleChargingTimeChange
                    )
                    battery.addEventListener(
                        'dischargingtimechange',
                        handleDischargingTimeChange
                    )
                    battery.addEventListener('levelchange', handleLevelChange)
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error('Failed to get battery info')
                )
                setLoading(false)
            }
        }

        initBattery()

        return () => {
            if (battery) {
                battery.removeEventListener(
                    'chargingchange',
                    handleChargingChange
                )
                battery.removeEventListener(
                    'chargingtimechange',
                    handleChargingTimeChange
                )
                battery.removeEventListener(
                    'dischargingtimechange',
                    handleDischargingTimeChange
                )
                battery.removeEventListener('levelchange', handleLevelChange)
            }
        }
    }, [isSupported])

    return {
        ...state,
        isSupported,
        loading,
        error,
    }
}

export default useBattery
