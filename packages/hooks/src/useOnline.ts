import { useEffect, useState } from 'react'

/**
 * Hook that tracks the browser's online/offline status.
 * Returns a boolean indicating whether the browser is currently online.
 *
 * This is a simpler version of useNetwork() that only tracks online status
 * without additional connection information.
 *
 * @returns boolean - true if online, false if offline
 *
 * @example
 * ```tsx
 * function App() {
 *   const isOnline = useOnline()
 *
 *   return (
 *     <div>
 *       {!isOnline && (
 *         <Banner variant="warning">
 *           You are currently offline. Some features may be unavailable.
 *         </Banner>
 *       )}
 *       <AppContent />
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Sync data when coming back online
 * function DataSync() {
 *   const isOnline = useOnline()
 *   const prevOnline = usePrevious(isOnline)
 *
 *   useEffect(() => {
 *     if (isOnline && prevOnline === false) {
 *       // Just came back online
 *       syncDataWithServer()
 *     }
 *   }, [isOnline, prevOnline])
 *
 *   return null
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Disable features when offline
 * function CommentForm() {
 *   const isOnline = useOnline()
 *
 *   return (
 *     <form>
 *       <textarea placeholder="Write a comment..." />
 *       <Button type="submit" disabled={!isOnline}>
 *         {isOnline ? 'Post Comment' : 'Offline - Cannot Post'}
 *       </Button>
 *     </form>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Queue actions for later when offline
 * function TodoList() {
 *   const isOnline = useOnline()
 *   const [pendingActions, setPendingActions] = useState([])
 *
 *   useEffect(() => {
 *     if (isOnline && pendingActions.length > 0) {
 *       // Process pending actions
 *       pendingActions.forEach(action => processAction(action))
 *       setPendingActions([])
 *     }
 *   }, [isOnline, pendingActions])
 *
 *   const handleAddTodo = (todo) => {
 *     if (isOnline) {
 *       addTodoToServer(todo)
 *     } else {
 *       setPendingActions(prev => [...prev, { type: 'add', todo }])
 *       addTodoLocally(todo)
 *     }
 *   }
 *
 *   return <div />
 * }
 * ```
 */
export default function useOnline(): boolean {
    const getOnlineStatus = () =>
        typeof navigator !== 'undefined' &&
        typeof navigator.onLine === 'boolean'
            ? navigator.onLine
            : true

    const [online, setOnline] = useState(getOnlineStatus)

    useEffect(() => {
        const handleOnline = () => setOnline(true)
        const handleOffline = () => setOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    return online
}
