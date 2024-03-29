import React from 'react'
import './progressCircular.css'

type ProgressCircularProps = {
    size?: number
    progress?: number
    trackWidth?: number
    trackColor?: string
    indicatorWidth?: number
    indicatorColor?: string
    indicatorCap?: 'round' | 'inherit' | 'butt' | 'square'
    children?: React.ReactNode
    labelColor?: string
    spinnerMode?: boolean
    spinnerSpeed?: number
}

const ProgressCircular = (props: ProgressCircularProps) => {
    const {
        size = 150,
        progress = 0,
        trackWidth = 10,
        trackColor = `#ddd`,
        indicatorWidth = 10,
        indicatorColor = `#07c`,
        indicatorCap = 'round',
        labelColor = `#333`,
        spinnerMode = false,
        spinnerSpeed = 1,
        children,
    } = props

    const center = size / 2
    const radius =
        center - (trackWidth > indicatorWidth ? trackWidth : indicatorWidth)
    const dashArray = 2 * Math.PI * radius
    const dashOffset = dashArray * ((100 - progress) / 100)

    const hideLabel = size < 100 || !children

    return (
        <>
            <div
                className="svg-pi-wrapper"
                style={{ width: size, height: size }}
            >
                <svg className="svg-pi" style={{ width: size, height: size }}>
                    <circle
                        className="svg-pi-track"
                        cx={center}
                        cy={center}
                        fill="transparent"
                        r={radius}
                        stroke={trackColor}
                        strokeWidth={trackWidth}
                    />
                    <circle
                        className={`svg-pi-indicator ${
                            spinnerMode ? 'svg-pi-indicator--spinner' : ''
                        }`}
                        style={{
                            animationDuration: `${spinnerSpeed * 1e3}ms`,
                        }}
                        cx={center}
                        cy={center}
                        fill="transparent"
                        r={radius}
                        stroke={indicatorColor}
                        strokeWidth={indicatorWidth}
                        strokeDasharray={dashArray}
                        strokeDashoffset={dashOffset}
                        strokeLinecap={indicatorCap}
                    />
                </svg>

                {!hideLabel && (
                    <div className="svg-pi-label" style={{ color: labelColor }}>
                        {children}

                        {!spinnerMode && (
                            <span className="svg-pi-label__progress">
                                {`${progress > 100 ? 100 : progress}%`}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

export default ProgressCircular
