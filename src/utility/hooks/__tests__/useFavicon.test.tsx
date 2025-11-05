import { renderHook } from '@testing-library/react'
import useFavicon from '../useFavicon'

describe('useFavicon', () => {
    let originalFavicon: HTMLLinkElement | null

    beforeEach(() => {
        // Clean up any existing favicon links
        document
            .querySelectorAll('link[rel*="icon"]')
            .forEach((el) => el.remove())

        // Create a default favicon
        const link = document.createElement('link')
        link.rel = 'icon'
        link.href = '/original-favicon.ico'
        document.head.appendChild(link)
        originalFavicon = link
    })

    afterEach(() => {
        // Clean up
        document
            .querySelectorAll('link[rel*="icon"]')
            .forEach((el) => el.remove())

        // Restore original if it exists
        if (originalFavicon) {
            document.head.appendChild(originalFavicon)
        }
    })

    it('should set favicon', () => {
        renderHook(() => useFavicon('/new-favicon.ico'))

        const link =
            document.querySelector<HTMLLinkElement>('link[rel*="icon"]')
        expect(link).not.toBeNull()
        expect(link?.href).toContain('/new-favicon.ico')
    })

    it('should update favicon when changed', () => {
        const { rerender } = renderHook(({ href }) => useFavicon(href), {
            initialProps: { href: '/favicon-1.ico' },
        })

        let link = document.querySelector<HTMLLinkElement>('link[rel*="icon"]')
        expect(link?.href).toContain('/favicon-1.ico')

        rerender({ href: '/favicon-2.ico' })
        link = document.querySelector<HTMLLinkElement>('link[rel*="icon"]')
        expect(link?.href).toContain('/favicon-2.ico')
    })

    it('should restore previous favicon on unmount by default', () => {
        const { unmount } = renderHook(() => useFavicon('/new-favicon.ico'))

        let link = document.querySelector<HTMLLinkElement>('link[rel*="icon"]')
        expect(link?.href).toContain('/new-favicon.ico')

        unmount()

        link = document.querySelector<HTMLLinkElement>('link[rel*="icon"]')
        expect(link?.href).toContain('/original-favicon.ico')
    })

    it('should not restore previous favicon when restoreOnUnmount is false', () => {
        const { unmount } = renderHook(() =>
            useFavicon('/new-favicon.ico', { restoreOnUnmount: false })
        )

        let link = document.querySelector<HTMLLinkElement>('link[rel*="icon"]')
        expect(link?.href).toContain('/new-favicon.ico')

        unmount()

        link = document.querySelector<HTMLLinkElement>('link[rel*="icon"]')
        expect(link?.href).toContain('/new-favicon.ico')
    })

    it('should set custom rel attribute', () => {
        renderHook(() => useFavicon('/icon.png', { rel: 'shortcut icon' }))

        const link = document.querySelector<HTMLLinkElement>(
            'link[rel*="shortcut icon"]'
        )
        expect(link).not.toBeNull()
        expect(link?.href).toContain('/icon.png')
    })

    it('should set type attribute', () => {
        renderHook(() => useFavicon('/icon.svg', { type: 'image/svg+xml' }))

        const link =
            document.querySelector<HTMLLinkElement>('link[rel*="icon"]')
        expect(link?.type).toBe('image/svg+xml')
    })

    it('should work with data URLs', () => {
        const dataUrl =
            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>'
        renderHook(() => useFavicon(dataUrl))

        const link =
            document.querySelector<HTMLLinkElement>('link[rel*="icon"]')
        expect(link?.href).toBe(dataUrl)
    })

    it('should work with SVG favicon', () => {
        renderHook(() =>
            useFavicon('/icon.svg', {
                type: 'image/svg+xml',
                rel: 'icon',
            })
        )

        const link =
            document.querySelector<HTMLLinkElement>('link[rel*="icon"]')
        expect(link?.href).toContain('/icon.svg')
        expect(link?.type).toBe('image/svg+xml')
    })

    it('should create favicon link if none exists', () => {
        // Remove all favicon links
        document
            .querySelectorAll('link[rel*="icon"]')
            .forEach((el) => el.remove())

        renderHook(() => useFavicon('/new-favicon.ico'))

        const link =
            document.querySelector<HTMLLinkElement>('link[rel*="icon"]')
        expect(link).not.toBeNull()
        expect(link?.href).toContain('/new-favicon.ico')
    })

    it('should handle multiple rapid changes', () => {
        const { rerender } = renderHook(({ href }) => useFavicon(href), {
            initialProps: { href: '/favicon-0.ico' },
        })

        for (let i = 1; i <= 10; i++) {
            rerender({ href: `/favicon-${i}.ico` })
        }

        const link =
            document.querySelector<HTMLLinkElement>('link[rel*="icon"]')
        expect(link?.href).toContain('/favicon-10.ico')
    })

    it('should work with PNG favicon', () => {
        renderHook(() => useFavicon('/favicon.png', { type: 'image/png' }))

        const link =
            document.querySelector<HTMLLinkElement>('link[rel*="icon"]')
        expect(link?.href).toContain('/favicon.png')
        expect(link?.type).toBe('image/png')
    })

    it('should handle absolute URLs', () => {
        renderHook(() => useFavicon('https://example.com/favicon.ico'))

        const link =
            document.querySelector<HTMLLinkElement>('link[rel*="icon"]')
        expect(link?.href).toBe('https://example.com/favicon.ico')
    })

    it('should restore original favicon attributes including type', () => {
        // Set up original favicon with type
        document
            .querySelectorAll('link[rel*="icon"]')
            .forEach((el) => el.remove())
        const original = document.createElement('link')
        original.rel = 'icon'
        original.href = '/original.png'
        original.type = 'image/png'
        document.head.appendChild(original)

        const { unmount } = renderHook(() =>
            useFavicon('/temp.svg', { type: 'image/svg+xml' })
        )

        let link = document.querySelector<HTMLLinkElement>('link[rel*="icon"]')
        expect(link?.href).toContain('/temp.svg')
        expect(link?.type).toBe('image/svg+xml')

        unmount()

        link = document.querySelector<HTMLLinkElement>('link[rel*="icon"]')
        expect(link?.href).toContain('/original.png')
        expect(link?.type).toBe('image/png')
    })

    it('should not throw when updated after unmount', () => {
        const { unmount } = renderHook(() => useFavicon('/test-favicon.ico'))

        expect(() => unmount()).not.toThrow()
    })
})
