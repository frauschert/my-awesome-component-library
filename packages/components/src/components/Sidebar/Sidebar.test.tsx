import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Sidebar, { SidebarItem } from './Sidebar'

const mockItems: SidebarItem[] = [
    { id: '1', label: 'Dashboard', icon: '📊' },
    { id: '2', label: 'Projects', icon: '📁', badge: 5 },
    {
        id: '3',
        label: 'Team',
        icon: '👥',
        children: [
            { id: '3-1', label: 'Members' },
            { id: '3-2', label: 'Settings' },
        ],
    },
    { id: '4', label: 'Reports', icon: '📈', disabled: true },
]

describe('Sidebar', () => {
    describe('Rendering', () => {
        it('should render all items', () => {
            render(<Sidebar items={mockItems} />)
            expect(screen.getByText('Dashboard')).toBeInTheDocument()
            expect(screen.getByText('Projects')).toBeInTheDocument()
            expect(screen.getByText('Team')).toBeInTheDocument()
            expect(screen.getByText('Reports')).toBeInTheDocument()
        })

        it('should render icons', () => {
            render(<Sidebar items={mockItems} />)
            const icons = document.querySelectorAll('.sidebar__item-icon')
            expect(icons.length).toBeGreaterThan(0)
        })

        it('should render badges', () => {
            render(<Sidebar items={mockItems} />)
            expect(screen.getByText('5')).toBeInTheDocument()
        })

        it('should render header and footer', () => {
            render(
                <Sidebar
                    items={mockItems}
                    header={<div>Header Content</div>}
                    footer={<div>Footer Content</div>}
                />
            )
            expect(screen.getByText('Header Content')).toBeInTheDocument()
            expect(screen.getByText('Footer Content')).toBeInTheDocument()
        })
    })

    describe('Selection', () => {
        it('should handle item selection', () => {
            const onSelect = jest.fn()
            render(<Sidebar items={mockItems} onSelect={onSelect} />)

            fireEvent.click(screen.getByText('Dashboard'))
            expect(onSelect).toHaveBeenCalledWith(
                '1',
                expect.objectContaining({ id: '1' })
            )
        })

        it('should support default selected item', () => {
            render(<Sidebar items={mockItems} defaultSelectedId="2" />)
            const projectsItem = screen.getByText('Projects').closest('button')
            expect(projectsItem).toHaveClass('sidebar__item--selected')
        })

        it('should support controlled selection', () => {
            const { rerender } = render(
                <Sidebar items={mockItems} selectedId="1" />
            )
            let dashboardItem = screen.getByText('Dashboard').closest('button')
            expect(dashboardItem).toHaveClass('sidebar__item--selected')

            rerender(<Sidebar items={mockItems} selectedId="2" />)
            dashboardItem = screen.getByText('Dashboard').closest('button')
            const projectsItem = screen.getByText('Projects').closest('button')
            expect(dashboardItem).not.toHaveClass('sidebar__item--selected')
            expect(projectsItem).toHaveClass('sidebar__item--selected')
        })

        it('should not select disabled items', () => {
            const onSelect = jest.fn()
            render(<Sidebar items={mockItems} onSelect={onSelect} />)

            const reportsButton = screen.getByText('Reports').closest('button')
            expect(reportsButton).toBeDisabled()
        })
    })

    describe('Expansion', () => {
        it('should expand items with children', () => {
            render(<Sidebar items={mockItems} />)

            // Children should not be visible initially
            expect(screen.queryByText('Members')).not.toBeInTheDocument()

            // Click to expand
            fireEvent.click(screen.getByText('Team'))
            expect(screen.getByText('Members')).toBeInTheDocument()
            expect(screen.getByText('Settings')).toBeInTheDocument()
        })

        it('should support default expanded items', () => {
            render(<Sidebar items={mockItems} defaultExpandedIds={['3']} />)
            expect(screen.getByText('Members')).toBeInTheDocument()
            expect(screen.getByText('Settings')).toBeInTheDocument()
        })

        it('should call onExpandedChange when expanding', () => {
            const onExpandedChange = jest.fn()
            render(
                <Sidebar
                    items={mockItems}
                    onExpandedChange={onExpandedChange}
                />
            )

            fireEvent.click(screen.getByText('Team'))
            expect(onExpandedChange).toHaveBeenCalledWith(['3'])
        })

        it('should collapse expanded items on second click', () => {
            render(<Sidebar items={mockItems} defaultExpandedIds={['3']} />)

            expect(screen.getByText('Members')).toBeInTheDocument()

            fireEvent.click(screen.getByText('Team'))
            expect(screen.queryByText('Members')).not.toBeInTheDocument()
        })
    })

    describe('Collapse', () => {
        it('should render collapse button by default', () => {
            render(<Sidebar items={mockItems} />)
            expect(
                screen.getByLabelText('Collapse sidebar')
            ).toBeInTheDocument()
        })

        it('should not render collapse button when showCollapseButton is false', () => {
            render(<Sidebar items={mockItems} showCollapseButton={false} />)
            expect(
                screen.queryByLabelText('Collapse sidebar')
            ).not.toBeInTheDocument()
        })

        it('should toggle collapsed state', () => {
            render(<Sidebar items={mockItems} />)
            const sidebar = screen.getByRole('navigation')

            expect(sidebar).not.toHaveClass('sidebar--collapsed')

            fireEvent.click(screen.getByLabelText('Collapse sidebar'))
            expect(sidebar).toHaveClass('sidebar--collapsed')

            fireEvent.click(screen.getByLabelText('Expand sidebar'))
            expect(sidebar).not.toHaveClass('sidebar--collapsed')
        })

        it('should call onCollapsedChange', () => {
            const onCollapsedChange = jest.fn()
            render(
                <Sidebar
                    items={mockItems}
                    onCollapsedChange={onCollapsedChange}
                />
            )

            fireEvent.click(screen.getByLabelText('Collapse sidebar'))
            expect(onCollapsedChange).toHaveBeenCalledWith(true)

            fireEvent.click(screen.getByLabelText('Expand sidebar'))
            expect(onCollapsedChange).toHaveBeenCalledWith(false)
        })

        it('should support controlled collapsed state', () => {
            const { rerender } = render(
                <Sidebar items={mockItems} collapsed={false} />
            )
            let sidebar = screen.getByRole('navigation')
            expect(sidebar).not.toHaveClass('sidebar--collapsed')

            rerender(<Sidebar items={mockItems} collapsed={true} />)
            sidebar = screen.getByRole('navigation')
            expect(sidebar).toHaveClass('sidebar--collapsed')
        })
    })

    describe('Variants', () => {
        it('should apply variant classes', () => {
            const { rerender } = render(
                <Sidebar items={mockItems} variant="default" />
            )
            let sidebar = screen.getByRole('navigation')
            expect(sidebar).toHaveClass('sidebar--default')

            rerender(<Sidebar items={mockItems} variant="floating" />)
            sidebar = screen.getByRole('navigation')
            expect(sidebar).toHaveClass('sidebar--floating')

            rerender(<Sidebar items={mockItems} variant="bordered" />)
            sidebar = screen.getByRole('navigation')
            expect(sidebar).toHaveClass('sidebar--bordered')
        })

        it('should apply position classes', () => {
            const { rerender } = render(
                <Sidebar items={mockItems} position="left" />
            )
            let sidebar = screen.getByRole('navigation')
            expect(sidebar).toHaveClass('sidebar--left')

            rerender(<Sidebar items={mockItems} position="right" />)
            sidebar = screen.getByRole('navigation')
            expect(sidebar).toHaveClass('sidebar--right')
        })

        it('should apply width classes', () => {
            const { rerender } = render(
                <Sidebar items={mockItems} width="narrow" />
            )
            let sidebar = screen.getByRole('navigation')
            expect(sidebar).toHaveClass('sidebar--narrow')

            rerender(<Sidebar items={mockItems} width="normal" />)
            sidebar = screen.getByRole('navigation')
            expect(sidebar).toHaveClass('sidebar--normal')

            rerender(<Sidebar items={mockItems} width="wide" />)
            sidebar = screen.getByRole('navigation')
            expect(sidebar).toHaveClass('sidebar--wide')
        })
    })

    describe('Links', () => {
        it('should render items with href as links', () => {
            const itemsWithLinks: SidebarItem[] = [
                { id: '1', label: 'Home', href: '/' },
                { id: '2', label: 'About', href: '/about' },
            ]
            render(<Sidebar items={itemsWithLinks} />)

            const homeLink = screen.getByText('Home').closest('a')
            expect(homeLink).toHaveAttribute('href', '/')

            const aboutLink = screen.getByText('About').closest('a')
            expect(aboutLink).toHaveAttribute('href', '/about')
        })
    })

    describe('Custom Rendering', () => {
        it('should use custom renderItem function', () => {
            const renderItem = jest.fn((item) => (
                <div
                    data-testid={`custom-${item.id}`}
                >{`Custom: ${item.label}`}</div>
            ))

            render(<Sidebar items={mockItems} renderItem={renderItem} />)

            expect(screen.getByTestId('custom-1')).toBeInTheDocument()
            expect(screen.getByText('Custom: Dashboard')).toBeInTheDocument()
            expect(renderItem).toHaveBeenCalled()
        })
    })

    describe('Dividers', () => {
        it('should render dividers', () => {
            const itemsWithDivider: SidebarItem[] = [
                { id: '1', label: 'Item 1' },
                { id: 'divider-1', label: '', divider: true },
                { id: '2', label: 'Item 2' },
            ]
            render(<Sidebar items={itemsWithDivider} />)

            const dividers = document.querySelectorAll('.sidebar__divider')
            expect(dividers).toHaveLength(1)
        })
    })

    describe('Accessibility', () => {
        it('should have proper ARIA attributes', () => {
            render(<Sidebar items={mockItems} defaultSelectedId="1" />)

            const sidebar = screen.getByRole('navigation')
            expect(sidebar).toHaveAttribute('aria-label', 'Sidebar navigation')

            const selectedItem = screen.getByText('Dashboard').closest('button')
            expect(selectedItem).toHaveAttribute('aria-current', 'page')
        })

        it('should have proper ARIA attributes for expandable items', () => {
            render(<Sidebar items={mockItems} />)

            const teamItem = screen.getByText('Team').closest('button')
            expect(teamItem).toHaveAttribute('aria-expanded', 'false')

            fireEvent.click(teamItem!)
            expect(teamItem).toHaveAttribute('aria-expanded', 'true')
        })

        it('should have aria-disabled for disabled items', () => {
            render(<Sidebar items={mockItems} />)

            const reportsLink = screen.getByText('Reports').closest('button')
            expect(reportsLink).toBeDisabled()
        })
    })
})
