import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from './ErrorBoundary'

// Use a module-level flag so we can stop throwing before the reset re-render
let shouldThrow = false

const ThrowingComponent = ({ shouldThrow: prop }: { shouldThrow: boolean }) => {
    if (prop || shouldThrow) throw new Error('Test error')
    return <div>Normal content</div>
}

// Suppress console.error noise from React error boundary during tests
beforeAll(() => jest.spyOn(console, 'error').mockImplementation(() => {}))
afterAll(() => (console.error as jest.Mock).mockRestore())

describe('ErrorBoundary', () => {
    it('renders children when there is no error', () => {
        render(
            <ErrorBoundary>
                <ThrowingComponent shouldThrow={false} />
            </ErrorBoundary>
        )
        expect(screen.getByText('Normal content')).toBeInTheDocument()
    })

    it('renders default fallback UI when a render error occurs', () => {
        render(
            <ErrorBoundary>
                <ThrowingComponent shouldThrow />
            </ErrorBoundary>
        )
        expect(screen.getByRole('alert')).toBeInTheDocument()
        expect(screen.getByText('Something went wrong')).toBeInTheDocument()
        expect(screen.getByText('Test error')).toBeInTheDocument()
    })

    it('renders custom fallback node when provided', () => {
        render(
            <ErrorBoundary fallback={<div>Custom error UI</div>}>
                <ThrowingComponent shouldThrow />
            </ErrorBoundary>
        )
        expect(screen.getByText('Custom error UI')).toBeInTheDocument()
    })

    it('renders custom fallback render-prop when provided', () => {
        render(
            <ErrorBoundary
                fallback={({ error }) => <div>Error: {error.message}</div>}
            >
                <ThrowingComponent shouldThrow />
            </ErrorBoundary>
        )
        expect(screen.getByText('Error: Test error')).toBeInTheDocument()
    })

    it('resets error state when reset button is clicked', () => {
        shouldThrow = true
        render(
            <ErrorBoundary>
                <ThrowingComponent shouldThrow={false} />
            </ErrorBoundary>
        )
        expect(screen.getByRole('alert')).toBeInTheDocument()
        // Stop throwing before reset triggers re-render
        shouldThrow = false
        fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
        expect(screen.getByText('Normal content')).toBeInTheDocument()
    })

    it('calls onError callback when error is caught', () => {
        const onError = jest.fn()
        render(
            <ErrorBoundary onError={onError}>
                <ThrowingComponent shouldThrow />
            </ErrorBoundary>
        )
        expect(onError).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({ componentStack: expect.any(String) })
        )
    })

    it('calls onReset callback when error is reset', () => {
        const onReset = jest.fn()
        render(
            <ErrorBoundary onReset={onReset}>
                <ThrowingComponent shouldThrow />
            </ErrorBoundary>
        )
        fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
        expect(onReset).toHaveBeenCalled()
    })

    it('exposes resetError via render-prop fallback', () => {
        const onReset = jest.fn()
        shouldThrow = true
        const { rerender } = render(
            <ErrorBoundary
                onReset={onReset}
                fallback={({ resetError }) => (
                    <button onClick={resetError}>Reset</button>
                )}
            >
                <ThrowingComponent shouldThrow={false} />
            </ErrorBoundary>
        )
        shouldThrow = false
        fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
        expect(onReset).toHaveBeenCalled()
        expect(screen.getByText('Normal content')).toBeInTheDocument()
    })
})
