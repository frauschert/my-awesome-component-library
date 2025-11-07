import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import useBattery from './useBattery'

const meta: Meta = {
    title: 'Hooks/useBattery',
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj

const BasicBatteryDemo = () => {
    const { level, charging, isSupported, loading, error } = useBattery()

    if (loading) {
        return (
            <div style={{ padding: '20px' }}>
                <div style={{ fontSize: '18px' }}>
                    Loading battery information...
                </div>
            </div>
        )
    }

    if (!isSupported) {
        return (
            <div style={{ padding: '20px' }}>
                <div
                    style={{
                        padding: '20px',
                        background: '#fef3c7',
                        borderRadius: '8px',
                        border: '1px solid #fbbf24',
                    }}
                >
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>
                        ⚠️
                    </div>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        Battery Status API not supported
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                        This API is not available in your browser. Try
                        Chrome/Edge on a laptop or mobile device.
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div style={{ padding: '20px' }}>
                <div
                    style={{
                        padding: '20px',
                        background: '#fee2e2',
                        borderRadius: '8px',
                        border: '1px solid #ef4444',
                        color: '#991b1b',
                    }}
                >
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        Error
                    </div>
                    <div style={{ fontSize: '14px' }}>{error.message}</div>
                </div>
            </div>
        )
    }

    const batteryPercentage = Math.round(level * 100)
    const isLowBattery = level < 0.2 && !charging
    const isCriticalBattery = level < 0.1 && !charging

    return (
        <div style={{ padding: '20px' }}>
            <h3>Battery Status</h3>
            <p>Real-time battery information from your device</p>

            <div
                style={{
                    maxWidth: '400px',
                    padding: '30px',
                    background: isCriticalBattery
                        ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                        : isLowBattery
                        ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                        : charging
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    borderRadius: '16px',
                    color: 'white',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                }}
            >
                <div
                    style={{
                        fontSize: '64px',
                        textAlign: 'center',
                        marginBottom: '20px',
                    }}
                >
                    {charging
                        ? '⚡'
                        : isCriticalBattery
                        ? '🪫'
                        : isLowBattery
                        ? '🔋'
                        : '🔋'}
                </div>

                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div
                        style={{
                            fontSize: '72px',
                            fontWeight: 'bold',
                            lineHeight: 1,
                        }}
                    >
                        {batteryPercentage}%
                    </div>
                    <div
                        style={{
                            fontSize: '18px',
                            opacity: 0.9,
                            marginTop: '10px',
                        }}
                    >
                        {charging ? 'Charging' : 'Discharging'}
                    </div>
                </div>

                {/* Battery bar visualization */}
                <div
                    style={{
                        height: '40px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            height: '100%',
                            width: `${batteryPercentage}%`,
                            background: 'rgba(255,255,255,0.8)',
                            borderRadius: '20px',
                            transition: 'width 0.3s ease',
                        }}
                    />
                </div>
            </div>

            {isLowBattery && (
                <div
                    style={{
                        marginTop: '20px',
                        padding: '15px',
                        background: isCriticalBattery ? '#fee2e2' : '#fef3c7',
                        borderRadius: '8px',
                        border: `1px solid ${
                            isCriticalBattery ? '#ef4444' : '#f59e0b'
                        }`,
                    }}
                >
                    <strong>
                        {isCriticalBattery
                            ? '⚠️ Critical Battery Level'
                            : '⚡ Low Battery'}
                    </strong>
                    <div style={{ fontSize: '14px', marginTop: '5px' }}>
                        {isCriticalBattery
                            ? 'Please connect your device to a charger immediately.'
                            : 'Consider enabling power-saving mode.'}
                    </div>
                </div>
            )}
        </div>
    )
}

export const BasicBattery: Story = {
    render: () => <BasicBatteryDemo />,
}

const DetailedBatteryDemo = () => {
    const {
        level,
        charging,
        chargingTime,
        dischargingTime,
        isSupported,
        loading,
        error,
    } = useBattery()

    if (loading) {
        return <div style={{ padding: '20px' }}>Loading...</div>
    }

    if (!isSupported) {
        return (
            <div style={{ padding: '20px' }}>
                Battery Status API not supported in this browser.
            </div>
        )
    }

    if (error) {
        return (
            <div style={{ padding: '20px', color: '#ef4444' }}>
                Error: {error.message}
            </div>
        )
    }

    const formatTime = (seconds: number) => {
        if (seconds === Infinity || seconds === 0) {
            return 'Unknown'
        }
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        return `${hours}h ${minutes}m`
    }

    return (
        <div style={{ padding: '20px' }}>
            <h3>Detailed Battery Information</h3>
            <p>Complete battery metrics and estimates</p>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '15px',
                }}
            >
                <div
                    style={{
                        padding: '20px',
                        background: '#f0f9ff',
                        borderRadius: '12px',
                        border: '1px solid #bfdbfe',
                    }}
                >
                    <div
                        style={{
                            fontSize: '14px',
                            color: '#666',
                            marginBottom: '5px',
                        }}
                    >
                        Battery Level
                    </div>
                    <div
                        style={{
                            fontSize: '32px',
                            fontWeight: 'bold',
                            color: '#3b82f6',
                        }}
                    >
                        {Math.round(level * 100)}%
                    </div>
                </div>

                <div
                    style={{
                        padding: '20px',
                        background: charging ? '#d1fae5' : '#fee2e2',
                        borderRadius: '12px',
                        border: `1px solid ${charging ? '#6ee7b7' : '#fecaca'}`,
                    }}
                >
                    <div
                        style={{
                            fontSize: '14px',
                            color: '#666',
                            marginBottom: '5px',
                        }}
                    >
                        Status
                    </div>
                    <div
                        style={{
                            fontSize: '32px',
                            fontWeight: 'bold',
                            color: charging ? '#059669' : '#dc2626',
                        }}
                    >
                        {charging ? '⚡' : '🔋'}
                    </div>
                    <div style={{ fontSize: '14px', marginTop: '5px' }}>
                        {charging ? 'Charging' : 'On Battery'}
                    </div>
                </div>

                <div
                    style={{
                        padding: '20px',
                        background: '#f5f3ff',
                        borderRadius: '12px',
                        border: '1px solid #ddd6fe',
                    }}
                >
                    <div
                        style={{
                            fontSize: '14px',
                            color: '#666',
                            marginBottom: '5px',
                        }}
                    >
                        {charging ? 'Time to Full' : 'Time Remaining'}
                    </div>
                    <div
                        style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#7c3aed',
                        }}
                    >
                        {charging
                            ? formatTime(chargingTime)
                            : formatTime(dischargingTime)}
                    </div>
                </div>
            </div>

            <div
                style={{
                    marginTop: '20px',
                    padding: '20px',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                }}
            >
                <div style={{ fontWeight: 'bold', marginBottom: '15px' }}>
                    Raw Values
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                    <div style={{ marginBottom: '5px' }}>
                        <strong>level:</strong> {level.toFixed(4)}
                    </div>
                    <div style={{ marginBottom: '5px' }}>
                        <strong>charging:</strong> {charging.toString()}
                    </div>
                    <div style={{ marginBottom: '5px' }}>
                        <strong>chargingTime:</strong> {chargingTime}s
                    </div>
                    <div>
                        <strong>dischargingTime:</strong>{' '}
                        {dischargingTime === Infinity
                            ? 'Infinity'
                            : `${dischargingTime}s`}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const DetailedBattery: Story = {
    render: () => <DetailedBatteryDemo />,
}

const PowerSavingModeDemo = () => {
    const { level, charging, isSupported, loading } = useBattery()

    if (loading || !isSupported) {
        return (
            <div style={{ padding: '20px' }}>
                {loading ? 'Loading...' : 'Battery API not supported'}
            </div>
        )
    }

    const lowBattery = level < 0.2 && !charging
    const criticalBattery = level < 0.1 && !charging

    return (
        <div style={{ padding: '20px' }}>
            <h3>Power-Aware Application</h3>
            <p>Adjusts features based on battery status</p>

            <div
                style={{
                    padding: '20px',
                    background: lowBattery ? '#fef3c7' : '#d1fae5',
                    borderRadius: '12px',
                    marginBottom: '20px',
                }}
            >
                <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    {lowBattery
                        ? '🔋 Power Saving Mode Active'
                        : '✅ Normal Mode'}
                </div>
                <div style={{ fontSize: '14px' }}>
                    Battery: {Math.round(level * 100)}%{' '}
                    {charging && '(Charging)'}
                </div>
            </div>

            <div style={{ display: 'grid', gap: '15px' }}>
                <div
                    style={{
                        padding: '15px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        opacity: criticalBattery ? 0.5 : 1,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <strong>High Quality Video</strong>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                                1080p streaming
                            </div>
                        </div>
                        <div
                            style={{
                                padding: '5px 15px',
                                background: criticalBattery
                                    ? '#fee2e2'
                                    : '#d1fae5',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: criticalBattery ? '#dc2626' : '#059669',
                            }}
                        >
                            {criticalBattery ? 'DISABLED' : 'ENABLED'}
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        padding: '15px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        opacity: lowBattery ? 0.5 : 1,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <strong>Animations</strong>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                                Smooth transitions
                            </div>
                        </div>
                        <div
                            style={{
                                padding: '5px 15px',
                                background: lowBattery ? '#fee2e2' : '#d1fae5',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: lowBattery ? '#dc2626' : '#059669',
                            }}
                        >
                            {lowBattery ? 'REDUCED' : 'ENABLED'}
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        padding: '15px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        opacity: lowBattery ? 0.5 : 1,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <strong>Background Sync</strong>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                                Auto-refresh data
                            </div>
                        </div>
                        <div
                            style={{
                                padding: '5px 15px',
                                background: lowBattery ? '#fee2e2' : '#d1fae5',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: lowBattery ? '#dc2626' : '#059669',
                            }}
                        >
                            {lowBattery ? 'PAUSED' : 'ACTIVE'}
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        padding: '15px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <strong>Dark Theme</strong>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                                Reduce screen power
                            </div>
                        </div>
                        <div
                            style={{
                                padding: '5px 15px',
                                background: lowBattery ? '#d1fae5' : '#e5e7eb',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: lowBattery ? '#059669' : '#6b7280',
                            }}
                        >
                            {lowBattery ? 'AUTO-ON' : 'MANUAL'}
                        </div>
                    </div>
                </div>
            </div>

            <div
                style={{
                    marginTop: '20px',
                    padding: '15px',
                    background: '#eff6ff',
                    borderRadius: '8px',
                    fontSize: '14px',
                }}
            >
                💡 <strong>Tip:</strong> Try disconnecting your charger to see
                power-saving features activate automatically.
            </div>
        </div>
    )
}

export const PowerSavingMode: Story = {
    render: () => <PowerSavingModeDemo />,
}

const BatteryMonitorDemo = () => {
    const {
        level,
        charging,
        chargingTime,
        dischargingTime,
        isSupported,
        loading,
    } = useBattery()
    const [history, setHistory] = React.useState<
        Array<{ time: string; level: number; charging: boolean }>
    >([])

    React.useEffect(() => {
        if (!loading && isSupported) {
            const entry = {
                time: new Date().toLocaleTimeString(),
                level: Math.round(level * 100),
                charging,
            }
            setHistory((prev) => [entry, ...prev.slice(0, 9)])
        }
    }, [level, charging, isSupported, loading])

    if (loading || !isSupported) {
        return (
            <div style={{ padding: '20px' }}>
                {loading ? 'Loading...' : 'Battery API not supported'}
            </div>
        )
    }

    return (
        <div style={{ padding: '20px' }}>
            <h3>Battery Monitor</h3>
            <p>Track battery changes over time</p>

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
                        padding: '20px',
                        background:
                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '12px',
                        color: 'white',
                    }}
                >
                    <div
                        style={{
                            fontSize: '14px',
                            opacity: 0.9,
                            marginBottom: '10px',
                        }}
                    >
                        Current Level
                    </div>
                    <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
                        {Math.round(level * 100)}%
                    </div>
                    <div
                        style={{
                            fontSize: '14px',
                            opacity: 0.9,
                            marginTop: '10px',
                        }}
                    >
                        {charging ? '⚡ Charging' : '🔋 Discharging'}
                    </div>
                </div>

                <div
                    style={{
                        padding: '20px',
                        background:
                            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        borderRadius: '12px',
                        color: 'white',
                    }}
                >
                    <div
                        style={{
                            fontSize: '14px',
                            opacity: 0.9,
                            marginBottom: '10px',
                        }}
                    >
                        {charging ? 'Charging Time' : 'Time Remaining'}
                    </div>
                    <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
                        {charging
                            ? chargingTime === 0 || chargingTime === Infinity
                                ? '?'
                                : Math.floor(chargingTime / 60)
                            : dischargingTime === Infinity
                            ? '?'
                            : Math.floor(dischargingTime / 60)}
                    </div>
                    <div
                        style={{
                            fontSize: '14px',
                            opacity: 0.9,
                            marginTop: '10px',
                        }}
                    >
                        minutes
                    </div>
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
                <strong>Battery History</strong>
                <div style={{ marginTop: '15px' }}>
                    {history.length === 0 ? (
                        <div
                            style={{
                                padding: '20px',
                                textAlign: 'center',
                                color: '#9ca3af',
                            }}
                        >
                            Waiting for battery changes...
                        </div>
                    ) : (
                        history.map((entry, idx) => (
                            <div
                                key={idx}
                                style={{
                                    padding: '12px',
                                    background:
                                        idx === 0 ? '#eff6ff' : 'transparent',
                                    borderRadius: '6px',
                                    marginBottom: '5px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: 'monospace',
                                        fontSize: '14px',
                                    }}
                                >
                                    {entry.time}
                                </span>
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '15px',
                                        alignItems: 'center',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontWeight: 'bold',
                                            color:
                                                entry.level < 20
                                                    ? '#ef4444'
                                                    : '#3b82f6',
                                        }}
                                    >
                                        {entry.level}%
                                    </span>
                                    <span style={{ fontSize: '18px' }}>
                                        {entry.charging ? '⚡' : '🔋'}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export const BatteryMonitor: Story = {
    render: () => <BatteryMonitorDemo />,
}
