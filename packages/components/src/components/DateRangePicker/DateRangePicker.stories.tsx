import React from 'react'
import DateRangePicker from './DateRangePicker'

export default {
    title: 'Components/DateRangePicker',
    component: DateRangePicker,
}

export const Default = () => <DateRangePicker label="Trip dates" />

export const WithValue = () => (
    <DateRangePicker
        label="Booking"
        value={{ start: new Date(2025, 5, 10), end: new Date(2025, 5, 20) }}
    />
)

export const ISOFormat = () => (
    <DateRangePicker label="Period" dateFormat="YYYY-MM-DD" />
)

export const Sizes = () => (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end' }}>
        <DateRangePicker size="small" label="Small" />
        <DateRangePicker size="medium" label="Medium" />
        <DateRangePicker size="large" label="Large" />
    </div>
)

export const WithError = () => (
    <DateRangePicker label="Dates" error="Date range is required" required />
)

export const Disabled = () => (
    <DateRangePicker
        label="Locked"
        defaultValue={{
            start: new Date(2025, 0, 1),
            end: new Date(2025, 0, 7),
        }}
        disabled
    />
)
