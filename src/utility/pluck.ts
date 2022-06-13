/** Plucks the given key off of each item in the array. Returns a new array of these values. */
const pluck = <T, K extends keyof T>(key: K, array: T[]) =>
    array.reduce<T[K][]>((values, current) => {
        values.push(current[key])

        return values
    }, [])

export default pluck
