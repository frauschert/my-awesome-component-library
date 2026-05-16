import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Checkbox from './Checkbox'

describe('Checkbox', () => {
    it('renders without crashing', () => {
        render(<Checkbox />)
        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toBeInTheDocument()
    })

    it('renders with label', () => {
        render(<Checkbox label="Accept terms" />)
        expect(screen.getByText('Accept terms')).toBeInTheDocument()
    })

    it('renders required indicator', () => {
        render(<Checkbox label="Required field" required />)
        expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('renders helper text', () => {
        render(<Checkbox label="Field" helperText="Helper message" />)
        expect(screen.getByText('Helper message')).toBeInTheDocument()
    })

    it('handles uncontrolled checked state', () => {
        render(<Checkbox label="Check me" />)
        const checkbox = screen.getByRole('checkbox') as HTMLInputElement

        expect(checkbox.checked).toBe(false)

        fireEvent.click(checkbox)
        expect(checkbox.checked).toBe(true)

        fireEvent.click(checkbox)
        expect(checkbox.checked).toBe(false)
    })

    it('handles default checked state', () => {
        render(<Checkbox label="Check me" defaultChecked />)
        const checkbox = screen.getByRole('checkbox') as HTMLInputElement
        expect(checkbox.checked).toBe(true)
    })

    it('handles controlled checked state', () => {
        const handleChange = jest.fn()
        const { rerender } = render(
            <Checkbox
                label="Controlled"
                checked={false}
                onChange={handleChange}
            />
        )

        const checkbox = screen.getByRole('checkbox') as HTMLInputElement
        expect(checkbox.checked).toBe(false)

        fireEvent.click(checkbox)
        expect(handleChange).toHaveBeenCalledTimes(1)

        rerender(
            <Checkbox
                label="Controlled"
                checked={true}
                onChange={handleChange}
            />
        )
        expect(checkbox.checked).toBe(true)
    })

    it('handles indeterminate state', () => {
        render(<Checkbox label="Indeterminate" indeterminate />)
        const checkbox = screen.getByRole('checkbox') as HTMLInputElement
        expect(checkbox.indeterminate).toBe(true)
    })

    it('disables interaction when disabled', () => {
        const handleChange = jest.fn()
        render(<Checkbox label="Disabled" disabled onChange={handleChange} />)
        const checkbox = screen.getByRole('checkbox')

        expect(checkbox).toBeDisabled()

        fireEvent.click(checkbox)
        expect(handleChange).not.toHaveBeenCalled()
    })

    it('applies error state', () => {
        render(<Checkbox label="Error" error helperText="Error message" />)
        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toHaveAttribute('aria-invalid', 'true')
        expect(screen.getByText('Error message')).toHaveClass(
            'checkbox-helper--error'
        )
    })

    it('applies size variants', () => {
        const { rerender } = render(<Checkbox label="Size" size="sm" />)
        expect(
            screen.getByText('Size').closest('.checkbox-wrapper')
        ).toHaveClass('checkbox-wrapper--sm')

        rerender(<Checkbox label="Size" size="md" />)
        expect(
            screen.getByText('Size').closest('.checkbox-wrapper')
        ).toHaveClass('checkbox-wrapper--md')

        rerender(<Checkbox label="Size" size="lg" />)
        expect(
            screen.getByText('Size').closest('.checkbox-wrapper')
        ).toHaveClass('checkbox-wrapper--lg')
    })

    it('associates label with input via id', () => {
        render(<Checkbox label="Click label" id="test-checkbox" />)
        const label = screen.getByText('Click label')
        const checkbox = screen.getByRole('checkbox')

        expect(label).toHaveAttribute('for', 'test-checkbox')
        expect(checkbox).toHaveAttribute('id', 'test-checkbox')
    })

    it('calls onChange handler', () => {
        const handleChange = jest.fn()
        render(<Checkbox label="Test" onChange={handleChange} />)
        const checkbox = screen.getByRole('checkbox')

        fireEvent.click(checkbox)
        expect(handleChange).toHaveBeenCalledTimes(1)
        expect(handleChange).toHaveBeenCalledWith(
            expect.objectContaining({
                target: expect.objectContaining({ checked: true }),
            })
        )
    })

    it('forwards ref to input element', () => {
        const ref = React.createRef<HTMLInputElement>()
        render(<Checkbox label="Ref test" ref={ref} />)
        expect(ref.current).toBeInstanceOf(HTMLInputElement)
        expect(ref.current?.type).toBe('checkbox')
    })

    it('applies custom className', () => {
        render(<Checkbox label="Custom" className="custom-class" />)
        expect(
            screen.getByText('Custom').closest('.checkbox-wrapper')
        ).toHaveClass('custom-class')
    })

    it('passes through name and value attributes', () => {
        render(<Checkbox label="Form field" name="accept" value="yes" />)
        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toHaveAttribute('name', 'accept')
        expect(checkbox).toHaveAttribute('value', 'yes')
    })
})
