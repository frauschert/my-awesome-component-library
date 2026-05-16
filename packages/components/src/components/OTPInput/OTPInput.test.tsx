import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OTPInput from './OTPInput'

describe('OTPInput', () => {
    it('renders correct number of fields', () => {
        render(<OTPInput length={4} />)
        const inputs = screen.getAllByRole('textbox')
        expect(inputs).toHaveLength(4)
    })

    it('renders 6 fields by default', () => {
        render(<OTPInput />)
        const inputs = screen.getAllByRole('textbox')
        expect(inputs).toHaveLength(6)
    })

    it('renders with defaultValue', () => {
        render(<OTPInput length={4} defaultValue="1234" />)
        const inputs = screen.getAllByRole('textbox')
        expect(inputs[0]).toHaveValue('1')
        expect(inputs[1]).toHaveValue('2')
        expect(inputs[2]).toHaveValue('3')
        expect(inputs[3]).toHaveValue('4')
    })

    it('handles typing a digit and auto-focuses next', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(<OTPInput length={4} onChange={onChange} />)

        const inputs = screen.getAllByRole('textbox')
        await user.click(inputs[0])
        await user.type(inputs[0], '5')

        expect(onChange).toHaveBeenCalledWith('5')
        expect(inputs[1]).toHaveFocus()
    })

    it('handles backspace to clear and move back', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(<OTPInput length={4} defaultValue="12" onChange={onChange} />)

        const inputs = screen.getAllByRole('textbox')
        await user.click(inputs[1])
        await user.keyboard('{Backspace}')

        // Should clear digit at index 1
        expect(onChange).toHaveBeenCalledWith('1')
    })

    it('handles backspace on empty field moves to previous', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(<OTPInput length={4} defaultValue="1" onChange={onChange} />)

        const inputs = screen.getAllByRole('textbox')
        await user.click(inputs[1])
        await user.keyboard('{Backspace}')

        // Should clear previous digit and focus it
        expect(onChange).toHaveBeenCalledWith('')
        expect(inputs[0]).toHaveFocus()
    })

    it('calls onComplete when all digits filled', async () => {
        const user = userEvent.setup()
        const onComplete = jest.fn()
        render(
            <OTPInput length={4} defaultValue="123" onComplete={onComplete} />
        )

        const inputs = screen.getAllByRole('textbox')
        await user.click(inputs[3])
        await user.type(inputs[3], '4')

        expect(onComplete).toHaveBeenCalledWith('1234')
    })

    it('handles paste', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        const onComplete = jest.fn()
        render(
            <OTPInput length={4} onChange={onChange} onComplete={onComplete} />
        )

        const inputs = screen.getAllByRole('textbox')
        await user.click(inputs[0])
        await user.paste('9876')

        expect(onChange).toHaveBeenCalledWith('9876')
        expect(onComplete).toHaveBeenCalledWith('9876')
    })

    it('handles paste longer than length', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(<OTPInput length={4} onChange={onChange} />)

        const inputs = screen.getAllByRole('textbox')
        await user.click(inputs[0])
        await user.paste('123456789')

        expect(onChange).toHaveBeenCalledWith('1234')
    })

    it('filters non-numeric characters in number mode', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(<OTPInput length={4} type="number" onChange={onChange} />)

        const inputs = screen.getAllByRole('textbox')
        await user.click(inputs[0])
        await user.paste('12ab')

        expect(onChange).toHaveBeenCalledWith('12')
    })

    it('works in controlled mode', () => {
        const { rerender } = render(<OTPInput length={4} value="12" />)
        const inputs = screen.getAllByRole('textbox')
        expect(inputs[0]).toHaveValue('1')
        expect(inputs[1]).toHaveValue('2')
        expect(inputs[2]).toHaveValue('')

        rerender(<OTPInput length={4} value="1234" />)
        expect(inputs[2]).toHaveValue('3')
        expect(inputs[3]).toHaveValue('4')
    })

    it('disables all fields when disabled', () => {
        render(<OTPInput length={4} disabled />)
        const inputs = screen.getAllByRole('textbox')
        inputs.forEach((input) => expect(input).toBeDisabled())
    })

    it('shows error message string', () => {
        render(<OTPInput error="Invalid code" />)
        expect(screen.getByRole('alert')).toHaveTextContent('Invalid code')
    })

    it('applies error class for boolean error', () => {
        const { container } = render(<OTPInput error />)
        expect(container.firstElementChild).toHaveClass('otp-input--error')
    })

    it('applies size classes', () => {
        const { container } = render(<OTPInput size="large" />)
        expect(container.firstElementChild).toHaveClass('otp-input--large')
    })

    it('navigates with arrow keys', async () => {
        const user = userEvent.setup()
        render(<OTPInput length={4} defaultValue="12" />)

        const inputs = screen.getAllByRole('textbox')
        await user.click(inputs[1])
        await user.keyboard('{ArrowLeft}')
        expect(inputs[0]).toHaveFocus()

        await user.keyboard('{ArrowRight}')
        expect(inputs[1]).toHaveFocus()
    })

    it('forwards ref', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(<OTPInput ref={ref} />)
        expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('has accessible role group', () => {
        render(<OTPInput />)
        expect(screen.getByRole('group')).toHaveAttribute(
            'aria-label',
            'One-time password'
        )
    })

    it('each field has correct aria-label', () => {
        render(<OTPInput length={4} />)
        expect(screen.getByLabelText('Digit 1 of 4')).toBeInTheDocument()
        expect(screen.getByLabelText('Digit 4 of 4')).toBeInTheDocument()
    })
})
