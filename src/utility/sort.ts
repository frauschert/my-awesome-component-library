type SortDirection = 'ascending' | 'descending'

export default function sort<T, K extends keyof T>(
    data: T[],
    sortKey: K,
    direction: SortDirection = 'ascending'
): T[] {
    return data.sort((a, b) => {
        if (a[sortKey] < b[sortKey]) {
            return direction === 'ascending' ? -1 : 1
        }
        if (a[sortKey] > b[sortKey]) {
            return direction === 'ascending' ? 1 : -1
        }
        return 0
    })
}
