import { useCallback, useEffect, useState } from 'react'

export interface StorageOptions<T> {
    serialize?: (value: T) => string
    deserialize?: (value: string) => T
    migrationVersion?: number
    migrate?: (oldData: unknown) => T
    onError?: (error: Error) => void
}

function useStorage<T>(
    key: string,
    defaultValue: T,
    storageObject: Storage,
    options: StorageOptions<T> = {}
) {
    const {
        serialize = JSON.stringify,
        deserialize = JSON.parse,
        migrationVersion = 1,
        migrate,
        onError = console.error,
    } = options

    const [value, setValue] = useState<T>(() => {
        try {
            const item = storageObject.getItem(key)
            if (!item) return defaultValue

            const parsed = deserialize(item)
            const storedVersion = parsed?.__version

            if (migrate && storedVersion !== migrationVersion) {
                return migrate(parsed)
            }

            return parsed
        } catch (error) {
            onError(error as Error)
            return defaultValue
        }
    })

    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === key && e.storageArea === storageObject) {
                try {
                    const newValue = e.newValue
                        ? deserialize(e.newValue)
                        : defaultValue
                    setValue(newValue)
                } catch (error) {
                    onError(error as Error)
                }
            }
        }

        window.addEventListener('storage', handleStorage)
        return () => window.removeEventListener('storage', handleStorage)
    }, [key, storageObject, deserialize, defaultValue, onError])

    const updateValue = useCallback(
        (newValue: T | ((prev: T) => T)) => {
            try {
                setValue((prev) => {
                    const resolvedValue =
                        typeof newValue === 'function'
                            ? (newValue as (prev: T) => T)(prev)
                            : newValue

                    const valueToStore = {
                        ...resolvedValue,
                        __version: migrationVersion,
                    }

                    storageObject.setItem(key, serialize(valueToStore))
                    return resolvedValue
                })
            } catch (error) {
                onError(error as Error)
            }
        },
        [key, serialize, storageObject, migrationVersion, onError]
    )

    const remove = useCallback(() => {
        try {
            storageObject.removeItem(key)
            setValue(defaultValue)
        } catch (error) {
            onError(error as Error)
        }
    }, [key, storageObject, defaultValue, onError])

    return [value, updateValue, remove] as const
}

export const useLocalStorage = <T>(
    key: string,
    defaultValue: T,
    options?: StorageOptions<T>
) => {
    if (typeof window === 'undefined' || !window.localStorage) {
        throw new Error('localStorage is not available in this environment')
    }
    return useStorage(key, defaultValue, window.localStorage, options)
}

export const useSessionStorage = <T>(
    key: string,
    defaultValue: T,
    options?: StorageOptions<T>
) => {
    if (typeof window === 'undefined' || !window.sessionStorage) {
        throw new Error('sessionStorage is not available in this environment')
    }
    return useStorage(key, defaultValue, window.sessionStorage, options)
}

export default useLocalStorage
