import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import FloatingIsland from './FloatingIsland'

const meta: Meta<typeof FloatingIsland> = {
    title: 'Components/FloatingIsland',
    component: FloatingIsland,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'A floating container with smooth animations and interactive effects, perfect for showcasing content with a modern, elevated design.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'gradient', 'glassmorphism', 'neon'],
            description: 'Visual variant of the island',
        },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large', 'xlarge'],
            description: 'Size of the island',
        },
        animation: {
            control: 'select',
            options: ['float', 'pulse', 'hover-lift', 'none'],
            description: 'Animation style',
        },
        glow: {
            control: 'boolean',
            description: 'Whether the island has a glow effect',
        },
        interactive: {
            control: 'boolean',
            description: 'Whether the island follows mouse movement',
        },
        interactiveIntensity: {
            control: { type: 'range', min: 0, max: 1, step: 0.1 },
            description: 'Intensity of the interactive effect',
        },
        particles: {
            control: 'boolean',
            description: 'Whether to show floating particles',
        },
        particleCount: {
            control: { type: 'range', min: 4, max: 16, step: 1 },
            description: 'Number of particles',
        },
        elevated: {
            control: 'boolean',
            description: 'Whether the island is elevated (stronger shadow)',
        },
        blurIntensity: {
            control: { type: 'range', min: 0, max: 30, step: 1 },
            description: 'Blur intensity for glassmorphism variant',
        },
    },
}

export default meta
type Story = StoryObj<typeof FloatingIsland>

// Basic variants
export const Default: Story = {
    args: {
        children: (
            <div style={{ textAlign: 'center' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>
                    Floating Island
                </h2>
                <p style={{ margin: 0, opacity: 0.8 }}>
                    A beautiful floating container
                </p>
            </div>
        ),
        variant: 'default',
        size: 'medium',
        animation: 'float',
    },
}

export const Gradient: Story = {
    args: {
        children: (
            <div style={{ textAlign: 'center' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>
                    Gradient Island
                </h2>
                <p style={{ margin: 0 }}>Vibrant gradient background</p>
            </div>
        ),
        variant: 'gradient',
        size: 'medium',
        animation: 'float',
    },
}

export const Glassmorphism: Story = {
    args: {
        children: (
            <div style={{ textAlign: 'center' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>
                    Glass Effect
                </h2>
                <p style={{ margin: 0 }}>Frosted glass morphism style</p>
            </div>
        ),
        variant: 'glassmorphism',
        size: 'medium',
        animation: 'float',
        blurIntensity: 10,
    },
    decorators: [
        (Story) => (
            <div
                style={{
                    padding: '4rem',
                    background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '8px',
                }}
            >
                <Story />
            </div>
        ),
    ],
}

export const Neon: Story = {
    args: {
        children: (
            <div style={{ textAlign: 'center' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>
                    Neon Glow
                </h2>
                <p style={{ margin: 0 }}>Cyberpunk-inspired neon effect</p>
            </div>
        ),
        variant: 'neon',
        size: 'medium',
        animation: 'pulse',
    },
}

// Interactive features
export const Interactive: Story = {
    args: {
        children: (
            <div style={{ textAlign: 'center' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>
                    Interactive
                </h2>
                <p style={{ margin: 0 }}>Move your mouse over me!</p>
            </div>
        ),
        variant: 'gradient',
        size: 'medium',
        animation: 'none',
        interactive: true,
        interactiveIntensity: 0.5,
    },
}

export const WithParticles: Story = {
    args: {
        children: (
            <div style={{ textAlign: 'center' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>
                    Particles
                </h2>
                <p style={{ margin: 0 }}>Orbiting particle effect</p>
            </div>
        ),
        variant: 'default',
        size: 'medium',
        animation: 'float',
        particles: true,
        particleCount: 8,
    },
}

export const WithGlow: Story = {
    args: {
        children: (
            <div style={{ textAlign: 'center' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>
                    Glowing Island
                </h2>
                <p style={{ margin: 0 }}>Pulsating glow effect</p>
            </div>
        ),
        variant: 'default',
        size: 'medium',
        animation: 'float',
        glow: true,
        elevated: true,
    },
}

// Size variations
export const Sizes: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                alignItems: 'center',
            }}
        >
            <FloatingIsland variant="gradient" size="small" animation="float">
                <div style={{ textAlign: 'center' }}>Small</div>
            </FloatingIsland>
            <FloatingIsland variant="gradient" size="medium" animation="float">
                <div style={{ textAlign: 'center' }}>Medium</div>
            </FloatingIsland>
            <FloatingIsland variant="gradient" size="large" animation="float">
                <div style={{ textAlign: 'center' }}>Large</div>
            </FloatingIsland>
            <FloatingIsland variant="gradient" size="xlarge" animation="float">
                <div style={{ textAlign: 'center' }}>Extra Large</div>
            </FloatingIsland>
        </div>
    ),
}

// Animation styles
export const Animations: Story = {
    render: () => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '2rem',
            }}
        >
            <FloatingIsland variant="default" animation="float">
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Float</h3>
                    <p style={{ margin: 0, opacity: 0.7 }}>
                        Gentle up/down motion
                    </p>
                </div>
            </FloatingIsland>
            <FloatingIsland variant="default" animation="pulse">
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Pulse</h3>
                    <p style={{ margin: 0, opacity: 0.7 }}>Scale pulsation</p>
                </div>
            </FloatingIsland>
            <FloatingIsland variant="default" animation="hover-lift">
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Hover Lift</h3>
                    <p style={{ margin: 0, opacity: 0.7 }}>Hover to see</p>
                </div>
            </FloatingIsland>
            <FloatingIsland variant="default" animation="none">
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Static</h3>
                    <p style={{ margin: 0, opacity: 0.7 }}>No animation</p>
                </div>
            </FloatingIsland>
        </div>
    ),
}

// Full-featured showcase
export const FullFeatured: Story = {
    args: {
        children: (
            <div style={{ textAlign: 'center' }}>
                <h2
                    style={{
                        margin: '0 0 1rem 0',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                    }}
                >
                    ✨ Ultimate Island
                </h2>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                    All features combined
                </p>
                <p style={{ margin: 0, opacity: 0.8 }}>
                    Interactive • Particles • Glow
                </p>
            </div>
        ),
        variant: 'gradient',
        size: 'large',
        animation: 'float',
        glow: true,
        interactive: true,
        interactiveIntensity: 0.7,
        particles: true,
        particleCount: 12,
        elevated: true,
    },
}

// Card gallery showcase
export const CardGallery: Story = {
    render: () => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '2rem',
                padding: '2rem',
            }}
        >
            <FloatingIsland
                variant="gradient"
                size="small"
                animation="hover-lift"
                elevated
            >
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        🎨
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Design</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                        Beautiful UI
                    </p>
                </div>
            </FloatingIsland>
            <FloatingIsland
                variant="neon"
                size="small"
                animation="pulse"
                particles
                particleCount={6}
            >
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        ⚡
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Performance</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                        Lightning fast
                    </p>
                </div>
            </FloatingIsland>
            <FloatingIsland
                variant="default"
                size="small"
                animation="float"
                glow
            >
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        ✨
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Effects</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                        Stunning visuals
                    </p>
                </div>
            </FloatingIsland>
        </div>
    ),
}

// CTA Button Example
export const CTAButton: Story = {
    args: {
        children: (
            <div style={{ textAlign: 'center' }}>
                <h2
                    style={{
                        margin: '0 0 1rem 0',
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                    }}
                >
                    Get Started Today
                </h2>
                <p
                    style={{
                        margin: '0 0 1.5rem 0',
                        fontSize: '1.2rem',
                        opacity: 0.9,
                    }}
                >
                    Join thousands of developers building amazing experiences
                </p>
                <button
                    style={{
                        padding: '1rem 2rem',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'inherit',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                            'rgba(255, 255, 255, 0.3)'
                        e.currentTarget.style.transform = 'scale(1.05)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                            'rgba(255, 255, 255, 0.2)'
                        e.currentTarget.style.transform = 'scale(1)'
                    }}
                >
                    Start Free Trial →
                </button>
            </div>
        ),
        variant: 'gradient',
        size: 'xlarge',
        animation: 'float',
        glow: true,
        elevated: true,
    },
}

// Feature showcase with glassmorphism
export const FeatureShowcase: Story = {
    render: () => (
        <div
            style={{
                padding: '4rem',
                background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                borderRadius: '8px',
                display: 'flex',
                gap: '2rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
            }}
        >
            <FloatingIsland
                variant="glassmorphism"
                size="medium"
                animation="hover-lift"
                blurIntensity={15}
            >
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        🚀
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Fast</h3>
                    <p style={{ margin: 0, opacity: 0.9 }}>
                        Optimized performance
                    </p>
                </div>
            </FloatingIsland>
            <FloatingIsland
                variant="glassmorphism"
                size="medium"
                animation="hover-lift"
                blurIntensity={15}
            >
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        🎯
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Precise</h3>
                    <p style={{ margin: 0, opacity: 0.9 }}>Pixel-perfect</p>
                </div>
            </FloatingIsland>
            <FloatingIsland
                variant="glassmorphism"
                size="medium"
                animation="hover-lift"
                blurIntensity={15}
            >
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        💎
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Premium</h3>
                    <p style={{ margin: 0, opacity: 0.9 }}>High quality</p>
                </div>
            </FloatingIsland>
        </div>
    ),
}
