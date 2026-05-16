import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Breadcrumb from './Breadcrumb'
import type { BreadcrumbItem } from './Breadcrumb'

describe('Breadcrumb', () => {
    const basicItems: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Laptop' },
    ]

    it('renders breadcrumb items', () => {
        render(<Breadcrumb items={basicItems} />)

        expect(screen.getByText('Home')).toBeInTheDocument()
        expect(screen.getByText('Products')).toBeInTheDocument()
        expect(screen.getByText('Laptop')).toBeInTheDocument()
    })

    it('renders links for items with href', () => {
        render(<Breadcrumb items={basicItems} />)

        const homeLink = screen.getByRole('link', { name: 'Home' })
        expect(homeLink).toHaveAttribute('href', '/')

        const productsLink = screen.getByRole('link', { name: 'Products' })
        expect(productsLink).toHaveAttribute('href', '/products')
    })

    it('marks the last item as current', () => {
        render(<Breadcrumb items={basicItems} />)

        const currentItem = screen.getByText('Laptop')
        expect(currentItem).toHaveAttribute('aria-current', 'page')
    })

    it('renders custom separator', () => {
        render(<Breadcrumb items={basicItems} separator=">" />)

        const separators = screen.getAllByText('>')
        expect(separators).toHaveLength(2) // One less than number of items
    })

    it('calls onClick handler when item is clicked', async () => {
        const user = userEvent.setup()
        const handleClick = jest.fn((e) => e.preventDefault())

        const items: BreadcrumbItem[] = [
            { label: 'Home', onClick: handleClick },
            { label: 'Current' },
        ]

        render(<Breadcrumb items={items} />)

        const homeLink = screen.getByRole('link', { name: 'Home' })
        await user.click(homeLink)

        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('collapses items when maxItems is set', () => {
        const longItems: BreadcrumbItem[] = [
            { label: 'Home', href: '/' },
            { label: 'Docs', href: '/docs' },
            { label: 'API', href: '/docs/api' },
            { label: 'Components', href: '/docs/api/components' },
            { label: 'Button' },
        ]

        render(
            <Breadcrumb
                items={longItems}
                maxItems={3}
                itemsBeforeCollapse={1}
                itemsAfterCollapse={1}
            />
        )

        expect(screen.getByText('Home')).toBeInTheDocument()
        expect(screen.getByText('...')).toBeInTheDocument()
        expect(screen.getByText('Button')).toBeInTheDocument()

        expect(screen.queryByText('Docs')).not.toBeInTheDocument()
        expect(screen.queryByText('API')).not.toBeInTheDocument()
    })

    it('renders single item breadcrumb', () => {
        const items: BreadcrumbItem[] = [{ label: 'Current Page' }]

        render(<Breadcrumb items={items} />)

        expect(screen.getByText('Current Page')).toBeInTheDocument()
        expect(screen.getByText('Current Page')).toHaveAttribute(
            'aria-current',
            'page'
        )
    })

    it('applies custom className', () => {
        const { container } = render(
            <Breadcrumb items={basicItems} className="custom-class" />
        )

        const breadcrumb = container.querySelector('.breadcrumb')
        expect(breadcrumb).toHaveClass('custom-class')
    })

    it('has proper accessibility attributes', () => {
        render(<Breadcrumb items={basicItems} />)

        const nav = screen.getByRole('navigation', { name: 'Breadcrumb' })
        expect(nav).toBeInTheDocument()

        const list = nav.querySelector('ol')
        expect(list).toBeInTheDocument()
    })
})
