const sumBy = <T>(fn: (value: T) => number, list: T[]) =>
    list.reduce((prev, next) => prev + fn(next), 0)

export default sumBy
