const intersectionBy = <T, K extends keyof T>(
    fn: (value: T) => K,
    listA: T[],
    listB: T[]
) => {
    const b = new Set(listB.map(fn))
    return listA.filter((val) => b.has(fn(val)))
}

export default intersectionBy
