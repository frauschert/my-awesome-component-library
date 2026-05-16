import { useState, useEffect } from 'react'

export interface WindowSize {
    width: number
    height: number
}

/**
 * A hook that tracks the browser window's dimensions and updates on resize.
 * Returns an object with width and height properties.
 *
 * @returns Object with width and height of the window
 *
 * @example
 * ```tsx
 * const { width, height } = useWindowSize()
 * return <div>Window is {width}x{height}</div>
 * ```
 *
 * @example
 * ```tsx
 * const { width } = useWindowSize()
 * const isMobile = width < 768
 * ```
 */
export default function useWindowSize(): WindowSize {
    // Initialize with undefined width/height so server and client renders match
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    })

    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') {
            return
        }

        // Handler to call on window resize
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }

        // Add event listener
        window.addEventListener('resize', handleResize)

        // Call handler right away so state gets updated with initial window size
        handleResize()

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return windowSize
}
