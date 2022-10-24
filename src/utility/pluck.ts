/** Plucks the given key off of each item in the array. Returns a new array of these values. */
export default function pluck<T, K extends keyof T>(key: K, array: T[]) {
    return array.reduce<T[K][]>((values, current) => {
        values.push(current[key])
        return values
    }, [])
}
