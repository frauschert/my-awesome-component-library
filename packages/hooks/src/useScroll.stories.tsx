import React, { useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import useScroll from './useScroll'

const meta: Meta = {
    title: 'Hooks/useScroll',
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Window scroll demo
// ---------------------------------------------------------------------------

const WindowScrollDemo = () => {
    const { x, y, directionX, directionY, percentY, isAtTop, isAtBottom } =
        useScroll()

    const directionColor = (d: string) => (d === 'none' ? '#6b7280' : '#10b981')

    return (
        <div style={{ fontFamily: 'monospace' }}>
            <p style={{ marginBottom: 16, color: '#6b7280' }}>
                Scroll the page to see the values update.
            </p>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12,
                    maxWidth: 420,
                }}
            >
                {(
                    [
                        ['Scroll X', x + 'px'],
                        ['Scroll Y', y + 'px'],
                        ['Direction X', directionX],
                        ['Direction Y', directionY],
                        ['Progress Y', percentY + '%'],
                        ['At top', String(isAtTop)],
                        ['At bottom', String(isAtBottom)],
                    ] as [string, string][]
                ).map(([label, value]) => (
                    <div
                        key={label}
                        style={{
                            padding: '10px 14px',
                            background: '#f9fafb',
                            borderRadius: 8,
                            border: '1px solid #e5e7eb',
                        }}
                    >
                        <div
                            style={{
                                fontSize: 11,
                                color: '#9ca3af',
                                marginBottom: 4,
                            }}
                        >
                            {label}
                        </div>
                        <div
                            style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: label.startsWith('Direction')
                                    ? directionColor(value)
                                    : '#111827',
                            }}
                        >
                            {value}
                        </div>
                    </div>
                ))}
            </div>
            {/* Tall spacer so the page is scrollable in Storybook */}
            <div style={{ height: 1200 }} />
        </div>
    )
}

export const WindowScroll: Story = {
    render: () => <WindowScrollDemo />,
    name: 'Window scroll',
}

// ---------------------------------------------------------------------------
// Element scroll demo
// ---------------------------------------------------------------------------

const ElementScrollDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const { y, directionY, percentY, isAtTop, isAtBottom } =
        useScroll(containerRef)

    return (
        <div style={{ fontFamily: 'monospace', padding: 20 }}>
            <h3 style={{ marginBottom: 12 }}>Element scroll</h3>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                {/* Scrollable box */}
                <div
                    ref={containerRef}
                    style={{
                        width: 280,
                        height: 300,
                        overflowY: 'scroll',
                        border: '2px solid #3b82f6',
                        borderRadius: 8,
                        padding: 16,
                        background: '#eff6ff',
                    }}
                >
                    {Array.from({ length: 30 }, (_, i) => (
                        <div
                            key={i}
                            style={{
                                padding: '8px 0',
                                borderBottom: '1px solid #bfdbfe',
                                color: '#1e40af',
                            }}
                        >
                            Item {i + 1}
                        </div>
                    ))}
                </div>

                {/* Stats panel */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                        minWidth: 160,
                    }}
                >
                    {(
                        [
                            ['Scroll Y', y + 'px'],
                            ['Direction', directionY],
                            ['Progress', percentY + '%'],
                            ['At top', String(isAtTop)],
                            ['At bottom', String(isAtBottom)],
                        ] as [string, string][]
                    ).map(([label, value]) => (
                        <div
                            key={label}
                            style={{
                                padding: '8px 12px',
                                background: '#f9fafb',
                                borderRadius: 8,
                                border: '1px solid #e5e7eb',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 11,
                                    color: '#9ca3af',
                                    marginBottom: 2,
                                }}
                            >
                                {label}
                            </div>
                            <div
                                style={{
                                    fontWeight: 'bold',
                                    color:
                                        label === 'Direction' &&
                                        value !== 'none'
                                            ? '#10b981'
                                            : '#111827',
                                }}
                            >
                                {value}
                            </div>
                        </div>
                    ))}

                    {/* Progress bar */}
                    <div
                        style={{
                            marginTop: 4,
                            height: 8,
                            background: '#e5e7eb',
                            borderRadius: 4,
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                height: '100%',
                                width: percentY + '%',
                                background: '#3b82f6',
                                borderRadius: 4,
                                transition: 'width 0.1s',
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export const ElementScroll: Story = {
    render: () => <ElementScrollDemo />,
    name: 'Element scroll',
}

// ---------------------------------------------------------------------------
// Throttled scroll demo
// ---------------------------------------------------------------------------

const ThrottledScrollDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [throttleMs, setThrottleMs] = useState(100)

    const throttled = useScroll(containerRef, { throttleMs })
    const live = useScroll(containerRef)

    return (
        <div style={{ fontFamily: 'monospace', padding: 20 }}>
            <h3 style={{ marginBottom: 8 }}>Throttled vs. live</h3>
            <label style={{ fontSize: 13, color: '#374151' }}>
                Throttle:{' '}
                <input
                    type="range"
                    min={0}
                    max={500}
                    step={50}
                    value={throttleMs}
                    onChange={(e) => setThrottleMs(Number(e.target.value))}
                />{' '}
                <strong>{throttleMs} ms</strong>
            </label>

            <div
                style={{
                    display: 'flex',
                    gap: 24,
                    marginTop: 16,
                    alignItems: 'flex-start',
                }}
            >
                <div
                    ref={containerRef}
                    style={{
                        width: 200,
                        height: 260,
                        overflowY: 'scroll',
                        border: '2px solid #8b5cf6',
                        borderRadius: 8,
                        padding: 12,
                        background: '#f5f3ff',
                    }}
                >
                    {Array.from({ length: 25 }, (_, i) => (
                        <div
                            key={i}
                            style={{
                                padding: '6px 0',
                                borderBottom: '1px solid #ddd6fe',
                                color: '#5b21b6',
                            }}
                        >
                            Row {i + 1}
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                    {[
                        { label: 'Live', value: live.y, color: '#10b981' },
                        {
                            label: `Throttled (${throttleMs}ms)`,
                            value: throttled.y,
                            color: '#8b5cf6',
                        },
                    ].map(({ label, value, color }) => (
                        <div
                            key={label}
                            style={{
                                padding: '12px 16px',
                                border: `2px solid ${color}`,
                                borderRadius: 8,
                                textAlign: 'center',
                                minWidth: 120,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 11,
                                    color: '#9ca3af',
                                    marginBottom: 4,
                                }}
                            >
                                {label}
                            </div>
                            <div
                                style={{
                                    fontSize: 22,
                                    fontWeight: 'bold',
                                    color,
                                }}
                            >
                                {value}px
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export const Throttled: Story = {
    render: () => <ThrottledScrollDemo />,
    name: 'Throttled updates',
}
