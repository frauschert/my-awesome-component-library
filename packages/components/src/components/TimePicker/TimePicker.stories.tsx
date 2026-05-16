import React from 'react'
import TimePicker from './TimePicker'

export default {
    title: 'Components/TimePicker',
    component: TimePicker,
}

export const Default = () => <TimePicker label="Time" />

export const WithValue = () => (
    <TimePicker label="Meeting" value={{ hours: 14, minutes: 30 }} />
)

export const TwelveHour = () => (
    <TimePicker
        label="Alarm"
        format="12h"
        defaultValue={{ hours: 7, minutes: 0 }}
    />
)

export const FifteenMinuteStep = () => (
    <TimePicker label="Slot" minuteStep={15} />
)

export const Sizes = () => (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end' }}>
        <TimePicker size="small" label="Small" />
        <TimePicker size="medium" label="Medium" />
        <TimePicker size="large" label="Large" />
    </div>
)

export const WithError = () => (
    <TimePicker label="Deadline" error="Time is required" required />
)

export const Disabled = () => (
    <TimePicker
        label="Locked"
        defaultValue={{ hours: 9, minutes: 0 }}
        disabled
    />
)
