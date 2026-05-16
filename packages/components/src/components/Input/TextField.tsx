import React from 'react'
import Input from './Input'
import type { InputProps, TextInputProps } from './types'

export type TextFieldProps = Omit<InputProps & TextInputProps, 'type'>

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
    (props, ref) => {
        return <Input ref={ref} {...(props as any)} type="text" />
    }
)

TextField.displayName = 'TextField'

export default TextField
