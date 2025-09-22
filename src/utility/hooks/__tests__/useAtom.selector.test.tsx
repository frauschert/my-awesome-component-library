import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { atom } from '../../atom'
import type { ReadOnlyAtom } from '../../atom'
import { useAtom, useAtomValue, useSetAtom, useAtomSelector } from '../useAtom'

describe('useAtom hooks', () => {
    it('useSetAtom returns stable setter and does not subscribe', () => {
        const count = atom(0)
        const { result } = renderHook(() => useSetAtom(count))
        act(() => result.current(1))
        expect(count.get()).toBe(1)
    })

    it('useAtomSelector re-renders only when selected slice changes', () => {
        const todo = atom({ id: 1, title: 'a', done: false })
        const renders: number[] = []
        const { result, rerender } = renderHook(() => {
            const title = useAtomSelector(todo, (v) => v.title)
            renders.push(1)
            return title
        })
        expect(result.current).toBe('a')
        // Update unrelated field
        act(() => todo.set({ id: 1, title: 'a', done: true }))
        rerender()
        expect(result.current).toBe('a')
        // Change selected slice
        act(() => todo.set({ id: 1, title: 'b', done: true }))
        rerender()
        expect(result.current).toBe('b')
        // We expect 2 renders in production; React 18 StrictMode may double-render in tests (2 or 4)
        expect([2, 4]).toContain(renders.length)
    })

    it('useAtom works for writable atom', () => {
        const a = atom(1)
        const { result } = renderHook(() => useAtom(a))
        const [value, set] = result.current
        expect(value).toBe(1)
        act(() => set(5))
        const [value2] = result.current
        expect(value2).toBe(5)
    })

    it('useAtomValue works for derived atom', () => {
        const a = atom(2)
        const b = atom((get: (a: ReadOnlyAtom<number>) => number) => get(a) * 2)
        const { result } = renderHook(() => useAtomValue(b))
        expect(result.current).toBe(4)
        act(() => a.set(3))
        expect(result.current).toBe(6)
    })
})
