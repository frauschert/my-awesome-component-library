import React from 'react'

export type NumberInputProps = {
    type: 'number'
    initialValue?: number
    onChange: (value: number) => void
}

export type TextInputProps = {
    type: 'text'
    initialValue?: string
    onChange: (value: string) => void
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
    }
