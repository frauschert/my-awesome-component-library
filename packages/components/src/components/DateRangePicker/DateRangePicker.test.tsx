import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DateRangePicker from './DateRangePicker'

describe('DateRangePicker', () => {
    it('renders with placeholder', () => {
        render(<DateRangePicker />)
        expect(
            screen.getByPlaceholderText('Select date range')
        ).toBeInTheDocument()
    })

    it('renders with label', () => {
        render(<DateRangePicker label="Trip dates" />)
        expect(screen.getByLabelText('Trip dates')).toBeInTheDocument()
    })

    it('displays formatted range', () => {
        render(
            <DateRangePicker
                value={{
                    start: new Date(2025, 0, 15),
                    end: new Date(2025, 0, 20),
                }}
            />
        )
        expect(
            screen.getByDisplayValue('01/15/2025 – 01/20/2025')
        ).toBeInTheDocument()
    })

    it('displays partial range when only start selected', () => {
        render(
            <DateRangePicker
                value={{ start: new Date(2025, 0, 15), end: null }}
            />
        )
        expect(screen.getByDisplayValue('01/15/2025 – …')).toBeInTheDocument()
    })

    it('opens dropdown on click', async () => {
        const user = userEvent.setup()
        render(<DateRangePicker />)

        await user.click(screen.getByPlaceholderText('Select date range'))
        // Should show two month calendars with nav buttons
        expect(screen.getByLabelText('Previous month')).toBeInTheDocument()
        expect(screen.getByLabelText('Next month')).toBeInTheDocument()
    })

    it('shows two calendar months side by side', async () => {
        const user = userEvent.setup()
        render(<DateRangePicker />)

        await user.click(screen.getByPlaceholderText('Select date range'))
        // Two sets of weekday headers
        const weekdayHeaders = screen.getAllByText('Su')
        expect(weekdayHeaders.length).toBe(2)
    })

    it('selects start date on first click', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        // Use a fixed month to avoid flakiness
        render(<DateRangePicker onChange={onChange} />)

        await user.click(screen.getByPlaceholderText('Select date range'))

        // Find all day buttons showing "15" — pick the first one that is in-month
        const dayButtons = screen.getAllByText('15')
        const inMonthBtn = dayButtons.find(
            (btn) =>
                !btn.classList.contains('daterangepicker__day--other-month')
        )
        if (inMonthBtn) {
            await user.click(inMonthBtn)
            expect(onChange).toHaveBeenCalledTimes(1)
            const call = onChange.mock.calls[0][0]
            expect(call.start).toBeInstanceOf(Date)
            expect(call.end).toBeNull()
        }
    })

    it('selects end date on second click', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(<DateRangePicker onChange={onChange} />)

        await user.click(screen.getByPlaceholderText('Select date range'))

        const day10Buttons = screen.getAllByText('10')
        const day20Buttons = screen.getAllByText('20')

        const first = day10Buttons.find(
            (btn) =>
                !btn.classList.contains('daterangepicker__day--other-month')
        )
        const second = day20Buttons.find(
            (btn) =>
                !btn.classList.contains('daterangepicker__day--other-month')
        )

        if (first && second) {
            await user.click(first)
            await user.click(second)
            expect(onChange).toHaveBeenCalledTimes(2)
            const call = onChange.mock.calls[1][0]
            expect(call.start).toBeInstanceOf(Date)
            expect(call.end).toBeInstanceOf(Date)
        }
    })

    it('navigates months with arrows', async () => {
        const user = userEvent.setup()
        render(<DateRangePicker />)

        await user.click(screen.getByPlaceholderText('Select date range'))
        const prevBtn = screen.getByLabelText('Previous month')
        const nextBtn = screen.getByLabelText('Next month')

        // These should not throw
        await user.click(nextBtn)
        await user.click(prevBtn)
    })

    it('clears selection', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(
            <DateRangePicker
                defaultValue={{
                    start: new Date(2025, 0, 10),
                    end: new Date(2025, 0, 20),
                }}
                onChange={onChange}
            />
        )

        await user.click(screen.getByLabelText('Clear date range'))
        expect(onChange).toHaveBeenCalledWith({
            start: null,
            end: null,
        })
    })

    it('shows error message', () => {
        render(<DateRangePicker error="Date range is required" />)
        expect(screen.getByRole('alert')).toHaveTextContent(
            'Date range is required'
        )
    })

    it('shows required indicator', () => {
        const { container } = render(<DateRangePicker label="Dates" required />)
        expect(
            container.querySelector('.daterangepicker__required')
        ).toBeInTheDocument()
    })

    it('disables input when disabled', () => {
        render(<DateRangePicker disabled />)
        expect(screen.getByPlaceholderText('Select date range')).toBeDisabled()
    })

    it('does not open when disabled', async () => {
        const user = userEvent.setup()
        render(<DateRangePicker disabled />)

        await user.click(screen.getByPlaceholderText('Select date range'))
        expect(
            screen.queryByLabelText('Previous month')
        ).not.toBeInTheDocument()
    })

    it('closes on outside click', async () => {
        const user = userEvent.setup()
        render(
            <div>
                <DateRangePicker />
                <button>Outside</button>
            </div>
        )

        await user.click(screen.getByPlaceholderText('Select date range'))
        expect(screen.getByLabelText('Previous month')).toBeInTheDocument()

        await user.click(screen.getByText('Outside'))
        expect(
            screen.queryByLabelText('Previous month')
        ).not.toBeInTheDocument()
    })

    it('applies size classes', () => {
        const { container } = render(<DateRangePicker size="large" />)
        expect(container.firstElementChild).toHaveClass(
            'daterangepicker--large'
        )
    })

    it('formats dates according to dateFormat', () => {
        render(
            <DateRangePicker
                value={{
                    start: new Date(2025, 5, 1),
                    end: new Date(2025, 5, 15),
                }}
                dateFormat="YYYY-MM-DD"
            />
        )
        expect(
            screen.getByDisplayValue('2025-06-01 – 2025-06-15')
        ).toBeInTheDocument()
    })

    it('works in controlled mode', () => {
        const { rerender } = render(
            <DateRangePicker
                value={{
                    start: new Date(2025, 0, 1),
                    end: new Date(2025, 0, 5),
                }}
            />
        )
        expect(
            screen.getByDisplayValue('01/01/2025 – 01/05/2025')
        ).toBeInTheDocument()

        rerender(
            <DateRangePicker
                value={{
                    start: new Date(2025, 5, 10),
                    end: new Date(2025, 5, 20),
                }}
            />
        )
        expect(
            screen.getByDisplayValue('06/10/2025 – 06/20/2025')
        ).toBeInTheDocument()
    })
})
