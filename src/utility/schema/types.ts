import {
    intersection,
    isBoolean,
    isLiteral,
    isNumber,
    isRecord,
    isString,
    isType,
    oneOf,
    or,
    TypeOf,
    union,
} from '../guards/guard'
import isUndefined from '../guards/isUndefined'
import schema from './schema.json'

const guiLabelSchema = isType({
    label: or(isString, isUndefined),
})

const classPropertySchema = isType({
    type: oneOf(['id', 'Int32', 'UInt32']),
    description: isString,
    default: union([isString, isNumber, isUndefined]),
    gui: intersection([
        guiLabelSchema,
        isType({
            unit: or(isString, isUndefined),
            unitScale: or(isNumber, isUndefined),
            decimalPlace: or(isNumber, isUndefined),
            hidden: or(isUndefined, isType({ default: isBoolean })),
        }),
    ]),
    validation: isType({ min: isNumber, max: isNumber }),
})

const classSchema = isType({
    type: isLiteral('class'),
    description: isString,
    base: isType({
        $ref: isString,
    }),
    gui: guiLabelSchema,
    properties: isRecord(classPropertySchema),
})

function test() {
    const { Instance } = schema
    if (classSchema(Instance)) {
        Instance.base
    }
}

type EnumSchema = {
    type: 'enum'
    description: string
    items: EnumItemSchema[]
}

type EnumItemSchema = {
    name: string
    value: string
    gui: GuiLabelSchema
}

type ClassSchema = TypeOf<typeof classSchema>

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

const isId = (x: unknown): x is 'id' => x === 'id'
const isInt32 = (x: unknown): x is 'Int32' => x === 'Int32'
const isUInt32 = (x: unknown): x is 'UInt32' => x === 'UInt32'
const isUInt32 = (x: unknown): x is 'UInt32' => x === 'UInt32'
const isClassPropertySchemaType = (x: unknown): x is ClassPropertySchemaType =>
    isId(x)

type Schema = ClassSchema | EnumSchema

type ClassPropertySchemaPrimitiveType = 'id' | 'Int32' | 'UInt32'
type ClassPropertySchemaListType = `list<${ClassPropertySchemaPrimitiveType}>`
type ClassPropertySchemaType =
    | ClassPropertySchemaPrimitiveType
    | ClassPropertySchemaListType

type ParseSchema<TDefinition extends Record<string, unknown>> = {
    [Key in keyof TDefinition]: TDefinition[Key] extends {
        properties: infer Properties
    }
        ? Properties extends Record<string, unknown>
            ? Exclude<ClassSchema, 'properties'> & {
                  properties: ParsePropertySchema<Properties>
              }
            : never
        : EnumSchema
}

type ParsePropertySchema<TProperties extends Record<string, unknown>> = {
    [Key in keyof TProperties]: ClassPropertySchema
}

type Blub = ParseSchema<typeof schema>

type t = typeof schema

const createSchema = <T extends Record<string, unknown>>(
    value: T
): ParseSchema<T> => value as ParseSchema<T>

const definition = createSchema(schema)

// const isClassSchema = (value: ClassSchema | EnumSchema): value is ClassSchema =>
//     value.type === 'class'
const isBase = isType({ $ref: isString })
const isGuiLabelSchema = isType<GuiLabelSchema>({ label: isString })
const isClassSchema = isType({
    type: (x: unknown): x is 'class' => x === 'class',
    description: isString,
    base: isBase,
})
const isEnumSchema = (value: ClassSchema | EnumSchema): value is EnumSchema =>
    value.type === 'enum'

const doSomethingWithClassSchema = (classSchema: ClassSchema): ClassSchema => ({
    ...classSchema,
    properties: Object.entries(classSchema.properties).reduce(
        (acc, [key, value]) => ({
            ...acc,
            [key]: value,
        }),
        {} as Record<string, ClassPropertySchema>
    ),
})

const createContent = (
    definition: Record<string, ClassSchema | EnumSchema>
) => {
    return Object.values(definition).map((value) => {
        if (isClassSchema(value)) {
            return doSomethingWithClassSchema(value)
        } else {
            return value.items
        }
    })
}

createContent(definition)

Object.values(definition.Instance.properties).map((value) => value.default)

export {}
