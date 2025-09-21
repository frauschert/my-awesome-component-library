import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TextField, NumberField } from '../Input'

describe('Input extras', () => {
    it('shows clear button when clearable and clears value on click', () => {
        render(<TextField label="Name" clearable defaultValue="John" />)
        const input = screen.getByRole('textbox') as HTMLInputElement
        expect(input.value).toBe('John')
        const clearBtn = screen.getByRole('button', { name: /clear input/i })
        fireEvent.click(clearBtn)
        expect(input.value).toBe('')
    })

    it('steps number with arrow keys', () => {
        render(<NumberField label="Qty" defaultValue={1} step={2} />)
        const spinbox = screen.getByRole('spinbutton') as HTMLInputElement
        fireEvent.focus(spinbox)
        fireEvent.keyDown(spinbox, { key: 'ArrowUp' })
        expect(spinbox.value).toBe('3')
        fireEvent.keyDown(spinbox, { key: 'ArrowDown' })
        expect(spinbox.value).toBe('1')
    })
})
