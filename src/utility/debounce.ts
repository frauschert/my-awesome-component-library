export default function debounce<
    T extends (...args: unknown[]) => ReturnType<T>
>(
    callback: T,
    delay: number = 500
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
            }, delay)
        })
    }
}
