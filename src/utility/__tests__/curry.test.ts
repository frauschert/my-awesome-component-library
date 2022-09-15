import curry from '../curry'

describe('Curry', () => {
    it('Works', () => {
        const add = (x: number, y: number, z: number) => x + y + z
        const result = curry(add)(1)(2)(3)
        expect(result).toBe(6)
    })
})
