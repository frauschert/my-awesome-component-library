import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TimePicker from './TimePicker'

describe('TimePicker', () => {
    it('renders with placeholder', () => {
        render(<TimePicker />)
        expect(screen.getByPlaceholderText('Select time')).toBeInTheDocument()
    })

    it('renders with label', () => {
        render(<TimePicker label="Start time" />)
        expect(screen.getByLabelText('Start time')).toBeInTheDocument()
    })

    it('displays formatted value in 24h mode', () => {
        render(<TimePicker value={{ hours: 14, minutes: 30 }} />)
        expect(screen.getByDisplayValue('14:30')).toBeInTheDocument()
    })

    it('displays formatted value in 12h mode', () => {
        render(<TimePicker value={{ hours: 14, minutes: 30 }} format="12h" />)
        expect(screen.getByDisplayValue('02:30 PM')).toBeInTheDocument()
    })

    it('displays AM correctly in 12h mode', () => {
        render(<TimePicker value={{ hours: 9, minutes: 0 }} format="12h" />)
        expect(screen.getByDisplayValue('09:00 AM')).toBeInTheDocument()
    })

    it('opens dropdown on click', async () => {
        const user = userEvent.setup()
        render(<TimePicker />)

        await user.click(screen.getByPlaceholderText('Select time'))
        expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('selects hour from dropdown', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(<TimePicker onChange={onChange} />)

        await user.click(screen.getByPlaceholderText('Select time'))
        // Click on hour "09"
        const hourOptions = screen
            .getByRole('group', { name: 'Hours' })
            .querySelectorAll('button')
        await user.click(hourOptions[9]) // hour 09

        expect(onChange).toHaveBeenCalledWith({ hours: 9, minutes: 0 })
    })

    it('selects minute from dropdown', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(
            <TimePicker
                defaultValue={{ hours: 10, minutes: 0 }}
                onChange={onChange}
            />
        )

        await user.click(screen.getByPlaceholderText('Select time'))
        const minuteOptions = screen
            .getByRole('group', { name: 'Minutes' })
            .querySelectorAll('button')
        await user.click(minuteOptions[30]) // minute 30

        expect(onChange).toHaveBeenCalledWith({ hours: 10, minutes: 30 })
    })

    it('respects minuteStep', async () => {
        const user = userEvent.setup()
        render(<TimePicker minuteStep={15} />)

        await user.click(screen.getByPlaceholderText('Select time'))
        const minuteOptions = screen
            .getByRole('group', { name: 'Minutes' })
            .querySelectorAll('button')

        expect(minuteOptions).toHaveLength(4) // 00, 15, 30, 45
    })

    it('shows required indicator', () => {
        const { container } = render(<TimePicker label="Time" required />)
        expect(
            container.querySelector('.timepicker__required')
        ).toBeInTheDocument()
    })

    it('shows error message', () => {
        render(<TimePicker error="Time is required" />)
        expect(screen.getByRole('alert')).toHaveTextContent('Time is required')
    })

    it('disables the input', () => {
        render(<TimePicker disabled />)
        expect(screen.getByPlaceholderText('Select time')).toBeDisabled()
    })

    it('does not open when disabled', async () => {
        const user = userEvent.setup()
        render(<TimePicker disabled />)

        await user.click(screen.getByPlaceholderText('Select time'))
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('closes on outside click', async () => {
        const user = userEvent.setup()
        render(
            <div>
                <TimePicker />
                <button>Outside</button>
            </div>
        )

        await user.click(screen.getByPlaceholderText('Select time'))
        expect(screen.getByRole('listbox')).toBeInTheDocument()

        await user.click(screen.getByText('Outside'))
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('shows 12h period selector', async () => {
        const user = userEvent.setup()
        render(<TimePicker format="12h" />)

        await user.click(screen.getByPlaceholderText('Select time'))
        expect(
            screen.getByRole('group', { name: 'Period' })
        ).toBeInTheDocument()
    })

    it('clears value with clear button', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(
            <TimePicker
                defaultValue={{ hours: 10, minutes: 0 }}
                onChange={onChange}
            />
        )

        await user.click(screen.getByLabelText('Clear time'))
        expect(onChange).toHaveBeenCalled()
    })

    it('applies size classes', () => {
        const { container } = render(<TimePicker size="large" />)
        expect(container.firstElementChild).toHaveClass('timepicker--large')
    })

    it('works in controlled mode', () => {
        const { rerender } = render(
            <TimePicker value={{ hours: 8, minutes: 0 }} />
        )
        expect(screen.getByDisplayValue('08:00')).toBeInTheDocument()

        rerender(<TimePicker value={{ hours: 16, minutes: 45 }} />)
        expect(screen.getByDisplayValue('16:45')).toBeInTheDocument()
    })

    it('shows 12 hours in 12h format and 24 in 24h', async () => {
        const user = userEvent.setup()

        const { unmount } = render(<TimePicker format="24h" />)
        await user.click(screen.getByPlaceholderText('Select time'))
        const hours24 = screen
            .getByRole('group', { name: 'Hours' })
            .querySelectorAll('button')
        expect(hours24).toHaveLength(24)
        unmount()

        render(<TimePicker format="12h" />)
        await user.click(screen.getByPlaceholderText('Select time'))
        const hours12 = screen
            .getByRole('group', { name: 'Hours' })
            .querySelectorAll('button')
        expect(hours12).toHaveLength(12)
    })

    it('forwards ref', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(<TimePicker ref={ref} />)
        expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
})
