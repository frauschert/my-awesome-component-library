import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useGeolocation } from './index'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import Typography from '../../components/Typography'

const meta: Meta = {
    title: 'Hooks/useGeolocation',
    parameters: {
        docs: {
            description: {
                component:
                    'Access device location using the Geolocation API. Supports both one-time requests and continuous tracking. Requires user permission.',
            },
        },
    },
}

export default meta

type Story = StoryObj

/**
 * Basic location retrieval example.
 */
export const BasicUsage: Story = {
    render: () => {
        const { position, loading, error, isSupported, getPosition } =
            useGeolocation()

        return (
            <Card>
                <Card.Header>
                    <Typography variant="h3">Get Current Location</Typography>
                </Card.Header>
                <Card.Body>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >
                        {!isSupported && (
                            <Badge variant="error">
                                Geolocation API not supported
                            </Badge>
                        )}

                        <Button
                            onClick={getPosition}
                            disabled={!isSupported || loading}
                        >
                            {loading
                                ? 'Getting Location...'
                                : 'Get My Location'}
                        </Button>

                        {error && (
                            <div
                                style={{
                                    padding: '1rem',
                                    backgroundColor: 'var(--theme-error-bg)',
                                    borderRadius: '4px',
                                }}
                            >
                                <Typography variant="body2" color="error">
                                    <strong>Error:</strong> {error.message}
                                </Typography>
                                <Typography variant="caption" color="muted">
                                    Code: {error.code}
                                </Typography>
                            </div>
                        )}

                        {position && (
                            <div
                                style={{
                                    padding: '1rem',
                                    backgroundColor:
                                        'var(--theme-bg-secondary)',
                                    borderRadius: '4px',
                                }}
                            >
                                <Typography variant="body1">
                                    <strong>📍 Location Found</strong>
                                </Typography>
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 2fr',
                                        gap: '0.5rem',
                                        marginTop: '0.75rem',
                                    }}
                                >
                                    <Typography variant="body2">
                                        Latitude:
                                    </Typography>
                                    <Typography variant="body2">
                                        {position.coords.latitude.toFixed(6)}°
                                    </Typography>

                                    <Typography variant="body2">
                                        Longitude:
                                    </Typography>
                                    <Typography variant="body2">
                                        {position.coords.longitude.toFixed(6)}°
                                    </Typography>

                                    <Typography variant="body2">
                                        Accuracy:
                                    </Typography>
                                    <Typography variant="body2">
                                        ±{position.coords.accuracy.toFixed(0)}m
                                    </Typography>

                                    {position.coords.altitude !== null && (
                                        <>
                                            <Typography variant="body2">
                                                Altitude:
                                            </Typography>
                                            <Typography variant="body2">
                                                {position.coords.altitude.toFixed(
                                                    0
                                                )}
                                                m
                                            </Typography>
                                        </>
                                    )}

                                    {position.coords.speed !== null && (
                                        <>
                                            <Typography variant="body2">
                                                Speed:
                                            </Typography>
                                            <Typography variant="body2">
                                                {position.coords.speed.toFixed(
                                                    1
                                                )}
                                                m/s
                                            </Typography>
                                        </>
                                    )}
                                </div>
                                <Typography
                                    variant="caption"
                                    color="muted"
                                    style={{ marginTop: '0.75rem' }}
                                >
                                    Retrieved:{' '}
                                    {new Date(
                                        position.timestamp
                                    ).toLocaleTimeString()}
                                </Typography>
                            </div>
                        )}

                        <Typography variant="caption" color="muted">
                            {isSupported
                                ? 'Browser will prompt for location permission'
                                : 'Geolocation is not supported by your browser'}
                        </Typography>
                    </div>
                </Card.Body>
            </Card>
        )
    },
}

/**
 * Continuous position tracking (watch mode).
 */
export const WatchPosition: Story = {
    render: () => {
        const {
            position,
            loading,
            error,
            isSupported,
            startWatching,
            stopWatching,
        } = useGeolocation()

        const [isWatching, setIsWatching] = React.useState(false)

        const handleStart = () => {
            startWatching()
            setIsWatching(true)
        }

        const handleStop = () => {
            stopWatching()
            setIsWatching(false)
        }

        return (
            <Card>
                <Card.Header>
                    <Typography variant="h3">Watch Position</Typography>
                </Card.Header>
                <Card.Body>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >
                        {!isSupported && (
                            <Badge variant="error">
                                Geolocation API not supported
                            </Badge>
                        )}

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Button
                                onClick={handleStart}
                                disabled={!isSupported || isWatching}
                                variant="primary"
                            >
                                {loading ? 'Starting...' : 'Start Watching'}
                            </Button>
                            <Button
                                onClick={handleStop}
                                disabled={!isSupported || !isWatching}
                                variant="secondary"
                            >
                                Stop Watching
                            </Button>
                        </div>

                        {isWatching && (
                            <Badge variant="success">
                                🔴 Live Tracking Active
                            </Badge>
                        )}

                        {error && (
                            <div
                                style={{
                                    padding: '1rem',
                                    backgroundColor: 'var(--theme-error-bg)',
                                    borderRadius: '4px',
                                }}
                            >
                                <Typography variant="body2" color="error">
                                    <strong>Error:</strong> {error.message}
                                </Typography>
                            </div>
                        )}

                        {position && (
                            <div
                                style={{
                                    padding: '1rem',
                                    backgroundColor:
                                        'var(--theme-bg-secondary)',
                                    borderRadius: '4px',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '0.75rem',
                                    }}
                                >
                                    <Typography variant="body1">
                                        <strong>📍 Current Position</strong>
                                    </Typography>
                                    {position.coords.speed !== null &&
                                        position.coords.speed > 0 && (
                                            <Badge variant="info">Moving</Badge>
                                        )}
                                </div>
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 2fr',
                                        gap: '0.5rem',
                                    }}
                                >
                                    <Typography variant="body2">
                                        Coordinates:
                                    </Typography>
                                    <Typography variant="body2">
                                        {position.coords.latitude.toFixed(6)}°,{' '}
                                        {position.coords.longitude.toFixed(6)}°
                                    </Typography>

                                    <Typography variant="body2">
                                        Accuracy:
                                    </Typography>
                                    <Typography variant="body2">
                                        ±{position.coords.accuracy.toFixed(0)}m
                                    </Typography>

                                    {position.coords.speed !== null && (
                                        <>
                                            <Typography variant="body2">
                                                Speed:
                                            </Typography>
                                            <Typography variant="body2">
                                                {(
                                                    position.coords.speed * 3.6
                                                ).toFixed(1)}{' '}
                                                km/h
                                            </Typography>
                                        </>
                                    )}

                                    {position.coords.heading !== null && (
                                        <>
                                            <Typography variant="body2">
                                                Heading:
                                            </Typography>
                                            <Typography variant="body2">
                                                {position.coords.heading.toFixed(
                                                    0
                                                )}
                                                ° (
                                                {getDirection(
                                                    position.coords.heading
                                                )}
                                                )
                                            </Typography>
                                        </>
                                    )}
                                </div>
                                <Typography
                                    variant="caption"
                                    color="muted"
                                    style={{ marginTop: '0.75rem' }}
                                >
                                    Last update:{' '}
                                    {new Date(
                                        position.timestamp
                                    ).toLocaleTimeString()}
                                </Typography>
                            </div>
                        )}

                        <Typography variant="caption" color="muted">
                            Watch mode continuously tracks position changes.
                            Best for navigation or tracking apps.
                        </Typography>
                    </div>
                </Card.Body>
            </Card>
        )
    },
}

/**
 * High-accuracy mode with timeout settings.
 */
export const HighAccuracy: Story = {
    render: () => {
        const { position, loading, error, getPosition } = useGeolocation({
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        })

        return (
            <Card>
                <Card.Header>
                    <Typography variant="h3">High Accuracy Mode</Typography>
                </Card.Header>
                <Card.Body>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >
                        <div
                            style={{
                                padding: '1rem',
                                backgroundColor: 'var(--theme-info-bg)',
                                borderRadius: '4px',
                            }}
                        >
                            <Typography variant="body2">
                                <strong>Settings:</strong>
                            </Typography>
                            <Typography variant="caption">
                                • High Accuracy: Enabled (uses GPS)
                                <br />
                                • Timeout: 10 seconds
                                <br />
                                • Cache: Disabled (fresh location only)
                                <br />• Battery impact: Higher
                            </Typography>
                        </div>

                        <Button onClick={getPosition} disabled={loading}>
                            {loading
                                ? 'Getting Precise Location...'
                                : 'Get High-Accuracy Location'}
                        </Button>

                        {error && (
                            <div
                                style={{
                                    padding: '1rem',
                                    backgroundColor: 'var(--theme-error-bg)',
                                    borderRadius: '4px',
                                }}
                            >
                                <Typography variant="body2" color="error">
                                    {error.code === 3
                                        ? 'Timeout: Could not get location within 10 seconds'
                                        : error.message}
                                </Typography>
                            </div>
                        )}

                        {position && (
                            <div
                                style={{
                                    padding: '1rem',
                                    backgroundColor: 'var(--theme-success-bg)',
                                    borderRadius: '4px',
                                }}
                            >
                                <Typography variant="body1">
                                    <strong>
                                        ✓ High-Accuracy Location Acquired
                                    </strong>
                                </Typography>
                                <div style={{ marginTop: '0.75rem' }}>
                                    <Typography variant="body2">
                                        Position:{' '}
                                        {position.coords.latitude.toFixed(8)}°,{' '}
                                        {position.coords.longitude.toFixed(8)}°
                                    </Typography>
                                    <Typography variant="body2">
                                        Accuracy: ±
                                        {position.coords.accuracy.toFixed(2)}m
                                    </Typography>
                                    {position.coords.accuracy < 10 && (
                                        <Badge
                                            variant="success"
                                            style={{ marginTop: '0.5rem' }}
                                        >
                                            Excellent Accuracy
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}

                        <Typography variant="caption" color="muted">
                            High accuracy mode uses GPS for better precision but
                            consumes more battery
                        </Typography>
                    </div>
                </Card.Body>
            </Card>
        )
    },
}

/**
 * Immediate location on mount with callbacks.
 */
export const ImmediateLocation: Story = {
    render: () => {
        const [history, setHistory] = React.useState<string[]>([])

        const { position, loading, error } = useGeolocation({
            immediate: true,
            onSuccess: (pos) => {
                setHistory((h) => [
                    ...h,
                    `✓ Location acquired: ${pos.coords.latitude.toFixed(
                        4
                    )}°, ${pos.coords.longitude.toFixed(4)}°`,
                ])
            },
            onError: (err) => {
                setHistory((h) => [...h, `✗ Error: ${err.message}`])
            },
        })

        return (
            <Card>
                <Card.Header>
                    <Typography variant="h3">Immediate Mode</Typography>
                </Card.Header>
                <Card.Body>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >
                        <Typography variant="body2">
                            Location is automatically requested when component
                            mounts.
                        </Typography>

                        {loading && (
                            <div style={{ textAlign: 'center' }}>
                                <Badge variant="info">
                                    Requesting location...
                                </Badge>
                            </div>
                        )}

                        {error && (
                            <div
                                style={{
                                    padding: '1rem',
                                    backgroundColor: 'var(--theme-error-bg)',
                                    borderRadius: '4px',
                                }}
                            >
                                <Typography variant="body2" color="error">
                                    {error.message}
                                </Typography>
                            </div>
                        )}

                        {position && (
                            <div
                                style={{
                                    padding: '1rem',
                                    backgroundColor:
                                        'var(--theme-bg-secondary)',
                                    borderRadius: '4px',
                                }}
                            >
                                <Typography variant="body2">
                                    📍 {position.coords.latitude.toFixed(6)}°,{' '}
                                    {position.coords.longitude.toFixed(6)}°
                                </Typography>
                                <Typography variant="caption" color="muted">
                                    Accuracy: ±
                                    {position.coords.accuracy.toFixed(0)}m
                                </Typography>
                            </div>
                        )}

                        {history.length > 0 && (
                            <div>
                                <Typography
                                    variant="body2"
                                    style={{ marginBottom: '0.5rem' }}
                                >
                                    <strong>Event Log:</strong>
                                </Typography>
                                <div
                                    style={{
                                        padding: '0.75rem',
                                        backgroundColor:
                                            'var(--theme-bg-tertiary)',
                                        borderRadius: '4px',
                                        fontFamily: 'monospace',
                                        fontSize: '0.875rem',
                                    }}
                                >
                                    {history.map((entry, i) => (
                                        <div key={i}>{entry}</div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Typography variant="caption" color="muted">
                            With immediate mode and callbacks, you can react to
                            location changes automatically
                        </Typography>
                    </div>
                </Card.Body>
            </Card>
        )
    },
}

// Helper function for direction
function getDirection(heading: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    const index = Math.round(heading / 45) % 8
    return directions[index]
}
