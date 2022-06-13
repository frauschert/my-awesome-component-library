function groupBy<
    T extends Record<K, PropertyKey>,
    K extends Extract<keyof T, PropertyKey>
>(items: readonly T[], key: K) {
    return items.reduce(
        (acc, item) => ({
            ...acc,
            [item[key]]: [...(acc[item[key]] || []), item],
        }),
        {} as Record<T[K], T[]>
    )
}

export default groupBy
