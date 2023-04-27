import { renderHook } from '@testing-library/react'
import useScrollIntoView from '../useScrollIntoView'
import { useRef } from 'react'

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
