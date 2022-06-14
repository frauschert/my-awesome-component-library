const all = <T>(predicate: (value: T) => boolean, array: T[]) =>
    array.reduce((acc, value) => acc && predicate(value), true)

export default all
