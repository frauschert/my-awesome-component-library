import React, { forwardRef, useEffect, useRef } from 'react'
import useCopyToClipboard from '../../utility/hooks/useCopyToClipboard'
import { classNames } from '../../utility/classnames'
import './CopyToClipboard.scss'

export type CopyToClipboardSize = 'small' | 'medium' | 'large'
export type CopyToClipboardVariant = 'primary' | 'secondary' | 'ghost'

export interface CopyToClipboardProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    /** The text to copy */
    text: string
    /** Button label (default: "Copy") */
    label?: string
    /** Label shown after successful copy (default: "Copied!") */
    copiedLabel?: string
    /** Duration in ms to show the "Copied!" state (default: 2000) */
    resetDelay?: number
    /** Size variant */
    size?: CopyToClipboardSize
    /** Visual variant */
    variant?: CopyToClipboardVariant
    /** Show an icon alongside the label */
    showIcon?: boolean
    /** Callback after text is copied */
    onCopy?: (text: string, success: boolean) => void
}

const CopyIcon = () => (
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
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
)

const CheckIcon = () => (
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
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

const CopyToClipboard = forwardRef<HTMLButtonElement, CopyToClipboardProps>(
    (
        {
            text,
            label = 'Copy',
            copiedLabel = 'Copied!',
            resetDelay = 2000,
            size = 'medium',
            variant = 'secondary',
            showIcon = true,
            onCopy,
            className,
            disabled,
            ...rest
        },
        ref
    ) => {
        const { copy, isSuccess, isCopying, reset } = useCopyToClipboard()
        const timerRef = useRef<ReturnType<typeof setTimeout>>()

        useEffect(() => {
            if (isSuccess) {
                timerRef.current = setTimeout(reset, resetDelay)
            }
            return () => {
                if (timerRef.current) clearTimeout(timerRef.current)
            }
        }, [isSuccess, reset, resetDelay])

        const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
            rest.onClick?.(e)
            const success = await copy(text)
            onCopy?.(text, success)
        }

        return (
            <button
                ref={ref}
                type="button"
                className={classNames(
                    'copy-to-clipboard',
                    `copy-to-clipboard--${size}`,
                    `copy-to-clipboard--${variant}`,
                    isSuccess && 'copy-to-clipboard--copied',
                    className
                )}
                onClick={handleClick}
                disabled={disabled || isCopying}
                aria-label={isSuccess ? copiedLabel : label}
                {...rest}
            >
                {showIcon && (
                    <span className="copy-to-clipboard__icon">
                        {isSuccess ? <CheckIcon /> : <CopyIcon />}
                    </span>
                )}
                <span className="copy-to-clipboard__label">
                    {isSuccess ? copiedLabel : label}
                </span>
            </button>
        )
    }
)

CopyToClipboard.displayName = 'CopyToClipboard'
export default CopyToClipboard
