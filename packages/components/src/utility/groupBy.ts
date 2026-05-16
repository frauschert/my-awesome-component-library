export default function groupBy<T, K>(
    items: T[],
    cb: (value: T) => K
): Map<K, T[]> {
    return items.reduce((acc, item) => {
        const groupKey = cb(item)
        const group = acc.get(groupKey)
        if (group) {
            group.push(item)
        } else {
            acc.set(groupKey, [item])
        }
        return acc
    }, new Map<K, T[]>())
}
