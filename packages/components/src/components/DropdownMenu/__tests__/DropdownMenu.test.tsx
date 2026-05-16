import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DropdownMenu from '../DropdownMenu'

const defaultItems = [
    { id: 1, label: 'Option 1', value: 'option1' },
    { id: 2, label: 'Option 2', value: 'option2' },
    { id: 3, label: 'Option 3', value: 'option3', disabled: true },
    { id: 4, label: 'Option 4', value: 'option4' },
]

describe('DropdownMenu', () => {
    it('renders a trigger button', () => {
        render(<DropdownMenu items={defaultItems} trigger="Open Menu" />)
        expect(
            screen.getByRole('button', { name: 'Open Menu' })
        ).toBeInTheDocument()
    })

    it('shows menu when trigger is clicked', async () => {
        render(<DropdownMenu items={defaultItems} trigger="Open Menu" />)

        const trigger = screen.getByRole('button')
        fireEvent.click(trigger)

        const menu = await screen.findByRole('listbox')
        expect(menu).toBeInTheDocument()
        expect(screen.getAllByRole('option')).toHaveLength(defaultItems.length)
    })

    it('selects an item when clicked', async () => {
        const onChange = jest.fn()
        render(
            <DropdownMenu
                items={defaultItems}
                trigger="Open Menu"
                onChange={onChange}
            />
        )

        const trigger = screen.getByRole('button')
        fireEvent.click(trigger)

        const option = await screen.findByText('Option 1')
        fireEvent.click(option)

        expect(onChange).toHaveBeenCalledWith('option1')
    })

    it('supports multiple selection', async () => {
        const onChange = jest.fn()
        render(
            <DropdownMenu
                items={defaultItems}
                trigger="Open Menu"
                onChange={onChange}
                multiple
                closeOnSelect={false}
            />
        )

        const trigger = screen.getByRole('button')
        fireEvent.click(trigger)

        const option1 = screen.getByText('Option 1')
        const option2 = await screen.findByText('Option 2')

        fireEvent.click(option1)
        fireEvent.click(option2)

        expect(onChange).toHaveBeenLastCalledWith(['option1', 'option2'])
    })

    it('filters items when searchable is enabled', async () => {
        render(
            <DropdownMenu
                items={defaultItems}
                trigger="Open Menu"
                searchable
                searchPlaceholder="Search..."
            />
        )

        const trigger = screen.getByRole('button')
        fireEvent.click(trigger)

        const searchInput = screen.getByPlaceholderText('Search...')
        await userEvent.type(searchInput, '1')

        const options = screen.getAllByRole('option')
        expect(options).toHaveLength(1)
        expect(options[0]).toHaveTextContent('Option 1')
    })

    it('handles keyboard navigation', async () => {
        render(<DropdownMenu items={defaultItems} trigger="Open Menu" />)

        const trigger = screen.getByRole('button')
        fireEvent.click(trigger)

        const menu = await screen.findByRole('listbox')
        expect(menu).toBeInTheDocument()

        // Press Escape to close
        fireEvent.keyDown(menu, { key: 'Escape' })
        await waitFor(() => {
            expect(menu).not.toBeInTheDocument()
        })

        expect(trigger).toHaveFocus()
    })

    it('prevents selection of disabled items', async () => {
        const onChange = jest.fn()
        render(
            <DropdownMenu
                items={defaultItems}
                trigger="Open Menu"
                onChange={onChange}
            />
        )

        const trigger = screen.getByRole('button')
        fireEvent.click(trigger)

        const disabledOption = await screen.findByText('Option 3')
        fireEvent.click(disabledOption)

        expect(onChange).not.toHaveBeenCalled()
    })

    it('supports controlled mode', async () => {
        const onChange = jest.fn()
        const { rerender } = render(
            <DropdownMenu
                items={defaultItems}
                trigger="Open Menu"
                value="option1"
                onChange={onChange}
            />
        )

        const trigger = screen.getByRole('button')
        fireEvent.click(trigger)

        const option = await screen.findByText('Option 2')
        fireEvent.click(option)

        expect(onChange).toHaveBeenCalledWith('option2')

        // Update controlled value and reopen menu
        rerender(
            <DropdownMenu
                items={defaultItems}
                trigger="Open Menu"
                value="option2"
                onChange={onChange}
                open={true}
            />
        )

        // After updating the controlled value, option 2 should be selected
        const updatedOptions = await screen.findAllByRole('option')
        const updatedOption1 = updatedOptions.find(
            (opt) => opt.textContent === 'Option 1'
        )
        const updatedOption2 = updatedOptions.find(
            (opt) => opt.textContent === 'Option 2'
        )
        expect(updatedOption1).toHaveAttribute('aria-selected', 'false')
        expect(updatedOption2).toHaveAttribute('aria-selected', 'true')
    })
})
