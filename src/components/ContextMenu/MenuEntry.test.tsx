import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ContextMenuEntry } from './MenuEntry'
import { ContextMenuProvider } from './ContextMenuProvider'
import type { MenuEntry } from './types'

// Helper to render MenuEntry within ContextMenuProvider
const renderWithProvider = (entry: MenuEntry, index: number = 0) => {
    return render(
        <ContextMenuProvider menuEntries={[entry]}>
            <div data-testid="trigger">Trigger</div>
        </ContextMenuProvider>
    )
}

describe('ContextMenuEntry', () => {
    describe('MenuItem', () => {
        it('renders menu item with label and icon', () => {
            const menuItem: MenuEntry = {
                type: 'item',
                label: 'Copy',
                onClick: jest.fn(),
                icon: <span data-testid="icon">📋</span>,
            }

            renderWithProvider(menuItem)
            fireEvent.contextMenu(screen.getByTestId('trigger'))

            expect(screen.getByText('Copy')).toBeInTheDocument()
            expect(screen.getByTestId('icon')).toBeInTheDocument()
        })

        it('renders shortcut when provided', () => {
            const menuItem: MenuEntry = {
                type: 'item',
                label: 'Copy',
                onClick: jest.fn(),
                shortcut: 'Ctrl+C',
            }

            renderWithProvider(menuItem)
            fireEvent.contextMenu(screen.getByTestId('trigger'))

            expect(screen.getByText('Ctrl+C')).toBeInTheDocument()
            expect(screen.getByText('Ctrl+C')).toHaveClass('shortcut')
        })

        it('applies disabled styling and behavior', () => {
            const mockOnClick = jest.fn()
            const menuItem: MenuEntry = {
                type: 'item',
                label: 'Disabled Item',
                onClick: mockOnClick,
                disabled: true,
            }

            renderWithProvider(menuItem)
            fireEvent.contextMenu(screen.getByTestId('trigger'))

            const itemElement = screen.getByText('Disabled Item').closest('li')
            expect(itemElement).toHaveClass('disabled')
            expect(itemElement).toHaveAttribute('aria-disabled', 'true')
            expect(itemElement).toHaveAttribute('tabIndex', '-1')

            fireEvent.click(screen.getByText('Disabled Item'))
            expect(mockOnClick).not.toHaveBeenCalled()
        })

        it('executes onClick and hides menu when clicked', async () => {
            const mockOnClick = jest.fn()
            const menuItem: MenuEntry = {
                type: 'item',
                label: 'Test Item',
                onClick: mockOnClick,
            }

            renderWithProvider(menuItem)
            fireEvent.contextMenu(screen.getByTestId('trigger'))

            expect(screen.getByRole('menu')).toBeInTheDocument()

            fireEvent.click(screen.getByText('Test Item'))

            expect(mockOnClick).toHaveBeenCalledTimes(1)
            expect(screen.queryByRole('menu')).not.toBeInTheDocument()
        })

        it('handles keyboard navigation', () => {
            const mockOnClick = jest.fn()
            const menuItem: MenuEntry = {
                type: 'item',
                label: 'Test Item',
                onClick: mockOnClick,
            }

            renderWithProvider(menuItem)
            fireEvent.contextMenu(screen.getByTestId('trigger'))

            const itemElement = screen.getByRole('menuitem')

            // Test Enter key
            fireEvent.keyDown(itemElement, { key: 'Enter' })
            expect(mockOnClick).toHaveBeenCalledTimes(1)

            // Reset and test Space key
            mockOnClick.mockClear()

            // Re-open menu since previous action closed it
            fireEvent.contextMenu(screen.getByTestId('trigger'))
            const itemElementAgain = screen.getByRole('menuitem')

            fireEvent.keyDown(itemElementAgain, { key: ' ' })
            expect(mockOnClick).toHaveBeenCalledTimes(1)
        })
    })

    describe('MenuDivider', () => {
        it('renders divider with correct attributes', () => {
            const divider: MenuEntry = {
                type: 'divider',
            }

            renderWithProvider(divider)
            fireEvent.contextMenu(screen.getByTestId('trigger'))

            const dividerElement = screen.getByRole('separator')
            expect(dividerElement).toBeInTheDocument()
            expect(dividerElement).toHaveClass('menu-divider')
        })
    })

    describe('MenuSubmenu', () => {
        const submenuEntry: MenuEntry = {
            type: 'submenu',
            label: 'More Options',
            icon: <span data-testid="submenu-icon">⚙️</span>,
            children: [
                {
                    type: 'item',
                    label: 'Sub Item 1',
                    onClick: jest.fn(),
                },
                {
                    type: 'item',
                    label: 'Sub Item 2',
                    onClick: jest.fn(),
                },
            ],
        }

        it('renders submenu with label and icon', () => {
            renderWithProvider(submenuEntry)
            fireEvent.contextMenu(screen.getByTestId('trigger'))

            expect(screen.getByText('More Options')).toBeInTheDocument()
            expect(screen.getByTestId('submenu-icon')).toBeInTheDocument()
        })

        it('has proper accessibility attributes', () => {
            renderWithProvider(submenuEntry)
            fireEvent.contextMenu(screen.getByTestId('trigger'))

            const submenuElement = screen
                .getByText('More Options')
                .closest('li')
            expect(submenuElement).toHaveAttribute('tabIndex', '0')
            expect(submenuElement).toHaveAttribute('aria-haspopup', 'menu')
            expect(submenuElement).toHaveAttribute('aria-expanded', 'false')
        })

        it('shows submenu on mouse enter', async () => {
            renderWithProvider(submenuEntry)
            fireEvent.contextMenu(screen.getByTestId('trigger'))

            const submenuElement = screen.getByText('More Options')

            // Initially submenu items should not be visible
            expect(screen.queryByText('Sub Item 1')).not.toBeInTheDocument()

            fireEvent.mouseEnter(submenuElement)

            // After mouse enter, submenu items should be visible
            await waitFor(() => {
                expect(screen.getByText('Sub Item 1')).toBeInTheDocument()
                expect(screen.getByText('Sub Item 2')).toBeInTheDocument()
            })

            // Check aria-expanded is updated
            const submenuLi = submenuElement.closest('li')
            expect(submenuLi).toHaveAttribute('aria-expanded', 'true')
        })

        it('hides submenu on mouse leave with delay', async () => {
            renderWithProvider(submenuEntry)
            fireEvent.contextMenu(screen.getByTestId('trigger'))

            const submenuElement = screen.getByText('More Options')

            // Show submenu
            fireEvent.mouseEnter(submenuElement)
            await waitFor(() => {
                expect(screen.getByText('Sub Item 1')).toBeInTheDocument()
            })

            // Hide submenu
            fireEvent.mouseLeave(submenuElement)

            // Should hide after delay (120ms)
            await waitFor(
                () => {
                    expect(
                        screen.queryByText('Sub Item 1')
                    ).not.toBeInTheDocument()
                },
                { timeout: 200 }
            )

            const submenuLi = submenuElement.closest('li')
            expect(submenuLi).toHaveAttribute('aria-expanded', 'false')
        })

        it('shows submenu on focus', async () => {
            renderWithProvider(submenuEntry)
            fireEvent.contextMenu(screen.getByTestId('trigger'))

            const submenuElement = screen
                .getByText('More Options')
                .closest('li')

            fireEvent.focus(submenuElement!)

            await waitFor(() => {
                expect(screen.getByText('Sub Item 1')).toBeInTheDocument()
            })
        })

        it('renders nested submenu items correctly', () => {
            const nestedSubmenu: MenuEntry = {
                type: 'submenu',
                label: 'Nested Menu',
                children: [
                    {
                        type: 'item',
                        label: 'Nested Item',
                        onClick: jest.fn(),
                    },
                    {
                        type: 'divider',
                    },
                    {
                        type: 'submenu',
                        label: 'Deep Nested',
                        children: [
                            {
                                type: 'item',
                                label: 'Deep Item',
                                onClick: jest.fn(),
                            },
                        ],
                    },
                ],
            }

            renderWithProvider(nestedSubmenu)
            fireEvent.contextMenu(screen.getByTestId('trigger'))
            fireEvent.mouseEnter(screen.getByText('Nested Menu'))

            expect(screen.getByText('Nested Item')).toBeInTheDocument()
            expect(screen.getByRole('separator')).toBeInTheDocument()
            expect(screen.getByText('Deep Nested')).toBeInTheDocument()
        })

        it('cleans up timeout on unmount', () => {
            const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

            const { unmount } = renderWithProvider(submenuEntry)
            fireEvent.contextMenu(screen.getByTestId('trigger'))

            const submenuElement = screen.getByText('More Options')
            fireEvent.mouseEnter(submenuElement)
            fireEvent.mouseLeave(submenuElement)

            unmount()

            expect(clearTimeoutSpy).toHaveBeenCalled()
            clearTimeoutSpy.mockRestore()
        })
    })

    describe('ContextMenuEntry dispatcher', () => {
        it('renders correct component based on type', () => {
            const entries: MenuEntry[] = [
                { type: 'item', label: 'Item', onClick: jest.fn() },
                { type: 'divider' },
                { type: 'submenu', label: 'Submenu', children: [] },
            ]

            render(
                <ContextMenuProvider menuEntries={entries}>
                    <div data-testid="trigger">Trigger</div>
                </ContextMenuProvider>
            )

            fireEvent.contextMenu(screen.getByTestId('trigger'))

            expect(screen.getByRole('menuitem')).toBeInTheDocument() // Item
            expect(screen.getByRole('separator')).toBeInTheDocument() // Divider
            expect(screen.getByText('Submenu')).toBeInTheDocument() // Submenu
        })
    })
})
