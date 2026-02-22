import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NumberStepper from './NumberStepper'

describe('NumberStepper', () => {
    it('renders with default value', () => {
        render(<NumberStepper />)
        expect(screen.getByRole('spinbutton')).toHaveValue('0')
    })

    it('renders with defaultValue', () => {
        render(<NumberStepper defaultValue={5} />)
        expect(screen.getByRole('spinbutton')).toHaveValue('5')
    })

    it('renders label', () => {
        render(<NumberStepper label="Quantity" id="qty" />)
        expect(screen.getByLabelText('Quantity')).toBeInTheDocument()
    })

    it('increments on plus button click', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(<NumberStepper defaultValue={3} onChange={onChange} />)

        await user.click(screen.getByLabelText('Increase value'))
        expect(onChange).toHaveBeenCalledWith(4)
    })

    it('decrements on minus button click', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(<NumberStepper defaultValue={3} onChange={onChange} />)

        await user.click(screen.getByLabelText('Decrease value'))
        expect(onChange).toHaveBeenCalledWith(2)
    })

    it('respects min boundary', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(<NumberStepper defaultValue={0} min={0} onChange={onChange} />)

        const decBtn = screen.getByLabelText('Decrease value')
        expect(decBtn).toBeDisabled()

        await user.click(decBtn)
        expect(onChange).not.toHaveBeenCalled()
    })

    it('respects max boundary', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(<NumberStepper defaultValue={10} max={10} onChange={onChange} />)

        const incBtn = screen.getByLabelText('Increase value')
        expect(incBtn).toBeDisabled()

        await user.click(incBtn)
        expect(onChange).not.toHaveBeenCalled()
    })

    it('uses custom step', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(<NumberStepper defaultValue={0} step={5} onChange={onChange} />)

        await user.click(screen.getByLabelText('Increase value'))
        expect(onChange).toHaveBeenCalledWith(5)
    })

    it('clamps defaultValue to min/max', () => {
        render(<NumberStepper defaultValue={20} max={10} />)
        expect(screen.getByRole('spinbutton')).toHaveValue('10')
    })

    it('works in controlled mode', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        const { rerender } = render(
            <NumberStepper value={7} onChange={onChange} />
        )
        expect(screen.getByRole('spinbutton')).toHaveValue('7')

        await user.click(screen.getByLabelText('Increase value'))
        expect(onChange).toHaveBeenCalledWith(8)

        rerender(<NumberStepper value={8} onChange={onChange} />)
        expect(screen.getByRole('spinbutton')).toHaveValue('8')
    })

    it('handles keyboard ArrowUp and ArrowDown', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(<NumberStepper defaultValue={5} onChange={onChange} />)

        const input = screen.getByRole('spinbutton')
        await user.click(input)
        await user.keyboard('{ArrowUp}')
        expect(onChange).toHaveBeenCalledWith(6)

        await user.keyboard('{ArrowDown}')
        expect(onChange).toHaveBeenCalledWith(5)
    })

    it('shows error message', () => {
        render(<NumberStepper error="Too many items" />)
        expect(screen.getByRole('alert')).toHaveTextContent('Too many items')
    })

    it('disables all controls when disabled', () => {
        render(<NumberStepper disabled />)
        expect(screen.getByRole('spinbutton')).toBeDisabled()
        expect(screen.getByLabelText('Increase value')).toBeDisabled()
        expect(screen.getByLabelText('Decrease value')).toBeDisabled()
    })

    it('forwards ref', () => {
        const ref = React.createRef<HTMLInputElement>()
        render(<NumberStepper ref={ref} />)
        expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })

    it('applies size classes', () => {
        const { container } = render(<NumberStepper size="large" />)
        expect(container.firstElementChild).toHaveClass('number-stepper--large')
    })

    it('handles direct input change', async () => {
        const user = userEvent.setup()
        const onChange = jest.fn()
        render(<NumberStepper defaultValue={0} onChange={onChange} />)

        const input = screen.getByRole('spinbutton')
        await user.clear(input)
        await user.type(input, '42')
        expect(onChange).toHaveBeenLastCalledWith(42)
    })
})
