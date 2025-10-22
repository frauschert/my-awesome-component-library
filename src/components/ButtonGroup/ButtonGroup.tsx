import React, { useState } from 'react'
import './buttongroup.scss'
import { classNames } from '../../utility/classnames'

export type ButtonGroupSize = 'small' | 'medium' | 'large'
export type ButtonGroupVariant = 'default' | 'outlined' | 'contained'
export type ButtonGroupOrientation = 'horizontal' | 'vertical'
export type ButtonGroupSelectionMode = 'single' | 'multiple' | 'none'

export interface ButtonGroupButton {
    id: string
    label: string
    value?: any
    icon?: React.ReactNode
    disabled?: boolean
    tooltip?: string
}

export interface ButtonGroupProps {
    /** Buttons to display */
    buttons: ButtonGroupButton[]
    /** Selection mode */
    selectionMode?: ButtonGroupSelectionMode
    /** Selected button ID(s) - controlled */
    selected?: string | string[]
    /** Default selected button ID(s) - uncontrolled */
    defaultSelected?: string | string[]
    /** Callback when selection changes */
    onChange?: (selected: string | string[] | null) => void
    /** Visual variant */
    variant?: ButtonGroupVariant
    /** Size */
    size?: ButtonGroupSize
    /** Orientation */
    orientation?: ButtonGroupOrientation
    /** Allow deselecting in single mode */
    allowDeselect?: boolean
    /** Disabled state for entire group */
    disabled?: boolean
    /** Full width */
    fullWidth?: boolean
    /** Additional CSS class */
    className?: string
    /** Additional styles */
    style?: React.CSSProperties
    /** ARIA label */
    'aria-label'?: string
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
    buttons,
    selectionMode = 'none',
    selected: controlledSelected,
    defaultSelected,
    onChange,
    variant = 'default',
    size = 'medium',
    orientation = 'horizontal',
    allowDeselect = false,
    disabled = false,
    fullWidth = false,
    className,
    style,
    'aria-label': ariaLabel,
}) => {
    const [internalSelected, setInternalSelected] = useState<
        string | string[] | null
    >(() => {
        if (defaultSelected !== undefined) {
            return defaultSelected
        }
        return selectionMode === 'multiple' ? [] : null
    })

    const isControlled = controlledSelected !== undefined
    const selected = isControlled ? controlledSelected : internalSelected

    const isSelected = (buttonId: string): boolean => {
        if (selected === null || selected === undefined) return false
        if (Array.isArray(selected)) {
            return selected.includes(buttonId)
        }
        return selected === buttonId
    }

    const handleButtonClick = (button: ButtonGroupButton) => {
        if (disabled || button.disabled || selectionMode === 'none') {
            return
        }

        let newSelected: string | string[] | null

        if (selectionMode === 'single') {
            const currentlySelected = isSelected(button.id)
            if (currentlySelected && allowDeselect) {
                newSelected = null
            } else if (currentlySelected) {
                return // Already selected and deselect not allowed
            } else {
                newSelected = button.id
            }
        } else if (selectionMode === 'multiple') {
            const currentSelected = Array.isArray(selected) ? selected : []
            if (isSelected(button.id)) {
                newSelected = currentSelected.filter((id) => id !== button.id)
            } else {
                newSelected = [...currentSelected, button.id]
            }
        } else {
            return
        }

        if (!isControlled) {
            setInternalSelected(newSelected)
        }
        onChange?.(newSelected)
    }

    const groupClasses = classNames(
        'button-group',
        `button-group--${variant}`,
        `button-group--${size}`,
        `button-group--${orientation}`,
        fullWidth && 'button-group--full-width',
        disabled && 'button-group--disabled',
        className
    )

    return (
        <div
            className={groupClasses}
            style={style}
            role={selectionMode !== 'none' ? 'group' : undefined}
            aria-label={ariaLabel}
        >
            {buttons.map((button, index) => {
                const buttonSelected = isSelected(button.id)
                const buttonDisabled = disabled || button.disabled

                const buttonClasses = classNames(
                    'button-group__button',
                    buttonSelected && 'button-group__button--selected',
                    buttonDisabled && 'button-group__button--disabled',
                    index === 0 && 'button-group__button--first',
                    index === buttons.length - 1 && 'button-group__button--last'
                )

                return (
                    <button
                        key={button.id}
                        type="button"
                        className={buttonClasses}
                        onClick={() => handleButtonClick(button)}
                        disabled={buttonDisabled}
                        title={button.tooltip}
                        aria-pressed={
                            selectionMode !== 'none'
                                ? buttonSelected
                                : undefined
                        }
                    >
                        {button.icon && (
                            <span className="button-group__button-icon">
                                {button.icon}
                            </span>
                        )}
                        <span className="button-group__button-label">
                            {button.label}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}

export default ButtonGroup
