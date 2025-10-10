import debounce from '../debounce'

jest.useFakeTimers()

describe('debounce', () => {
    afterEach(() => {
        jest.clearAllTimers()
    })

    it('should debounce a function and execute it once after the delay', () => {
        const callback = jest.fn()
        const debounced = debounce(callback, 100)

        debounced()
        debounced()
        debounced()

        expect(callback).not.toHaveBeenCalled()

        jest.advanceTimersByTime(100)

        expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should execute the callback with the latest arguments', () => {
        const callback = jest.fn()
        const debounced = debounce(callback, 100)

        debounced(1)
        debounced(2)
        debounced(3)

        jest.advanceTimersByTime(100)

        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith(3)
    })

    it('should reset the timer if called again within the delay', () => {
        const callback = jest.fn()
        const debounced = debounce(callback, 100)

        debounced()
        jest.advanceTimersByTime(50)
        debounced()
        jest.advanceTimersByTime(50)

        expect(callback).not.toHaveBeenCalled()

        jest.advanceTimersByTime(50)

        expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should cancel pending execution with cancel()', () => {
        const callback = jest.fn()
        const debounced = debounce(callback, 100)

        debounced()
        debounced.cancel()

        jest.advanceTimersByTime(100)

        expect(callback).not.toHaveBeenCalled()
    })

    it('should handle multiple cancel calls safely', () => {
        const callback = jest.fn()
        const debounced = debounce(callback, 100)

        debounced()
        debounced.cancel()
        debounced.cancel()

        jest.advanceTimersByTime(100)

        expect(callback).not.toHaveBeenCalled()
    })

    it('should execute immediately with flush()', () => {
        const callback = jest.fn()
        const debounced = debounce(callback, 100)

        debounced('test')
        debounced.flush()

        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith('test')
    })

    it('should not execute on flush if no pending call', () => {
        const callback = jest.fn()
        const debounced = debounce(callback, 100)

        debounced.flush()

        expect(callback).not.toHaveBeenCalled()
    })

    it('should flush with latest arguments', () => {
        const callback = jest.fn()
        const debounced = debounce(callback, 100)

        debounced(1)
        debounced(2)
        debounced(3)
        debounced.flush()

        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith(3)
    })

    it('should not execute after flush and timer expires', () => {
        const callback = jest.fn()
        const debounced = debounce(callback, 100)

        debounced()
        debounced.flush()

        jest.advanceTimersByTime(100)

        expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should work with default delay', () => {
        const callback = jest.fn()
        const debounced = debounce(callback)

        debounced()

        jest.advanceTimersByTime(499)
        expect(callback).not.toHaveBeenCalled()

        jest.advanceTimersByTime(1)
        expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should preserve function context and arguments', () => {
        const callback = jest.fn()
        const debounced = debounce(callback, 100)

        debounced('arg1', 'arg2', 'arg3')

        jest.advanceTimersByTime(100)

        expect(callback).toHaveBeenCalledWith('arg1', 'arg2', 'arg3')
    })

    it('should work with multiple independent debounced functions', () => {
        const callback1 = jest.fn()
        const callback2 = jest.fn()
        const debounced1 = debounce(callback1, 100)
        const debounced2 = debounce(callback2, 200)

        debounced1()
        debounced2()

        jest.advanceTimersByTime(100)
        expect(callback1).toHaveBeenCalledTimes(1)
        expect(callback2).not.toHaveBeenCalled()

        jest.advanceTimersByTime(100)
        expect(callback2).toHaveBeenCalledTimes(1)
    })

    it('should handle rapid successive calls', () => {
        const callback = jest.fn()
        const debounced = debounce(callback, 100)

        for (let i = 0; i < 100; i++) {
            debounced(i)
        }

        jest.advanceTimersByTime(100)

        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith(99)
    })
})
