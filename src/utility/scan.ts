const scan = <T>(
    reducer: (prev: T, curr: T) => T,
    initialValue: T,
    array: T[]
) => {
    const reducedValues: T[] = []

    array.reduce((acc, current) => {
        const newAcc = reducer(acc, current)

        reducedValues.push(newAcc)

        return newAcc
    }, initialValue)

    return reducedValues
}

export default scan
