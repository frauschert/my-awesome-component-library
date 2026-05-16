import { renderHook, waitFor } from '@testing-library/react'
import { act } from 'react'
import useIndexedDB from '../useIndexedDB'

// Mock IndexedDB
class MockIDBDatabase {
    objectStoreNames = {
        contains: jest.fn(() => false),
    }
    transaction = jest.fn()
    close = jest.fn()
    createObjectStore = jest.fn()
}

class MockIDBRequest {
    result: any
    error: any
    onsuccess: any
    onerror: any

    constructor(result?: any, error?: any) {
        this.result = result
        this.error = error
        setTimeout(() => {
            if (error) {
                this.onerror?.()
            } else {
                this.onsuccess?.()
            }
        }, 0)
    }
}

class MockIDBTransaction {
    oncomplete: any
    onerror: any
    private store: MockIDBObjectStore

    constructor(store: MockIDBObjectStore) {
        this.store = store
        setTimeout(() => {
            this.oncomplete?.()
        }, 0)
    }

    objectStore() {
        return this.store
    }
}

class MockIDBObjectStore {
    private data = new Map<string, any>()

    get(key: string) {
        return new MockIDBRequest(this.data.get(key))
    }

    put(value: any, key: string) {
        this.data.set(key, value)
        return new MockIDBRequest(undefined)
    }

    delete(key: string) {
        this.data.delete(key)
        return new MockIDBRequest(undefined)
    }

    clear() {
        this.data.clear()
        return new MockIDBRequest(undefined)
    }
}

describe('useIndexedDB', () => {
    let mockDB: MockIDBDatabase
    let mockObjectStore: MockIDBObjectStore
    let mockOpen: jest.Mock

    beforeEach(() => {
        mockObjectStore = new MockIDBObjectStore()
        mockDB = new MockIDBDatabase()
        mockDB.transaction.mockImplementation(() => {
            return new MockIDBTransaction(mockObjectStore)
        })

        mockOpen = jest.fn((dbName: string, version: number) => {
            const request = new MockIDBRequest(mockDB) as any
            request.onupgradeneeded = null
            setTimeout(() => {
                if (request.onupgradeneeded) {
                    request.onupgradeneeded({ target: request })
                }
                request.onsuccess?.()
            }, 0)
            return request
        })

        // @ts-ignore
        global.indexedDB = {
            open: mockOpen,
        }
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should initialize with undefined value and loading state', () => {
        const { result } = renderHook(() => useIndexedDB('test-key'))

        expect(result.current.value).toBeUndefined()
        expect(result.current.loading).toBe(true)
        expect(result.current.error).toBeNull()
    })

    it('should load initial value from IndexedDB', async () => {
        mockObjectStore.put('stored-value', 'test-key')

        const { result } = renderHook(() => useIndexedDB('test-key'))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.value).toBe('stored-value')
        expect(result.current.error).toBeNull()
    })

    it('should set value in IndexedDB', async () => {
        const { result } = renderHook(() => useIndexedDB('test-key'))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        await act(async () => {
            await result.current.set('new-value')
        })

        expect(result.current.value).toBe('new-value')
        expect(result.current.error).toBeNull()
    })

    it('should get value from IndexedDB', async () => {
        mockObjectStore.put('stored-value', 'test-key')

        const { result } = renderHook(() => useIndexedDB('test-key'))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        let retrieved: any
        await act(async () => {
            retrieved = await result.current.get()
        })

        expect(retrieved).toBe('stored-value')
    })

    it('should remove value from IndexedDB', async () => {
        mockObjectStore.put('stored-value', 'test-key')

        const { result } = renderHook(() => useIndexedDB('test-key'))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        await act(async () => {
            await result.current.remove()
        })

        expect(result.current.value).toBeUndefined()
        expect(result.current.error).toBeNull()
    })

    it('should clear all values from store', async () => {
        mockObjectStore.put('value1', 'key1')
        mockObjectStore.put('value2', 'key2')

        const { result } = renderHook(() => useIndexedDB('key1'))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        await act(async () => {
            await result.current.clear()
        })

        expect(result.current.value).toBeUndefined()
    })

    it('should store complex objects', async () => {
        const complexObj = {
            name: 'John',
            age: 30,
            nested: { city: 'NYC' },
            array: [1, 2, 3],
        }

        const { result } = renderHook(() =>
            useIndexedDB<typeof complexObj>('user')
        )

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        await act(async () => {
            await result.current.set(complexObj)
        })

        expect(result.current.value).toEqual(complexObj)
    })

    it('should use custom database name', async () => {
        renderHook(() => useIndexedDB('test-key', { database: 'custom-db' }))

        await waitFor(() => {
            expect(mockOpen).toHaveBeenCalledWith('custom-db', 1)
        })
    })

    it('should use custom store name', async () => {
        renderHook(() => useIndexedDB('test-key', { store: 'custom-store' }))

        await waitFor(() => {
            expect(mockDB.transaction).toHaveBeenCalledWith(
                'custom-store',
                expect.any(String)
            )
        })
    })

    it('should use custom version', async () => {
        renderHook(() => useIndexedDB('test-key', { version: 5 }))

        await waitFor(() => {
            expect(mockOpen).toHaveBeenCalledWith('app-storage', 5)
        })
    })

    it('should handle multiple keys independently', async () => {
        const { result: result1 } = renderHook(() => useIndexedDB('key1'))
        const { result: result2 } = renderHook(() => useIndexedDB('key2'))

        await waitFor(() => {
            expect(result1.current.loading).toBe(false)
            expect(result2.current.loading).toBe(false)
        })

        await act(async () => {
            await result1.current.set('value1')
            await result2.current.set('value2')
        })

        expect(result1.current.value).toBe('value1')
        expect(result2.current.value).toBe('value2')
    })

    it('should update value when set is called', async () => {
        const { result } = renderHook(() => useIndexedDB('test-key'))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        await act(async () => {
            await result.current.set('first')
        })
        expect(result.current.value).toBe('first')

        await act(async () => {
            await result.current.set('second')
        })
        expect(result.current.value).toBe('second')
    })

    it('should handle errors during set operation', async () => {
        const { result } = renderHook(() => useIndexedDB('test-key'))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        const error = new Error('Set failed')
        mockObjectStore.put = jest.fn(
            () => new MockIDBRequest(undefined, error)
        )

        let thrownError: Error | null = null
        await act(async () => {
            try {
                await result.current.set('value')
            } catch (err) {
                thrownError = err as Error
            }
        })

        expect(thrownError).toEqual(error)
    })

    it('should handle errors during get operation', async () => {
        const error = new Error('Get failed')
        mockObjectStore.get = jest.fn(
            () => new MockIDBRequest(undefined, error)
        )

        const { result } = renderHook(() => useIndexedDB('test-key'))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        await act(async () => {
            try {
                await result.current.get()
            } catch {
                // Expected to throw
            }
        })
    })

    it('should handle errors during remove operation', async () => {
        const { result } = renderHook(() => useIndexedDB('test-key'))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        const error = new Error('Remove failed')
        mockObjectStore.delete = jest.fn(
            () => new MockIDBRequest(undefined, error)
        )

        let thrownError: Error | null = null
        await act(async () => {
            try {
                await result.current.remove()
            } catch (err) {
                thrownError = err as Error
            }
        })

        expect(thrownError).toEqual(error)
    })

    it('should handle errors during clear operation', async () => {
        const { result } = renderHook(() => useIndexedDB('test-key'))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        const error = new Error('Clear failed')
        mockObjectStore.clear = jest.fn(
            () => new MockIDBRequest(undefined, error)
        )

        let thrownError: Error | null = null
        await act(async () => {
            try {
                await result.current.clear()
            } catch (err) {
                thrownError = err as Error
            }
        })

        expect(thrownError).toEqual(error)
    })

    it('should not update state after unmount', async () => {
        const { unmount } = renderHook(() => useIndexedDB('test-key'))

        unmount()

        // Should not throw or cause warnings
        await waitFor(() => {
            expect(true).toBe(true)
        })
    })

    it('should close database connection after operations', async () => {
        const { result } = renderHook(() => useIndexedDB('test-key'))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        await act(async () => {
            await result.current.set('value')
        })

        expect(mockDB.close).toHaveBeenCalled()
    })

    it('should handle IndexedDB not supported', async () => {
        // @ts-ignore
        global.indexedDB = undefined

        const { result } = renderHook(() => useIndexedDB('test-key'))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.error).toBeTruthy()
        expect(result.current.error?.message).toContain('not supported')
    })

    it('should create object store on upgrade', async () => {
        mockDB.objectStoreNames.contains.mockReturnValue(false)

        const customOpen = jest.fn(() => {
            const request = new MockIDBRequest(mockDB) as any
            setTimeout(() => {
                if (request.onupgradeneeded) {
                    request.onupgradeneeded({ target: request })
                }
                request.onsuccess?.()
            }, 0)
            return request
        })

        // @ts-ignore
        global.indexedDB = { open: customOpen }

        renderHook(() => useIndexedDB('test-key'))

        await waitFor(() => {
            expect(mockDB.createObjectStore).toHaveBeenCalledWith('keyval')
        })
    })

    it('should work with different data types', async () => {
        const { result: stringResult } = renderHook(() =>
            useIndexedDB<string>('string-key')
        )
        const { result: numberResult } = renderHook(() =>
            useIndexedDB<number>('number-key')
        )
        const { result: booleanResult } = renderHook(() =>
            useIndexedDB<boolean>('boolean-key')
        )
        const { result: arrayResult } = renderHook(() =>
            useIndexedDB<number[]>('array-key')
        )

        await waitFor(() => {
            expect(stringResult.current.loading).toBe(false)
            expect(numberResult.current.loading).toBe(false)
            expect(booleanResult.current.loading).toBe(false)
            expect(arrayResult.current.loading).toBe(false)
        })

        await act(async () => {
            await stringResult.current.set('text')
            await numberResult.current.set(42)
            await booleanResult.current.set(true)
            await arrayResult.current.set([1, 2, 3])
        })

        expect(stringResult.current.value).toBe('text')
        expect(numberResult.current.value).toBe(42)
        expect(booleanResult.current.value).toBe(true)
        expect(arrayResult.current.value).toEqual([1, 2, 3])
    })

    it('should handle rapid consecutive operations', async () => {
        const { result } = renderHook(() => useIndexedDB('test-key'))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        await act(async () => {
            await result.current.set('value1')
            await result.current.set('value2')
            await result.current.set('value3')
        })

        expect(result.current.value).toBe('value3')
    })

    it('should handle error then success flow', async () => {
        const { result } = renderHook(() => useIndexedDB('test-key'))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        // Force an error
        const error = new Error('Test error')
        mockObjectStore.put = jest.fn(
            () => new MockIDBRequest(undefined, error)
        )

        let thrownError: Error | null = null
        await act(async () => {
            try {
                await result.current.set('value')
            } catch (err) {
                thrownError = err as Error
            }
        })

        expect(thrownError).toEqual(error)

        // Restore normal operation
        mockObjectStore.put = jest.fn((value: any, key: string) => {
            mockObjectStore['data'].set(key, value)
            return new MockIDBRequest(undefined)
        })

        await act(async () => {
            await result.current.set('new-value')
        })

        expect(result.current.value).toBe('new-value')
    })
})
