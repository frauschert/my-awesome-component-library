import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import { useDoubleClick } from '../useDoubleClick'

describe('useDoubleClick', () => {
    it('calls onDoubleClick when double pointer down occurs within delay', () => {
        const onDoubleClick = jest.fn()
        function Test() {
            const handlers = useDoubleClick<HTMLDivElement>(onDoubleClick, 300)
            return <div data-testid="target" {...handlers} />
        }
        const { getByTestId } = render(<Test />)
        const target = getByTestId('target')
        // First click
        fireEvent.pointerDown(target, { pointerType: 'mouse' })
        // Second click within delay
        fireEvent.pointerDown(target, { pointerType: 'mouse' })
        expect(onDoubleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onDoubleClick if second click is after delay', () => {
        jest.useFakeTimers()
        const onDoubleClick = jest.fn()
        function Test() {
            const handlers = useDoubleClick(onDoubleClick, 200)
            return <div data-testid="target" {...handlers} />
        }
        const { getByTestId } = render(<Test />)
        const target = getByTestId('target')
        fireEvent.pointerDown(target, { pointerType: 'mouse' })
        jest.advanceTimersByTime(300)
        fireEvent.pointerDown(target, { pointerType: 'mouse' })
        expect(onDoubleClick).not.toHaveBeenCalled()
        jest.useRealTimers()
    })

    it('works for touch and pen pointer types', () => {
        const onDoubleClick = jest.fn()
        function Test() {
            const handlers = useDoubleClick(onDoubleClick, 250)
            return <div data-testid="target" {...handlers} />
        }
        const { getByTestId } = render(<Test />)
        const target = getByTestId('target')
        fireEvent.pointerDown(target, { pointerType: 'touch' })
        fireEvent.pointerDown(target, { pointerType: 'touch' })
        fireEvent.pointerDown(target, { pointerType: 'pen' })
        fireEvent.pointerDown(target, { pointerType: 'pen' })
        expect(onDoubleClick).toHaveBeenCalledTimes(2)
    })

    it('does not call onDoubleClick on first click', () => {
        const onDoubleClick = jest.fn()
        function Test() {
            const handlers = useDoubleClick(onDoubleClick)
            return <div data-testid="target" {...handlers} />
        }
        const { getByTestId } = render(<Test />)
        const target = getByTestId('target')
        fireEvent.pointerDown(target, { pointerType: 'mouse' })
        expect(onDoubleClick).not.toHaveBeenCalled()
    })
})
