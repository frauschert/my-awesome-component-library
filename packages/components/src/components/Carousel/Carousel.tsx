import React, {
    forwardRef,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'
import { classNames } from '../../utility/classnames'
import './Carousel.scss'

export type CarouselSize = 'small' | 'medium' | 'large'

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Slides to render */
    children: React.ReactNode
    /** Auto-play interval in ms (0 = off) */
    autoPlay?: number
    /** Enable infinite looping */
    loop?: boolean
    /** Show navigation arrows */
    showArrows?: boolean
    /** Show dot indicators */
    showDots?: boolean
    /** Starting slide index */
    defaultIndex?: number
    /** Controlled active index */
    activeIndex?: number
    /** Callback when slide changes */
    onSlideChange?: (index: number) => void
    /** Pause auto-play on hover */
    pauseOnHover?: boolean
}

const ChevronLeft = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <polyline points="15 18 9 12 15 6" />
    </svg>
)

const ChevronRight = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <polyline points="9 6 15 12 9 18" />
    </svg>
)

const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
    (
        {
            children,
            autoPlay = 0,
            loop = false,
            showArrows = true,
            showDots = true,
            defaultIndex = 0,
            activeIndex: controlledIndex,
            onSlideChange,
            pauseOnHover = true,
            className,
            ...rest
        },
        ref
    ) => {
        const slides = React.Children.toArray(children)
        const count = slides.length

        const isControlled = controlledIndex !== undefined
        const [internalIndex, setInternalIndex] = useState(defaultIndex)
        const current = isControlled ? controlledIndex : internalIndex
        const pausedRef = useRef(false)

        const goTo = useCallback(
            (index: number) => {
                let next = index
                if (loop) {
                    next = ((index % count) + count) % count
                } else {
                    next = Math.max(0, Math.min(index, count - 1))
                }
                if (!isControlled) setInternalIndex(next)
                onSlideChange?.(next)
            },
            [count, isControlled, loop, onSlideChange]
        )

        const goNext = useCallback(() => goTo(current + 1), [current, goTo])
        const goPrev = useCallback(() => goTo(current - 1), [current, goTo])

        // Keep a ref to the latest goNext for auto-play (avoids stale closures)
        const goNextRef = useRef(goNext)
        useEffect(() => {
            goNextRef.current = goNext
        })

        // Auto-play
        useEffect(() => {
            if (!autoPlay || autoPlay <= 0 || count <= 1) return
            const id = setInterval(() => {
                if (!pausedRef.current) goNextRef.current()
            }, autoPlay)
            return () => clearInterval(id)
        }, [autoPlay, count])

        // Keyboard navigation
        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault()
                goPrev()
            } else if (e.key === 'ArrowRight') {
                e.preventDefault()
                goNext()
            }
        }

        const canPrev = loop || current > 0
        const canNext = loop || current < count - 1

        return (
            <div
                ref={ref}
                className={classNames('carousel', className)}
                role="region"
                aria-roledescription="carousel"
                aria-label="Image carousel"
                onKeyDown={handleKeyDown}
                onMouseEnter={
                    pauseOnHover ? () => (pausedRef.current = true) : undefined
                }
                onMouseLeave={
                    pauseOnHover ? () => (pausedRef.current = false) : undefined
                }
                tabIndex={0}
                {...rest}
            >
                <div
                    className="carousel__track"
                    style={{
                        transform: `translateX(-${current * 100}%)`,
                    }}
                >
                    {slides.map((slide, i) => (
                        <div
                            key={i}
                            className="carousel__slide"
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`Slide ${i + 1} of ${count}`}
                            aria-hidden={i !== current}
                        >
                            {slide}
                        </div>
                    ))}
                </div>

                {showArrows && count > 1 && (
                    <>
                        <button
                            type="button"
                            className="carousel__arrow carousel__arrow--prev"
                            onClick={goPrev}
                            disabled={!canPrev}
                            aria-label="Previous slide"
                        >
                            <ChevronLeft />
                        </button>
                        <button
                            type="button"
                            className="carousel__arrow carousel__arrow--next"
                            onClick={goNext}
                            disabled={!canNext}
                            aria-label="Next slide"
                        >
                            <ChevronRight />
                        </button>
                    </>
                )}

                {showDots && count > 1 && (
                    <div className="carousel__dots" role="tablist">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                className={classNames(
                                    'carousel__dot',
                                    i === current && 'carousel__dot--active'
                                )}
                                role="tab"
                                aria-selected={i === current}
                                aria-label={`Go to slide ${i + 1}`}
                                onClick={() => goTo(i)}
                            />
                        ))}
                    </div>
                )}
            </div>
        )
    }
)

Carousel.displayName = 'Carousel'
export default Carousel
