import { useCallback, useSyncExternalStore, useRef } from 'react'
import type { ReadOnlyAtom, WritableAtom } from '../atom'

export function useAtom<AtomType>(atom: WritableAtom<AtomType>) {
    const subscribe = useCallback(
        (onStoreChange: () => void) =>
            atom.subscribe(onStoreChange as any, false),
        [atom]
    )
    const getSnapshot = useCallback(() => atom.get(), [atom])
    // For SSR, server snapshot is same as client getter
    const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
    return [value, atom.set] as const
}

export function useAtomValue<AtomType>(
    atom: ReadOnlyAtom<AtomType> | WritableAtom<AtomType>
) {
    const subscribe = useCallback(
        (onStoreChange: () => void) =>
            atom.subscribe(onStoreChange as any, false),
        [atom]
    )
    const getSnapshot = useCallback(() => atom.get(), [atom])
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export function useSetAtom<AtomType>(atom: WritableAtom<AtomType>) {
    return atom.set
}

export function useResetAtom<AtomType>(atom: WritableAtom<AtomType>) {
    return atom.reset
}

export function useAtomSelector<AtomType, Selected>(
    atom: ReadOnlyAtom<AtomType> | WritableAtom<AtomType>,
    selector: (value: AtomType) => Selected,
    equals: (a: Selected, b: Selected) => boolean = Object.is
) {
    const prevRef = useRef<Selected | undefined>(undefined)
    const subscribe = useCallback(
        (onStoreChange: () => void) =>
            atom.subscribe(onStoreChange as any, false),
        [atom]
    )
    const getSnapshot = useCallback(() => {
        const next = selector(atom.get())
        const prev = prevRef.current
        if (prev !== undefined && equals(prev, next)) {
            return prev
        }
        prevRef.current = next
        return next
    }, [atom, selector, equals])
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
