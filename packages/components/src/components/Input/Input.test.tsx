import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Input from '../Input'

describe('Input', () => {
    it('associates label with input and focuses on label click', () => {
        render(
            <Input
                type="text"
                label="Name"
                initialValue=""
                onChange={() => {}}
            />
        )
        const input = screen.getByRole('textbox') as HTMLInputElement
        const label = screen.getByText('Name')
        expect(label).toHaveAttribute('for', input.id)
        fireEvent.click(label)
        expect(input).toHaveFocus()
    })

    it('wires aria-describedby to helper and error text', () => {
        render(
            <Input
                type="text"
                label="Email"
                helperText="We will not spam you"
                errorText="Invalid email"
                invalid
                initialValue=""
                onChange={() => {}}
            />
        )
        const input = screen.getByRole('textbox') as HTMLInputElement
        expect(input).toHaveAttribute('aria-invalid', 'true')
        const describedBy = input.getAttribute('aria-describedby')
        expect(describedBy).toBeTruthy()
        // ensure ids refer to present elements
        describedBy!.split(' ').forEach((id) => {
            expect(document.getElementById(id)).toBeInTheDocument()
        })
    })
})
