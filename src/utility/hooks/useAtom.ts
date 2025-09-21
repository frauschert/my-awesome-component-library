import { useCallback, useSyncExternalStore } from 'react'
import { Atom } from '../atom'

export function useAtom<AtomType>(atom: Atom<AtomType>) {
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

export function useAtomValue<AtomType>(atom: Atom<AtomType>) {
    const subscribe = useCallback(
        (onStoreChange: () => void) =>
            atom.subscribe(onStoreChange as any, false),
        [atom]
    )
    const getSnapshot = useCallback(() => atom.get(), [atom])
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
