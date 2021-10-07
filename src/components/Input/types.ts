type NumberInputProps = {
    type: 'number'
    initialValue?: number
    onChange: (value: number) => void
}

type TextInputProps = {
    type: 'text'
    initialValue?: string
    onChange: (value: string) => void
}

export type InputProps = NumberInputProps | TextInputProps
