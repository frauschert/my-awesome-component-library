import { atom } from '../atom'

describe('atom', () => {
    it('primitive atom: get/set/subscribe', () => {
        const count = atom(0)
        let observed = 0
        const unsub = count.subscribe((v) => {
            observed = v
        })
        expect(count.get()).toBe(0)
        count.set(1)
        expect(count.get()).toBe(1)
        expect(observed).toBe(1)
        unsub()
        count.set(2)
        expect(observed).toBe(1) // unsubscribed, should not update
    })

    it('derived atom: computes from dependencies and updates', () => {
        const a = atom(2)
        const b = atom(3)
        const sum = atom((get) => get(a) + get(b))
        let observed = 0
        sum.subscribe((v) => {
            observed = v
        })
        expect(sum.get()).toBe(5)
        expect(observed).toBe(5)
        a.set(5)
        expect(sum.get()).toBe(8)
        expect(observed).toBe(8)
        b.set(10)
        expect(sum.get()).toBe(15)
        expect(observed).toBe(15)
    })

    it('throws if trying to set a derived atom', () => {
        const a = atom(1)
        const double = atom((get) => get(a) * 2)
        expect(() => double.set(10)).toThrow('Cannot set value of derived atom')
    })

    it('unsubscribes from dependencies when recomputed', () => {
        const a = atom(1)
        const b = atom(2)
        let useA = true
        const dynamic = atom((get) => (useA ? get(a) : get(b)))
        let observed = 0
        dynamic.subscribe((v) => {
            observed = v
        })
        expect(dynamic.get()).toBe(1)
        a.set(5)
        expect(observed).toBe(5)
        useA = false
        // Force recompute
        b.set(7)
        expect(dynamic.get()).toBe(7)
        expect(observed).toBe(7)
        a.set(100)
        // Should not update observed, since dynamic no longer depends on a
        expect(observed).toBe(7)
    })
})
