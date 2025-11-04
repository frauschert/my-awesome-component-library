import { renderHook } from '@testing-library/react'
import useWhyDidYouUpdate from '../useWhyDidYouUpdate'

describe('useWhyDidYouUpdate', () => {
    let consoleLogSpy: jest.SpyInstance

    beforeEach(() => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
    })

    afterEach(() => {
        consoleLogSpy.mockRestore()
    })

    it('should not log anything on initial render', () => {
        renderHook(() =>
            useWhyDidYouUpdate('TestComponent', { count: 1, name: 'test' })
        )

        expect(consoleLogSpy).not.toHaveBeenCalled()
    })

    it('should log changed props on re-render', () => {
        const { rerender } = renderHook(
            ({ props }) => useWhyDidYouUpdate('TestComponent', props),
            {
                initialProps: { props: { count: 1, name: 'test' } },
            }
        )

        // Clear initial render logs (if any)
        consoleLogSpy.mockClear()

        // Re-render with changed count
        rerender({ props: { count: 2, name: 'test' } })

        expect(consoleLogSpy).toHaveBeenCalledWith(
            '[why-did-you-update]',
            'TestComponent'
        )
        expect(consoleLogSpy).toHaveBeenCalledWith('  count:', 1, '->', 2)
    })

    it('should not log when props have not changed', () => {
        const props = { count: 1, name: 'test' }
        const { rerender } = renderHook(
            () => useWhyDidYouUpdate('TestComponent', props),
            {}
        )

        // Clear initial render logs
        consoleLogSpy.mockClear()

        // Re-render with same props
        rerender()

        expect(consoleLogSpy).not.toHaveBeenCalled()
    })

    it('should log multiple changed props', () => {
        const { rerender } = renderHook(
            ({ props }) => useWhyDidYouUpdate('TestComponent', props),
            {
                initialProps: {
                    props: { count: 1, name: 'test', active: false },
                },
            }
        )

        consoleLogSpy.mockClear()

        // Change multiple props
        rerender({ props: { count: 2, name: 'updated', active: true } })

        expect(consoleLogSpy).toHaveBeenCalledWith(
            '[why-did-you-update]',
            'TestComponent'
        )
        expect(consoleLogSpy).toHaveBeenCalledWith('  count:', 1, '->', 2)
        expect(consoleLogSpy).toHaveBeenCalledWith(
            '  name:',
            'test',
            '->',
            'updated'
        )
        expect(consoleLogSpy).toHaveBeenCalledWith(
            '  active:',
            false,
            '->',
            true
        )
    })

    it('should detect object reference changes', () => {
        const obj1 = { id: 1 }
        const obj2 = { id: 1 }

        const { rerender } = renderHook(
            ({ props }) => useWhyDidYouUpdate('TestComponent', props),
            {
                initialProps: { props: { data: obj1 } },
            }
        )

        consoleLogSpy.mockClear()

        // Same content but different reference
        rerender({ props: { data: obj2 } })

        expect(consoleLogSpy).toHaveBeenCalledWith(
            '[why-did-you-update]',
            'TestComponent'
        )
        expect(consoleLogSpy).toHaveBeenCalledWith('  data:', obj1, '->', obj2)
    })

    it('should not log when object reference is the same', () => {
        const obj = { id: 1 }

        const { rerender } = renderHook(
            ({ props }) => useWhyDidYouUpdate('TestComponent', props),
            {
                initialProps: { props: { data: obj } },
            }
        )

        consoleLogSpy.mockClear()

        // Same reference
        rerender({ props: { data: obj } })

        expect(consoleLogSpy).not.toHaveBeenCalled()
    })

    it('should handle function reference changes', () => {
        const fn1 = () => {}
        const fn2 = () => {}

        const { rerender } = renderHook(
            ({ props }) => useWhyDidYouUpdate('TestComponent', props),
            {
                initialProps: { props: { onClick: fn1 } },
            }
        )

        consoleLogSpy.mockClear()

        rerender({ props: { onClick: fn2 } })

        expect(consoleLogSpy).toHaveBeenCalledWith(
            '[why-did-you-update]',
            'TestComponent'
        )
        expect(consoleLogSpy).toHaveBeenCalledWith('  onClick:', fn1, '->', fn2)
    })

    it('should handle array reference changes', () => {
        const arr1 = [1, 2, 3]
        const arr2 = [1, 2, 3]

        const { rerender } = renderHook(
            ({ props }) => useWhyDidYouUpdate('TestComponent', props),
            {
                initialProps: { props: { items: arr1 } },
            }
        )

        consoleLogSpy.mockClear()

        rerender({ props: { items: arr2 } })

        expect(consoleLogSpy).toHaveBeenCalledWith(
            '[why-did-you-update]',
            'TestComponent'
        )
        expect(consoleLogSpy).toHaveBeenCalledWith('  items:', arr1, '->', arr2)
    })

    it('should handle undefined and null values', () => {
        const { rerender } = renderHook(
            ({ props }) => useWhyDidYouUpdate('TestComponent', props),
            {
                initialProps: { props: { value: undefined } },
            }
        )

        consoleLogSpy.mockClear()

        rerender({ props: { value: null } })

        expect(consoleLogSpy).toHaveBeenCalledWith(
            '[why-did-you-update]',
            'TestComponent'
        )
        expect(consoleLogSpy).toHaveBeenCalledWith(
            '  value:',
            undefined,
            '->',
            null
        )
    })

    it('should handle added props', () => {
        const { rerender } = renderHook(
            ({ props }) => useWhyDidYouUpdate('TestComponent', props),
            {
                initialProps: { props: { count: 1 } },
            }
        )

        consoleLogSpy.mockClear()

        // Add new prop
        rerender({ props: { count: 1, name: 'test' } })

        expect(consoleLogSpy).toHaveBeenCalledWith(
            '[why-did-you-update]',
            'TestComponent'
        )
        expect(consoleLogSpy).toHaveBeenCalledWith(
            '  name:',
            undefined,
            '->',
            'test'
        )
    })

    it('should handle removed props', () => {
        const { rerender } = renderHook(
            ({ props }) => useWhyDidYouUpdate('TestComponent', props),
            {
                initialProps: { props: { count: 1, name: 'test' } },
            }
        )

        consoleLogSpy.mockClear()

        // Remove prop
        rerender({ props: { count: 1 } })

        expect(consoleLogSpy).toHaveBeenCalledWith(
            '[why-did-you-update]',
            'TestComponent'
        )
        expect(consoleLogSpy).toHaveBeenCalledWith(
            '  name:',
            'test',
            '->',
            undefined
        )
    })

    it('should work with different component names', () => {
        const { rerender } = renderHook(
            ({ name, props }) => useWhyDidYouUpdate(name, props),
            {
                initialProps: {
                    name: 'MyComponent',
                    props: { count: 1 },
                },
            }
        )

        consoleLogSpy.mockClear()

        rerender({ name: 'MyComponent', props: { count: 2 } })

        expect(consoleLogSpy).toHaveBeenCalledWith(
            '[why-did-you-update]',
            'MyComponent'
        )
    })

    it('should handle boolean changes', () => {
        const { rerender } = renderHook(
            ({ props }) => useWhyDidYouUpdate('TestComponent', props),
            {
                initialProps: { props: { isActive: true } },
            }
        )

        consoleLogSpy.mockClear()

        rerender({ props: { isActive: false } })

        expect(consoleLogSpy).toHaveBeenCalledWith(
            '[why-did-you-update]',
            'TestComponent'
        )
        expect(consoleLogSpy).toHaveBeenCalledWith(
            '  isActive:',
            true,
            '->',
            false
        )
    })

    it('should handle number zero and empty string', () => {
        const { rerender } = renderHook(
            ({ props }) => useWhyDidYouUpdate('TestComponent', props),
            {
                initialProps: { props: { count: 1, name: 'test' } },
            }
        )

        consoleLogSpy.mockClear()

        rerender({ props: { count: 0, name: '' } })

        expect(consoleLogSpy).toHaveBeenCalledWith(
            '[why-did-you-update]',
            'TestComponent'
        )
        expect(consoleLogSpy).toHaveBeenCalledWith('  count:', 1, '->', 0)
        expect(consoleLogSpy).toHaveBeenCalledWith('  name:', 'test', '->', '')
    })

    describe('practical use cases', () => {
        it('should help debug unnecessary re-renders from callback changes', () => {
            const callback1 = jest.fn()
            const callback2 = jest.fn()

            const { rerender } = renderHook(
                ({ props }) => useWhyDidYouUpdate('ExpensiveComponent', props),
                {
                    initialProps: {
                        props: {
                            data: { id: 1 },
                            onUpdate: callback1,
                        },
                    },
                }
            )

            consoleLogSpy.mockClear()

            // Callback reference changed but data didn't
            rerender({
                props: {
                    data: { id: 1 },
                    onUpdate: callback2,
                },
            })

            expect(consoleLogSpy).toHaveBeenCalledWith(
                '[why-did-you-update]',
                'ExpensiveComponent'
            )
            // Should show that both props changed
            expect(consoleLogSpy).toHaveBeenCalledTimes(3) // Header + 2 props
        })

        it('should help identify object recreation issues', () => {
            const { rerender } = renderHook(
                ({ props }) => useWhyDidYouUpdate('UserCard', props),
                {
                    initialProps: {
                        props: {
                            user: { id: 1, name: 'John' },
                            settings: { theme: 'dark' },
                        },
                    },
                }
            )

            consoleLogSpy.mockClear()

            // New object instances with same values
            rerender({
                props: {
                    user: { id: 1, name: 'John' },
                    settings: { theme: 'dark' },
                },
            })

            expect(consoleLogSpy).toHaveBeenCalledWith(
                '[why-did-you-update]',
                'UserCard'
            )
            // Both objects changed reference
            expect(consoleLogSpy).toHaveBeenCalledTimes(3) // Header + 2 props
        })
    })
})
