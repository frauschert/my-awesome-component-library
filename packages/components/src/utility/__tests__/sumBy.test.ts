import sumBy from '../sumBy'

describe('sumBy', () => {
    it('should return correct sum for an array of numbers', () => {
        const list = [1, 2, 3, 4]
        expect(sumBy((n) => n, list)).toBe(10)
    })

    it('should return correct sum for an array of objects', () => {
        const list = [{ value: 1 }, { value: 2 }, { value: 3 }]
        expect(sumBy((obj) => obj.value, list)).toBe(6)
    })

    it('should return zero for empty array', () => {
        const list: number[] = []
        expect(sumBy((n) => n, list)).toBe(0)
    })
})
