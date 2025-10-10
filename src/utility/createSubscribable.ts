/**
 * Creates a simple publish-subscribe (pub/sub) event emitter.
 * Subscribers can listen for messages of a specific type, and publishers can broadcast messages to all subscribers.
 *
 * @template MessageType - The type of messages that can be published and received
 * @returns An object with subscribe and publish methods
 *
 * @example
 * // Create a subscribable for string messages
 * const messageBus = createSubscribable<string>();
 *
 * // Subscribe to messages
 * const unsubscribe = messageBus.subscribe((msg) => {
 *   console.log('Received:', msg);
 * });
 *
 * // Publish a message
 * messageBus.publish('Hello World'); // Logs: "Received: Hello World"
 *
 * // Unsubscribe
 * unsubscribe();
 *
 * @example
 * // With typed messages
 * type UserEvent = { type: 'login' | 'logout'; userId: string };
 * const userEvents = createSubscribable<UserEvent>();
 *
 * userEvents.subscribe((event) => {
 *   console.log(`User ${event.userId} ${event.type}`);
 * });
 *
 * userEvents.publish({ type: 'login', userId: '123' });
 */
export function createSubscribable<MessageType>(options?: {
    onError?: (error: Error, subscriber: (msg: MessageType) => void) => void
}) {
    const subscribers: Set<(msg: MessageType) => void> = new Set()

    /**
     * Subscribe to messages. Returns an unsubscribe function.
     *
     * @param cb - Callback function that receives published messages
     * @returns A function to unsubscribe this callback
     */
    function subscribe(cb: (msg: MessageType) => void): () => void {
        subscribers.add(cb)
        return () => subscribers.delete(cb)
    }

    /**
     * Publish a message to all subscribers.
     * If error handling is enabled, errors in individual subscribers won't stop other subscribers from receiving the message.
     *
     * @param msg - The message to publish to all subscribers
     */
    function publish(msg: MessageType): void {
        subscribers.forEach((cb) => {
            if (options?.onError) {
                try {
                    cb(msg)
                } catch (error) {
                    options.onError(
                        error instanceof Error
                            ? error
                            : new Error(String(error)),
                        cb
                    )
                }
            } else {
                cb(msg)
            }
        })
    }

    return {
        subscribe,
        publish,
    }
}
