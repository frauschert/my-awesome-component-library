import { renderHook } from '@testing-library/react'
import useDidUpdate from '../useDidUpdate'

describe('useDidUpdate', () => {
    it('should not call effect on first render', () => {
        const effect = jest.fn()
        renderHook(() => useDidUpdate(effect))
        expect(effect).toHaveBeenCalledTimes(0)
    })

    it('should call effect on second and subsequent renders', () => {
        const effect = jest.fn()
        const { rerender } = renderHook(() => useDidUpdate(effect))
        expect(effect).toHaveBeenCalledTimes(0)

        rerender()
        expect(effect).toHaveBeenCalledTimes(1)

        rerender()
        expect(effect).toHaveBeenCalledTimes(2)
    })

    it('should call effect with new deps on subsequent renders', () => {
        const effect = jest.fn()
        const { rerender } = renderHook(
            ({ deps }) => useDidUpdate(effect, deps),
            {
                initialProps: { deps: [1, 2, 3] },
            }
        )
        expect(effect).toHaveBeenCalledTimes(0)

        rerender({ deps: [1, 2, 3] })
        expect(effect).toHaveBeenCalledTimes(0)

        rerender({ deps: [4, 5, 6] })
        expect(effect).toHaveBeenCalledTimes(1)

        rerender({ deps: [4, 5, 6] })
        expect(effect).toHaveBeenCalledTimes(1)

        rerender({ deps: [7, 8, 9] })
        expect(effect).toHaveBeenCalledTimes(2)
    })
})
