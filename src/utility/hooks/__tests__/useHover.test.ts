import { fireEvent, renderHook } from '@testing-library/react'
import { useRef } from 'react'
import useHover from '../useHover'

describe('useHover', () => {
    test('should toggle on mouseover', () => {
        const divElement = document.createElement('div')

        const { result } = renderHook(() => {
            const divRef = useRef(divElement)
            return useHover(divRef)
        })

        expect(result.current).toBe(false)

        fireEvent.mouseOver(divElement)

        expect(result.current).toBe(true)
    })
})
