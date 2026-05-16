import React, { useState } from 'react'
import type { StoryObj, Meta } from '@storybook/react-vite'
import { LoadingBoundary } from './LoadingBoundary'
import { useSpinner } from '../hooks/useSpinner'
import SpinCoin from '../SpinCoin'
import Ellipsis from '../Ellipsis'

const meta: Meta<typeof LoadingBoundary> = {
    title: 'Components/Spinner/LoadingBoundary',
    component: LoadingBoundary,
}

export default meta

type Story = StoryObj<typeof LoadingBoundary>

export const Default: Story = {
    render: () => {
        const [loading, setLoading] = useState(true)

        return (
            <div>
                <button onClick={() => setLoading(!loading)}>
                    Toggle Loading
                </button>
                <LoadingBoundary loading={loading} label="Loading content">
                    <div style={{ padding: '20px', background: '#f0f0f0' }}>
                        <h2>Content Loaded!</h2>
                        <p>This content is only visible when not loading.</p>
                    </div>
                </LoadingBoundary>
            </div>
        )
    },
}

export const WithEllipsis: Story = {
    render: () => {
        const [loading, setLoading] = useState(true)

        return (
            <div>
                <button onClick={() => setLoading(!loading)}>
                    Toggle Loading
                </button>
                <LoadingBoundary
                    loading={loading}
                    label="Loading data"
                    spinner={Ellipsis}
                    spinnerProps={{ size: 'lg', variant: 'primary' }}
                >
                    <div style={{ padding: '20px', background: '#f0f0f0' }}>
                        <h2>Data Loaded!</h2>
                        <p>Using Ellipsis spinner variant.</p>
                    </div>
                </LoadingBoundary>
            </div>
        )
    },
}

export const WithCustomSpinner: Story = {
    render: () => {
        const [loading, setLoading] = useState(true)

        return (
            <div>
                <button onClick={() => setLoading(!loading)}>
                    Toggle Loading
                </button>
                <LoadingBoundary
                    loading={loading}
                    label="Processing request"
                    spinner={SpinCoin}
                    spinnerProps={{
                        size: 'xl',
                        variant: 'success',
                        speed: 1.5,
                    }}
                >
                    <div style={{ padding: '20px', background: '#f0f0f0' }}>
                        <h2>Request Complete!</h2>
                        <p>Custom spinner with large size and fast speed.</p>
                    </div>
                </LoadingBoundary>
            </div>
        )
    },
}

export const WithHook: Story = {
    render: () => {
        const { loading, withSpinner } = useSpinner()

        const handleClick = async () => {
            await withSpinner(
                new Promise((resolve) => setTimeout(resolve, 2000))
            )
        }

        return (
            <div>
                <button onClick={handleClick} disabled={loading}>
                    {loading ? 'Loading...' : 'Start Loading'}
                </button>
                <LoadingBoundary loading={loading} label="Processing">
                    <div
                        style={{
                            padding: '20px',
                            background: '#f0f0f0',
                            marginTop: '10px',
                        }}
                    >
                        <h2>Complete!</h2>
                        <p>This example uses the useSpinner hook.</p>
                    </div>
                </LoadingBoundary>
            </div>
        )
    },
}
