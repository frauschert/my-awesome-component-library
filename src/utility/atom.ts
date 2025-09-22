export interface ReadOnlyAtom<AtomType> {
    get: () => AtomType
    subscribe: (
        callback: (newValue: AtomType) => void,
        notifyImmediately?: boolean
    ) => () => void
    _subscribers: () => number
}

export interface WritableAtom<AtomType> extends ReadOnlyAtom<AtomType> {
    set: (next: AtomType | ((prev: AtomType) => AtomType)) => void
    reset: () => void
}

type AtomGetter<AtomType> = (get: <T>(a: ReadOnlyAtom<T>) => T) => AtomType

export function atom<AtomType>(initialValue: AtomType): WritableAtom<AtomType>
export function atom<AtomType>(
    initialValue: AtomGetter<AtomType>
): ReadOnlyAtom<AtomType>
export function atom<AtomType>(
    initialValue: AtomType | AtomGetter<AtomType>
): WritableAtom<AtomType> | ReadOnlyAtom<AtomType> {
    const isDerived = typeof initialValue === 'function'
    const initialPrimitiveValue = (
        isDerived ? undefined : (initialValue as AtomType)
    ) as AtomType
    let value: AtomType = isDerived
        ? (undefined as unknown as AtomType)
        : (initialValue as AtomType)

    const subscribers = new Set<(newValue: AtomType) => void>()
    // Track current dependencies and their unsubscribe functions for derived atoms
    let dependencyMap = new Map<ReadOnlyAtom<any>, () => void>()
    let hasActiveDeps = false

    // Coalesced recompute state
    const recomputeState = { computing: false, scheduled: false, dirty: false }
    let notifiedThisTick = false

    function scheduleRecompute() {
        if (recomputeState.computing) {
            recomputeState.dirty = true
            if (!recomputeState.scheduled) {
                recomputeState.scheduled = true
                queueMicrotask(() => {
                    recomputeState.scheduled = false
                    if (recomputeState.dirty && !recomputeState.computing) {
                        recomputeState.dirty = false
                        computeValue(!notifiedThisTick)
                    }
                    notifiedThisTick = false
                })
            }
            return
        }
        if (!notifiedThisTick) {
            computeValue(true)
            notifiedThisTick = true
            if (!recomputeState.scheduled) {
                recomputeState.scheduled = true
                queueMicrotask(() => {
                    recomputeState.scheduled = false
                    if (recomputeState.dirty && !recomputeState.computing) {
                        recomputeState.dirty = false
                        computeValue(false)
                    }
                    notifiedThisTick = false
                })
            }
        } else {
            recomputeState.dirty = true
            if (!recomputeState.scheduled) {
                recomputeState.scheduled = true
                queueMicrotask(() => {
                    recomputeState.scheduled = false
                    if (recomputeState.dirty && !recomputeState.computing) {
                        recomputeState.dirty = false
                        computeValue(false)
                    }
                    notifiedThisTick = false
                })
            }
        }
    }

    function computeValue(notifySubscribers: boolean) {
        if (isDerived) {
            recomputeState.computing = true
            let changed = false
            // Track new dependencies for this computation
            const newDependencies = new Set<ReadOnlyAtom<any>>()
            const get = <T>(a: ReadOnlyAtom<T>): T => {
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
                recomputeState.computing = false
            }
            if (hasActiveDeps) {
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
                        const unsub = dep.subscribe(
                            () => scheduleRecompute(),
                            false
                        )
                        dependencyMap.set(dep, unsub)
                    }
                }
            } else {
                // If no active subscribers, don't maintain subscriptions; we still recomputed on demand
                if (dependencyMap.size) {
                    for (const [, unsub] of dependencyMap) unsub()
                    dependencyMap.clear()
                }
            }
            // Only notify if value actually changed
            if (changed && notifySubscribers) {
                subscribers.forEach((cb) => cb(value))
            }
            // Drain any coalesced pending work
            if (recomputeState.dirty) {
                recomputeState.dirty = false
                // Guard against tight loops by scheduling the next pass
                queueMicrotask(() => scheduleRecompute())
            }
        } else {
            subscribers.forEach((cb) => cb(value))
        }
    }

    // Initialize derived value once
    if (isDerived) computeValue(false)

    const base: ReadOnlyAtom<AtomType> = {
        get: () => {
            // For derived atoms, recompute on demand. If there are no subscribers,
            // we avoid maintaining dependency subscriptions.
            if (isDerived) computeValue(subscribers.size > 0)
            return value
        },
        subscribe: (
            callback: (newValue: AtomType) => void,
            notifyImmediately: boolean = true
        ) => {
            subscribers.add(callback)
            const firstSubscriber = subscribers.size === 1
            if (isDerived && firstSubscriber && !hasActiveDeps) {
                // Turn on dependency tracking subscriptions now that we have listeners
                hasActiveDeps = true
                computeValue(false)
            }
            if (notifyImmediately) {
                callback(value)
            }
            return () => {
                subscribers.delete(callback)
                const noSubscribers = subscribers.size === 0
                if (isDerived && noSubscribers && hasActiveDeps) {
                    // Tear down dependency subscriptions when last subscriber leaves
                    hasActiveDeps = false
                    if (dependencyMap.size) {
                        for (const [, unsub] of dependencyMap) unsub()
                        dependencyMap.clear()
                    }
                }
            }
        },
        _subscribers: () => subscribers.size,
    }
    if (isDerived) {
        // Expose a throwing setter at runtime for compatibility, but omit in type
        return Object.assign({}, base, {
            set: (/* newValue: AtomType */) => {
                throw new Error('Cannot set value of derived atom')
            },
        }) as unknown as ReadOnlyAtom<AtomType>
    }
    return Object.assign({}, base, {
        set: (next: AtomType | ((prev: AtomType) => AtomType)) => {
            const newValue =
                typeof next === 'function'
                    ? (next as (prev: AtomType) => AtomType)(value)
                    : next
            value = newValue
            subscribers.forEach((cb) => cb(value))
        },
        reset: () => {
            value = initialPrimitiveValue
            subscribers.forEach((cb) => cb(value))
        },
    }) as WritableAtom<AtomType>
}
