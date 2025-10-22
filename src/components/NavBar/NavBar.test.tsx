import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import NavBar, { NavBarItem } from './NavBar'

describe('NavBar', () => {
    const basicItems: NavBarItem[] = [
        { id: 'home', label: 'Home', href: '#home' },
        { id: 'about', label: 'About', href: '#about' },
        { id: 'contact', label: 'Contact', href: '#contact' },
    ]

    describe('rendering', () => {
        it('should render with brand', () => {
            render(<NavBar brand={<strong>MyApp</strong>} />)
            expect(screen.getByText('MyApp')).toBeInTheDocument()
        })

        it('should render navigation items', () => {
            render(<NavBar items={basicItems} />)
            expect(screen.getByText('Home')).toBeInTheDocument()
            expect(screen.getByText('About')).toBeInTheDocument()
            expect(screen.getByText('Contact')).toBeInTheDocument()
        })

        it('should render actions', () => {
            render(<NavBar actions={<button>Login</button>} />)
            expect(screen.getByText('Login')).toBeInTheDocument()
        })

        it('should render with custom className', () => {
            const { container } = render(
                <NavBar className="custom-navbar" items={basicItems} />
            )
            expect(
                container.querySelector('.custom-navbar')
            ).toBeInTheDocument()
        })
    })

    describe('variants', () => {
        it('should apply default variant', () => {
            const { container } = render(
                <NavBar items={basicItems} variant="default" />
            )
            expect(
                container.querySelector('.navbar--default')
            ).toBeInTheDocument()
        })

        it('should apply elevated variant', () => {
            const { container } = render(
                <NavBar items={basicItems} variant="elevated" />
            )
            expect(
                container.querySelector('.navbar--elevated')
            ).toBeInTheDocument()
        })

        it('should apply bordered variant', () => {
            const { container } = render(
                <NavBar items={basicItems} variant="bordered" />
            )
            expect(
                container.querySelector('.navbar--bordered')
            ).toBeInTheDocument()
        })
    })

    describe('position', () => {
        it('should apply static position', () => {
            const { container } = render(
                <NavBar items={basicItems} position="static" />
            )
            expect(
                container.querySelector('.navbar--static')
            ).toBeInTheDocument()
        })

        it('should apply sticky position', () => {
            const { container } = render(
                <NavBar items={basicItems} position="sticky" />
            )
            expect(
                container.querySelector('.navbar--sticky')
            ).toBeInTheDocument()
        })

        it('should apply fixed position', () => {
            const { container } = render(
                <NavBar items={basicItems} position="fixed" />
            )
            expect(
                container.querySelector('.navbar--fixed')
            ).toBeInTheDocument()
        })
    })

    describe('active state', () => {
        it('should mark active item', () => {
            const { container } = render(
                <NavBar items={basicItems} activeId="about" />
            )
            const activeItem = container.querySelector('.navbar__item--active')
            expect(activeItem).toBeInTheDocument()
            expect(activeItem?.textContent).toBe('About')
        })

        it('should add aria-current to active link', () => {
            render(<NavBar items={basicItems} activeId="home" />)
            const link = screen.getByRole('link', { name: 'Home' })
            expect(link).toHaveAttribute('aria-current', 'page')
        })
    })

    describe('navigation items', () => {
        it('should render items with icons', () => {
            const itemsWithIcons: NavBarItem[] = [
                { id: 'home', label: 'Home', icon: '🏠', href: '#home' },
            ]
            render(<NavBar items={itemsWithIcons} />)
            expect(screen.getByText('🏠')).toBeInTheDocument()
        })

        it('should render items with badges', () => {
            const itemsWithBadges: NavBarItem[] = [
                {
                    id: 'messages',
                    label: 'Messages',
                    badge: 5,
                    href: '#messages',
                },
            ]
            render(<NavBar items={itemsWithBadges} />)
            expect(screen.getByText('5')).toBeInTheDocument()
        })

        it('should render badge with string value', () => {
            const itemsWithBadges: NavBarItem[] = [
                { id: 'new', label: 'Updates', badge: 'New', href: '#new' },
            ]
            render(<NavBar items={itemsWithBadges} />)
            expect(screen.getByText('New')).toBeInTheDocument()
            expect(screen.getByText('Updates')).toBeInTheDocument()
        })

        it('should handle disabled items', () => {
            const disabledItems: NavBarItem[] = [
                {
                    id: 'disabled',
                    label: 'Disabled',
                    href: '#',
                    disabled: true,
                },
            ]
            render(<NavBar items={disabledItems} />)
            const link = screen.getByRole('link', { name: 'Disabled' })
            expect(link).toHaveAttribute('aria-disabled', 'true')
        })

        it('should call onClick handler', () => {
            const handleClick = jest.fn()
            const items: NavBarItem[] = [
                { id: 'home', label: 'Home', onClick: handleClick },
            ]
            render(<NavBar items={items} />)
            fireEvent.click(screen.getByText('Home'))
            expect(handleClick).toHaveBeenCalledTimes(1)
        })
    })

    describe('dropdown items', () => {
        const dropdownItems: NavBarItem[] = [
            {
                id: 'products',
                label: 'Products',
                items: [
                    { id: 'product-1', label: 'Widget', href: '#widget' },
                    { id: 'product-2', label: 'Gadget', href: '#gadget' },
                ],
            },
        ]

        it('should render dropdown trigger', () => {
            render(<NavBar items={dropdownItems} />)
            expect(screen.getByText('Products')).toBeInTheDocument()
        })

        it('should toggle dropdown on click', () => {
            render(<NavBar items={dropdownItems} />)
            const trigger = screen.getByRole('button', { name: /Products/i })

            // Initially closed
            expect(screen.queryByText('Widget')).not.toBeInTheDocument()

            // Open dropdown
            fireEvent.click(trigger)
            expect(screen.getByText('Widget')).toBeInTheDocument()
            expect(screen.getByText('Gadget')).toBeInTheDocument()

            // Close dropdown
            fireEvent.click(trigger)
            expect(screen.queryByText('Widget')).not.toBeInTheDocument()
        })

        it('should set aria-expanded on dropdown trigger', () => {
            render(<NavBar items={dropdownItems} />)
            const trigger = screen.getByRole('button', { name: /Products/i })

            expect(trigger).toHaveAttribute('aria-expanded', 'false')

            fireEvent.click(trigger)
            expect(trigger).toHaveAttribute('aria-expanded', 'true')
        })

        it('should set aria-haspopup on dropdown trigger', () => {
            render(<NavBar items={dropdownItems} />)
            const trigger = screen.getByRole('button', { name: /Products/i })
            expect(trigger).toHaveAttribute('aria-haspopup', 'true')
        })
    })

    describe('mobile menu', () => {
        it('should render mobile toggle button', () => {
            render(<NavBar items={basicItems} showMobileToggle={true} />)
            expect(
                screen.getByRole('button', { name: 'Toggle navigation menu' })
            ).toBeInTheDocument()
        })

        it('should not render mobile toggle when disabled', () => {
            render(<NavBar items={basicItems} showMobileToggle={false} />)
            expect(
                screen.queryByRole('button', { name: 'Toggle navigation menu' })
            ).not.toBeInTheDocument()
        })

        it('should toggle collapsed state', () => {
            const { container } = render(<NavBar items={basicItems} />)
            const toggle = screen.getByRole('button', {
                name: 'Toggle navigation menu',
            })

            // Initially collapsed
            expect(
                container.querySelector('.navbar--expanded')
            ).not.toBeInTheDocument()

            // Expand
            fireEvent.click(toggle)
            expect(
                container.querySelector('.navbar--expanded')
            ).toBeInTheDocument()

            // Collapse
            fireEvent.click(toggle)
            expect(
                container.querySelector('.navbar--expanded')
            ).not.toBeInTheDocument()
        })

        it('should call onCollapseChange callback', () => {
            const handleCollapseChange = jest.fn()
            render(
                <NavBar
                    items={basicItems}
                    onCollapseChange={handleCollapseChange}
                />
            )
            const toggle = screen.getByRole('button', {
                name: 'Toggle navigation menu',
            })

            fireEvent.click(toggle)
            expect(handleCollapseChange).toHaveBeenCalledWith(false)

            fireEvent.click(toggle)
            expect(handleCollapseChange).toHaveBeenCalledWith(true)
        })

        it('should support controlled collapsed state', () => {
            const { container, rerender } = render(
                <NavBar items={basicItems} collapsed={true} />
            )
            expect(
                container.querySelector('.navbar--expanded')
            ).not.toBeInTheDocument()

            rerender(<NavBar items={basicItems} collapsed={false} />)
            expect(
                container.querySelector('.navbar--expanded')
            ).toBeInTheDocument()
        })
    })

    describe('accessibility', () => {
        it('should have navigation role', () => {
            render(<NavBar items={basicItems} />)
            expect(screen.getByRole('navigation')).toBeInTheDocument()
        })

        it('should have default aria-label', () => {
            render(<NavBar items={basicItems} />)
            expect(screen.getByLabelText('Main navigation')).toBeInTheDocument()
        })

        it('should accept custom aria-label', () => {
            render(
                <NavBar items={basicItems} aria-label="Primary navigation" />
            )
            expect(
                screen.getByLabelText('Primary navigation')
            ).toBeInTheDocument()
        })

        it('should have menubar role on items list', () => {
            render(<NavBar items={basicItems} />)
            expect(screen.getByRole('menubar')).toBeInTheDocument()
        })
    })

    describe('link rendering', () => {
        it('should render links for items with href', () => {
            render(<NavBar items={basicItems} />)
            const homeLink = screen.getByRole('link', { name: 'Home' })
            expect(homeLink).toHaveAttribute('href', '#home')
        })

        it('should render buttons for items without href', () => {
            const items: NavBarItem[] = [
                { id: 'action', label: 'Action', onClick: jest.fn() },
            ]
            render(<NavBar items={items} />)
            expect(
                screen.getByRole('button', { name: 'Action' })
            ).toBeInTheDocument()
        })
    })
})
