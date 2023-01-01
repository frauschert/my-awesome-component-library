export function createSubscribable<MessageType>() {
    const subscribers: Set<(msg: MessageType) => void> = new Set()

    function subscribe(cb: (msg: MessageType) => void): () => void {
        subscribers.add(cb)
        return () => subscribers.delete(cb)
    }

    function publish(msg: MessageType): void {
        subscribers.forEach((cb) => cb(msg))
    }

    return {
        subscribe,
        publish,
    }
}
