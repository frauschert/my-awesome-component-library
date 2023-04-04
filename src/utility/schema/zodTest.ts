import {  z } from 'zod'
import testData from './schema.json'

const guiLabelSchema = z.object({ label: z.string() })
const enumItemSchema = z.object({
    name: z.string(),
    value: z.string(),
    gui: guiLabelSchema,
})
const enumSchema = z.object({
    type: z.literal('enum'),
    description: z.string().optional(),
    items: enumItemSchema.array(),
})

type EnumSchema = z.infer<typeof enumSchema>

const classPropertySchema = z.object({
    type: z.union([z.literal('id'), z.literal('Int32'), z.string()]),
    description: z.string().optional(),
})
const classSchema = z.object({
    type: z.literal('class'),
    description: z.string().optional(),
    base: z.object({ $ref: z.string() }).optional(),
    gui: guiLabelSchema,
    properties: z.record(classPropertySchema),
})

const createSpecificClassSchema = <T extends object>(propertyKeys: T) => {
    const keys = Object.keys(propertyKeys)
    return z.object({
        type: z.literal('class'),
        description: z.string().optional(),
        base: z.object({ $ref: z.string() }),
        gui: guiLabelSchema,
        properties: z.object(
            keys.reduce(
                (agg, k) => ({ ...agg, [k]: classPropertySchema }),
                {} as Record<keyof T, typeof classPropertySchema>
            )
        ),
    })
}

const spec = createSpecificClassSchema({ a: 'string' })
//const s = spec.parse({})

const schema = z.union([classSchema, enumSchema])

type ClassPropertySchema = z.infer<typeof classPropertySchema>
type ClassSchema = z.infer<typeof classSchema>
type Schema = z.infer<typeof schema>

type KeysMatching<T extends object, V> = {
    [K in keyof T]-?: T[K] extends V ? K : never
}[keyof T]

type ValuesMatching<T extends object, V> = {
    [K in keyof T]-?: T[K] extends V ? T[K] : never
}[keyof T]

type ClassValue = ValuesMatching<
    typeof testData,
    { properties: Record<string, unknown> }
>

type ClassKeys = KeysMatching<typeof testData, { properties: unknown }>
type EnumKeys = Exclude<keyof typeof testData, ClassKeys>


type SchemaDefinition<T> = T extends Record<string, infer U> ? U : never;
type ClassDefinition <T> = T extends { properties: unknown } ? T : never;

type Test = SchemaDefinition<typeof testData>
type Test2 = ClassDefinition<Test>

function t<T extends Record<string, Schema>>(val: T) {
    const blub = val['test']
    

}

const s = t(testData)

testData.Instance.
function register<T, K extends keyof T, U extends ClassDefinition<T[K]>>(definition: T) {
    function getClass<K extends keyof T, U extends ClassDefinition<T[K]>>(val: K): U {
        return {
            properties: 
        }
    }

    return { getClass }
}

const { getClass: getClass2 } = register(testData)
const bla = getClass2('PriorityEnum')


function definition<T extends Record<string, Schema>>(value: T) {
    type ClassKeys = KeysMatching<T, { type: 'class' }>
    type EnumKeys = KeysMatching<T, { type: 'enum' }>

    type Key = keyof T;
    type Value = T[Key]

    const enumMap = new Map<keyof T, T[keyof T]>()
    const classMap = new Map<Key, Value>()
    const entries = Object.entries(value)
    entries.forEach(([key, val]) => {
        const type = val.type

        if (type === 'class') {
            classMap.set(key, val as Value)
        } else if (type === 'enum') {
            enumMap.set(key as EnumKeys, enumSchema.parse(val))
        } else {
            throw new Error(`Unknown value for ${type}`)
        }
    })

    function getClass<K extends ClassKeys>(key: K): T[K][''] {
        return value[key];
    }
    function getEnum<K extends EnumKeys>(key: K) {
        return value[key]
    }

    return { getClass, getEnum, enumMap, classMap }
}

const { getClass, getEnum, enumMap, classMap } = definition(testData)
const sch = getClass('Instance')
const e = getEnum('PriorityEnum')
