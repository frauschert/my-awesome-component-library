import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { classNames } from '../../utility/classnames'
import './FloatingIsland.scss'

export interface FloatingIslandProps
    extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Content to display inside the floating island
     */
    children: React.ReactNode
    /**
     * Visual variant of the island
     * @default 'default'
     */
    variant?: 'default' | 'gradient' | 'glassmorphism' | 'neon'
    /**
     * Size of the island
     * @default 'medium'
     */
    size?: 'small' | 'medium' | 'large' | 'xlarge'
    /**
     * Animation style
     * @default 'float'
     */
    animation?: 'float' | 'pulse' | 'hover-lift' | 'none'
    /**
     * Whether the island has a glow effect
     * @default false
     */
    glow?: boolean
    /**
     * Whether the island follows mouse movement (parallax effect)
     * @default false
     */
    interactive?: boolean
    /**
     * Intensity of the interactive effect (0-1)
     * @default 0.5
     */
    interactiveIntensity?: number
    /**
     * Whether to show floating particles around the island
     * @default false
     */
    particles?: boolean
    /**
     * Number of particles (if particles is true)
     * @default 8
     */
    particleCount?: number
    /**
     * Custom className for additional styling
     */
    className?: string
    /**
     * Whether the island is elevated (stronger shadow)
     * @default false
     */
    elevated?: boolean
    /**
     * Blur intensity for glassmorphism variant (px)
     * @default 10
     */
    blurIntensity?: number
}

export const FloatingIsland = forwardRef<HTMLDivElement, FloatingIslandProps>(
    (
        {
            children,
            variant = 'default',
            size = 'medium',
            animation = 'float',
            glow = false,
            interactive = false,
            interactiveIntensity = 0.5,
            particles = false,
            particleCount = 8,
            className,
            elevated = false,
            blurIntensity = 10,
            style,
            ...rest
        },
        ref
    ) => {
        const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
        const islandRef = useRef<HTMLDivElement>(null)
        const animationFrameRef = useRef<number | null>(null)

        useEffect(() => {
            if (!interactive) return

            const handleMouseMove = (e: MouseEvent) => {
                if (!islandRef.current) return

                const rect = islandRef.current.getBoundingClientRect()
                const centerX = rect.left + rect.width / 2
                const centerY = rect.top + rect.height / 2

                const deltaX = (e.clientX - centerX) / rect.width
                const deltaY = (e.clientY - centerY) / rect.height

                // Smooth animation using requestAnimationFrame
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current)
                }

                animationFrameRef.current = requestAnimationFrame(() => {
                    setMousePosition({
                        x: deltaX * interactiveIntensity * 30,
                        y: deltaY * interactiveIntensity * 30,
                    })
                })
            }

            const handleMouseLeave = () => {
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current)
                }
                animationFrameRef.current = requestAnimationFrame(() => {
                    setMousePosition({ x: 0, y: 0 })
                })
            }

            const element = islandRef.current
            if (element) {
                element.addEventListener('mousemove', handleMouseMove)
                element.addEventListener('mouseleave', handleMouseLeave)

                return () => {
                    element.removeEventListener('mousemove', handleMouseMove)
                    element.removeEventListener('mouseleave', handleMouseLeave)
                    if (animationFrameRef.current) {
                        cancelAnimationFrame(animationFrameRef.current)
                    }
                }
            }
        }, [interactive, interactiveIntensity])

        const classes = classNames(
            'floating-island',
            `floating-island--${variant}`,
            `floating-island--${size}`,
            animation !== 'none' && `floating-island--${animation}`,
            glow && 'floating-island--glow',
            elevated && 'floating-island--elevated',
            interactive && 'floating-island--interactive',
            className
        )

        const combinedStyle: React.CSSProperties = {
            ...style,
            ...(interactive && {
                transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            }),
            ...(variant === 'glassmorphism' && {
                ['--blur-intensity' as string]: `${blurIntensity}px`,
            }),
        }

        const particleElements =
            particles && particleCount > 0
                ? Array.from({ length: particleCount }, (_, i) => (
                      <div
                          key={i}
                          className="floating-island__particle"
                          style={{
                              ['--particle-delay' as string]: `${i * 0.3}s`,
                              ['--particle-angle' as string]: `${
                                  (360 / particleCount) * i
                              }deg`,
                          }}
                      />
                  ))
                : null

        return (
            <div
                ref={(node) => {
                    // Handle both refs
                    islandRef.current = node
                    if (typeof ref === 'function') {
                        ref(node)
                    } else if (ref) {
                        ref.current = node
                    }
                }}
                className={classes}
                style={combinedStyle}
                {...rest}
            >
                <div className="floating-island__content">{children}</div>
                {particles && (
                    <div className="floating-island__particles">
                        {particleElements}
                    </div>
                )}
                {glow && <div className="floating-island__glow" />}
            </div>
        )
    }
)

FloatingIsland.displayName = 'FloatingIsland'

export default FloatingIsland
