import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SegmentedControl from './SegmentedControl'

const items = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
]

const itemsWithDisabled = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week', disabled: true },
    { value: 'month', label: 'Month' },
]

describe('SegmentedControl', () => {
    it('renders all items', () => {
        render(<SegmentedControl items={items} />)
        expect(screen.getByRole('radio', { name: 'Day' })).toBeInTheDocument()
        expect(screen.getByRole('radio', { name: 'Week' })).toBeInTheDocument()
        expect(screen.getByRole('radio', { name: 'Month' })).toBeInTheDocument()
    })

    it('uses role="radiogroup"', () => {
        render(<SegmentedControl items={items} aria-label="View" />)
        expect(
            screen.getByRole('radiogroup', { name: 'View' })
        ).toBeInTheDocument()
    })

    it('reflects the controlled value', () => {
        render(
            <SegmentedControl items={items} value="week" onChange={() => {}} />
        )
        expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute(
            'aria-checked',
            'true'
        )
        expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute(
            'aria-checked',
            'false'
        )
    })

    it('calls onChange when a segment is clicked', () => {
        const onChange = jest.fn()
        render(
            <SegmentedControl items={items} value="day" onChange={onChange} />
        )
        fireEvent.click(screen.getByRole('radio', { name: 'Week' }))
        expect(onChange).toHaveBeenCalledWith('week')
    })

    it('does not call onChange when clicking the already-selected item', () => {
        const onChange = jest.fn()
        render(
            <SegmentedControl items={items} value="day" onChange={onChange} />
        )
        fireEvent.click(screen.getByRole('radio', { name: 'Day' }))
        expect(onChange).not.toHaveBeenCalled()
    })

    it('works in uncontrolled mode with defaultValue', () => {
        render(<SegmentedControl items={items} defaultValue="week" />)
        expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute(
            'aria-checked',
            'true'
        )
    })

    it('disables individual items', () => {
        render(<SegmentedControl items={itemsWithDisabled} />)
        expect(screen.getByRole('radio', { name: 'Week' })).toBeDisabled()
    })

    it('does not call onChange when a disabled item is clicked', () => {
        const onChange = jest.fn()
        render(
            <SegmentedControl
                items={itemsWithDisabled}
                value="day"
                onChange={onChange}
            />
        )
        fireEvent.click(screen.getByRole('radio', { name: 'Week' }))
        expect(onChange).not.toHaveBeenCalled()
    })

    it('disables all items when disabled prop is set', () => {
        render(<SegmentedControl items={items} disabled />)
        items.forEach(({ label }) => {
            expect(screen.getByRole('radio', { name: label })).toBeDisabled()
        })
    })

    it('navigates with arrow keys', async () => {
        const onChange = jest.fn()
        render(
            <SegmentedControl items={items} value="day" onChange={onChange} />
        )
        const dayBtn = screen.getByRole('radio', { name: 'Day' })
        dayBtn.focus()
        fireEvent.keyDown(dayBtn, { key: 'ArrowRight' })
        expect(onChange).toHaveBeenCalledWith('week')
    })

    it('wraps from last to first with ArrowRight', async () => {
        const onChange = jest.fn()
        render(
            <SegmentedControl items={items} value="month" onChange={onChange} />
        )
        const monthBtn = screen.getByRole('radio', { name: 'Month' })
        monthBtn.focus()
        fireEvent.keyDown(monthBtn, { key: 'ArrowRight' })
        expect(onChange).toHaveBeenCalledWith('day')
    })

    it('navigates to first with Home key', () => {
        const onChange = jest.fn()
        render(
            <SegmentedControl items={items} value="month" onChange={onChange} />
        )
        const monthBtn = screen.getByRole('radio', { name: 'Month' })
        monthBtn.focus()
        fireEvent.keyDown(monthBtn, { key: 'Home' })
        expect(onChange).toHaveBeenCalledWith('day')
    })

    it('navigates to last with End key', () => {
        const onChange = jest.fn()
        render(
            <SegmentedControl items={items} value="day" onChange={onChange} />
        )
        const dayBtn = screen.getByRole('radio', { name: 'Day' })
        dayBtn.focus()
        fireEvent.keyDown(dayBtn, { key: 'End' })
        expect(onChange).toHaveBeenCalledWith('month')
    })

    it('renders icons when provided', () => {
        const itemsWithIcons = [
            {
                value: 'list',
                label: 'List',
                icon: <span data-testid="icon-list">☰</span>,
            },
            {
                value: 'grid',
                label: 'Grid',
                icon: <span data-testid="icon-grid">⊞</span>,
            },
        ]
        render(<SegmentedControl items={itemsWithIcons} />)
        expect(screen.getByTestId('icon-list')).toBeInTheDocument()
        expect(screen.getByTestId('icon-grid')).toBeInTheDocument()
    })

    it('applies aria-label to items when provided', () => {
        const itemsWithAriaLabels = [
            { value: 'list', label: '☰', 'aria-label': 'List view' },
            { value: 'grid', label: '⊞', 'aria-label': 'Grid view' },
        ]
        render(<SegmentedControl items={itemsWithAriaLabels} />)
        expect(
            screen.getByRole('radio', { name: 'List view' })
        ).toBeInTheDocument()
    })

    it('selected item has tabIndex=0, others have tabIndex=-1', () => {
        render(
            <SegmentedControl items={items} value="week" onChange={() => {}} />
        )
        expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute(
            'tabindex',
            '0'
        )
        expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute(
            'tabindex',
            '-1'
        )
    })
})
