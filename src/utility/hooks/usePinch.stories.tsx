import React, { useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import usePinch, { PinchEvent } from './usePinch'

const meta: Meta = {
    title: 'Hooks/usePinch',
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj

const BasicPinchDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scale, isPinching } = usePinch(containerRef, {
        minScale: 0.5,
        maxScale: 3,
    })

    return (
        <div style={{ padding: '20px' }}>
            <h3>Basic Pinch Zoom</h3>
            <p>
                Use two fingers to pinch-to-zoom on the image below (touch
                device required)
            </p>
            <div
                ref={containerRef}
                style={{
                    width: '400px',
                    height: '400px',
                    border: '3px solid #3b82f6',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    position: 'relative',
                    touchAction: 'none',
                    background: '#f0f9ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        transform: `scale(${scale})`,
                        transition: isPinching ? 'none' : 'transform 0.3s ease',
                        fontSize: '120px',
                        userSelect: 'none',
                    }}
                >
                    🖼️
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
                    <strong>Scale:</strong>{' '}
                    <span
                        style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#3b82f6',
                        }}
                    >
                        {scale.toFixed(2)}x
                    </span>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <strong>Status:</strong>{' '}
                    <span
                        style={{
                            color: isPinching ? '#10b981' : '#6b7280',
                            fontWeight: 'bold',
                        }}
                    >
                        {isPinching ? '🤏 Pinching' : '👆 Ready'}
                    </span>
                </div>
                <div
                    style={{
                        marginTop: '15px',
                        fontSize: '14px',
                        color: '#666',
                    }}
                >
                    Range: 0.5x - 3.0x
                </div>
            </div>
        </div>
    )
}

export const BasicPinch: Story = {
    render: () => <BasicPinchDemo />,
}

const ImageZoomDemo = () => {
    const imageRef = useRef<HTMLDivElement>(null)
    const { scale, isPinching, reset } = usePinch(imageRef, {
        minScale: 1,
        maxScale: 5,
    })

    return (
        <div style={{ padding: '20px' }}>
            <h3>Image Zoom Viewer</h3>
            <p>Pinch to zoom on the image</p>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                }}
            >
                <div
                    ref={imageRef}
                    style={{
                        width: '500px',
                        height: '400px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        touchAction: 'none',
                        cursor: isPinching ? 'zoom-in' : 'default',
                        background:
                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            transform: `scale(${scale})`,
                            transition: isPinching
                                ? 'none'
                                : 'transform 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '200px',
                            transformOrigin: 'center center',
                        }}
                    >
                        🌄
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        gap: '20px',
                        alignItems: 'center',
                    }}
                >
                    <button
                        onClick={reset}
                        style={{
                            padding: '10px 20px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        Reset Zoom
                    </button>
                    <div
                        style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#374151',
                        }}
                    >
                        {scale.toFixed(1)}x
                    </div>
                    <div
                        style={{
                            width: '200px',
                            height: '8px',
                            background: '#e5e7eb',
                            borderRadius: '4px',
                            position: 'relative',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                width: `${((scale - 1) / 4) * 100}%`,
                                background: '#3b82f6',
                                borderRadius: '4px',
                                transition: 'width 0.2s ease',
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export const ImageZoom: Story = {
    render: () => <ImageZoomDemo />,
}

const PinchDetailsDemo = () => {
    const [pinchInfo, setPinchInfo] = useState<PinchEvent | null>(null)
    const [history, setHistory] = useState<string[]>([])
    const boxRef = useRef<HTMLDivElement>(null)

    const { scale, isPinching, reset } = usePinch(boxRef, {
        onPinch: (event) => {
            setPinchInfo(event)
        },
        onPinchStart: () => {
            setHistory((prev) => [
                ...prev,
                `Started at ${new Date().toLocaleTimeString()}`,
            ])
        },
        onPinchEnd: (event) => {
            setHistory((prev) => [
                ...prev,
                `Ended at ${new Date().toLocaleTimeString()} - Final scale: ${event.scale.toFixed(
                    2
                )}x`,
            ])
        },
        minScale: 0.3,
        maxScale: 4,
    })

    return (
        <div style={{ padding: '20px' }}>
            <h3>Pinch Gesture Details</h3>
            <p>Monitor detailed pinch gesture information</p>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                }}
            >
                <div>
                    <div
                        ref={boxRef}
                        style={{
                            width: '350px',
                            height: '350px',
                            border: '3px solid #8b5cf6',
                            borderRadius: '12px',
                            background:
                                'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            touchAction: 'none',
                            position: 'relative',
                        }}
                    >
                        <div
                            style={{
                                transform: `scale(${scale})`,
                                transition: isPinching
                                    ? 'none'
                                    : 'transform 0.3s ease',
                                fontSize: '80px',
                                color: 'white',
                                textAlign: 'center',
                            }}
                        >
                            <div>🔍</div>
                            <div
                                style={{ fontSize: '24px', marginTop: '10px' }}
                            >
                                {scale.toFixed(2)}x
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={reset}
                        style={{
                            marginTop: '15px',
                            padding: '10px 20px',
                            background: '#8b5cf6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            width: '100%',
                        }}
                    >
                        Reset
                    </button>
                </div>

                <div>
                    {pinchInfo && (
                        <div>
                            <h4>Current Gesture:</h4>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '10px',
                                    marginTop: '10px',
                                }}
                            >
                                <div
                                    style={{
                                        padding: '12px',
                                        background: '#faf5ff',
                                        borderRadius: '6px',
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: '11px',
                                            color: '#666',
                                            marginBottom: '4px',
                                        }}
                                    >
                                        Scale
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            color: '#8b5cf6',
                                        }}
                                    >
                                        {pinchInfo.scale.toFixed(2)}x
                                    </div>
                                </div>
                                <div
                                    style={{
                                        padding: '12px',
                                        background: '#faf5ff',
                                        borderRadius: '6px',
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: '11px',
                                            color: '#666',
                                            marginBottom: '4px',
                                        }}
                                    >
                                        Direction
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            color: '#8b5cf6',
                                        }}
                                    >
                                        {pinchInfo.direction === 'in'
                                            ? '🔍 In'
                                            : '🔎 Out'}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        padding: '12px',
                                        background: '#faf5ff',
                                        borderRadius: '6px',
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: '11px',
                                            color: '#666',
                                            marginBottom: '4px',
                                        }}
                                    >
                                        Distance
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            color: '#8b5cf6',
                                        }}
                                    >
                                        {Math.round(pinchInfo.distance)}px
                                    </div>
                                </div>
                                <div
                                    style={{
                                        padding: '12px',
                                        background: '#faf5ff',
                                        borderRadius: '6px',
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: '11px',
                                            color: '#666',
                                            marginBottom: '4px',
                                        }}
                                    >
                                        Delta
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            color: '#8b5cf6',
                                        }}
                                    >
                                        {pinchInfo.delta > 0 ? '+' : ''}
                                        {pinchInfo.delta.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                            <div
                                style={{
                                    marginTop: '15px',
                                    padding: '12px',
                                    background: '#faf5ff',
                                    borderRadius: '6px',
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: '11px',
                                        color: '#666',
                                        marginBottom: '4px',
                                    }}
                                >
                                    Center Point
                                </div>
                                <div
                                    style={{
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: '#8b5cf6',
                                    }}
                                >
                                    x: {Math.round(pinchInfo.center.x)}, y:{' '}
                                    {Math.round(pinchInfo.center.y)}
                                </div>
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '20px' }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <h4>Event History:</h4>
                            {history.length > 0 && (
                                <button
                                    onClick={() => setHistory([])}
                                    style={{
                                        padding: '5px 10px',
                                        background: '#e5e7eb',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                    }}
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        <div
                            style={{
                                marginTop: '10px',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                background: 'white',
                            }}
                        >
                            {history.length === 0 ? (
                                <div
                                    style={{
                                        padding: '20px',
                                        textAlign: 'center',
                                        color: '#9ca3af',
                                    }}
                                >
                                    No events yet
                                </div>
                            ) : (
                                history.map((event, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            padding: '10px 12px',
                                            borderBottom:
                                                idx < history.length - 1
                                                    ? '1px solid #f3f4f6'
                                                    : 'none',
                                            fontSize: '13px',
                                        }}
                                    >
                                        {event}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const PinchDetails: Story = {
    render: () => <PinchDetailsDemo />,
}

const InteractiveMapDemo = () => {
    const mapRef = useRef<HTMLDivElement>(null)
    const { scale, isPinching, reset } = usePinch(mapRef, {
        minScale: 1,
        maxScale: 4,
        sensitivity: 1.2,
    })

    const locations = [
        { emoji: '🏠', x: 40, y: 30, label: 'Home' },
        { emoji: '🏢', x: 60, y: 50, label: 'Office' },
        { emoji: '🏪', x: 30, y: 70, label: 'Store' },
        { emoji: '🏥', x: 70, y: 40, label: 'Hospital' },
        { emoji: '⛪', x: 20, y: 50, label: 'Church' },
        { emoji: '🏫', x: 50, y: 80, label: 'School' },
    ]

    return (
        <div style={{ padding: '20px' }}>
            <h3>Interactive Map</h3>
            <p>Pinch to zoom and explore the map</p>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '15px',
                }}
            >
                <div
                    ref={mapRef}
                    style={{
                        width: '600px',
                        height: '450px',
                        border: '2px solid #10b981',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        touchAction: 'none',
                        background: '#ecfdf5',
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            transform: `scale(${scale})`,
                            transition: isPinching
                                ? 'none'
                                : 'transform 0.2s ease',
                            transformOrigin: 'center center',
                            position: 'relative',
                        }}
                    >
                        {/* Map background */}
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                background: `
                                    repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(16, 185, 129, 0.1) 49px, rgba(16, 185, 129, 0.1) 50px),
                                    repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(16, 185, 129, 0.1) 49px, rgba(16, 185, 129, 0.1) 50px)
                                `,
                            }}
                        />

                        {/* Locations */}
                        {locations.map((loc, idx) => (
                            <div
                                key={idx}
                                style={{
                                    position: 'absolute',
                                    left: `${loc.x}%`,
                                    top: `${loc.y}%`,
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: `${48 / scale}px`,
                                    cursor: 'pointer',
                                    transition: 'font-size 0.2s ease',
                                }}
                                title={loc.label}
                            >
                                {loc.emoji}
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        gap: '15px',
                        alignItems: 'center',
                    }}
                >
                    <button
                        onClick={reset}
                        style={{
                            padding: '10px 20px',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        Reset View
                    </button>
                    <div
                        style={{
                            padding: '10px 20px',
                            background: isPinching ? '#d1fae5' : '#f3f4f6',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            color: '#047857',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        Zoom: {scale.toFixed(1)}x
                    </div>
                </div>
            </div>
        </div>
    )
}

export const InteractiveMap: Story = {
    render: () => <InteractiveMapDemo />,
}
