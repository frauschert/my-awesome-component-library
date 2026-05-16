import { useCallback, useEffect, useState } from 'react'

export interface UseIndexedDBOptions {
    database?: string
    store?: string
    version?: number
}

export interface UseIndexedDBReturn<T> {
    value: T | undefined
    loading: boolean
    error: Error | null
    set: (value: T) => Promise<void>
    get: () => Promise<T | undefined>
    remove: () => Promise<void>
    clear: () => Promise<void>
}

const DEFAULT_DB = 'app-storage'
const DEFAULT_STORE = 'keyval'
const DEFAULT_VERSION = 1

/**
 * Hook for managing IndexedDB storage with a simple key-value interface.
 * Provides async methods for get, set, remove, and clear operations.
 *
 * @param key - Storage key
 * @param options - Configuration options (database, store, version)
 * @returns Object with value, loading, error, and storage methods
 *
 * @example
 * ```tsx
 * const { value, loading, set } = useIndexedDB('user', { database: 'myApp' })
 *
 * await set({ name: 'John', age: 30 })
 * ```
 */
export default function useIndexedDB<T = unknown>(
    key: string,
    options: UseIndexedDBOptions = {}
): UseIndexedDBReturn<T> {
    const {
        database = DEFAULT_DB,
        store = DEFAULT_STORE,
        version = DEFAULT_VERSION,
    } = options

    const [value, setValue] = useState<T | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    // Open database connection
    const openDB = useCallback((): Promise<IDBDatabase> => {
        return new Promise((resolve, reject) => {
            if (typeof window === 'undefined' || !window.indexedDB) {
                reject(new Error('IndexedDB not supported'))
                return
            }

            const request = indexedDB.open(database, version)

            request.onerror = () => reject(request.error)
            request.onsuccess = () => resolve(request.result)

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result
                if (!db.objectStoreNames.contains(store)) {
                    db.createObjectStore(store)
                }
            }
        })
    }, [database, store, version])

    // Get value from IndexedDB
    const get = useCallback(async (): Promise<T | undefined> => {
        try {
            const db = await openDB()
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(store, 'readonly')
                const objectStore = transaction.objectStore(store)
                const request = objectStore.get(key)

                request.onerror = () => reject(request.error)
                request.onsuccess = () => resolve(request.result)

                transaction.oncomplete = () => db.close()
            })
        } catch (err) {
            setError(err as Error)
            throw err
        }
    }, [openDB, store, key])

    // Set value in IndexedDB
    const set = useCallback(
        async (newValue: T): Promise<void> => {
            try {
                setError(null)
                const db = await openDB()
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction(store, 'readwrite')
                    const objectStore = transaction.objectStore(store)
                    const request = objectStore.put(newValue, key)

                    request.onerror = () => reject(request.error)
                    request.onsuccess = () => {
                        setValue(newValue)
                        resolve()
                    }

                    transaction.oncomplete = () => db.close()
                })
            } catch (err) {
                const error = err as Error
                setError(error)
                throw error
            }
        },
        [openDB, store, key]
    )

    // Remove value from IndexedDB
    const remove = useCallback(async (): Promise<void> => {
        try {
            setError(null)
            const db = await openDB()
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(store, 'readwrite')
                const objectStore = transaction.objectStore(store)
                const request = objectStore.delete(key)

                request.onerror = () => reject(request.error)
                request.onsuccess = () => {
                    setValue(undefined)
                    resolve()
                }

                transaction.oncomplete = () => db.close()
            })
        } catch (err) {
            const error = err as Error
            setError(error)
            throw error
        }
    }, [openDB, store, key])

    // Clear all values from store
    const clear = useCallback(async (): Promise<void> => {
        try {
            setError(null)
            const db = await openDB()
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(store, 'readwrite')
                const objectStore = transaction.objectStore(store)
                const request = objectStore.clear()

                request.onerror = () => reject(request.error)
                request.onsuccess = () => {
                    setValue(undefined)
                    resolve()
                }

                transaction.oncomplete = () => db.close()
            })
        } catch (err) {
            const error = err as Error
            setError(error)
            throw error
        }
    }, [openDB, store])

    // Load initial value
    useEffect(() => {
        let mounted = true

        const loadValue = async () => {
            try {
                setLoading(true)
                setError(null)
                const storedValue = await get()
                if (mounted) {
                    setValue(storedValue)
                }
            } catch (err) {
                if (mounted) {
                    setError(err as Error)
                }
            } finally {
                if (mounted) {
                    setLoading(false)
                }
            }
        }

        loadValue()

        return () => {
            mounted = false
        }
    }, [get])

    return {
        value,
        loading,
        error,
        set,
        get,
        remove,
        clear,
    }
}
