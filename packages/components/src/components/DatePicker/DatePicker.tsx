import React, { useState, useRef, useEffect } from 'react'
import { classNames } from '../../utility/classnames'
import './DatePicker.scss'

export interface DatePickerProps {
    /** Selected date */
    value?: Date
    /** Callback when date changes */
    onChange?: (date: Date | null) => void
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
    /** Helper text */
    helperText?: string
    /** Whether the field is required */
    required?: boolean
    /** Whether the field is disabled */
    disabled?: boolean
    /** Input size */
    size?: 'small' | 'medium' | 'large'
    /** Custom className */
    className?: string
    /** Date format display (not for parsing) */
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

export const DatePicker: React.FC<DatePickerProps> = ({
    value,
    onChange,
    minDate,
    maxDate,
    placeholder = 'Select date',
    label,
    error,
    helperText,
    required = false,
    disabled = false,
    size = 'medium',
    className,
    dateFormat = 'MM/DD/YYYY',
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(value || new Date())
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () =>
                document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const formatDate = (date: Date | undefined): string => {
        if (!date) return ''

        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()

        switch (dateFormat) {
            case 'DD/MM/YYYY':
                return `${day}/${month}/${year}`
            case 'YYYY-MM-DD':
                return `${year}-${month}-${day}`
            case 'MM/DD/YYYY':
            default:
                return `${month}/${day}/${year}`
        }
    }

    const isSameDay = (date1: Date, date2: Date): boolean => {
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        )
    }

    const isDateDisabled = (date: Date): boolean => {
        if (minDate && date < minDate) return true
        if (maxDate && date > maxDate) return true
        return false
    }

    const getDaysInMonth = (year: number, month: number): Date[] => {
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()

        const days: Date[] = []

        // Previous month days
        const prevMonthLastDay = new Date(year, month, 0).getDate()
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            days.push(new Date(year, month - 1, prevMonthLastDay - i))
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i))
        }

        // Next month days
        const remainingDays = 42 - days.length // 6 rows * 7 days
        for (let i = 1; i <= remainingDays; i++) {
            days.push(new Date(year, month + 1, i))
        }

        return days
    }

    const handleDateSelect = (date: Date) => {
        if (isDateDisabled(date)) return
        onChange?.(date)
        setIsOpen(false)
    }

    const handlePrevMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
        )
    }

    const handleNextMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
        )
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        onChange?.(null)
    }

    const days = getDaysInMonth(
        currentMonth.getFullYear(),
        currentMonth.getMonth()
    )
    const inputId = `datepicker-${Math.random().toString(36).substr(2, 9)}`

    return (
        <div
            ref={containerRef}
            className={classNames(
                'datepicker',
                `datepicker--${size}`,
                {
                    'datepicker--error': !!error,
                    'datepicker--disabled': disabled,
                    'datepicker--open': isOpen,
                },
                className
            )}
        >
            {label && (
                <label htmlFor={inputId} className="datepicker__label">
                    {label}
                    {required && (
                        <span className="datepicker__required">*</span>
                    )}
                </label>
            )}
            <div className="datepicker__input-wrapper">
                <input
                    id={inputId}
                    type="text"
                    className="datepicker__input"
                    value={formatDate(value)}
                    placeholder={placeholder}
                    onFocus={() => !disabled && setIsOpen(true)}
                    readOnly
                    disabled={disabled}
                    aria-label={label || 'Date picker'}
                    aria-required={required}
                    aria-invalid={!!error}
                />
                <div className="datepicker__icons">
                    {value && !disabled && (
                        <button
                            type="button"
                            className="datepicker__clear"
                            onClick={handleClear}
                            aria-label="Clear date"
                        >
                            ✕
                        </button>
                    )}
                    <span className="datepicker__calendar-icon">📅</span>
                </div>
            </div>
            {isOpen && (
                <div className="datepicker__dropdown">
                    <div className="datepicker__header">
                        <button
                            type="button"
                            className="datepicker__nav-button"
                            onClick={handlePrevMonth}
                            aria-label="Previous month"
                        >
                            ‹
                        </button>
                        <div className="datepicker__month-year">
                            {MONTHS[currentMonth.getMonth()]}{' '}
                            {currentMonth.getFullYear()}
                        </div>
                        <button
                            type="button"
                            className="datepicker__nav-button"
                            onClick={handleNextMonth}
                            aria-label="Next month"
                        >
                            ›
                        </button>
                    </div>
                    <div className="datepicker__calendar">
                        <div className="datepicker__weekdays">
                            {DAYS.map((day) => (
                                <div key={day} className="datepicker__weekday">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="datepicker__days">
                            {days.map((day, index) => {
                                const isCurrentMonth =
                                    day.getMonth() === currentMonth.getMonth()
                                const isSelected =
                                    value && isSameDay(day, value)
                                const isToday = isSameDay(day, new Date())
                                const disabled = isDateDisabled(day)

                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        className={classNames(
                                            'datepicker__day',
                                            {
                                                'datepicker__day--other-month':
                                                    !isCurrentMonth,
                                                'datepicker__day--selected':
                                                    isSelected,
                                                'datepicker__day--today':
                                                    isToday,
                                                'datepicker__day--disabled':
                                                    disabled,
                                            }
                                        )}
                                        onClick={() => handleDateSelect(day)}
                                        disabled={disabled}
                                        aria-label={formatDate(day)}
                                    >
                                        {day.getDate()}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
            {error && (
                <div className="datepicker__error" role="alert">
                    {error}
                </div>
            )}
            {helperText && !error && (
                <div className="datepicker__helper-text">{helperText}</div>
            )}
        </div>
    )
}

export default DatePicker
