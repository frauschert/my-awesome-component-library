export class RingBuffer<T> {
    private buffer: Array<T | undefined>
    private writePtr: number = 0
    private readPtr: number = 0
    private size: number = 0

    constructor(private capacity: number) {
        this.buffer = new Array(capacity)
    }

    /**
     * Adds an item to the buffer. If the buffer is full,
     * it will overwrite the oldest item.
     */
    enqueue(item: T): boolean {
        const isFull = this.size === this.capacity

        this.buffer[this.writePtr] = item
        this.writePtr = (this.writePtr + 1) % this.capacity

        if (!isFull) {
            this.size++
            return true
        }

        // If buffer is full, move read pointer as well
        this.readPtr = this.writePtr
        return false
    }

    /**
     * Removes and returns the oldest item from the buffer.
     * Returns undefined if the buffer is empty.
     */
    dequeue(): T | undefined {
        if (this.isEmpty()) {
            return undefined
        }

        const item = this.buffer[this.readPtr]
        this.buffer[this.readPtr] = undefined
        this.readPtr = (this.readPtr + 1) % this.capacity
        this.size--

        return item
    }

    /**
     * Returns the oldest item without removing it
     */
    peek(): T | undefined {
        if (this.isEmpty()) {
            return undefined
        }
        return this.buffer[this.readPtr]
    }

    /**
     * Returns all items in the buffer in order, without removing them
     */
    toArray(): T[] {
        const result: T[] = []
        let count = 0
        let current = this.readPtr

        while (count < this.size) {
            if (this.buffer[current] !== undefined) {
                result.push(this.buffer[current] as T)
            }
            current = (current + 1) % this.capacity
            count++
        }

        return result
    }

    isFull(): boolean {
        return this.size === this.capacity
    }

    isEmpty(): boolean {
        return this.size === 0
    }

    get length(): number {
        return this.size
    }

    clear(): void {
        this.buffer = new Array(this.capacity)
        this.writePtr = 0
        this.readPtr = 0
        this.size = 0
    }

    [Symbol.iterator](): Iterator<T> {
        let count = 0
        let current = this.readPtr

        return {
            next: (): IteratorResult<T> => {
                if (count >= this.size) {
                    return { done: true, value: undefined }
                }

                const value = this.buffer[current] as T
                current = (current + 1) % this.capacity
                count++

                return { done: false, value }
            },
        }
    }
}
