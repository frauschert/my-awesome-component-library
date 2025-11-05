import { renderHook } from '@testing-library/react'
import useTitle from '../useTitle'

describe('useTitle', () => {
    const originalTitle = document.title

    beforeEach(() => {
        document.title = 'Original Title'
    })

    afterEach(() => {
        document.title = originalTitle
    })

    it('should set document title', () => {
        renderHook(() => useTitle('New Title'))

        expect(document.title).toBe('New Title')
    })

    it('should update document title when changed', () => {
        const { rerender } = renderHook(({ title }) => useTitle(title), {
            initialProps: { title: 'First Title' },
        })

        expect(document.title).toBe('First Title')

        rerender({ title: 'Second Title' })
        expect(document.title).toBe('Second Title')

        rerender({ title: 'Third Title' })
        expect(document.title).toBe('Third Title')
    })

    it('should restore previous title on unmount by default', () => {
        const { unmount } = renderHook(() => useTitle('New Title'))

        expect(document.title).toBe('New Title')

        unmount()

        expect(document.title).toBe('Original Title')
    })

    it('should not restore previous title when restoreOnUnmount is false', () => {
        const { unmount } = renderHook(() =>
            useTitle('New Title', { restoreOnUnmount: false })
        )

        expect(document.title).toBe('New Title')

        unmount()

        expect(document.title).toBe('New Title')
    })

    it('should handle empty string title', () => {
        renderHook(() => useTitle(''))

        expect(document.title).toBe('')
    })

    it('should handle special characters in title', () => {
        const specialTitle = 'Title with <html> & "quotes" and émojis 🎉'
        renderHook(() => useTitle(specialTitle))

        expect(document.title).toBe(specialTitle)
    })

    it('should restore to the original title, not intermediate ones', () => {
        document.title = 'Very First Title'

        const { rerender, unmount } = renderHook(
            ({ title }) => useTitle(title),
            {
                initialProps: { title: 'Title 1' },
            }
        )

        expect(document.title).toBe('Title 1')

        rerender({ title: 'Title 2' })
        expect(document.title).toBe('Title 2')

        rerender({ title: 'Title 3' })
        expect(document.title).toBe('Title 3')

        unmount()

        // Should restore to the very first title, not intermediate ones
        expect(document.title).toBe('Very First Title')
    })

    it('should work with multiple instances (last one wins)', () => {
        const { unmount: unmount1 } = renderHook(() => useTitle('Title 1'))
        expect(document.title).toBe('Title 1')

        const { unmount: unmount2 } = renderHook(() => useTitle('Title 2'))
        expect(document.title).toBe('Title 2')

        unmount2()
        // After unmount2, title is restored to what it was before Title 2
        expect(document.title).toBe('Title 1')

        unmount1()
        // After unmount1, title is restored to original
        expect(document.title).toBe('Original Title')
    })

    it('should handle rapid title changes', () => {
        const { rerender } = renderHook(({ title }) => useTitle(title), {
            initialProps: { title: 'Title A' },
        })

        for (let i = 0; i < 100; i++) {
            rerender({ title: `Title ${i}` })
        }

        expect(document.title).toBe('Title 99')
    })

    it('should not throw when title is updated after unmount', () => {
        const { unmount } = renderHook(() => useTitle('Test Title'))

        expect(() => unmount()).not.toThrow()
        expect(document.title).toBe('Original Title')
    })
})
