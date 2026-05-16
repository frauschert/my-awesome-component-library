import { renderHook } from '@testing-library/react'
import useMemoCompare from '../useMemoCompare'

describe('useMemoCompare', () => {
    it('should return the same value when nothing has changed', () => {
        const initialData = { foo: 'bar' }
        const compareFn = jest.fn(() => true)

        const hook = renderHook((data) => useMemoCompare(data, compareFn), {
            initialProps: initialData,
        })

        expect(hook.result.current).toBe(initialData)
        expect(compareFn).not.toHaveBeenCalled()
        hook.rerender({ ...initialData })
        expect(hook.result.current).toBe(initialData)
    })

    it('should return a new value when something has changed', () => {
        const initialData = { foo: 'bar' }
        const nextData = { foo: 'baz' }
        const compareFn = jest.fn(() => false)

        const hook = renderHook((data) => useMemoCompare(data, compareFn), {
            initialProps: initialData,
        })

        hook.rerender(nextData)
        expect(hook.result.current).toBe(nextData)
    })
})
