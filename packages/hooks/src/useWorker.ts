import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseWorkerOptions {
    autoTerminate?: boolean // default: true
    timeout?: number // optional timeout in ms
}

export interface UseWorkerReturn<T = unknown> {
    data: T | null
    error: Error | null
    loading: boolean
    postMessage: (message: unknown) => void
    terminate: () => void
}

/**
 * Hook for integrating Web Workers with React.
 * Manages worker lifecycle, message passing, and error handling.
 *
 * @param workerFn - Worker function or Worker instance
 * @param options - Configuration options
 * @returns Object with data, error, loading state, and worker controls
 *
 * @example
 * ```tsx
 * const worker = useWorker((data) => {
 *   // Heavy computation
 *   return data.map(x => x * 2)
 * })
 *
 * worker.postMessage([1, 2, 3])
 * ```
 */
export default function useWorker<T = unknown, P = unknown>(
    workerFn: ((data: P) => T) | (() => Worker) | Worker,
    options: UseWorkerOptions = {}
): UseWorkerReturn<T> {
    const { autoTerminate = true, timeout } = options

    const [data, setData] = useState<T | null>(null)
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState(false)

    const workerRef = useRef<Worker | null>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const workerFnRef = useRef(workerFn)

    // Update the ref when workerFn changes
    useEffect(() => {
        workerFnRef.current = workerFn
    }, [workerFn])

    // Initialize worker (only once on mount)
    useEffect(() => {
        if (typeof window === 'undefined' || !window.Worker) {
            setError(new Error('Web Workers not supported'))
            return
        }

        // Create worker from function
        const createWorkerFromFunction = (fn: (data: P) => T): Worker => {
            const blob = new Blob(
                [
                    `
                self.onmessage = function(e) {
                    try {
                        const result = (${fn.toString()})(e.data);
                        self.postMessage({ type: 'success', data: result });
                    } catch (error) {
                        self.postMessage({ 
                            type: 'error', 
                            error: error.message || String(error) 
                        });
                    }
                };
            `,
                ],
                { type: 'application/javascript' }
            )
            return new Worker(URL.createObjectURL(blob))
        }

        try {
            let worker: Worker

            const fn = workerFnRef.current

            if (fn instanceof Worker) {
                worker = fn
            } else if (typeof fn === 'function') {
                // Check if it's a factory function that returns a Worker
                const result = (fn as () => Worker)()
                if (result instanceof Worker) {
                    worker = result
                } else {
                    // It's a computation function
                    worker = createWorkerFromFunction(fn as (data: P) => T)
                }
            } else {
                throw new Error('Invalid worker function')
            }

            workerRef.current = worker

            // Handle messages from worker
            worker.onmessage = (e: MessageEvent) => {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current)
                    timeoutRef.current = null
                }

                setLoading(false)

                const message = e.data

                // Handle structured messages
                if (
                    message &&
                    typeof message === 'object' &&
                    'type' in message
                ) {
                    if (message.type === 'success') {
                        setData(message.data)
                        setError(null)
                    } else if (message.type === 'error') {
                        setError(new Error(message.error))
                        setData(null)
                    } else {
                        setData(message as T)
                        setError(null)
                    }
                } else {
                    // Handle raw messages
                    setData(message as T)
                    setError(null)
                }
            }

            // Handle worker errors
            worker.onerror = (e: ErrorEvent) => {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current)
                    timeoutRef.current = null
                }

                setLoading(false)
                setError(new Error(e.message || 'Worker error'))
                setData(null)
            }
        } catch (err) {
            setError(err as Error)
        }

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }

            if (workerRef.current) {
                if (autoTerminate) {
                    workerRef.current.terminate()
                }
                workerRef.current = null
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Only run once on mount

    // Post message to worker
    const postMessage = useCallback(
        (message: unknown) => {
            if (!workerRef.current) {
                setError(new Error('Worker not initialized'))
                return
            }

            setLoading(true)
            setError(null)

            // Set timeout if specified
            if (timeout) {
                timeoutRef.current = setTimeout(() => {
                    setLoading(false)
                    setError(new Error('Worker timeout'))
                    if (workerRef.current && autoTerminate) {
                        workerRef.current.terminate()
                        workerRef.current = null
                    }
                }, timeout)
            }

            try {
                workerRef.current.postMessage(message)
            } catch (err) {
                setLoading(false)
                setError(err as Error)
            }
        },
        [timeout, autoTerminate]
    )

    // Terminate worker
    const terminate = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }

        if (workerRef.current) {
            workerRef.current.terminate()
            workerRef.current = null
            setLoading(false)
        }
    }, [])

    return {
        data,
        error,
        loading,
        postMessage,
        terminate,
    }
}
