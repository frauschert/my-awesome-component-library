import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useBreakpoint } from './index'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Typography from '../../components/Typography'

const meta: Meta = {
    title: 'Hooks/useBreakpoint',
    parameters: {
        docs: {
            description: {
                component:
                    'Track current responsive breakpoint with comparison utilities.',
            },
        },
    },
}

export default meta

type Story = StoryObj

/**
 * Basic breakpoint tracking example.
 * Resize your browser window to see the breakpoint change.
 */
export const BasicUsage: Story = {
    render: () => {
        const { breakpoint, width } = useBreakpoint()

        const getBreakpointColor = (bp: string) => {
            switch (bp) {
                case 'xs':
                    return 'error'
                case 'sm':
                    return 'warning'
                case 'md':
                    return 'info'
                case 'lg':
                    return 'success'
                case 'xl':
                    return 'success'
                case 'xxl':
                    return 'success'
                default:
                    return 'default'
            }
        }

        return (
            <Card>
                <Card.Header>
                    <Typography variant="h3">Current Breakpoint</Typography>
                </Card.Header>
                <Card.Body>
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <Badge
                            variant={getBreakpointColor(breakpoint)}
                            style={{
                                fontSize: '2rem',
                                padding: '1rem 2rem',
                                marginBottom: '1rem',
                            }}
                        >
                            {breakpoint.toUpperCase()}
                        </Badge>
                        <Typography
                            variant="body1"
                            style={{ marginTop: '1rem' }}
                        >
                            Window width: <strong>{width}px</strong>
                        </Typography>
                        <Typography
                            variant="caption"
                            style={{ marginTop: '0.5rem' }}
                        >
                            Resize your browser to see the breakpoint change
                        </Typography>
                    </div>
                </Card.Body>
            </Card>
        )
    },
}

/**
 * Responsive layout example using breakpoint comparisons.
 */
export const ResponsiveLayout: Story = {
    render: () => {
        const bp = useBreakpoint()

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >
                <Card>
                    <Card.Header>
                        <Typography variant="h3">
                            Responsive Conditions
                        </Typography>
                    </Card.Header>
                    <Card.Body>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                <Badge
                                    variant={
                                        bp.is('md') ? 'success' : 'default'
                                    }
                                >
                                    is('md')
                                </Badge>
                                <Typography variant="body2">
                                    Exact match: {bp.is('md') ? 'Yes' : 'No'}
                                </Typography>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                <Badge
                                    variant={
                                        bp.isGreaterOrEqual('md')
                                            ? 'success'
                                            : 'default'
                                    }
                                >
                                    isGreaterOrEqual('md')
                                </Badge>
                                <Typography variant="body2">
                                    Desktop+:{' '}
                                    {bp.isGreaterOrEqual('md') ? 'Yes' : 'No'}
                                </Typography>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                <Badge
                                    variant={
                                        bp.isLess('md') ? 'success' : 'default'
                                    }
                                >
                                    isLess('md')
                                </Badge>
                                <Typography variant="body2">
                                    Mobile: {bp.isLess('md') ? 'Yes' : 'No'}
                                </Typography>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                <Badge
                                    variant={
                                        bp.isGreaterOrEqual('lg')
                                            ? 'success'
                                            : 'default'
                                    }
                                >
                                    isGreaterOrEqual('lg')
                                </Badge>
                                <Typography variant="body2">
                                    Large screens:{' '}
                                    {bp.isGreaterOrEqual('lg') ? 'Yes' : 'No'}
                                </Typography>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                {/* Responsive content demo */}
                <Card>
                    <Card.Header>
                        <Typography variant="h3">Adaptive Content</Typography>
                    </Card.Header>
                    <Card.Body>
                        {bp.isLess('md') ? (
                            <Typography variant="body1">
                                📱 Mobile view - Showing compact layout
                            </Typography>
                        ) : bp.isGreaterOrEqual('lg') ? (
                            <Typography variant="body1">
                                🖥️ Desktop view - Showing full layout with
                                sidebar
                            </Typography>
                        ) : (
                            <Typography variant="body1">
                                💻 Tablet view - Showing medium layout
                            </Typography>
                        )}
                    </Card.Body>
                </Card>
            </div>
        )
    },
}

/**
 * Custom breakpoints example.
 */
export const CustomBreakpoints: Story = {
    render: () => {
        const bp = useBreakpoint({
            breakpoints: {
                sm: 576,
                md: 768,
                lg: 992,
                xl: 1200,
                xxl: 1400,
            },
        })

        return (
            <Card>
                <Card.Header>
                    <Typography variant="h3">Custom Breakpoints</Typography>
                </Card.Header>
                <Card.Body>
                    <Typography
                        variant="body2"
                        style={{ marginBottom: '1rem' }}
                    >
                        Using Bootstrap-style breakpoints
                    </Typography>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                        }}
                    >
                        <Typography variant="caption">
                            xs: 0px • sm: 576px • md: 768px • lg: 992px • xl:
                            1200px • xxl: 1400px
                        </Typography>
                        <div style={{ marginTop: '1rem' }}>
                            <Badge
                                variant="info"
                                style={{
                                    fontSize: '1.5rem',
                                    padding: '0.75rem 1.5rem',
                                }}
                            >
                                {bp.breakpoint.toUpperCase()}
                            </Badge>
                            <Typography
                                variant="body2"
                                style={{ marginTop: '0.5rem' }}
                            >
                                Width: {bp.width}px
                            </Typography>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        )
    },
}

/**
 * All breakpoints reference.
 */
export const BreakpointReference: Story = {
    render: () => {
        const bp = useBreakpoint()

        const breakpoints = [
            { name: 'xs', min: 0 },
            { name: 'sm', min: 640 },
            { name: 'md', min: 768 },
            { name: 'lg', min: 1024 },
            { name: 'xl', min: 1280 },
            { name: 'xxl', min: 1536 },
        ]

        return (
            <Card>
                <Card.Header>
                    <Typography variant="h3">Breakpoint Reference</Typography>
                </Card.Header>
                <Card.Body>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                        }}
                    >
                        {breakpoints.map((bpoint) => (
                            <div
                                key={bpoint.name}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '0.5rem',
                                    backgroundColor:
                                        bp.breakpoint === bpoint.name
                                            ? 'var(--theme-bg-secondary)'
                                            : 'transparent',
                                    borderRadius: '4px',
                                }}
                            >
                                <Badge
                                    variant={
                                        bp.breakpoint === bpoint.name
                                            ? 'success'
                                            : 'default'
                                    }
                                    style={{
                                        minWidth: '60px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {bpoint.name.toUpperCase()}
                                </Badge>
                                <Typography variant="body2">
                                    ≥ {bpoint.min}px
                                    {bp.breakpoint === bpoint.name && (
                                        <span
                                            style={{
                                                marginLeft: '0.5rem',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            (current)
                                        </span>
                                    )}
                                </Typography>
                            </div>
                        ))}
                    </div>
                </Card.Body>
            </Card>
        )
    },
}
