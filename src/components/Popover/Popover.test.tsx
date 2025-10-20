import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import Popover from './Popover'

describe('Popover', () => {
    describe('Rendering', () => {
        it('renders trigger element', () => {
            render(
                <Popover content="Popover content">
                    <button>Trigger</button>
                </Popover>
            )
            expect(screen.getByText('Trigger')).toBeInTheDocument()
        })

        it('does not show content by default', () => {
            render(
                <Popover content="Popover content">
                    <button>Trigger</button>
                </Popover>
            )
            expect(
                screen.queryByText('Popover content')
            ).not.toBeInTheDocument()
        })

        it('shows content when defaultOpen is true', () => {
            render(
                <Popover content="Popover content" defaultOpen>
                    <button>Trigger</button>
                </Popover>
            )
            expect(screen.getByText('Popover content')).toBeInTheDocument()
        })

        it('applies custom className', () => {
            render(
                <Popover
                    content="Content"
                    className="custom-popover"
                    defaultOpen
                >
                    <button>Trigger</button>
                </Popover>
            )
            const popover = screen.getByRole('dialog')
            expect(popover).toHaveClass('custom-popover')
        })

        it('renders arrow when showArrow is true', () => {
            render(
                <Popover content="Content" showArrow defaultOpen>
                    <button>Trigger</button>
                </Popover>
            )
            expect(
                document.body.querySelector('.popover__arrow')
            ).toBeInTheDocument()
        })

        it('does not render arrow when showArrow is false', () => {
            render(
                <Popover content="Content" showArrow={false} defaultOpen>
                    <button>Trigger</button>
                </Popover>
            )
            expect(
                document.body.querySelector('.popover__arrow')
            ).not.toBeInTheDocument()
        })
    })

    describe('Click Trigger', () => {
        it('opens on click', () => {
            render(
                <Popover content="Popover content" trigger="click">
                    <button>Trigger</button>
                </Popover>
            )
            fireEvent.click(screen.getByText('Trigger'))
            expect(screen.getByText('Popover content')).toBeInTheDocument()
        })

        it('closes on second click', () => {
            render(
                <Popover content="Popover content" trigger="click">
                    <button>Trigger</button>
                </Popover>
            )
            const trigger = screen.getByText('Trigger')
            fireEvent.click(trigger)
            expect(screen.getByText('Popover content')).toBeInTheDocument()
            fireEvent.click(trigger)
            expect(
                screen.queryByText('Popover content')
            ).not.toBeInTheDocument()
        })

        it('closes on click outside', () => {
            render(
                <>
                    <div data-testid="outside">Outside</div>
                    <Popover content="Popover content" trigger="click">
                        <button>Trigger</button>
                    </Popover>
                </>
            )
            fireEvent.click(screen.getByText('Trigger'))
            expect(screen.getByText('Popover content')).toBeInTheDocument()
            fireEvent.mouseDown(screen.getByTestId('outside'))
            expect(
                screen.queryByText('Popover content')
            ).not.toBeInTheDocument()
        })

        it('does not close on click inside', () => {
            render(
                <Popover content="Popover content" trigger="click">
                    <button>Trigger</button>
                </Popover>
            )
            fireEvent.click(screen.getByText('Trigger'))
            fireEvent.mouseDown(screen.getByText('Popover content'))
            expect(screen.getByText('Popover content')).toBeInTheDocument()
        })

        it('respects closeOnClickOutside prop', () => {
            render(
                <>
                    <div data-testid="outside">Outside</div>
                    <Popover
                        content="Popover content"
                        trigger="click"
                        closeOnClickOutside={false}
                    >
                        <button>Trigger</button>
                    </Popover>
                </>
            )
            fireEvent.click(screen.getByText('Trigger'))
            fireEvent.mouseDown(screen.getByTestId('outside'))
            expect(screen.getByText('Popover content')).toBeInTheDocument()
        })
    })

    describe('Hover Trigger', () => {
        beforeEach(() => {
            jest.useFakeTimers()
        })

        afterEach(() => {
            jest.runOnlyPendingTimers()
            jest.useRealTimers()
        })

        it('opens on mouse enter after delay', () => {
            render(
                <Popover
                    content="Popover content"
                    trigger="hover"
                    mouseEnterDelay={100}
                >
                    <button>Trigger</button>
                </Popover>
            )
            fireEvent.mouseEnter(screen.getByText('Trigger'))
            expect(
                screen.queryByText('Popover content')
            ).not.toBeInTheDocument()
            act(() => {
                jest.advanceTimersByTime(100)
            })
            expect(screen.getByText('Popover content')).toBeInTheDocument()
        })

        it('closes on mouse leave after delay', () => {
            render(
                <Popover
                    content="Popover content"
                    trigger="hover"
                    mouseEnterDelay={100}
                    mouseLeaveDelay={100}
                >
                    <button>Trigger</button>
                </Popover>
            )
            fireEvent.mouseEnter(screen.getByText('Trigger'))
            act(() => {
                jest.advanceTimersByTime(100)
            })
            expect(screen.getByText('Popover content')).toBeInTheDocument()

            fireEvent.mouseLeave(screen.getByText('Trigger'))
            act(() => {
                jest.advanceTimersByTime(100)
            })
            expect(
                screen.queryByText('Popover content')
            ).not.toBeInTheDocument()
        })

        it('stays open when hovering over popover', () => {
            render(
                <Popover
                    content="Popover content"
                    trigger="hover"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={100}
                >
                    <button>Trigger</button>
                </Popover>
            )
            fireEvent.mouseEnter(screen.getByText('Trigger'))
            act(() => {
                jest.runAllTimers()
            })
            expect(screen.getByText('Popover content')).toBeInTheDocument()

            fireEvent.mouseLeave(screen.getByText('Trigger'))
            fireEvent.mouseEnter(screen.getByRole('dialog'))
            act(() => {
                jest.advanceTimersByTime(100)
            })
            expect(screen.getByText('Popover content')).toBeInTheDocument()
        })
    })

    describe('Focus Trigger', () => {
        it('opens on focus', () => {
            render(
                <Popover content="Popover content" trigger="focus">
                    <button>Trigger</button>
                </Popover>
            )
            fireEvent.focus(screen.getByText('Trigger'))
            expect(screen.getByText('Popover content')).toBeInTheDocument()
        })

        it('closes on blur', () => {
            render(
                <Popover content="Popover content" trigger="focus">
                    <button>Trigger</button>
                </Popover>
            )
            const trigger = screen.getByText('Trigger')
            fireEvent.focus(trigger)
            expect(screen.getByText('Popover content')).toBeInTheDocument()
            fireEvent.blur(trigger)
            expect(
                screen.queryByText('Popover content')
            ).not.toBeInTheDocument()
        })
    })

    describe('Manual Control', () => {
        it('respects controlled open state', () => {
            const { rerender } = render(
                <Popover
                    content="Popover content"
                    trigger="manual"
                    open={false}
                >
                    <button>Trigger</button>
                </Popover>
            )
            expect(
                screen.queryByText('Popover content')
            ).not.toBeInTheDocument()

            rerender(
                <Popover content="Popover content" trigger="manual" open={true}>
                    <button>Trigger</button>
                </Popover>
            )
            expect(screen.getByText('Popover content')).toBeInTheDocument()
        })

        it('calls onOpenChange when state changes', () => {
            const handleOpenChange = jest.fn()
            render(
                <Popover
                    content="Popover content"
                    trigger="click"
                    onOpenChange={handleOpenChange}
                >
                    <button>Trigger</button>
                </Popover>
            )
            fireEvent.click(screen.getByText('Trigger'))
            expect(handleOpenChange).toHaveBeenCalledWith(true)
        })
    })

    describe('Keyboard Interaction', () => {
        it('closes on Escape key', () => {
            render(
                <Popover content="Popover content" trigger="click">
                    <button>Trigger</button>
                </Popover>
            )
            fireEvent.click(screen.getByText('Trigger'))
            expect(screen.getByText('Popover content')).toBeInTheDocument()
            fireEvent.keyDown(document, { key: 'Escape' })
            expect(
                screen.queryByText('Popover content')
            ).not.toBeInTheDocument()
        })

        it('respects closeOnEscape prop', () => {
            render(
                <Popover
                    content="Popover content"
                    trigger="click"
                    closeOnEscape={false}
                >
                    <button>Trigger</button>
                </Popover>
            )
            fireEvent.click(screen.getByText('Trigger'))
            fireEvent.keyDown(document, { key: 'Escape' })
            expect(screen.getByText('Popover content')).toBeInTheDocument()
        })
    })

    describe('Disabled State', () => {
        it('does not open when disabled', () => {
            render(
                <Popover content="Popover content" trigger="click" disabled>
                    <button>Trigger</button>
                </Popover>
            )
            fireEvent.click(screen.getByText('Trigger'))
            expect(
                screen.queryByText('Popover content')
            ).not.toBeInTheDocument()
        })

        it('does not respond to hover when disabled', () => {
            jest.useFakeTimers()
            render(
                <Popover content="Popover content" trigger="hover" disabled>
                    <button>Trigger</button>
                </Popover>
            )
            fireEvent.mouseEnter(screen.getByText('Trigger'))
            jest.runAllTimers()
            expect(
                screen.queryByText('Popover content')
            ).not.toBeInTheDocument()
            jest.useRealTimers()
        })
    })

    describe('Placement', () => {
        it('applies correct arrow class for bottom placement', () => {
            render(
                <Popover content="Content" placement="bottom" defaultOpen>
                    <button>Trigger</button>
                </Popover>
            )
            const arrow = document.body.querySelector('.popover__arrow')
            expect(arrow).toHaveClass('popover__arrow--bottom')
        })

        it('applies correct arrow class for top-start placement', () => {
            render(
                <Popover content="Content" placement="top-start" defaultOpen>
                    <button>Trigger</button>
                </Popover>
            )
            const arrow = document.body.querySelector('.popover__arrow')
            expect(arrow).toHaveClass('popover__arrow--top-start')
        })

        it('applies correct arrow class for right-end placement', () => {
            render(
                <Popover content="Content" placement="right-end" defaultOpen>
                    <button>Trigger</button>
                </Popover>
            )
            const arrow = document.body.querySelector('.popover__arrow')
            expect(arrow).toHaveClass('popover__arrow--right-end')
        })
    })

    describe('Custom Styling', () => {
        it('applies custom z-index', () => {
            render(
                <Popover content="Content" zIndex={2000} defaultOpen>
                    <button>Trigger</button>
                </Popover>
            )
            const popover = screen.getByRole('dialog')
            expect(popover).toHaveStyle({ zIndex: 2000 })
        })
    })

    describe('Accessibility', () => {
        it('has role dialog', () => {
            render(
                <Popover content="Popover content" defaultOpen>
                    <button>Trigger</button>
                </Popover>
            )
            expect(screen.getByRole('dialog')).toBeInTheDocument()
        })

        it('sets aria-modal to false', () => {
            render(
                <Popover content="Popover content" defaultOpen>
                    <button>Trigger</button>
                </Popover>
            )
            expect(screen.getByRole('dialog')).toHaveAttribute(
                'aria-modal',
                'false'
            )
        })
    })
})
