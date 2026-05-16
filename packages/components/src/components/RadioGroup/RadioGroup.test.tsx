import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RadioGroup, RadioOption } from './RadioGroup'

const mockOptions: RadioOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
]

describe('RadioGroup', () => {
    it('renders all radio options', () => {
        render(<RadioGroup name="test" options={mockOptions} />)

        expect(screen.getByLabelText('Option 1')).toBeInTheDocument()
        expect(screen.getByLabelText('Option 2')).toBeInTheDocument()
        expect(screen.getByLabelText('Option 3')).toBeInTheDocument()
    })

    it('renders label when provided', () => {
        render(
            <RadioGroup
                name="test"
                label="Choose an option"
                options={mockOptions}
            />
        )

        expect(screen.getByText('Choose an option')).toBeInTheDocument()
    })

    it('shows required indicator when required', () => {
        render(
            <RadioGroup
                name="test"
                label="Choose an option"
                required
                options={mockOptions}
            />
        )

        expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('renders option descriptions when provided', () => {
        const optionsWithDesc: RadioOption[] = [
            {
                value: 'opt1',
                label: 'Option 1',
                description: 'First option description',
            },
            {
                value: 'opt2',
                label: 'Option 2',
                description: 'Second option description',
            },
        ]

        render(<RadioGroup name="test" options={optionsWithDesc} />)

        expect(screen.getByText('First option description')).toBeInTheDocument()
        expect(
            screen.getByText('Second option description')
        ).toBeInTheDocument()
    })

    it('selects the option matching the value prop', () => {
        render(<RadioGroup name="test" options={mockOptions} value="option2" />)

        const radio = screen.getByLabelText('Option 2') as HTMLInputElement
        expect(radio.checked).toBe(true)
    })

    it('calls onChange when an option is clicked', async () => {
        const user = userEvent.setup()
        const handleChange = jest.fn()

        render(
            <RadioGroup
                name="test"
                options={mockOptions}
                onChange={handleChange}
            />
        )

        await user.click(screen.getByLabelText('Option 2'))

        expect(handleChange).toHaveBeenCalledWith('option2')
    })

    it('does not call onChange when disabled', async () => {
        const user = userEvent.setup()
        const handleChange = jest.fn()

        render(
            <RadioGroup
                name="test"
                options={mockOptions}
                onChange={handleChange}
                disabled
            />
        )

        await user.click(screen.getByLabelText('Option 1'))

        expect(handleChange).not.toHaveBeenCalled()
    })

    it('disables specific options when marked as disabled', () => {
        const optionsWithDisabled: RadioOption[] = [
            { value: 'opt1', label: 'Option 1' },
            { value: 'opt2', label: 'Option 2', disabled: true },
        ]

        render(<RadioGroup name="test" options={optionsWithDisabled} />)

        const disabledRadio = screen.getByLabelText(
            'Option 2'
        ) as HTMLInputElement
        expect(disabledRadio.disabled).toBe(true)
    })

    it('renders error message when provided', () => {
        render(
            <RadioGroup
                name="test"
                options={mockOptions}
                error="Please select an option"
            />
        )

        expect(screen.getByText('Please select an option')).toBeInTheDocument()
        expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('renders helper text when provided', () => {
        render(
            <RadioGroup
                name="test"
                options={mockOptions}
                helperText="Choose your preference"
            />
        )

        expect(screen.getByText('Choose your preference')).toBeInTheDocument()
    })

    it('does not show helper text when error is present', () => {
        render(
            <RadioGroup
                name="test"
                options={mockOptions}
                error="Error message"
                helperText="Helper text"
            />
        )

        expect(screen.getByText('Error message')).toBeInTheDocument()
        expect(screen.queryByText('Helper text')).not.toBeInTheDocument()
    })

    it('applies horizontal orientation class', () => {
        const { container } = render(
            <RadioGroup
                name="test"
                options={mockOptions}
                orientation="horizontal"
            />
        )

        expect(
            container.querySelector('.radio-group--horizontal')
        ).toBeInTheDocument()
    })

    it('applies size classes', () => {
        const { container, rerender } = render(
            <RadioGroup name="test" options={mockOptions} size="small" />
        )

        expect(
            container.querySelector('.radio-group--small')
        ).toBeInTheDocument()

        rerender(<RadioGroup name="test" options={mockOptions} size="large" />)

        expect(
            container.querySelector('.radio-group--large')
        ).toBeInTheDocument()
    })

    it('applies custom className', () => {
        const { container } = render(
            <RadioGroup
                name="test"
                options={mockOptions}
                className="custom-radio"
            />
        )

        expect(container.querySelector('.custom-radio')).toBeInTheDocument()
    })

    it('has proper accessibility attributes', () => {
        render(
            <RadioGroup
                name="test"
                label="Test Group"
                options={mockOptions}
                required
                error="Error message"
            />
        )

        const radiogroup = screen.getByRole('radiogroup')
        expect(radiogroup).toHaveAttribute('aria-required', 'true')
        expect(radiogroup).toHaveAttribute('aria-describedby')

        const radios = screen.getAllByRole('radio')
        radios.forEach((radio) => {
            expect(radio).toHaveAttribute('name', 'test')
        })
    })

    it('associates description with radio option', () => {
        const optionsWithDesc: RadioOption[] = [
            {
                value: 'opt1',
                label: 'Option 1',
                description: 'Description text',
            },
        ]

        render(<RadioGroup name="test" options={optionsWithDesc} />)

        const radio = screen.getByRole('radio', { name: /Option 1/i })
        const descId = radio.getAttribute('aria-describedby')

        expect(descId).toBeTruthy()
        expect(screen.getByText('Description text')).toHaveAttribute(
            'id',
            descId!
        )
    })

    it('supports keyboard navigation', async () => {
        const user = userEvent.setup()
        const handleChange = jest.fn()

        render(
            <RadioGroup
                name="test"
                options={mockOptions}
                onChange={handleChange}
            />
        )

        const firstRadio = screen.getByLabelText('Option 1')
        firstRadio.focus()

        await user.keyboard(' ')

        expect(handleChange).toHaveBeenCalledWith('option1')
    })

    it('applies error class when error is present', () => {
        const { container } = render(
            <RadioGroup name="test" options={mockOptions} error="Error" />
        )

        expect(
            container.querySelector('.radio-group--error')
        ).toBeInTheDocument()
    })
})
