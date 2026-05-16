import { useEffect, useState, useCallback, useMemo } from 'react'

/**
 * Geolocation coordinates
 */
export interface GeolocationCoordinates {
    /** Latitude in decimal degrees */
    latitude: number
    /** Longitude in decimal degrees */
    longitude: number
    /** Accuracy of position in meters */
    accuracy: number
    /** Altitude in meters (null if not available) */
    altitude: number | null
    /** Accuracy of altitude in meters (null if not available) */
    altitudeAccuracy: number | null
    /** Direction of travel in degrees (null if stationary) */
    heading: number | null
    /** Speed in meters per second (null if stationary) */
    speed: number | null
}

/**
 * Geolocation position with timestamp
 */
export interface GeolocationPosition {
    /** Position coordinates */
    coords: GeolocationCoordinates
    /** Timestamp when position was acquired */
    timestamp: number
}

/**
 * Geolocation error
 */
export interface GeolocationError {
    /** Error code (1: PERMISSION_DENIED, 2: POSITION_UNAVAILABLE, 3: TIMEOUT) */
    code: number
    /** Error message */
    message: string
}

/**
 * Options for useGeolocation hook
 */
export interface UseGeolocationOptions extends PositionOptions {
    /**
     * Whether to start watching position immediately
     * @default false
     */
    immediate?: boolean
    /**
     * Callback when position is successfully retrieved
     */
    onSuccess?: (position: GeolocationPosition) => void
    /**
     * Callback when an error occurs
     */
    onError?: (error: GeolocationError) => void
}

/**
 * Return type for useGeolocation hook
 */
export interface UseGeolocationReturn {
    /** Current position (null if not yet retrieved) */
    position: GeolocationPosition | null
    /** Error if geolocation failed */
    error: GeolocationError | null
    /** Whether geolocation is currently being retrieved */
    loading: boolean
    /** Whether Geolocation API is supported */
    isSupported: boolean
    /** Request current position once */
    getPosition: () => void
    /** Start watching position (continuous updates) */
    startWatching: () => void
    /** Stop watching position */
    stopWatching: () => void
}

/**
 * Hook for accessing device geolocation using the Geolocation API.
 * Provides both one-time position requests and continuous position watching.
 *
 * @param options - Configuration options
 * @returns Geolocation state and control functions
 *
 * @example
 * ```tsx
 * function LocationTracker() {
 *   const { position, loading, error, getPosition } = useGeolocation()
 *
 *   return (
 *     <div>
 *       <button onClick={getPosition}>Get Location</button>
 *       {loading && <p>Loading...</p>}
 *       {error && <p>Error: {error.message}</p>}
 *       {position && (
 *         <p>
 *           Lat: {position.coords.latitude},
 *           Lng: {position.coords.longitude}
 *         </p>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Watch position with high accuracy
 * const { position, startWatching, stopWatching } = useGeolocation({
 *   enableHighAccuracy: true,
 *   timeout: 10000,
 *   maximumAge: 0
 * })
 * ```
 *
 * @example
 * ```tsx
 * // Start immediately on mount
 * const { position } = useGeolocation({
 *   immediate: true,
 *   onSuccess: (pos) => console.log('Got location:', pos),
 *   onError: (err) => console.error('Location error:', err)
 * })
 * ```
 */
export function useGeolocation(
    options: UseGeolocationOptions = {}
): UseGeolocationReturn {
    const {
        immediate = false,
        onSuccess,
        onError,
        enableHighAccuracy,
        timeout,
        maximumAge,
    } = options

    const [position, setPosition] = useState<GeolocationPosition | null>(null)
    const [error, setError] = useState<GeolocationError | null>(null)
    const [loading, setLoading] = useState(false)
    const [watchId, setWatchId] = useState<number | null>(null)

    // Check if Geolocation API is supported
    const isSupported =
        typeof window !== 'undefined' &&
        typeof window.navigator !== 'undefined' &&
        'geolocation' in window.navigator

    // Position options for API calls
    const positionOptions: PositionOptions = useMemo(() => {
        return {
            enableHighAccuracy,
            timeout,
            maximumAge,
        }
    }, [enableHighAccuracy, timeout, maximumAge])

    // Success handler
    const handleSuccess = useCallback(
        (pos: GeolocationPosition) => {
            const geoPosition: GeolocationPosition = {
                coords: {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    accuracy: pos.coords.accuracy,
                    altitude: pos.coords.altitude,
                    altitudeAccuracy: pos.coords.altitudeAccuracy,
                    heading: pos.coords.heading,
                    speed: pos.coords.speed,
                },
                timestamp: pos.timestamp,
            }

            setPosition(geoPosition)
            setError(null)
            setLoading(false)
            onSuccess?.(geoPosition)
        },
        [onSuccess]
    )

    // Error handler
    const handleError = useCallback(
        (err: GeolocationPositionError) => {
            const geoError: GeolocationError = {
                code: err.code,
                message: err.message,
            }

            setError(geoError)
            setLoading(false)
            onError?.(geoError)
        },
        [onError]
    )

    // Get current position once
    const getPosition = useCallback(() => {
        if (!isSupported) {
            const notSupportedError: GeolocationError = {
                code: 0,
                message: 'Geolocation is not supported by this browser',
            }
            setError(notSupportedError)
            onError?.(notSupportedError)
            return
        }

        setLoading(true)
        setError(null)

        window.navigator.geolocation.getCurrentPosition(
            handleSuccess,
            handleError,
            positionOptions
        )
    }, [isSupported, handleSuccess, handleError, positionOptions, onError])

    // Start watching position
    const startWatching = useCallback(() => {
        if (!isSupported) {
            const notSupportedError: GeolocationError = {
                code: 0,
                message: 'Geolocation is not supported by this browser',
            }
            setError(notSupportedError)
            onError?.(notSupportedError)
            return
        }

        // Stop existing watch if any
        if (watchId !== null) {
            window.navigator.geolocation.clearWatch(watchId)
        }

        setLoading(true)
        setError(null)

        const id = window.navigator.geolocation.watchPosition(
            handleSuccess,
            handleError,
            positionOptions
        )

        setWatchId(id)
    }, [
        isSupported,
        watchId,
        handleSuccess,
        handleError,
        positionOptions,
        onError,
    ])

    // Stop watching position
    const stopWatching = useCallback(() => {
        if (watchId !== null && isSupported) {
            window.navigator.geolocation.clearWatch(watchId)
            setWatchId(null)
            setLoading(false)
        }
    }, [watchId, isSupported])

    // Handle immediate option
    useEffect(() => {
        if (immediate) {
            getPosition()
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopWatching()
        }
    }, [stopWatching])

    return {
        position,
        error,
        loading,
        isSupported,
        getPosition,
        startWatching,
        stopWatching,
    }
}

export default useGeolocation
