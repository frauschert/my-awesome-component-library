import { ReactNode } from 'react'

export type Position = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
export type ToastItem = {
    id: string
    position?: Position
    content: ReactNode
}

export type ToastItemWithoutId = Omit<ToastItem, 'id'>
