import React, { forwardRef } from 'react'
import './Pagination.scss'
import { classNames } from '../../utility/classnames'

export type PaginationSize = 'small' | 'medium' | 'large'
export type PaginationVariant = 'default' | 'outlined' | 'filled'

export interface PaginationProps {
    /** Current page (1-based) */
    page: number
    /** Total number of pages */
    totalPages: number
    /** Called when the user selects a different page */
    onPageChange: (page: number) => void
    /** Number of page buttons shown on each side of current page */
    siblingCount?: number
    /** Show first/last page jump buttons */
    showFirstLast?: boolean
    /** Size variant */
    size?: PaginationSize
    /** Visual variant */
    variant?: PaginationVariant
    /** Disable all interactions */
    disabled?: boolean
    /** Additional class name */
    className?: string
}

const DOTS = 'dots' as const

function buildPageRange(
    page: number,
    totalPages: number,
    siblingCount: number
): (number | typeof DOTS)[] {
    const totalPageNumbers = siblingCount * 2 + 5 // siblings + current + 2 boundary + 2 dots

    if (totalPages <= totalPageNumbers) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const leftSibling = Math.max(page - siblingCount, 1)
    const rightSibling = Math.min(page + siblingCount, totalPages)

    const showLeftDots = leftSibling > 2
    const showRightDots = rightSibling < totalPages - 1

    if (!showLeftDots && showRightDots) {
        const leftRange = Array.from(
            { length: 3 + siblingCount * 2 },
            (_, i) => i + 1
        )
        return [...leftRange, DOTS, totalPages]
    }

    if (showLeftDots && !showRightDots) {
        const rightRange = Array.from(
            { length: 3 + siblingCount * 2 },
            (_, i) => totalPages - (3 + siblingCount * 2) + 1 + i
        )
        return [1, DOTS, ...rightRange]
    }

    const middleRange = Array.from(
        { length: rightSibling - leftSibling + 1 },
        (_, i) => leftSibling + i
    )
    return [1, DOTS, ...middleRange, DOTS, totalPages]
}

const Pagination = forwardRef<HTMLElement, PaginationProps>(
    (
        {
            page,
            totalPages,
            onPageChange,
            siblingCount = 1,
            showFirstLast = true,
            size = 'medium',
            variant = 'default',
            disabled = false,
            className,
        },
        ref
    ) => {
        const pageRange = buildPageRange(page, totalPages, siblingCount)

        const handlePage = (p: number) => {
            if (disabled || p < 1 || p > totalPages || p === page) return
            onPageChange(p)
        }

        return (
            <nav
                ref={ref}
                aria-label="Pagination"
                className={classNames(
                    'pagination',
                    `pagination--${size}`,
                    `pagination--${variant}`,
                    { 'pagination--disabled': disabled },
                    className
                )}
            >
                {showFirstLast && (
                    <button
                        className="pagination__btn pagination__btn--first"
                        aria-label="First page"
                        onClick={() => handlePage(1)}
                        disabled={disabled || page === 1}
                    >
                        {'«'}
                    </button>
                )}

                <button
                    className="pagination__btn pagination__btn--prev"
                    aria-label="Previous page"
                    onClick={() => handlePage(page - 1)}
                    disabled={disabled || page === 1}
                >
                    {'‹'}
                </button>

                {pageRange.map((item, i) =>
                    item === DOTS ? (
                        <span
                            key={`dots-${i}`}
                            className="pagination__dots"
                            aria-hidden="true"
                        >
                            {'…'}
                        </span>
                    ) : (
                        <button
                            key={item}
                            className={classNames('pagination__btn', {
                                'pagination__btn--active': item === page,
                            })}
                            aria-label={`Page ${item}`}
                            aria-current={item === page ? 'page' : undefined}
                            onClick={() => handlePage(item)}
                            disabled={disabled}
                        >
                            {item}
                        </button>
                    )
                )}

                <button
                    className="pagination__btn pagination__btn--next"
                    aria-label="Next page"
                    onClick={() => handlePage(page + 1)}
                    disabled={disabled || page === totalPages}
                >
                    {'›'}
                </button>

                {showFirstLast && (
                    <button
                        className="pagination__btn pagination__btn--last"
                        aria-label="Last page"
                        onClick={() => handlePage(totalPages)}
                        disabled={disabled || page === totalPages}
                    >
                        {'»'}
                    </button>
                )}
            </nav>
        )
    }
)

Pagination.displayName = 'Pagination'

export default Pagination
