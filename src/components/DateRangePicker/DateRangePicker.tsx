import React, { useState, useRef, useEffect, useCallback } from 'react'
import { classNames } from '../../utility/classnames'
import './DateRangePicker.scss'

export interface DateRange {
    start: Date | null
    end: Date | null
}

export type DateRangePickerSize = 'small' | 'medium' | 'large'

export interface DateRangePickerProps {
    /** Selected date range (controlled) */
    value?: DateRange
    /** Default date range (uncontrolled) */
    defaultValue?: DateRange
    /** Callback when range changes */
    onChange?: (range: DateRange) => void
    /** Minimum selectable date */
    minDate?: Date
    /** Maximum selectable date */
    maxDate?: Date
    /** Placeholder text */
    placeholder?: string
    /** Label for the input */
    label?: string
    /** Error message */
    error?: string
    /** Whether the field is required */
    required?: boolean
    /** Whether the field is disabled */
    disabled?: boolean
    /** Input size */
    size?: DateRangePickerSize
    /** Custom className */
    className?: string
    /** Date format */
    dateFormat?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear()
    )
}

function formatSingleDate(date: Date, fmt: string): string {
    const d = date.getDate().toString().padStart(2, '0')
    const m = (date.getMonth() + 1).toString().padStart(2, '0')
    const y = date.getFullYear()
    if (fmt === 'DD/MM/YYYY') return `${d}/${m}/${y}`
    if (fmt === 'YYYY-MM-DD') return `${y}-${m}-${d}`
    return `${m}/${d}/${y}`
}

function getDaysInMonth(year: number, month: number): Date[] {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDow = firstDay.getDay()
    const days: Date[] = []

    const prevLast = new Date(year, month, 0).getDate()
    for (let i = startDow - 1; i >= 0; i--) {
        days.push(new Date(year, month - 1, prevLast - i))
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i))
    }
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
        days.push(new Date(year, month + 1, i))
    }
    return days
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
    value: controlledValue,
    defaultValue = { start: null, end: null },
    onChange,
    minDate,
    maxDate,
    placeholder = 'Select date range',
    label,
    error,
    required = false,
    disabled = false,
    size = 'medium',
    className,
    dateFormat = 'MM/DD/YYYY',
}) => {
    const isControlled = controlledValue !== undefined
    const [internalRange, setInternalRange] = useState<DateRange>(defaultValue)
    const range = isControlled ? controlledValue : internalRange

    const [isOpen, setIsOpen] = useState(false)
    const [leftMonth, setLeftMonth] = useState(range.start || new Date())
    const [hovered, setHovered] = useState<Date | null>(null)
    // Selection phase: 'start' means waiting for start date, 'end' means waiting for end date
    const [phase, setPhase] = useState<'start' | 'end'>(
        range.start && !range.end ? 'end' : 'start'
    )

    const containerRef = useRef<HTMLDivElement>(null)

    const rightMonth = new Date(
        leftMonth.getFullYear(),
        leftMonth.getMonth() + 1,
        1
    )

    useEffect(() => {
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

    const setRange = useCallback(
        (r: DateRange) => {
            if (!isControlled) setInternalRange(r)
            onChange?.(r)
        },
        [isControlled, onChange]
    )

    const isDateDisabled = (date: Date): boolean => {
        if (minDate && date < minDate) return true
        if (maxDate && date > maxDate) return true
        return false
    }

    const handleDayClick = (date: Date) => {
        if (isDateDisabled(date)) return

        if (phase === 'start') {
            setRange({ start: date, end: null })
            setPhase('end')
        } else {
            // phase === 'end'
            if (range.start && date < range.start) {
                // Clicked before start — restart
                setRange({ start: date, end: null })
                setPhase('end')
            } else {
                setRange({ start: range.start, end: date })
                setPhase('start')
                setIsOpen(false)
            }
        }
    }

    const isInRange = (date: Date): boolean => {
        const { start, end } = range
        const effectiveEnd = end || hovered
        if (!start || !effectiveEnd) return false
        const lo = start < effectiveEnd ? start : effectiveEnd
        const hi = start < effectiveEnd ? effectiveEnd : start
        return date > lo && date < hi
    }

    const isRangeStart = (date: Date): boolean =>
        !!range.start && isSameDay(date, range.start)

    const isRangeEnd = (date: Date): boolean => {
        if (range.end) return isSameDay(date, range.end)
        if (hovered && range.start && hovered >= range.start)
            return isSameDay(date, hovered)
        return false
    }

    const handlePrevMonth = () => {
        setLeftMonth(
            new Date(leftMonth.getFullYear(), leftMonth.getMonth() - 1, 1)
        )
    }

    const handleNextMonth = () => {
        setLeftMonth(
            new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1, 1)
        )
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        setRange({ start: null, end: null })
        setPhase('start')
    }

    const displayValue = (() => {
        if (range.start && range.end) {
            return `${formatSingleDate(
                range.start,
                dateFormat
            )} – ${formatSingleDate(range.end, dateFormat)}`
        }
        if (range.start) {
            return `${formatSingleDate(range.start, dateFormat)} – …`
        }
        return ''
    })()

    const renderCalendar = (monthDate: Date) => {
        const days = getDaysInMonth(
            monthDate.getFullYear(),
            monthDate.getMonth()
        )
        return (
            <div className="daterangepicker__calendar">
                <div className="daterangepicker__month-title">
                    {MONTHS[monthDate.getMonth()]} {monthDate.getFullYear()}
                </div>
                <div className="daterangepicker__weekdays">
                    {DAYS.map((d) => (
                        <div key={d} className="daterangepicker__weekday">
                            {d}
                        </div>
                    ))}
                </div>
                <div className="daterangepicker__days">
                    {days.map((day, idx) => {
                        const isCurrentMonth =
                            day.getMonth() === monthDate.getMonth()
                        const disabledDay = isDateDisabled(day)
                        const today = isSameDay(day, new Date())
                        const selected = isRangeStart(day) || isRangeEnd(day)
                        const inRange = isInRange(day)

                        return (
                            <button
                                key={idx}
                                type="button"
                                className={classNames('daterangepicker__day', {
                                    'daterangepicker__day--other-month':
                                        !isCurrentMonth,
                                    'daterangepicker__day--selected': selected,
                                    'daterangepicker__day--in-range': inRange,
                                    'daterangepicker__day--range-start':
                                        isRangeStart(day),
                                    'daterangepicker__day--range-end':
                                        isRangeEnd(day),
                                    'daterangepicker__day--today': today,
                                    'daterangepicker__day--disabled':
                                        disabledDay,
                                })}
                                disabled={disabledDay}
                                onClick={() => handleDayClick(day)}
                                onMouseEnter={() =>
                                    phase === 'end' && setHovered(day)
                                }
                                aria-label={formatSingleDate(day, dateFormat)}
                            >
                                {day.getDate()}
                            </button>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className={classNames(
                'daterangepicker',
                `daterangepicker--${size}`,
                disabled && 'daterangepicker--disabled',
                error && 'daterangepicker--error',
                isOpen && 'daterangepicker--open',
                className
            )}
        >
            {label && (
                <label className="daterangepicker__label">
                    {label}
                    {required && (
                        <span className="daterangepicker__required">*</span>
                    )}
                </label>
            )}
            <div
                className="daterangepicker__input-wrapper"
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <input
                    type="text"
                    className="daterangepicker__input"
                    value={displayValue}
                    placeholder={placeholder}
                    readOnly
                    disabled={disabled}
                    aria-label={label || 'Date range picker'}
                    aria-required={required}
                    aria-invalid={!!error}
                />
                <div className="daterangepicker__icons">
                    {(range.start || range.end) && !disabled && (
                        <button
                            type="button"
                            className="daterangepicker__clear"
                            onClick={handleClear}
                            aria-label="Clear date range"
                        >
                            ✕
                        </button>
                    )}
                    <span className="daterangepicker__calendar-icon">📅</span>
                </div>
            </div>
            {isOpen && (
                <div
                    className="daterangepicker__dropdown"
                    onMouseLeave={() => setHovered(null)}
                >
                    <div className="daterangepicker__header">
                        <button
                            type="button"
                            className="daterangepicker__nav-button"
                            onClick={handlePrevMonth}
                            aria-label="Previous month"
                        >
                            ‹
                        </button>
                        <div className="daterangepicker__header-spacer" />
                        <button
                            type="button"
                            className="daterangepicker__nav-button"
                            onClick={handleNextMonth}
                            aria-label="Next month"
                        >
                            ›
                        </button>
                    </div>
                    <div className="daterangepicker__calendars">
                        {renderCalendar(leftMonth)}
                        {renderCalendar(rightMonth)}
                    </div>
                </div>
            )}
            {error && (
                <span className="daterangepicker__error" role="alert">
                    {error}
                </span>
            )}
        </div>
    )
}

DateRangePicker.displayName = 'DateRangePicker'
export default DateRangePicker
