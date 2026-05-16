import { renderHook, act } from '@testing-library/react'
import useControllableState from '../useControllableState'

describe('useControllableState', () => {
    describe('uncontrolled mode', () => {
        it('should use defaultValue as initial value', () => {
            const { result } = renderHook(() =>
                useControllableState({ defaultValue: 'hello' })
            )
            expect(result.current.value).toBe('hello')
            expect(result.current.isControlled).toBe(false)
        })

        it('should update internal state when setValue is called', () => {
            const { result } = renderHook(() =>
                useControllableState({ defaultValue: 0 })
            )

            act(() => result.current.setValue(5))
            expect(result.current.value).toBe(5)
        })

        it('should support functional updates', () => {
            const { result } = renderHook(() =>
                useControllableState({ defaultValue: 10 })
            )

            act(() => result.current.setValue((prev) => prev + 5))
            expect(result.current.value).toBe(15)
        })

        it('should call onChange when setValue is called', () => {
            const onChange = jest.fn()
            const { result } = renderHook(() =>
                useControllableState({ defaultValue: 'a', onChange })
            )

            act(() => result.current.setValue('b'))
            expect(onChange).toHaveBeenCalledWith('b')
            expect(result.current.value).toBe('b')
        })
    })

    describe('controlled mode', () => {
        it('should use the controlled value', () => {
            const { result } = renderHook(() =>
                useControllableState({
                    value: 'controlled',
                    defaultValue: 'default',
                })
            )
            expect(result.current.value).toBe('controlled')
            expect(result.current.isControlled).toBe(true)
        })

        it('should not change internal state when setValue is called', () => {
            const onChange = jest.fn()
            const { result } = renderHook(() =>
                useControllableState({
                    value: 'controlled',
                    defaultValue: 'default',
                    onChange,
                })
            )

            act(() => result.current.setValue('new'))
            // Value remains controlled
            expect(result.current.value).toBe('controlled')
            expect(onChange).toHaveBeenCalledWith('new')
        })

        it('should reflect updated controlled value on rerender', () => {
            const { result, rerender } = renderHook(
                ({ value }) =>
                    useControllableState({
                        value,
                        defaultValue: 'default',
                    }),
                { initialProps: { value: 'first' } }
            )

            expect(result.current.value).toBe('first')
            rerender({ value: 'second' })
            expect(result.current.value).toBe('second')
        })
    })

    describe('edge cases', () => {
        it('should handle undefined onChange gracefully', () => {
            const { result } = renderHook(() =>
                useControllableState({ defaultValue: 0 })
            )

            expect(() => {
                act(() => result.current.setValue(1))
            }).not.toThrow()
        })

        it('should warn when switching from controlled to uncontrolled', () => {
            const warnSpy = jest
                .spyOn(console, 'warn')
                .mockImplementation(() => {})

            const { rerender } = renderHook(
                ({ value }: { value?: string }) =>
                    useControllableState({
                        value,
                        defaultValue: 'default',
                    }),
                { initialProps: { value: 'controlled' } as { value?: string } }
            )

            rerender({ value: undefined })
            expect(warnSpy).toHaveBeenCalledWith(
                expect.stringContaining('controlled')
            )

            warnSpy.mockRestore()
        })
    })
})
