import React, { useReducer } from 'react'
import { schema } from './useSchema'
import mySchema from './schema.json'

// const { BuildJob } = schema({
//     BuildJob: {
//         description: '',
//         gui: {
//             label: 'Build job',
//         },
//         properties: {
//             someId: { type: 'number', description: 'some text' },
//             someOtherField: { type: 'boolean', description: '' },
//         },
//     },
// })

// const { SomeId, SomeOtherField } = BuildJob.properties

const { Instance, SomeElement } = schema(mySchema)

const { Name, SomeId, Priority, Index } = Instance.properties
const { Name: SomeElementName } = SomeElement.properties

const MyClassComponent = () => {
    return (
        <>
            <form onSubmit={(e) => console.log(e.currentTarget)}>
                <SomeId value={1} onChange={} />
            </form>
        </>
    )
}
