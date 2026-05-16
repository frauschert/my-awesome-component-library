import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { DatePicker } from './DatePicker'

const meta: Meta<typeof DatePicker> = {
    title: 'Components/DatePicker',
    component: DatePicker,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DatePicker>

const DatePickerWrapper = (args: any) => {
    const [date, setDate] = useState<Date | undefined>(args.value)

    return (
        <div style={{ minHeight: '400px' }}>
            <DatePicker {...args} value={date} onChange={setDate} />
            {date && (
                <div
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem',
                        backgroundColor: 'var(--theme-bg-secondary, #f5f5f5)',
                        borderRadius: '4px',
                        color: 'var(--theme-text-primary, #000000)',
                    }}
                >
                    <strong>Selected:</strong> {date.toDateString()}
                </div>
            )}
        </div>
    )
}

export const Default: Story = {
    render: (args) => <DatePickerWrapper {...args} />,
    args: {
        label: 'Select a date',
        placeholder: 'Choose date',
    },
}

export const WithDefaultValue: Story = {
    render: (args) => <DatePickerWrapper {...args} />,
    args: {
        label: 'Birth date',
        value: new Date(1990, 0, 15),
    },
}

export const WithHelperText: Story = {
    render: (args) => <DatePickerWrapper {...args} />,
    args: {
        label: 'Appointment date',
        helperText: 'Choose your preferred appointment date',
    },
}

export const Required: Story = {
    render: (args) => <DatePickerWrapper {...args} />,
    args: {
        label: 'Start date',
        required: true,
        placeholder: 'Required field',
    },
}

export const WithError: Story = {
    render: (args) => <DatePickerWrapper {...args} />,
    args: {
        label: 'Event date',
        error: 'Please select a valid date',
    },
}

export const Disabled: Story = {
    render: (args) => <DatePickerWrapper {...args} />,
    args: {
        label: 'Disabled date picker',
        value: new Date(),
        disabled: true,
    },
}

export const WithMinDate: Story = {
    render: (args) => <DatePickerWrapper {...args} />,
    args: {
        label: 'Future date only',
        minDate: new Date(),
        helperText: 'You can only select dates from today onwards',
    },
}

export const WithMaxDate: Story = {
    render: (args) => <DatePickerWrapper {...args} />,
    args: {
        label: 'Past date only',
        maxDate: new Date(),
        helperText: 'You can only select dates up to today',
    },
}

export const WithDateRange: Story = {
    render: (args) => <DatePickerWrapper {...args} />,
    args: {
        label: 'Date within range',
        minDate: new Date(2024, 0, 1),
        maxDate: new Date(2024, 11, 31),
        helperText: 'Select a date in 2024',
    },
}

export const SmallSize: Story = {
    render: (args) => <DatePickerWrapper {...args} />,
    args: {
        label: 'Small date picker',
        size: 'small',
    },
}

export const LargeSize: Story = {
    render: (args) => <DatePickerWrapper {...args} />,
    args: {
        label: 'Large date picker',
        size: 'large',
    },
}

export const FormatDDMMYYYY: Story = {
    render: (args) => <DatePickerWrapper {...args} />,
    args: {
        label: 'European format (DD/MM/YYYY)',
        dateFormat: 'DD/MM/YYYY',
        value: new Date(),
    },
}

export const FormatYYYYMMDD: Story = {
    render: (args) => <DatePickerWrapper {...args} />,
    args: {
        label: 'ISO format (YYYY-MM-DD)',
        dateFormat: 'YYYY-MM-DD',
        value: new Date(),
    },
}

export const BookingForm: Story = {
    render: () => {
        const [checkIn, setCheckIn] = useState<Date | undefined>()
        const [checkOut, setCheckOut] = useState<Date | undefined>()

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        return (
            <div style={{ maxWidth: '400px', minHeight: '500px' }}>
                <h2
                    style={{
                        marginBottom: '1.5rem',
                        color: 'var(--theme-text-primary)',
                    }}
                >
                    Book Your Stay
                </h2>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                    }}
                >
                    <DatePicker
                        label="Check-in Date"
                        value={checkIn}
                        onChange={(date) => {
                            setCheckIn(date || undefined)
                            // Clear check-out if it's before new check-in
                            if (date && checkOut && checkOut < date) {
                                setCheckOut(undefined)
                            }
                        }}
                        minDate={today}
                        required
                        helperText="Select your arrival date"
                    />
                    <DatePicker
                        label="Check-out Date"
                        value={checkOut}
                        onChange={(date) => setCheckOut(date || undefined)}
                        minDate={checkIn || today}
                        required
                        helperText="Select your departure date"
                        disabled={!checkIn}
                    />
                </div>
                {checkIn && checkOut && (
                    <div
                        style={{
                            marginTop: '1.5rem',
                            padding: '1rem',
                            backgroundColor:
                                'var(--theme-bg-secondary, #f5f5f5)',
                            borderRadius: '4px',
                            color: 'var(--theme-text-primary, #000000)',
                        }}
                    >
                        <strong>Booking Summary:</strong>
                        <div
                            style={{
                                marginTop: '0.5rem',
                                fontSize: '0.875rem',
                            }}
                        >
                            <div>Check-in: {checkIn.toLocaleDateString()}</div>
                            <div>
                                Check-out: {checkOut.toLocaleDateString()}
                            </div>
                            <div
                                style={{ marginTop: '0.5rem', fontWeight: 600 }}
                            >
                                Total nights:{' '}
                                {Math.ceil(
                                    (checkOut.getTime() - checkIn.getTime()) /
                                        (1000 * 60 * 60 * 24)
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    },
}
