import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Button from './Button'

describe('Button', () => {
    it('renders label via children or prop', () => {
        const { rerender } = render(<Button>Click me</Button>)
        expect(screen.getByRole('button')).toHaveTextContent('Click me')

        rerender(<Button label="Tap" />)
        expect(screen.getByRole('button')).toHaveTextContent('Tap')
    })

    it('respects variant and size classes', () => {
        render(
            <Button variant="secondary" size="large">
                Label
            </Button>
        )
        const btn = screen.getByRole('button')
        expect(btn.className).toMatch(/button--secondary/)
        expect(btn.className).toMatch(/button--large/)
    })

    it('prevents click when disabled or loading', () => {
        const onClick = jest.fn()
        const { rerender } = render(
            <Button onClick={onClick} disabled>
                Disabled
            </Button>
        )
        fireEvent.click(screen.getByRole('button'))
        expect(onClick).not.toHaveBeenCalled()

        rerender(
            <Button onClick={onClick} loading>
                Loading
            </Button>
        )
        fireEvent.click(screen.getByRole('button'))
        expect(onClick).not.toHaveBeenCalled()
        expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
    })

    it('supports submit and reset types', () => {
        const { rerender } = render(<Button type="submit">Submit</Button>)
        expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
        rerender(<Button type="reset">Reset</Button>)
        expect(screen.getByRole('button')).toHaveAttribute('type', 'reset')
    })

    it('renders left and right icons', () => {
        render(
            <Button
                leftIcon={<span data-testid="left">L</span>}
                rightIcon={<span data-testid="right">R</span>}
            >
                Content
            </Button>
        )
        expect(screen.getByTestId('left')).toBeInTheDocument()
        expect(screen.getByTestId('right')).toBeInTheDocument()
    })
})
