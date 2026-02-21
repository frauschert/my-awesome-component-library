import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PasswordInput from './PasswordInput'

describe('PasswordInput', () => {
    it('renders as type="password" by default', () => {
        const { container } = render(<PasswordInput />)
        expect(container.querySelector('input')).toHaveAttribute(
            'type',
            'password'
        )
    })

    it('toggles to type="text" when the show button is clicked', () => {
        render(<PasswordInput defaultValue="secret" />)
        const input = document.querySelector('input')!
        expect(input).toHaveAttribute('type', 'password')
        fireEvent.click(screen.getByRole('button', { name: 'Show password' }))
        expect(input).toHaveAttribute('type', 'text')
    })

    it('toggles back to type="password" on second click', () => {
        render(<PasswordInput defaultValue="secret" />)
        const toggle = screen.getByRole('button', { name: 'Show password' })
        fireEvent.click(toggle)
        fireEvent.click(screen.getByRole('button', { name: 'Hide password' }))
        expect(document.querySelector('input')).toHaveAttribute(
            'type',
            'password'
        )
    })

    it('renders a label when provided', () => {
        render(<PasswordInput label="Password" />)
        expect(screen.getByText('Password')).toBeInTheDocument()
    })

    it('renders helperText', () => {
        render(<PasswordInput helperText="At least 8 characters" />)
        expect(screen.getByText('At least 8 characters')).toBeInTheDocument()
    })

    it('renders errorText and sets aria-invalid', () => {
        render(<PasswordInput errorText="Too short" />)
        expect(screen.getByText('Too short')).toBeInTheDocument()
        expect(document.querySelector('input')).toHaveAttribute(
            'aria-invalid',
            'true'
        )
    })

    it('is controlled — value prop drives the display', () => {
        render(<PasswordInput value="controlled" onChange={() => {}} />)
        expect(document.querySelector('input')).toHaveValue('controlled')
    })

    it('calls onChange when the user types', () => {
        const onChange = jest.fn()
        render(<PasswordInput onChange={onChange} />)
        fireEvent.change(document.querySelector('input')!, {
            target: { value: 'abc' },
        })
        expect(onChange).toHaveBeenCalled()
    })

    it('is disabled when disabled prop is set', () => {
        render(<PasswordInput disabled />)
        expect(document.querySelector('input')).toBeDisabled()
        expect(
            screen.getByRole('button', { name: 'Show password' })
        ).toBeDisabled()
    })

    it('does not show strength meter by default', () => {
        render(<PasswordInput defaultValue="test123" />)
        expect(
            document.querySelector('.password-input__strength-meter')
        ).not.toBeInTheDocument()
    })

    it('shows the strength meter when showStrengthMeter=true', () => {
        render(<PasswordInput defaultValue="test123" showStrengthMeter />)
        expect(
            document.querySelector('.password-input__strength-meter')
        ).toBeInTheDocument()
    })

    it('uses a custom getStrength function', () => {
        const getStrength = jest.fn().mockReturnValue(3)
        render(
            <PasswordInput
                defaultValue="abc"
                showStrengthMeter
                getStrength={getStrength}
            />
        )
        expect(getStrength).toHaveBeenCalledWith('abc')
        expect(screen.getByText('Good')).toBeInTheDocument()
    })

    it('hides the strength meter when input is empty', () => {
        render(<PasswordInput value="" showStrengthMeter onChange={() => {}} />)
        expect(
            document.querySelector('.password-input__strength-meter')
        ).not.toBeInTheDocument()
    })

    it('toggle button has aria-pressed reflecting visibility state', () => {
        render(<PasswordInput />)
        const toggle = screen.getByRole('button', { name: 'Show password' })
        expect(toggle).toHaveAttribute('aria-pressed', 'false')
        fireEvent.click(toggle)
        expect(
            screen.getByRole('button', { name: 'Hide password' })
        ).toHaveAttribute('aria-pressed', 'true')
    })
})
