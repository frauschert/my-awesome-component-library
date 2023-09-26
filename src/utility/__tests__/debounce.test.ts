import debounce from '../debounce'

// Tell Jest to mock all timeout functions
jest.useFakeTimers()

describe('debounce', () => {
    it('should debounce a function and execute it once after the delay', async () => {
        const callback = jest.fn()
        const debounced = debounce(callback, 100)

        // Call debounced function multiple times in rapid succession
        debounced()
        debounced()
        debounced()

        // Fast-forward time by 100ms
        jest.advanceTimersByTime(100)

        // Ensure that the callback was called only once
        expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should execute the callback with the latest arguments', async () => {
        const callback = jest.fn()
        const debounced = debounce(callback, 100)

        // Call debounced function multiple times with different arguments
        debounced(1)
        debounced(2)
        debounced(3)

        // Fast-forward time by 100ms
        jest.advanceTimersByTime(100)

        // Ensure that the callback was called with the latest arguments (3 in this case)
        expect(callback).toHaveBeenCalledWith(3)
    })

    it('should return a Promise with the result of the callback', async () => {
        const callback = jest.fn().mockReturnValue('result')
        const debounced = debounce(callback, 100)

        // Call debounced function and await the Promise
        const resultPromise = debounced()

        // Fast-forward time by 100ms
        jest.advanceTimersByTime(100)

        // Ensure that the resultPromise resolves to the result of the callback
        await expect(resultPromise).resolves.toBe('result')
    })

    it('should cancel the debounce if called again within the delay', async () => {
        const callback = jest.fn()
        const debounced = debounce(callback, 100)

        // Call debounced function
        debounced()

        // Call debounced function again before the delay
        debounced()

        // Fast-forward time by 50ms
        jest.advanceTimersByTime(50)

        // Ensure that the callback was not called at all (debounce canceled)
        expect(callback).not.toHaveBeenCalled()
    })
})
