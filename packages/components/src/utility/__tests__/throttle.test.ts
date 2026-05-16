import { throttle } from '../throttle'

describe('throttle', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    it('should execute immediately on first call (leading=true by default)', () => {
        const fn = jest.fn()
        const throttled = throttle(fn, 1000)

        throttled()
        expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should not execute again within throttle period', () => {
        const fn = jest.fn()
        const throttled = throttle(fn, 1000)

        throttled()
        throttled()
        throttled()

        expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should execute again after throttle period', () => {
        const fn = jest.fn()
        const throttled = throttle(fn, 1000)

        throttled()
        expect(fn).toHaveBeenCalledTimes(1)

        jest.advanceTimersByTime(1000)
        throttled()
        expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should pass arguments to the function', () => {
        const fn = jest.fn((a: number, b: string) => `${a}-${b}`)
        const throttled = throttle(fn, 1000)

        throttled(5, 'test')
        expect(fn).toHaveBeenCalledWith(5, 'test')
    })

    it('should return the result of the function', () => {
        const fn = jest.fn((x: number) => x * 2)
        const throttled = throttle(fn, 1000)

        const result = throttled(5)
        expect(result).toBe(10)
    })

    it('should return last result when throttled', () => {
        const fn = jest.fn((x: number) => x * 2)
        const throttled = throttle(fn, 1000)

        const result1 = throttled(5)
        const result2 = throttled(10)

        expect(result1).toBe(10)
        expect(result2).toBe(10) // Still returns first result
        expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should work with leading=false', () => {
        const fn = jest.fn()
        const throttled = throttle(fn, 1000, { leading: false })

        throttled()
        expect(fn).not.toHaveBeenCalled()
    })

    it('should execute on trailing edge when trailing=true', () => {
        const fn = jest.fn((x: number) => x)
        const throttled = throttle(fn, 1000, { trailing: true })

        throttled(1)
        throttled(2)
        throttled(3)

        expect(fn).toHaveBeenCalledTimes(1)
        expect(fn).toHaveBeenCalledWith(1)

        jest.advanceTimersByTime(1000)

        expect(fn).toHaveBeenCalledTimes(2)
        expect(fn).toHaveBeenCalledWith(3) // Last call
    })

    it('should execute only on trailing edge when leading=false, trailing=true', () => {
        const fn = jest.fn((x: number) => x)
        const throttled = throttle(fn, 1000, { leading: false, trailing: true })

        throttled(1)
        throttled(2)
        throttled(3)

        expect(fn).not.toHaveBeenCalled()

        jest.advanceTimersByTime(1000)

        expect(fn).toHaveBeenCalledTimes(1)
        expect(fn).toHaveBeenCalledWith(3)
    })

    it('should update trailing call with latest arguments', () => {
        const fn = jest.fn((x: number) => x)
        const throttled = throttle(fn, 1000, { trailing: true })

        throttled(1)
        jest.advanceTimersByTime(500)
        throttled(2)
        jest.advanceTimersByTime(300)
        throttled(3)

        expect(fn).toHaveBeenCalledTimes(1)
        expect(fn).toHaveBeenCalledWith(1)

        jest.advanceTimersByTime(700) // Total 1500ms

        expect(fn).toHaveBeenCalledTimes(2)
        expect(fn).toHaveBeenCalledWith(3) // Last arguments
    })

    it('should cancel pending trailing execution', () => {
        const fn = jest.fn()
        const throttled = throttle(fn, 1000, { trailing: true })

        throttled()
        throttled()
        expect(fn).toHaveBeenCalledTimes(1)

        throttled.cancel()
        jest.advanceTimersByTime(1000)

        expect(fn).toHaveBeenCalledTimes(1) // Trailing call cancelled
    })

    it('should reset state on cancel', () => {
        const fn = jest.fn()
        const throttled = throttle(fn, 1000)

        throttled()
        expect(fn).toHaveBeenCalledTimes(1)

        throttled.cancel()

        throttled()
        expect(fn).toHaveBeenCalledTimes(2) // Executes immediately after cancel
    })

    it('should work with zero wait time', () => {
        const fn = jest.fn()
        const throttled = throttle(fn, 0)

        throttled()
        expect(fn).toHaveBeenCalledTimes(1)

        // Need to advance time so Date.now() changes
        jest.advanceTimersByTime(1)

        throttled()
        expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should handle multiple rapid calls correctly', () => {
        const fn = jest.fn()
        const throttled = throttle(fn, 1000)

        for (let i = 0; i < 10; i++) {
            throttled()
        }

        expect(fn).toHaveBeenCalledTimes(1)

        jest.advanceTimersByTime(1000)
        for (let i = 0; i < 10; i++) {
            throttled()
        }

        expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should work with both leading and trailing enabled', () => {
        const fn = jest.fn((x: number) => x)
        const throttled = throttle(fn, 1000, { leading: true, trailing: true })

        throttled(1) // Leading
        expect(fn).toHaveBeenCalledTimes(1)
        expect(fn).toHaveBeenCalledWith(1)

        throttled(2)
        throttled(3)

        jest.advanceTimersByTime(1000)

        expect(fn).toHaveBeenCalledTimes(2)
        expect(fn).toHaveBeenCalledWith(3) // Trailing with last args
    })

    it('should handle functions that throw errors', () => {
        const fn = jest.fn(() => {
            throw new Error('Test error')
        })
        const throttled = throttle(fn, 1000)

        expect(() => throttled()).toThrow('Test error')
        expect(() => throttled()).not.toThrow() // Throttled, doesn't execute
    })

    it('should maintain separate throttle state for different instances', () => {
        const fn1 = jest.fn()
        const fn2 = jest.fn()
        const throttled1 = throttle(fn1, 1000)
        const throttled2 = throttle(fn2, 1000)

        throttled1()
        throttled2()

        expect(fn1).toHaveBeenCalledTimes(1)
        expect(fn2).toHaveBeenCalledTimes(1)
    })

    it('should preserve this context when called as method', () => {
        const obj = {
            value: 10,
            method: jest.fn(function (this: any, x: number) {
                return this.value * x
            }),
        }

        const throttled = throttle(obj.method.bind(obj), 1000)
        const result = throttled(5)

        expect(result).toBe(50)
        expect(obj.method).toHaveBeenCalledWith(5)
    })

    it('should not execute trailing call if no calls made during throttle', () => {
        const fn = jest.fn()
        const throttled = throttle(fn, 1000, { trailing: true })

        throttled()
        expect(fn).toHaveBeenCalledTimes(1)

        jest.advanceTimersByTime(1000)
        expect(fn).toHaveBeenCalledTimes(1) // No trailing call
    })

    it('should work with very long wait times', () => {
        const fn = jest.fn()
        const throttled = throttle(fn, 60000) // 1 minute

        throttled()
        expect(fn).toHaveBeenCalledTimes(1)

        jest.advanceTimersByTime(59999)
        throttled()
        expect(fn).toHaveBeenCalledTimes(1)

        jest.advanceTimersByTime(1)
        throttled()
        expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should handle mixed argument types', () => {
        const fn = jest.fn((a: number, b: string, c: boolean) => ({ a, b, c }))
        const throttled = throttle(fn, 1000)

        throttled(1, 'test', true)
        expect(fn).toHaveBeenCalledWith(1, 'test', true)
    })

    it('should return undefined when leading=false and no execution yet', () => {
        const fn = jest.fn((x: number) => x * 2)
        const throttled = throttle(fn, 1000, { leading: false })

        const result = throttled(5)
        expect(result).toBeUndefined()
    })
})
