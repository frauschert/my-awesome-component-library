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
        const sum = atom<number>((get) => get(a) + get(b))
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
        const double = atom<number>((get) => get(a) * 2)
        expect(() => (double as any).set(10)).toThrow(
            'Cannot set value of derived atom'
        )
    })

    it('unsubscribes from dependencies when recomputed', () => {
        const a = atom(1)
        const b = atom(2)
        const useA = atom(true)
        const dynamic = atom<number>((get) => (get(useA) ? get(a) : get(b)))
        let observed = 0
        dynamic.subscribe((v) => {
            observed = v
        })
        expect(dynamic.get()).toBe(1)
        a.set(5)
        expect(observed).toBe(5)
        useA.set(false)
        b.set(7)
        expect(dynamic.get()).toBe(7)
        expect(observed).toBe(7)
        a.set(100)
        // Should not update observed, since dynamic no longer depends on a
        expect(observed).toBe(7)
    })

    it('supports functional set for writable atoms', () => {
        const a = atom(0)
        let last = -1
        a.subscribe((v) => (last = v))
        a.set((x) => x + 1)
        a.set((x) => x + 2)
        expect(a.get()).toBe(3)
        expect(last).toBe(3)
    })

    it('supports reset for writable atoms', () => {
        const a = atom(5)
        let last = -1
        a.subscribe((v) => (last = v))
        expect(last).toBe(5)
        a.set(10)
        expect(a.get()).toBe(10)
        a.reset()
        expect(a.get()).toBe(5)
        expect(last).toBe(5)
    })

    it('throws if trying to reset a derived atom (not in type)', () => {
        const a = atom(1)
        const double = atom<number>((get) => get(a) * 2)
        expect(() => (double as any).reset()).toThrow()
    })

    it('coalesces multiple updates into one recompute tick', async () => {
        const a = atom(0)
        const b = atom<number>((get) => get(a) * 2)
        let notifications = 0
        b.subscribe(() => {
            notifications++
        })
        // Burst of updates in same tick
        a.set(1)
        a.set(2)
        a.set(3)
        // Schedule a microtask boundary
        await Promise.resolve()
        expect(b.get()).toBe(6)
        // 1 from immediate subscription + 1 coalesced notification in the same tick
        expect(notifications).toBe(2)
    })

    it('does not maintain dependency subscriptions without subscribers', () => {
        const a = atom(1)
        const b = atom<number>((get) => get(a) + 1)
        // No subscribers yet; updating a should not notify anyone, but get should recompute on demand
        a.set(2)
        expect(b.get()).toBe(3)
        // Now subscribe; subsequent updates should notify
        let last = 0
        const unsub = b.subscribe((v) => (last = v))
        a.set(5)
        expect(last).toBe(6)
        unsub()
        // After unsubscribing, internal deps should be torn down; further sets won't trigger notifications
        a.set(10)
        expect(b.get()).toBe(11)
    })
})
