import React from 'react'

export type NumberInputProps = {
    type: 'number'
    initialValue?: number
    onChange?: (value: number) => void
}

export type TextInputProps = {
    type: 'text'
    initialValue?: string
    onChange?: (value: string) => void
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
    (NumberInputProps | TextInputProps) & {
        label?: string
        locked?: boolean
        focussed?: boolean
        helperText?: React.ReactNode
        errorText?: React.ReactNode
        invalid?: boolean
        sizeVariant?: 'sm' | 'md' | 'lg'
        /** Immediate value callback (string for text, number for number when parseable, else raw) */
        onValueChange?: (value: string | number) => void
        /** Debounced value callback (string for text, number for number when parseable). Defaults to 500ms */
        onDebouncedValueChange?: (value: string | number) => void
        /** Debounce delay in ms for debounced callbacks; default 500 */
        debounceMs?: number
        /** Leading adornment (icon or content) */
        startAdornment?: React.ReactNode
        /** Trailing adornment (icon or content); clear button will appear alongside */
        endAdornment?: React.ReactNode
        /** Shows a clear button when there is a value */
        clearable?: boolean
        /** Called after the clear action is performed */
        onClear?: () => void
    }
