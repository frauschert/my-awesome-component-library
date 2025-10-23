import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import SplitButton from './SplitButton'
import type { SplitButtonAction } from './SplitButton'

describe('SplitButton', () => {
    const mockPrimaryAction = jest.fn()
    const mockAction1 = jest.fn()
    const mockAction2 = jest.fn()
    const mockAction3 = jest.fn()

    const defaultActions: SplitButtonAction[] = [
        { label: 'Action 1', onClick: mockAction1 },
        { label: 'Action 2', onClick: mockAction2 },
        { label: 'Action 3', onClick: mockAction3 },
    ]

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('Rendering', () => {
        it('should render primary button with label', () => {
            render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                />
            )
            expect(screen.getByText('Save')).toBeInTheDocument()
        })

        it('should render dropdown trigger button', () => {
            render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                />
            )
            expect(
                screen.getByRole('button', { name: /show more options/i })
            ).toBeInTheDocument()
        })

        it('should not show menu initially', () => {
            render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                />
            )
            expect(screen.queryByRole('menu')).not.toBeInTheDocument()
        })

        it('should render with left icon', () => {
            render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                    leftIcon={<span data-testid="test-icon">💾</span>}
                />
            )
            expect(screen.getByTestId('test-icon')).toBeInTheDocument()
        })

        it('should apply custom className', () => {
            const { container } = render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                    className="custom-class"
                />
            )
            expect(container.querySelector('.custom-class')).toBeInTheDocument()
        })
    })

    describe('Variants', () => {
        it('should apply primary variant by default', () => {
            const { container } = render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                />
            )
            expect(
                container.querySelector('.splitbutton--primary')
            ).toBeInTheDocument()
        })

        it('should apply secondary variant', () => {
            const { container } = render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                    variant="secondary"
                />
            )
            expect(
                container.querySelector('.splitbutton--secondary')
            ).toBeInTheDocument()
        })

        it('should apply danger variant', () => {
            const { container } = render(
                <SplitButton
                    label="Delete"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                    variant="danger"
                />
            )
            expect(
                container.querySelector('.splitbutton--danger')
            ).toBeInTheDocument()
        })
    })

    describe('Sizes', () => {
        it('should apply medium size by default', () => {
            const { container } = render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                />
            )
            expect(
                container.querySelector('.splitbutton--medium')
            ).toBeInTheDocument()
        })

        it('should apply small size', () => {
            const { container } = render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                    size="small"
                />
            )
            expect(
                container.querySelector('.splitbutton--small')
            ).toBeInTheDocument()
        })

        it('should apply large size', () => {
            const { container } = render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                    size="large"
                />
            )
            expect(
                container.querySelector('.splitbutton--large')
            ).toBeInTheDocument()
        })
    })

    describe('Primary Button Interactions', () => {
        it('should call onClick when primary button is clicked', () => {
            render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                />
            )
            const primaryButton = screen.getByText('Save')
            fireEvent.click(primaryButton)
            expect(mockPrimaryAction).toHaveBeenCalledTimes(1)
        })

        it('should not call onClick when disabled', () => {
            render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                    disabled
                />
            )
            const primaryButton = screen.getByText('Save')
            fireEvent.click(primaryButton)
            expect(mockPrimaryAction).not.toHaveBeenCalled()
        })

        it('should not call onClick when loading', () => {
            render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                    loading
                />
            )
            const primaryButton = screen.getByText('Save')
            fireEvent.click(primaryButton)
            expect(mockPrimaryAction).not.toHaveBeenCalled()
        })
    })

    describe('Dropdown Menu', () => {
        it('should show menu when dropdown trigger is clicked', async () => {
            render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                />
            )
            const trigger = screen.getByRole('button', {
                name: /show more options/i,
            })
            fireEvent.click(trigger)

            await waitFor(() => {
                expect(screen.getByRole('menu')).toBeInTheDocument()
            })
        })

        it('should render all menu actions', async () => {
            render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                />
            )
            const trigger = screen.getByRole('button', {
                name: /show more options/i,
            })
            fireEvent.click(trigger)

            await waitFor(() => {
                expect(screen.getByText('Action 1')).toBeInTheDocument()
                expect(screen.getByText('Action 2')).toBeInTheDocument()
                expect(screen.getByText('Action 3')).toBeInTheDocument()
            })
        })

        it('should call action onClick when menu item is clicked', async () => {
            render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                />
            )
            const trigger = screen.getByRole('button', {
                name: /show more options/i,
            })
            fireEvent.click(trigger)

            await waitFor(() => {
                const menuItem = screen.getByText('Action 1')
                fireEvent.click(menuItem)
            })

            expect(mockAction1).toHaveBeenCalledTimes(1)
        })

        it('should close menu after action is clicked', async () => {
            render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                />
            )
            const trigger = screen.getByRole('button', {
                name: /show more options/i,
            })
            fireEvent.click(trigger)

            await waitFor(() => {
                const menuItem = screen.getByText('Action 1')
                fireEvent.click(menuItem)
            })

            await waitFor(() => {
                expect(screen.queryByRole('menu')).not.toBeInTheDocument()
            })
        })

        it('should render action with icon', async () => {
            const actionsWithIcon: SplitButtonAction[] = [
                {
                    label: 'Download',
                    onClick: mockAction1,
                    icon: <span data-testid="download-icon">⬇️</span>,
                },
            ]

            render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={actionsWithIcon}
                />
            )
            const trigger = screen.getByRole('button', {
                name: /show more options/i,
            })
            fireEvent.click(trigger)

            await waitFor(() => {
                expect(screen.getByTestId('download-icon')).toBeInTheDocument()
            })
        })

        it('should render divider', async () => {
            const actionsWithDivider: SplitButtonAction[] = [
                { label: 'Action 1', onClick: mockAction1 },
                { label: '', onClick: () => {}, divider: true },
                { label: 'Action 2', onClick: mockAction2 },
            ]

            render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={actionsWithDivider}
                />
            )
            const trigger = screen.getByRole('button', {
                name: /show more options/i,
            })
            fireEvent.click(trigger)

            await waitFor(() => {
                const divider = document.querySelector('.splitbutton__divider')
                expect(divider).toBeInTheDocument()
            })
        })

        it('should not call onClick for disabled action', async () => {
            const actionsWithDisabled: SplitButtonAction[] = [
                {
                    label: 'Disabled Action',
                    onClick: mockAction1,
                    disabled: true,
                },
            ]

            render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={actionsWithDisabled}
                />
            )
            const trigger = screen.getByRole('button', {
                name: /show more options/i,
            })
            fireEvent.click(trigger)

            await waitFor(() => {
                const menuItem = screen.getByText('Disabled Action')
                fireEvent.click(menuItem)
            })

            expect(mockAction1).not.toHaveBeenCalled()
        })
    })

    describe('States', () => {
        it('should show disabled state', () => {
            const { container } = render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                    disabled
                />
            )
            expect(
                container.querySelector('.splitbutton--disabled')
            ).toBeInTheDocument()
        })

        it('should show loading state', () => {
            const { container } = render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                    loading
                />
            )
            expect(
                container.querySelector('.splitbutton--loading')
            ).toBeInTheDocument()
            expect(
                container.querySelector('.splitbutton__spinner')
            ).toBeInTheDocument()
        })

        it('should show aria-busy when loading', () => {
            render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                    loading
                />
            )
            const primaryButton = screen.getByText('Save').closest('button')
            expect(primaryButton).toHaveAttribute('aria-busy', 'true')
        })
    })

    describe('Accessibility', () => {
        it('should have proper ARIA attributes on trigger', () => {
            render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                />
            )
            const trigger = screen.getByRole('button', {
                name: /show more options/i,
            })
            expect(trigger).toHaveAttribute('aria-expanded', 'false')
            expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
        })

        it('should update aria-expanded when menu is open', async () => {
            render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                />
            )
            const trigger = screen.getByRole('button', {
                name: /show more options/i,
            })
            fireEvent.click(trigger)

            await waitFor(() => {
                expect(trigger).toHaveAttribute('aria-expanded', 'true')
            })
        })

        it('should support custom aria-label for trigger', () => {
            render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                    aria-label="Additional save options"
                />
            )
            expect(
                screen.getByRole('button', {
                    name: /additional save options/i,
                })
            ).toBeInTheDocument()
        })

        it('should have role="menu" on dropdown', async () => {
            render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                />
            )
            const trigger = screen.getByRole('button', {
                name: /show more options/i,
            })
            fireEvent.click(trigger)

            await waitFor(() => {
                expect(screen.getByRole('menu')).toBeInTheDocument()
            })
        })

        it('should have role="menuitem" on actions', async () => {
            render(
                <SplitButton
                    label="Save"
                    onClick={mockPrimaryAction}
                    actions={defaultActions}
                />
            )
            const trigger = screen.getByRole('button', {
                name: /show more options/i,
            })
            fireEvent.click(trigger)

            await waitFor(() => {
                const menuItems = screen.getAllByRole('menuitem')
                expect(menuItems).toHaveLength(3)
            })
        })
    })
})
