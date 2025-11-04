import React, { useRef } from 'react'
import { render, fireEvent } from '@testing-library/react'
import useClickAway from '../useClickAway'

describe('useClickAway', () => {
    it('should call handler when clicking outside element', () => {
        const handler = jest.fn()

        function TestComponent() {
            const ref = useRef<HTMLDivElement>(null)
            useClickAway(ref, handler)

            return (
                <div>
                    <div ref={ref} data-testid="inside">
                        Inside
                    </div>
                    <div data-testid="outside">Outside</div>
                </div>
            )
        }

        const { getByTestId } = render(<TestComponent />)

        fireEvent.mouseDown(getByTestId('outside'))
        expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should not call handler when clicking inside element', () => {
        const handler = jest.fn()

        function TestComponent() {
            const ref = useRef<HTMLDivElement>(null)
            useClickAway(ref, handler)

            return (
                <div>
                    <div ref={ref} data-testid="inside">
                        Inside
                    </div>
                    <div data-testid="outside">Outside</div>
                </div>
            )
        }

        const { getByTestId } = render(<TestComponent />)

        fireEvent.mouseDown(getByTestId('inside'))
        expect(handler).not.toHaveBeenCalled()
    })

    it('should handle touch events', () => {
        const handler = jest.fn()

        function TestComponent() {
            const ref = useRef<HTMLDivElement>(null)
            useClickAway(ref, handler)

            return (
                <div>
                    <div ref={ref} data-testid="inside">
                        Inside
                    </div>
                    <div data-testid="outside">Outside</div>
                </div>
            )
        }

        const { getByTestId } = render(<TestComponent />)

        fireEvent.touchStart(getByTestId('outside'))
        expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should work with multiple refs', () => {
        const handler = jest.fn()

        function TestComponent() {
            const ref1 = useRef<HTMLDivElement>(null)
            const ref2 = useRef<HTMLDivElement>(null)
            useClickAway([ref1, ref2], handler)

            return (
                <div>
                    <div ref={ref1} data-testid="inside1">
                        Inside 1
                    </div>
                    <div ref={ref2} data-testid="inside2">
                        Inside 2
                    </div>
                    <div data-testid="outside">Outside</div>
                </div>
            )
        }

        const { getByTestId } = render(<TestComponent />)

        fireEvent.mouseDown(getByTestId('outside'))
        expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should not call handler when clicking inside any of multiple refs', () => {
        const handler = jest.fn()

        function TestComponent() {
            const ref1 = useRef<HTMLDivElement>(null)
            const ref2 = useRef<HTMLDivElement>(null)
            useClickAway([ref1, ref2], handler)

            return (
                <div>
                    <div ref={ref1} data-testid="inside1">
                        Inside 1
                    </div>
                    <div ref={ref2} data-testid="inside2">
                        Inside 2
                    </div>
                    <div data-testid="outside">Outside</div>
                </div>
            )
        }

        const { getByTestId } = render(<TestComponent />)

        fireEvent.mouseDown(getByTestId('inside1'))
        expect(handler).not.toHaveBeenCalled()

        fireEvent.mouseDown(getByTestId('inside2'))
        expect(handler).not.toHaveBeenCalled()
    })

    it('should support custom event types', () => {
        const handler = jest.fn()

        function TestComponent() {
            const ref = useRef<HTMLDivElement>(null)
            useClickAway(ref, handler, {
                events: ['mouseup', 'focusin'],
            })

            return (
                <div>
                    <div ref={ref} data-testid="inside">
                        Inside
                    </div>
                    <div data-testid="outside">Outside</div>
                </div>
            )
        }

        const { getByTestId } = render(<TestComponent />)

        // mousedown should not trigger (not in events list)
        fireEvent.mouseDown(getByTestId('outside'))
        expect(handler).not.toHaveBeenCalled()

        // mouseup should trigger
        fireEvent.mouseUp(getByTestId('outside'))
        expect(handler).toHaveBeenCalledTimes(1)

        // focusin should trigger
        fireEvent.focusIn(getByTestId('outside'))
        expect(handler).toHaveBeenCalledTimes(2)
    })

    it('should update handler without re-attaching listeners', () => {
        const handler1 = jest.fn()
        const handler2 = jest.fn()

        function TestComponent({ handler }: { handler: () => void }) {
            const ref = useRef<HTMLDivElement>(null)
            useClickAway(ref, handler)

            return (
                <div>
                    <div ref={ref} data-testid="inside">
                        Inside
                    </div>
                    <div data-testid="outside">Outside</div>
                </div>
            )
        }

        const { getByTestId, rerender } = render(
            <TestComponent handler={handler1} />
        )

        fireEvent.mouseDown(getByTestId('outside'))
        expect(handler1).toHaveBeenCalledTimes(1)
        expect(handler2).not.toHaveBeenCalled()

        // Update handler
        rerender(<TestComponent handler={handler2} />)

        fireEvent.mouseDown(getByTestId('outside'))
        expect(handler1).toHaveBeenCalledTimes(1)
        expect(handler2).toHaveBeenCalledTimes(1)
    })

    it('should handle null refs gracefully', () => {
        const handler = jest.fn()

        function TestComponent() {
            const ref = useRef<HTMLDivElement>(null)
            // Don't attach ref to any element
            useClickAway(ref, handler)

            return (
                <div>
                    <div data-testid="outside">Outside</div>
                </div>
            )
        }

        const { getByTestId } = render(<TestComponent />)

        fireEvent.mouseDown(getByTestId('outside'))
        expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should clean up event listeners on unmount', () => {
        const handler = jest.fn()

        function TestComponent() {
            const ref = useRef<HTMLDivElement>(null)
            useClickAway(ref, handler)

            return (
                <div>
                    <div ref={ref} data-testid="inside">
                        Inside
                    </div>
                    <div data-testid="outside">Outside</div>
                </div>
            )
        }

        const { unmount } = render(<TestComponent />)

        unmount()

        // Create a new element to test after unmount
        const outside = document.createElement('div')
        document.body.appendChild(outside)
        fireEvent.mouseDown(outside)
        document.body.removeChild(outside)

        expect(handler).not.toHaveBeenCalled()
    })

    it('should handle nested elements correctly', () => {
        const handler = jest.fn()

        function TestComponent() {
            const ref = useRef<HTMLDivElement>(null)
            useClickAway(ref, handler)

            return (
                <div>
                    <div ref={ref} data-testid="parent">
                        <div data-testid="child">Child</div>
                    </div>
                    <div data-testid="outside">Outside</div>
                </div>
            )
        }

        const { getByTestId } = render(<TestComponent />)

        // Click on child (inside)
        fireEvent.mouseDown(getByTestId('child'))
        expect(handler).not.toHaveBeenCalled()

        // Click outside
        fireEvent.mouseDown(getByTestId('outside'))
        expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should respect capture option', () => {
        const handler = jest.fn()
        const addEventListenerSpy = jest.spyOn(document, 'addEventListener')

        function TestComponent() {
            const ref = useRef<HTMLDivElement>(null)
            useClickAway(ref, handler, { capture: false })

            return (
                <div>
                    <div ref={ref} data-testid="inside">
                        Inside
                    </div>
                </div>
            )
        }

        render(<TestComponent />)

        expect(addEventListenerSpy).toHaveBeenCalledWith(
            'mousedown',
            expect.any(Function),
            false
        )

        addEventListenerSpy.mockRestore()
    })

    it('should work with touchend event', () => {
        const handler = jest.fn()

        function TestComponent() {
            const ref = useRef<HTMLDivElement>(null)
            useClickAway(ref, handler, {
                events: ['touchend'],
            })

            return (
                <div>
                    <div ref={ref} data-testid="inside">
                        Inside
                    </div>
                    <div data-testid="outside">Outside</div>
                </div>
            )
        }

        const { getByTestId } = render(<TestComponent />)

        fireEvent.touchEnd(getByTestId('outside'))
        expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple event types simultaneously', () => {
        const handler = jest.fn()

        function TestComponent() {
            const ref = useRef<HTMLDivElement>(null)
            useClickAway(ref, handler, {
                events: ['mousedown', 'touchstart', 'focusin'],
            })

            return (
                <div>
                    <div ref={ref} data-testid="inside">
                        Inside
                    </div>
                    <div data-testid="outside">Outside</div>
                </div>
            )
        }

        const { getByTestId } = render(<TestComponent />)

        fireEvent.mouseDown(getByTestId('outside'))
        expect(handler).toHaveBeenCalledTimes(1)

        fireEvent.touchStart(getByTestId('outside'))
        expect(handler).toHaveBeenCalledTimes(2)

        fireEvent.focusIn(getByTestId('outside'))
        expect(handler).toHaveBeenCalledTimes(3)
    })

    it('should handle refs changing', () => {
        const handler = jest.fn()

        function TestComponent({ useRef2 }: { useRef2: boolean }) {
            const ref1 = useRef<HTMLDivElement>(null)
            const ref2 = useRef<HTMLDivElement>(null)
            useClickAway(useRef2 ? ref2 : ref1, handler)

            return (
                <div>
                    <div ref={ref1} data-testid="element1">
                        Element 1
                    </div>
                    <div ref={ref2} data-testid="element2">
                        Element 2
                    </div>
                </div>
            )
        }

        const { getByTestId, rerender } = render(
            <TestComponent useRef2={false} />
        )

        // Click on element2 (outside ref1)
        fireEvent.mouseDown(getByTestId('element2'))
        expect(handler).toHaveBeenCalledTimes(1)

        // Switch to ref2
        rerender(<TestComponent useRef2={true} />)
        handler.mockClear()

        // Click on element2 (now inside ref2)
        fireEvent.mouseDown(getByTestId('element2'))
        expect(handler).not.toHaveBeenCalled()

        // Click on element1 (now outside ref2)
        fireEvent.mouseDown(getByTestId('element1'))
        expect(handler).toHaveBeenCalledTimes(1)
    })
})
