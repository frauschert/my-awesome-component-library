import React, { forwardRef, useEffect, useRef, useState } from 'react'
import QRCodeLib from 'qrcode'
import { classNames } from '../../utility/classnames'
import './QRCode.scss'

export type QRCodeErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

export interface QRCodeProps {
    /**
     * The value to encode in the QR code
     */
    value: string
    /**
     * Size of the QR code in pixels
     * @default 200
     */
    size?: number
    /**
     * Background color
     * @default '#ffffff'
     */
    bgColor?: string
    /**
     * Foreground color (QR code color)
     * @default '#000000'
     */
    fgColor?: string
    /**
     * Error correction level
     * L: ~7% correction
     * M: ~15% correction (default)
     * Q: ~25% correction
     * H: ~30% correction
     * @default 'M'
     */
    level?: QRCodeErrorCorrectionLevel
    /**
     * Include margin/quiet zone
     * @default true
     */
    includeMargin?: boolean
    /**
     * Render as canvas or SVG
     * @default 'canvas'
     */
    renderAs?: 'canvas' | 'svg'
    /**
     * Image to display in center of QR code
     */
    imageSettings?: {
        src: string
        height: number
        width: number
        excavate?: boolean
    }
    /**
     * Additional CSS class names
     */
    className?: string
    /**
     * Alt text for accessibility
     */
    alt?: string
    /**
     * Title for accessibility
     */
    title?: string
}

/**
 * Renders QR code matrix to canvas element using qrcode library.
 *
 * Uses the battle-tested qrcode.js library to generate scannable QR codes
 * with proper error correction, encoding, and format information.
 *
 * @param canvas - Target canvas element
 * @param value - Data to encode
 * @param size - Target size in pixels
 * @param bgColor - Background color
 * @param fgColor - Foreground (dark module) color
 * @param level - Error correction level
 * @param includeMargin - Whether to include quiet zone margin
 * @param imageSettings - Optional logo overlay settings
 */
const generateQRCode = async (
    canvas: HTMLCanvasElement,
    value: string,
    size: number,
    bgColor: string,
    fgColor: string,
    level: QRCodeErrorCorrectionLevel,
    includeMargin: boolean,
    imageSettings?: QRCodeProps['imageSettings']
) => {
    try {
        // Generate QR code using qrcode library
        await QRCodeLib.toCanvas(canvas, value, {
            errorCorrectionLevel: level,
            width: size,
            margin: includeMargin ? 4 : 0,
            color: {
                dark: fgColor,
                light: bgColor,
            },
        })

        // Add logo overlay if specified
        if (imageSettings && typeof window !== 'undefined') {
            const ctx = canvas.getContext('2d')
            if (!ctx) return

            const img = new (window as typeof globalThis).Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => {
                const imageX = (size - imageSettings.width) / 2
                const imageY = (size - imageSettings.height) / 2

                if (imageSettings.excavate) {
                    // Clear area for image
                    ctx.fillStyle = bgColor
                    ctx.fillRect(
                        imageX - 5,
                        imageY - 5,
                        imageSettings.width + 10,
                        imageSettings.height + 10
                    )
                }

                ctx.drawImage(
                    img,
                    imageX,
                    imageY,
                    imageSettings.width,
                    imageSettings.height
                )
            }
            img.src = imageSettings.src
        }
    } catch (error) {
        console.error('Failed to generate QR code:', error)
    }
}

/**
 * Generates SVG string for QR code using qrcode library.
 *
 * @param value - Data to encode
 * @param size - SVG size in pixels
 * @param bgColor - Background color
 * @param fgColor - Foreground color
 * @param level - Error correction level
 * @param includeMargin - Whether to include quiet zone
 * @returns Complete SVG string
 */
const generateSVG = async (
    value: string,
    size: number,
    bgColor: string,
    fgColor: string,
    level: QRCodeErrorCorrectionLevel,
    includeMargin: boolean
): Promise<string> => {
    try {
        const svg = await QRCodeLib.toString(value, {
            errorCorrectionLevel: level,
            type: 'svg',
            width: size,
            margin: includeMargin ? 4 : 0,
            color: {
                dark: fgColor,
                light: bgColor,
            },
        })
        return svg
    } catch (error) {
        console.error('Failed to generate SVG QR code:', error)
        return ''
    }
}

/**
 * QRCode component for generating QR codes
 *
 * Generates scannable QR codes from text/URLs with customizable styling.
 * Supports both canvas and SVG rendering, custom colors, error correction levels,
 * and optional logo overlay.
 *
 * @example
 * ```tsx
 * <QRCode value="https://example.com" size={200} />
 * ```
 *
 * @example
 * ```tsx
 * <QRCode
 *   value="https://example.com"
 *   size={300}
 *   fgColor="#2563eb"
 *   bgColor="#eff6ff"
 *   level="H"
 *   imageSettings={{
 *     src: '/logo.png',
 *     height: 60,
 *     width: 60,
 *     excavate: true
 *   }}
 * />
 * ```
 */
const QRCode = forwardRef<HTMLDivElement, QRCodeProps>(
    (
        {
            value,
            size = 200,
            bgColor = '#ffffff',
            fgColor = '#000000',
            level = 'M',
            includeMargin = true,
            renderAs = 'canvas',
            imageSettings,
            className,
            alt,
            title,
        },
        ref
    ) => {
        const canvasRef = useRef<HTMLCanvasElement>(null)
        const [svgContent, setSvgContent] = useState<string>('')

        useEffect(() => {
            if (renderAs === 'canvas' && canvasRef.current) {
                generateQRCode(
                    canvasRef.current,
                    value,
                    size,
                    bgColor,
                    fgColor,
                    level,
                    includeMargin,
                    imageSettings
                )
            } else if (renderAs === 'svg') {
                generateSVG(
                    value,
                    size,
                    bgColor,
                    fgColor,
                    level,
                    includeMargin
                ).then((svg) => setSvgContent(svg))
            }
        }, [
            value,
            size,
            bgColor,
            fgColor,
            level,
            includeMargin,
            renderAs,
            imageSettings,
        ])

        const classes = classNames('qrcode', className)

        return (
            <div
                ref={ref}
                className={classes}
                style={{ width: size, height: size }}
            >
                {renderAs === 'canvas' ? (
                    <canvas
                        ref={canvasRef}
                        width={size}
                        height={size}
                        className="qrcode__canvas"
                        role="img"
                        aria-label={alt || `QR Code: ${value}`}
                        title={title}
                    />
                ) : svgContent ? (
                    <div
                        className="qrcode__svg"
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                        role="img"
                        aria-label={alt || `QR Code: ${value}`}
                        title={title}
                    />
                ) : null}
            </div>
        )
    }
)

QRCode.displayName = 'QRCode'

export default QRCode
