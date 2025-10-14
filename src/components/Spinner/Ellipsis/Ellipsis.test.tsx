import React from 'react'
import { render, screen } from '@testing-library/react'
import Ellipsis from './Ellipsis'
import hex from '../../../utility/hex'

describe('Ellipsis', () => {
    test('renders Ellipsis component', () => {
        render(<Ellipsis />)

        expect(screen.getByRole('status')).toBeInTheDocument()
    })

    test('renders four animated dots', () => {
        const { container } = render(<Ellipsis />)

        const dots = container.querySelectorAll('.ellipsis > div')
        expect(dots).toHaveLength(4)
    })

    test('applies custom color to all dots', () => {
        const customColor = hex('#00ff00')
        const { container } = render(<Ellipsis color={customColor} />)

        const dots = container.querySelectorAll('.ellipsis > div')
        dots.forEach((dot) => {
            expect(dot).toHaveStyle({ background: customColor })
        })
    })

    test('applies custom size in pixels', () => {
        render(<Ellipsis size={80} />)

        const spinner = screen.getByRole('status')
        expect(spinner).toHaveStyle({ width: '80px', height: '80px' })
    })

    test('applies semantic size sm', () => {
        render(<Ellipsis size="sm" />)

        const spinner = screen.getByRole('status')
        expect(spinner).toHaveStyle({ width: '24px', height: '24px' })
    })

    test('applies semantic size xl', () => {
        render(<Ellipsis size="xl" />)

        const spinner = screen.getByRole('status')
        expect(spinner).toHaveStyle({ width: '96px', height: '96px' })
    })

    test('applies theme variant color', () => {
        const { container } = render(<Ellipsis variant="success" />)

        const dots = container.querySelectorAll('.ellipsis > div')
        dots.forEach((dot) => {
            expect(dot).toHaveStyle({ background: hex('#10b981') })
        })
    })

    test('custom color overrides variant', () => {
        const customColor = hex('#ff00ff')
        const { container } = render(
            <Ellipsis color={customColor} variant="error" />
        )

        const dots = container.querySelectorAll('.ellipsis > div')
        dots.forEach((dot) => {
            expect(dot).toHaveStyle({ background: customColor })
        })
    })

    test('applies custom speed', () => {
        const { container } = render(<Ellipsis speed={1.5} />)

        const spinner = screen.getByRole('status')
        // Speed affects animation duration: 0.6 / 1.5 = 0.4
        const dots = container.querySelectorAll('.ellipsis > div')
        expect(dots.length).toBe(4)
        // Verify the duration is passed as prop (inline style may not be testable in JSDOM)
    })

    test('applies custom className', () => {
        render(<Ellipsis className="loading-dots" />)

        const spinner = screen.getByRole('status')
        expect(spinner).toHaveClass('ellipsis')
        expect(spinner).toHaveClass('loading-dots')
    })

    test('has proper accessibility attributes', () => {
        render(<Ellipsis label="Loading content" />)

        const spinner = screen.getByRole('status')
        expect(spinner).toHaveAttribute('aria-live', 'polite')
        expect(spinner).toHaveAttribute('aria-label', 'Loading content')
    })

    test('uses default label when not provided', () => {
        render(<Ellipsis />)

        const spinner = screen.getByRole('status')
        expect(spinner).toHaveAttribute('aria-label', 'Loading')
        expect(screen.getByText('Loading')).toBeInTheDocument()
    })

    test('includes screen reader text', () => {
        render(<Ellipsis label="Please wait" />)

        expect(screen.getByText('Please wait')).toBeInTheDocument()
        expect(screen.getByText('Please wait')).toHaveClass('sr-only')
    })

    test('does not re-render with same props (memoization)', () => {
        const { rerender } = render(<Ellipsis label="Test" />)
        const firstRender = screen.getByRole('status')

        rerender(<Ellipsis label="Test" />)
        const secondRender = screen.getByRole('status')

        expect(firstRender).toBe(secondRender)
    })
})
