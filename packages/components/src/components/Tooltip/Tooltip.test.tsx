import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import Tooltip from './Tooltip'

describe('Tooltip', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    it('does not show tooltip content initially', () => {
        render(
            <Tooltip content="Tip text">
                <button>Hover me</button>
            </Tooltip>
        )
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })

    it('shows tooltip on mouse enter after delay', () => {
        render(
            <Tooltip content="Tip text" showDelay={0}>
                <button>Hover me</button>
            </Tooltip>
        )
        fireEvent.mouseEnter(screen.getByRole('button'))
        act(() => {
            jest.advanceTimersByTime(0)
        })
        expect(screen.getByRole('tooltip')).toHaveTextContent('Tip text')
    })

    it('hides tooltip on mouse leave', () => {
        render(
            <Tooltip content="Tip text" showDelay={0} hideDelay={0}>
                <button>Hover me</button>
            </Tooltip>
        )
        fireEvent.mouseEnter(screen.getByRole('button'))
        act(() => {
            jest.advanceTimersByTime(0)
        })
        expect(screen.getByRole('tooltip')).toBeInTheDocument()

        fireEvent.mouseLeave(screen.getByRole('button'))
        act(() => {
            jest.advanceTimersByTime(0)
        })
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })

    it('shows tooltip on click when trigger="click"', () => {
        render(
            <Tooltip content="Click tip" trigger="click" showDelay={0}>
                <button>Click me</button>
            </Tooltip>
        )
        fireEvent.click(screen.getByRole('button'))
        act(() => {
            jest.advanceTimersByTime(0)
        })
        expect(screen.getByRole('tooltip')).toHaveTextContent('Click tip')
    })

    it('shows tooltip on focus when trigger="focus"', () => {
        render(
            <Tooltip content="Focus tip" trigger="focus" showDelay={0}>
                <button>Focus me</button>
            </Tooltip>
        )
        fireEvent.focus(screen.getByRole('button'))
        act(() => {
            jest.advanceTimersByTime(0)
        })
        expect(screen.getByRole('tooltip')).toHaveTextContent('Focus tip')
    })

    it('does not show tooltip when disabled', () => {
        render(
            <Tooltip content="Disabled tip" disabled showDelay={0}>
                <button>Hover me</button>
            </Tooltip>
        )
        fireEvent.mouseEnter(screen.getByRole('button'))
        act(() => {
            jest.advanceTimersByTime(0)
        })
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })

    it('supports controlled visibility', () => {
        const { rerender } = render(
            <Tooltip content="Controlled" visible={false}>
                <button>Target</button>
            </Tooltip>
        )
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

        rerender(
            <Tooltip content="Controlled" visible={true}>
                <button>Target</button>
            </Tooltip>
        )
        expect(screen.getByRole('tooltip')).toHaveTextContent('Controlled')
    })

    it('applies placement class', () => {
        render(
            <Tooltip content="Bottom tip" placement="bottom" visible={true}>
                <button>Target</button>
            </Tooltip>
        )
        expect(screen.getByRole('tooltip')).toHaveClass('tooltip--bottom')
    })

    it('renders arrow by default', () => {
        const { container } = render(
            <Tooltip content="Arrow" visible={true}>
                <button>Target</button>
            </Tooltip>
        )
        expect(container.querySelector('.tooltip__arrow')).toBeInTheDocument()
    })

    it('hides arrow when showArrow=false', () => {
        const { container } = render(
            <Tooltip content="No arrow" visible={true} showArrow={false}>
                <button>Target</button>
            </Tooltip>
        )
        expect(
            container.querySelector('.tooltip__arrow')
        ).not.toBeInTheDocument()
    })

    it('applies custom className', () => {
        render(
            <Tooltip content="Custom" visible={true} className="my-tooltip">
                <button>Target</button>
            </Tooltip>
        )
        expect(screen.getByRole('tooltip')).toHaveClass('my-tooltip')
    })
})
