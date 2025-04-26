export interface Atom<AtomType> {
    get: () => AtomType
    set: (newValue: AtomType) => void
    subscribe: (
        callback: (newValue: AtomType) => void,
        notifyImmediately?: boolean
    ) => () => void
    _subscribers: () => number
}

type AtomGetter<AtomType> = (get: <T>(a: Atom<T>) => T) => AtomType

export function atom<AtomType>(
    initialValue: AtomType | AtomGetter<AtomType>
): Atom<AtomType> {
    let value: AtomType =
        typeof initialValue === 'function' ? (undefined as any) : initialValue

    const subscribers = new Set<(newValue: AtomType) => void>()
    let dependencies = new Set<Atom<any>>()
    let unsubscribers: Array<() => void> = []
    const isDerived = typeof initialValue === 'function'

    function computeValue() {
        if (isDerived) {
            // Circular dependency protection
            if ((computeValue as any)._computing) {
                throw new Error('Circular dependency detected in atom')
            }
            ;(computeValue as any)._computing = true
            let changed = false
            // Track new dependencies for this computation
            const newDependencies = new Set<Atom<any>>()
            const get = <T>(a: Atom<T>): T => {
                newDependencies.add(a)
                return a.get()
            }
            try {
                const newValue = (initialValue as AtomGetter<AtomType>)(get)
                if (value !== newValue) {
                    value = newValue
                    changed = true
                }
            } finally {
                ;(computeValue as any)._computing = false
            }
            // Unsubscribe from dependencies that are no longer needed
            unsubscribers.forEach((unsub, i) => {
                const dep = Array.from(dependencies)[i]
                if (dep && !newDependencies.has(dep)) {
                    unsub()
                }
            })
            // Subscribe to new dependencies
            const newUnsubscribers: Array<() => void> = []
            newDependencies.forEach((dep) => {
                if (!dependencies.has(dep)) {
                    newUnsubscribers.push(dep.subscribe(computeValue, false))
                } else {
                    // Keep the old unsubscriber if still needed
                    const idx = Array.from(dependencies).indexOf(dep)
                    if (idx !== -1) {
                        newUnsubscribers[idx] = unsubscribers[idx]
                    }
                }
            })
            dependencies = newDependencies
            unsubscribers = newUnsubscribers
            // Only notify if value actually changed
            if (changed) {
                subscribers.forEach((cb) => cb(value))
            }
        } else {
            subscribers.forEach((cb) => cb(value))
        }
    }

    if (isDerived) {
        computeValue()
    }

    return {
        get: () => value,
        set: (newValue) => {
            if (isDerived) {
                throw new Error('Cannot set value of derived atom')
            }
            value = newValue
            subscribers.forEach((cb) => cb(value))
        },
        subscribe: (callback, notifyImmediately = true) => {
            subscribers.add(callback)
            if (notifyImmediately) {
                callback(value)
            }
            return () => {
                subscribers.delete(callback)
            }
        },
        _subscribers: () => subscribers.size,
    }
}
