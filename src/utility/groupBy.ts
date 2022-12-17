export default function groupBy<T, K>(items: T[], cb: (value: T) => K) {
    return items.reduce((acc, item) => {
        const groupKey = cb(item)
        acc.set(groupKey, (acc.get(groupKey) || []).concat(item))
        return acc
    }, new Map<K, T[]>())
}
