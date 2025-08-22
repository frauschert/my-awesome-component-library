/**
 * A type-safe memory pool implementation that pre-allocates and reuses objects.
 * Useful for reducing garbage collection overhead and memory fragmentation.
 *
 * @template T The type of objects managed by the pool
 */
export class MemoryPool<T> {
    private pool: T[]
    private available: boolean[]
    private createFn: () => T
    private resetFn: (item: T) => void
    private size: number

    /**
     * Creates a new memory pool
     * @param createFn Function to create new instances
     * @param resetFn Function to reset instances to their initial state
     * @param initialSize Initial pool size
     */
    constructor(
        createFn: () => T,
        resetFn: (item: T) => void,
        initialSize: number = 32
    ) {
        this.createFn = createFn
        this.resetFn = resetFn
        this.size = 0
        this.pool = new Array(initialSize)
        this.available = new Array(initialSize).fill(true)

        // Pre-allocate initial objects
        for (let i = 0; i < initialSize; i++) {
            this.pool[i] = this.createFn()
            this.size++
        }
    }

    /**
     * Acquires an object from the pool or creates a new one if none are available
     */
    acquire(): T {
        // Find first available object
        let index = this.available.indexOf(true)

        // If no objects are available, grow the pool
        if (index === -1) {
            index = this.size
            this.grow()
        }

        this.available[index] = false
        return this.pool[index]
    }

    /**
     * Returns an object to the pool and resets it
     */
    release(item: T): void {
        const index = this.pool.indexOf(item)
        if (index !== -1 && !this.available[index]) {
            this.resetFn(item)
            this.available[index] = true
        }
    }

    /**
     * Grows the pool by doubling its size
     */
    private grow(): void {
        const oldSize = this.size
        const newSize = oldSize * 2

        // Extend arrays
        this.pool.length = newSize
        this.available.length = newSize

        // Fill new slots
        for (let i = oldSize; i < newSize; i++) {
            this.pool[i] = this.createFn()
            this.available[i] = true
            this.size++
        }
    }

    /**
     * Returns the number of objects currently in use
     */
    getActiveCount(): number {
        return this.available.filter((available) => !available).length
    }

    /**
     * Returns the total size of the pool
     */
    getTotalSize(): number {
        return this.size
    }

    /**
     * Returns the number of available objects
     */
    getAvailableCount(): number {
        return this.available.filter((available) => available).length
    }

    /**
     * Resets the pool to its initial state
     */
    clear(): void {
        this.available.fill(true)
    }

    /**
     * Returns an iterator over active objects in the pool
     */
    *[Symbol.iterator](): Iterator<T> {
        for (let i = 0; i < this.size; i++) {
            if (!this.available[i]) {
                yield this.pool[i]
            }
        }
    }
}
