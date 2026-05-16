import { createSubscribable } from '../createSubscribable'

describe('createSubscribable', () => {
    it('should notify subscribers when message is published', () => {
        const bus = createSubscribable<string>()
        const received: string[] = []

        bus.subscribe((msg) => received.push(msg))
        bus.publish('hello')
        bus.publish('world')

        expect(received).toEqual(['hello', 'world'])
    })

    it('should support multiple subscribers', () => {
        const bus = createSubscribable<number>()
        const results1: number[] = []
        const results2: number[] = []

        bus.subscribe((msg) => results1.push(msg))
        bus.subscribe((msg) => results2.push(msg * 2))

        bus.publish(5)

        expect(results1).toEqual([5])
        expect(results2).toEqual([10])
    })

    it('should return unsubscribe function', () => {
        const bus = createSubscribable<string>()
        const received: string[] = []

        const unsubscribe = bus.subscribe((msg) => received.push(msg))

        bus.publish('before')
        unsubscribe()
        bus.publish('after')

        expect(received).toEqual(['before'])
    })

    it('should handle multiple unsubscribes safely', () => {
        const bus = createSubscribable<string>()
        const received: string[] = []

        const unsubscribe = bus.subscribe((msg) => received.push(msg))

        unsubscribe()
        unsubscribe() // Should not throw

        bus.publish('test')
        expect(received).toEqual([])
    })

    it('should not add duplicate subscribers', () => {
        const bus = createSubscribable<string>()
        let callCount = 0

        const callback = () => {
            callCount++
        }

        bus.subscribe(callback)
        bus.subscribe(callback) // Same function reference

        bus.publish('test')

        expect(callCount).toBe(1) // Called only once
    })

    it('should maintain subscriber insertion order', () => {
        const bus = createSubscribable<string>()
        const order: number[] = []

        bus.subscribe(() => order.push(1))
        bus.subscribe(() => order.push(2))
        bus.subscribe(() => order.push(3))

        bus.publish('test')

        expect(order).toEqual([1, 2, 3])
    })

    it('should work with complex message types', () => {
        type Event = {
            type: 'login' | 'logout'
            userId: string
            timestamp: number
        }
        const bus = createSubscribable<Event>()
        const events: Event[] = []

        bus.subscribe((event) => events.push(event))

        const loginEvent: Event = {
            type: 'login',
            userId: '123',
            timestamp: Date.now(),
        }
        bus.publish(loginEvent)

        expect(events).toEqual([loginEvent])
        expect(events[0].type).toBe('login')
    })

    it('should handle no subscribers gracefully', () => {
        const bus = createSubscribable<string>()

        expect(() => bus.publish('test')).not.toThrow()
    })

    it('should allow subscribing during publish', () => {
        const bus = createSubscribable<string>()
        const received: string[] = []

        bus.subscribe((msg) => {
            received.push(msg)
            if (msg === 'first') {
                bus.subscribe((m) => received.push(`nested-${m}`))
            }
        })

        bus.publish('first')
        bus.publish('second')

        expect(received).toEqual([
            'first',
            'nested-first',
            'second',
            'nested-second',
        ])
    })

    it('should handle unsubscribe during publish', () => {
        const bus = createSubscribable<string>()
        const received: string[] = []
        const unsubscribeHolder: { fn?: () => void } = {}

        unsubscribeHolder.fn = bus.subscribe((msg) => {
            received.push(msg)
            if (msg === 'stop') {
                unsubscribeHolder.fn?.()
            }
        })

        bus.publish('first')
        bus.publish('stop')
        bus.publish('after')

        expect(received).toEqual(['first', 'stop'])
    })

    describe('with error handling', () => {
        it('should call onError when subscriber throws', () => {
            const errors: Error[] = []
            const bus = createSubscribable<string>({
                onError: (error) => errors.push(error),
            })

            bus.subscribe(() => {
                throw new Error('Test error')
            })

            bus.publish('test')

            expect(errors).toHaveLength(1)
            expect(errors[0].message).toBe('Test error')
        })

        it('should continue notifying other subscribers after error', () => {
            const errors: Error[] = []
            const received: string[] = []
            const bus = createSubscribable<string>({
                onError: (error) => errors.push(error),
            })

            bus.subscribe(() => {
                throw new Error('Subscriber 1 error')
            })
            bus.subscribe((msg) => received.push(msg))
            bus.subscribe(() => {
                throw new Error('Subscriber 3 error')
            })
            bus.subscribe((msg) => received.push(`${msg}-2`))

            bus.publish('test')

            expect(errors).toHaveLength(2)
            expect(received).toEqual(['test', 'test-2'])
        })

        it('should provide subscriber callback in error handler', () => {
            let errorCallback: ((msg: string) => void) | undefined
            const failingCallback = () => {
                throw new Error('fail')
            }

            const bus = createSubscribable<string>({
                onError: (_error, subscriber) => {
                    errorCallback = subscriber
                },
            })

            bus.subscribe(failingCallback)
            bus.publish('test')

            expect(errorCallback).toBe(failingCallback)
        })

        it('should convert non-Error throws to Error', () => {
            const errors: Error[] = []
            const bus = createSubscribable<string>({
                onError: (error) => errors.push(error),
            })

            bus.subscribe(() => {
                throw 'string error'
            })

            bus.publish('test')

            expect(errors[0]).toBeInstanceOf(Error)
            expect(errors[0].message).toBe('string error')
        })
    })

    describe('without error handling', () => {
        it('should throw and stop execution when subscriber throws', () => {
            const bus = createSubscribable<string>()
            const received: string[] = []

            bus.subscribe(() => {
                throw new Error('Test error')
            })
            bus.subscribe((msg) => received.push(msg)) // Won't be called

            expect(() => bus.publish('test')).toThrow('Test error')
            expect(received).toEqual([])
        })
    })
})
