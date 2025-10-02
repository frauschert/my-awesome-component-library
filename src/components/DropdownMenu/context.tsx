import { createContext, useContext } from 'react'
import { DropdownContextValue } from './types'

export const DropdownContext = createContext<DropdownContextValue | null>(null)

export function useDropdown() {
    const context = useContext(DropdownContext)
    if (!context) {
        throw new Error('useDropdown must be used within a DropdownMenu')
    }
    return context
}
