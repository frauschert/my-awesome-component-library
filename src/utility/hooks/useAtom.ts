import { useState, useEffect } from 'react'
import { Atom } from '../atom'

export function useAtom<AtomType>(atom: Atom<AtomType>) {
    const [value, setValue] = useState(atom.get())

    useEffect(() => {
        const unsubscribe = atom.subscribe(setValue)
        return () => {
            unsubscribe()
        }
    }, [atom])

    return [value, atom.set] as const
}

export function useAtomValue<AtomType>(atom: Atom<AtomType>) {
    const [value] = useAtom(atom)
    return value
}
