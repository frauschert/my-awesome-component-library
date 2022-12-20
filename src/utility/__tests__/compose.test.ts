import { compose } from '../compose'

const addOne = (a: number) => {
    return a + 1
}

const addTwo = (a: number) => {
    return a + 2
}

const numToString = (a: number) => {
    return a.toString()
}

test('', () => {
    const addOneToString = compose(addOne, addTwo, numToString)
    expect(addOneToString(1)).toBe('4')
})
