import { renderHook } from '@testing-library/react'
import { useRef } from 'react'
import useScrollIntoView from '../useScrollIntoView'

describe('useScrollIntoView', () => {
    test('scrollIntoView should be called', () => {
        const scrollIntoView = jest.fn()
        Element.prototype.scrollIntoView = scrollIntoView

        const divElement = document.createElement('div')

        renderHook(() => {
            const divRef = useRef(divElement)
            useScrollIntoView(divRef)
        })

        expect(scrollIntoView).toHaveBeenCalled()
    })
})
