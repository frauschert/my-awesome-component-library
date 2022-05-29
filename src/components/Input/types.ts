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

export type InputProps = (NumberInputProps | TextInputProps) & {
    label?: string
    locked?: boolean
    focussed?: boolean
}
