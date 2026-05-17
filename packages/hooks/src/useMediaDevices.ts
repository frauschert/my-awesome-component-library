import { useCallback, useEffect, useRef, useState } from 'react'

export type MediaDeviceKind = 'audioinput' | 'audiooutput' | 'videoinput'

export interface MediaDeviceInfoData {
    deviceId: string
    groupId: string
    kind: MediaDeviceKind
    label: string
}

export interface UseMediaDevicesOptions {
    /**
     * Whether to enumerate devices immediately on mount.
     * @default true
     */
    immediate?: boolean
    /**
     * Called whenever the device list is refreshed successfully.
     */
    onChange?: (devices: MediaDeviceInfoData[]) => void
    /**
     * Called when device enumeration fails.
     */
    onError?: (error: Error) => void
}

export interface UseMediaDevicesReturn {
    /** All available media devices. */
    devices: MediaDeviceInfoData[]
    /** Available microphone inputs. */
    audioInputs: MediaDeviceInfoData[]
    /** Available speaker / output devices. */
    audioOutputs: MediaDeviceInfoData[]
    /** Available camera inputs. */
    videoInputs: MediaDeviceInfoData[]
    /** Whether device enumeration is in flight. */
    loading: boolean
    /** The last enumeration error, if any. */
    error: Error | null
    /** Whether `navigator.mediaDevices.enumerateDevices` is available. */
    isSupported: boolean
    /** Refresh the current device list on demand. */
    refresh: () => Promise<MediaDeviceInfoData[]>
}

interface MediaDeviceInfoInternal {
    deviceId: string
    groupId: string
    kind: MediaDeviceKind
    label: string
}

interface MediaDevicesInternal {
    enumerateDevices: () => Promise<MediaDeviceInfoInternal[]>
    addEventListener?: (event: 'devicechange', listener: () => void) => void
    removeEventListener?: (event: 'devicechange', listener: () => void) => void
    ondevicechange?: (() => void) | null
}

function getMediaDevices(): MediaDevicesInternal | null {
    if (typeof navigator === 'undefined') return null

    const nav = navigator as Navigator & {
        mediaDevices?: MediaDevicesInternal
    }

    return nav.mediaDevices ?? null
}

function mapDevices(devices: MediaDeviceInfoInternal[]): MediaDeviceInfoData[] {
    return devices.map((device) => ({
        deviceId: device.deviceId,
        groupId: device.groupId,
        kind: device.kind,
        label: device.label,
    }))
}

/**
 * Hook for enumerating the browser's available media input and output devices.
 * Automatically refreshes on `devicechange` and exposes grouped device lists.
 *
 * @param options - Enumeration behavior and lifecycle callbacks
 * @returns Media device lists and a manual refresh function
 *
 * @example
 * ```tsx
 * function DevicePicker() {
 *   const { audioInputs, videoInputs, refresh, loading } = useMediaDevices()
 *
 *   return (
 *     <div>
 *       <button onClick={() => void refresh()}>Refresh devices</button>
 *       {loading && <p>Scanning devices…</p>}
 *       <p>Mics: {audioInputs.length}</p>
 *       <p>Cameras: {videoInputs.length}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export default function useMediaDevices(
    options: UseMediaDevicesOptions = {}
): UseMediaDevicesReturn {
    const { immediate = true, onChange, onError } = options

    const mediaDevices = getMediaDevices()
    const isSupported =
        mediaDevices !== null &&
        typeof mediaDevices.enumerateDevices === 'function'

    const [devices, setDevices] = useState<MediaDeviceInfoData[]>([])
    const [loading, setLoading] = useState(immediate && isSupported)
    const [error, setError] = useState<Error | null>(null)

    const mountedRef = useRef(true)
    const requestIdRef = useRef(0)
    const onChangeRef = useRef(onChange)
    const onErrorRef = useRef(onError)

    useEffect(() => {
        onChangeRef.current = onChange
    }, [onChange])

    useEffect(() => {
        onErrorRef.current = onError
    }, [onError])

    const refresh = useCallback(async () => {
        const nextMediaDevices = getMediaDevices()

        if (!nextMediaDevices || !nextMediaDevices.enumerateDevices) {
            const unsupportedError = new Error(
                'MediaDevices.enumerateDevices is not supported by this browser'
            )

            if (mountedRef.current) {
                setError(unsupportedError)
                setLoading(false)
            }

            onErrorRef.current?.(unsupportedError)
            return []
        }

        const requestId = requestIdRef.current + 1
        requestIdRef.current = requestId

        if (mountedRef.current) {
            setLoading(true)
            setError(null)
        }

        try {
            const nextDevices = mapDevices(
                await nextMediaDevices.enumerateDevices()
            )

            if (!mountedRef.current || requestIdRef.current !== requestId) {
                return []
            }

            setDevices(nextDevices)
            setLoading(false)
            onChangeRef.current?.(nextDevices)
            return nextDevices
        } catch (err) {
            const resolvedError =
                err instanceof Error
                    ? err
                    : new Error('Failed to enumerate media devices')

            if (!mountedRef.current || requestIdRef.current !== requestId) {
                return []
            }

            setError(resolvedError)
            setLoading(false)
            onErrorRef.current?.(resolvedError)
            return []
        }
    }, [])

    useEffect(() => {
        if (!isSupported) {
            setLoading(false)
            return
        }

        if (immediate) {
            void refresh()
        }

        const nextMediaDevices = getMediaDevices()
        if (!nextMediaDevices) return

        const handleDeviceChange = () => {
            void refresh()
        }

        if (nextMediaDevices.addEventListener) {
            nextMediaDevices.addEventListener(
                'devicechange',
                handleDeviceChange
            )

            return () => {
                nextMediaDevices.removeEventListener?.(
                    'devicechange',
                    handleDeviceChange
                )
            }
        }

        const previousHandler = nextMediaDevices.ondevicechange
        nextMediaDevices.ondevicechange = handleDeviceChange

        return () => {
            nextMediaDevices.ondevicechange = previousHandler ?? null
        }
    }, [immediate, isSupported, refresh])

    useEffect(() => {
        return () => {
            mountedRef.current = false
            requestIdRef.current += 1
        }
    }, [])

    return {
        devices,
        audioInputs: devices.filter((device) => device.kind === 'audioinput'),
        audioOutputs: devices.filter((device) => device.kind === 'audiooutput'),
        videoInputs: devices.filter((device) => device.kind === 'videoinput'),
        loading,
        error,
        isSupported,
        refresh,
    }
}
