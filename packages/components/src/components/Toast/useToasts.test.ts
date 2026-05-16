import { renderHook, act } from '@testing-library/react'
import { useToasts } from './useToasts'

describe('useToasts', () => {
    it('should add a toast', () => {
        const { result } = renderHook(() => useToasts())

        act(() => {
            result.current[1]({ content: 'Test Toast' })
        })

        expect(result.current[0].length).toBe(1)
        expect(result.current[0][0].content).toBe('Test Toast')
    })

    it('should remove a toast', () => {
        const { result } = renderHook(() => useToasts())

        act(() => {
            result.current[1]({ content: 'Toast 1' })
            result.current[1]({ content: 'Toast 2' })
            result.current[1]({ content: 'Toast 3' })
        })

        const toastToRemove = result.current[0][1] // Get the second toast
        const toastIdToRemove = toastToRemove.id

        act(() => {
            result.current[2](toastIdToRemove)
        })

        expect(result.current[0].length).toBe(2)
        expect(result.current[0].map((toast) => toast.content)).toEqual([
            'Toast 1',
            'Toast 3',
        ])
    })
})
