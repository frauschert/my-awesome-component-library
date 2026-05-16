import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Alert from './Alert'

describe('Alert', () => {
    it('renders with children', () => {
        render(<Alert>Test alert message</Alert>)
        expect(screen.getByText('Test alert message')).toBeInTheDocument()
    })

    it('renders with title', () => {
        render(<Alert title="Alert Title">Alert content</Alert>)
        expect(screen.getByText('Alert Title')).toBeInTheDocument()
        expect(screen.getByText('Alert content')).toBeInTheDocument()
    })

    it('applies correct variant classes', () => {
        const { rerender } = render(<Alert variant="info">Info message</Alert>)
        expect(screen.getByRole('status')).toHaveClass('alert--info')

        rerender(<Alert variant="success">Success message</Alert>)
        expect(screen.getByRole('status')).toHaveClass('alert--success')

        rerender(<Alert variant="warning">Warning message</Alert>)
        expect(screen.getByRole('alert')).toHaveClass('alert--warning')

        rerender(<Alert variant="error">Error message</Alert>)
        expect(screen.getByRole('alert')).toHaveClass('alert--error')
    })

    it('applies correct size classes', () => {
        const { rerender } = render(<Alert size="sm">Small alert</Alert>)
        expect(screen.getByRole('status')).toHaveClass('alert--sm')

        rerender(<Alert size="md">Medium alert</Alert>)
        expect(screen.getByRole('status')).toHaveClass('alert--md')

        rerender(<Alert size="lg">Large alert</Alert>)
        expect(screen.getByRole('status')).toHaveClass('alert--lg')
    })

    it('shows icon by default', () => {
        const { container } = render(<Alert>With icon</Alert>)
        expect(container.querySelector('.alert__icon')).toBeInTheDocument()
    })

    it('hides icon when showIcon is false', () => {
        const { container } = render(<Alert showIcon={false}>No icon</Alert>)
        expect(container.querySelector('.alert__icon')).not.toBeInTheDocument()
    })

    it('renders custom icon', () => {
        render(
            <Alert icon={<span data-testid="custom-icon">🎉</span>}>
                Custom icon
            </Alert>
        )
        expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })

    it('renders dismiss button when dismissible', () => {
        render(<Alert dismissible>Dismissible alert</Alert>)
        expect(screen.getByLabelText('Dismiss alert')).toBeInTheDocument()
    })

    it('calls onDismiss and removes alert when dismissed', () => {
        const handleDismiss = jest.fn()
        render(
            <Alert dismissible onDismiss={handleDismiss}>
                Dismissible alert
            </Alert>
        )

        const dismissButton = screen.getByLabelText('Dismiss alert')
        fireEvent.click(dismissButton)

        expect(handleDismiss).toHaveBeenCalledTimes(1)
        expect(screen.queryByText('Dismissible alert')).not.toBeInTheDocument()
    })

    it('applies bordered class', () => {
        render(<Alert bordered>Bordered alert</Alert>)
        expect(screen.getByRole('status')).toHaveClass('alert--bordered')
    })

    it('applies filled class', () => {
        render(<Alert filled>Filled alert</Alert>)
        expect(screen.getByRole('status')).toHaveClass('alert--filled')
    })

    it('uses correct ARIA role for variants', () => {
        const { rerender } = render(<Alert variant="info">Info</Alert>)
        expect(screen.getByRole('status')).toBeInTheDocument()

        rerender(<Alert variant="success">Success</Alert>)
        expect(screen.getByRole('status')).toBeInTheDocument()

        rerender(<Alert variant="warning">Warning</Alert>)
        expect(screen.getByRole('alert')).toBeInTheDocument()

        rerender(<Alert variant="error">Error</Alert>)
        expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('allows custom role override', () => {
        render(<Alert role="log">Custom role</Alert>)
        expect(screen.getByRole('log')).toBeInTheDocument()
    })

    it('applies custom className', () => {
        render(<Alert className="custom-class">Alert</Alert>)
        expect(screen.getByRole('status')).toHaveClass('custom-class')
    })

    it('applies custom styles', () => {
        render(<Alert style={{ marginTop: '20px' }}>Styled alert</Alert>)
        expect(screen.getByRole('status')).toHaveStyle({ marginTop: '20px' })
    })

    it('has correct accessibility attributes', () => {
        render(<Alert>Accessible alert</Alert>)
        const alert = screen.getByRole('status')
        expect(alert).toHaveAttribute('aria-live', 'polite')
        expect(alert).toHaveAttribute('aria-atomic', 'true')
    })
})
