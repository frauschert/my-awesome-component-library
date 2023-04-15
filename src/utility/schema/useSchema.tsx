/* eslint-disable react/display-name */
import React, { ComponentType } from 'react'

interface Property {
    description: string
    type: 'string' | 'number' | 'boolean'
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

type StringProperty = {
    value: string
    placeholder?: string
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}

type NumberProperty = {
    value: number
    placeholder?: string
    min?: number
    max?: number
    step?: number
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}

type BooleanProperty = {
    checked: boolean
    label?: string
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}

type PropertyPropsMap = {
    string: StringProperty
    number: NumberProperty
    boolean: BooleanProperty
}

type ComponentProps<T extends Property> = PropertyPropsMap[T['type']]

type PropertySchema<T extends Record<string, Property>> = {
    [K in keyof T as Capitalize<string & K>]: ComponentType<
        ComponentProps<T[K]>
    >
}

type ClassSchema = {
    type: 'class'
    description: string | undefined
    base?: {
        $ref: string
    }
    gui: {
        label: string | undefined
    }
    properties: Record<string, Property>
}

type EnumSchema = {
    type: 'enum'
    description: string | undefined
    items: {
        name: string
        description?: string
        value: string
        gui: {
            label: string | undefined
        }
    }[]
}

type Schema = ClassSchema | EnumSchema

type MergeProperties<
    T extends Record<string, ClassSchema>,
    K extends keyof T
> = T[K]['base'] extends { $ref: infer Ref }
    ? Ref extends string
        ? T[K]['properties'] & T[Ref]['properties']
        : T[K]['properties']
    : T[K]['properties']

type ExcludeFromRecord<T extends Record<string, unknown>, U> = {
    [P in keyof T]: Exclude<T[P], U>
}

type ComponentSchema<T extends Record<string, ClassSchema | EnumSchema>> = {
    [K in keyof T]: MergeProperties<
        ExcludeFromRecord<T, EnumSchema>,
        K
    > extends infer U
        ? U extends Record<string, Property>
            ? SchemaResult<U>
            : never
        : never
}

type SchemaResult<TProperties extends Record<string, Property>> = {
    properties: PropertySchema<TProperties>
}

export function schema<T extends Record<string, Schema>>(
    schemas: T
): ComponentSchema<T> {
    type ComponentProperties = {
        properties: PropertySchema<Record<string, Property>>
    }

    const schemaMap = new Map<string, ComponentProperties>()

    function addToMap(key: string, properties: Record<string, Property>) {
        if (!schemaMap.has(key)) {
            schemaMap.set(key, { properties: propertySchema(properties) })
        }
    }

    function overwriteProperties(
        obj1: Record<string, Property>,
        obj2: Record<string, Property>
    ) {
        return Object.entries(obj1).reduce((acc, [key, value]) => {
            return {
                ...acc,
                [key]: { ...value, ...obj2[key] },
            }
        }, obj1)
    }
    Object.entries(schemas).forEach(([key, value]) => {
        if (value.type === 'class') {
            let actualProperties = value.properties
            if (value.base?.$ref) {
                const refSchema = schemas[value.base.$ref]
                if (refSchema && refSchema.type === 'class') {
                    actualProperties = overwriteProperties(
                        actualProperties,
                        refSchema.properties
                    )
                }
            }

            addToMap(key, actualProperties)
        }
    })

    return Object.fromEntries(schemaMap) as unknown as ComponentSchema<T>

    // return Object.entries(schemas).reduce((acc, [key, value]) => {
    //     if (value.type === 'class') {
    //         return {
    //             ...acc,
    //             [key]: { properties: propertySchema(value.properties) },
    //         }
    //     }
    //     return acc
    // }, {} as S<ExcludeFromRecord<T, EnumSchema>>)
}

export function propertySchema<T extends Record<string, Property>>(
    schema: T
): PropertySchema<T> {
    // const [state, setState] = useState<{ [key: string]: Property['default'] }>(
    //     Object.fromEntries(
    //         Object.entries(schema).map(([key, value]) => [
    //             key,
    //             value.default ?? '',
    //         ])
    //     )
    // )

    // const handleChange = (key: string, value: any) => {
    //     setState((prevState) => ({ ...prevState, [key]: value }))
    // }

    function capitalizeFirstLetter(value: string) {
        return value.charAt(0).toUpperCase() + value.slice(1)
    }

    function getComponent(value: Property) {
        switch (value.type) {
            case 'string':
                return (props: StringProperty) => (
                    <input
                        type="text"
                        value={props.value}
                        onChange={props.onChange}
                        placeholder={props.placeholder}
                        disabled={value.readonly}
                    />
                )
            case 'number':
                return (props: NumberProperty) => (
                    <input
                        type="number"
                        value={props.value}
                        onChange={props.onChange}
                        placeholder={props.placeholder}
                        min={props.min}
                        max={props.max}
                        step={props.step}
                        disabled={value.readonly}
                    />
                )
            case 'boolean':
                return (props: BooleanProperty) => (
                    <label>
                        <input
                            type="checkbox"
                            checked={props.checked}
                            onChange={props.onChange}
                            disabled={value.readonly}
                        />
                        {props.label}
                    </label>
                )
            default:
                throw new Error(`Unsupported type: ${value.type}`)
        }
    }

    return Object.entries(schema).reduce((acc, [key, value]) => {
        const capitalizedKey = capitalizeFirstLetter(key)

        return {
            ...acc,
            [capitalizedKey]: getComponent(value),
        }
    }, {} as PropertySchema<T>)
}
