import { renderHook, act } from '@testing-library/react'
import useUndoRedo from '../useUndoRedo'

describe('useUndoRedo', () => {
    it('should initialize with the initial state', () => {
        const { result } = renderHook(() => useUndoRedo(0))
        expect(result.current.state).toBe(0)
        expect(result.current.canUndo).toBe(false)
        expect(result.current.canRedo).toBe(false)
        expect(result.current.past).toEqual([])
        expect(result.current.future).toEqual([])
    })

    it('should set new state and allow undo', () => {
        const { result } = renderHook(() => useUndoRedo(0))
        act(() => result.current.set(1))
        expect(result.current.state).toBe(1)
        expect(result.current.canUndo).toBe(true)
        expect(result.current.past).toEqual([0])
        expect(result.current.future).toEqual([])
    })

    it('should undo and redo state changes', () => {
        const { result } = renderHook(() => useUndoRedo(0))
        act(() => result.current.set(1))
        act(() => result.current.set(2))
        expect(result.current.state).toBe(2)
        act(() => result.current.undo())
        expect(result.current.state).toBe(1)
        expect(result.current.canRedo).toBe(true)
        act(() => result.current.redo())
        expect(result.current.state).toBe(2)
    })

    it('should clear history and reset to initial state', () => {
        const { result } = renderHook(() => useUndoRedo(0))
        act(() => result.current.set(1))
        act(() => result.current.clear())
        expect(result.current.state).toBe(0)
        expect(result.current.past).toEqual([])
        expect(result.current.future).toEqual([])
    })

    it('should not set state if value is equal (default equality)', () => {
        const { result } = renderHook(() => useUndoRedo(0))
        act(() => result.current.set(0))
        expect(result.current.past).toEqual([])
    })

    it('should use custom equality function', () => {
        const isEqual = (a: number, b: number) => Math.abs(a - b) < 2
        const { result } = renderHook(() => useUndoRedo<number>(0, isEqual))
        act(() => result.current.set(1)) // |0-1| < 2, so not set
        expect(result.current.state).toBe(0)
        act(() => result.current.set(2)) // |2-0| >= 2, so set
        expect(result.current.state).toBe(2)
    })
})
