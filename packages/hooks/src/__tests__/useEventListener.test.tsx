import { renderHook } from '@testing-library/react'
import { RefObject, createRef } from 'react'
import useEventListener from '../useEventListener'

describe('useEventListener', () => {
    describe('basic functionality', () => {
        it('should attach event listener to window', () => {
            const handler = jest.fn()

            renderHook(() => useEventListener(window, 'resize', handler))

            window.dispatchEvent(new Event('resize'))

            expect(handler).toHaveBeenCalledTimes(1)
        })

        it('should attach event listener to document', () => {
            const handler = jest.fn()

            renderHook(() => useEventListener(document, 'click', handler))

            document.dispatchEvent(new MouseEvent('click'))

            expect(handler).toHaveBeenCalledTimes(1)
        })

        it('should attach event listener to HTMLElement', () => {
            const handler = jest.fn()
            const element = document.createElement('div')

            renderHook(() => useEventListener(element, 'click', handler))

            element.dispatchEvent(new MouseEvent('click'))

            expect(handler).toHaveBeenCalledTimes(1)
        })

        it('should attach event listener via RefObject', () => {
            const handler = jest.fn()
            const element = document.createElement('button')
            const ref: RefObject<HTMLButtonElement> = { current: element }

            renderHook(() => useEventListener(ref, 'click', handler))

            element.dispatchEvent(new MouseEvent('click'))

            expect(handler).toHaveBeenCalledTimes(1)
        })

        it('should handle multiple event dispatches', () => {
            const handler = jest.fn()

            renderHook(() => useEventListener(window, 'scroll', handler))

            window.dispatchEvent(new Event('scroll'))
            window.dispatchEvent(new Event('scroll'))
            window.dispatchEvent(new Event('scroll'))

            expect(handler).toHaveBeenCalledTimes(3)
        })
    })

    describe('event types', () => {
        it('should handle keyboard events', () => {
            const handler = jest.fn()

            renderHook(() => useEventListener(document, 'keydown', handler))

            const event = new KeyboardEvent('keydown', { key: 'Enter' })
            document.dispatchEvent(event)

            expect(handler).toHaveBeenCalledWith(
                expect.objectContaining({ key: 'Enter' })
            )
        })

        it('should handle mouse events', () => {
            const handler = jest.fn()
            const element = document.createElement('div')

            renderHook(() => useEventListener(element, 'mouseenter', handler))

            const event = new MouseEvent('mouseenter', {
                clientX: 100,
                clientY: 200,
            })
            element.dispatchEvent(event)

            expect(handler).toHaveBeenCalledWith(
                expect.objectContaining({ clientX: 100, clientY: 200 })
            )
        })

        it('should handle focus events', () => {
            const handler = jest.fn()
            const element = document.createElement('input')

            renderHook(() => useEventListener(element, 'focus', handler))

            element.dispatchEvent(new FocusEvent('focus'))

            expect(handler).toHaveBeenCalledTimes(1)
        })

        it('should handle custom events', () => {
            const handler = jest.fn()
            const element = document.createElement('div')

            renderHook(() =>
                useEventListener(element, 'custom' as any, handler)
            )

            const customEvent = new CustomEvent('custom', {
                detail: { data: 'test' },
            })
            element.dispatchEvent(customEvent)

            expect(handler).toHaveBeenCalledTimes(1)
        })
    })

    describe('event listener options', () => {
        it('should support capture option as boolean', () => {
            const handler = jest.fn()
            const parent = document.createElement('div')
            const child = document.createElement('button')
            parent.appendChild(child)

            renderHook(() => useEventListener(parent, 'click', handler, true))

            child.dispatchEvent(new MouseEvent('click', { bubbles: true }))

            expect(handler).toHaveBeenCalledTimes(1)
        })

        it('should support options object', () => {
            const handler = jest.fn()
            const element = document.createElement('div')

            renderHook(() =>
                useEventListener(element, 'click', handler, { once: true })
            )

            element.dispatchEvent(new MouseEvent('click'))
            element.dispatchEvent(new MouseEvent('click'))

            // Should only fire once due to { once: true }
            expect(handler).toHaveBeenCalledTimes(1)
        })

        it('should support passive option', () => {
            const handler = jest.fn()
            const element = document.createElement('div')

            renderHook(() =>
                useEventListener(element, 'touchstart', handler, {
                    passive: true,
                })
            )

            element.dispatchEvent(new TouchEvent('touchstart'))

            expect(handler).toHaveBeenCalledTimes(1)
        })
    })

    describe('null/undefined handling', () => {
        it('should handle null element', () => {
            const handler = jest.fn()

            renderHook(() => useEventListener(null, 'click', handler))

            // Should not throw
            expect(handler).not.toHaveBeenCalled()
        })

        it('should handle undefined element', () => {
            const handler = jest.fn()

            renderHook(() => useEventListener(undefined, 'click', handler))

            // Should not throw
            expect(handler).not.toHaveBeenCalled()
        })

        it('should handle ref with null current', () => {
            const handler = jest.fn()
            const ref: RefObject<HTMLDivElement | null> = { current: null }

            renderHook(() =>
                useEventListener(
                    ref as RefObject<HTMLElement>,
                    'click',
                    handler
                )
            )

            // Should not throw
            expect(handler).not.toHaveBeenCalled()
        })
    })

    describe('cleanup', () => {
        it('should remove event listener on unmount', () => {
            const handler = jest.fn()
            const element = document.createElement('div')

            const { unmount } = renderHook(() =>
                useEventListener(element, 'click', handler)
            )

            element.dispatchEvent(new MouseEvent('click'))
            expect(handler).toHaveBeenCalledTimes(1)

            unmount()

            element.dispatchEvent(new MouseEvent('click'))
            // Should still be 1, not 2
            expect(handler).toHaveBeenCalledTimes(1)
        })

        it('should remove listener when element changes', () => {
            const handler = jest.fn()
            const element1 = document.createElement('div')
            const element2 = document.createElement('div')

            const { rerender } = renderHook(
                ({ el }) => useEventListener(el, 'click', handler),
                { initialProps: { el: element1 } }
            )

            element1.dispatchEvent(new MouseEvent('click'))
            expect(handler).toHaveBeenCalledTimes(1)

            // Change element
            rerender({ el: element2 })

            // Old element should not trigger
            element1.dispatchEvent(new MouseEvent('click'))
            expect(handler).toHaveBeenCalledTimes(1)

            // New element should trigger
            element2.dispatchEvent(new MouseEvent('click'))
            expect(handler).toHaveBeenCalledTimes(2)
        })

        it('should remove listener when event type changes', () => {
            const handler = jest.fn()
            const element = document.createElement('div')

            const { rerender } = renderHook(
                ({ type }) => useEventListener(element, type as any, handler),
                { initialProps: { type: 'click' } }
            )

            element.dispatchEvent(new MouseEvent('click'))
            expect(handler).toHaveBeenCalledTimes(1)

            // Change event type
            rerender({ type: 'dblclick' })

            // Old event type should not trigger
            element.dispatchEvent(new MouseEvent('click'))
            expect(handler).toHaveBeenCalledTimes(1)

            // New event type should trigger
            element.dispatchEvent(new MouseEvent('dblclick'))
            expect(handler).toHaveBeenCalledTimes(2)
        })
    })

    describe('handler updates', () => {
        it('should use latest handler without re-subscribing', () => {
            const element = document.createElement('div')
            let callCount = 0

            const { rerender } = renderHook(
                ({ handler }) => useEventListener(element, 'click', handler),
                {
                    initialProps: {
                        handler: () => {
                            callCount = 1
                        },
                    },
                }
            )

            element.dispatchEvent(new MouseEvent('click'))
            expect(callCount).toBe(1)

            // Update handler
            rerender({
                handler: () => {
                    callCount = 2
                },
            })

            element.dispatchEvent(new MouseEvent('click'))
            expect(callCount).toBe(2)
        })

        it('should not re-subscribe when only handler changes', () => {
            const element = document.createElement('div')
            const addSpy = jest.spyOn(element, 'addEventListener')
            const removeSpy = jest.spyOn(element, 'removeEventListener')

            const { rerender } = renderHook(
                ({ handler }) => useEventListener(element, 'click', handler),
                { initialProps: { handler: () => {} } }
            )

            const initialAddCount = addSpy.mock.calls.length
            const initialRemoveCount = removeSpy.mock.calls.length

            // Update handler
            rerender({ handler: () => {} })

            // Should not add/remove listener again
            expect(addSpy.mock.calls.length).toBe(initialAddCount)
            expect(removeSpy.mock.calls.length).toBe(initialRemoveCount)

            addSpy.mockRestore()
            removeSpy.mockRestore()
        })
    })

    describe('practical use cases', () => {
        it('should work for window resize handler', () => {
            const onResize = jest.fn()

            renderHook(() => useEventListener(window, 'resize', onResize))

            window.dispatchEvent(new Event('resize'))

            expect(onResize).toHaveBeenCalledTimes(1)
        })

        it('should work for document scroll handler', () => {
            const onScroll = jest.fn()

            renderHook(() => useEventListener(document, 'scroll', onScroll))

            document.dispatchEvent(new Event('scroll'))

            expect(onScroll).toHaveBeenCalledTimes(1)
        })

        it('should work for button click handler with ref', () => {
            const onClick = jest.fn()
            const button = document.createElement('button')
            const ref: RefObject<HTMLButtonElement> = { current: button }

            renderHook(() => useEventListener(ref, 'click', onClick))

            button.dispatchEvent(new MouseEvent('click'))

            expect(onClick).toHaveBeenCalledTimes(1)
        })

        it('should work for form submit handler', () => {
            const onSubmit = jest.fn((e) => e.preventDefault())
            const form = document.createElement('form')

            renderHook(() => useEventListener(form, 'submit', onSubmit))

            form.dispatchEvent(new Event('submit', { cancelable: true }))

            expect(onSubmit).toHaveBeenCalledTimes(1)
        })

        it('should work for input change handler', () => {
            const onChange = jest.fn()
            const input = document.createElement('input')

            renderHook(() => useEventListener(input, 'input', onChange))

            input.dispatchEvent(new Event('input'))

            expect(onChange).toHaveBeenCalledTimes(1)
        })
    })

    describe('edge cases', () => {
        it('should handle rapid event dispatches', () => {
            const handler = jest.fn()
            const element = document.createElement('div')

            renderHook(() => useEventListener(element, 'click', handler))

            for (let i = 0; i < 100; i++) {
                element.dispatchEvent(new MouseEvent('click'))
            }

            expect(handler).toHaveBeenCalledTimes(100)
        })

        it('should work with multiple hooks on same element', () => {
            const clickHandler = jest.fn()
            const mouseoverHandler = jest.fn()
            const element = document.createElement('div')

            renderHook(() => {
                useEventListener(element, 'click', clickHandler)
                useEventListener(element, 'mouseover', mouseoverHandler)
            })

            element.dispatchEvent(new MouseEvent('click'))
            element.dispatchEvent(new MouseEvent('mouseover'))

            expect(clickHandler).toHaveBeenCalledTimes(1)
            expect(mouseoverHandler).toHaveBeenCalledTimes(1)
        })

        it('should work with same event type on different elements', () => {
            const handler1 = jest.fn()
            const handler2 = jest.fn()
            const element1 = document.createElement('div')
            const element2 = document.createElement('div')

            renderHook(() => {
                useEventListener(element1, 'click', handler1)
                useEventListener(element2, 'click', handler2)
            })

            element1.dispatchEvent(new MouseEvent('click'))
            element2.dispatchEvent(new MouseEvent('click'))

            expect(handler1).toHaveBeenCalledTimes(1)
            expect(handler2).toHaveBeenCalledTimes(1)
        })
    })

    describe('TypeScript type safety', () => {
        it('should provide correct event types for window events', () => {
            const handler = jest.fn((e: Event) => {
                expect(e).toBeInstanceOf(Event)
            })

            renderHook(() => useEventListener(window, 'resize', handler))

            window.dispatchEvent(new Event('resize'))
        })

        it('should provide correct event types for mouse events', () => {
            const handler = jest.fn((e: MouseEvent) => {
                expect(e).toBeInstanceOf(MouseEvent)
            })
            const element = document.createElement('div')

            renderHook(() => useEventListener(element, 'click', handler))

            element.dispatchEvent(new MouseEvent('click'))
        })

        it('should provide correct event types for keyboard events', () => {
            const handler = jest.fn((e: KeyboardEvent) => {
                expect(e).toBeInstanceOf(KeyboardEvent)
            })

            renderHook(() => useEventListener(document, 'keydown', handler))

            document.dispatchEvent(new KeyboardEvent('keydown'))
        })
    })
})
