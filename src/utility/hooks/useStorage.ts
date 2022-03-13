import { useCallback, useEffect, useState } from 'react'

function useStorage<T>(key: string, defaultValue: T, storageObject: Storage) {
    const [value, setValue] = useState<T | undefined>(() => {
        try {
            const item = storageObject.getItem(key)

            return item ? JSON.parse(item) : defaultValue
        } catch (error) {
            console.log(error)
            return defaultValue
        }
    })

    useEffect(() => {
        if (value === undefined) return storageObject.removeItem(key)

        storageObject.setItem(key, JSON.stringify(value))
    }, [key, value, storageObject])

    const remove = useCallback(() => {
        setValue(undefined)
    }, [])

    return [value, setValue, remove] as const
}

export const useLocalStorage = <T>(key: string, defaultValue: T) =>
    useStorage(key, defaultValue, localStorage)

export const useSessionStorage = <T>(key: string, defaultValue: T) =>
    useStorage(key, defaultValue, sessionStorage)

export default useLocalStorage
