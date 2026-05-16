import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import LaserSpinner from './LaserSpinner'

const meta: Meta<typeof LaserSpinner> = {
    title: 'Components/LaserSpinner',
    component: LaserSpinner,
    parameters: {
        layout: 'centered',
        backgrounds: {
            default: 'dark',
            values: [
                { name: 'dark', value: '#1a1a1a' },
                { name: 'light', value: '#f5f5f5' },
            ],
        },
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg', 'xl'],
            description: 'Size of the spinner',
        },
        variant: {
            control: 'select',
            options: ['primary', 'hot', 'electric', 'plasma'],
            description: 'Welding effect theme',
        },
        sparks: {
            control: { type: 'number', min: 4, max: 16, step: 1 },
            description: 'Number of welding sparks',
        },
        speed: {
            control: { type: 'number', min: 500, max: 3000, step: 100 },
            description: 'Animation speed in milliseconds',
        },
        showGlow: {
            control: 'boolean',
            description: 'Show intense welding glow effect',
        },
        label: {
            control: 'text',
            description: 'Loading text label',
        },
    },
}

export default meta
type Story = StoryObj<typeof LaserSpinner>

// Default - Hot Welding
export const Default: Story = {
    args: {
        size: 'md',
        variant: 'hot',
        sparks: 8,
        speed: 1200,
        showGlow: true,
    },
}

// Sizes
export const Small: Story = {
    args: {
        size: 'sm',
        variant: 'hot',
    },
}

export const Medium: Story = {
    args: {
        size: 'md',
        variant: 'hot',
    },
}

export const Large: Story = {
    args: {
        size: 'lg',
        variant: 'hot',
    },
}

export const ExtraLarge: Story = {
    args: {
        size: 'xl',
        variant: 'hot',
    },
}

// Welding Variants
export const HotWelding: Story = {
    args: {
        size: 'lg',
        variant: 'hot',
        sparks: 10,
    },
}

export const ElectricArc: Story = {
    args: {
        size: 'lg',
        variant: 'electric',
        sparks: 12,
    },
}

export const PlasmaWelder: Story = {
    args: {
        size: 'lg',
        variant: 'plasma',
        sparks: 10,
    },
}

export const PrimaryWelder: Story = {
    args: {
        size: 'lg',
        variant: 'primary',
        sparks: 8,
    },
}

// Spark Configurations
export const FewSparks: Story = {
    args: {
        size: 'lg',
        variant: 'hot',
        sparks: 4,
    },
}

export const ManySparks: Story = {
    args: {
        size: 'lg',
        variant: 'electric',
        sparks: 16,
    },
}

export const IntenseSparks: Story = {
    args: {
        size: 'xl',
        variant: 'hot',
        sparks: 12,
        speed: 1000,
    },
}

// Speed Variations
export const Fast: Story = {
    args: {
        size: 'lg',
        variant: 'hot',
        speed: 800,
    },
}

export const Slow: Story = {
    args: {
        size: 'lg',
        variant: 'electric',
        speed: 2000,
    },
}

// With Label
export const WithLabel: Story = {
    args: {
        size: 'lg',
        variant: 'hot',
        label: 'Welding...',
    },
}

export const WithCustomLabel: Story = {
    args: {
        size: 'lg',
        variant: 'electric',
        label: 'Processing metal',
        sparks: 12,
    },
}

// Without Glow
export const NoGlow: Story = {
    args: {
        size: 'lg',
        variant: 'hot',
        showGlow: false,
    },
}

// Showcase all sizes
export const AllSizes: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3rem',
                padding: '2rem',
                backgroundColor: '#1a1a1a',
            }}
        >
            <div style={{ textAlign: 'center' }}>
                <LaserSpinner size="sm" variant="hot" />
                <p
                    style={{
                        marginTop: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#aaa',
                    }}
                >
                    Small
                </p>
            </div>
            <div style={{ textAlign: 'center' }}>
                <LaserSpinner size="md" variant="hot" />
                <p
                    style={{
                        marginTop: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#aaa',
                    }}
                >
                    Medium
                </p>
            </div>
            <div style={{ textAlign: 'center' }}>
                <LaserSpinner size="lg" variant="hot" />
                <p
                    style={{
                        marginTop: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#aaa',
                    }}
                >
                    Large
                </p>
            </div>
            <div style={{ textAlign: 'center' }}>
                <LaserSpinner size="xl" variant="hot" />
                <p
                    style={{
                        marginTop: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#aaa',
                    }}
                >
                    Extra Large
                </p>
            </div>
        </div>
    ),
    parameters: {
        backgrounds: { default: 'dark' },
    },
}

// Showcase all welding types
export const AllWeldingTypes: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3rem',
                padding: '2rem',
                backgroundColor: '#1a1a1a',
            }}
        >
            <div style={{ textAlign: 'center' }}>
                <LaserSpinner size="lg" variant="primary" />
                <p
                    style={{
                        marginTop: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#aaa',
                    }}
                >
                    Primary
                </p>
            </div>
            <div style={{ textAlign: 'center' }}>
                <LaserSpinner size="lg" variant="hot" />
                <p
                    style={{
                        marginTop: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#aaa',
                    }}
                >
                    Hot
                </p>
            </div>
            <div style={{ textAlign: 'center' }}>
                <LaserSpinner size="lg" variant="electric" />
                <p
                    style={{
                        marginTop: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#aaa',
                    }}
                >
                    Electric
                </p>
            </div>
            <div style={{ textAlign: 'center' }}>
                <LaserSpinner size="lg" variant="plasma" />
                <p
                    style={{
                        marginTop: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#aaa',
                    }}
                >
                    Plasma
                </p>
            </div>
        </div>
    ),
    parameters: {
        backgrounds: { default: 'dark' },
    },
}

// In Context - Loading Card
export const InLoadingCard: Story = {
    render: () => (
        <div
            style={{
                width: '400px',
                padding: '3rem 2rem',
                backgroundColor: '#2a2a2a',
                borderRadius: '8px',
                border: '1px solid #444',
                textAlign: 'center',
            }}
        >
            <LaserSpinner
                size="xl"
                variant="hot"
                label="Welding components..."
            />
            <p
                style={{
                    marginTop: '1rem',
                    color: '#999',
                    fontSize: '0.875rem',
                }}
            >
                Please wait while we process your metal fabrication
            </p>
        </div>
    ),
    parameters: {
        backgrounds: { default: 'dark' },
    },
}

// In Context - Full Page Loading
export const FullPageLoading: Story = {
    render: () => (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#0a0a0a',
            }}
        >
            <LaserSpinner
                size="xl"
                variant="electric"
                sparks={12}
                label="Initializing welding system..."
                speed={1000}
            />
        </div>
    ),
    parameters: {
        layout: 'fullscreen',
        backgrounds: { default: 'dark' },
    },
}

// Interactive Playground
export const Playground: Story = {
    args: {
        size: 'lg',
        variant: 'hot',
        sparks: 10,
        speed: 1200,
        showGlow: true,
        label: 'Welding...',
    },
    parameters: {
        backgrounds: { default: 'dark' },
    },
}
