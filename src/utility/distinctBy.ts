export default function distinctBy<
    T extends Record<PropertyKey, unknown>,
    K extends Extract<keyof T, PropertyKey>
>(list: T[], key: K) {
    return list.filter(
        (value, index, array) =>
            array.findIndex((t) => t[key] === value[key]) === index
    )
}
