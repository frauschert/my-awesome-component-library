import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
// userEvent not required currently
import CommandPalette from './CommandPalette'

describe('CommandPalette', () => {
    const commands = [
        {
            id: '1',
            title: 'Open Settings',
            description: 'Open the settings panel',
            group: 'Navigation',
            onSelect: jest.fn(),
        },
        {
            id: '2',
            title: 'New File',
            description: 'Create a new file',
            group: 'File',
            onSelect: jest.fn(),
        },
        {
            id: '3',
            title: 'Open File',
            description: 'Open an existing file',
            group: 'File',
            onSelect: jest.fn(),
        },
        {
            id: '4',
            title: 'Toggle Sidebar',
            description: 'Show or hide the sidebar',
            group: 'View',
            onSelect: jest.fn(),
        },
    ]

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('opens with defaultOpen', () => {
        render(<CommandPalette commands={commands} defaultOpen />)
        expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('filters commands based on input', () => {
        render(<CommandPalette commands={commands} defaultOpen />)
        const input = screen.getByPlaceholderText('Search commands...')
        fireEvent.change(input, { target: { value: 'open' } })
        expect(screen.getByText('Open Settings')).toBeInTheDocument()
        expect(screen.getByText('Open File')).toBeInTheDocument()
        expect(screen.queryByText('New File')).not.toBeInTheDocument()
    })

    it('keyboard navigation works', () => {
        render(<CommandPalette commands={commands} defaultOpen />)
        const input = screen.getByPlaceholderText('Search commands...')
        // Press Enter to select the first item (index 0)
        fireEvent.keyDown(input, { key: 'Enter' })
        expect(commands[0].onSelect).toHaveBeenCalled()
    })

    it('closes on escape', () => {
        render(<CommandPalette commands={commands} defaultOpen />)
        const input = screen.getByPlaceholderText('Search commands...')
        fireEvent.keyDown(input, { key: 'Escape' })
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('opens via shortcut (Ctrl+K)', async () => {
        render(<CommandPalette commands={commands} />)
        // simulate ctrl+k
        fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
        expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
})
