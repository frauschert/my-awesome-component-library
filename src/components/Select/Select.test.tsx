import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Select from './Select'
import type { SelectOption } from './Select'

const mockOptions: SelectOption[] = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
]

describe('Select', () => {
    it('renders with placeholder', () => {
        render(<Select options={mockOptions} placeholder="Choose option" />)
        expect(screen.getByText('Choose option')).toBeInTheDocument()
    })

    it('renders with label', () => {
        render(<Select options={mockOptions} label="Test Label" />)
        expect(screen.getByText('Test Label')).toBeInTheDocument()
    })

    it('opens dropdown on click', () => {
        render(<Select options={mockOptions} />)
        const trigger = screen.getByRole('button')
        fireEvent.click(trigger)
        expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('selects option on click', async () => {
        const onChange = jest.fn()
        render(<Select options={mockOptions} onChange={onChange} />)

        const trigger = screen.getByRole('button')
        fireEvent.click(trigger)

        const option = screen.getByText('Option 1')
        fireEvent.click(option)

        await waitFor(() => {
            expect(onChange).toHaveBeenCalledWith('1')
        })
    })

    it('displays selected value', () => {
        render(<Select options={mockOptions} value="2" />)
        expect(screen.getByText('Option 2')).toBeInTheDocument()
    })

    it('handles multiple selection', async () => {
        const onChange = jest.fn()
        render(<Select options={mockOptions} multiple onChange={onChange} />)

        const trigger = screen.getByRole('button')
        fireEvent.click(trigger)

        const option1 = screen.getByText('Option 1')
        fireEvent.click(option1)

        await waitFor(() => {
            expect(onChange).toHaveBeenCalledWith(['1'])
        })

        const option2 = screen.getByText('Option 2')
        fireEvent.click(option2)

        await waitFor(() => {
            expect(onChange).toHaveBeenCalledWith(['1', '2'])
        })
    })

    it('filters options when searchable', async () => {
        render(<Select options={mockOptions} searchable />)

        const trigger = screen.getByRole('button')
        fireEvent.click(trigger)

        const searchInput = screen.getByPlaceholderText('Search...')
        fireEvent.change(searchInput, { target: { value: 'Option 1' } })

        await waitFor(() => {
            expect(screen.getByText('Option 1')).toBeInTheDocument()
            expect(screen.queryByText('Option 2')).not.toBeInTheDocument()
        })
    })

    it('clears selection when clearable', async () => {
        const onChange = jest.fn()
        render(
            <Select
                options={mockOptions}
                value="1"
                clearable
                onChange={onChange}
            />
        )

        const clearButton = screen.getByRole('button', {
            name: 'Clear selection',
        })
        fireEvent.click(clearButton)

        await waitFor(() => {
            expect(onChange).toHaveBeenCalledWith('')
        })
    })

    it('is disabled when disabled prop is true', () => {
        render(<Select options={mockOptions} disabled />)
        const trigger = screen.getByRole('button')
        expect(trigger).toBeDisabled()
    })

    it('displays helper text', () => {
        render(<Select options={mockOptions} helperText="Helper text" />)
        expect(screen.getByText('Helper text')).toBeInTheDocument()
    })

    it('displays error state', () => {
        const { container } = render(
            <Select options={mockOptions} error helperText="Error message" />
        )
        expect(container.querySelector('.select--error')).toBeInTheDocument()
        expect(screen.getByText('Error message')).toBeInTheDocument()
    })

    it('handles keyboard navigation', () => {
        render(<Select options={mockOptions} />)
        const trigger = screen.getByRole('button')

        fireEvent.keyDown(trigger, { key: 'Enter' })
        expect(screen.getByRole('listbox')).toBeInTheDocument()

        fireEvent.keyDown(trigger, { key: 'Escape' })
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
})
