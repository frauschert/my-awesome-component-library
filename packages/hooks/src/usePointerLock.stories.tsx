import React, { useRef } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import usePointerLock from './usePointerLock'

const meta: Meta = {
    title: 'Hooks/usePointerLock',
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Demo
// ---------------------------------------------------------------------------

const Demo = () => {
    const targetRef = useRef<HTMLDivElement>(null)
    const trailRef = useRef<{ x: number; y: number }>({ x: 200, y: 200 })
    const [pos, setPos] = React.useState({ x: 200, y: 200 })
    const [totalDelta, setTotalDelta] = React.useState({ x: 0, y: 0 })

    const { isLocked, movement, toggle, isSupported } = usePointerLock(
        targetRef,
        {
            onLock: () => setTotalDelta({ x: 0, y: 0 }),
            onUnlock: () => setPos({ x: 200, y: 200 }),
        }
    )

    // Accumulate movement into a dot position while locked
    React.useEffect(() => {
        if (!isLocked) return
        trailRef.current = {
            x: Math.max(0, Math.min(400, trailRef.current.x + movement.x)),
            y: Math.max(0, Math.min(400, trailRef.current.y + movement.y)),
        }
        setPos({ ...trailRef.current })
        setTotalDelta((d) => ({
            x: d.x + movement.x,
            y: d.y + movement.y,
        }))
    }, [movement, isLocked])

    return (
        <div style={{ fontFamily: 'monospace', padding: 24 }}>
            <h3 style={{ marginBottom: 8 }}>usePointerLock</h3>
            {!isSupported && (
                <p style={{ color: '#ef4444' }}>
                    Pointer Lock API is not supported in this browser.
                </p>
            )}

            {/* Target element */}
            <div
                ref={targetRef}
                onClick={toggle}
                style={{
                    position: 'relative',
                    width: 400,
                    height: 400,
                    border: `3px solid ${isLocked ? '#10b981' : '#6b7280'}`,
                    borderRadius: 12,
                    background: isLocked ? '#f0fdf4' : '#f9fafb',
                    cursor: isLocked ? 'none' : 'crosshair',
                    overflow: 'hidden',
                    userSelect: 'none',
                    transition: 'border-color 0.2s, background 0.2s',
                }}
            >
                {/* Dot that follows raw movement */}
                <div
                    style={{
                        position: 'absolute',
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: isLocked ? '#10b981' : '#d1d5db',
                        transform: 'translate(-50%, -50%)',
                        left: pos.x,
                        top: pos.y,
                        transition: isLocked ? 'none' : 'left 0.3s, top 0.3s',
                        pointerEvents: 'none',
                    }}
                />

                {/* Instructions overlay */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        color: isLocked ? '#065f46' : '#6b7280',
                        pointerEvents: 'none',
                    }}
                >
                    {isLocked
                        ? 'Move mouse · Click to unlock'
                        : 'Click to lock pointer'}
                </div>
            </div>

            {/* Stats */}
            <div
                style={{
                    marginTop: 16,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 12,
                    maxWidth: 400,
                }}
            >
                {[
                    ['Status', isLocked ? 'Locked' : 'Unlocked'],
                    ['movementX', movement.x],
                    ['movementY', movement.y],
                    ['Total ΔX', totalDelta.x],
                    ['Total ΔY', totalDelta.y],
                    ['Dot X', Math.round(pos.x)],
                ].map(([label, value]) => (
                    <div
                        key={String(label)}
                        style={{
                            padding: '8px 12px',
                            background: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: 8,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 10,
                                color: '#9ca3af',
                                marginBottom: 2,
                                textTransform: 'uppercase',
                            }}
                        >
                            {label}
                        </div>
                        <div
                            style={{
                                fontWeight: 'bold',
                                color:
                                    label === 'Status'
                                        ? isLocked
                                            ? '#10b981'
                                            : '#6b7280'
                                        : '#111827',
                            }}
                        >
                            {String(value)}
                        </div>
                    </div>
                ))}
            </div>

            <p
                style={{
                    marginTop: 12,
                    fontSize: 12,
                    color: '#9ca3af',
                    maxWidth: 400,
                }}
            >
                While locked the cursor is hidden and <code>movementX</code>/
                <code>movementY</code> are unbounded — the dot wraps at the box
                edges, but raw deltas keep accumulating.
            </p>
        </div>
    )
}

export const Default: Story = {
    render: () => <Demo />,
    name: 'Pointer lock demo',
}
