import React, { ComponentType, HTMLProps, useState } from 'react'

interface Property {
    description: string
    type: 'string' | 'number' | 'boolean' | 'id'
    default?: string | number | boolean
    unit?: string
    unitScale?: number
    readonly?: boolean
    item?: {
        $ref: string
    }
    gui?: {
        label?: string
        hidden?: {
            default: boolean
        }
        unit?: string
        unitScale?: number
        decimalPlace?: number
    }
}

type NumberProperty = {
    value: number
    placeholder?: string
    min?: number
    max?: number
    step?: number
}

type BooleanProperty = {
    checked: boolean
    label?: string
}

type PropsFromProperty<T extends Property> = T['type'] extends 'string'
    ? { value: string; placeholder?: string }
    : T['type'] extends 'number'
    ? NumberProperty
    : T['type'] extends 'boolean'
    ? BooleanProperty
    : T['type'] extends 'id'
    ? { value: string; placeholder?: string }
    : never

type ComponentProps<T extends Property> = PropsFromProperty<T>

type Schema<T extends Record<string, Property>> = {
    [K in keyof T as Capitalize<string & K>]: ComponentType<
        ComponentProps<T[K]>
    >
}

export function useSchema<
    T extends Record<string, Property>,
    K extends keyof T
>(schema: T): Schema<T> {
    const [state, setState] = useState<{ [key: string]: Property['default'] }>(
        Object.fromEntries(
            Object.entries(schema).map(([key, value]) => [
                key,
                value.default ?? '',
            ])
        )
    )

    const handleChange = (key: string, value: any) => {
        setState((prevState) => ({ ...prevState, [key]: value }))
    }

    const components = {} as any

    function capitalizeFirstLetter(value: string) {
        return value.charAt(0).toUpperCase() + value.slice(1)
    }

    Object.entries(schema).forEach(([key, value]) => {
        const capitalizedKey = capitalizeFirstLetter(key)
        const { type } = value
        switch (type) {
            case 'string':
                components[capitalizedKey] = (props: any) => (
                    <input
                        type="text"
                        value={props.value}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={props.placeholder}
                    />
                )
                break
            case 'number':
                components[capitalizedKey] = (props: NumberProperty) => (
                    <input
                        type="number"
                        value={props.value}
                        onChange={(e) =>
                            handleChange(key, Number(e.target.value))
                        }
                        placeholder={props.placeholder}
                        min={props.min}
                        max={props.max}
                        step={props.step}
                    />
                )
                break
            case 'boolean':
                components[capitalizedKey] = (props: BooleanProperty) => (
                    <label>
                        <input
                            type="checkbox"
                            checked={props.checked}
                            onChange={(e) =>
                                handleChange(key, e.target.checked)
                            }
                        />
                        {props.label}
                    </label>
                )
                break
            case 'id':
                components[capitalizedKey] = (props: any) => (
                    <input
                        type="text"
                        value={props.value}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={props.placeholder}
                    />
                )
                break
            default:
                throw new Error(`Unsupported type: ${type}`)
        }
    })

    return components
}
