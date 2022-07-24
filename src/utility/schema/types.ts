import schema from './schema.json'

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

type ClassSchema = {
    type: 'class'
    description: string
    base: {
        $ref: string
    }
    gui: GuiLabelSchema
    properties: Record<string, ClassPropertySchema>
}

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

type ClassPropertySchemaType = 'id' | 'Int32' | 'UInt32' | 'list<Int32>'

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

const createSchema = <T extends Record<string, unknown>>(
    value: T
): ParseSchema<T> => value as ParseSchema<T>

const definition = createSchema(schema)

const isClassSchema = (value: ClassSchema | EnumSchema): value is ClassSchema =>
    value.type === 'class'
const isEnumSchema = (value: ClassSchema | EnumSchema): value is EnumSchema =>
    value.type === 'enum'

const doSomethingWithClassSchema = (classSchema: ClassSchema) => {
    return {} as any
}

const doSomethingWithDefinition = (
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

doSomethingWithDefinition(definition)

Object.values(definition.Instance.properties).map((value) => value.default)

export {}
