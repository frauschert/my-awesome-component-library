import { useCallback, useEffect, useState } from 'react'

/**
 * Hook that manages the URL hash.
 * Returns the current hash and a function to update it.
 *
 * @returns A tuple of [hash, setHash] where hash is the current hash (without #) and setHash updates it
 *
 * @example
 * const [hash, setHash] = useHash()
 * // hash = "section1"
 * setHash("section2") // Updates URL to #section2
 * setHash("") // Removes hash from URL
 *
 * @example
 * // Navigate between sections
 * function TabNavigation() {
 *   const [hash, setHash] = useHash()
 *   const activeTab = hash || 'overview'
 *
 *   return (
 *     <div>
 *       <button onClick={() => setHash('overview')}>Overview</button>
 *       <button onClick={() => setHash('details')}>Details</button>
 *       {activeTab === 'overview' && <OverviewTab />}
 *       {activeTab === 'details' && <DetailsTab />}
 *     </div>
 *   )
 * }
 */
export default function useHash(): [string, (newHash: string) => void] {
    const getHash = useCallback(() => {
        if (typeof window === 'undefined') return ''
        const hash = window.location.hash
        return hash.startsWith('#') ? hash.slice(1) : hash
    }, [])

    const [hash, setHashState] = useState(getHash)

    const setHash = useCallback((newHash: string) => {
        if (typeof window === 'undefined') return

        if (newHash === '') {
            // Remove hash from URL
            window.history.pushState(
                null,
                '',
                window.location.pathname + window.location.search
            )
        } else {
            // Add or update hash
            const hashValue = newHash.startsWith('#')
                ? newHash.slice(1)
                : newHash
            window.location.hash = hashValue
        }
    }, [])

    useEffect(() => {
        const handleHashChange = () => {
            setHashState(getHash())
        }

        // Listen for hash changes (both via setHash and browser navigation)
        window.addEventListener('hashchange', handleHashChange)

        return () => {
            window.removeEventListener('hashchange', handleHashChange)
        }
    }, [getHash])

    return [hash, setHash]
}
