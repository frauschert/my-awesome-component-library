const none = <T>(predicate: (value: T) => boolean, array: T[]) =>
    array.reduce((acc, value) => !acc && !predicate(value), false)

export default none
