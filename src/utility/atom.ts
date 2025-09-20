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
    // Track current dependencies and their unsubscribe functions for derived atoms
    let dependencyMap = new Map<Atom<any>, () => void>()
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
            for (const [dep, unsub] of dependencyMap.entries()) {
                if (!newDependencies.has(dep)) {
                    unsub()
                    dependencyMap.delete(dep)
                }
            }
            // Subscribe to new dependencies
            for (const dep of newDependencies) {
                if (!dependencyMap.has(dep)) {
                    const unsub = dep.subscribe(computeValue, false)
                    dependencyMap.set(dep, unsub)
                }
            }
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
        get: () => {
            if (isDerived) {
                computeValue()
            }
            return value
        },
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
