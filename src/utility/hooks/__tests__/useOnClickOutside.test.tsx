import React, { useRef, useState } from 'react'
import { render, fireEvent } from '@testing-library/react'
import useOnClickOutside from '../useOnClickOutside'

describe('useOnClickOutside', () => {
    describe('basic functionality', () => {
        it('calls handler when clicking outside element', () => {
            const handler = jest.fn()

            function TestComponent() {
                const ref = useRef<HTMLDivElement>(null)
                useOnClickOutside(ref, handler)

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

        it('does not call handler when clicking inside element', () => {
            const handler = jest.fn()

            function TestComponent() {
                const ref = useRef<HTMLDivElement>(null)
                useOnClickOutside(ref, handler)

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

        it('works with touch events', () => {
            const handler = jest.fn()

            function TestComponent() {
                const ref = useRef<HTMLDivElement>(null)
                useOnClickOutside(ref, handler)

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

        it('does not call handler for touch events inside element', () => {
            const handler = jest.fn()

            function TestComponent() {
                const ref = useRef<HTMLDivElement>(null)
                useOnClickOutside(ref, handler)

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

            fireEvent.touchStart(getByTestId('inside'))
            expect(handler).not.toHaveBeenCalled()
        })
    })

    describe('multiple refs', () => {
        it('works with array of refs', () => {
            const handler = jest.fn()

            function TestComponent() {
                const ref1 = useRef<HTMLDivElement>(null)
                const ref2 = useRef<HTMLDivElement>(null)
                useOnClickOutside([ref1, ref2], handler)

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

        it('does not call handler when clicking any of the refs', () => {
            const handler = jest.fn()

            function TestComponent() {
                const ref1 = useRef<HTMLDivElement>(null)
                const ref2 = useRef<HTMLDivElement>(null)
                useOnClickOutside([ref1, ref2], handler)

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

        it('handles clicking children of multiple refs', () => {
            const handler = jest.fn()

            function TestComponent() {
                const ref1 = useRef<HTMLDivElement>(null)
                const ref2 = useRef<HTMLDivElement>(null)
                useOnClickOutside([ref1, ref2], handler)

                return (
                    <div>
                        <div ref={ref1} data-testid="inside1">
                            <button data-testid="button1">Button 1</button>
                        </div>
                        <div ref={ref2} data-testid="inside2">
                            <button data-testid="button2">Button 2</button>
                        </div>
                        <div data-testid="outside">Outside</div>
                    </div>
                )
            }

            const { getByTestId } = render(<TestComponent />)

            fireEvent.mouseDown(getByTestId('button1'))
            expect(handler).not.toHaveBeenCalled()

            fireEvent.mouseDown(getByTestId('button2'))
            expect(handler).not.toHaveBeenCalled()

            fireEvent.mouseDown(getByTestId('outside'))
            expect(handler).toHaveBeenCalledTimes(1)
        })
    })

    describe('nested elements', () => {
        it('does not call handler when clicking nested children', () => {
            const handler = jest.fn()

            function TestComponent() {
                const ref = useRef<HTMLDivElement>(null)
                useOnClickOutside(ref, handler)

                return (
                    <div>
                        <div ref={ref} data-testid="parent">
                            <div data-testid="child">
                                <button data-testid="nested-button">
                                    Nested Button
                                </button>
                            </div>
                        </div>
                        <div data-testid="outside">Outside</div>
                    </div>
                )
            }

            const { getByTestId } = render(<TestComponent />)

            fireEvent.mouseDown(getByTestId('nested-button'))
            expect(handler).not.toHaveBeenCalled()

            fireEvent.mouseDown(getByTestId('child'))
            expect(handler).not.toHaveBeenCalled()

            fireEvent.mouseDown(getByTestId('parent'))
            expect(handler).not.toHaveBeenCalled()
        })
    })

    describe('handler updates', () => {
        it('uses latest handler without re-subscribing', () => {
            const addEventListenerSpy = jest.spyOn(document, 'addEventListener')
            const removeEventListenerSpy = jest.spyOn(
                document,
                'removeEventListener'
            )

            const handler1 = jest.fn()
            const handler2 = jest.fn()

            function TestComponent({ onClickOutside }: any) {
                const ref = useRef<HTMLDivElement>(null)
                useOnClickOutside(ref, onClickOutside)

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
                <TestComponent onClickOutside={handler1} />
            )

            const initialMouseDownCalls = addEventListenerSpy.mock.calls.filter(
                ([event]) => event === 'mousedown'
            ).length
            const initialTouchStartCalls =
                addEventListenerSpy.mock.calls.filter(
                    ([event]) => event === 'touchstart'
                ).length

            // Change handler
            rerender(<TestComponent onClickOutside={handler2} />)

            // Should not re-subscribe
            const afterRerenderMouseDownCalls =
                addEventListenerSpy.mock.calls.filter(
                    ([event]) => event === 'mousedown'
                ).length
            const afterRerenderTouchStartCalls =
                addEventListenerSpy.mock.calls.filter(
                    ([event]) => event === 'touchstart'
                ).length

            expect(afterRerenderMouseDownCalls).toBe(initialMouseDownCalls)
            expect(afterRerenderTouchStartCalls).toBe(initialTouchStartCalls)

            // Should use the new handler
            fireEvent.mouseDown(getByTestId('outside'))
            expect(handler1).not.toHaveBeenCalled()
            expect(handler2).toHaveBeenCalledTimes(1)

            addEventListenerSpy.mockRestore()
            removeEventListenerSpy.mockRestore()
        })

        it('always calls the latest handler', () => {
            let currentHandler = jest.fn()

            function TestComponent() {
                const [count, setCount] = useState(0)
                const ref = useRef<HTMLDivElement>(null)

                // Handler uses current state
                useOnClickOutside(ref, () => {
                    currentHandler(count)
                })

                return (
                    <div>
                        <div ref={ref} data-testid="inside">
                            Count: {count}
                        </div>
                        <button
                            onClick={() => setCount((c) => c + 1)}
                            data-testid="increment"
                        >
                            Increment
                        </button>
                        <div data-testid="outside">Outside</div>
                    </div>
                )
            }

            const { getByTestId } = render(<TestComponent />)

            // Click outside with count = 0
            fireEvent.mouseDown(getByTestId('outside'))
            expect(currentHandler).toHaveBeenLastCalledWith(0)

            // Increment count
            fireEvent.click(getByTestId('increment'))

            // Click outside with count = 1
            currentHandler = jest.fn()
            fireEvent.mouseDown(getByTestId('outside'))
            expect(currentHandler).toHaveBeenLastCalledWith(1)
        })
    })

    describe('cleanup', () => {
        it('removes event listeners on unmount', () => {
            const removeEventListenerSpy = jest.spyOn(
                document,
                'removeEventListener'
            )
            const handler = jest.fn()

            function TestComponent() {
                const ref = useRef<HTMLDivElement>(null)
                useOnClickOutside(ref, handler)

                return (
                    <div>
                        <div ref={ref} data-testid="inside">
                            Inside
                        </div>
                    </div>
                )
            }

            const { unmount } = render(<TestComponent />)

            const mouseDownCallsBefore =
                removeEventListenerSpy.mock.calls.filter(
                    ([event]) => event === 'mousedown'
                ).length

            unmount()

            const mouseDownCallsAfter =
                removeEventListenerSpy.mock.calls.filter(
                    ([event]) => event === 'mousedown'
                ).length

            expect(mouseDownCallsAfter).toBeGreaterThan(mouseDownCallsBefore)

            removeEventListenerSpy.mockRestore()
        })

        it('does not call handler after unmount', () => {
            const handler = jest.fn()

            function TestComponent() {
                const ref = useRef<HTMLDivElement>(null)
                useOnClickOutside(ref, handler)

                return (
                    <div>
                        <div ref={ref} data-testid="inside">
                            Inside
                        </div>
                    </div>
                )
            }

            const { unmount, container } = render(<TestComponent />)
            unmount()

            fireEvent.mouseDown(container)
            expect(handler).not.toHaveBeenCalled()
        })
    })

    describe('null ref handling', () => {
        it('handles null ref gracefully', () => {
            const handler = jest.fn()

            function TestComponent() {
                const ref = useRef<HTMLDivElement>(null)
                useOnClickOutside(ref, handler)

                return (
                    <div>
                        <div data-testid="outside">Outside</div>
                    </div>
                )
            }

            const { getByTestId } = render(<TestComponent />)

            // Should not throw
            expect(() => {
                fireEvent.mouseDown(getByTestId('outside'))
            }).not.toThrow()

            expect(handler).toHaveBeenCalledTimes(1)
        })

        it('handles undefined refs parameter', () => {
            const handler = jest.fn()

            function TestComponent() {
                useOnClickOutside(undefined as any, handler)

                return (
                    <div>
                        <div data-testid="outside">Outside</div>
                    </div>
                )
            }

            const { getByTestId } = render(<TestComponent />)

            // Should not throw
            expect(() => {
                fireEvent.mouseDown(getByTestId('outside'))
            }).not.toThrow()

            // Handler should not be called since refs is undefined
            expect(handler).not.toHaveBeenCalled()
        })

        it('handles array with null refs', () => {
            const handler = jest.fn()

            function TestComponent() {
                const ref1 = useRef<HTMLDivElement>(null)
                const ref2 = useRef<HTMLDivElement>(null)
                useOnClickOutside([ref1, ref2], handler)

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
    })

    describe('practical use cases', () => {
        it('works for dropdown menu', () => {
            const handler = jest.fn()

            function Dropdown() {
                const [isOpen, setIsOpen] = useState(true)
                const dropdownRef = useRef<HTMLDivElement>(null)

                useOnClickOutside(dropdownRef, () => {
                    setIsOpen(false)
                    handler()
                })

                return (
                    <div>
                        <div ref={dropdownRef} data-testid="dropdown">
                            {isOpen && (
                                <ul>
                                    <li>Item 1</li>
                                    <li>Item 2</li>
                                </ul>
                            )}
                        </div>
                        <div data-testid="outside">Outside</div>
                    </div>
                )
            }

            const { getByTestId, queryByText } = render(<Dropdown />)

            expect(queryByText('Item 1')).toBeInTheDocument()

            fireEvent.mouseDown(getByTestId('outside'))

            expect(handler).toHaveBeenCalledTimes(1)
            expect(queryByText('Item 1')).not.toBeInTheDocument()
        })

        it('works for modal with backdrop', () => {
            const onClose = jest.fn()

            function Modal() {
                const modalRef = useRef<HTMLDivElement>(null)
                useOnClickOutside(modalRef, onClose)

                return (
                    <div data-testid="backdrop">
                        <div ref={modalRef} data-testid="modal">
                            <h1>Modal Title</h1>
                            <button data-testid="modal-button">Action</button>
                        </div>
                    </div>
                )
            }

            const { getByTestId } = render(<Modal />)

            // Clicking inside modal should not close
            fireEvent.mouseDown(getByTestId('modal'))
            expect(onClose).not.toHaveBeenCalled()

            fireEvent.mouseDown(getByTestId('modal-button'))
            expect(onClose).not.toHaveBeenCalled()

            // Clicking backdrop should close
            fireEvent.mouseDown(getByTestId('backdrop'))
            expect(onClose).toHaveBeenCalledTimes(1)
        })

        it('works for tooltip', () => {
            const onClose = jest.fn()

            function Tooltip() {
                const [isVisible, setIsVisible] = useState(true)
                const tooltipRef = useRef<HTMLDivElement>(null)

                useOnClickOutside(tooltipRef, () => {
                    setIsVisible(false)
                    onClose()
                })

                return (
                    <div>
                        {isVisible && (
                            <div ref={tooltipRef} data-testid="tooltip">
                                Tooltip content
                            </div>
                        )}
                        <div data-testid="outside">Outside</div>
                    </div>
                )
            }

            const { getByTestId, queryByTestId } = render(<Tooltip />)

            expect(queryByTestId('tooltip')).toBeInTheDocument()

            fireEvent.mouseDown(getByTestId('outside'))

            expect(onClose).toHaveBeenCalledTimes(1)
            expect(queryByTestId('tooltip')).not.toBeInTheDocument()
        })

        it('works for search box with suggestions', () => {
            const onCloseSuggestions = jest.fn()

            function SearchBox() {
                const [showSuggestions, setShowSuggestions] = useState(true)
                const searchRef = useRef<HTMLDivElement>(null)

                useOnClickOutside(searchRef, () => {
                    setShowSuggestions(false)
                    onCloseSuggestions()
                })

                return (
                    <div>
                        <div ref={searchRef} data-testid="search-container">
                            <input
                                data-testid="search-input"
                                placeholder="Search..."
                            />
                            {showSuggestions && (
                                <ul data-testid="suggestions">
                                    <li>Suggestion 1</li>
                                    <li>Suggestion 2</li>
                                </ul>
                            )}
                        </div>
                        <div data-testid="outside">Outside content</div>
                    </div>
                )
            }

            const { getByTestId, queryByTestId } = render(<SearchBox />)

            // Clicking input should not close suggestions
            fireEvent.mouseDown(getByTestId('search-input'))
            expect(onCloseSuggestions).not.toHaveBeenCalled()
            expect(queryByTestId('suggestions')).toBeInTheDocument()

            // Clicking outside should close
            fireEvent.mouseDown(getByTestId('outside'))
            expect(onCloseSuggestions).toHaveBeenCalledTimes(1)
            expect(queryByTestId('suggestions')).not.toBeInTheDocument()
        })
    })

    describe('edge cases', () => {
        it('handles rapid clicks correctly', () => {
            const handler = jest.fn()

            function TestComponent() {
                const ref = useRef<HTMLDivElement>(null)
                useOnClickOutside(ref, handler)

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

            // Rapid clicks
            fireEvent.mouseDown(getByTestId('outside'))
            fireEvent.mouseDown(getByTestId('outside'))
            fireEvent.mouseDown(getByTestId('outside'))

            expect(handler).toHaveBeenCalledTimes(3)
        })

        it('handles alternating inside/outside clicks', () => {
            const handler = jest.fn()

            function TestComponent() {
                const ref = useRef<HTMLDivElement>(null)
                useOnClickOutside(ref, handler)

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

            fireEvent.mouseDown(getByTestId('inside'))
            expect(handler).toHaveBeenCalledTimes(1)

            fireEvent.mouseDown(getByTestId('outside'))
            expect(handler).toHaveBeenCalledTimes(2)

            fireEvent.mouseDown(getByTestId('inside'))
            expect(handler).toHaveBeenCalledTimes(2)
        })

        it('passes event object to handler', () => {
            let capturedEvent: MouseEvent | TouchEvent | null = null

            function TestComponent() {
                const ref = useRef<HTMLDivElement>(null)
                useOnClickOutside(ref, (event) => {
                    capturedEvent = event
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

            expect(capturedEvent).not.toBeNull()
            expect(capturedEvent).toBeInstanceOf(MouseEvent)
        })
    })
})
