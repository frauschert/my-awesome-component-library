import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DatePicker } from './DatePicker'

describe('DatePicker', () => {
    it('renders with label', () => {
        render(<DatePicker label="Select date" />)
        expect(screen.getByText('Select date')).toBeInTheDocument()
    })

    it('shows required indicator when required', () => {
        render(<DatePicker label="Date" required />)
        expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('displays placeholder when no date selected', () => {
        render(<DatePicker placeholder="Pick a date" />)
        expect(screen.getByPlaceholderText('Pick a date')).toBeInTheDocument()
    })

    it('displays formatted date when value is provided', () => {
        const date = new Date(2024, 0, 15) // Jan 15, 2024
        render(<DatePicker value={date} dateFormat="MM/DD/YYYY" />)
        expect(screen.getByDisplayValue('01/15/2024')).toBeInTheDocument()
    })

    it('formats date as DD/MM/YYYY', () => {
        const date = new Date(2024, 0, 15)
        render(<DatePicker value={date} dateFormat="DD/MM/YYYY" />)
        expect(screen.getByDisplayValue('15/01/2024')).toBeInTheDocument()
    })

    it('formats date as YYYY-MM-DD', () => {
        const date = new Date(2024, 0, 15)
        render(<DatePicker value={date} dateFormat="YYYY-MM-DD" />)
        expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument()
    })

    it('opens calendar on input focus', async () => {
        const user = userEvent.setup()
        render(<DatePicker label="Date" />)

        const input = screen.getByLabelText('Date')
        await user.click(input)

        expect(
            screen.getByRole('button', { name: 'Previous month' })
        ).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: 'Next month' })
        ).toBeInTheDocument()
    })

    it('calls onChange when a date is selected', async () => {
        const user = userEvent.setup()
        const handleChange = jest.fn()
        render(<DatePicker onChange={handleChange} />)

        const input = screen.getByRole('textbox')
        await user.click(input)

        // Click on day 15
        const days = screen
            .getAllByRole('button')
            .filter((btn) => btn.textContent === '15')
        await user.click(days[0])

        expect(handleChange).toHaveBeenCalled()
        const selectedDate = handleChange.mock.calls[0][0]
        expect(selectedDate.getDate()).toBe(15)
    })

    it('navigates to previous month', async () => {
        const user = userEvent.setup()
        const date = new Date(2024, 5, 15) // June 2024
        render(<DatePicker value={date} />)

        const input = screen.getByRole('textbox')
        await user.click(input)

        expect(screen.getByText('June 2024')).toBeInTheDocument()

        const prevButton = screen.getByRole('button', {
            name: 'Previous month',
        })
        await user.click(prevButton)

        expect(screen.getByText('May 2024')).toBeInTheDocument()
    })

    it('navigates to next month', async () => {
        const user = userEvent.setup()
        const date = new Date(2024, 5, 15) // June 2024
        render(<DatePicker value={date} />)

        const input = screen.getByRole('textbox')
        await user.click(input)

        expect(screen.getByText('June 2024')).toBeInTheDocument()

        const nextButton = screen.getByRole('button', { name: 'Next month' })
        await user.click(nextButton)

        expect(screen.getByText('July 2024')).toBeInTheDocument()
    })

    it('highlights selected date', async () => {
        const user = userEvent.setup()
        const date = new Date(2024, 5, 15)
        render(<DatePicker value={date} />)

        const input = screen.getByRole('textbox')
        await user.click(input)

        const selectedDay = screen.getByRole('button', { name: '06/15/2024' })
        expect(selectedDay).toHaveClass('datepicker__day--selected')
    })

    it('shows clear button when date is selected', async () => {
        const user = userEvent.setup()
        const date = new Date(2024, 5, 15)
        const handleChange = jest.fn()
        render(<DatePicker value={date} onChange={handleChange} />)

        const clearButton = screen.getByRole('button', { name: 'Clear date' })
        expect(clearButton).toBeInTheDocument()

        await user.click(clearButton)
        expect(handleChange).toHaveBeenCalledWith(null)
    })

    it('disables dates before minDate', async () => {
        const user = userEvent.setup()
        const minDate = new Date(2024, 5, 15)
        render(<DatePicker minDate={minDate} value={new Date(2024, 5, 20)} />)

        const input = screen.getByRole('textbox')
        await user.click(input)

        const day10 = screen.getByRole('button', { name: '06/10/2024' })
        expect(day10).toBeDisabled()
        expect(day10).toHaveClass('datepicker__day--disabled')
    })

    it('disables dates after maxDate', async () => {
        const user = userEvent.setup()
        const maxDate = new Date(2024, 5, 15)
        render(<DatePicker maxDate={maxDate} value={new Date(2024, 5, 10)} />)

        const input = screen.getByRole('textbox')
        await user.click(input)

        const day20 = screen.getByRole('button', { name: '06/20/2024' })
        expect(day20).toBeDisabled()
        expect(day20).toHaveClass('datepicker__day--disabled')
    })

    it('renders error message', () => {
        render(<DatePicker error="Invalid date" />)
        expect(screen.getByText('Invalid date')).toBeInTheDocument()
        expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('renders helper text', () => {
        render(<DatePicker helperText="Choose a date" />)
        expect(screen.getByText('Choose a date')).toBeInTheDocument()
    })

    it('does not show helper text when error is present', () => {
        render(<DatePicker error="Error" helperText="Helper" />)
        expect(screen.getByText('Error')).toBeInTheDocument()
        expect(screen.queryByText('Helper')).not.toBeInTheDocument()
    })

    it('is disabled when disabled prop is true', () => {
        render(<DatePicker disabled label="Date" />)
        const input = screen.getByLabelText('Date')
        expect(input).toBeDisabled()
    })

    it('applies size classes', () => {
        const { container, rerender } = render(<DatePicker size="small" />)
        expect(
            container.querySelector('.datepicker--small')
        ).toBeInTheDocument()

        rerender(<DatePicker size="large" />)
        expect(
            container.querySelector('.datepicker--large')
        ).toBeInTheDocument()
    })

    it('applies custom className', () => {
        const { container } = render(<DatePicker className="custom-picker" />)
        expect(container.querySelector('.custom-picker')).toBeInTheDocument()
    })

    it('closes calendar when clicking outside', async () => {
        const user = userEvent.setup()
        render(
            <div>
                <DatePicker label="Date" />
                <button>Outside</button>
            </div>
        )

        const input = screen.getByLabelText('Date')
        await user.click(input)

        expect(
            screen.getByText(
                /June|July|August|September|October|November|December|January|February|March|April|May/
            )
        ).toBeInTheDocument()

        const outsideButton = screen.getByText('Outside')
        await user.click(outsideButton)

        expect(
            screen.queryByRole('button', { name: 'Previous month' })
        ).not.toBeInTheDocument()
    })
})
