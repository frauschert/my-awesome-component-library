import React from 'react'

export default function debounce<T extends (...args: any[]) => ReturnType<T>>(
    callback: T,
    ms: number = 500
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
    let timer: ReturnType<typeof setTimeout> | undefined

    return (...args: Parameters<T>) => {
        if (timer) {
            clearTimeout(timer)
        }
        return new Promise<ReturnType<T>>((resolve) => {
            timer = setTimeout(() => {
                const returnValue = callback(...args)
                resolve(returnValue)
            }, ms)
        })
    }
}
