import React, { useRef, useEffect } from 'react'
import { classNames } from '../../utility/classnames'
import './LaserSpinner.scss'

export interface LaserSpinnerProps {
    /** Size of the spinner */
    size?: 'sm' | 'md' | 'lg' | 'xl'
    /** Welding effect theme */
    variant?: 'primary' | 'hot' | 'electric' | 'plasma'
    /** Number of spark trails */
    sparks?: number
    /** Animation speed (ms for one rotation) */
    speed?: number
    /** Show intense center glow effect */
    showGlow?: boolean
    /** Loading text to display */
    label?: string
    /** Additional class name */
    className?: string
}

/**
 * LaserSpinner - An animated loading spinner with welding spark effect
 *
 * Features:
 * - Flying sparks with trails and particles
 * - Intense welding glow and light bloom
 * - Random spark animations
 * - Hot metal center effect
 * - Responsive sizing
 * - Pure CSS animations
 *
 * @example
 * ```tsx
 * <LaserSpinner variant="hot" size="lg" />
 * <LaserSpinner variant="electric" sparks={12} speed={1500} />
 * <LaserSpinner variant="plasma" label="Welding..." showGlow />
 * ```
 */
export const LaserSpinner: React.FC<LaserSpinnerProps> = ({
    size = 'md',
    variant = 'hot',
    sparks = 8,
    speed = 1200,
    showGlow = true,
    label,
    className,
}) => {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.style.setProperty(
                '--laser-spinner-speed',
                `${speed}ms`
            )
        }
    }, [speed])

    // Generate sparks with random trajectories
    const renderSparks = () => {
        return Array.from({ length: sparks }, (_, index) => {
            const rotation = (360 / sparks) * index
            const randomDelay = (index * 100) % speed
            const randomDuration = 800 + ((index * 200) % 600)

            return (
                <div
                    key={index}
                    className="laser-spinner__spark-container"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        animationDelay: `${randomDelay}ms`,
                    }}
                >
                    <div
                        className="laser-spinner__spark"
                        style={{
                            animationDuration: `${randomDuration}ms`,
                        }}
                    >
                        <div className="laser-spinner__spark-core" />
                        <div className="laser-spinner__spark-trail" />
                        <div className="laser-spinner__spark-particle" />
                    </div>
                </div>
            )
        })
    }

    return (
        <div
            ref={containerRef}
            className={classNames(
                'laser-spinner',
                `laser-spinner--${size}`,
                `laser-spinner--${variant}`,
                showGlow && 'laser-spinner--glow',
                className
            )}
            role="status"
            aria-live="polite"
            aria-label={label || 'Loading'}
        >
            <div className="laser-spinner__ring">
                {showGlow && (
                    <>
                        <div className="laser-spinner__glow" />
                        <div className="laser-spinner__bloom" />
                    </>
                )}
                <div className="laser-spinner__center">
                    <div className="laser-spinner__hotspot" />
                </div>
                <div className="laser-spinner__sparks">{renderSparks()}</div>
            </div>
            {label && <div className="laser-spinner__label">{label}</div>}
        </div>
    )
}

export default LaserSpinner
