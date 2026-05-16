import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useNetwork, useOnline } from './index'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Typography from '../../components/Typography'

const NetworkStatus = () => {
    const network = useNetwork()

    return (
        <Card variant="outlined" style={{ maxWidth: 600 }}>
            <div style={{ padding: '1rem' }}>
                <Typography variant="h3" style={{ marginBottom: '1rem' }}>
                    Network Information
                </Typography>

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
                        <Typography
                            variant="body1"
                            style={{ fontWeight: 'bold', minWidth: 150 }}
                        >
                            Status:
                        </Typography>
                        <Badge variant={network.online ? 'success' : 'danger'}>
                            {network.online ? 'Online' : 'Offline'}
                        </Badge>
                    </div>

                    {network.effectiveType && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <Typography
                                variant="body1"
                                style={{ fontWeight: 'bold', minWidth: 150 }}
                            >
                                Connection Type:
                            </Typography>
                            <Badge variant="info">
                                {network.effectiveType.toUpperCase()}
                            </Badge>
                        </div>
                    )}

                    {network.type && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <Typography
                                variant="body1"
                                style={{ fontWeight: 'bold', minWidth: 150 }}
                            >
                                Network Type:
                            </Typography>
                            <Typography variant="body1">
                                {network.type}
                            </Typography>
                        </div>
                    )}

                    {network.downlink !== undefined && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <Typography
                                variant="body1"
                                style={{ fontWeight: 'bold', minWidth: 150 }}
                            >
                                Downlink:
                            </Typography>
                            <Typography variant="body1">
                                {network.downlink} Mbps
                            </Typography>
                        </div>
                    )}

                    {network.rtt !== undefined && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <Typography
                                variant="body1"
                                style={{ fontWeight: 'bold', minWidth: 150 }}
                            >
                                Round Trip Time:
                            </Typography>
                            <Typography variant="body1">
                                {network.rtt} ms
                            </Typography>
                        </div>
                    )}

                    {network.saveData !== undefined && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <Typography
                                variant="body1"
                                style={{ fontWeight: 'bold', minWidth: 150 }}
                            >
                                Data Saver:
                            </Typography>
                            <Badge
                                variant={
                                    network.saveData ? 'warning' : 'success'
                                }
                            >
                                {network.saveData ? 'Enabled' : 'Disabled'}
                            </Badge>
                        </div>
                    )}

                    {network.since && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <Typography
                                variant="body1"
                                style={{ fontWeight: 'bold', minWidth: 150 }}
                            >
                                Last Updated:
                            </Typography>
                            <Typography
                                variant="body1"
                                style={{ fontSize: '0.875rem', color: '#666' }}
                            >
                                {network.since.toLocaleTimeString()}
                            </Typography>
                        </div>
                    )}
                </div>

                <Typography
                    variant="body2"
                    style={{ marginTop: '1rem', color: '#666' }}
                >
                    Try toggling your network connection or changing network
                    quality in DevTools to see real-time updates.
                </Typography>
            </div>
        </Card>
    )
}

const OnlineStatus = () => {
    const isOnline = useOnline()

    return (
        <Card variant="outlined" style={{ maxWidth: 400 }}>
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: isOnline ? '#22c55e' : '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        fontSize: '2rem',
                    }}
                >
                    {isOnline ? '✓' : '✗'}
                </div>

                <Typography variant="h3" style={{ marginBottom: '0.5rem' }}>
                    {isOnline ? 'You are Online' : 'You are Offline'}
                </Typography>

                <Typography variant="body1" style={{ color: '#666' }}>
                    {isOnline
                        ? 'All features are available'
                        : 'Some features may be unavailable'}
                </Typography>

                <Typography
                    variant="body2"
                    style={{ marginTop: '1rem', color: '#999' }}
                >
                    Open DevTools Network tab and toggle "Offline" to test
                </Typography>
            </div>
        </Card>
    )
}

const CombinedExample = () => {
    const network = useNetwork()
    const isOnline = useOnline()

    const getConnectionQuality = () => {
        if (!isOnline) return { label: 'Offline', variant: 'danger' as const }
        if (!network.effectiveType)
            return { label: 'Unknown', variant: 'default' as const }

        switch (network.effectiveType) {
            case '4g':
                return { label: 'Excellent', variant: 'success' as const }
            case '3g':
                return { label: 'Good', variant: 'info' as const }
            case '2g':
                return { label: 'Poor', variant: 'warning' as const }
            case 'slow-2g':
                return { label: 'Very Poor', variant: 'danger' as const }
            default:
                return { label: 'Unknown', variant: 'default' as const }
        }
    }

    const quality = getConnectionQuality()

    return (
        <Card variant="outlined" style={{ maxWidth: 500 }}>
            <div style={{ padding: '1.5rem' }}>
                <Typography variant="h3" style={{ marginBottom: '1rem' }}>
                    Adaptive Content Loading
                </Typography>

                <div style={{ marginBottom: '1rem' }}>
                    <Typography
                        variant="body1"
                        style={{ marginBottom: '0.5rem' }}
                    >
                        Connection Quality:
                    </Typography>
                    <Badge variant={quality.variant}>{quality.label}</Badge>
                </div>

                <div
                    style={{
                        padding: '1rem',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                        marginTop: '1rem',
                    }}
                >
                    <Typography
                        variant="body1"
                        style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}
                    >
                        Recommended Settings:
                    </Typography>

                    {!isOnline ? (
                        <>
                            <Typography variant="body2">
                                • Load cached content only
                            </Typography>
                            <Typography variant="body2">
                                • Queue sync operations
                            </Typography>
                            <Typography variant="body2">
                                • Show offline banner
                            </Typography>
                        </>
                    ) : network.saveData ||
                      network.effectiveType === 'slow-2g' ? (
                        <>
                            <Typography variant="body2">
                                • Load low-resolution images
                            </Typography>
                            <Typography variant="body2">
                                • Disable auto-play videos
                            </Typography>
                            <Typography variant="body2">
                                • Reduce animation effects
                            </Typography>
                        </>
                    ) : network.effectiveType === '4g' ? (
                        <>
                            <Typography variant="body2">
                                • Load high-resolution images
                            </Typography>
                            <Typography variant="body2">
                                • Enable auto-play videos
                            </Typography>
                            <Typography variant="body2">
                                • Prefetch content
                            </Typography>
                        </>
                    ) : (
                        <>
                            <Typography variant="body2">
                                • Load medium-resolution images
                            </Typography>
                            <Typography variant="body2">
                                • Lazy-load videos
                            </Typography>
                            <Typography variant="body2">
                                • Standard loading
                            </Typography>
                        </>
                    )}
                </div>
            </div>
        </Card>
    )
}

const meta = {
    title: 'Hooks/Network',
    parameters: {
        docs: {
            description: {
                component:
                    'Hooks for monitoring network connection status and information. `useOnline` provides a simple online/offline boolean, while `useNetwork` provides detailed connection information including speed, type, and data saver preferences.',
            },
        },
    },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const NetworkInformation: Story = {
    render: () => <NetworkStatus />,
    parameters: {
        docs: {
            description: {
                story: 'Comprehensive network information including connection type, speed, latency, and data saver status. Uses the Network Information API when available.',
            },
        },
    },
}

export const OnlineOffline: Story = {
    render: () => <OnlineStatus />,
    parameters: {
        docs: {
            description: {
                story: 'Simple online/offline status indicator. Perfect for showing offline banners or disabling features when connectivity is lost.',
            },
        },
    },
}

export const AdaptiveLoading: Story = {
    render: () => <CombinedExample />,
    parameters: {
        docs: {
            description: {
                story: 'Example of adaptive content loading based on network conditions. Automatically adjusts content quality and loading strategies based on connection speed and data saver preferences.',
            },
        },
    },
}
