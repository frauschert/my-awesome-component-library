const intersectionBy = <
    T extends Record<K, PropertyKey>,
    K extends Extract<keyof T, PropertyKey>
>(
    listA: T[],
    listB: T[],
    key: K
) => {
    const b = new Set(listB.map((val) => val[key]))
    return listA.filter(
        (val, index, self) =>
            self.findIndex((s) => s[key] === val[key]) === index &&
            b.has(val[key])
    )
}

export default intersectionBy
