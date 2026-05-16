import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Autocomplete from './Autocomplete'

const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Date', value: 'date', disabled: true },
]

function setup(props: Partial<React.ComponentProps<typeof Autocomplete>> = {}) {
    const onChange = jest.fn()
    const onSelect = jest.fn()
    const { rerender } = render(
        <Autocomplete
            value=""
            onChange={onChange}
            onSelect={onSelect}
            options={options}
            label="Fruit"
            {...props}
        />
    )
    return { onChange, onSelect, rerender }
}

describe('Autocomplete', () => {
    it('renders the input with a label', () => {
        setup()
        expect(screen.getByLabelText('Fruit')).toBeInTheDocument()
    })

    it('opens the listbox on focus', () => {
        setup()
        fireEvent.focus(screen.getByRole('combobox'))
        expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('filters options based on input value', () => {
        const { rerender, onChange } = setup()
        fireEvent.focus(screen.getByRole('combobox'))
        rerender(
            <Autocomplete
                value="an"
                onChange={onChange}
                options={options}
                label="Fruit"
            />
        )
        expect(
            screen.getByRole('option', { name: 'Banana' })
        ).toBeInTheDocument()
        expect(
            screen.queryByRole('option', { name: 'Apple' })
        ).not.toBeInTheDocument()
    })

    it('calls onSelect when an option is clicked', () => {
        const { onChange, onSelect } = setup()
        fireEvent.focus(screen.getByRole('combobox'))
        fireEvent.mouseDown(screen.getByRole('option', { name: 'Apple' }))
        expect(onSelect).toHaveBeenCalledWith(options[0])
        expect(onChange).toHaveBeenCalledWith('Apple')
    })

    it('closes the listbox after selection', () => {
        setup()
        fireEvent.focus(screen.getByRole('combobox'))
        fireEvent.mouseDown(screen.getByRole('option', { name: 'Apple' }))
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('navigates options with arrow keys', () => {
        setup()
        const input = screen.getByRole('combobox')
        fireEvent.focus(input)
        fireEvent.keyDown(input, { key: 'ArrowDown' })
        fireEvent.keyDown(input, { key: 'ArrowDown' })
        const options = screen.getAllByRole('option')
        expect(options[1]).toHaveAttribute('aria-selected', 'true')
    })

    it('selects active option with Enter key', () => {
        const { onSelect } = setup()
        const input = screen.getByRole('combobox')
        fireEvent.focus(input)
        fireEvent.keyDown(input, { key: 'ArrowDown' })
        fireEvent.keyDown(input, { key: 'Enter' })
        expect(onSelect).toHaveBeenCalledWith(options[0])
    })

    it('closes listbox on Escape', () => {
        setup()
        const input = screen.getByRole('combobox')
        fireEvent.focus(input)
        expect(screen.getByRole('listbox')).toBeInTheDocument()
        fireEvent.keyDown(input, { key: 'Escape' })
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('clears value on Escape when clearOnEscape is true', () => {
        const { onChange } = setup({ clearOnEscape: true, value: 'test' })
        const input = screen.getByRole('combobox')
        fireEvent.focus(input)
        fireEvent.keyDown(input, { key: 'Escape' })
        expect(onChange).toHaveBeenCalledWith('')
    })

    it('does not select disabled options', () => {
        const { onSelect } = setup()
        fireEvent.focus(screen.getByRole('combobox'))
        fireEvent.mouseDown(screen.getByRole('option', { name: 'Date' }))
        expect(onSelect).not.toHaveBeenCalled()
    })

    it('shows noOptionsText when no options match', () => {
        setup({ value: 'xyz' })
        fireEvent.focus(screen.getByRole('combobox'))
        expect(screen.getByText('No options')).toBeInTheDocument()
    })

    it('shows loading indicator when loading=true', () => {
        setup({ loading: true })
        fireEvent.focus(screen.getByRole('combobox'))
        expect(screen.getByText('Loading…')).toBeInTheDocument()
    })

    it('has correct ARIA attributes', () => {
        setup()
        const input = screen.getByRole('combobox')
        expect(input).toHaveAttribute('aria-autocomplete', 'list')
        expect(input).toHaveAttribute('aria-haspopup', 'listbox')
    })
})
