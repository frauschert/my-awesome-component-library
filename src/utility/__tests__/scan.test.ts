import scan from '../scan'
import { scanIter } from '../scan'

describe('scan', () => {
    it('adds numbers from 1..6', () => {
        expect(scan((x, y) => x + y, 0, [1, 2, 3, 4, 5, 6])).toEqual([
            1, 3, 6, 10, 15, 21,
        ])
    })

    it('returns [] for empty input', () => {
        expect(scan((acc, n: number) => acc + n, 0, [])).toEqual([])
    })

    it('works with a different accumulator type', () => {
        const out = scan<string[], number>(
            (acc, n) => [...acc, String(n)],
            [],
            [1, 2, 3]
        )
        expect(out).toEqual([['1'], ['1', '2'], ['1', '2', '3']])
    })

    it('preserves order for string concatenation', () => {
        const out = scan((acc: string, s: string) => acc + s, '', [
            'a',
            'b',
            'c',
        ])
        expect(out).toEqual(['a', 'ab', 'abc'])
    })

    it('seedless overload uses first element as seed', () => {
        expect(scan((a: number, b: number) => a + b, [1, 2, 3])).toEqual([
            1, 3, 6,
        ])
        expect(scan((a: string, b: string) => a + b, ['a', 'b', 'c'])).toEqual([
            'a',
            'ab',
            'abc',
        ])
        // empty array returns []
        expect(scan((a: number, b: number) => a + b, [])).toEqual([])
    })

    it('scanIter accumulates lazily over arrays', () => {
        const it = scanIter([1, 2, 3], (acc, n) => acc + n, 0)
        expect(Array.from(it)).toEqual([1, 3, 6])
    })

    it('scanIter works with Sets (iterable)', () => {
        const set = new Set([1, 2, 3])
        const it = scanIter(set, (acc, n) => acc + n, 0)
        expect(Array.from(it)).toEqual([1, 3, 6])
    })
})
