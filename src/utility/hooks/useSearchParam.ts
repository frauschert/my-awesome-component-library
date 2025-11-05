import { useCallback, useEffect, useState } from 'react'

/**
 * Hook that manages a single URL search parameter.
 * Returns the current value and a function to update it.
 *
 * @param key - The search parameter key to manage
 * @returns A tuple of [value, setValue] where value is the current parameter value and setValue updates it
 *
 * @example
 * const [search, setSearch] = useSearchParam('q')
 * // URL: ?q=hello -> search = "hello"
 * setSearch('world') // Updates URL to ?q=world
 * setSearch(null) // Removes ?q from URL
 *
 * @example
 * // Pagination
 * function PaginatedList() {
 *   const [page, setPage] = useSearchParam('page')
 *   const currentPage = parseInt(page || '1')
 *
 *   return (
 *     <div>
 *       <button onClick={() => setPage(String(currentPage - 1))}>Previous</button>
 *       <button onClick={() => setPage(String(currentPage + 1))}>Next</button>
 *     </div>
 *   )
 * }
 */
export default function useSearchParam(
    key: string
): [string | null, (value: string | null) => void] {
    const getParam = useCallback(() => {
        if (typeof window === 'undefined') return null
        const params = new URLSearchParams(window.location.search)
        return params.get(key)
    }, [key])

    const [value, setValue] = useState<string | null>(getParam)

    const setParam = useCallback(
        (newValue: string | null) => {
            if (typeof window === 'undefined') return

            const url = new URL(window.location.href)
            const params = url.searchParams

            if (newValue === null || newValue === '') {
                params.delete(key)
            } else {
                params.set(key, newValue)
            }

            // Update URL without reloading the page
            const newUrl =
                url.pathname +
                (params.toString() ? `?${params.toString()}` : '')
            window.history.pushState({}, '', newUrl + url.hash)

            // Trigger popstate event for other instances to sync
            window.dispatchEvent(new PopStateEvent('popstate'))
        },
        [key]
    )

    useEffect(() => {
        const handleChange = () => {
            setValue(getParam())
        }

        // Listen for URL changes (including browser navigation and updates from other instances)
        window.addEventListener('popstate', handleChange)

        return () => {
            window.removeEventListener('popstate', handleChange)
        }
    }, [getParam])

    return [value, setParam]
}
