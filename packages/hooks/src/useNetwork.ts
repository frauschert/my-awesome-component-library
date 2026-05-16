import { useEffect, useState } from 'react'

export interface NetworkInformation extends EventTarget {
    downlink?: number
    downlinkMax?: number
    effectiveType?: 'slow-2g' | '2g' | '3g' | '4g'
    rtt?: number
    saveData?: boolean
    type?:
        | 'bluetooth'
        | 'cellular'
        | 'ethernet'
        | 'none'
        | 'wifi'
        | 'wimax'
        | 'other'
        | 'unknown'
    onchange?: ((this: NetworkInformation, ev: Event) => void) | null
}

export interface NetworkState {
    /**
     * Whether the browser is online
     */
    online: boolean
    /**
     * Effective bandwidth estimate in megabits per second
     */
    downlink?: number
    /**
     * Maximum downlink speed in megabits per second
     */
    downlinkMax?: number
    /**
     * Effective connection type ('slow-2g', '2g', '3g', '4g')
     */
    effectiveType?: 'slow-2g' | '2g' | '3g' | '4g'
    /**
     * Estimated round-trip time in milliseconds
     */
    rtt?: number
    /**
     * Whether the user has requested reduced data usage
     */
    saveData?: boolean
    /**
     * Type of connection ('wifi', 'cellular', 'ethernet', etc.)
     */
    type?:
        | 'bluetooth'
        | 'cellular'
        | 'ethernet'
        | 'none'
        | 'wifi'
        | 'wimax'
        | 'other'
        | 'unknown'
    /**
     * Timestamp of last update
     */
    since?: Date
}

const getConnection = (): NetworkInformation | undefined => {
    if (typeof navigator === 'undefined' || typeof window === 'undefined') {
        return undefined
    }

    const nav = navigator as Navigator & {
        connection?: NetworkInformation
        mozConnection?: NetworkInformation
        webkitConnection?: NetworkInformation
    }

    return nav.connection || nav.mozConnection || nav.webkitConnection
}

const getNetworkState = (): NetworkState => {
    const online = typeof navigator !== 'undefined' ? navigator.onLine : true
    const connection = getConnection()

    return {
        online,
        downlink: connection?.downlink,
        downlinkMax: connection?.downlinkMax,
        effectiveType: connection?.effectiveType,
        rtt: connection?.rtt,
        saveData: connection?.saveData,
        type: connection?.type,
        since: new Date(),
    }
}

/**
 * Hook that tracks the network connection state and provides information about
 * the user's network connection including online status, connection type, speed,
 * and data saver preferences.
 *
 * @returns NetworkState object with connection information
 *
 * @example
 * ```tsx
 * function App() {
 *   const network = useNetwork()
 *
 *   if (!network.online) {
 *     return <OfflineBanner />
 *   }
 *
 *   if (network.effectiveType === 'slow-2g' || network.effectiveType === '2g') {
 *     return <LowBandwidthMode />
 *   }
 *
 *   return <RegularApp />
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Respect user's data saver preference
 * function ImageGallery() {
 *   const { saveData, effectiveType } = useNetwork()
 *
 *   const imageQuality = saveData || effectiveType === 'slow-2g'
 *     ? 'low'
 *     : effectiveType === '4g'
 *     ? 'high'
 *     : 'medium'
 *
 *   return <Images quality={imageQuality} />
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Adaptive loading based on connection
 * function VideoPlayer() {
 *   const { downlink, rtt } = useNetwork()
 *
 *   const quality = useMemo(() => {
 *     if (!downlink || !rtt) return 'auto'
 *     if (downlink >= 5 && rtt < 100) return '1080p'
 *     if (downlink >= 2.5) return '720p'
 *     return '480p'
 *   }, [downlink, rtt])
 *
 *   return <Video quality={quality} />
 * }
 * ```
 */
export default function useNetwork(): NetworkState {
    const [state, setState] = useState<NetworkState>(getNetworkState)

    useEffect(() => {
        // Update on online/offline events
        const handleOnline = () => setState(getNetworkState())
        const handleOffline = () => setState(getNetworkState())

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        // Update on network information changes
        const connection = getConnection()
        const handleConnectionChange = () => setState(getNetworkState())

        if (connection) {
            connection.addEventListener('change', handleConnectionChange)
        }

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)

            if (connection) {
                connection.removeEventListener('change', handleConnectionChange)
            }
        }
    }, [])

    return state
}
