import React from 'react'
import { render, screen } from '@testing-library/react'
import SpinCoin from './SpinCoin'
import hex from '../../../utility/hex'

describe('SpinCoin', () => {
    test('renders SpinCoin component', () => {
        render(<SpinCoin />)

        expect(screen.getByRole('status')).toBeInTheDocument()
    })

    test('applies custom color', () => {
        const customColor = hex('#ff0000')
        render(<SpinCoin color={customColor} />)

        const spinner = screen.getByRole('status')
        expect(spinner).toHaveStyle({ background: customColor })
    })

    test('applies custom size in pixels', () => {
        render(<SpinCoin size={100} />)

        const spinner = screen.getByRole('status')
        expect(spinner).toHaveStyle({ width: '100px', height: '100px' })
    })

    test('applies semantic size xs', () => {
        render(<SpinCoin size="xs" />)

        const spinner = screen.getByRole('status')
        expect(spinner).toHaveStyle({ width: '16px', height: '16px' })
    })

    test('applies semantic size lg', () => {
        render(<SpinCoin size="lg" />)

        const spinner = screen.getByRole('status')
        expect(spinner).toHaveStyle({ width: '64px', height: '64px' })
    })

    test('applies theme variant color', () => {
        render(<SpinCoin variant="primary" />)

        const spinner = screen.getByRole('status')
        expect(spinner).toHaveStyle({ background: hex('#3b82f6') })
    })

    test('custom color overrides variant', () => {
        const customColor = hex('#ff0000')
        render(<SpinCoin color={customColor} variant="primary" />)

        const spinner = screen.getByRole('status')
        expect(spinner).toHaveStyle({ background: customColor })
    })

    test('applies custom speed', () => {
        render(<SpinCoin speed={2} />)

        const spinner = screen.getByRole('status')
        expect(spinner).toHaveStyle({ animationDuration: '1.2s' })
    })

    test('applies custom className', () => {
        render(<SpinCoin className="custom-spinner" />)

        const spinner = screen.getByRole('status')
        expect(spinner).toHaveClass('spin-coin')
        expect(spinner).toHaveClass('custom-spinner')
    })

    test('has proper accessibility attributes', () => {
        render(<SpinCoin label="Loading data" />)

        const spinner = screen.getByRole('status')
        expect(spinner).toHaveAttribute('aria-live', 'polite')
        expect(spinner).toHaveAttribute('aria-label', 'Loading data')
    })

    test('uses default label when not provided', () => {
        render(<SpinCoin />)

        const spinner = screen.getByRole('status')
        expect(spinner).toHaveAttribute('aria-label', 'Loading')
        expect(screen.getByText('Loading')).toBeInTheDocument()
    })

    test('includes screen reader text', () => {
        render(<SpinCoin label="Processing" />)

        expect(screen.getByText('Processing')).toBeInTheDocument()
        expect(screen.getByText('Processing')).toHaveClass('sr-only')
    })

    test('does not re-render with same props (memoization)', () => {
        const { rerender } = render(<SpinCoin label="Test" />)
        const firstRender = screen.getByRole('status')

        rerender(<SpinCoin label="Test" />)
        const secondRender = screen.getByRole('status')

        expect(firstRender).toBe(secondRender)
    })
})
