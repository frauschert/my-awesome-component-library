import React from 'react'
import { useSchema } from './useSchema'

const MyComponent = () => {
    const { SomeId, SomeOtherField } = useSchema({
        someId: { type: 'number', description: 'some text' },
        someOtherField: { type: 'boolean', description: '' },
    })
    return (
        <>
            <SomeId value={1} min={1} />
            <SomeOtherField checked={true} />
        </>
    )
}
