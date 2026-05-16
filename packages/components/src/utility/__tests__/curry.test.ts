import curry from '../curry'

describe('curry', () => {
    it('curries one-by-one', () => {
        const add = (x: number, y: number, z: number) => x + y + z
        expect(curry(add)(1)(2)(3)).toBe(6)
    })

    it('supports grouped arguments per step', () => {
        const add = (x: number, y: number, z: number) => x + y + z
        expect(curry(add)(1, 2)(3)).toBe(6)
        expect(curry(add)(1)(2, 3)).toBe(6)
    })

    it('forwards extra arguments beyond arity', () => {
        const take2 = (a: number, b: number) => a + b
        // extra args (3,4) will be forwarded, typical JS ignores them
        // cast to any to bypass Curried type which enforces arity at the type level
        expect((curry(take2) as any)(1)(2, 3, 4)).toBe(3)
        // If we meet arity in one step, the result returns immediately (not a function)
        expect((curry(take2) as any)(1, 2, 3)).toBe(3)
    })

    it('handles zero-arity functions', () => {
        const f = () => 42
        expect(curry(f)()).toBe(42)
    })

    it('executes immediately for defaulted parameters due to fn.length', () => {
        const f = (a = 1, b = 2) => a + b
        // fn.length === 0 here; curry(f)() invokes immediately
        expect(curry(f)()).toBe(3)
        // Cast to any: Curried type models fixed arity; defaulted params are not reflected in types
        expect((curry(f) as any)(5)).toBe(7)
        // Supplying both in one go still works
        expect((curry(f) as any)(5, 10)).toBe(15)
    })

    it('preserves `this` across partial applications', () => {
        const obj = {
            base: 10,
            sum(this: any, a: number, b: number) {
                return this.base + a + b
            },
        }
        const curried = curry(obj.sum)
        expect((curried as any).call(obj, 1)(2)).toBe(13)
        expect((curried as any).call(obj, 1, 2)).toBe(13)
        expect((curried as any).bind(obj)(1)(2)).toBe(13)
    })
})
