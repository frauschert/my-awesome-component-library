import React, { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Switch from './Switch'

describe('Switch', () => {
    it('renders without crashing', () => {
        render(<Switch />)
        const input = screen.getByRole('checkbox')
        expect(input).toBeInTheDocument()
    })

    it('renders with label', () => {
        render(<Switch label="Enable feature" />)
        expect(screen.getByText('Enable feature')).toBeInTheDocument()
    })

    it('toggles checked state on click', async () => {
        const user = userEvent.setup()
        const handleChange = jest.fn()
        render(<Switch checked={false} onChange={handleChange} />)

        const input = screen.getByRole('checkbox')
        await user.click(input)

        expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('respects controlled checked prop', () => {
        const { rerender } = render(<Switch checked={false} />)
        let input = screen.getByRole('checkbox') as HTMLInputElement
        expect(input.checked).toBe(false)

        rerender(<Switch checked={true} />)
        input = screen.getByRole('checkbox') as HTMLInputElement
        expect(input.checked).toBe(true)
    })

    it('does not trigger onChange when disabled', async () => {
        const user = userEvent.setup()
        const handleChange = jest.fn()
        render(<Switch disabled onChange={handleChange} />)

        const input = screen.getByRole('checkbox')
        await user.click(input)

        expect(handleChange).not.toHaveBeenCalled()
    })

    it('applies disabled class when disabled', () => {
        const { container } = render(<Switch disabled />)
        const switchElement = container.querySelector('.switch--disabled')
        expect(switchElement).toBeInTheDocument()
    })

    it('renders different sizes', () => {
        const { container, rerender } = render(<Switch size="small" />)
        expect(container.querySelector('.switch--small')).toBeInTheDocument()

        rerender(<Switch size="medium" />)
        expect(container.querySelector('.switch--medium')).toBeInTheDocument()

        rerender(<Switch size="large" />)
        expect(container.querySelector('.switch--large')).toBeInTheDocument()
    })

    it('renders label on the left when labelPosition is left', () => {
        const { container } = render(
            <Switch label="Left label" labelPosition="left" />
        )
        const wrapper = container.querySelector('.switch-wrapper--reverse')
        expect(wrapper).toBeInTheDocument()
    })

    it('applies custom className', () => {
        const { container } = render(<Switch className="custom-class" />)
        const switchElement = container.querySelector('.switch.custom-class')
        expect(switchElement).toBeInTheDocument()
    })

    it('passes through name attribute', () => {
        render(<Switch name="feature-toggle" />)
        const input = screen.getByRole('checkbox') as HTMLInputElement
        expect(input.name).toBe('feature-toggle')
    })

    it('supports required attribute', () => {
        render(<Switch required />)
        const input = screen.getByRole('checkbox') as HTMLInputElement
        expect(input.required).toBe(true)
    })

    it('has accessible label from aria-label', () => {
        render(<Switch aria-label="Toggle feature" />)
        const input = screen.getByLabelText('Toggle feature')
        expect(input).toBeInTheDocument()
    })

    it('has accessible label from label prop', () => {
        render(<Switch label="Enable notifications" />)
        const input = screen.getByLabelText('Enable notifications')
        expect(input).toBeInTheDocument()
    })

    it('applies checked class when checked', () => {
        const { container } = render(<Switch checked={true} />)
        const switchElement = container.querySelector('.switch--checked')
        expect(switchElement).toBeInTheDocument()
    })

    it('works in controlled component', async () => {
        const user = userEvent.setup()
        const ControlledSwitch = () => {
            const [checked, setChecked] = useState(false)
            return (
                <Switch
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                    label="Controlled"
                />
            )
        }

        render(<ControlledSwitch />)
        const input = screen.getByRole('checkbox') as HTMLInputElement

        expect(input.checked).toBe(false)

        await user.click(input)
        expect(input.checked).toBe(true)

        await user.click(input)
        expect(input.checked).toBe(false)
    })

    it('forwards ref to input element', () => {
        const ref = React.createRef<HTMLInputElement>()
        render(<Switch ref={ref} />)
        expect(ref.current).toBeInstanceOf(HTMLInputElement)
        expect(ref.current?.type).toBe('checkbox')
    })

    it('displays track and thumb elements', () => {
        const { container } = render(<Switch />)
        expect(container.querySelector('.switch__track')).toBeInTheDocument()
        expect(container.querySelector('.switch__thumb')).toBeInTheDocument()
    })

    it('label has disabled class when switch is disabled', () => {
        const { container } = render(<Switch label="Disabled" disabled />)
        const label = container.querySelector('.switch__label--disabled')
        expect(label).toBeInTheDocument()
    })

    it('handles keyboard interaction', async () => {
        const user = userEvent.setup()
        const handleChange = jest.fn()
        render(<Switch checked={false} onChange={handleChange} />)

        const input = screen.getByRole('checkbox')
        input.focus()
        await user.keyboard(' ')

        expect(handleChange).toHaveBeenCalled()
    })
})
