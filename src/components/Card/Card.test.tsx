import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Card from './Card'

describe('Card', () => {
    it('renders children content', () => {
        render(<Card>Card content</Card>)
        expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('applies variant class', () => {
        const { container } = render(<Card variant="outlined">Content</Card>)
        expect(container.firstChild).toHaveClass('card--outlined')
    })

    it('applies padding class', () => {
        const { container } = render(<Card padding="lg">Content</Card>)
        expect(container.firstChild).toHaveClass('card--padding-lg')
    })

    it('is clickable when onClick is provided', () => {
        const handleClick = jest.fn()
        render(<Card onClick={handleClick}>Click me</Card>)
        const card = screen.getByRole('button')
        fireEvent.click(card)
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('supports keyboard activation when clickable', () => {
        const handleClick = jest.fn()
        render(<Card onClick={handleClick}>Press</Card>)
        const card = screen.getByRole('button')
        fireEvent.keyDown(card, { key: 'Enter' })
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not get role="button" without onClick', () => {
        render(<Card>Info</Card>)
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('renders Card.Header with actions', () => {
        render(
            <Card>
                <Card.Header actions={<button>Edit</button>}>Title</Card.Header>
            </Card>
        )
        expect(screen.getByText('Title')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
    })

    it('renders Card.Body and Card.Footer', () => {
        render(
            <Card>
                <Card.Body>Body content</Card.Body>
                <Card.Footer>Footer content</Card.Footer>
            </Card>
        )
        expect(screen.getByText('Body content')).toBeInTheDocument()
        expect(screen.getByText('Footer content')).toBeInTheDocument()
    })

    it('applies ariaLabel', () => {
        render(<Card ariaLabel="User profile card">Content</Card>)
        expect(screen.getByLabelText('User profile card')).toBeInTheDocument()
    })

    it('applies custom className and style', () => {
        const { container } = render(
            <Card className="my-card" style={{ maxWidth: 400 }}>
                Content
            </Card>
        )
        expect(container.firstChild).toHaveClass('my-card')
        expect(container.firstChild).toHaveStyle({ maxWidth: '400px' })
    })

    it('applies clickable class when clickable prop is true', () => {
        const { container } = render(<Card clickable>Content</Card>)
        expect(container.firstChild).toHaveClass('card--clickable')
    })
})
