import {
    isIntersection,
    isArrayOf,
    isBoolean,
    isLiteral,
    isNumber,
    isOptional,
    isRecord,
    isString,
    isObject,
    isOneOf,
    TypeOf,
    isUnion,
} from '../guards/guard'
import schema from './schema.json'

const isGuiLabelSchema = isObject({
    label: isOptional(isString),
})

const isClassPropertySchema = isObject({
    type: isOneOf(['id', 'Int32', 'UInt32']),
    description: isOptional(isString),
    default: isOptional(isUnion([isString, isNumber])),
    gui: isIntersection([
        isGuiLabelSchema,
        isObject({
            unit: isOptional(isString),
            unitScale: isOptional(isNumber),
            decimalPlace: isOptional(isNumber),
            hidden: isOptional(isObject({ default: isBoolean })),
        }),
    ]),
    validation: isOptional(
        isObject({ min: isOptional(isNumber), max: isOptional(isNumber) })
    ),
})

const isClassSchema = isObject({
    type: isLiteral('class'),
    description: isOptional(isString),
    base: isOptional(
        isObject({
            $ref: isString,
        })
    ),
    gui: isGuiLabelSchema,
    properties: isRecord(isClassPropertySchema),
})

const isEnumSchema = isObject({
    type: isLiteral('enum'),
    description: isOptional(isString),
    items: isArrayOf(
        isObject({
            name: isString,
            description: isOptional(isString),
            value: isString,
            gui: isGuiLabelSchema,
        })
    ),
})

type ClassSchema = TypeOf<typeof isClassSchema>
//      ^?
type EnumSchema = TypeOf<typeof isEnumSchema>

type GuiLabelSchema = {
    label: string
}

type ClassPropertySchema = {
    type: ClassPropertySchemaType
    description: string
    default?: string | number
    readonly?: boolean
    gui?: GuiLabelSchema & {
        unit?: string
        unitScale?: number
        decimalPlace?: number
        hidden?: { default: boolean }
    }
    validation?: {
        min: number
        max: number
    }
}

type Schema = ClassSchema | EnumSchema

type ClassPropertySchemaPrimitiveType = 'id' | 'Int32' | 'UInt32'
type ClassPropertySchemaListType = `list<${ClassPropertySchemaPrimitiveType}>`
type ClassPropertySchemaType =
    | ClassPropertySchemaPrimitiveType
    | ClassPropertySchemaListType

type ParsePropertySchema<TProperties extends Record<string, unknown>> = {
    [Key in keyof TProperties]: ClassPropertySchema
}
