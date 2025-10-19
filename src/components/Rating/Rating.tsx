import React, { useState, forwardRef } from 'react'
import { classNames } from '../../utility/classnames'
import './Rating.scss'

export type RatingSize = 'small' | 'medium' | 'large'
export type RatingPrecision = 'full' | 'half'

export interface RatingProps {
    /**
     * Current rating value
     */
    value?: number
    /**
     * Maximum rating value
     */
    max?: number
    /**
     * Callback when rating changes
     */
    onChange?: (value: number) => void
    /**
     * Whether the rating is read-only
     */
    readOnly?: boolean
    /**
     * Whether the rating is disabled
     */
    disabled?: boolean
    /**
     * Size of the stars
     */
    size?: RatingSize
    /**
     * Precision of rating (full stars or half stars)
     */
    precision?: RatingPrecision
    /**
     * Show numeric value next to stars
     */
    showValue?: boolean
    /**
     * Custom color for filled stars
     */
    color?: string
    /**
     * Custom className
     */
    className?: string
    /**
     * Name attribute for form integration
     */
    name?: string
    /**
     * ARIA label
     */
    'aria-label'?: string
}

const Rating = forwardRef<HTMLDivElement, RatingProps>(
    (
        {
            value = 0,
            max = 5,
            onChange,
            readOnly = false,
            disabled = false,
            size = 'medium',
            precision = 'full',
            showValue = false,
            color,
            className,
            name,
            'aria-label': ariaLabel,
        },
        ref
    ) => {
        const [hoverValue, setHoverValue] = useState<number | null>(null)

        const isInteractive = !readOnly && !disabled

        const handleClick = (starValue: number) => {
            if (!isInteractive) return
            onChange?.(starValue === value ? 0 : starValue)
        }

        const handleMouseEnter = (starValue: number) => {
            if (!isInteractive) return
            setHoverValue(starValue)
        }

        const handleMouseLeave = () => {
            if (!isInteractive) return
            setHoverValue(null)
        }

        const getStarFillPercentage = (index: number): number => {
            const currentValue = hoverValue !== null ? hoverValue : value
            const starValue = index + 1

            if (currentValue >= starValue) {
                return 100
            } else if (precision === 'half' && currentValue > index) {
                return 50
            }
            return 0
        }

        const handleStarClick = (
            index: number,
            event: React.MouseEvent<HTMLButtonElement>
        ) => {
            if (!isInteractive) return

            let starValue = index + 1

            if (precision === 'half') {
                const rect = event.currentTarget.getBoundingClientRect()
                const isLeftHalf = event.clientX - rect.left < rect.width / 2
                if (isLeftHalf) {
                    starValue = index + 0.5
                }
            }

            handleClick(starValue)
        }

        const handleStarHover = (
            index: number,
            event: React.MouseEvent<HTMLButtonElement>
        ) => {
            if (!isInteractive) return

            let starValue = index + 1

            if (precision === 'half') {
                const rect = event.currentTarget.getBoundingClientRect()
                const isLeftHalf = event.clientX - rect.left < rect.width / 2
                if (isLeftHalf) {
                    starValue = index + 0.5
                }
            }

            handleMouseEnter(starValue)
        }

        const ratingClasses = classNames(
            'rating',
            `rating--${size}`,
            {
                'rating--readonly': readOnly,
                'rating--disabled': disabled,
                'rating--interactive': isInteractive,
            },
            className
        )

        const displayValue = hoverValue !== null ? hoverValue : value

        return (
            <div
                ref={ref}
                className={ratingClasses}
                role="radiogroup"
                aria-label={ariaLabel || 'Rating'}
                style={
                    color
                        ? ({ '--rating-color': color } as React.CSSProperties)
                        : undefined
                }
            >
                <div className="rating__stars" onMouseLeave={handleMouseLeave}>
                    {Array.from({ length: max }, (_, index) => {
                        const fillPercentage = getStarFillPercentage(index)

                        return (
                            <button
                                key={index}
                                type="button"
                                className={classNames('rating__star', {
                                    'rating__star--filled':
                                        fillPercentage === 100,
                                    'rating__star--half': fillPercentage === 50,
                                    'rating__star--empty': fillPercentage === 0,
                                })}
                                onClick={(e) => handleStarClick(index, e)}
                                onMouseMove={(e) => handleStarHover(index, e)}
                                disabled={disabled}
                                aria-label={`${index + 1} ${
                                    index + 1 === 1 ? 'star' : 'stars'
                                }`}
                                role="radio"
                                aria-checked={
                                    value > index && value <= index + 1
                                }
                            >
                                <svg
                                    className="rating__star-bg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                                {fillPercentage > 0 && (
                                    <svg
                                        className="rating__star-fill"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        style={{
                                            clipPath:
                                                fillPercentage === 50
                                                    ? 'inset(0 50% 0 0)'
                                                    : undefined,
                                        }}
                                    >
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                )}
                            </button>
                        )
                    })}
                </div>
                {showValue && (
                    <span className="rating__value">
                        {displayValue.toFixed(precision === 'half' ? 1 : 0)}
                    </span>
                )}
                {name && <input type="hidden" name={name} value={value} />}
            </div>
        )
    }
)

Rating.displayName = 'Rating'

export default Rating
