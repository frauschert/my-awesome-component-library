import { useEffect, useState, useCallback } from 'react'

/**
 * Standard permission names supported by the Permissions API.
 * Browser support varies per permission name.
 */
export type PermissionName =
    | 'geolocation'
    | 'notifications'
    | 'push'
    | 'midi'
    | 'camera'
    | 'microphone'
    | 'speaker-selection'
    | 'device-info'
    | 'background-fetch'
    | 'background-sync'
    | 'bluetooth'
    | 'persistent-storage'
    | 'ambient-light-sensor'
    | 'accelerometer'
    | 'gyroscope'
    | 'magnetometer'
    | 'clipboard-read'
    | 'clipboard-write'
    | 'payment-handler'
    | 'idle-detection'
    | 'periodic-background-sync'
    | 'screen-wake-lock'
    | 'nfc'
    | 'display-capture'
    | 'accessibility-events'
    | 'storage-access'
    | 'window-management'

/** The three possible states of a browser permission */
export type PermissionState = 'granted' | 'denied' | 'prompt'

/** Options for usePermission */
export interface UsePermissionOptions {
    /**
     * Called when permission state becomes 'granted'
     */
    onGranted?: () => void
    /**
     * Called when permission state becomes 'denied'
     */
    onDenied?: () => void
    /**
     * Called when permission state becomes 'prompt'
     */
    onPrompt?: () => void
    /**
     * Called whenever the permission state changes
     */
    onChange?: (state: PermissionState) => void
}

/** Return value of usePermission */
export interface UsePermissionReturn {
    /**
     * Current permission state, or null while loading / if unsupported
     */
    state: PermissionState | null
    /**
     * Whether the Permissions API is supported in this browser
     */
    isSupported: boolean
    /**
     * Whether the permission has been granted
     */
    isGranted: boolean
    /**
     * Whether the permission has been denied
     */
    isDenied: boolean
    /**
     * Whether the user will be prompted (state === 'prompt')
     */
    isPrompt: boolean
    /**
     * True while the initial query is in-flight
     */
    loading: boolean
    /**
     * Any error that occurred during the query
     */
    error: Error | null
    /**
     * Re-query the permission status on demand
     */
    query: () => Promise<void>
}

/**
 * Hook to query and observe browser permission state via the Permissions API.
 *
 * Automatically subscribes to state-change events and cleans up on unmount.
 *
 * @param permissionName - The name of the permission to query
 * @param options - Optional callbacks for state changes
 * @returns Current permission state and a manual re-query function
 *
 * @example
 * ```tsx
 * function CameraButton() {
 *   const { state, isGranted, query } = usePermission('camera', {
 *     onGranted: () => console.log('Camera access granted'),
 *     onDenied: () => console.log('Camera access denied'),
 *   })
 *
 *   return (
 *     <div>
 *       <p>Camera: {state ?? 'checking…'}</p>
 *       {!isGranted && <button onClick={query}>Request Camera</button>}
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Track multiple permissions
 * function PermissionsPanel() {
 *   const camera = usePermission('camera')
 *   const mic = usePermission('microphone')
 *   const location = usePermission('geolocation')
 *
 *   return (
 *     <ul>
 *       <li>Camera: {camera.state}</li>
 *       <li>Microphone: {mic.state}</li>
 *       <li>Location: {location.state}</li>
 *     </ul>
 *   )
 * }
 * ```
 */
export function usePermission(
    permissionName: PermissionName,
    options: UsePermissionOptions = {}
): UsePermissionReturn {
    const { onGranted, onDenied, onPrompt, onChange } = options

    const isSupported =
        typeof navigator !== 'undefined' &&
        'permissions' in navigator &&
        typeof navigator.permissions?.query === 'function'

    const [state, setState] = useState<PermissionState | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const handleStateChange = useCallback(
        (newState: PermissionState) => {
            setState(newState)
            onChange?.(newState)
            if (newState === 'granted') onGranted?.()
            else if (newState === 'denied') onDenied?.()
            else if (newState === 'prompt') onPrompt?.()
        },
        [onChange, onGranted, onDenied, onPrompt]
    )

    useEffect(() => {
        if (!isSupported) {
            setLoading(false)
            return
        }

        let status: PermissionStatus | null = null
        let listener: (() => void) | null = null

        const run = async () => {
            setLoading(true)
            setError(null)

            try {
                status = await navigator.permissions.query({
                    name: permissionName as PermissionDescriptor['name'],
                })

                handleStateChange(status.state as PermissionState)

                listener = () => {
                    if (status) {
                        handleStateChange(status.state as PermissionState)
                    }
                }

                status.addEventListener('change', listener)
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error(
                              `Failed to query permission: ${permissionName}`
                          )
                )
            } finally {
                setLoading(false)
            }
        }

        run()

        return () => {
            if (status && listener) {
                status.removeEventListener('change', listener)
            }
        }
    }, [isSupported, permissionName, handleStateChange])

    const query = useCallback(async () => {
        if (!isSupported) return

        setLoading(true)
        setError(null)

        try {
            const status = await navigator.permissions.query({
                name: permissionName as PermissionDescriptor['name'],
            })
            handleStateChange(status.state as PermissionState)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err
                    : new Error(
                          `Failed to query permission: ${permissionName}`
                      )
            )
        } finally {
            setLoading(false)
        }
    }, [isSupported, permissionName, handleStateChange])

    return {
        state,
        isSupported,
        isGranted: state === 'granted',
        isDenied: state === 'denied',
        isPrompt: state === 'prompt',
        loading,
        error,
        query,
    }
}

export default usePermission
