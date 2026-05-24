import { useCallback, useEffect, useRef, useState } from 'react'

export interface StorageEventData<T = string> {
    /** The storage key that changed, or null when `clear()` was called. */
    key: string | null
    /** Parsed previous value, or null when none existed. */
    oldValue: T | null
    /** Parsed next value, or null when the key was removed. */
    newValue: T | null
    /** Raw previous string value from the browser event. */
    oldRawValue: string | null
    /** Raw next string value from the browser event. */
    newRawValue: string | null
    /** The Storage object that changed, when provided by the browser. */
    storageArea: Storage | null
    /** The document URL associated with the storage change event. */
    url: string
}

export interface UseStorageEventOptions<T = string> {
    /**
     * Optional key filter. When omitted, all storage keys are observed.
     */
    key?: string | null
    /**
     * Optional storage area filter, such as `window.localStorage`.
     */
    storageArea?: Storage | null
    /**
     * Deserialize raw storage strings before exposing them.
     * @default (value) => value as T
     */
    deserialize?: (value: string) => T
    /**
     * Called whenever a matching storage event is received.
     */
    onChange?: (event: StorageEventData<T>) => void
    /**
     * Called when deserialization fails.
     */
    onError?: (error: Error) => void
}

export interface UseStorageEventReturn<T = string> {
    /** Latest matching storage event, or null before the first event. */
    event: StorageEventData<T> | null
    /** Latest matching storage key. */
    key: string | null
    /** Parsed previous value from the latest event. */
    oldValue: T | null
    /** Parsed next value from the latest event. */
    newValue: T | null
    /** Storage area from the latest event. */
    storageArea: Storage | null
    /** URL from the latest event. */
    url: string
    /** Last storage-event-related error, if any. */
    error: Error | null
    /** Whether `window.addEventListener('storage', ...)` is available. */
    isSupported: boolean
    /** Clear the stored event state. */
    reset: () => void
}

function defaultDeserialize<T>(value: string): T {
    return value as unknown as T
}

/**
 * Hook for listening to cross-document `storage` events.
 *
 * Supports filtering by key or storage area and optional deserialization of
 * the raw string values emitted by the Storage API.
 *
 * @param options - Storage-event filters and callbacks
 * @returns Latest matching storage event and helpers
 *
 * @example
 * ```tsx
 * function ThemeSync() {
 *   const { newValue } = useStorageEvent({
 *     key: 'theme',
 *     storageArea: window.localStorage,
 *   })
 *
 *   return <span>{newValue ?? 'light'}</span>
 * }
 * ```
 */
export default function useStorageEvent<T = string>(
    options: UseStorageEventOptions<T> = {}
): UseStorageEventReturn<T> {
    const { key, storageArea, deserialize, onChange, onError } = options

    const isSupported =
        typeof window !== 'undefined' &&
        typeof window.addEventListener === 'function'

    const [event, setEvent] = useState<StorageEventData<T> | null>(null)
    const [error, setError] = useState<Error | null>(null)

    const deserializeRef = useRef(deserialize ?? defaultDeserialize<T>)
    const onChangeRef = useRef(onChange)
    const onErrorRef = useRef(onError)

    useEffect(() => {
        deserializeRef.current = deserialize ?? defaultDeserialize<T>
    }, [deserialize])

    useEffect(() => {
        onChangeRef.current = onChange
    }, [onChange])

    useEffect(() => {
        onErrorRef.current = onError
    }, [onError])

    const reset = useCallback(() => {
        setEvent(null)
        setError(null)
    }, [])

    useEffect(() => {
        if (!isSupported) {
            return
        }

        const handleStorage = (storageEvent: StorageEvent) => {
            if (typeof key !== 'undefined' && storageEvent.key !== key) {
                return
            }

            if (
                typeof storageArea !== 'undefined' &&
                storageEvent.storageArea !== storageArea
            ) {
                return
            }

            try {
                const nextEvent: StorageEventData<T> = {
                    key: storageEvent.key,
                    oldValue:
                        storageEvent.oldValue !== null
                            ? deserializeRef.current(storageEvent.oldValue)
                            : null,
                    newValue:
                        storageEvent.newValue !== null
                            ? deserializeRef.current(storageEvent.newValue)
                            : null,
                    oldRawValue: storageEvent.oldValue,
                    newRawValue: storageEvent.newValue,
                    storageArea: storageEvent.storageArea,
                    url: storageEvent.url,
                }

                setError(null)
                setEvent(nextEvent)
                onChangeRef.current?.(nextEvent)
            } catch (err) {
                const storageError =
                    err instanceof Error
                        ? err
                        : new Error('Failed to deserialize storage event')

                setError(storageError)
                onErrorRef.current?.(storageError)
            }
        }

        window.addEventListener('storage', handleStorage)

        return () => {
            window.removeEventListener('storage', handleStorage)
        }
    }, [isSupported, key, storageArea])

    return {
        event,
        key: event?.key ?? null,
        oldValue: event?.oldValue ?? null,
        newValue: event?.newValue ?? null,
        storageArea: event?.storageArea ?? null,
        url: event?.url ?? '',
        error,
        isSupported,
        reset,
    }
}
