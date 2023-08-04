import React, { forwardRef } from 'react'
import './button.scss'

interface ButtonProps {
    /**
     * Is this the principal call to action on the page?
     */
    primary?: boolean
    /**
     * What background color to use
     */
    backgroundColor?: string
    /**
     * How large should the button be?
     */
    size?: 'small' | 'medium' | 'large'
    /**
     * Button contents
     */
    label: string
    /**
     * Optional click handler
     */
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

/**
 * Primary UI component for user interaction
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        { primary = true, backgroundColor, size = 'medium', onClick, label },
        ref
    ) => {
        const mode = primary ? 'button--primary' : 'button--secondary'
        return (
            <button
                ref={ref}
                type="button"
                className={['button', `button--${size}`, mode].join(' ')}
                style={backgroundColor ? { backgroundColor } : {}}
                onClick={onClick}
            >
                {label}
            </button>
        )
    }
)

Button.displayName = 'Button'

export default Button
