import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useVibrate } from './index'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import Typography from '../../components/Typography'

const meta: Meta = {
    title: 'Hooks/useVibrate',
    parameters: {
        docs: {
            description: {
                component:
                    'Trigger device vibration for haptic feedback using the Vibration API. Works on mobile devices and some laptops with haptic engines.',
            },
        },
    },
}

export default meta

type Story = StoryObj

/**
 * Basic vibration patterns example.
 */
export const BasicUsage: Story = {
    render: () => {
        const { vibrate, stop, isSupported } = useVibrate()

        return (
            <Card>
                <Card.Header>
                    <Typography variant="h3">Basic Vibration</Typography>
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
                            <Badge variant="warning">
                                Vibration API not supported on this device
                            </Badge>
                        )}

                        <div
                            style={{
                                display: 'flex',
                                gap: '0.5rem',
                                flexWrap: 'wrap',
                            }}
                        >
                            <Button
                                onClick={() => vibrate(50)}
                                disabled={!isSupported}
                            >
                                Short (50ms)
                            </Button>
                            <Button
                                onClick={() => vibrate(200)}
                                disabled={!isSupported}
                            >
                                Medium (200ms)
                            </Button>
                            <Button
                                onClick={() => vibrate(500)}
                                disabled={!isSupported}
                            >
                                Long (500ms)
                            </Button>
                            <Button
                                onClick={stop}
                                variant="secondary"
                                disabled={!isSupported}
                            >
                                Stop
                            </Button>
                        </div>

                        <Typography variant="caption" color="muted">
                            {isSupported
                                ? 'Click buttons to feel different vibration durations'
                                : 'Try on a mobile device or laptop with haptic support'}
                        </Typography>
                    </div>
                </Card.Body>
            </Card>
        )
    },
}

/**
 * Complex vibration patterns.
 */
export const VibrationPatterns: Story = {
    render: () => {
        const { vibrate, isSupported } = useVibrate()

        const patterns = [
            {
                name: 'Double Tap',
                pattern: [100, 50, 100],
                description: 'Two quick vibrations',
            },
            {
                name: 'Triple Tap',
                pattern: [50, 50, 50, 50, 50],
                description: 'Three short vibrations',
            },
            {
                name: 'SOS',
                pattern: [100, 50, 100, 50, 100, 200, 300, 50, 300, 50, 300],
                description: 'Morse code SOS pattern',
            },
            {
                name: 'Alert',
                pattern: [200, 100, 200, 100, 200],
                description: 'Attention-grabbing pattern',
            },
            {
                name: 'Success',
                pattern: [50, 50, 100],
                description: 'Short success feedback',
            },
            {
                name: 'Error',
                pattern: [300, 100, 300],
                description: 'Strong error feedback',
            },
        ]

        return (
            <Card>
                <Card.Header>
                    <Typography variant="h3">Vibration Patterns</Typography>
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
                            <Badge variant="warning">
                                Vibration API not supported on this device
                            </Badge>
                        )}

                        {patterns.map((item) => (
                            <div
                                key={item.name}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '0.75rem',
                                    backgroundColor:
                                        'var(--theme-bg-secondary)',
                                    borderRadius: '4px',
                                }}
                            >
                                <Button
                                    onClick={() => vibrate(item.pattern)}
                                    disabled={!isSupported}
                                    style={{ minWidth: '120px' }}
                                >
                                    {item.name}
                                </Button>
                                <div>
                                    <Typography variant="body2">
                                        {item.description}
                                    </Typography>
                                    <Typography variant="caption" color="muted">
                                        Pattern: [{item.pattern.join(', ')}]
                                    </Typography>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card.Body>
            </Card>
        )
    },
}

/**
 * Interactive game example with haptic feedback.
 */
export const GameHaptics: Story = {
    render: () => {
        const { vibrate, isSupported } = useVibrate({ defaultPattern: 30 })
        const [score, setScore] = useState(0)
        const [combo, setCombo] = useState(0)

        const handleTap = () => {
            vibrate(30) // Light tap
            setScore((s) => s + 1)
            setCombo((c) => c + 1)
        }

        const handlePowerUp = () => {
            vibrate([50, 30, 100]) // Power-up pattern
            setScore((s) => s + 10)
            setCombo(0)
        }

        const handleGameOver = () => {
            vibrate([200, 100, 200, 100, 200]) // Game over pattern
            setScore(0)
            setCombo(0)
        }

        return (
            <Card>
                <Card.Header>
                    <Typography variant="h3">Game Haptics Demo</Typography>
                </Card.Header>
                <Card.Body>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem',
                        }}
                    >
                        {!isSupported && (
                            <Badge variant="warning">
                                Vibration API not supported on this device
                            </Badge>
                        )}

                        <div
                            style={{
                                display: 'flex',
                                gap: '1rem',
                                justifyContent: 'center',
                            }}
                        >
                            <div style={{ textAlign: 'center' }}>
                                <Typography variant="caption" color="muted">
                                    Score
                                </Typography>
                                <Typography
                                    variant="h2"
                                    style={{ fontSize: '2rem' }}
                                >
                                    {score}
                                </Typography>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <Typography variant="caption" color="muted">
                                    Combo
                                </Typography>
                                <Typography
                                    variant="h2"
                                    style={{ fontSize: '2rem' }}
                                >
                                    {combo}x
                                </Typography>
                            </div>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                gap: '0.5rem',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                            }}
                        >
                            <Button
                                onClick={handleTap}
                                disabled={!isSupported}
                                variant="primary"
                            >
                                Tap (+1) 👆
                            </Button>
                            <Button
                                onClick={handlePowerUp}
                                disabled={!isSupported}
                                variant="success"
                            >
                                Power-up (+10) ⚡
                            </Button>
                            <Button
                                onClick={handleGameOver}
                                disabled={!isSupported}
                                variant="danger"
                            >
                                Game Over 💥
                            </Button>
                        </div>

                        <Typography
                            variant="caption"
                            color="muted"
                            style={{ textAlign: 'center' }}
                        >
                            Each action has different haptic feedback
                        </Typography>
                    </div>
                </Card.Body>
            </Card>
        )
    },
}

/**
 * Mobile UI feedback patterns.
 */
export const UIFeedback: Story = {
    render: () => {
        const { vibrate, isSupported } = useVibrate()
        const [liked, setLiked] = useState(false)
        const [bookmarked, setBookmarked] = useState(false)

        return (
            <Card>
                <Card.Header>
                    <Typography variant="h3">UI Haptic Feedback</Typography>
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
                            <Badge variant="warning">
                                Vibration API not supported on this device
                            </Badge>
                        )}

                        <div
                            style={{
                                display: 'flex',
                                gap: '0.5rem',
                                flexWrap: 'wrap',
                            }}
                        >
                            <Button
                                onClick={() => {
                                    vibrate(30)
                                }}
                                disabled={!isSupported}
                            >
                                Light Tap (30ms)
                            </Button>
                            <Button
                                onClick={() => {
                                    vibrate(50)
                                }}
                                disabled={!isSupported}
                            >
                                Medium Tap (50ms)
                            </Button>
                            <Button
                                onClick={() => {
                                    vibrate([50, 30, 50])
                                }}
                                disabled={!isSupported}
                            >
                                Double Tap
                            </Button>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                gap: '0.5rem',
                                marginTop: '1rem',
                            }}
                        >
                            <Button
                                onClick={() => {
                                    setLiked(!liked)
                                    vibrate(liked ? 30 : 50)
                                }}
                                variant={liked ? 'primary' : 'secondary'}
                                disabled={!isSupported}
                            >
                                {liked ? '❤️ Liked' : '🤍 Like'}
                            </Button>
                            <Button
                                onClick={() => {
                                    setBookmarked(!bookmarked)
                                    vibrate([30, 20, 30])
                                }}
                                variant={bookmarked ? 'primary' : 'secondary'}
                                disabled={!isSupported}
                            >
                                {bookmarked ? '🔖 Saved' : '📄 Save'}
                            </Button>
                        </div>

                        <Typography
                            variant="caption"
                            color="muted"
                            style={{ marginTop: '1rem' }}
                        >
                            Haptic feedback enhances mobile user experience by
                            providing tactile confirmation of actions
                        </Typography>
                    </div>
                </Card.Body>
            </Card>
        )
    },
}
