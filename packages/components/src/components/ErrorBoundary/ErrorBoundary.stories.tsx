import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import ErrorBoundary from './ErrorBoundary'
import Button from '../Button'

const meta: Meta<typeof ErrorBoundary> = {
    title: 'Components/ErrorBoundary',
    component: ErrorBoundary,
}

export default meta
type Story = StoryObj<typeof ErrorBoundary>

const BrokenComponent = () => {
    throw new Error('Simulated render error')
}

export const DefaultFallback: Story = {
    render: () => (
        <ErrorBoundary>
            <BrokenComponent />
        </ErrorBoundary>
    ),
}

export const CustomFallbackNode: Story = {
    render: () => (
        <ErrorBoundary
            fallback={
                <div style={{ padding: '2rem', color: 'salmon' }}>
                    Custom fallback UI — something broke.
                </div>
            }
        >
            <BrokenComponent />
        </ErrorBoundary>
    ),
}

export const CustomFallbackRenderProp: Story = {
    render: () => (
        <ErrorBoundary
            fallback={({ error, resetError }) => (
                <div style={{ padding: '2rem' }}>
                    <p>Caught: {error.message}</p>
                    <Button variant="danger" onClick={resetError}>
                        Reset
                    </Button>
                </div>
            )}
        >
            <BrokenComponent />
        </ErrorBoundary>
    ),
}

export const NoError: Story = {
    render: () => (
        <ErrorBoundary>
            <div style={{ padding: '2rem' }}>
                No error — children render normally.
            </div>
        </ErrorBoundary>
    ),
}
