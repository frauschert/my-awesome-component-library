import React from 'react'
import { render, screen } from '@testing-library/react'
import EmptyState from './EmptyState'

describe('EmptyState', () => {
    it('renders the title', () => {
        render(<EmptyState title="No results found" />)
        expect(screen.getByText('No results found')).toBeInTheDocument()
    })

    it('renders the description when provided', () => {
        render(
            <EmptyState
                title="No results"
                description="Try adjusting your search filters."
            />
        )
        expect(
            screen.getByText('Try adjusting your search filters.')
        ).toBeInTheDocument()
    })

    it('does not render description when not provided', () => {
        const { container } = render(<EmptyState title="Empty" />)
        expect(
            container.querySelector('.empty-state__description')
        ).not.toBeInTheDocument()
    })

    it('renders icon when provided', () => {
        render(
            <EmptyState
                title="Empty"
                icon={<span data-testid="icon">🗂</span>}
            />
        )
        expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('renders action when provided', () => {
        render(
            <EmptyState title="Empty" action={<button>Create item</button>} />
        )
        expect(
            screen.getByRole('button', { name: 'Create item' })
        ).toBeInTheDocument()
    })

    it('has role="status" for screen readers', () => {
        render(<EmptyState title="Empty" />)
        expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('applies size class', () => {
        render(<EmptyState title="Empty" size="large" />)
        expect(screen.getByRole('status')).toHaveClass('empty-state--large')
    })

    it('forwards className and extra props', () => {
        render(
            <EmptyState title="Empty" className="my-class" data-testid="es" />
        )
        const el = screen.getByTestId('es')
        expect(el).toHaveClass('my-class')
    })
})
