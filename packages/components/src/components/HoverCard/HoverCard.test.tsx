import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import HoverCard from './HoverCard'

describe('HoverCard', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    it('renders the trigger', () => {
        render(
            <HoverCard content={<div>Card content</div>}>
                <button>Trigger</button>
            </HoverCard>
        )
        expect(screen.getByText('Trigger')).toBeInTheDocument()
    })

    it('does not show card initially', () => {
        render(
            <HoverCard content={<div>Card content</div>}>
                <button>Trigger</button>
            </HoverCard>
        )
        expect(screen.queryByText('Card content')).not.toBeInTheDocument()
    })

    it('shows card after openDelay when trigger is hovered', () => {
        render(
            <HoverCard content={<div>Card content</div>} openDelay={300}>
                <button>Trigger</button>
            </HoverCard>
        )

        const trigger = screen
            .getByText('Trigger')
            .closest('.hover-card__trigger')!
        fireEvent.mouseEnter(trigger)

        expect(screen.queryByText('Card content')).not.toBeInTheDocument()

        act(() => {
            jest.advanceTimersByTime(300)
        })

        expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('hides card after closeDelay when trigger mouse leaves', () => {
        render(
            <HoverCard
                content={<div>Card content</div>}
                openDelay={0}
                closeDelay={200}
            >
                <button>Trigger</button>
            </HoverCard>
        )

        const trigger = screen
            .getByText('Trigger')
            .closest('.hover-card__trigger')!
        fireEvent.mouseEnter(trigger)
        act(() => jest.advanceTimersByTime(0))

        expect(screen.getByText('Card content')).toBeInTheDocument()

        fireEvent.mouseLeave(trigger)
        act(() => jest.advanceTimersByTime(100))
        expect(screen.getByText('Card content')).toBeInTheDocument()

        act(() => jest.advanceTimersByTime(100))
        expect(screen.queryByText('Card content')).not.toBeInTheDocument()
    })

    it('keeps card open when cursor moves from trigger into the card (hover bridge)', () => {
        render(
            <HoverCard
                content={<div>Card content</div>}
                openDelay={0}
                closeDelay={200}
            >
                <button>Trigger</button>
            </HoverCard>
        )

        const trigger = screen
            .getByText('Trigger')
            .closest('.hover-card__trigger')!
        fireEvent.mouseEnter(trigger)
        act(() => jest.advanceTimersByTime(0))

        // Leave trigger — starts close timer
        fireEvent.mouseLeave(trigger)

        // Enter card before close timer fires — cancels the timer
        const card = screen.getByRole('dialog')
        fireEvent.mouseEnter(card)

        act(() => jest.advanceTimersByTime(300))

        expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('closes the card when cursor leaves the card', () => {
        render(
            <HoverCard
                content={<div>Card content</div>}
                openDelay={0}
                closeDelay={100}
            >
                <button>Trigger</button>
            </HoverCard>
        )

        const trigger = screen
            .getByText('Trigger')
            .closest('.hover-card__trigger')!
        fireEvent.mouseEnter(trigger)
        act(() => jest.advanceTimersByTime(0))

        const card = screen.getByRole('dialog')
        fireEvent.mouseLeave(card)

        act(() => jest.advanceTimersByTime(100))
        expect(screen.queryByText('Card content')).not.toBeInTheDocument()
    })

    it('closes the card on Escape key', () => {
        render(
            <HoverCard content={<div>Card content</div>} openDelay={0}>
                <button>Trigger</button>
            </HoverCard>
        )

        const trigger = screen
            .getByText('Trigger')
            .closest('.hover-card__trigger')!
        fireEvent.mouseEnter(trigger)
        act(() => jest.advanceTimersByTime(0))

        expect(screen.getByText('Card content')).toBeInTheDocument()

        fireEvent.keyDown(document, { key: 'Escape' })
        expect(screen.queryByText('Card content')).not.toBeInTheDocument()
    })

    it('does not open when disabled', () => {
        render(
            <HoverCard content={<div>Card content</div>} openDelay={0} disabled>
                <button>Trigger</button>
            </HoverCard>
        )

        const trigger = screen
            .getByText('Trigger')
            .closest('.hover-card__trigger')!
        fireEvent.mouseEnter(trigger)
        act(() => jest.advanceTimersByTime(100))

        expect(screen.queryByText('Card content')).not.toBeInTheDocument()
    })

    it('respects controlled open prop', () => {
        const { rerender } = render(
            <HoverCard content={<div>Card content</div>} open={false}>
                <button>Trigger</button>
            </HoverCard>
        )

        expect(screen.queryByText('Card content')).not.toBeInTheDocument()

        rerender(
            <HoverCard content={<div>Card content</div>} open={true}>
                <button>Trigger</button>
            </HoverCard>
        )

        expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('calls onOpenChange when open state changes', () => {
        const onOpenChange = jest.fn()
        render(
            <HoverCard
                content={<div>Card content</div>}
                openDelay={0}
                onOpenChange={onOpenChange}
            >
                <button>Trigger</button>
            </HoverCard>
        )

        const trigger = screen
            .getByText('Trigger')
            .closest('.hover-card__trigger')!
        fireEvent.mouseEnter(trigger)
        act(() => jest.advanceTimersByTime(0))

        expect(onOpenChange).toHaveBeenCalledWith(true)
    })
})
