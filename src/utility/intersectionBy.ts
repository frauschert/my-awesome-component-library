import distinctBy from './distinctBy'

export default function intersectionBy<
    T extends Record<K, PropertyKey>,
    K extends Extract<keyof T, PropertyKey>
>(listA: T[], listB: T[], key: K) {
    const b = new Set(listB.map((val) => val[key]))
    return distinctBy(listA, key).filter((value) => b.has(value[key]))
}
