export function search<T, K extends keyof T>(
    data: T[],
    properties: K[],
    query: string
): T[] {
    if (query === '') {
        return data
    }
    return data.filter((item) => {
        return properties.some((property) => {
            const value = item[property]
            if (typeof value === 'string' || typeof value === 'number') {
                return value
                    .toString()
                    .toLowerCase()
                    .includes(query.toLowerCase())
            }
            return false
        })
    })
}
