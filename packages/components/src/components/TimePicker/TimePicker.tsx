import React, { forwardRef, useCallback, useRef, useState } from 'react'
import { classNames } from '../../utility/classnames'
import './TimePicker.scss'

export type TimePickerSize = 'small' | 'medium' | 'large'
export type TimeFormat = '12h' | '24h'

export interface TimeValue {
    hours: number
    minutes: number
}

export interface TimePickerProps
    extends Omit<
        React.HTMLAttributes<HTMLDivElement>,
        'onChange' | 'defaultValue'
    > {
    /** Current time value (controlled) */
    value?: TimeValue
    /** Default time (uncontrolled) */
    defaultValue?: TimeValue
    /** Callback when time changes */
    onChange?: (time: TimeValue) => void
    /** 12-hour or 24-hour format */
    format?: TimeFormat
    /** Minute step interval */
    minuteStep?: number
    /** Label text */
    label?: string
    /** Placeholder text */
    placeholder?: string
    /** Error message */
    error?: string
    /** Size variant */
    size?: TimePickerSize
    /** Whether the input is disabled */
    disabled?: boolean
    /** Whether the field is required */
    required?: boolean
    /** Min selectable time */
    minTime?: TimeValue
    /** Max selectable time */
    maxTime?: TimeValue
}

function pad(n: number): string {
    return n.toString().padStart(2, '0')
}

function formatTime(time: TimeValue, format: TimeFormat): string {
    if (format === '24h') {
        return `${pad(time.hours)}:${pad(time.minutes)}`
    }
    const period = time.hours >= 12 ? 'PM' : 'AM'
    const h12 = time.hours % 12 || 12
    return `${pad(h12)}:${pad(time.minutes)} ${period}`
}

function timeToMinutes(t: TimeValue): number {
    return t.hours * 60 + t.minutes
}

const ClockIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
)

const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
    (
        {
            value: controlledValue,
            defaultValue,
            onChange,
            format = '24h',
            minuteStep = 1,
            label,
            placeholder = 'Select time',
            error,
            size = 'medium',
            disabled = false,
            required = false,
            minTime,
            maxTime,
            className,
            ...rest
        },
        ref
    ) => {
        const isControlled = controlledValue !== undefined
        const [internalValue, setInternalValue] = useState<
            TimeValue | undefined
        >(defaultValue)
        const current = isControlled ? controlledValue : internalValue

        const [isOpen, setIsOpen] = useState(false)
        const containerRef = useRef<HTMLDivElement>(null)

        const setValue = useCallback(
            (time: TimeValue) => {
                if (!isControlled) setInternalValue(time)
                onChange?.(time)
            },
            [isControlled, onChange]
        )

        const isTimeDisabled = useCallback(
            (t: TimeValue): boolean => {
                const mins = timeToMinutes(t)
                if (minTime && mins < timeToMinutes(minTime)) return true
                if (maxTime && mins > timeToMinutes(maxTime)) return true
                return false
            },
            [minTime, maxTime]
        )

        // Close on outside click
        React.useEffect(() => {
            if (!isOpen) return
            const handleClickOutside = (e: MouseEvent) => {
                if (
                    containerRef.current &&
                    !containerRef.current.contains(e.target as Node)
                ) {
                    setIsOpen(false)
                }
            }
            document.addEventListener('mousedown', handleClickOutside)
            return () =>
                document.removeEventListener('mousedown', handleClickOutside)
        }, [isOpen])

        // Generate hour options
        const hours = Array.from(
            { length: format === '24h' ? 24 : 12 },
            (_, i) => (format === '24h' ? i : i + 1)
        )

        // Generate minute options
        const minutes: number[] = []
        for (let m = 0; m < 60; m += minuteStep) {
            minutes.push(m)
        }

        const handleHourSelect = (h: number) => {
            let hour = h
            if (format === '12h' && current) {
                // Preserve AM/PM
                const wasPM = current.hours >= 12
                if (wasPM && h !== 12) hour = h + 12
                else if (!wasPM && h === 12) hour = 0
            }
            const newTime = { hours: hour, minutes: current?.minutes ?? 0 }
            if (!isTimeDisabled(newTime)) setValue(newTime)
        }

        const handleMinuteSelect = (m: number) => {
            const newTime = { hours: current?.hours ?? 0, minutes: m }
            if (!isTimeDisabled(newTime)) setValue(newTime)
        }

        const handlePeriodToggle = () => {
            if (!current) return
            const newHours =
                current.hours >= 12 ? current.hours - 12 : current.hours + 12
            const newTime = { hours: newHours, minutes: current.minutes }
            if (!isTimeDisabled(newTime)) setValue(newTime)
        }

        const handleClear = (e: React.MouseEvent) => {
            e.stopPropagation()
            if (!isControlled) setInternalValue(undefined)
            onChange?.(undefined as unknown as TimeValue)
            setIsOpen(false)
        }

        const displayValue = current ? formatTime(current, format) : ''

        return (
            <div
                ref={(node) => {
                    ;(
                        containerRef as React.MutableRefObject<HTMLDivElement | null>
                    ).current = node
                    if (typeof ref === 'function') ref(node)
                    else if (ref)
                        (
                            ref as React.MutableRefObject<HTMLDivElement | null>
                        ).current = node
                }}
                className={classNames(
                    'timepicker',
                    `timepicker--${size}`,
                    disabled && 'timepicker--disabled',
                    error && 'timepicker--error',
                    isOpen && 'timepicker--open',
                    className
                )}
                {...rest}
            >
                {label && (
                    <label className="timepicker__label">
                        {label}
                        {required && (
                            <span className="timepicker__required">*</span>
                        )}
                    </label>
                )}
                <div
                    className="timepicker__input-wrapper"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                >
                    <input
                        type="text"
                        className="timepicker__input"
                        value={displayValue}
                        placeholder={placeholder}
                        readOnly
                        disabled={disabled}
                        aria-label={label || 'Time picker'}
                        aria-required={required}
                        aria-invalid={!!error}
                    />
                    <div className="timepicker__icons">
                        {current && !disabled && (
                            <button
                                type="button"
                                className="timepicker__clear"
                                onClick={handleClear}
                                aria-label="Clear time"
                            >
                                ✕
                            </button>
                        )}
                        <span className="timepicker__clock-icon">
                            <ClockIcon />
                        </span>
                    </div>
                </div>
                {isOpen && (
                    <div className="timepicker__dropdown" role="listbox">
                        <div className="timepicker__columns">
                            <div
                                className="timepicker__column"
                                role="group"
                                aria-label="Hours"
                            >
                                <div className="timepicker__column-header">
                                    Hr
                                </div>
                                <div className="timepicker__scroll">
                                    {hours.map((h) => {
                                        const isSelected =
                                            current &&
                                            (format === '24h'
                                                ? current.hours === h
                                                : current.hours % 12 ===
                                                      h % 12 ||
                                                  (h === 12 &&
                                                      current.hours % 12 === 0))
                                        return (
                                            <button
                                                key={h}
                                                type="button"
                                                className={classNames(
                                                    'timepicker__option',
                                                    isSelected &&
                                                        'timepicker__option--selected'
                                                )}
                                                onClick={() =>
                                                    handleHourSelect(h)
                                                }
                                                role="option"
                                                aria-selected={!!isSelected}
                                            >
                                                {pad(h)}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                            <div
                                className="timepicker__column"
                                role="group"
                                aria-label="Minutes"
                            >
                                <div className="timepicker__column-header">
                                    Min
                                </div>
                                <div className="timepicker__scroll">
                                    {minutes.map((m) => {
                                        const isSelected =
                                            current && current.minutes === m
                                        return (
                                            <button
                                                key={m}
                                                type="button"
                                                className={classNames(
                                                    'timepicker__option',
                                                    isSelected &&
                                                        'timepicker__option--selected'
                                                )}
                                                onClick={() =>
                                                    handleMinuteSelect(m)
                                                }
                                                role="option"
                                                aria-selected={!!isSelected}
                                            >
                                                {pad(m)}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                            {format === '12h' && (
                                <div
                                    className="timepicker__column timepicker__column--period"
                                    role="group"
                                    aria-label="Period"
                                >
                                    <div className="timepicker__column-header">
                                        &nbsp;
                                    </div>
                                    <div className="timepicker__scroll">
                                        <button
                                            type="button"
                                            className={classNames(
                                                'timepicker__option',
                                                current &&
                                                    current.hours < 12 &&
                                                    'timepicker__option--selected'
                                            )}
                                            onClick={() => {
                                                if (
                                                    current &&
                                                    current.hours >= 12
                                                )
                                                    handlePeriodToggle()
                                            }}
                                            role="option"
                                            aria-selected={
                                                !!current && current.hours < 12
                                            }
                                        >
                                            AM
                                        </button>
                                        <button
                                            type="button"
                                            className={classNames(
                                                'timepicker__option',
                                                current &&
                                                    current.hours >= 12 &&
                                                    'timepicker__option--selected'
                                            )}
                                            onClick={() => {
                                                if (
                                                    current &&
                                                    current.hours < 12
                                                )
                                                    handlePeriodToggle()
                                            }}
                                            role="option"
                                            aria-selected={
                                                !!current && current.hours >= 12
                                            }
                                        >
                                            PM
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {error && (
                    <span className="timepicker__error" role="alert">
                        {error}
                    </span>
                )}
            </div>
        )
    }
)

TimePicker.displayName = 'TimePicker'
export default TimePicker
