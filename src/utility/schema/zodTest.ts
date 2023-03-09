import { z } from 'zod'
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

z.enum(['Test', 'Bla'])

const classPropertySchema = z.object({
    type: z.union([z.literal('id'), z.literal('Int32')]),
    description: z.string().optional(),
})
const classSchema = z.object({
    type: z.literal('class'),
    description: z.string().optional(),
    base: z.object({ $ref: z.string() }),
    gui: guiLabelSchema,
    properties: z.record(classPropertySchema),
})

const schema = z.union([classSchema, enumSchema])

type ClassPropertySchema = z.infer<typeof classPropertySchema>
type ClassSchema = z.infer<typeof classSchema>
type Schema = z.infer<typeof schema>

type KeysMatching<T extends object, V> = {
    [K in keyof T]-?: T[K] extends V ? K : never
}[keyof T]

type ClassKeys = KeysMatching<typeof testData, { properties: unknown }>

type SchemaInterpreterProps = { type: ClassKeys; data: any }
function SchemaInterpreter({ type }: SchemaInterpreterProps) {
    const schema = testData[type]
    return null
}
