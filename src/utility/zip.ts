export default function zip<T extends readonly any[][]>(
    ...arrays: T
): { [K in keyof T]: T[K] extends (infer U)[] ? U : never }[] {
    if (arrays.length === 0) return []
    const length = Math.min(...arrays.map((arr) => arr.length))
    const result: any[] = []
    for (let i = 0; i < length; i++) {
        result.push(arrays.map((arr) => arr[i]))
    }
    return result
}
