import React, { useState, useRef, useEffect, useCallback } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import usePageVisibility from './usePageVisibility'

const meta: Meta = {
    title: 'Hooks/usePageVisibility',
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj

const BasicVisibilityDemo = () => {
    const { isVisible, visibilityState, isSupported } = usePageVisibility()
    const [eventCount, setEventCount] = useState(0)

    useEffect(() => {
        setEventCount((c) => c + 1)
    }, [isVisible])

    return (
        <div style={{ padding: '20px' }}>
            <h3>Basic Page Visibility</h3>
            <p>
                Switch to another tab or minimize the window to test visibility
                changes
            </p>
            {!isSupported && (
                <div
                    style={{
                        padding: '10px',
                        background: '#fee',
                        borderRadius: '4px',
                        marginBottom: '20px',
                        color: '#c00',
                    }}
                >
                    ⚠️ Page Visibility API not supported in this environment
                </div>
            )}
            <div
                style={{
                    padding: '30px',
                    borderRadius: '12px',
                    background: isVisible
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                    color: 'white',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                }}
            >
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>
                    {isVisible ? '👁️' : '🙈'}
                </div>
                <div
                    style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        marginBottom: '10px',
                    }}
                >
                    {isVisible ? 'Page is Visible' : 'Page is Hidden'}
                </div>
                <div style={{ fontSize: '16px', opacity: 0.9 }}>
                    State: {visibilityState}
                </div>
            </div>
            <div
                style={{
                    marginTop: '20px',
                    padding: '15px',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                }}
            >
                <div>
                    <strong>Visibility Changes:</strong> {eventCount - 1}
                </div>
                <div
                    style={{
                        marginTop: '10px',
                        fontSize: '14px',
                        color: '#666',
                    }}
                >
                    Try switching tabs or minimizing your browser
                </div>
            </div>
        </div>
    )
}

export const BasicVisibility: Story = {
    render: () => <BasicVisibilityDemo />,
}

const VideoPlayerDemo = () => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const intervalRef = useRef<NodeJS.Timeout>()

    usePageVisibility({
        onHide: () => {
            if (isPlaying) {
                setIsPlaying(false)
                console.log('Video paused - tab hidden')
            }
        },
        onShow: () => {
            console.log('Tab visible again')
        },
    })

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setCurrentTime((t) => (t + 0.1) % 100)
            }, 100)
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [isPlaying])

    return (
        <div style={{ padding: '20px' }}>
            <h3>Video Player with Auto-Pause</h3>
            <p>Video automatically pauses when you switch tabs</p>
            <div
                style={{
                    maxWidth: '600px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    overflow: 'hidden',
                }}
            >
                {/* Fake video player */}
                <div
                    style={{
                        width: '100%',
                        height: '300px',
                        background:
                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '80px',
                        position: 'relative',
                    }}
                >
                    {isPlaying ? '▶️' : '⏸️'}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            right: '20px',
                            background: 'rgba(0,0,0,0.5)',
                            padding: '10px 15px',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '16px',
                        }}
                    >
                        {currentTime.toFixed(1)}s
                    </div>
                </div>

                {/* Controls */}
                <div
                    style={{
                        padding: '20px',
                        background: '#f9fafb',
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center',
                    }}
                >
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        style={{
                            padding: '12px 24px',
                            background: isPlaying ? '#ef4444' : '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '16px',
                        }}
                    >
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <button
                        onClick={() => setCurrentTime(0)}
                        style={{
                            padding: '12px 24px',
                            background: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        Reset
                    </button>
                    <div style={{ flex: 1 }} />
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        Switch tabs to test auto-pause
                    </div>
                </div>

                {/* Progress bar */}
                <div
                    style={{
                        width: '100%',
                        height: '4px',
                        background: '#e5e7eb',
                    }}
                >
                    <div
                        style={{
                            width: `${currentTime}%`,
                            height: '100%',
                            background: '#667eea',
                            transition: 'width 0.1s linear',
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export const VideoPlayer: Story = {
    render: () => <VideoPlayerDemo />,
}

const ActivityTrackerDemo = () => {
    const [events, setEvents] = useState<Array<{ type: string; time: string }>>(
        []
    )
    const [sessionTime, setSessionTime] = useState(0)
    const [activeTime, setActiveTime] = useState(0)
    const sessionIntervalRef = useRef<NodeJS.Timeout>()
    const isVisibleRef = useRef(true)

    const { isVisible } = usePageVisibility({
        onChange: (visible) => {
            isVisibleRef.current = visible
            const event = {
                type: visible ? 'Tab Visible' : 'Tab Hidden',
                time: new Date().toLocaleTimeString(),
            }
            setEvents((prev) => [event, ...prev.slice(0, 9)])
        },
    })

    useEffect(() => {
        // Initialize ref with current visibility
        isVisibleRef.current = isVisible

        // Always track session time
        sessionIntervalRef.current = setInterval(() => {
            setSessionTime((t) => t + 1)
            // Only increment active time when visible
            if (isVisibleRef.current) {
                setActiveTime((t) => t + 1)
            }
        }, 1000)

        return () => {
            if (sessionIntervalRef.current) {
                clearInterval(sessionIntervalRef.current)
            }
        }
    }, [])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div style={{ padding: '20px' }}>
            <h3>Activity Tracker</h3>
            <p>Track time spent on the page (active vs total)</p>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                    marginBottom: '20px',
                }}
            >
                <div
                    style={{
                        padding: '30px',
                        background:
                            'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        borderRadius: '12px',
                        color: 'white',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            fontSize: '14px',
                            opacity: 0.9,
                            marginBottom: '10px',
                        }}
                    >
                        Total Session Time
                    </div>
                    <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
                        {formatTime(sessionTime)}
                    </div>
                </div>
                <div
                    style={{
                        padding: '30px',
                        background:
                            'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '12px',
                        color: 'white',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            fontSize: '14px',
                            opacity: 0.9,
                            marginBottom: '10px',
                        }}
                    >
                        Active Time (Visible)
                    </div>
                    <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
                        {formatTime(activeTime)}
                    </div>
                </div>
            </div>

            <div
                style={{
                    padding: '20px',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                }}
            >
                <div style={{ marginBottom: '10px' }}>
                    <strong>Engagement Rate:</strong>{' '}
                    <span
                        style={{
                            fontSize: '20px',
                            color: '#3b82f6',
                            fontWeight: 'bold',
                        }}
                    >
                        {sessionTime > 0
                            ? Math.round((activeTime / sessionTime) * 100)
                            : 0}
                        %
                    </span>
                </div>
                <div style={{ marginTop: '15px' }}>
                    <strong>Activity Log:</strong>
                </div>
                <div
                    style={{
                        marginTop: '10px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        background: 'white',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                    }}
                >
                    {events.length === 0 ? (
                        <div
                            style={{
                                padding: '20px',
                                textAlign: 'center',
                                color: '#9ca3af',
                            }}
                        >
                            No events yet. Switch tabs to track activity.
                        </div>
                    ) : (
                        events.map((event, idx) => (
                            <div
                                key={idx}
                                style={{
                                    padding: '12px 16px',
                                    borderBottom:
                                        idx < events.length - 1
                                            ? '1px solid #f3f4f6'
                                            : 'none',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '14px',
                                }}
                            >
                                <span
                                    style={{
                                        color: event.type.includes('Visible')
                                            ? '#10b981'
                                            : '#6b7280',
                                        fontWeight: '500',
                                    }}
                                >
                                    {event.type}
                                </span>
                                <span style={{ color: '#9ca3af' }}>
                                    {event.time}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export const ActivityTracker: Story = {
    render: () => <ActivityTrackerDemo />,
}

const PollingControlDemo = () => {
    const [data, setData] = useState<string[]>([])
    const [pollCount, setPollCount] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    const { isVisible } = usePageVisibility()

    useEffect(() => {
        // Only poll when visible and not manually paused
        if (!isVisible || isPaused) return

        const interval = setInterval(() => {
            const newItem = `Data ${
                pollCount + 1
            } at ${new Date().toLocaleTimeString()}`
            setData((prev) => [newItem, ...prev.slice(0, 9)])
            setPollCount((c) => c + 1)
        }, 2000)

        return () => clearInterval(interval)
    }, [isVisible, isPaused, pollCount])

    return (
        <div style={{ padding: '20px' }}>
            <h3>Smart Polling</h3>
            <p>API polling automatically pauses when tab is hidden</p>
            <div
                style={{
                    display: 'flex',
                    gap: '20px',
                    marginBottom: '20px',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        padding: '15px 25px',
                        background:
                            isVisible && !isPaused ? '#d1fae5' : '#fee2e2',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        color: isVisible && !isPaused ? '#047857' : '#991b1b',
                    }}
                >
                    Status:{' '}
                    {isVisible && !isPaused
                        ? '🟢 Polling Active'
                        : '🔴 Polling Paused'}
                </div>
                <button
                    onClick={() => setIsPaused(!isPaused)}
                    style={{
                        padding: '12px 24px',
                        background: isPaused ? '#10b981' : '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                    }}
                >
                    {isPaused ? 'Resume' : 'Pause'} Polling
                </button>
                <button
                    onClick={() => {
                        setData([])
                        setPollCount(0)
                    }}
                    style={{
                        padding: '12px 24px',
                        background: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                    }}
                >
                    Clear
                </button>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gap: '20px',
                }}
            >
                <div
                    style={{
                        padding: '20px',
                        background: '#f0f9ff',
                        borderRadius: '12px',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            fontSize: '14px',
                            color: '#666',
                            marginBottom: '10px',
                        }}
                    >
                        Total Polls
                    </div>
                    <div
                        style={{
                            fontSize: '64px',
                            fontWeight: 'bold',
                            color: '#3b82f6',
                        }}
                    >
                        {pollCount}
                    </div>
                </div>

                <div
                    style={{
                        padding: '20px',
                        background: 'white',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                    }}
                >
                    <strong>Recent Data:</strong>
                    <div
                        style={{
                            marginTop: '10px',
                            maxHeight: '300px',
                            overflowY: 'auto',
                        }}
                    >
                        {data.length === 0 ? (
                            <div
                                style={{
                                    padding: '20px',
                                    textAlign: 'center',
                                    color: '#9ca3af',
                                }}
                            >
                                Waiting for data...
                            </div>
                        ) : (
                            data.map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        padding: '10px',
                                        background:
                                            idx === 0
                                                ? '#eff6ff'
                                                : 'transparent',
                                        borderRadius: '4px',
                                        marginBottom: '5px',
                                        fontSize: '14px',
                                        fontFamily: 'monospace',
                                    }}
                                >
                                    {item}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div
                style={{
                    marginTop: '20px',
                    padding: '15px',
                    background: '#fef3c7',
                    borderRadius: '8px',
                    fontSize: '14px',
                }}
            >
                💡 <strong>Tip:</strong> Switch to another tab - polling will
                automatically pause to save resources!
            </div>
        </div>
    )
}

export const PollingControl: Story = {
    render: () => <PollingControlDemo />,
}
