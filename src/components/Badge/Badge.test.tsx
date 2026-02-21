import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Badge from './Badge'

describe('Badge', () => {
    it('renders children content', () => {
        render(<Badge>5</Badge>)
        expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('applies variant class', () => {
        const { container } = render(<Badge variant="primary">New</Badge>)
        expect(container.firstChild).toHaveClass('badge--primary')
    })

    it('applies size class', () => {
        const { container } = render(<Badge size="lg">99+</Badge>)
        expect(container.firstChild).toHaveClass('badge--lg')
    })

    it('renders as a dot without children', () => {
        const { container } = render(<Badge dot>Hidden</Badge>)
        expect(container.firstChild).toHaveClass('badge--dot')
        expect(container.firstChild).not.toHaveTextContent('Hidden')
    })

    it('applies rounded class by default', () => {
        const { container } = render(<Badge>1</Badge>)
        expect(container.firstChild).toHaveClass('badge--rounded')
    })

    it('removes rounded class when rounded=false', () => {
        const { container } = render(<Badge rounded={false}>1</Badge>)
        expect(container.firstChild).not.toHaveClass('badge--rounded')
    })

    it('is clickable when onClick is provided', () => {
        const handleClick = jest.fn()
        render(<Badge onClick={handleClick}>Click</Badge>)
        const badge = screen.getByRole('button')
        fireEvent.click(badge)
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('supports keyboard activation when clickable', () => {
        const handleClick = jest.fn()
        render(<Badge onClick={handleClick}>Press</Badge>)
        const badge = screen.getByRole('button')
        fireEvent.keyDown(badge, { key: 'Enter' })
        fireEvent.keyDown(badge, { key: ' ' })
        expect(handleClick).toHaveBeenCalledTimes(2)
    })

    it('does not get role="button" without onClick', () => {
        render(<Badge>Info</Badge>)
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('applies ariaLabel', () => {
        render(<Badge ariaLabel="5 notifications">5</Badge>)
        expect(screen.getByLabelText('5 notifications')).toBeInTheDocument()
    })

    it('applies custom className', () => {
        const { container } = render(<Badge className="custom">1</Badge>)
        expect(container.firstChild).toHaveClass('custom')
    })
})
